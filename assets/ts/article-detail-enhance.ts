/**
 * Article Detail Page Enhancement JavaScript
 * 文章详情页交互增强
 */

interface ArticleDetailEnhance {
    init(): void;
    setupTableOfContents(): void;
    setupReadingProgress(): void;
    setupCodeCopyButtons(): void;
    setupImageLightbox(): void;
    setupSmoothScrolling(): void;
    setupReadingTime(): void;
    setupShareButtons(): void;
}

const ArticleDetailEnhance: ArticleDetailEnhance = {
    /**
     * 初始化文章详情页增强功能
     */
    init() {
        console.log('📖 Initializing article detail enhancement...');
        
        // 检查是否在文章详情页
        if (!this.isArticlePage()) {
            return;
        }
        
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
     * 检查是否在文章详情页
     */
    isArticlePage(): boolean {
        return document.querySelector('.article-content') !== null ||
               document.querySelector('.post-content') !== null ||
               document.querySelector('[class*="content"]') !== null;
    },

    /**
     * 设置所有功能
     */
    setupAll() {
        this.setupTableOfContents();
        this.setupReadingProgress();
        this.setupCodeCopyButtons();
        this.setupImageLightbox();
        this.setupSmoothScrolling();
        this.setupReadingTime();
        this.setupShareButtons();
        console.log('✅ Article detail enhancement initialized');
    },

    /**
     * 设置目录导航
     */
    setupTableOfContents() {
        const contentArea = document.querySelector('.article-content, .post-content, [class*="content"]') as HTMLElement;
        const sidebar = document.querySelector('.article-sidebar, .sidebar') as HTMLElement;
        
        if (!contentArea || !sidebar) {
            console.log('ℹ️ Content area or sidebar not found, skipping TOC');
            return;
        }

        // 查找所有标题
        const headings = contentArea.querySelectorAll('h1, h2, h3, h4, h5, h6');
        if (headings.length === 0) {
            console.log('ℹ️ No headings found, skipping TOC');
            return;
        }

        // 创建目录容器
        const tocContainer = document.createElement('div');
        tocContainer.className = 'table-of-contents';
        tocContainer.innerHTML = '<h3>目录</h3>';

        const tocList = document.createElement('ul');
        tocContainer.appendChild(tocList);

        // 生成目录项
        headings.forEach((heading, index) => {
            const headingElement = heading as HTMLElement;
            const level = parseInt(headingElement.tagName.charAt(1));
            const text = headingElement.textContent || '';
            const id = `heading-${index}`;
            
            // 为标题添加ID
            headingElement.id = id;
            
            // 创建目录项
            const listItem = document.createElement('li');
            listItem.style.marginLeft = `${(level - 1) * 1}rem`;
            
            const link = document.createElement('a');
            link.href = `#${id}`;
            link.textContent = text;
            link.className = 'toc-link';
            
            listItem.appendChild(link);
            tocList.appendChild(listItem);
        });

        // 插入目录到侧边栏
        sidebar.insertBefore(tocContainer, sidebar.firstChild);

        // 设置目录点击事件
        this.setupTocScrollSpy(tocContainer);

        console.log('✅ Table of contents setup complete');
    },

    /**
     * 设置目录滚动监听
     */
    setupTocScrollSpy(tocContainer: HTMLElement) {
        const links = tocContainer.querySelectorAll('.toc-link');
        const headings = document.querySelectorAll('[id^="heading-"]');
        
        let ticking = false;
        
        const updateActiveLink = () => {
            const scrollTop = window.pageYOffset;
            const windowHeight = window.innerHeight;
            
            let activeHeading: Element | null = null;
            
            headings.forEach(heading => {
                const rect = heading.getBoundingClientRect();
                if (rect.top <= windowHeight * 0.3) {
                    activeHeading = heading;
                }
            });
            
            // 更新活动链接
            links.forEach(link => {
                link.classList.remove('active');
                if (activeHeading && link.getAttribute('href') === `#${activeHeading.id}`) {
                    link.classList.add('active');
                }
            });
            
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateActiveLink);
                ticking = true;
            }
        });

        // 初始更新
        updateActiveLink();
    },

    /**
     * 设置阅读进度
     */
    setupReadingProgress() {
        const sidebar = document.querySelector('.article-sidebar, .sidebar') as HTMLElement;
        const contentArea = document.querySelector('.article-content, .post-content') as HTMLElement;
        
        if (!sidebar || !contentArea) {
            console.log('ℹ️ Sidebar or content area not found, skipping reading progress');
            return;
        }

        // 创建阅读进度容器
        const progressContainer = document.createElement('div');
        progressContainer.className = 'reading-progress-container';
        progressContainer.innerHTML = `
            <h4>阅读进度</h4>
            <div class="reading-progress-bar">
                <div class="reading-progress-fill"></div>
            </div>
            <div class="reading-time">预计阅读时间: <span id="reading-time">0</span> 分钟</div>
        `;

        sidebar.appendChild(progressContainer);

        const progressFill = progressContainer.querySelector('.reading-progress-fill') as HTMLElement;
        let ticking = false;

        const updateProgress = () => {
            const contentRect = contentArea.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const contentHeight = contentArea.offsetHeight;
            const scrolled = Math.max(0, -contentRect.top);
            const progress = Math.min(100, (scrolled / (contentHeight - windowHeight)) * 100);
            
            if (progressFill) {
                progressFill.style.width = `${Math.max(0, progress)}%`;
            }
            
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateProgress);
                ticking = true;
            }
        });

        // 初始更新
        updateProgress();

        console.log('✅ Reading progress setup complete');
    },

    /**
     * 设置代码复制按钮
     */
    setupCodeCopyButtons() {
        const codeBlocks = document.querySelectorAll('pre');
        
        codeBlocks.forEach(codeBlock => {
            // 创建复制按钮
            const copyButton = document.createElement('button');
            copyButton.className = 'code-copy-btn';
            copyButton.textContent = '复制';
            copyButton.setAttribute('aria-label', '复制代码');
            
            // 添加点击事件
            copyButton.addEventListener('click', async () => {
                const code = codeBlock.querySelector('code');
                if (code) {
                    try {
                        await navigator.clipboard.writeText(code.textContent || '');
                        copyButton.textContent = '已复制!';
                        copyButton.style.background = '#10b981';
                        
                        setTimeout(() => {
                            copyButton.textContent = '复制';
                            copyButton.style.background = '';
                        }, 2000);
                    } catch (err) {
                        console.error('复制失败:', err);
                        copyButton.textContent = '复制失败';
                        setTimeout(() => {
                            copyButton.textContent = '复制';
                        }, 2000);
                    }
                }
            });
            
            // 添加到代码块
            codeBlock.style.position = 'relative';
            codeBlock.appendChild(copyButton);
        });

        console.log(`✅ Code copy buttons setup complete (${codeBlocks.length} blocks)`);
    },

    /**
     * 设置图片灯箱效果
     */
    setupImageLightbox() {
        const images = document.querySelectorAll('.article-content img, .post-content img');
        
        // 创建灯箱容器
        const lightbox = document.createElement('div');
        lightbox.className = 'image-lightbox';
        lightbox.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: none;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            cursor: pointer;
        `;
        
        const lightboxImg = document.createElement('img');
        lightboxImg.style.cssText = `
            max-width: 90%;
            max-height: 90%;
            object-fit: contain;
            border-radius: 8px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
        `;
        
        lightbox.appendChild(lightboxImg);
        document.body.appendChild(lightbox);
        
        // 为每个图片添加点击事件
        images.forEach(img => {
            img.style.cursor = 'pointer';
            img.addEventListener('click', () => {
                lightboxImg.src = (img as HTMLImageElement).src;
                lightbox.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            });
        });
        
        // 点击灯箱关闭
        lightbox.addEventListener('click', () => {
            lightbox.style.display = 'none';
            document.body.style.overflow = '';
        });
        
        // ESC键关闭
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.style.display === 'flex') {
                lightbox.style.display = 'none';
                document.body.style.overflow = '';
            }
        });

        console.log(`✅ Image lightbox setup complete (${images.length} images)`);
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
                if (href && href !== '#') {
                    const target = document.querySelector(href);
                    if (target) {
                        e.preventDefault();
                        const offsetTop = (target as HTMLElement).getBoundingClientRect().top + window.pageYOffset - 100;
                        window.scrollTo({
                            top: offsetTop,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });

        console.log(`✅ Smooth scrolling setup complete (${anchorLinks.length} links)`);
    },

    /**
     * 计算阅读时间
     */
    setupReadingTime() {
        const contentArea = document.querySelector('.article-content, .post-content') as HTMLElement;
        const readingTimeElement = document.getElementById('reading-time');
        
        if (!contentArea || !readingTimeElement) {
            console.log('ℹ️ Content area or reading time element not found');
            return;
        }

        // 计算字数（中英文混合）
        const text = contentArea.textContent || '';
        const chineseChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
        const englishWords = (text.match(/[a-zA-Z]+/g) || []).length;
        
        // 中文按字符计算，英文按单词计算
        const totalWords = chineseChars + englishWords;
        
        // 假设阅读速度：中文300字/分钟，英文200词/分钟
        const readingSpeed = 250; // 平均阅读速度
        const readingTime = Math.ceil(totalWords / readingSpeed);
        
        readingTimeElement.textContent = readingTime.toString();

        console.log(`✅ Reading time calculated: ${readingTime} minutes (${totalWords} words)`);
    },

    /**
     * 设置分享按钮
     */
    setupShareButtons() {
        const articleHeader = document.querySelector('.article-header, .post-header');
        
        if (!articleHeader) {
            console.log('ℹ️ Article header not found, skipping share buttons');
            return;
        }

        // 创建分享按钮容器
        const shareContainer = document.createElement('div');
        shareContainer.className = 'article-share';
        shareContainer.style.cssText = `
            margin-top: 1.5rem;
            display: flex;
            justify-content: center;
            gap: 1rem;
            flex-wrap: wrap;
        `;

        const currentUrl = window.location.href;
        const title = document.title;

        const shareButtons = [
            {
                name: '微博',
                url: `https://service.weibo.com/share/share.php?url=${encodeURIComponent(currentUrl)}&title=${encodeURIComponent(title)}`,
                color: '#e6162d'
            },
            {
                name: 'Twitter',
                url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(title)}`,
                color: '#1da1f2'
            },
            {
                name: 'Facebook',
                url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
                color: '#4267b2'
            },
            {
                name: '复制链接',
                url: '',
                color: '#6c757d'
            }
        ];

        shareButtons.forEach(button => {
            const shareBtn = document.createElement('button');
            shareBtn.className = 'share-btn';
            shareBtn.textContent = button.name;
            shareBtn.style.cssText = `
                background: ${button.color};
                color: white;
                border: none;
                padding: 0.5rem 1rem;
                border-radius: 20px;
                font-size: 0.875rem;
                cursor: pointer;
                transition: all 0.3s ease;
                text-decoration: none;
                display: inline-block;
            `;

            if (button.name === '复制链接') {
                shareBtn.addEventListener('click', async () => {
                    try {
                        await navigator.clipboard.writeText(currentUrl);
                        shareBtn.textContent = '已复制!';
                        setTimeout(() => {
                            shareBtn.textContent = '复制链接';
                        }, 2000);
                    } catch (err) {
                        console.error('复制失败:', err);
                    }
                });
            } else {
                shareBtn.addEventListener('click', () => {
                    window.open(button.url, '_blank', 'width=600,height=400');
                });
            }

            shareBtn.addEventListener('mouseenter', () => {
                shareBtn.style.transform = 'translateY(-2px)';
                shareBtn.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
            });

            shareBtn.addEventListener('mouseleave', () => {
                shareBtn.style.transform = 'translateY(0)';
                shareBtn.style.boxShadow = 'none';
            });

            shareContainer.appendChild(shareBtn);
        });

        articleHeader.appendChild(shareContainer);

        console.log('✅ Share buttons setup complete');
    }
};

// 自动初始化
ArticleDetailEnhance.init();

// 导出到全局作用域
(window as any).ArticleDetailEnhance = ArticleDetailEnhance;