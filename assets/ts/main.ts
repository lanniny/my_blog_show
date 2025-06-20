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
import './performance';
import './links-enhance';

// Global auth instance
let globalAuth: StackAuth;

let Stack = {
    init: () => {
        /**
         * Initialize authentication system
         */
        try {
            globalAuth = new StackAuth();
            console.log('✅ globalAuth created successfully');
        } catch (error) {
            console.error('❌ Failed to create globalAuth:', error);
            console.log('🔧 Attempting fallback auth creation...');

            // Fallback: create a simple auth object with config support
            globalAuth = {
                config: {
                    adminPassword: localStorage.getItem('adminPassword') || 'admit'
                },
                isAuthenticated: () => localStorage.getItem('adminAuth') === 'authenticated',
                authenticate: function(password: string) {
                    // Use dynamic password from config
                    if (password === this.config.adminPassword) {
                        localStorage.setItem('adminAuth', 'authenticated');
                        // Manually trigger UI update
                        setTimeout(() => {
                            const adminElements = document.querySelectorAll('[data-admin-only]');
                            adminElements.forEach(el => {
                                (el as HTMLElement).style.display = 'block';
                            });
                            const guestElements = document.querySelectorAll('[data-guest-only]');
                            guestElements.forEach(el => {
                                (el as HTMLElement).style.display = 'none';
                            });
                            console.log('✅ Fallback auth UI updated');
                        }, 100);
                        return true;
                    }
                    return false;
                },
                logout: () => {
                    localStorage.removeItem('adminAuth');
                    const adminElements = document.querySelectorAll('[data-admin-only]');
                    adminElements.forEach(el => {
                        (el as HTMLElement).style.display = 'none';
                    });
                    const guestElements = document.querySelectorAll('[data-guest-only]');
                    guestElements.forEach(el => {
                        (el as HTMLElement).style.display = 'block';
                    });
                },
                updatePassword: function(newPassword: string) {
                    this.config.adminPassword = newPassword;
                    localStorage.setItem('adminPassword', newPassword);
                    console.log('✅ Fallback auth password updated');
                }
            };
            console.log('✅ Fallback auth created');
        }
        
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

                    // Force show admin elements after successful authentication
                    setTimeout(() => {
                        console.log('🔧 Force showing admin elements after authentication');
                        const adminElements = document.querySelectorAll('[data-admin-only]');
                        adminElements.forEach(el => {
                            (el as HTMLElement).style.display = 'block';
                        });
                        console.log('✅ Admin elements forced to show');
                    }, 100);
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

        // Create and inject login modal
        console.log('Creating login modal...');
        const modalHTML = AuthUtils.createLoginModal();
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        console.log('Login modal created');

        // Admin panel is now in HTML template, just verify it exists
        console.log('Checking for admin panel in HTML...');
        const panel = document.getElementById('admin-panel-modal');
        if (panel) {
            console.log('✅ Admin panel found in HTML template');
        } else {
            console.error('❌ Admin panel not found in HTML template!');
        }

        // Bind events immediately
        Stack.bindAuthEvents();
        Stack.bindAdminPanelEvents();

        // Initialize admin state on page load
        console.log('🔍 Checking globalAuth:', !!globalAuth);
        if (globalAuth) {
            const isAdmin = globalAuth.isAuthenticated();
            console.log('🔍 Initial admin status:', isAdmin);
            AuthUtils.toggleAdminElements(isAdmin);
            AuthUtils.updateBodyClass(isAdmin);
        } else {
            console.error('❌ globalAuth not initialized!');
        }

        // Load admin settings with proper timing
        // 使用setTimeout确保DOM完全准备好
        setTimeout(() => {
            console.log('⏰ DOM ready, loading admin settings...');
            Stack.loadAdminSettings();
        }, 100);

        console.log('✅ Stack initialization complete');

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

        /**
         * Register Service Worker for performance optimization
         */
        Stack.registerServiceWorker();
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

        // Admin panel toggle - use more flexible selector
        const adminPanelToggle = document.getElementById('admin-panel-toggle');
        if (adminPanelToggle) {
            adminPanelToggle.addEventListener('click', (e) => {
                e.preventDefault();
                Stack.showAdminPanel();
            });
        }

        // Global click handler for admin panel - FIXED VERSION
        document.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;

            // Check if clicked element or its parent contains "管理面板"
            if (target) {
                const clickedText = target.textContent || '';
                const parentText = target.parentElement?.textContent || '';
                const linkText = target.closest('a')?.textContent || '';

                // More comprehensive check for admin panel elements
                const isAdminPanelClick =
                    clickedText.trim() === '管理面板' ||
                    clickedText.includes('管理面板') ||
                    parentText.includes('管理面板') ||
                    linkText.includes('管理面板') ||
                    target.id === 'admin-panel-toggle' ||
                    target.closest('#admin-panel-toggle') ||
                    target.classList.contains('admin-panel-trigger');

                if (isAdminPanelClick) {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('🎯 Admin panel click detected:', target);
                    console.log('🎯 Clicked text:', clickedText);

                    // Ensure we're in admin mode before showing panel
                    if (globalAuth && globalAuth.isAuthenticated()) {
                        console.log('✅ User is authenticated, showing admin panel');

                        // DIRECT PANEL SHOW - bypass Stack.showAdminPanel if needed
                        const panel = document.getElementById('admin-panel-modal');
                        if (panel) {
                            console.log('✅ Panel found, showing directly');
                            panel.style.display = 'flex';
                            // Load settings
                            if (Stack.loadAdminSettings) {
                                Stack.loadAdminSettings();
                            }
                        } else {
                            console.error('❌ Panel not found in DOM');
                        }
                    } else {
                        console.log('❌ User not authenticated, cannot show admin panel');
                    }
                }
            }
        }, true); // Use capture phase to ensure we catch the event
    },

    /**
     * Bind admin panel related events
     */
    bindAdminPanelEvents: () => {
        console.log('Binding admin panel events...');

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
                localStorage.setItem('adminThemeColor', target.value);
            });
        }

        // Content management buttons
        const newPostBtn = document.getElementById('admin-new-post');
        if (newPostBtn) {
            newPostBtn.addEventListener('click', () => {
                Stack.handleNewPost();
            });
        }

        const managePostsBtn = document.getElementById('admin-manage-posts');
        if (managePostsBtn) {
            managePostsBtn.addEventListener('click', () => {
                Stack.handleManagePosts();
            });
        }

        const siteStatsBtn = document.getElementById('admin-site-stats');
        if (siteStatsBtn) {
            siteStatsBtn.addEventListener('click', () => {
                Stack.handleSiteStats();
            });
        }

        // Dark mode toggle
        const darkModeToggle = document.getElementById('admin-dark-mode-default');
        if (darkModeToggle) {
            darkModeToggle.addEventListener('change', (e) => {
                const target = e.target as HTMLInputElement;
                Stack.handleDarkModeToggle(target.checked);
            });
        }

        // Change password
        const changePassword = document.getElementById('admin-change-password');
        if (changePassword) {
            changePassword.addEventListener('click', () => {
                Stack.handlePasswordChange();
            });
        }

        // Image manager
        const imageManager = document.getElementById('admin-image-manager');
        if (imageManager) {
            imageManager.addEventListener('click', () => {
                Stack.openImageManager();
            });
        }

        // Archives manager
        const archivesManager = document.getElementById('admin-archives-manager');
        if (archivesManager) {
            archivesManager.addEventListener('click', () => {
                Stack.openArchivesManager();
            });
        }

        console.log('Admin panel events bound successfully');
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
        console.log('🎯 showAdminPanel called');
        const panel = document.getElementById('admin-panel-modal');

        if (panel) {
            console.log('✅ Panel found in HTML, showing it');
            panel.style.display = 'flex';
            // Load current settings
            Stack.loadAdminSettings();
        } else {
            console.error('❌ Admin panel not found in HTML! This should not happen since it is in the template.');
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
        // 扩展选择器覆盖范围，确保所有头像位置都更新
        const avatarSelectors = [
            '.site-avatar img',      // 通用头像选择器
            '.site-logo',            // sidebar中的头像类
            '.site-avatar .site-logo', // 组合选择器
            '[data-avatar]'          // 自定义头像属性
        ];

        avatarSelectors.forEach(selector => {
            const avatar = document.querySelector(selector) as HTMLImageElement;
            if (avatar) {
                avatar.src = avatarUrl;
                console.log(`✅ Updated avatar for selector: ${selector}`);
            }
        });

        // 额外检查：确保所有可能的头像元素都被更新
        const allAvatars = document.querySelectorAll('img[alt*="Avatar"], img[alt*="avatar"]');
        allAvatars.forEach((img: HTMLImageElement) => {
            // 只更新非管理面板的头像
            if (!img.id || !img.id.includes('admin')) {
                img.src = avatarUrl;
                console.log(`✅ Updated additional avatar: ${img.className || img.id || 'unnamed'}`);
            }
        });
    },

    /**
     * Load admin settings with enhanced error handling and default values
     */
    loadAdminSettings: () => {
        console.log('🔄 Loading admin settings...');

        try {
            // 定义默认值
            const defaults = {
                avatar: '/img/avatar_hu_f509edb42ecc0ebd.png',
                title: 'lanniny-blog',
                description: '演示文稿',
                themeColor: '#34495e',
                password: 'admit'
            };

            // Load avatar with error handling
            try {
                const savedAvatar = localStorage.getItem('adminAvatar') || defaults.avatar;
                const avatarImg = document.getElementById('admin-avatar-img') as HTMLImageElement;
                if (avatarImg) {
                    avatarImg.src = savedAvatar;
                    console.log('✅ Avatar loaded:', savedAvatar !== defaults.avatar ? 'custom' : 'default');
                }

                // 只有非默认头像才更新到网站
                if (savedAvatar !== defaults.avatar) {
                    Stack.updateSiteAvatar(savedAvatar);
                }
            } catch (error) {
                console.warn('⚠️ Avatar loading failed:', error);
                // 使用默认头像
                const avatarImg = document.getElementById('admin-avatar-img') as HTMLImageElement;
                if (avatarImg) avatarImg.src = defaults.avatar;
            }

            // Load site title with error handling
            try {
                const savedTitle = localStorage.getItem('adminSiteTitle') || defaults.title;
                const titleInput = document.getElementById('admin-site-title') as HTMLInputElement;
                if (titleInput) {
                    titleInput.value = savedTitle;
                    console.log('✅ Site title loaded:', savedTitle);
                }

                // 只有非默认标题才更新到网站
                if (savedTitle !== defaults.title) {
                    const siteNameEl = document.querySelector('.site-name a');
                    if (siteNameEl) {
                        siteNameEl.textContent = savedTitle;
                        console.log('✅ Site title updated in header');
                    }
                }
            } catch (error) {
                console.warn('⚠️ Site title loading failed:', error);
                // 使用默认标题
                const titleInput = document.getElementById('admin-site-title') as HTMLInputElement;
                if (titleInput) titleInput.value = defaults.title;
            }

            // Load site description with error handling
            try {
                const savedDesc = localStorage.getItem('adminSiteDescription') || defaults.description;
                const descInput = document.getElementById('admin-site-description') as HTMLTextAreaElement;
                if (descInput) {
                    descInput.value = savedDesc;
                    console.log('✅ Site description loaded:', savedDesc);
                }

                // 只有非默认描述才更新到网站
                if (savedDesc !== defaults.description) {
                    const siteDescEl = document.querySelector('.site-description');
                    if (siteDescEl) {
                        siteDescEl.textContent = savedDesc;
                        console.log('✅ Site description updated in header');
                    }
                }
            } catch (error) {
                console.warn('⚠️ Site description loading failed:', error);
                // 使用默认描述
                const descInput = document.getElementById('admin-site-description') as HTMLTextAreaElement;
                if (descInput) descInput.value = defaults.description;
            }

            // Load theme color with error handling
            try {
                const savedColor = localStorage.getItem('adminThemeColor') || defaults.themeColor;
                const colorInput = document.getElementById('admin-theme-color') as HTMLInputElement;
                if (colorInput) {
                    colorInput.value = savedColor;
                    console.log('✅ Theme color loaded:', savedColor);
                }

                // 只有非默认颜色才应用主题
                if (savedColor !== defaults.themeColor) {
                    Stack.updateThemeColor(savedColor);
                    console.log('✅ Theme color applied');
                }
            } catch (error) {
                console.warn('⚠️ Theme color loading failed:', error);
                // 使用默认颜色
                const colorInput = document.getElementById('admin-theme-color') as HTMLInputElement;
                if (colorInput) colorInput.value = defaults.themeColor;
            }

            // Load admin password with enhanced error handling
            try {
                const savedPassword = localStorage.getItem('adminPassword');
                if (savedPassword && globalAuth) {
                    if (globalAuth.config) {
                        globalAuth.config.adminPassword = savedPassword;
                        console.log('✅ Admin password loaded from localStorage');
                    } else {
                        console.warn('⚠️ globalAuth.config not available, password not loaded');
                    }
                } else {
                    console.log('ℹ️ No saved password found, using default');
                }
            } catch (error) {
                console.warn('⚠️ Admin password loading failed:', error);
            }

            console.log('✅ Admin settings loading completed');

        } catch (error) {
            console.error('❌ Critical error in loadAdminSettings:', error);
            // 即使出错也要确保基本功能可用
            console.log('🔧 Attempting to recover with default values...');
        }
    },

    /**
     * Save admin settings with loading state feedback
     */
    saveAdminSettings: () => {
        console.log('💾 Saving admin settings...');

        // 显示保存状态
        const saveButton = document.getElementById('admin-save-settings') as HTMLButtonElement;
        const originalText = saveButton?.textContent || '保存设置';

        try {
            // 设置loading状态
            if (saveButton) {
                saveButton.disabled = true;
                saveButton.innerHTML = `
                    <svg class="admin-icon admin-loading" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 12a9 9 0 11-6.219-8.56"></path>
                    </svg>
                    保存中...
                `;
                console.log('🔄 Save button set to loading state');
            }

            let savedCount = 0;
            let totalSettings = 0;

            // Validate all fields before saving
            const isFormValid = Stack.FormValidator.validateAllFields();
            if (!isFormValid) {
                // Restore button state
                if (saveButton) {
                    saveButton.disabled = false;
                    saveButton.innerHTML = `
                        <svg class="admin-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"></path>
                            <polyline points="17,21 17,13 7,13 7,21"></polyline>
                            <polyline points="7,3 7,8 15,8"></polyline>
                        </svg>
                        ${originalText}
                    `;
                }
                Stack.showErrorMessage('请修正表单中的错误后再保存');
                return;
            }

            // Save site title with enhanced validation
            const titleInput = document.getElementById('admin-site-title') as HTMLInputElement;
            if (titleInput) {
                totalSettings++;
                const titleValidation = Stack.FormValidator.validateTitle(titleInput.value);
                if (titleValidation.isValid) {
                    const titleValue = titleInput.value.trim();
                    localStorage.setItem('adminSiteTitle', titleValue);
                    // Update site title in header
                    const siteNameEl = document.querySelector('.site-name a');
                    if (siteNameEl) {
                        siteNameEl.textContent = titleValue;
                        console.log('✅ Site title saved and updated:', titleValue);
                    }
                    savedCount++;
                } else {
                    console.warn('⚠️ Site title validation failed:', titleValidation.message);
                }
            }

            // Save site description with enhanced validation
            const descInput = document.getElementById('admin-site-description') as HTMLTextAreaElement;
            if (descInput) {
                totalSettings++;
                const descValidation = Stack.FormValidator.validateDescription(descInput.value);
                if (descValidation.isValid) {
                    const descValue = descInput.value.trim();
                    localStorage.setItem('adminSiteDescription', descValue);
                    // Update site description in header
                    const siteDescEl = document.querySelector('.site-description');
                    if (siteDescEl) {
                        siteDescEl.textContent = descValue;
                        console.log('✅ Site description saved and updated:', descValue);
                    }
                    savedCount++;
                } else {
                    console.warn('⚠️ Site description validation failed:', descValidation.message);
                }
            }

            // Save theme color with enhanced validation
            const colorInput = document.getElementById('admin-theme-color') as HTMLInputElement;
            if (colorInput) {
                totalSettings++;
                const colorValidation = Stack.FormValidator.validateThemeColor(colorInput.value);
                if (colorValidation.isValid) {
                    const colorValue = colorInput.value;
                    localStorage.setItem('adminThemeColor', colorValue);
                    // Apply theme color immediately
                    Stack.updateThemeColor(colorValue);
                    console.log('✅ Theme color saved and applied:', colorValue);
                    savedCount++;
                } else {
                    console.warn('⚠️ Theme color validation failed:', colorValidation.message);
                }
            }

            // 延迟显示结果，让用户看到loading状态
            setTimeout(() => {
                // 恢复按钮状态
                if (saveButton) {
                    saveButton.disabled = false;
                    saveButton.innerHTML = `
                        <svg class="admin-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"></path>
                            <polyline points="17,21 17,13 7,13 7,21"></polyline>
                            <polyline points="7,3 7,8 15,8"></polyline>
                        </svg>
                        ${originalText}
                    `;
                }

                // 显示保存结果
                if (savedCount === totalSettings && totalSettings > 0) {
                    Stack.showSuccessMessage(`设置已保存！(${savedCount}/${totalSettings}项)`);
                    console.log(`✅ All settings saved successfully (${savedCount}/${totalSettings})`);
                    Stack.hideAdminPanel();
                } else if (savedCount > 0) {
                    Stack.showSuccessMessage(`部分设置已保存 (${savedCount}/${totalSettings}项)`);
                    console.log(`⚠️ Partial save completed (${savedCount}/${totalSettings})`);
                } else {
                    Stack.showErrorMessage('没有有效的设置需要保存');
                    console.log('❌ No valid settings to save');
                }
            }, 800); // 800ms延迟，让用户看到loading效果

        } catch (error) {
            console.error('❌ Error saving admin settings:', error);

            // 恢复按钮状态
            if (saveButton) {
                saveButton.disabled = false;
                saveButton.innerHTML = `
                    <svg class="admin-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"></path>
                        <polyline points="17,21 17,13 7,13 7,21"></polyline>
                        <polyline points="7,3 7,8 15,8"></polyline>
                    </svg>
                    ${originalText}
                `;
            }

            Stack.showErrorMessage('设置保存失败，请重试');
        }
    },

    /**
     * Check data persistence status and integrity
     */
    checkDataPersistence: () => {
        console.log('🔍 Checking data persistence status...');

        const persistenceStatus = {
            localStorage: {
                available: false,
                quota: 0,
                used: 0
            },
            settings: {
                avatar: false,
                title: false,
                description: false,
                themeColor: false,
                password: false
            },
            integrity: true
        };

        try {
            // Check localStorage availability
            if (typeof Storage !== 'undefined' && localStorage) {
                persistenceStatus.localStorage.available = true;

                // Estimate localStorage usage
                let totalSize = 0;
                for (let key in localStorage) {
                    if (localStorage.hasOwnProperty(key)) {
                        totalSize += localStorage[key].length + key.length;
                    }
                }
                persistenceStatus.localStorage.used = totalSize;

                console.log('✅ localStorage available, used:', totalSize, 'characters');
            } else {
                console.warn('⚠️ localStorage not available');
            }

            // Check individual settings
            persistenceStatus.settings.avatar = !!localStorage.getItem('adminAvatar');
            persistenceStatus.settings.title = !!localStorage.getItem('adminSiteTitle');
            persistenceStatus.settings.description = !!localStorage.getItem('adminSiteDescription');
            persistenceStatus.settings.themeColor = !!localStorage.getItem('adminThemeColor');
            persistenceStatus.settings.password = !!localStorage.getItem('adminPassword');

            const savedCount = Object.values(persistenceStatus.settings).filter(Boolean).length;
            console.log(`📊 Persistence status: ${savedCount}/5 settings saved`);

            // Check data integrity
            try {
                const testKey = 'test_persistence_' + Date.now();
                localStorage.setItem(testKey, 'test');
                const testValue = localStorage.getItem(testKey);
                localStorage.removeItem(testKey);

                if (testValue !== 'test') {
                    persistenceStatus.integrity = false;
                    console.warn('⚠️ localStorage integrity check failed');
                } else {
                    console.log('✅ localStorage integrity check passed');
                }
            } catch (error) {
                persistenceStatus.integrity = false;
                console.warn('⚠️ localStorage integrity test failed:', error);
            }

        } catch (error) {
            console.error('❌ Error checking data persistence:', error);
            persistenceStatus.integrity = false;
        }

        return persistenceStatus;
    },

    /**
     * Reset all admin settings to defaults
     */
    resetAdminSettings: () => {
        console.log('🔄 Resetting all admin settings to defaults...');

        try {
            // Remove all admin-related localStorage items
            const adminKeys = [
                'adminAvatar',
                'adminSiteTitle',
                'adminSiteDescription',
                'adminThemeColor',
                'adminPassword'
            ];

            adminKeys.forEach(key => {
                localStorage.removeItem(key);
                console.log(`🗑️ Removed ${key}`);
            });

            // Reload settings to apply defaults
            Stack.loadAdminSettings();

            Stack.showSuccessMessage('所有设置已重置为默认值');
            console.log('✅ All admin settings reset to defaults');

        } catch (error) {
            console.error('❌ Error resetting admin settings:', error);
            Stack.showErrorMessage('重置设置失败，请重试');
        }
    },

    /**
     * Form validation utilities
     */
    FormValidator: {
        /**
         * Validate site title
         */
        validateTitle: (title: string): { isValid: boolean; message: string } => {
            if (!title || title.trim().length === 0) {
                return { isValid: false, message: '站点标题不能为空' };
            }

            if (title.trim().length < 2) {
                return { isValid: false, message: '站点标题至少需要2个字符' };
            }

            if (title.trim().length > 50) {
                return { isValid: false, message: '站点标题不能超过50个字符' };
            }

            // 检查是否包含特殊字符
            if (!/^[a-zA-Z0-9\u4e00-\u9fa5\s\-_\.]+$/.test(title.trim())) {
                return { isValid: false, message: '站点标题只能包含字母、数字、中文、空格、连字符、下划线和点号' };
            }

            return { isValid: true, message: '站点标题格式正确' };
        },

        /**
         * Validate site description
         */
        validateDescription: (description: string): { isValid: boolean; message: string } => {
            if (!description || description.trim().length === 0) {
                return { isValid: false, message: '站点描述不能为空' };
            }

            if (description.trim().length < 5) {
                return { isValid: false, message: '站点描述至少需要5个字符' };
            }

            if (description.trim().length > 200) {
                return { isValid: false, message: '站点描述不能超过200个字符' };
            }

            return { isValid: true, message: '站点描述格式正确' };
        },

        /**
         * Validate password with enhanced strength checking
         */
        validatePassword: (password: string): { isValid: boolean; message: string; strength: 'weak' | 'medium' | 'strong' } => {
            if (!password || password.trim().length === 0) {
                return { isValid: false, message: '密码不能为空', strength: 'weak' };
            }

            if (password.length < 4) {
                return { isValid: false, message: '密码长度至少4个字符', strength: 'weak' };
            }

            if (password.length > 50) {
                return { isValid: false, message: '密码长度不能超过50个字符', strength: 'weak' };
            }

            // 检查字符类型
            if (!/^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/.test(password)) {
                return { isValid: false, message: '密码只能包含字母、数字和常用符号', strength: 'weak' };
            }

            // 密码强度检查
            let strength: 'weak' | 'medium' | 'strong' = 'weak';
            let strengthScore = 0;

            if (password.length >= 8) strengthScore++;
            if (/[a-z]/.test(password)) strengthScore++;
            if (/[A-Z]/.test(password)) strengthScore++;
            if (/[0-9]/.test(password)) strengthScore++;
            if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) strengthScore++;

            if (strengthScore >= 4) {
                strength = 'strong';
            } else if (strengthScore >= 2) {
                strength = 'medium';
            }

            return {
                isValid: true,
                message: `密码强度: ${strength === 'strong' ? '强' : strength === 'medium' ? '中等' : '弱'}`,
                strength
            };
        },

        /**
         * Validate theme color
         */
        validateThemeColor: (color: string): { isValid: boolean; message: string } => {
            if (!color || color.trim().length === 0) {
                return { isValid: false, message: '主题色不能为空' };
            }

            if (!/^#[0-9A-F]{6}$/i.test(color)) {
                return { isValid: false, message: '主题色格式不正确，请使用十六进制颜色代码（如 #FF0000）' };
            }

            return { isValid: true, message: '主题色格式正确' };
        },

        /**
         * Show validation message for a specific field
         */
        showFieldValidation: (fieldId: string, validation: { isValid: boolean; message: string; strength?: string }) => {
            const field = document.getElementById(fieldId);
            if (!field) return;

            // Remove existing validation message
            const existingMessage = field.parentElement?.querySelector('.validation-message');
            if (existingMessage) {
                existingMessage.remove();
            }

            // Remove existing validation classes
            field.classList.remove('validation-success', 'validation-error', 'validation-warning');

            // Create validation message element
            const messageElement = document.createElement('div');
            messageElement.className = `validation-message ${validation.isValid ? 'validation-success' : 'validation-error'}`;
            messageElement.innerHTML = `
                <svg class="validation-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    ${validation.isValid
                        ? '<path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path><polyline points="22,4 12,14.01 9,11.01"></polyline>'
                        : '<circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line>'
                    }
                </svg>
                <span>${validation.message}</span>
            `;

            // Add validation class to field
            field.classList.add(validation.isValid ? 'validation-success' : 'validation-error');

            // Add password strength indicator for password fields
            if (fieldId.includes('password') && validation.strength) {
                const strengthClass = `strength-${validation.strength}`;
                messageElement.classList.add(strengthClass);
            }

            // Insert message after the field
            field.parentElement?.appendChild(messageElement);
        },

        /**
         * Validate all form fields
         */
        validateAllFields: (): boolean => {
            let allValid = true;

            // Validate title
            const titleInput = document.getElementById('admin-site-title') as HTMLInputElement;
            if (titleInput) {
                const titleValidation = Stack.FormValidator.validateTitle(titleInput.value);
                Stack.FormValidator.showFieldValidation('admin-site-title', titleValidation);
                if (!titleValidation.isValid) allValid = false;
            }

            // Validate description
            const descInput = document.getElementById('admin-site-description') as HTMLTextAreaElement;
            if (descInput) {
                const descValidation = Stack.FormValidator.validateDescription(descInput.value);
                Stack.FormValidator.showFieldValidation('admin-site-description', descValidation);
                if (!descValidation.isValid) allValid = false;
            }

            // Validate theme color
            const colorInput = document.getElementById('admin-theme-color') as HTMLInputElement;
            if (colorInput) {
                const colorValidation = Stack.FormValidator.validateThemeColor(colorInput.value);
                Stack.FormValidator.showFieldValidation('admin-theme-color', colorValidation);
                if (!colorValidation.isValid) allValid = false;
            }

            return allValid;
        }
    },

    /**
     * Setup real-time form validation
     */
    setupFormValidation: () => {
        console.log('🔧 Setting up real-time form validation...');

        // Title validation
        const titleInput = document.getElementById('admin-site-title') as HTMLInputElement;
        if (titleInput) {
            titleInput.addEventListener('input', () => {
                const validation = Stack.FormValidator.validateTitle(titleInput.value);
                Stack.FormValidator.showFieldValidation('admin-site-title', validation);
            });

            titleInput.addEventListener('blur', () => {
                const validation = Stack.FormValidator.validateTitle(titleInput.value);
                Stack.FormValidator.showFieldValidation('admin-site-title', validation);
            });
        }

        // Description validation
        const descInput = document.getElementById('admin-site-description') as HTMLTextAreaElement;
        if (descInput) {
            descInput.addEventListener('input', () => {
                const validation = Stack.FormValidator.validateDescription(descInput.value);
                Stack.FormValidator.showFieldValidation('admin-site-description', validation);
            });

            descInput.addEventListener('blur', () => {
                const validation = Stack.FormValidator.validateDescription(descInput.value);
                Stack.FormValidator.showFieldValidation('admin-site-description', validation);
            });
        }

        // Password validation
        const passwordInput = document.getElementById('admin-new-password') as HTMLInputElement;
        if (passwordInput) {
            passwordInput.addEventListener('input', () => {
                if (passwordInput.value.length > 0) {
                    const validation = Stack.FormValidator.validatePassword(passwordInput.value);
                    Stack.FormValidator.showFieldValidation('admin-new-password', validation);
                }
            });

            passwordInput.addEventListener('blur', () => {
                if (passwordInput.value.length > 0) {
                    const validation = Stack.FormValidator.validatePassword(passwordInput.value);
                    Stack.FormValidator.showFieldValidation('admin-new-password', validation);
                }
            });
        }

        // Theme color validation
        const colorInput = document.getElementById('admin-theme-color') as HTMLInputElement;
        if (colorInput) {
            colorInput.addEventListener('change', () => {
                const validation = Stack.FormValidator.validateThemeColor(colorInput.value);
                Stack.FormValidator.showFieldValidation('admin-theme-color', validation);
            });
        }

        console.log('✅ Real-time form validation setup complete');
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
     * Change admin password with enhanced validation
     */
    changeAdminPassword: () => {
        const newPasswordInput = document.getElementById('admin-new-password') as HTMLInputElement;
        if (!newPasswordInput) {
            Stack.showErrorMessage('密码输入框未找到');
            return;
        }

        const newPassword = newPasswordInput.value.trim();

        // 使用新的验证系统
        const validation = Stack.FormValidator.validatePassword(newPassword);

        if (!validation.isValid) {
            Stack.showErrorMessage(validation.message);
            Stack.FormValidator.showFieldValidation('admin-new-password', validation);
            return;
        }

        // 显示密码强度警告（如果是弱密码）
        if (validation.strength === 'weak') {
            const confirmWeak = confirm('您的密码强度较弱，建议使用包含大小写字母、数字和特殊字符的密码。是否继续？');
            if (!confirmWeak) {
                return;
            }
        }

        try {
            // 更新globalAuth配置中的密码
            if (globalAuth) {
                if (globalAuth.config) {
                    globalAuth.config.adminPassword = newPassword;
                    console.log('✅ Updated globalAuth.config.adminPassword');
                }

                // 如果有updatePassword方法，也调用它
                if (typeof globalAuth.updatePassword === 'function') {
                    globalAuth.updatePassword(newPassword);
                    console.log('✅ Called globalAuth.updatePassword()');
                }
            }

            // 保存新密码到localStorage (用于持久化)
            localStorage.setItem('adminPassword', newPassword);
            console.log('✅ Saved new password to localStorage');

            // 清空输入框和验证消息
            newPasswordInput.value = '';
            const validationMessage = newPasswordInput.parentElement?.querySelector('.validation-message');
            if (validationMessage) {
                validationMessage.remove();
            }
            newPasswordInput.classList.remove('validation-success', 'validation-error');

            // 显示成功消息
            Stack.showSuccessMessage(`密码已成功更新！密码强度: ${validation.strength === 'strong' ? '强' : validation.strength === 'medium' ? '中等' : '弱'}`);

            console.log('🔐 Password change completed successfully');

        } catch (error) {
            console.error('❌ Password change failed:', error);
            Stack.showErrorMessage('密码更新失败，请重试');
        }
    },

    /**
     * Open image manager in new tab
     */
    openImageManager: () => {
        console.log('🖼️ Opening image manager...');

        // Open image manager page in new tab
        const imageManagerUrl = '/page/image-manager/';
        window.open(imageManagerUrl, '_blank');

        // Hide admin panel
        Stack.hideAdminPanel();

        console.log('✅ Image manager opened in new tab');
    },

    /**
     * Open archives manager in new tab
     */
    openArchivesManager: () => {
        console.log('📚 Opening archives manager...');

        // Open archives page in new tab
        const archivesUrl = '/archives/';
        window.open(archivesUrl, '_blank');

        // Hide admin panel
        Stack.hideAdminPanel();

        console.log('✅ Archives manager opened in new tab');
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
     * Create admin panel HTML
     */
    createAdminPanelHTML: (): string => {
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

            // Setup form validation after a short delay to ensure DOM is ready
            setTimeout(() => {
                Stack.setupFormValidation();
            }, 100);
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
            // Update site avatar immediately
            Stack.updateSiteAvatar(defaultAvatar);
        }
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
     * Handle new post creation
     */
    handleNewPost: () => {
        console.log('📝 Creating new post...');
        Stack.showSuccessMessage('新建文章功能正在开发中，敬请期待！');
        // TODO: Implement GitHub API integration for creating new posts
    },

    /**
     * Handle post management
     */
    handleManagePosts: () => {
        console.log('📋 Managing posts...');
        Stack.showSuccessMessage('文章管理功能正在开发中，敬请期待！');
        // TODO: Implement GitHub API integration for managing posts
    },

    /**
     * Handle site statistics
     */
    handleSiteStats: () => {
        console.log('📊 Showing site statistics...');
        const stats = {
            totalPosts: 5,
            totalViews: 1234,
            totalComments: 56,
            lastUpdate: new Date().toLocaleDateString()
        };

        const message = `
            📊 站点统计信息：
            • 文章总数：${stats.totalPosts} 篇
            • 总访问量：${stats.totalViews} 次
            • 评论总数：${stats.totalComments} 条
            • 最后更新：${stats.lastUpdate}
        `;

        Stack.showSuccessMessage(message);
    },

    /**
     * Handle password change
     */
    handlePasswordChange: () => {
        const passwordInput = document.getElementById('admin-new-password') as HTMLInputElement;
        if (!passwordInput || !passwordInput.value.trim()) {
            Stack.showErrorMessage('请输入新密码');
            return;
        }

        const newPassword = passwordInput.value.trim();
        if (newPassword.length < 4) {
            Stack.showErrorMessage('密码长度至少4个字符');
            return;
        }

        // Update password in auth system
        if (globalAuth && globalAuth.config) {
            globalAuth.config.adminPassword = newPassword;
            localStorage.setItem('adminPassword', newPassword);
            passwordInput.value = '';
            Stack.showSuccessMessage('管理员密码已更新');
            console.log('✅ Admin password updated');
        } else {
            Stack.showErrorMessage('密码更新失败，请重试');
        }
    },

    /**
     * Handle dark mode toggle
     */
    handleDarkModeToggle: (enabled: boolean) => {
        console.log('🌙 Dark mode toggle:', enabled);
        localStorage.setItem('adminDarkModeDefault', enabled.toString());

        if (enabled) {
            document.documentElement.setAttribute('data-scheme', 'dark');
            Stack.showSuccessMessage('已设置默认深色模式');
        } else {
            document.documentElement.setAttribute('data-scheme', 'light');
            Stack.showSuccessMessage('已设置默认浅色模式');
        }
    },


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

// Import frontend beautification module
import './frontend-beautify';

// Import navigation enhancement module
import './navigation-enhance';

// Import admin panel enhancement module
import './admin-panel-enhance';

// Import social share module
import './share';

// Modern layout initialization
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎨 Modern blog layout initialized');

    // Add smooth scrolling to all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add loading states to buttons
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function() {
            if (!this.classList.contains('btn-loading')) {
                this.classList.add('btn-loading');
                setTimeout(() => {
                    this.classList.remove('btn-loading');
                }, 2000);
            }
        });
    });

    // Enhance article cards with better hover effects
    document.querySelectorAll('.article-card, .article-list article').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    console.log('✅ Modern layout enhancements applied');
});

/**
 * Register Service Worker for performance optimization
 */
Stack.registerServiceWorker = () => {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('✅ Service Worker 注册成功:', registration.scope);

                    // 检查更新
                    registration.addEventListener('updatefound', () => {
                        const newWorker = registration.installing;
                        if (newWorker) {
                            newWorker.addEventListener('statechange', () => {
                                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                    // 有新版本可用
                                    Stack.showUpdateNotification();
                                }
                            });
                        }
                    });
                })
                .catch(error => {
                    console.log('❌ Service Worker 注册失败:', error);
                });
        });
    }
};

/**
 * Show update notification
 */
Stack.showUpdateNotification = () => {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--accent-color);
        color: white;
        padding: 1rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        max-width: 300px;
        font-size: 0.9rem;
    `;

    notification.innerHTML = `
        <div style="margin-bottom: 0.5rem;">🔄 有新版本可用</div>
        <button onclick="location.reload()" style="
            background: white;
            color: var(--accent-color);
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 4px;
            cursor: pointer;
            font-weight: 600;
        ">立即更新</button>
        <button onclick="this.parentElement.remove()" style="
            background: transparent;
            color: white;
            border: 1px solid white;
            padding: 0.5rem 1rem;
            border-radius: 4px;
            cursor: pointer;
            margin-left: 0.5rem;
        ">稍后</button>
    `;

    document.body.appendChild(notification);

    // 10秒后自动隐藏
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 10000);
};
