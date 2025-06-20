/*!
*   Hugo Theme Stack - Extended with Admin Authentication
*
*   @author: Jimmy Cai (Original), Emma (Admin Extension)
*   @website: https://jimmycai.com
*   @link: https://github.com/CaiJimmy/hugo-theme-stack
*/
import StackGallery from "ts/gallery";
import { getColor } from 'ts/color';
import menu from 'ts/menu';
import createElement from 'ts/createElement';
import StackColorScheme from 'ts/colorScheme';
import { setupScrollspy } from 'ts/scrollspy';
import { setupSmoothAnchors } from "ts/smoothAnchors";
import StackAuth, { AuthUtils } from 'ts/auth';

// Global auth instance
let globalAuth: StackAuth;

let Stack = {
    init: () => {
        /**
         * Initialize authentication system
         */
        globalAuth = new StackAuth();
        
        // Listen for auth status changes
        window.addEventListener('onAuthStatusChange', (e: CustomEvent) => {
            const { status, isAuthenticated, isAdmin, remainingAttempts } = e.detail;
            
            // Update UI based on auth status
            AuthUtils.toggleAdminElements(isAdmin);
            AuthUtils.updateBodyClass(isAdmin);
            
            // Handle different auth events
            switch (status) {
                case 'authenticated':
                    AuthUtils.hideLoginModal();
                    console.log('Admin authenticated successfully');
                    break;
                case 'failed':
                    AuthUtils.showLoginError('密码错误');
                    if (remainingAttempts > 0) {
                        AuthUtils.showAttemptsInfo(remainingAttempts);
                    }
                    break;
                case 'blocked':
                    AuthUtils.showLoginError('登录尝试次数过多，请稍后再试');
                    break;
                case 'guest':
                    console.log('User logged out or session expired');
                    break;
            }
        });

        // Create and inject login modal and admin panel with delay to ensure DOM is ready
        setTimeout(() => {
            const modalHTML = AuthUtils.createLoginModal();
            const panelHTML = AuthUtils.createAdminPanel();
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            document.body.insertAdjacentHTML('beforeend', panelHTML);

            // Bind login modal events
            Stack.bindAuthEvents();

            // Bind admin panel events
            Stack.bindAdminPanelEvents();

            // Initialize admin state on page load
            const isAdmin = globalAuth.isAuthenticated();
            AuthUtils.toggleAdminElements(isAdmin);
            AuthUtils.updateBodyClass(isAdmin);

            // Load admin settings on page load
            Stack.loadAdminSettings();
        }, 100);

        /**
         * Bind menu event
         */
        menu();

        const articleContent = document.querySelector('.article-content') as HTMLElement;
        if (articleContent) {
            new StackGallery(articleContent);
            setupSmoothAnchors();
            setupScrollspy();
        }

        /**
         * Add linear gradient background to tile style article
         */
        const articleTile = document.querySelector('.article-list--tile');
        if (articleTile) {
            let observer = new IntersectionObserver(async (entries, observer) => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;
                    observer.unobserve(entry.target);

                    const articles = entry.target.querySelectorAll('article.has-image');
                    articles.forEach(async articles => {
                        const image = articles.querySelector('img'),
                            imageURL = image.src,
                            key = image.getAttribute('data-key'),
                            hash = image.getAttribute('data-hash'),
                            articleDetails: HTMLDivElement = articles.querySelector('.article-details');

                        const colors = await getColor(key, hash, imageURL);

                        articleDetails.style.background = `
                        linear-gradient(0deg, 
                            rgba(${colors.DarkMuted.rgb[0]}, ${colors.DarkMuted.rgb[1]}, ${colors.DarkMuted.rgb[2]}, 0.5) 0%, 
                            rgba(${colors.Vibrant.rgb[0]}, ${colors.Vibrant.rgb[1]}, ${colors.Vibrant.rgb[2]}, 0.75) 100%)`;
                    })
                })
            });

            observer.observe(articleTile)
        }

        /**
         * Add copy button to code block
        */
        const highlights = document.querySelectorAll('.article-content div.highlight');
        const copyText = `Copy`,
            copiedText = `Copied!`;

        highlights.forEach(highlight => {
            const copyButton = document.createElement('button');
            copyButton.innerHTML = copyText;
            copyButton.classList.add('copyCodeButton');
            highlight.appendChild(copyButton);

            const codeBlock = highlight.querySelector('code[data-lang]');
            if (!codeBlock) return;

            copyButton.addEventListener('click', () => {
                navigator.clipboard.writeText(codeBlock.textContent)
                    .then(() => {
                        copyButton.textContent = copiedText;

                        setTimeout(() => {
                            copyButton.textContent = copyText;
                        }, 1000);
                    })
                    .catch(err => {
                        alert(err)
                        console.log('Something went wrong', err);
                    });
            });
        });

        new StackColorScheme(document.getElementById('dark-mode-toggle'));
    },

    /**
     * Bind authentication related events
     */
    bindAuthEvents: () => {
        // Login form submission
        const loginForm = document.getElementById('admin-login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const passwordInput = document.getElementById('admin-password') as HTMLInputElement;
                if (passwordInput) {
                    globalAuth.authenticate(passwordInput.value);
                }
            });
        }

        // Modal close events
        const closeBtn = document.getElementById('admin-modal-close');
        const cancelBtn = document.getElementById('admin-cancel-btn');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                AuthUtils.hideLoginModal();
            });
        }
        
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                AuthUtils.hideLoginModal();
            });
        }

        // Close modal when clicking outside
        const modal = document.getElementById('admin-login-modal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    AuthUtils.hideLoginModal();
                }
            });
        }

        // ESC key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                AuthUtils.hideLoginModal();
            }
        });

        // Admin panel toggle
        const adminPanelToggle = document.getElementById('admin-panel-toggle');
        if (adminPanelToggle) {
            adminPanelToggle.addEventListener('click', (e) => {
                e.preventDefault();
                Stack.showAdminPanel();
            });
        }
    },

    /**
     * Bind admin panel related events
     */
    bindAdminPanelEvents: () => {
        // Admin panel close events
        const panelCloseBtn = document.getElementById('admin-panel-close');
        const panelCancelBtn = document.getElementById('admin-panel-cancel');

        if (panelCloseBtn) {
            panelCloseBtn.addEventListener('click', () => {
                Stack.hideAdminPanel();
            });
        }

        if (panelCancelBtn) {
            panelCancelBtn.addEventListener('click', () => {
                Stack.hideAdminPanel();
            });
        }

        // Close panel when clicking outside
        const panel = document.getElementById('admin-panel-modal');
        if (panel) {
            panel.addEventListener('click', (e) => {
                if (e.target === panel) {
                    Stack.hideAdminPanel();
                }
            });
        }

        // Tab switching
        const tabBtns = document.querySelectorAll('.admin-tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = e.target as HTMLElement;
                const tabName = target.getAttribute('data-tab');
                if (tabName) {
                    Stack.switchAdminTab(tabName);
                }
            });
        });

        // Avatar upload
        const avatarUpload = document.getElementById('admin-avatar-upload');
        if (avatarUpload) {
            avatarUpload.addEventListener('change', (e) => {
                const target = e.target as HTMLInputElement;
                if (target.files && target.files[0]) {
                    Stack.handleAvatarUpload(target.files[0]);
                }
            });
        }

        // Avatar reset
        const avatarReset = document.getElementById('admin-avatar-reset');
        if (avatarReset) {
            avatarReset.addEventListener('click', () => {
                Stack.resetAvatar();
            });
        }

        // Save settings
        const saveSettings = document.getElementById('admin-save-settings');
        if (saveSettings) {
            saveSettings.addEventListener('click', () => {
                Stack.saveAdminSettings();
            });
        }

        // Theme color picker
        const themeColor = document.getElementById('admin-theme-color');
        if (themeColor) {
            themeColor.addEventListener('change', (e) => {
                const target = e.target as HTMLInputElement;
                Stack.updateThemeColor(target.value);
            });
        }

        // Change password
        const changePassword = document.getElementById('admin-change-password');
        if (changePassword) {
            changePassword.addEventListener('click', () => {
                Stack.changeAdminPassword();
            });
        }
    },

    /**
     * Get global auth instance
     */
    getAuth: () => {
        return globalAuth;
    },

    /**
     * Show admin login modal
     */
    showLogin: () => {
        AuthUtils.showLoginModal();
    },

    /**
     * Admin logout
     */
    logout: () => {
        if (globalAuth) {
            globalAuth.logout();
        }
    },

    /**
     * Show admin panel
     */
    showAdminPanel: () => {
        const panel = document.getElementById('admin-panel-modal');
        if (panel) {
            panel.style.display = 'flex';
            // Load current settings
            Stack.loadAdminSettings();
        }
    },

    /**
     * Hide admin panel
     */
    hideAdminPanel: () => {
        const panel = document.getElementById('admin-panel-modal');
        if (panel) {
            panel.style.display = 'none';
        }
    },

    /**
     * Switch admin panel tab
     */
    switchAdminTab: (tabName: string) => {
        // Remove active class from all tabs and panels
        document.querySelectorAll('.admin-tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelectorAll('.admin-tab-panel').forEach(panel => {
            panel.classList.remove('active');
        });

        // Add active class to selected tab and panel
        const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
        const selectedPanel = document.getElementById(`admin-tab-${tabName}`);

        if (selectedTab) selectedTab.classList.add('active');
        if (selectedPanel) selectedPanel.classList.add('active');
    },

    /**
     * Handle avatar upload
     */
    handleAvatarUpload: (file: File) => {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const result = e.target?.result as string;
                const avatarImg = document.getElementById('admin-avatar-img') as HTMLImageElement;
                if (avatarImg) {
                    avatarImg.src = result;
                    // Save to localStorage
                    localStorage.setItem('adminAvatar', result);
                    // Update site avatar immediately
                    Stack.updateSiteAvatar(result);
                }
            };
            reader.readAsDataURL(file);
        }
    },

    /**
     * Reset avatar to default
     */
    resetAvatar: () => {
        const defaultAvatar = '/img/avatar_hu_f509edb42ecc0ebd.png';
        const avatarImg = document.getElementById('admin-avatar-img') as HTMLImageElement;
        if (avatarImg) {
            avatarImg.src = defaultAvatar;
            localStorage.removeItem('adminAvatar');
            Stack.updateSiteAvatar(defaultAvatar);
        }
    },

    /**
     * Update site avatar
     */
    updateSiteAvatar: (avatarUrl: string) => {
        const siteAvatar = document.querySelector('.site-avatar img') as HTMLImageElement;
        if (siteAvatar) {
            siteAvatar.src = avatarUrl;
        }
    },

    /**
     * Load admin settings
     */
    loadAdminSettings: () => {
        // Load avatar
        const savedAvatar = localStorage.getItem('adminAvatar');
        if (savedAvatar) {
            const avatarImg = document.getElementById('admin-avatar-img') as HTMLImageElement;
            if (avatarImg) avatarImg.src = savedAvatar;
            Stack.updateSiteAvatar(savedAvatar);
        }

        // Load site title
        const savedTitle = localStorage.getItem('adminSiteTitle');
        if (savedTitle) {
            const titleInput = document.getElementById('admin-site-title') as HTMLInputElement;
            if (titleInput) titleInput.value = savedTitle;
            // Update site title immediately
            const siteNameEl = document.querySelector('.site-name a');
            if (siteNameEl) siteNameEl.textContent = savedTitle;
        }

        // Load site description
        const savedDesc = localStorage.getItem('adminSiteDescription');
        if (savedDesc) {
            const descInput = document.getElementById('admin-site-description') as HTMLTextAreaElement;
            if (descInput) descInput.value = savedDesc;
            // Update site description immediately
            const siteDescEl = document.querySelector('.site-description');
            if (siteDescEl) siteDescEl.textContent = savedDesc;
        }

        // Load theme color
        const savedColor = localStorage.getItem('adminThemeColor');
        if (savedColor) {
            const colorInput = document.getElementById('admin-theme-color') as HTMLInputElement;
            if (colorInput) colorInput.value = savedColor;
            Stack.updateThemeColor(savedColor);
        }
    },

    /**
     * Save admin settings
     */
    saveAdminSettings: () => {
        // Save site title
        const titleInput = document.getElementById('admin-site-title') as HTMLInputElement;
        if (titleInput) {
            localStorage.setItem('adminSiteTitle', titleInput.value);
            // Update site title in header
            const siteNameEl = document.querySelector('.site-name a');
            if (siteNameEl) siteNameEl.textContent = titleInput.value;
        }

        // Save site description
        const descInput = document.getElementById('admin-site-description') as HTMLTextAreaElement;
        if (descInput) {
            localStorage.setItem('adminSiteDescription', descInput.value);
            // Update site description in header
            const siteDescEl = document.querySelector('.site-description');
            if (siteDescEl) siteDescEl.textContent = descInput.value;
        }

        // Save theme color
        const colorInput = document.getElementById('admin-theme-color') as HTMLInputElement;
        if (colorInput) {
            localStorage.setItem('adminThemeColor', colorInput.value);
        }

        // Show success message
        Stack.showSuccessMessage('设置已保存！');
        Stack.hideAdminPanel();
    },

    /**
     * Update theme color
     */
    updateThemeColor: (color: string) => {
        document.documentElement.style.setProperty('--accent-color', color);
        const preview = document.querySelector('.admin-color-preview') as HTMLElement;
        if (preview) {
            preview.style.backgroundColor = color;
        }
    },

    /**
     * Change admin password
     */
    changeAdminPassword: () => {
        const newPasswordInput = document.getElementById('admin-new-password') as HTMLInputElement;
        if (newPasswordInput && newPasswordInput.value) {
            // This would typically be handled server-side
            // For demo purposes, we'll just show a message
            Stack.showSuccessMessage('密码更改功能需要后端支持，当前为演示模式');
            newPasswordInput.value = '';
        } else {
            Stack.showErrorMessage('请输入新密码');
        }
    },

    /**
     * Show success message
     */
    showSuccessMessage: (message: string) => {
        Stack.showNotification(message, 'success');
    },

    /**
     * Show error message
     */
    showErrorMessage: (message: string) => {
        Stack.showNotification(message, 'error');
    },

    /**
     * Show notification
     */
    showNotification: (message: string, type: 'success' | 'error' = 'success') => {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `admin-notification admin-notification-${type}`;
        notification.innerHTML = `
            <div class="admin-notification-content">
                <svg class="admin-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    ${type === 'success'
                        ? '<path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path><polyline points="22,4 12,14.01 9,11.01"></polyline>'
                        : '<circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line>'
                    }
                </svg>
                <span>${message}</span>
            </div>
        `;

        // Add to page
        document.body.appendChild(notification);

        // Show with animation
        setTimeout(() => notification.classList.add('show'), 100);

        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    },

    /**
     * Show admin panel
     */
    showAdminPanel: () => {
        const panel = document.getElementById('admin-panel-modal');
        if (panel) {
            panel.style.display = 'flex';
            // Load current settings
            Stack.loadAdminSettings();
        }
    },

    /**
     * Hide admin panel
     */
    hideAdminPanel: () => {
        const panel = document.getElementById('admin-panel-modal');
        if (panel) {
            panel.style.display = 'none';
        }
    },

    /**
     * Switch admin panel tab
     */
    switchAdminTab: (tabName: string) => {
        // Remove active class from all tabs and panels
        document.querySelectorAll('.admin-tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelectorAll('.admin-tab-panel').forEach(panel => {
            panel.classList.remove('active');
        });

        // Add active class to selected tab and panel
        const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
        const selectedPanel = document.getElementById(`admin-tab-${tabName}`);

        if (selectedTab) selectedTab.classList.add('active');
        if (selectedPanel) selectedPanel.classList.add('active');
    },

    /**
     * Handle avatar upload
     */
    handleAvatarUpload: (file: File) => {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const result = e.target?.result as string;
                const avatarImg = document.getElementById('admin-avatar-img') as HTMLImageElement;
                if (avatarImg) {
                    avatarImg.src = result;
                    // Save to localStorage
                    localStorage.setItem('adminAvatar', result);
                }
            };
            reader.readAsDataURL(file);
        }
    },

    /**
     * Reset avatar to default
     */
    resetAvatar: () => {
        const avatarImg = document.getElementById('admin-avatar-img') as HTMLImageElement;
        if (avatarImg) {
            avatarImg.src = '/img/avatar_hu_f509edb42ecc0ebd.png';
            localStorage.removeItem('adminAvatar');
        }
    },

    /**
     * Load admin settings
     */
    loadAdminSettings: () => {
        // Load avatar
        const savedAvatar = localStorage.getItem('adminAvatar');
        if (savedAvatar) {
            const avatarImg = document.getElementById('admin-avatar-img') as HTMLImageElement;
            if (avatarImg) avatarImg.src = savedAvatar;
        }

        // Load site title
        const savedTitle = localStorage.getItem('adminSiteTitle');
        if (savedTitle) {
            const titleInput = document.getElementById('admin-site-title') as HTMLInputElement;
            if (titleInput) titleInput.value = savedTitle;
        }

        // Load site description
        const savedDesc = localStorage.getItem('adminSiteDescription');
        if (savedDesc) {
            const descInput = document.getElementById('admin-site-description') as HTMLTextAreaElement;
            if (descInput) descInput.value = savedDesc;
        }

        // Load theme color
        const savedColor = localStorage.getItem('adminThemeColor');
        if (savedColor) {
            const colorInput = document.getElementById('admin-theme-color') as HTMLInputElement;
            if (colorInput) colorInput.value = savedColor;
            Stack.updateThemeColor(savedColor);
        }
    },

    /**
     * Save admin settings
     */
    saveAdminSettings: () => {
        // Save site title
        const titleInput = document.getElementById('admin-site-title') as HTMLInputElement;
        if (titleInput) {
            localStorage.setItem('adminSiteTitle', titleInput.value);
            // Update site title in header
            const siteNameEl = document.querySelector('.site-name a');
            if (siteNameEl) siteNameEl.textContent = titleInput.value;
        }

        // Save site description
        const descInput = document.getElementById('admin-site-description') as HTMLTextAreaElement;
        if (descInput) {
            localStorage.setItem('adminSiteDescription', descInput.value);
            // Update site description in header
            const siteDescEl = document.querySelector('.site-description');
            if (siteDescEl) siteDescEl.textContent = descInput.value;
        }

        // Save theme color
        const colorInput = document.getElementById('admin-theme-color') as HTMLInputElement;
        if (colorInput) {
            localStorage.setItem('adminThemeColor', colorInput.value);
        }

        alert('设置已保存！');
        Stack.hideAdminPanel();
    },

    /**
     * Update theme color
     */
    updateThemeColor: (color: string) => {
        document.documentElement.style.setProperty('--accent-color', color);
        const preview = document.querySelector('.admin-color-preview') as HTMLElement;
        if (preview) {
            preview.style.backgroundColor = color;
        }
    },

    /**
     * Change admin password
     */
    changeAdminPassword: () => {
        const newPasswordInput = document.getElementById('admin-new-password') as HTMLInputElement;
        if (newPasswordInput && newPasswordInput.value) {
            // This would typically be handled server-side
            // For demo purposes, we'll just show a message
            alert('密码更改功能需要后端支持，当前为演示模式');
            newPasswordInput.value = '';
        } else {
            alert('请输入新密码');
        }
    }
}

window.addEventListener('load', () => {
    setTimeout(function () {
        Stack.init();
    }, 0);
})

declare global {
    interface Window {
        createElement: any;
        Stack: any;
        StackAuth: any;
    }
}

window.Stack = Stack;
window.createElement = createElement;
window.StackAuth = globalAuth;
