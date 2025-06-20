/**
 * Navigation Enhancement JavaScript
 * 导航栏交互增强
 */

interface NavigationEnhance {
    init(): void;
    setupScrollEffects(): void;
    setupScrollIndicator(): void;
    setupMobileMenu(): void;
    setupSearchEnhancement(): void;
}

const NavigationEnhance: NavigationEnhance = {
    /**
     * 初始化导航增强功能
     */
    init() {
        console.log('🧭 Initializing navigation enhancement...');
        
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
        this.setupScrollEffects();
        this.setupScrollIndicator();
        this.setupMobileMenu();
        this.setupSearchEnhancement();
        console.log('✅ Navigation enhancement initialized');
    },

    /**
     * 设置滚动效果
     */
    setupScrollEffects() {
        const header = document.querySelector('.main-header') as HTMLElement;
        if (!header) return;

        let lastScrollY = window.scrollY;
        let ticking = false;

        const updateHeader = () => {
            const scrollY = window.scrollY;
            
            // 添加滚动阴影效果
            if (scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            // 滚动隐藏/显示导航栏
            if (scrollY > lastScrollY && scrollY > 200) {
                // 向下滚动，隐藏导航栏
                header.style.transform = 'translateY(-100%)';
            } else {
                // 向上滚动，显示导航栏
                header.style.transform = 'translateY(0)';
            }

            lastScrollY = scrollY;
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateHeader);
                ticking = true;
            }
        });

        console.log('✅ Scroll effects setup complete');
    },

    /**
     * 设置滚动指示器
     */
    setupScrollIndicator() {
        // 创建滚动指示器
        const indicator = document.createElement('div');
        indicator.className = 'scroll-indicator';
        indicator.innerHTML = '<div class="scroll-indicator-bar"></div>';
        document.body.appendChild(indicator);

        const indicatorBar = indicator.querySelector('.scroll-indicator-bar') as HTMLElement;
        let ticking = false;

        const updateIndicator = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (scrollTop / scrollHeight) * 100;
            
            if (indicatorBar) {
                indicatorBar.style.width = `${Math.min(progress, 100)}%`;
            }
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateIndicator);
                ticking = true;
            }
        });

        console.log('✅ Scroll indicator setup complete');
    },

    /**
     * 设置移动端菜单增强
     */
    setupMobileMenu() {
        const menuToggle = document.querySelector('.menu-toggle') as HTMLElement;
        const mainMenu = document.querySelector('.main-menu') as HTMLElement;
        
        if (!menuToggle || !mainMenu) return;

        // 添加汉堡菜单动画
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            mainMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });

        // 点击菜单项后关闭菜单
        const menuItems = mainMenu.querySelectorAll('a');
        menuItems.forEach(item => {
            item.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                mainMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });

        // 点击外部区域关闭菜单
        document.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            if (!menuToggle.contains(target) && !mainMenu.contains(target)) {
                menuToggle.classList.remove('active');
                mainMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });

        console.log('✅ Mobile menu enhancement setup complete');
    },

    /**
     * 设置搜索增强
     */
    setupSearchEnhancement() {
        const searchButton = document.querySelector('.search-button') as HTMLElement;
        const searchModal = document.querySelector('.search-modal') as HTMLElement;
        
        if (!searchButton) return;

        // 搜索按钮点击效果
        searchButton.addEventListener('click', (e) => {
            e.preventDefault();
            
            // 添加点击动画
            searchButton.style.transform = 'scale(0.95)';
            setTimeout(() => {
                searchButton.style.transform = '';
            }, 150);

            // 如果有搜索模态框，显示它
            if (searchModal) {
                searchModal.classList.add('active');
                const searchInput = searchModal.querySelector('input') as HTMLInputElement;
                if (searchInput) {
                    setTimeout(() => searchInput.focus(), 100);
                }
            }
        });

        // 搜索模态框关闭
        if (searchModal) {
            const closeBtn = searchModal.querySelector('.search-close');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    searchModal.classList.remove('active');
                });
            }

            // ESC键关闭搜索
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && searchModal.classList.contains('active')) {
                    searchModal.classList.remove('active');
                }
            });

            // 点击外部关闭搜索
            searchModal.addEventListener('click', (e) => {
                if (e.target === searchModal) {
                    searchModal.classList.remove('active');
                }
            });
        }

        console.log('✅ Search enhancement setup complete');
    }
};

// 自动初始化
NavigationEnhance.init();

// 导出到全局作用域
(window as any).NavigationEnhance = NavigationEnhance;