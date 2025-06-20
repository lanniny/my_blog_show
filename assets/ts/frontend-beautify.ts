/**
 * Frontend Beautification JavaScript
 * 前台界面美化交互效果
 */

interface FrontendBeautify {
    init(): void;
    setupReadingProgress(): void;
    setupBackToTop(): void;
    setupSmoothScrolling(): void;
    setupImageLazyLoading(): void;
    setupAnimations(): void;
}

const FrontendBeautify: FrontendBeautify = {
    /**
     * 初始化所有美化功能
     */
    init() {
        console.log('🎨 Initializing frontend beautification...');
        
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
        this.setupReadingProgress();
        this.setupBackToTop();
        this.setupSmoothScrolling();
        this.setupImageLazyLoading();
        this.setupAnimations();
        console.log('✅ Frontend beautification initialized');
    },

    /**
     * 设置阅读进度条
     */
    setupReadingProgress() {
        // 创建进度条元素
        const progressBar = document.createElement('div');
        progressBar.className = 'reading-progress';
        document.body.appendChild(progressBar);

        // 监听滚动事件
        let ticking = false;
        
        const updateProgress = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (scrollTop / scrollHeight) * 100;
            
            progressBar.style.width = `${Math.min(progress, 100)}%`;
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateProgress);
                ticking = true;
            }
        });

        console.log('✅ Reading progress bar setup complete');
    },

    /**
     * 设置返回顶部按钮
     */
    setupBackToTop() {
        // 创建返回顶部按钮
        const backToTopBtn = document.createElement('a');
        backToTopBtn.href = '#';
        backToTopBtn.className = 'back-to-top';
        backToTopBtn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 15l-6-6-6 6"></path>
            </svg>
        `;
        backToTopBtn.setAttribute('aria-label', '返回顶部');
        document.body.appendChild(backToTopBtn);

        // 监听滚动事件，控制按钮显示
        let ticking = false;
        
        const toggleBackToTop = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(toggleBackToTop);
                ticking = true;
            }
        });

        // 点击返回顶部
        backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        console.log('✅ Back to top button setup complete');
    },

    /**
     * 设置平滑滚动
     */
    setupSmoothScrolling() {
        // 为所有锚点链接添加平滑滚动
        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        
        anchorLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href === '#' || href === '#top') {
                    e.preventDefault();
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                    return;
                }

                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    const offsetTop = target.getBoundingClientRect().top + window.pageYOffset - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });

        console.log('✅ Smooth scrolling setup complete');
    },

    /**
     * 设置图片懒加载增强
     */
    setupImageLazyLoading() {
        // 如果浏览器支持 Intersection Observer
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target as HTMLImageElement;
                        
                        // 添加加载动画
                        img.style.opacity = '0';
                        img.style.transition = 'opacity 0.3s ease';
                        
                        // 图片加载完成后显示
                        img.addEventListener('load', () => {
                            img.style.opacity = '1';
                        });

                        // 停止观察这个图片
                        observer.unobserve(img);
                    }
                });
            });

            // 观察所有文章图片
            const images = document.querySelectorAll('.article-image img');
            images.forEach(img => {
                imageObserver.observe(img);
            });

            console.log('✅ Enhanced image lazy loading setup complete');
        }
    },

    /**
     * 设置动画效果
     */
    setupAnimations() {
        // 设置滚动触发动画
        if ('IntersectionObserver' in window) {
            const animationObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            // 观察文章卡片
            const articles = document.querySelectorAll('.article-list article');
            articles.forEach((article, index) => {
                // 添加延迟动画类
                article.style.animationDelay = `${index * 0.1}s`;
                animationObserver.observe(article);
            });

            // 观察侧边栏组件
            const widgets = document.querySelectorAll('.widget');
            widgets.forEach((widget, index) => {
                widget.style.animationDelay = `${index * 0.1}s`;
                animationObserver.observe(widget);
            });

            console.log('✅ Scroll animations setup complete');
        }

        // 添加鼠标悬停效果增强
        this.setupHoverEffects();
    },

    /**
     * 设置悬停效果增强
     */
    setupHoverEffects() {
        // 文章卡片悬停效果
        const articles = document.querySelectorAll('.article-list article');
        articles.forEach(article => {
            article.addEventListener('mouseenter', () => {
                // 添加轻微的倾斜效果
                article.style.transform = 'translateY(-8px) rotateX(2deg)';
            });

            article.addEventListener('mouseleave', () => {
                article.style.transform = 'translateY(0) rotateX(0deg)';
            });
        });

        // 标签云悬停效果
        const tagLinks = document.querySelectorAll('.tag-cloud a');
        tagLinks.forEach(tag => {
            tag.addEventListener('mouseenter', () => {
                // 随机颜色效果
                const colors = [
                    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
                ];
                const randomColor = colors[Math.floor(Math.random() * colors.length)];
                tag.style.background = randomColor;
            });
        });

        console.log('✅ Hover effects setup complete');
    }
};

// 自动初始化
FrontendBeautify.init();

// 导出到全局作用域
(window as any).FrontendBeautify = FrontendBeautify;