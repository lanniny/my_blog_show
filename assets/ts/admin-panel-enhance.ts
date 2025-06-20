/**
 * Admin Panel Enhancement JavaScript
 * 管理面板交互增强
 */

interface AdminPanelEnhance {
    init(): void;
    setupAnimations(): void;
    setupFormEnhancements(): void;
    setupNotifications(): void;
    setupKeyboardShortcuts(): void;
    setupTooltips(): void;
    setupProgressIndicators(): void;
}

const AdminPanelEnhance: AdminPanelEnhance = {
    /**
     * 初始化管理面板增强功能
     */
    init() {
        console.log('🎨 Initializing admin panel enhancement...');
        
        // 等待DOM加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupAll();
            });
        } else {
            this.setupAll();
        }
    },

    /**
     * 设置所有功能
     */
    setupAll() {
        this.setupAnimations();
        this.setupFormEnhancements();
        this.setupNotifications();
        this.setupKeyboardShortcuts();
        this.setupTooltips();
        this.setupProgressIndicators();
        console.log('✅ Admin panel enhancement initialized');
    },

    /**
     * 设置动画效果
     */
    setupAnimations() {
        // 为管理面板添加入场动画
        const observeAdminElements = () => {
            if ('IntersectionObserver' in window) {
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('animate-in');
                        }
                    });
                }, {
                    threshold: 0.1,
                    rootMargin: '0px 0px -50px 0px'
                });

                // 观察管理面板元素
                const adminElements = document.querySelectorAll('.admin-tab-panel, .admin-section, .admin-action-btn');
                adminElements.forEach((element, index) => {
                    element.style.animationDelay = `${index * 0.1}s`;
                    observer.observe(element);
                });
            }
        };

        // 监听管理面板打开事件
        const adminPanel = document.getElementById('admin-panel-modal');
        if (adminPanel) {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                        const target = mutation.target as HTMLElement;
                        if (target.style.display === 'flex') {
                            setTimeout(observeAdminElements, 100);
                        }
                    }
                });
            });

            observer.observe(adminPanel, {
                attributes: true,
                attributeFilter: ['style']
            });
        }

        console.log('✅ Admin panel animations setup complete');
    },

    /**
     * 设置表单增强
     */
    setupFormEnhancements() {
        // 浮动标签效果
        const setupFloatingLabels = () => {
            const formGroups = document.querySelectorAll('.admin-form-group');
            formGroups.forEach(group => {
                const input = group.querySelector('input, textarea') as HTMLInputElement;
                const label = group.querySelector('label');
                
                if (input && label && !group.classList.contains('floating-label')) {
                    group.classList.add('floating-label');
                    
                    // 检查初始状态
                    const checkFloating = () => {
                        if (input.value || input === document.activeElement) {
                            group.classList.add('floating');
                        } else {
                            group.classList.remove('floating');
                        }
                    };

                    input.addEventListener('focus', checkFloating);
                    input.addEventListener('blur', checkFloating);
                    input.addEventListener('input', checkFloating);
                    
                    // 初始检查
                    checkFloating();
                }
            });
        };

        // 实时表单验证增强
        const enhanceFormValidation = () => {
            const inputs = document.querySelectorAll('.admin-form-group input, .admin-form-group textarea');
            inputs.forEach(input => {
                input.addEventListener('input', (e) => {
                    const target = e.target as HTMLInputElement;
                    const formGroup = target.closest('.admin-form-group');
                    
                    if (formGroup) {
                        // 移除之前的验证状态
                        formGroup.classList.remove('valid', 'invalid');
                        
                        // 添加新的验证状态
                        if (target.value.length > 0) {
                            if (target.checkValidity()) {
                                formGroup.classList.add('valid');
                            } else {
                                formGroup.classList.add('invalid');
                            }
                        }
                    }
                });
            });
        };

        // 按钮加载状态
        const setupButtonLoading = () => {
            const buttons = document.querySelectorAll('.admin-btn');
            buttons.forEach(button => {
                button.addEventListener('click', () => {
                    if (!button.classList.contains('loading')) {
                        button.classList.add('loading');
                        
                        // 模拟加载完成（实际应用中应该在操作完成后移除）
                        setTimeout(() => {
                            button.classList.remove('loading');
                        }, 2000);
                    }
                });
            });
        };

        setupFloatingLabels();
        enhanceFormValidation();
        setupButtonLoading();

        console.log('✅ Form enhancements setup complete');
    },

    /**
     * 设置通知系统
     */
    setupNotifications() {
        // 创建通知容器
        let notificationContainer = document.getElementById('admin-notifications');
        if (!notificationContainer) {
            notificationContainer = document.createElement('div');
            notificationContainer.id = 'admin-notifications';
            notificationContainer.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10001;
                pointer-events: none;
            `;
            document.body.appendChild(notificationContainer);
        }

        // 通知显示函数
        const showNotification = (message: string, type: 'success' | 'error' | 'warning' = 'success', duration: number = 3000) => {
            const notification = document.createElement('div');
            notification.className = `admin-notification admin-notification-${type} show`;
            notification.style.pointerEvents = 'auto';
            
            const iconMap = {
                success: '<svg class="admin-icon" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"></path></svg>',
                error: '<svg class="admin-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>',
                warning: '<svg class="admin-icon" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>'
            };

            notification.innerHTML = `
                <div class="admin-notification-content">
                    ${iconMap[type]}
                    <span>${message}</span>
                </div>
            `;

            notificationContainer!.appendChild(notification);

            // 自动移除
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }, duration);
        };

        // 将通知函数添加到全局作用域
        (window as any).showAdminNotification = showNotification;

        console.log('✅ Notification system setup complete');
    },

    /**
     * 设置键盘快捷键
     */
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + K: 打开管理面板
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                const adminPanelToggle = document.getElementById('admin-panel-toggle');
                if (adminPanelToggle && window.Stack && window.Stack.showAdminPanel) {
                    window.Stack.showAdminPanel();
                }
            }

            // Escape: 关闭管理面板
            if (e.key === 'Escape') {
                const adminPanel = document.getElementById('admin-panel-modal');
                if (adminPanel && adminPanel.style.display === 'flex') {
                    if (window.Stack && window.Stack.hideAdminPanel) {
                        window.Stack.hideAdminPanel();
                    }
                }
            }

            // Ctrl/Cmd + S: 保存设置
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                const adminPanel = document.getElementById('admin-panel-modal');
                if (adminPanel && adminPanel.style.display === 'flex') {
                    e.preventDefault();
                    const saveButton = document.getElementById('admin-save-settings');
                    if (saveButton) {
                        saveButton.click();
                    }
                }
            }

            // Tab键导航增强
            if (e.key === 'Tab') {
                const adminPanel = document.getElementById('admin-panel-modal');
                if (adminPanel && adminPanel.style.display === 'flex') {
                    const focusableElements = adminPanel.querySelectorAll(
                        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                    );
                    const firstElement = focusableElements[0] as HTMLElement;
                    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

                    if (e.shiftKey && document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    } else if (!e.shiftKey && document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        });

        console.log('✅ Keyboard shortcuts setup complete');
    },

    /**
     * 设置工具提示
     */
    setupTooltips() {
        // 创建工具提示元素
        let tooltip = document.getElementById('admin-tooltip');
        if (!tooltip) {
            tooltip = document.createElement('div');
            tooltip.id = 'admin-tooltip';
            tooltip.style.cssText = `
                position: absolute;
                background: var(--card-background);
                color: var(--card-text-color-main);
                padding: 0.5rem 0.75rem;
                border-radius: 6px;
                font-size: 0.875rem;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                border: 1px solid var(--card-separator-color);
                z-index: 10002;
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.2s ease;
                max-width: 200px;
                word-wrap: break-word;
            `;
            document.body.appendChild(tooltip);
        }

        // 为带有title属性的元素添加工具提示
        const setupTooltipForElement = (element: Element) => {
            const title = element.getAttribute('title') || element.getAttribute('data-tooltip');
            if (title) {
                element.removeAttribute('title'); // 移除默认工具提示
                element.setAttribute('data-tooltip', title);

                element.addEventListener('mouseenter', (e) => {
                    const target = e.target as HTMLElement;
                    const rect = target.getBoundingClientRect();
                    const tooltipText = target.getAttribute('data-tooltip');
                    
                    if (tooltipText && tooltip) {
                        tooltip.textContent = tooltipText;
                        tooltip.style.left = `${rect.left + rect.width / 2}px`;
                        tooltip.style.top = `${rect.top - 10}px`;
                        tooltip.style.transform = 'translateX(-50%) translateY(-100%)';
                        tooltip.style.opacity = '1';
                    }
                });

                element.addEventListener('mouseleave', () => {
                    if (tooltip) {
                        tooltip.style.opacity = '0';
                    }
                });
            }
        };

        // 初始设置
        const elementsWithTooltips = document.querySelectorAll('[title], [data-tooltip]');
        elementsWithTooltips.forEach(setupTooltipForElement);

        // 监听动态添加的元素
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const element = node as Element;
                        if (element.hasAttribute('title') || element.hasAttribute('data-tooltip')) {
                            setupTooltipForElement(element);
                        }
                        // 检查子元素
                        const childElements = element.querySelectorAll('[title], [data-tooltip]');
                        childElements.forEach(setupTooltipForElement);
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        console.log('✅ Tooltips setup complete');
    },

    /**
     * 设置进度指示器
     */
    setupProgressIndicators() {
        // 为长时间操作添加进度指示器
        const createProgressBar = (container: HTMLElement, progress: number = 0) => {
            let progressBar = container.querySelector('.admin-progress-bar') as HTMLElement;
            
            if (!progressBar) {
                progressBar = document.createElement('div');
                progressBar.className = 'admin-progress-bar';
                progressBar.style.cssText = `
                    width: 100%;
                    height: 4px;
                    background: var(--card-separator-color);
                    border-radius: 2px;
                    overflow: hidden;
                    margin-top: 1rem;
                `;
                
                const progressFill = document.createElement('div');
                progressFill.className = 'admin-progress-fill';
                progressFill.style.cssText = `
                    height: 100%;
                    background: var(--admin-primary-gradient);
                    width: 0%;
                    transition: width 0.3s ease;
                    border-radius: 2px;
                `;
                
                progressBar.appendChild(progressFill);
                container.appendChild(progressBar);
            }
            
            const progressFill = progressBar.querySelector('.admin-progress-fill') as HTMLElement;
            if (progressFill) {
                progressFill.style.width = `${Math.min(Math.max(progress, 0), 100)}%`;
            }
            
            return progressBar;
        };

        // 为表单提交添加进度指示
        const forms = document.querySelectorAll('.admin-form');
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                const formElement = e.target as HTMLFormElement;
                const progressBar = createProgressBar(formElement);
                
                // 模拟进度更新
                let progress = 0;
                const interval = setInterval(() => {
                    progress += Math.random() * 20;
                    const progressFill = progressBar.querySelector('.admin-progress-fill') as HTMLElement;
                    if (progressFill) {
                        progressFill.style.width = `${Math.min(progress, 90)}%`;
                    }
                    
                    if (progress >= 90) {
                        clearInterval(interval);
                    }
                }, 200);
                
                // 完成时移除进度条
                setTimeout(() => {
                    clearInterval(interval);
                    const progressFill = progressBar.querySelector('.admin-progress-fill') as HTMLElement;
                    if (progressFill) {
                        progressFill.style.width = '100%';
                    }
                    setTimeout(() => {
                        if (progressBar.parentNode) {
                            progressBar.parentNode.removeChild(progressBar);
                        }
                    }, 500);
                }, 3000);
            });
        });

        // 将进度条创建函数添加到全局作用域
        (window as any).createAdminProgressBar = createProgressBar;

        console.log('✅ Progress indicators setup complete');
    }
};

// 自动初始化
AdminPanelEnhance.init();

// 导出到全局作用域
(window as any).AdminPanelEnhance = AdminPanelEnhance;