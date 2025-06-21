/**
 * 博客性能优化模块
 * 包含图片懒加载、资源预加载、性能监控等功能
 */

interface PerformanceMetrics {
    fcp: number; // First Contentful Paint
    lcp: number; // Largest Contentful Paint
    fid: number; // First Input Delay
    cls: number; // Cumulative Layout Shift
    ttfb: number; // Time to First Byte
}

class BlogPerformanceOptimizer {
    private observer: IntersectionObserver | null = null;
    private metrics: Partial<PerformanceMetrics> = {};
    private isDebugMode: boolean = false;

    constructor() {
        this.isDebugMode = document.documentElement.getAttribute('data-debug') === 'true';
        this.init();
    }

    /**
     * 初始化性能优化功能
     */
    init(): void {
        console.log('🚀 初始化博客性能优化...');
        
        // 等待DOM加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupOptimizations();
            });
        } else {
            this.setupOptimizations();
        }
    }

    /**
     * 设置所有优化功能
     */
    private setupOptimizations(): void {
        this.setupLazyLoading();
        this.setupResourcePreloading();
        this.setupPerformanceMonitoring();
        this.setupImageOptimization();
        this.setupScrollOptimization();
        this.setupFontOptimization();
        
        if (this.isDebugMode) {
            this.setupDebugMode();
        }
        
        console.log('✅ 性能优化功能已启用');
    }

    /**
     * 设置图片懒加载
     */
    private setupLazyLoading(): void {
        // 检查浏览器是否支持原生懒加载
        if ('loading' in HTMLImageElement.prototype) {
            // 使用原生懒加载
            const images = document.querySelectorAll('img[data-src]');
            images.forEach(img => {
                const image = img as HTMLImageElement;
                image.src = image.dataset.src || '';
                image.loading = 'lazy';
                image.classList.add('loaded');
            });
        } else {
            // 使用Intersection Observer实现懒加载
            this.setupIntersectionObserver();
        }
    }

    /**
     * 设置Intersection Observer
     */
    private setupIntersectionObserver(): void {
        const options = {
            root: null,
            rootMargin: '50px',
            threshold: 0.1
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target as HTMLImageElement;
                    this.loadImage(img);
                    this.observer?.unobserve(img);
                }
            });
        }, options);

        // 观察所有需要懒加载的图片
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => {
            this.observer?.observe(img);
        });
    }

    /**
     * 加载图片
     */
    private loadImage(img: HTMLImageElement): void {
        const src = img.dataset.src;
        if (!src) return;

        // 创建新的图片对象预加载
        const imageLoader = new Image();
        imageLoader.onload = () => {
            img.src = src;
            img.classList.add('loaded');
            img.removeAttribute('data-src');
        };
        imageLoader.onerror = () => {
            img.classList.add('error');
            console.warn('图片加载失败:', src);
        };
        imageLoader.src = src;
    }

    /**
     * 设置资源预加载
     */
    private setupResourcePreloading(): void {
        // 预连接到外部域名
        this.preconnectDomain('https://fonts.googleapis.com');
        this.preconnectDomain('https://fonts.gstatic.com');

        // 预连接到CDN
        this.preconnectDomain('https://cdn.jsdelivr.net');

        console.log('✅ 资源预加载设置完成');
    }

    /**
     * 预加载资源
     */
    private preloadResource(href: string, as: string, type?: string): void {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = href;
        link.as = as;
        if (type) link.type = type;
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
    }

    /**
     * 预连接域名
     */
    private preconnectDomain(href: string): void {
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = href;
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
    }

    /**
     * 设置性能监控
     */
    private setupPerformanceMonitoring(): void {
        // 监控Core Web Vitals
        this.measureFCP();
        this.measureLCP();
        this.measureFID();
        this.measureCLS();
        this.measureTTFB();

        // 定期报告性能指标
        setTimeout(() => {
            this.reportMetrics();
        }, 5000);
    }

    /**
     * 测量First Contentful Paint
     */
    private measureFCP(): void {
        const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
            if (fcpEntry) {
                this.metrics.fcp = fcpEntry.startTime;
                observer.disconnect();
            }
        });
        observer.observe({ entryTypes: ['paint'] });
    }

    /**
     * 测量Largest Contentful Paint
     */
    private measureLCP(): void {
        const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            this.metrics.lcp = lastEntry.startTime;
        });
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
    }

    /**
     * 测量First Input Delay
     */
    private measureFID(): void {
        const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach(entry => {
                this.metrics.fid = entry.processingStart - entry.startTime;
            });
        });
        observer.observe({ entryTypes: ['first-input'] });
    }

    /**
     * 测量Cumulative Layout Shift
     */
    private measureCLS(): void {
        let clsValue = 0;
        const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach(entry => {
                if (!(entry as any).hadRecentInput) {
                    clsValue += (entry as any).value;
                }
            });
            this.metrics.cls = clsValue;
        });
        observer.observe({ entryTypes: ['layout-shift'] });
    }

    /**
     * 测量Time to First Byte
     */
    private measureTTFB(): void {
        const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (navigationEntry) {
            this.metrics.ttfb = navigationEntry.responseStart - navigationEntry.requestStart;
        }
    }

    /**
     * 报告性能指标
     */
    private reportMetrics(): void {
        if (this.isDebugMode) {
            console.table(this.metrics);
        }

        // 发送性能数据到分析服务（如果需要）
        // this.sendMetricsToAnalytics(this.metrics);
    }

    /**
     * 设置图片优化
     */
    private setupImageOptimization(): void {
        // 为图片添加loading="lazy"属性
        const images = document.querySelectorAll('img:not([loading])');
        images.forEach(img => {
            (img as HTMLImageElement).loading = 'lazy';
        });

        // 添加图片错误处理
        images.forEach(img => {
            img.addEventListener('error', () => {
                img.classList.add('img-error');
                console.warn('图片加载失败:', (img as HTMLImageElement).src);
            });
        });
    }

    /**
     * 设置滚动优化
     */
    private setupScrollOptimization(): void {
        let ticking = false;

        const updateScrollPosition = () => {
            // 更新滚动相关的UI
            const scrollTop = window.pageYOffset;
            const scrollPercent = scrollTop / (document.body.scrollHeight - window.innerHeight);
            
            // 更新进度条（如果存在）
            const progressBar = document.querySelector('.scroll-progress');
            if (progressBar) {
                (progressBar as HTMLElement).style.width = `${scrollPercent * 100}%`;
            }

            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollPosition);
                ticking = true;
            }
        }, { passive: true });
    }

    /**
     * 设置字体优化
     */
    private setupFontOptimization(): void {
        // 检查字体加载状态
        if ('fonts' in document) {
            document.fonts.ready.then(() => {
                document.body.classList.add('fonts-loaded');
                console.log('✅ 字体加载完成');
            });
        }
    }

    /**
     * 设置调试模式
     */
    private setupDebugMode(): void {
        console.log('🔧 调试模式已启用');
        
        // 添加性能标记
        const performanceMarkers = document.querySelectorAll('.performance-marker');
        performanceMarkers.forEach((marker, index) => {
            marker.setAttribute('data-perf-id', `marker-${index}`);
        });

        // 添加性能面板
        this.createPerformancePanel();
    }

    /**
     * 创建性能面板
     */
    private createPerformancePanel(): void {
        const panel = document.createElement('div');
        panel.id = 'performance-panel';
        panel.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 10px;
            border-radius: 5px;
            font-family: monospace;
            font-size: 12px;
            z-index: 10000;
            max-width: 300px;
        `;
        
        document.body.appendChild(panel);

        // 定期更新面板内容
        setInterval(() => {
            panel.innerHTML = `
                <div><strong>性能指标</strong></div>
                <div>FCP: ${this.metrics.fcp?.toFixed(2) || 'N/A'}ms</div>
                <div>LCP: ${this.metrics.lcp?.toFixed(2) || 'N/A'}ms</div>
                <div>FID: ${this.metrics.fid?.toFixed(2) || 'N/A'}ms</div>
                <div>CLS: ${this.metrics.cls?.toFixed(4) || 'N/A'}</div>
                <div>TTFB: ${this.metrics.ttfb?.toFixed(2) || 'N/A'}ms</div>
                <div>内存: ${(performance as any).memory ? Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024) + 'MB' : 'N/A'}</div>
            `;
        }, 1000);
    }

    /**
     * 清理资源
     */
    destroy(): void {
        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
        }
    }
}

// 自动初始化
const performanceOptimizer = new BlogPerformanceOptimizer();

// 导出到全局
declare global {
    interface Window {
        BlogPerformanceOptimizer: typeof BlogPerformanceOptimizer;
        performanceOptimizer: BlogPerformanceOptimizer;
    }
}

window.BlogPerformanceOptimizer = BlogPerformanceOptimizer;
window.performanceOptimizer = performanceOptimizer;

export default BlogPerformanceOptimizer;
