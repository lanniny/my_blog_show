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
        // Avoid infinite recursion by directly checking status instead of calling isAuthenticated()
        const isAuth = this.currentStatus === 'authenticated' && !this.isSessionExpired();
        const isAdminUser = isAuth;

        const event = new CustomEvent('onAuthStatusChange', {
            detail: {
                status: status,
                isAuthenticated: isAuth,
                isAdmin: isAdminUser,
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
            (element as HTMLElement).style.display = isAdmin ? 'block' : 'none';
        });

        guestElements.forEach(element => {
            (element as HTMLElement).style.display = isAdmin ? 'none' : 'block';
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
    },

    /**
     * Create admin panel HTML
     */
    createAdminPanel: (): string => {
        return `
            <div id="admin-panel-modal" class="admin-modal" style="display: none;">
                <div class="admin-panel-content">
                    <div class="admin-panel-header">
                        <h2>
                            <div class="admin-icon-wrapper">
                                <svg class="admin-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M12.22 2h-.44a2 2 0 00-2 2v.18a2 2 0 01-1 1.73l-.43.25a2 2 0 01-2 0l-.15-.08a2 2 0 00-2.73.73l-.22.38a2 2 0 00.73 2.73l.15.1a2 2 0 011 1.72v.51a2 2 0 01-1 1.74l-.15.09a2 2 0 00-.73 2.73l.22.38a2 2 0 002.73.73l.15-.08a2 2 0 012 0l.43.25a2 2 0 011 1.73V20a2 2 0 002 2h.44a2 2 0 002-2v-.18a2 2 0 011-1.73l.43-.25a2 2 0 012 0l.15.08a2 2 0 002.73-.73l.22-.39a2 2 0 00-.73-2.73l-.15-.08a2 2 0 01-1-1.74v-.5a2 2 0 011-1.74l.15-.09a2 2 0 00.73-2.73l-.22-.38a2 2 0 00-2.73-.73l-.15.08a2 2 0 01-2 0l-.43-.25a2 2 0 01-1-1.73V4a2 2 0 00-2-2z"></path>
                                    <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                            </div>
                            <span class="admin-title-text">管理员面板</span>
                        </h2>
                        <button class="admin-modal-close" id="admin-panel-close" type="button" aria-label="关闭管理面板">
                            <svg class="admin-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                    <div class="admin-panel-body">
                        <div class="admin-tabs">
                            <button class="admin-tab-btn active" data-tab="profile">个人资料</button>
                            <button class="admin-tab-btn" data-tab="content">内容管理</button>
                            <button class="admin-tab-btn" data-tab="settings">站点设置</button>
                        </div>
                        <div class="admin-tab-content">
                            <div id="admin-tab-profile" class="admin-tab-panel active">
                                <div class="admin-section">
                                    <h3>头像设置</h3>
                                    <div class="admin-avatar-section">
                                        <div class="admin-avatar-preview">
                                            <img id="admin-avatar-img" src="/img/avatar_hu_f509edb42ecc0ebd.png" alt="当前头像">
                                            <div class="admin-avatar-overlay">
                                                <svg class="admin-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                    <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"></path>
                                                    <circle cx="12" cy="13" r="4"></circle>
                                                </svg>
                                            </div>
                                        </div>
                                        <div class="admin-avatar-controls">
                                            <input type="file" id="admin-avatar-upload" accept="image/*" style="display: none;">
                                            <button class="admin-btn admin-btn-primary" onclick="document.getElementById('admin-avatar-upload').click()">
                                                <svg class="admin-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"></path>
                                                    <polyline points="7,10 12,15 17,10"></polyline>
                                                    <line x1="12" y1="15" x2="12" y2="3"></line>
                                                </svg>
                                                上传头像
                                            </button>
                                            <button class="admin-btn admin-btn-secondary" id="admin-avatar-reset">
                                                <svg class="admin-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                    <polyline points="1,4 1,10 7,10"></polyline>
                                                    <path d="M3.51 15a9 9 0 102.13-9.36L1 10"></path>
                                                </svg>
                                                重置默认
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div class="admin-section">
                                    <h3>个人信息</h3>
                                    <div class="admin-form-group">
                                        <label for="admin-site-title">站点标题</label>
                                        <input type="text" id="admin-site-title" value="lanniny-blog" placeholder="输入站点标题">
                                    </div>
                                    <div class="admin-form-group">
                                        <label for="admin-site-description">站点描述</label>
                                        <textarea id="admin-site-description" placeholder="输入站点描述" rows="3">演示文稿</textarea>
                                    </div>
                                </div>
                            </div>
                            <div id="admin-tab-content" class="admin-tab-panel">
                                <div class="admin-section">
                                    <h3>快速操作</h3>
                                    <div class="admin-quick-actions">
                                        <button class="admin-action-btn" id="admin-new-post">
                                            <svg class="admin-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                <path d="M14.5 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V7.5L14.5 2z"></path>
                                                <polyline points="14,2 14,8 20,8"></polyline>
                                                <line x1="16" y1="13" x2="8" y2="13"></line>
                                                <line x1="16" y1="17" x2="8" y2="17"></line>
                                                <polyline points="10,9 9,9 8,9"></polyline>
                                            </svg>
                                            <span>新建文章</span>
                                        </button>
                                        <button class="admin-action-btn" id="admin-manage-posts">
                                            <svg class="admin-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"></path>
                                                <polyline points="14,2 14,8 20,8"></polyline>
                                                <line x1="16" y1="13" x2="8" y2="13"></line>
                                                <line x1="16" y1="17" x2="8" y2="17"></line>
                                            </svg>
                                            <span>管理文章</span>
                                        </button>
                                        <button class="admin-action-btn" id="admin-site-stats">
                                            <svg class="admin-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                <path d="M3 3v18h18"></path>
                                                <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"></path>
                                            </svg>
                                            <span>站点统计</span>
                                        </button>
                                    </div>
                                </div>
                                <div class="admin-section">
                                    <h3>最近文章</h3>
                                    <div class="admin-recent-posts">
                                        <div class="admin-post-item">
                                            <div class="admin-post-info">
                                                <h4>Vision Transformer (VIT) 源码解读</h4>
                                                <p>Deep Learning • 2025-01-19</p>
                                            </div>
                                            <div class="admin-post-actions">
                                                <button class="admin-btn-small">编辑</button>
                                                <button class="admin-btn-small admin-btn-danger">删除</button>
                                            </div>
                                        </div>
                                        <div class="admin-post-item">
                                            <div class="admin-post-info">
                                                <h4>Transformer架构深度解析</h4>
                                                <p>Deep Learning • 2025-01-19</p>
                                            </div>
                                            <div class="admin-post-actions">
                                                <button class="admin-btn-small">编辑</button>
                                                <button class="admin-btn-small admin-btn-danger">删除</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div id="admin-tab-settings" class="admin-tab-panel">
                                <div class="admin-section">
                                    <h3>主题设置</h3>
                                    <div class="admin-form-group">
                                        <label for="admin-theme-color">主题色彩</label>
                                        <div class="admin-color-picker">
                                            <input type="color" id="admin-theme-color" value="#34495e">
                                            <span class="admin-color-preview"></span>
                                        </div>
                                    </div>
                                    <div class="admin-form-group">
                                        <label>
                                            <input type="checkbox" id="admin-dark-mode-default"> 默认深色模式
                                        </label>
                                    </div>
                                </div>
                                <div class="admin-section">
                                    <h3>安全设置</h3>
                                    <div class="admin-form-group">
                                        <label for="admin-new-password">更改管理员密码</label>
                                        <input type="password" id="admin-new-password" placeholder="输入新密码">
                                    </div>
                                    <button class="admin-btn admin-btn-primary" id="admin-change-password">更新密码</button>
                                </div>
                            </div>
                        </div>
                        <div class="admin-panel-footer">
                            <button class="admin-btn admin-btn-primary" id="admin-save-settings">
                                <svg class="admin-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"></path>
                                    <polyline points="17,21 17,13 7,13 7,21"></polyline>
                                    <polyline points="7,3 7,8 15,8"></polyline>
                                </svg>
                                保存设置
                            </button>
                            <button class="admin-btn admin-btn-secondary" id="admin-panel-cancel">取消</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
};

export default StackAuth;
export { AuthUtils, type authStatus, type AuthConfig };
