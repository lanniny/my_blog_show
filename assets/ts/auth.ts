/*!
*   Hugo Theme Stack - Authentication Module
*
*   @author: Emma (Product Manager)
*   @project: Hugo Blog Admin System
*   @description: Admin authentication and permission management
*/

type authStatus = 'authenticated' | 'guest';

interface AuthConfig {
    adminPassword: string;
    sessionTimeout: number; // in milliseconds
    maxLoginAttempts: number;
}

class StackAuth {
    private localStorageKey = 'StackAdminAuth';
    private attemptsKey = 'StackAuthAttempts';
    private timestampKey = 'StackAuthTimestamp';
    private currentStatus: authStatus;
    private config: AuthConfig;

    constructor(config?: Partial<AuthConfig>) {
        this.config = {
            adminPassword: 'admit',
            sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
            maxLoginAttempts: 5,
            ...config
        };
        
        this.currentStatus = this.getSavedAuthStatus();
        this.cleanupExpiredSession();
        this.dispatchAuthEvent(this.currentStatus);
    }

    /**
     * Authenticate user with password
     * @param password - The password to verify
     * @returns boolean - Authentication result
     */
    public authenticate(password: string): boolean {
        // Check if too many failed attempts
        if (this.isBlocked()) {
            this.dispatchAuthEvent('blocked');
            return false;
        }

        if (password === this.config.adminPassword) {
            this.currentStatus = 'authenticated';
            this.saveAuthStatus();
            this.clearLoginAttempts();
            this.dispatchAuthEvent('authenticated');
            return true;
        } else {
            this.incrementLoginAttempts();
            this.dispatchAuthEvent('failed');
            return false;
        }
    }

    /**
     * Logout current user
     */
    public logout(): void {
        this.currentStatus = 'guest';
        this.clearAuthData();
        this.dispatchAuthEvent('guest');
    }

    /**
     * Check if user is authenticated
     * @returns boolean - Authentication status
     */
    public isAuthenticated(): boolean {
        if (this.isSessionExpired()) {
            this.logout();
            return false;
        }
        return this.currentStatus === 'authenticated';
    }

    /**
     * Check if user is admin
     * @returns boolean - Admin status
     */
    public isAdmin(): boolean {
        return this.isAuthenticated();
    }

    /**
     * Get current authentication status
     * @returns authStatus - Current status
     */
    public getStatus(): authStatus {
        return this.currentStatus;
    }

    /**
     * Check if login attempts are blocked
     * @returns boolean - Block status
     */
    public isBlocked(): boolean {
        const attempts = this.getLoginAttempts();
        return attempts >= this.config.maxLoginAttempts;
    }

    /**
     * Get remaining login attempts
     * @returns number - Remaining attempts
     */
    public getRemainingAttempts(): number {
        const attempts = this.getLoginAttempts();
        return Math.max(0, this.config.maxLoginAttempts - attempts);
    }

    /**
     * Reset login attempts (for admin use)
     */
    public resetLoginAttempts(): void {
        this.clearLoginAttempts();
    }

    /**
     * Save authentication status to localStorage
     */
    private saveAuthStatus(): void {
        localStorage.setItem(this.localStorageKey, this.currentStatus);
        localStorage.setItem(this.timestampKey, Date.now().toString());
    }

    /**
     * Get saved authentication status from localStorage
     */
    private getSavedAuthStatus(): authStatus {
        const savedStatus = localStorage.getItem(this.localStorageKey);
        if (savedStatus === 'authenticated') {
            return 'authenticated';
        }
        return 'guest';
    }

    /**
     * Check if session is expired
     */
    private isSessionExpired(): boolean {
        const timestamp = localStorage.getItem(this.timestampKey);
        if (!timestamp) return true;
        
        const sessionTime = parseInt(timestamp);
        const currentTime = Date.now();
        return (currentTime - sessionTime) > this.config.sessionTimeout;
    }

    /**
     * Clean up expired session
     */
    private cleanupExpiredSession(): void {
        if (this.isSessionExpired()) {
            this.clearAuthData();
            this.currentStatus = 'guest';
        }
    }

    /**
     * Clear all authentication data
     */
    private clearAuthData(): void {
        localStorage.removeItem(this.localStorageKey);
        localStorage.removeItem(this.timestampKey);
    }

    /**
     * Get login attempts count
     */
    private getLoginAttempts(): number {
        const attempts = localStorage.getItem(this.attemptsKey);
        return attempts ? parseInt(attempts) : 0;
    }

    /**
     * Increment login attempts
     */
    private incrementLoginAttempts(): void {
        const attempts = this.getLoginAttempts() + 1;
        localStorage.setItem(this.attemptsKey, attempts.toString());
    }

    /**
     * Clear login attempts
     */
    private clearLoginAttempts(): void {
        localStorage.removeItem(this.attemptsKey);
    }

    /**
     * Dispatch authentication event
     */
    private dispatchAuthEvent(status: authStatus | 'failed' | 'blocked'): void {
        const event = new CustomEvent('onAuthStatusChange', {
            detail: {
                status: status,
                isAuthenticated: this.isAuthenticated(),
                isAdmin: this.isAdmin(),
                remainingAttempts: this.getRemainingAttempts()
            }
        });
        window.dispatchEvent(event);
    }
}

// Global authentication utilities
const AuthUtils = {
    /**
     * Show/hide elements based on authentication status
     */
    toggleAdminElements: (isAdmin: boolean): void => {
        const adminElements = document.querySelectorAll('[data-admin-only]');
        const guestElements = document.querySelectorAll('[data-guest-only]');

        adminElements.forEach(element => {
            (element as HTMLElement).style.display = isAdmin ? '' : 'none';
        });

        guestElements.forEach(element => {
            (element as HTMLElement).style.display = isAdmin ? 'none' : '';
        });
    },

    /**
     * Add admin class to body for CSS styling
     */
    updateBodyClass: (isAdmin: boolean): void => {
        if (isAdmin) {
            document.body.classList.add('admin-mode');
            document.body.classList.remove('guest-mode');
        } else {
            document.body.classList.add('guest-mode');
            document.body.classList.remove('admin-mode');
        }
    },

    /**
     * Create login modal HTML
     */
    createLoginModal: (): string => {
        return `
            <div id="admin-login-modal" class="admin-modal" style="display: none;">
                <div class="admin-modal-content">
                    <div class="admin-modal-header">
                        <h3>
                            <div class="admin-icon-wrapper">
                                <svg class="admin-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                    <circle cx="12" cy="16" r="1"></circle>
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                </svg>
                            </div>
                            <span class="admin-title-text">管理员登录</span>
                        </h3>
                        <button class="admin-modal-close" id="admin-modal-close" type="button" aria-label="关闭登录窗口">
                            <svg class="admin-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                    <div class="admin-modal-body">
                        <form id="admin-login-form" novalidate>
                            <div class="admin-form-group">
                                <label for="admin-password">
                                    <svg class="admin-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                        <circle cx="12" cy="16" r="1"></circle>
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                    </svg>
                                    管理员密码
                                </label>
                                <input
                                    type="password"
                                    id="admin-password"
                                    name="password"
                                    placeholder="请输入管理员密码"
                                    autocomplete="current-password"
                                    required
                                    aria-describedby="admin-login-error admin-login-attempts"
                                >
                            </div>
                            <div class="admin-form-actions">
                                <button type="submit" id="admin-login-btn" class="admin-btn admin-btn-primary">
                                    <svg class="admin-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                                        <polyline points="10,17 15,12 10,7"></polyline>
                                        <line x1="15" y1="12" x2="3" y2="12"></line>
                                    </svg>
                                    登录
                                </button>
                                <button type="button" id="admin-cancel-btn" class="admin-btn admin-btn-secondary">
                                    <svg class="admin-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                    </svg>
                                    取消
                                </button>
                            </div>
                            <div id="admin-login-error" class="admin-error" style="display: none;" role="alert" aria-live="polite">
                                <!-- Error message will be inserted here -->
                            </div>
                            <div id="admin-login-attempts" class="admin-info" style="display: none;" role="status" aria-live="polite">
                                <!-- Attempts info will be inserted here -->
                            </div>
                        </form>
                        <div class="admin-login-help">
                            <p class="admin-help-text">
                                <svg class="admin-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                                </svg>
                                提示：使用快捷键 <kbd>Ctrl + Alt + A</kbd> 可快速打开登录窗口
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Show login modal
     */
    showLoginModal: (): void => {
        const modal = document.getElementById('admin-login-modal');
        if (modal) {
            modal.style.display = 'flex';
            // Clear any previous error messages
            AuthUtils.clearMessages();
            // Focus management for accessibility
            setTimeout(() => {
                const passwordInput = document.getElementById('admin-password') as HTMLInputElement;
                if (passwordInput) {
                    passwordInput.focus();
                    passwordInput.select(); // Select any existing text
                }
            }, 150);
        } else {
            console.warn('Admin login modal not found. Creating modal...');
            // Recreate modal if it doesn't exist
            const modalHTML = AuthUtils.createLoginModal();
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            // Retry showing modal
            setTimeout(() => AuthUtils.showLoginModal(), 100);
        }
    },

    /**
     * Hide login modal
     */
    hideLoginModal: (): void => {
        const modal = document.getElementById('admin-login-modal');
        if (modal) {
            modal.style.display = 'none';
            // Clear form
            const form = document.getElementById('admin-login-form') as HTMLFormElement;
            if (form) {
                form.reset();
            }
            // Hide error messages
            const errorDiv = document.getElementById('admin-login-error');
            const attemptsDiv = document.getElementById('admin-login-attempts');
            if (errorDiv) errorDiv.style.display = 'none';
            if (attemptsDiv) attemptsDiv.style.display = 'none';
        }
    },

    /**
     * Show error message in login modal
     */
    showLoginError: (message: string): void => {
        const errorDiv = document.getElementById('admin-login-error');
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
        }
    },

    /**
     * Show attempts info in login modal
     */
    showAttemptsInfo: (remaining: number): void => {
        const attemptsDiv = document.getElementById('admin-login-attempts');
        if (attemptsDiv) {
            attemptsDiv.textContent = `剩余尝试次数: ${remaining}`;
            attemptsDiv.style.display = 'block';
        }
    },

    /**
     * Set login button loading state
     */
    setLoginButtonLoading: (loading: boolean): void => {
        const loginBtn = document.getElementById('admin-login-btn') as HTMLButtonElement;
        if (loginBtn) {
            if (loading) {
                loginBtn.disabled = true;
                loginBtn.classList.add('loading');
            } else {
                loginBtn.disabled = false;
                loginBtn.classList.remove('loading');
            }
        }
    },

    /**
     * Clear all error and info messages
     */
    clearMessages: (): void => {
        const errorDiv = document.getElementById('admin-login-error');
        const attemptsDiv = document.getElementById('admin-login-attempts');
        if (errorDiv) errorDiv.style.display = 'none';
        if (attemptsDiv) attemptsDiv.style.display = 'none';
    },

    /**
     * Validate password input
     */
    validatePassword: (password: string): { valid: boolean; message?: string } => {
        if (!password) {
            return { valid: false, message: '请输入密码' };
        }
        if (password.length < 1) {
            return { valid: false, message: '密码不能为空' };
        }
        return { valid: true };
    }
};

export default StackAuth;
export { AuthUtils, type authStatus, type AuthConfig };
