/*!
*   Hugo Theme Stack - GitHub API Types
*
*   @author: Alex (Engineer)
*   @project: Hugo Blog GitHub Integration
*   @description: TypeScript type definitions for GitHub API integration
*/

// GitHub API Response Types
export interface GitHubUser {
    login: string;
    id: number;
    avatar_url: string;
    name: string | null;
    email: string | null;
    bio: string | null;
    public_repos: number;
    followers: number;
    following: number;
    created_at: string;
    updated_at: string;
}

export interface GitHubRepository {
    id: number;
    name: string;
    full_name: string;
    description: string | null;
    private: boolean;
    html_url: string;
    clone_url: string;
    ssh_url: string;
    default_branch: string;
    created_at: string;
    updated_at: string;
    pushed_at: string;
    size: number;
    stargazers_count: number;
    watchers_count: number;
    forks_count: number;
    open_issues_count: number;
}

export interface GitHubContent {
    name: string;
    path: string;
    sha: string;
    size: number;
    url: string;
    html_url: string;
    git_url: string;
    download_url: string | null;
    type: 'file' | 'dir';
    content?: string; // Base64 encoded for files
    encoding?: string;
}

export interface GitHubCommit {
    sha: string;
    url: string;
    html_url: string;
    author: {
        name: string;
        email: string;
        date: string;
    };
    committer: {
        name: string;
        email: string;
        date: string;
    };
    message: string;
    tree: {
        sha: string;
        url: string;
    };
    parents: Array<{
        sha: string;
        url: string;
        html_url: string;
    }>;
}

export interface GitHubBranch {
    name: string;
    commit: {
        sha: string;
        url: string;
    };
    protected: boolean;
}

// GitHub API Request Types
export interface CreateFileRequest {
    message: string;
    content: string; // Base64 encoded
    branch?: string;
    committer?: {
        name: string;
        email: string;
    };
    author?: {
        name: string;
        email: string;
    };
}

export interface UpdateFileRequest extends CreateFileRequest {
    sha: string; // SHA of the file being replaced
}

export interface DeleteFileRequest {
    message: string;
    sha: string; // SHA of the file being deleted
    branch?: string;
    committer?: {
        name: string;
        email: string;
    };
    author?: {
        name: string;
        email: string;
    };
}

// GitHub API Configuration Types
export interface GitHubConfig {
    token: string;
    owner: string;
    repo: string;
    branch?: string;
    baseUrl?: string;
    timeout?: number;
    retryAttempts?: number;
    retryDelay?: number;
}

export interface GitHubAuthConfig {
    clientId?: string;
    clientSecret?: string;
    redirectUri?: string;
    scope?: string[];
}

// Rate Limiting Types
export interface RateLimitInfo {
    limit: number;
    remaining: number;
    reset: number; // Unix timestamp
    used: number;
    resource: string;
}

export interface RateLimitResponse {
    rate: RateLimitInfo;
    resources: {
        core: RateLimitInfo;
        search: RateLimitInfo;
        graphql: RateLimitInfo;
        integration_manifest: RateLimitInfo;
        source_import: RateLimitInfo;
        code_scanning_upload: RateLimitInfo;
        actions_runner_registration: RateLimitInfo;
        scim: RateLimitInfo;
    };
}

// Error Types
export interface GitHubError {
    message: string;
    documentation_url?: string;
    errors?: Array<{
        resource: string;
        field: string;
        code: string;
        message?: string;
    }>;
}

export interface GitHubAPIError extends Error {
    status: number;
    response?: GitHubError;
    headers?: Record<string, string>;
}

// API Response Wrapper Types
export interface GitHubAPIResponse<T = any> {
    data: T;
    status: number;
    headers: Record<string, string>;
    rateLimit?: RateLimitInfo;
}

export interface GitHubAPIListResponse<T = any> extends GitHubAPIResponse<T[]> {
    pagination?: {
        page: number;
        perPage: number;
        totalCount?: number;
        hasNext: boolean;
        hasPrev: boolean;
        nextUrl?: string;
        prevUrl?: string;
        lastUrl?: string;
        firstUrl?: string;
    };
}

// Repository Operation Types
export interface RepositoryOperationOptions {
    branch?: string;
    path?: string;
    recursive?: boolean;
    ref?: string;
}

export interface FileOperationResult {
    success: boolean;
    sha?: string;
    url?: string;
    content?: GitHubContent;
    commit?: GitHubCommit;
    error?: string;
}

export interface BatchOperationResult {
    success: boolean;
    results: FileOperationResult[];
    errors: string[];
    summary: {
        total: number;
        successful: number;
        failed: number;
    };
}

// Token Management Types
export interface TokenInfo {
    token: string;
    type: 'personal' | 'oauth' | 'app';
    scopes?: string[];
    expiresAt?: Date;
    createdAt: Date;
    lastUsed?: Date;
}

export interface TokenValidationResult {
    valid: boolean;
    user?: GitHubUser;
    scopes?: string[];
    rateLimit?: RateLimitInfo;
    error?: string;
}

// Event Types for GitHub Integration
export interface GitHubEventDetail {
    type: 'auth' | 'api' | 'upload' | 'download' | 'error';
    action: string;
    data?: any;
    error?: string;
    timestamp: number;
}

export type GitHubEventListener = (event: CustomEvent<GitHubEventDetail>) => void;

// Utility Types
export type GitHubAPIMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface RequestOptions {
    method: GitHubAPIMethod;
    headers?: Record<string, string>;
    body?: string;
    timeout?: number;
    retries?: number;
}
