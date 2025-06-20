/*!
*   Hugo Theme Stack - GitHub Authentication & Token Management
*
*   @author: Alex (Engineer)
*   @project: Hugo Blog GitHub Integration
*   @description: GitHub authentication and secure token management
*/

import {
    GitHubUser,
    GitHubAuthConfig,
    TokenInfo,
    TokenValidationResult,
    GitHubEventDetail,
    GitHubAPIError
} from './github-types.js';

/**
 * GitHub Token Manager
 * Handles secure storage and management of GitHub tokens
 */
export class GitHubTokenManager {
    private readonly storageKey = 'github_token_info';
    private readonly encryptionKey = 'github_blog_integration';
    private tokenInfo: TokenInfo | null = null;

    constructor() {
        this.loadTokenFromStorage();
    }

    /**
     * Store GitHub token securely
     */
    public setToken(token: string, type: TokenInfo['type'] = 'personal', scopes?: string[]): void {
        const tokenInfo: TokenInfo = {
            token: this.encryptToken(token),
            type,
            scopes,
            createdAt: new Date(),
            lastUsed: new Date()
        };

        this.tokenInfo = tokenInfo;
        this.saveTokenToStorage();
        this.dispatchEvent('auth', 'token_stored', { type, scopes });
    }

    /**
     * Get stored GitHub token
     */
    public getToken(): string | null {
        if (!this.tokenInfo) {
            return null;
        }

        // Update last used timestamp
        this.tokenInfo.lastUsed = new Date();
        this.saveTokenToStorage();

        return this.decryptToken(this.tokenInfo.token);
    }

    /**
     * Check if token exists
     */
    public hasToken(): boolean {
        return this.tokenInfo !== null && this.tokenInfo.token.length > 0;
    }

    /**
     * Get token information (without the actual token)
     */
    public getTokenInfo(): Omit<TokenInfo, 'token'> | null {
        if (!this.tokenInfo) {
            return null;
        }

        const { token, ...info } = this.tokenInfo;
        return info;
    }

    /**
     * Clear stored token
     */
    public clearToken(): void {
        this.tokenInfo = null;
        localStorage.removeItem(this.storageKey);
        this.dispatchEvent('auth', 'token_cleared');
    }

    /**
     * Validate token with GitHub API
     */
    public async validateToken(): Promise<TokenValidationResult> {
        const token = this.getToken();
        if (!token) {
            return {
                valid: false,
                error: 'No token available'
            };
        }

        try {
            const response = await fetch('https://api.github.com/user', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'User-Agent': 'Hugo-Blog-Integration/1.0'
                }
            });

            if (!response.ok) {
                throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
            }

            const user: GitHubUser = await response.json();
            const scopes = response.headers.get('X-OAuth-Scopes')?.split(', ') || [];
            
            // Extract rate limit info
            const rateLimit = {
                limit: parseInt(response.headers.get('X-RateLimit-Limit') || '0'),
                remaining: parseInt(response.headers.get('X-RateLimit-Remaining') || '0'),
                reset: parseInt(response.headers.get('X-RateLimit-Reset') || '0'),
                used: parseInt(response.headers.get('X-RateLimit-Used') || '0'),
                resource: 'core'
            };

            this.dispatchEvent('auth', 'token_validated', { user, scopes, rateLimit });

            return {
                valid: true,
                user,
                scopes,
                rateLimit
            };

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            this.dispatchEvent('auth', 'token_validation_failed', { error: errorMessage });

            return {
                valid: false,
                error: errorMessage
            };
        }
    }

    /**
     * Check if token has required scopes
     */
    public hasRequiredScopes(requiredScopes: string[]): boolean {
        if (!this.tokenInfo?.scopes) {
            return false;
        }

        return requiredScopes.every(scope => 
            this.tokenInfo!.scopes!.includes(scope)
        );
    }

    /**
     * Simple encryption for token storage
     * Note: This is basic obfuscation, not cryptographically secure
     */
    private encryptToken(token: string): string {
        let encrypted = '';
        for (let i = 0; i < token.length; i++) {
            const charCode = token.charCodeAt(i) ^ this.encryptionKey.charCodeAt(i % this.encryptionKey.length);
            encrypted += String.fromCharCode(charCode);
        }
        return btoa(encrypted);
    }

    /**
     * Decrypt token from storage
     */
    private decryptToken(encryptedToken: string): string {
        try {
            const encrypted = atob(encryptedToken);
            let decrypted = '';
            for (let i = 0; i < encrypted.length; i++) {
                const charCode = encrypted.charCodeAt(i) ^ this.encryptionKey.charCodeAt(i % this.encryptionKey.length);
                decrypted += String.fromCharCode(charCode);
            }
            return decrypted;
        } catch (error) {
            console.error('Failed to decrypt token:', error);
            return '';
        }
    }

    /**
     * Save token to localStorage
     */
    private saveTokenToStorage(): void {
        if (this.tokenInfo) {
            try {
                const serialized = JSON.stringify({
                    ...this.tokenInfo,
                    createdAt: this.tokenInfo.createdAt.toISOString(),
                    lastUsed: this.tokenInfo.lastUsed?.toISOString(),
                    expiresAt: this.tokenInfo.expiresAt?.toISOString()
                });
                localStorage.setItem(this.storageKey, serialized);
            } catch (error) {
                console.error('Failed to save token to storage:', error);
            }
        }
    }

    /**
     * Load token from localStorage
     */
    private loadTokenFromStorage(): void {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                const parsed = JSON.parse(stored);
                this.tokenInfo = {
                    ...parsed,
                    createdAt: new Date(parsed.createdAt),
                    lastUsed: parsed.lastUsed ? new Date(parsed.lastUsed) : undefined,
                    expiresAt: parsed.expiresAt ? new Date(parsed.expiresAt) : undefined
                };
            }
        } catch (error) {
            console.error('Failed to load token from storage:', error);
            this.clearToken();
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
 * GitHub OAuth Helper
 * Handles OAuth flow for GitHub authentication
 */
export class GitHubOAuth {
    private config: GitHubAuthConfig;
    private tokenManager: GitHubTokenManager;

    constructor(config: GitHubAuthConfig, tokenManager: GitHubTokenManager) {
        this.config = config;
        this.tokenManager = tokenManager;
    }

    /**
     * Start OAuth flow
     */
    public startOAuthFlow(): void {
        if (!this.config.clientId) {
            throw new Error('GitHub OAuth client ID not configured');
        }

        const params = new URLSearchParams({
            client_id: this.config.clientId,
            redirect_uri: this.config.redirectUri || window.location.origin,
            scope: (this.config.scope || ['repo', 'user']).join(' '),
            state: this.generateState()
        });

        const authUrl = `https://github.com/login/oauth/authorize?${params.toString()}`;
        window.location.href = authUrl;
    }

    /**
     * Handle OAuth callback
     */
    public async handleOAuthCallback(code: string, state: string): Promise<boolean> {
        try {
            // Verify state parameter
            const storedState = sessionStorage.getItem('github_oauth_state');
            if (state !== storedState) {
                throw new Error('Invalid OAuth state parameter');
            }

            // Exchange code for token
            const tokenResponse = await this.exchangeCodeForToken(code);
            
            if (tokenResponse.access_token) {
                this.tokenManager.setToken(tokenResponse.access_token, 'oauth', tokenResponse.scope?.split(','));
                sessionStorage.removeItem('github_oauth_state');
                return true;
            }

            return false;
        } catch (error) {
            console.error('OAuth callback error:', error);
            return false;
        }
    }

    /**
     * Generate secure state parameter
     */
    private generateState(): string {
        const state = Math.random().toString(36).substring(2, 15) + 
                     Math.random().toString(36).substring(2, 15);
        sessionStorage.setItem('github_oauth_state', state);
        return state;
    }

    /**
     * Exchange authorization code for access token
     */
    private async exchangeCodeForToken(code: string): Promise<any> {
        // Note: In a real implementation, this should be done server-side
        // for security reasons. This is a simplified client-side approach.
        const response = await fetch('https://github.com/login/oauth/access_token', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                client_id: this.config.clientId,
                client_secret: this.config.clientSecret,
                code: code
            })
        });

        if (!response.ok) {
            throw new Error(`Token exchange failed: ${response.status}`);
        }

        return await response.json();
    }
}

// Export singleton instance
export const githubTokenManager = new GitHubTokenManager();
