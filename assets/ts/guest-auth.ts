/*!
*   Hugo Theme Stack - Guest Authentication System
*
*   @author: Alex (Engineer)
*   @project: Hugo Blog Guest Login System
*   @description: Guest user registration, login, and rating system
*/

interface GuestUser {
    id: string;
    username: string;
    email: string;
    avatar?: string;
    registeredAt: string;
    lastLoginAt: string;
    ratings: { [articleId: string]: number };
    comments: string[];
}

interface GuestSession {
    userId: string;
    username: string;
    email: string;
    avatar?: string;
    loginAt: string;
    expiresAt: string;
}

class GuestAuthSystem {
    private currentSession: GuestSession | null = null;
    private readonly SESSION_KEY = 'guestSession';
    private readonly USERS_KEY = 'guestUsers';
    private readonly SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

    constructor() {
        this.loadSession();

        // Force immediate initialization
        this.forceInitialization();
        console.log('🔐 Guest authentication system initialized');
    }

    /**
     * Force initialization regardless of DOM state
     */
    private forceInitialization(): void {
        // Try immediate setup
        this.setupEventListeners();

        // Also setup on DOM ready as backup
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupEventListeners();
            });
        }

        // And setup on window load as final backup
        window.addEventListener('load', () => {
            this.setupEventListeners();
        });

        // Force setup after a short delay
        setTimeout(() => {
            this.setupEventListeners();
        }, 500);
    }

    /**
     * Load existing session from localStorage
     */
    private loadSession(): void {
        try {
            const sessionData = localStorage.getItem(this.SESSION_KEY);
            if (sessionData) {
                const session: GuestSession = JSON.parse(sessionData);
                
                // Check if session is still valid
                if (new Date(session.expiresAt) > new Date()) {
                    this.currentSession = session;
                    this.updateUI();
                    console.log('✅ Guest session restored:', session.username);
                } else {
                    // Session expired
                    localStorage.removeItem(this.SESSION_KEY);
                    console.log('⏰ Guest session expired');
                }
            }
        } catch (error) {
            console.error('❌ Error loading guest session:', error);
            localStorage.removeItem(this.SESSION_KEY);
        }
    }

    /**
     * Setup event listeners for guest auth
     */
    private setupEventListeners(): void {
        // Guest login button
        document.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            
            if (target.id === 'guest-login-btn' || target.closest('#guest-login-btn')) {
                e.preventDefault();
                this.showGuestLoginModal();
            }
            
            if (target.id === 'guest-logout-btn' || target.closest('#guest-logout-btn')) {
                e.preventDefault();
                this.logout();
            }
            
            if (target.id === 'guest-register-btn' || target.closest('#guest-register-btn')) {
                e.preventDefault();
                this.showGuestRegisterModal();
            }
        });

        // Add guest login button to navigation if not exists
        this.addGuestLoginButton();
    }

    /**
     * Add guest login button to navigation
     */
    private addGuestLoginButton(): void {
        // Remove any existing guest auth section first
        const existing = document.getElementById('guest-auth-section');
        if (existing) {
            existing.remove();
        }

        // Always use floating button for better visibility
        this.addFloatingGuestButton();

        console.log('✅ Guest auth button setup completed');
    }

    /**
     * Add floating guest button as fallback
     */
    private addFloatingGuestButton(): void {
        const floatingHTML = `
            <div id="guest-auth-section" class="guest-auth-floating" style="
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 9999;
                background: rgba(255, 255, 255, 0.95);
                border-radius: 8px;
                padding: 10px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.15);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(0,0,0,0.1);
            ">
                <div id="guest-login-area" class="guest-login-area" style="display: ${this.currentSession ? 'none' : 'flex'}; gap: 8px;">
                    <button id="guest-login-btn" class="guest-login-btn" style="
                        display: flex;
                        align-items: center;
                        gap: 5px;
                        padding: 8px 12px;
                        background: #007bff;
                        color: white;
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                        font-size: 14px;
                        font-family: inherit;
                    ">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        游客登录
                    </button>
                </div>

                <div id="guest-user-area" class="guest-user-area" style="display: ${this.currentSession ? 'flex' : 'none'}; align-items: center; gap: 8px;">
                    <img id="guest-avatar" class="guest-avatar" src="${this.currentSession?.avatar || '/img/default-avatar.png'}" alt="头像" style="
                        width: 32px;
                        height: 32px;
                        border-radius: 50%;
                        object-fit: cover;
                    ">
                    <span id="guest-username" class="guest-username" style="font-weight: 500; color: #333;">${this.currentSession?.username || ''}</span>
                    <button id="guest-logout-btn" class="guest-logout-btn" style="
                        padding: 6px 10px;
                        background: #dc3545;
                        color: white;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 12px;
                        font-family: inherit;
                    ">退出</button>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', floatingHTML);
        console.log('✅ Guest auth floating button added');
    }

    /**
     * Show guest login modal
     */
    private showGuestLoginModal(): void {
        const modalHTML = `
            <div id="guest-login-modal" class="guest-modal" style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
            ">
                <div class="guest-modal-content" style="
                    background: white;
                    border-radius: 8px;
                    padding: 0;
                    max-width: 400px;
                    width: 90%;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                ">
                    <div class="guest-modal-header" style="
                        padding: 20px;
                        border-bottom: 1px solid #eee;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    ">
                        <h3 style="margin: 0; color: #333;">游客登录</h3>
                        <button class="guest-modal-close" onclick="this.closest('.guest-modal').remove()" style="
                            background: none;
                            border: none;
                            font-size: 24px;
                            cursor: pointer;
                            color: #999;
                        ">×</button>
                    </div>
                    <div class="guest-modal-body" style="padding: 20px;">
                        <form id="guest-login-form">
                            <div class="guest-form-group" style="margin-bottom: 15px;">
                                <label for="guest-login-username" style="display: block; margin-bottom: 5px; font-weight: 500;">用户名或邮箱</label>
                                <input type="text" id="guest-login-username" required style="
                                    width: 100%;
                                    padding: 10px;
                                    border: 1px solid #ddd;
                                    border-radius: 4px;
                                    font-size: 14px;
                                    box-sizing: border-box;
                                ">
                            </div>
                            <div class="guest-form-group" style="margin-bottom: 20px;">
                                <label for="guest-login-password" style="display: block; margin-bottom: 5px; font-weight: 500;">密码</label>
                                <input type="password" id="guest-login-password" required style="
                                    width: 100%;
                                    padding: 10px;
                                    border: 1px solid #ddd;
                                    border-radius: 4px;
                                    font-size: 14px;
                                    box-sizing: border-box;
                                ">
                            </div>
                            <div class="guest-form-actions" style="display: flex; gap: 10px;">
                                <button type="submit" class="guest-btn guest-btn-primary" style="
                                    flex: 1;
                                    padding: 10px;
                                    background: #007bff;
                                    color: white;
                                    border: none;
                                    border-radius: 4px;
                                    cursor: pointer;
                                    font-size: 14px;
                                ">登录</button>
                                <button type="button" class="guest-btn guest-btn-secondary" onclick="document.getElementById('guest-login-modal').remove(); window.guestAuth.showGuestRegisterModal()" style="
                                    flex: 1;
                                    padding: 10px;
                                    background: #6c757d;
                                    color: white;
                                    border: none;
                                    border-radius: 4px;
                                    cursor: pointer;
                                    font-size: 14px;
                                ">注册新账户</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Setup form submission
        const form = document.getElementById('guest-login-form') as HTMLFormElement;
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin(form);
        });
    }

    /**
     * Show guest register modal
     */
    private showGuestRegisterModal(): void {
        const modalHTML = `
            <div id="guest-register-modal" class="guest-modal">
                <div class="guest-modal-content">
                    <div class="guest-modal-header">
                        <h3>游客注册</h3>
                        <button class="guest-modal-close" onclick="this.closest('.guest-modal').remove()">×</button>
                    </div>
                    <div class="guest-modal-body">
                        <form id="guest-register-form">
                            <div class="guest-form-group">
                                <label for="guest-register-username">用户名</label>
                                <input type="text" id="guest-register-username" required minlength="3" maxlength="20">
                                <small>3-20个字符，只能包含字母、数字和下划线</small>
                            </div>
                            <div class="guest-form-group">
                                <label for="guest-register-email">邮箱</label>
                                <input type="email" id="guest-register-email" required>
                            </div>
                            <div class="guest-form-group">
                                <label for="guest-register-password">密码</label>
                                <input type="password" id="guest-register-password" required minlength="6">
                                <small>至少6个字符</small>
                            </div>
                            <div class="guest-form-group">
                                <label for="guest-register-confirm">确认密码</label>
                                <input type="password" id="guest-register-confirm" required>
                            </div>
                            <div class="guest-form-actions">
                                <button type="submit" class="guest-btn guest-btn-primary">注册</button>
                                <button type="button" class="guest-btn guest-btn-secondary" onclick="document.getElementById('guest-register-modal').remove(); window.guestAuth.showGuestLoginModal()">已有账户？登录</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Setup form submission
        const form = document.getElementById('guest-register-form') as HTMLFormElement;
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegister(form);
        });
    }

    /**
     * Handle guest login
     */
    private handleLogin(form: HTMLFormElement): void {
        const formData = new FormData(form);
        const username = (document.getElementById('guest-login-username') as HTMLInputElement).value;
        const password = (document.getElementById('guest-login-password') as HTMLInputElement).value;

        try {
            const users = this.getStoredUsers();
            const user = users.find(u => 
                (u.username === username || u.email === username)
            );

            if (!user) {
                this.showMessage('用户不存在', 'error');
                return;
            }

            // In a real app, you'd verify the password hash
            // For demo purposes, we'll use a simple check
            const storedPassword = localStorage.getItem(`guest_password_${user.id}`);
            if (storedPassword !== password) {
                this.showMessage('密码错误', 'error');
                return;
            }

            // Create session
            this.createSession(user);
            
            // Close modal
            document.getElementById('guest-login-modal')?.remove();
            
            this.showMessage('登录成功！', 'success');
            console.log('✅ Guest login successful:', user.username);

        } catch (error) {
            console.error('❌ Guest login error:', error);
            this.showMessage('登录失败，请重试', 'error');
        }
    }

    /**
     * Handle guest registration
     */
    private handleRegister(form: HTMLFormElement): void {
        const username = (document.getElementById('guest-register-username') as HTMLInputElement).value;
        const email = (document.getElementById('guest-register-email') as HTMLInputElement).value;
        const password = (document.getElementById('guest-register-password') as HTMLInputElement).value;
        const confirm = (document.getElementById('guest-register-confirm') as HTMLInputElement).value;

        // Validation
        if (password !== confirm) {
            this.showMessage('密码确认不匹配', 'error');
            return;
        }

        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            this.showMessage('用户名只能包含字母、数字和下划线', 'error');
            return;
        }

        try {
            const users = this.getStoredUsers();
            
            // Check if username or email already exists
            if (users.some(u => u.username === username)) {
                this.showMessage('用户名已存在', 'error');
                return;
            }
            
            if (users.some(u => u.email === email)) {
                this.showMessage('邮箱已被注册', 'error');
                return;
            }

            // Create new user
            const newUser: GuestUser = {
                id: this.generateUserId(),
                username,
                email,
                registeredAt: new Date().toISOString(),
                lastLoginAt: new Date().toISOString(),
                ratings: {},
                comments: []
            };

            // Store user
            users.push(newUser);
            localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
            localStorage.setItem(`guest_password_${newUser.id}`, password);

            // Create session
            this.createSession(newUser);
            
            // Close modal
            document.getElementById('guest-register-modal')?.remove();
            
            this.showMessage('注册成功！', 'success');
            console.log('✅ Guest registration successful:', newUser.username);

        } catch (error) {
            console.error('❌ Guest registration error:', error);
            this.showMessage('注册失败，请重试', 'error');
        }
    }

    /**
     * Create user session
     */
    private createSession(user: GuestUser): void {
        const now = new Date();
        const expiresAt = new Date(now.getTime() + this.SESSION_DURATION);

        this.currentSession = {
            userId: user.id,
            username: user.username,
            email: user.email,
            avatar: user.avatar,
            loginAt: now.toISOString(),
            expiresAt: expiresAt.toISOString()
        };

        // Update user's last login
        const users = this.getStoredUsers();
        const userIndex = users.findIndex(u => u.id === user.id);
        if (userIndex !== -1) {
            users[userIndex].lastLoginAt = now.toISOString();
            localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
        }

        // Store session
        localStorage.setItem(this.SESSION_KEY, JSON.stringify(this.currentSession));
        
        this.updateUI();
    }

    /**
     * Logout current user
     */
    public logout(): void {
        this.currentSession = null;
        localStorage.removeItem(this.SESSION_KEY);
        this.updateUI();
        this.showMessage('已退出登录', 'info');
        console.log('👋 Guest logged out');
    }

    /**
     * Update UI based on authentication state
     */
    private updateUI(): void {
        const loginArea = document.getElementById('guest-login-area');
        const userArea = document.getElementById('guest-user-area');
        const username = document.getElementById('guest-username');
        const avatar = document.getElementById('guest-avatar') as HTMLImageElement;

        if (this.currentSession) {
            // User is logged in
            if (loginArea) loginArea.style.display = 'none';
            if (userArea) userArea.style.display = 'block';
            if (username) username.textContent = this.currentSession.username;
            if (avatar) avatar.src = this.currentSession.avatar || '/img/default-avatar.png';
        } else {
            // User is not logged in
            if (loginArea) loginArea.style.display = 'block';
            if (userArea) userArea.style.display = 'none';
        }
    }

    /**
     * Get stored users
     */
    private getStoredUsers(): GuestUser[] {
        try {
            const usersData = localStorage.getItem(this.USERS_KEY);
            return usersData ? JSON.parse(usersData) : [];
        } catch (error) {
            console.error('❌ Error loading users:', error);
            return [];
        }
    }

    /**
     * Generate unique user ID
     */
    private generateUserId(): string {
        return 'guest_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Show message to user
     */
    private showMessage(message: string, type: 'success' | 'error' | 'info'): void {
        // Use existing Stack message system if available
        if (typeof (window as any).Stack !== 'undefined') {
            const Stack = (window as any).Stack;
            if (type === 'success' && Stack.showSuccessMessage) {
                Stack.showSuccessMessage(message);
            } else if (type === 'error' && Stack.showErrorMessage) {
                Stack.showErrorMessage(message);
            } else {
                console.log(`${type.toUpperCase()}: ${message}`);
            }
        } else {
            alert(message);
        }
    }

    /**
     * Check if user is logged in
     */
    public isLoggedIn(): boolean {
        return this.currentSession !== null;
    }

    /**
     * Get current user
     */
    public getCurrentUser(): GuestSession | null {
        return this.currentSession;
    }

    /**
     * Rate an article
     */
    public rateArticle(articleId: string, rating: number): boolean {
        if (!this.currentSession) {
            this.showMessage('请先登录后再评分', 'error');
            return false;
        }

        if (rating < 1 || rating > 5) {
            this.showMessage('评分必须在1-5之间', 'error');
            return false;
        }

        try {
            const users = this.getStoredUsers();
            const userIndex = users.findIndex(u => u.id === this.currentSession!.userId);
            
            if (userIndex !== -1) {
                users[userIndex].ratings[articleId] = rating;
                localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
                this.showMessage('评分成功！', 'success');
                return true;
            }
        } catch (error) {
            console.error('❌ Error rating article:', error);
            this.showMessage('评分失败，请重试', 'error');
        }

        return false;
    }

    /**
     * Get user's rating for an article
     */
    public getUserRating(articleId: string): number | null {
        if (!this.currentSession) return null;

        try {
            const users = this.getStoredUsers();
            const user = users.find(u => u.id === this.currentSession!.userId);
            return user?.ratings[articleId] || null;
        } catch (error) {
            console.error('❌ Error getting user rating:', error);
            return null;
        }
    }
}

// Initialize guest auth system
const guestAuth = new GuestAuthSystem();

// Make it globally available
(window as any).guestAuth = guestAuth;

export default guestAuth;
