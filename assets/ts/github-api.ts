/*!
*   Hugo Theme Stack - GitHub API Integration Core
*
*   @author: Alex (Engineer)
*   @project: Hugo Blog GitHub Integration
*   @description: Core GitHub API integration with rate limiting, error handling, and retry logic
*/

import {
    GitHubConfig,
    GitHubAPIResponse,
    GitHubAPIListResponse,
    GitHubAPIError,
    GitHubAPIMethod,
    RequestOptions,
    RateLimitInfo,
    GitHubEventDetail,
    GitHubUser,
    GitHubRepository,
    GitHubContent,
    CreateFileRequest,
    UpdateFileRequest,
    DeleteFileRequest,
    FileOperationResult
} from './github-types.js';

import { GitHubTokenManager, githubTokenManager } from './github-auth.js';

/**
 * Rate Limiter for GitHub API calls
 */
export class GitHubRateLimiter {
    private rateLimitInfo: RateLimitInfo | null = null;
    private requestQueue: Array<() => Promise<void>> = [];
    private isProcessingQueue = false;

    /**
     * Update rate limit information from API response
     */
    public updateRateLimit(headers: Record<string, string>): void {
        this.rateLimitInfo = {
            limit: parseInt(headers['x-ratelimit-limit'] || '0'),
            remaining: parseInt(headers['x-ratelimit-remaining'] || '0'),
            reset: parseInt(headers['x-ratelimit-reset'] || '0'),
            used: parseInt(headers['x-ratelimit-used'] || '0'),
            resource: headers['x-ratelimit-resource'] || 'core'
        };
    }

    /**
     * Check if we can make a request now
     */
    public canMakeRequest(): boolean {
        if (!this.rateLimitInfo) {
            return true; // No rate limit info yet, allow request
        }

        return this.rateLimitInfo.remaining > 0;
    }

    /**
     * Get time until rate limit reset (in milliseconds)
     */
    public getTimeUntilReset(): number {
        if (!this.rateLimitInfo) {
            return 0;
        }

        const resetTime = this.rateLimitInfo.reset * 1000; // Convert to milliseconds
        const currentTime = Date.now();
        return Math.max(0, resetTime - currentTime);
    }

    /**
     * Wait for rate limit reset if necessary
     */
    public async waitForRateLimit(): Promise<void> {
        if (this.canMakeRequest()) {
            return;
        }

        const waitTime = this.getTimeUntilReset();
        if (waitTime > 0) {
            console.log(`Rate limit exceeded. Waiting ${Math.ceil(waitTime / 1000)} seconds...`);
            await new Promise(resolve => setTimeout(resolve, waitTime + 1000)); // Add 1 second buffer
        }
    }

    /**
     * Add request to queue if rate limited
     */
    public async queueRequest<T>(requestFn: () => Promise<T>): Promise<T> {
        return new Promise((resolve, reject) => {
            this.requestQueue.push(async () => {
                try {
                    await this.waitForRateLimit();
                    const result = await requestFn();
                    resolve(result);
                } catch (error) {
                    reject(error);
                }
            });

            this.processQueue();
        });
    }

    /**
     * Process queued requests
     */
    private async processQueue(): Promise<void> {
        if (this.isProcessingQueue || this.requestQueue.length === 0) {
            return;
        }

        this.isProcessingQueue = true;

        while (this.requestQueue.length > 0) {
            const request = this.requestQueue.shift();
            if (request) {
                await request();
                // Small delay between requests to be respectful
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        }

        this.isProcessingQueue = false;
    }

    /**
     * Get current rate limit status
     */
    public getRateLimitStatus(): RateLimitInfo | null {
        return this.rateLimitInfo;
    }
}

/**
 * GitHub API Error Handler
 */
export class GitHubErrorHandler {
    /**
     * Create standardized GitHub API error
     */
    public static createError(status: number, message: string, response?: any, headers?: Record<string, string>): GitHubAPIError {
        const error = new Error(message) as GitHubAPIError;
        error.name = 'GitHubAPIError';
        error.status = status;
        error.response = response;
        error.headers = headers;
        return error;
    }

    /**
     * Handle API response errors
     */
    public static async handleResponse(response: Response): Promise<void> {
        if (!response.ok) {
            let errorData;
            try {
                errorData = await response.json();
            } catch {
                errorData = { message: response.statusText };
            }

            const headers: Record<string, string> = {};
            response.headers.forEach((value, key) => {
                headers[key] = value;
            });

            throw this.createError(
                response.status,
                errorData.message || `HTTP ${response.status}: ${response.statusText}`,
                errorData,
                headers
            );
        }
    }

    /**
     * Determine if error is retryable
     */
    public static isRetryableError(error: GitHubAPIError): boolean {
        // Retry on network errors, rate limits, and server errors
        return (
            error.status >= 500 || // Server errors
            error.status === 429 || // Rate limit
            error.status === 408 || // Request timeout
            error.status === 502 || // Bad gateway
            error.status === 503 || // Service unavailable
            error.status === 504    // Gateway timeout
        );
    }
}

/**
 * Core GitHub API Client
 */
export class GitHubAPI {
    private config: GitHubConfig;
    private tokenManager: GitHubTokenManager;
    private rateLimiter: GitHubRateLimiter;
    private baseUrl: string;

    constructor(config: Partial<GitHubConfig>, tokenManager?: GitHubTokenManager) {
        this.config = {
            token: '',
            owner: '',
            repo: '',
            branch: 'main',
            baseUrl: 'https://api.github.com',
            timeout: 30000,
            retryAttempts: 3,
            retryDelay: 1000,
            ...config
        };

        this.tokenManager = tokenManager || githubTokenManager;
        this.rateLimiter = new GitHubRateLimiter();
        this.baseUrl = this.config.baseUrl!;
    }

    /**
     * Make authenticated API request
     */
    public async request<T = any>(
        endpoint: string,
        options: Partial<RequestOptions> = {}
    ): Promise<GitHubAPIResponse<T>> {
        const token = this.config.token || this.tokenManager.getToken();
        if (!token) {
            throw GitHubErrorHandler.createError(401, 'No GitHub token available');
        }

        const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`;
        const requestOptions: RequestInit = {
            method: options.method || 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'Hugo-Blog-Integration/1.0',
                'Content-Type': 'application/json',
                ...options.headers
            },
            body: options.body,
            signal: AbortSignal.timeout(options.timeout || this.config.timeout!)
        };

        return this.rateLimiter.queueRequest(async () => {
            return this.executeRequestWithRetry(url, requestOptions, options.retries || this.config.retryAttempts!);
        });
    }

    /**
     * Execute request with retry logic
     */
    private async executeRequestWithRetry<T>(
        url: string,
        options: RequestInit,
        maxRetries: number
    ): Promise<GitHubAPIResponse<T>> {
        let lastError: GitHubAPIError | null = null;

        for (let attempt = 0; attempt <= maxRetries; attempt++) {
            try {
                const response = await fetch(url, options);
                
                // Update rate limit info
                const headers: Record<string, string> = {};
                response.headers.forEach((value, key) => {
                    headers[key] = value;
                });
                this.rateLimiter.updateRateLimit(headers);

                // Handle errors
                await GitHubErrorHandler.handleResponse(response);

                // Parse response
                const data: T = await response.json();

                // Dispatch success event
                this.dispatchEvent('api', 'request_success', {
                    url,
                    method: options.method,
                    status: response.status
                });

                return {
                    data,
                    status: response.status,
                    headers,
                    rateLimit: this.rateLimiter.getRateLimitStatus() || undefined
                };

            } catch (error) {
                lastError = error as GitHubAPIError;

                // Don't retry if it's not a retryable error or if it's the last attempt
                if (!GitHubErrorHandler.isRetryableError(lastError) || attempt === maxRetries) {
                    break;
                }

                // Wait before retry
                const delay = this.config.retryDelay! * Math.pow(2, attempt); // Exponential backoff
                await new Promise(resolve => setTimeout(resolve, delay));

                console.log(`Request failed, retrying in ${delay}ms... (attempt ${attempt + 1}/${maxRetries + 1})`);
            }
        }

        // Dispatch error event
        this.dispatchEvent('error', 'request_failed', {
            url,
            method: options.method,
            error: lastError?.message,
            status: lastError?.status
        });

        throw lastError;
    }

    /**
     * Get authenticated user information
     */
    public async getUser(): Promise<GitHubAPIResponse<GitHubUser>> {
        return this.request<GitHubUser>('/user');
    }

    /**
     * Get repository information
     */
    public async getRepository(owner?: string, repo?: string): Promise<GitHubAPIResponse<GitHubRepository>> {
        const repoOwner = owner || this.config.owner;
        const repoName = repo || this.config.repo;
        return this.request<GitHubRepository>(`/repos/${repoOwner}/${repoName}`);
    }

    /**
     * Get file content from repository
     */
    public async getFileContent(
        path: string,
        options: { owner?: string; repo?: string; ref?: string } = {}
    ): Promise<GitHubAPIResponse<GitHubContent>> {
        const owner = options.owner || this.config.owner;
        const repo = options.repo || this.config.repo;
        const ref = options.ref || this.config.branch;
        
        const endpoint = `/repos/${owner}/${repo}/contents/${path}${ref ? `?ref=${ref}` : ''}`;
        return this.request<GitHubContent>(endpoint);
    }

    /**
     * Create or update file in repository
     */
    public async createOrUpdateFile(
        path: string,
        content: string,
        message: string,
        options: {
            owner?: string;
            repo?: string;
            branch?: string;
            sha?: string; // Required for updates
            encoding?: 'utf-8' | 'base64';
        } = {}
    ): Promise<FileOperationResult> {
        try {
            const owner = options.owner || this.config.owner;
            const repo = options.repo || this.config.repo;
            const branch = options.branch || this.config.branch;
            const encoding = options.encoding || 'utf-8';

            // Encode content to base64 if needed
            const encodedContent = encoding === 'base64' ? content : btoa(unescape(encodeURIComponent(content)));

            const requestBody: CreateFileRequest | UpdateFileRequest = {
                message,
                content: encodedContent,
                branch,
                ...(options.sha && { sha: options.sha })
            };

            const endpoint = `/repos/${owner}/${repo}/contents/${path}`;
            const method = options.sha ? 'PUT' : 'PUT'; // GitHub uses PUT for both create and update

            const response = await this.request(endpoint, {
                method,
                body: JSON.stringify(requestBody)
            });

            this.dispatchEvent('api', 'file_operation_success', {
                operation: options.sha ? 'update' : 'create',
                path,
                sha: response.data.content?.sha
            });

            return {
                success: true,
                sha: response.data.content?.sha,
                url: response.data.content?.html_url,
                content: response.data.content,
                commit: response.data.commit
            };

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';

            this.dispatchEvent('error', 'file_operation_failed', {
                operation: options.sha ? 'update' : 'create',
                path,
                error: errorMessage
            });

            return {
                success: false,
                error: errorMessage
            };
        }
    }

    /**
     * Delete file from repository
     */
    public async deleteFile(
        path: string,
        sha: string,
        message: string,
        options: {
            owner?: string;
            repo?: string;
            branch?: string;
        } = {}
    ): Promise<FileOperationResult> {
        try {
            const owner = options.owner || this.config.owner;
            const repo = options.repo || this.config.repo;
            const branch = options.branch || this.config.branch;

            const requestBody: DeleteFileRequest = {
                message,
                sha,
                branch
            };

            const endpoint = `/repos/${owner}/${repo}/contents/${path}`;
            const response = await this.request(endpoint, {
                method: 'DELETE',
                body: JSON.stringify(requestBody)
            });

            this.dispatchEvent('api', 'file_operation_success', {
                operation: 'delete',
                path,
                sha
            });

            return {
                success: true,
                commit: response.data.commit
            };

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';

            this.dispatchEvent('error', 'file_operation_failed', {
                operation: 'delete',
                path,
                error: errorMessage
            });

            return {
                success: false,
                error: errorMessage
            };
        }
    }

    /**
     * List directory contents
     */
    public async listDirectoryContents(
        path: string = '',
        options: {
            owner?: string;
            repo?: string;
            ref?: string;
        } = {}
    ): Promise<GitHubAPIResponse<GitHubContent[]>> {
        const owner = options.owner || this.config.owner;
        const repo = options.repo || this.config.repo;
        const ref = options.ref || this.config.branch;

        const endpoint = `/repos/${owner}/${repo}/contents/${path}${ref ? `?ref=${ref}` : ''}`;
        return this.request<GitHubContent[]>(endpoint);
    }

    /**
     * Check if file exists in repository
     */
    public async fileExists(
        path: string,
        options: {
            owner?: string;
            repo?: string;
            ref?: string;
        } = {}
    ): Promise<{ exists: boolean; sha?: string; content?: GitHubContent }> {
        try {
            const response = await this.getFileContent(path, options);
            return {
                exists: true,
                sha: response.data.sha,
                content: response.data
            };
        } catch (error) {
            const apiError = error as GitHubAPIError;
            if (apiError.status === 404) {
                return { exists: false };
            }
            throw error;
        }
    }

    /**
     * Get rate limit status
     */
    public async getRateLimit(): Promise<GitHubAPIResponse<any>> {
        return this.request('/rate_limit');
    }

    /**
     * Test API connection and authentication
     */
    public async testConnection(): Promise<{
        success: boolean;
        user?: GitHubUser;
        rateLimit?: RateLimitInfo;
        error?: string;
    }> {
        try {
            const userResponse = await this.getUser();
            const rateLimitResponse = await this.getRateLimit();

            this.dispatchEvent('api', 'connection_test_success', {
                user: userResponse.data,
                rateLimit: userResponse.rateLimit
            });

            return {
                success: true,
                user: userResponse.data,
                rateLimit: userResponse.rateLimit
            };

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';

            this.dispatchEvent('error', 'connection_test_failed', {
                error: errorMessage
            });

            return {
                success: false,
                error: errorMessage
            };
        }
    }

    /**
     * Dispatch GitHub integration events
     */
    private dispatchEvent(type: GitHubEventDetail['type'], action: string, data?: any): void {
        const event = new CustomEvent('github-integration', {
            detail: {
                type,
                action,
                data,
                timestamp: Date.now()
            } as GitHubEventDetail
        });
        window.dispatchEvent(event);
    }
}

/**
 * Repository Manager
 * High-level repository operations
 */
export class GitHubRepositoryManager {
    private api: GitHubAPI;

    constructor(api: GitHubAPI) {
        this.api = api;
    }

    /**
     * Upload file to repository with automatic conflict resolution
     */
    public async uploadFile(
        path: string,
        content: string,
        message: string,
        options: {
            overwrite?: boolean;
            encoding?: 'utf-8' | 'base64';
        } = {}
    ): Promise<FileOperationResult> {
        try {
            // Check if file exists
            const existsResult = await this.api.fileExists(path);

            if (existsResult.exists && !options.overwrite) {
                return {
                    success: false,
                    error: 'File already exists and overwrite is disabled'
                };
            }

            // Create or update file
            return await this.api.createOrUpdateFile(path, content, message, {
                sha: existsResult.sha,
                encoding: options.encoding
            });

        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    /**
     * Download file from repository
     */
    public async downloadFile(path: string): Promise<{
        success: boolean;
        content?: string;
        encoding?: string;
        error?: string;
    }> {
        try {
            const response = await this.api.getFileContent(path);
            const content = response.data.content;
            const encoding = response.data.encoding;

            if (!content) {
                return {
                    success: false,
                    error: 'File content is empty'
                };
            }

            // Decode base64 content
            const decodedContent = encoding === 'base64'
                ? decodeURIComponent(escape(atob(content)))
                : content;

            return {
                success: true,
                content: decodedContent,
                encoding
            };

        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    /**
     * Batch upload multiple files
     */
    public async batchUpload(
        files: Array<{
            path: string;
            content: string;
            message?: string;
        }>,
        options: {
            overwrite?: boolean;
            encoding?: 'utf-8' | 'base64';
            defaultMessage?: string;
        } = {}
    ): Promise<{
        success: boolean;
        results: FileOperationResult[];
        summary: {
            total: number;
            successful: number;
            failed: number;
        };
    }> {
        const results: FileOperationResult[] = [];
        let successful = 0;
        let failed = 0;

        for (const file of files) {
            const message = file.message || options.defaultMessage || `Upload ${file.path}`;
            const result = await this.uploadFile(file.path, file.content, message, {
                overwrite: options.overwrite,
                encoding: options.encoding
            });

            results.push(result);

            if (result.success) {
                successful++;
            } else {
                failed++;
            }

            // Small delay between uploads to be respectful
            await new Promise(resolve => setTimeout(resolve, 200));
        }

        return {
            success: failed === 0,
            results,
            summary: {
                total: files.length,
                successful,
                failed
            }
        };
    }
}

// Export singleton instances
export const githubAPI = new GitHubAPI({});
export const githubRepositoryManager = new GitHubRepositoryManager(githubAPI);
