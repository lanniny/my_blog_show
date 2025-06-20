/**
 * 社交分享功能模块
 * 支持微信、微博、Twitter、Facebook、LinkedIn等平台分享
 */

interface ShareData {
    url: string;
    title: string;
    description: string;
    image?: string;
}

class SocialShare {
    private shareData: ShareData;
    private qrCodeGenerated: boolean = false;

    constructor() {
        this.shareData = (window as any).shareData || {
            url: window.location.href,
            title: document.title,
            description: '',
            image: ''
        };
        
        this.init();
    }

    /**
     * 初始化分享功能
     */
    init(): void {
        console.log('🔗 初始化社交分享功能...');
        this.bindEvents();
        console.log('✅ 社交分享功能初始化完成');
    }

    /**
     * 绑定事件监听器
     */
    bindEvents(): void {
        // 微信分享按钮
        const wechatBtn = document.querySelector('.share-btn--wechat');
        if (wechatBtn) {
            wechatBtn.addEventListener('click', () => this.handleWechatShare());
        }

        // 复制链接按钮
        const copyBtn = document.querySelector('.share-btn--copy');
        if (copyBtn) {
            copyBtn.addEventListener('click', () => this.copyToClipboard());
        }

        // 微信二维码弹窗关闭
        const closeBtn = document.getElementById('wechat-qr-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeWechatModal());
        }

        // 点击弹窗外部关闭
        const modal = document.getElementById('wechat-qr-modal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeWechatModal();
                }
            });
        }

        // ESC键关闭弹窗
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeWechatModal();
            }
        });

        console.log('✅ 分享事件监听器绑定完成');
    }

    /**
     * 处理微信分享
     */
    handleWechatShare(): void {
        console.log('📱 打开微信分享二维码...');
        this.showWechatModal();
        
        if (!this.qrCodeGenerated) {
            this.generateQRCode();
        }
    }

    /**
     * 显示微信二维码弹窗
     */
    showWechatModal(): void {
        const modal = document.getElementById('wechat-qr-modal');
        if (modal) {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    }

    /**
     * 关闭微信二维码弹窗
     */
    closeWechatModal(): void {
        const modal = document.getElementById('wechat-qr-modal');
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = '';
        }
    }

    /**
     * 生成二维码
     */
    generateQRCode(): void {
        const qrContainer = document.getElementById('wechat-qr-code');
        if (!qrContainer) return;

        // 使用在线二维码生成服务
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(this.shareData.url)}`;
        
        const img = document.createElement('img');
        img.src = qrUrl;
        img.alt = '微信分享二维码';
        img.style.width = '200px';
        img.style.height = '200px';
        
        qrContainer.innerHTML = '';
        qrContainer.appendChild(img);
        
        this.qrCodeGenerated = true;
        console.log('✅ 二维码生成完成');
    }

    /**
     * 复制链接到剪贴板
     */
    async copyToClipboard(): Promise<void> {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                // 现代浏览器的Clipboard API
                await navigator.clipboard.writeText(this.shareData.url);
            } else {
                // 兼容旧浏览器的方法
                const textArea = document.createElement('textarea');
                textArea.value = this.shareData.url;
                textArea.style.position = 'fixed';
                textArea.style.left = '-999999px';
                textArea.style.top = '-999999px';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                document.execCommand('copy');
                textArea.remove();
            }
            
            this.showCopySuccess();
            console.log('✅ 链接已复制到剪贴板');
        } catch (err) {
            console.error('❌ 复制失败:', err);
            this.showCopyError();
        }
    }

    /**
     * 显示复制成功提示
     */
    showCopySuccess(): void {
        this.showNotification('链接已复制到剪贴板！', 'success');
    }

    /**
     * 显示复制失败提示
     */
    showCopyError(): void {
        this.showNotification('复制失败，请手动复制链接', 'error');
    }

    /**
     * 显示通知消息
     */
    showNotification(message: string, type: 'success' | 'error' = 'success'): void {
        // 创建通知元素
        const notification = document.createElement('div');
        notification.className = `share-notification share-notification--${type}`;
        notification.textContent = message;
        
        // 添加到页面
        document.body.appendChild(notification);
        
        // 显示动画
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // 自动隐藏
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    /**
     * 获取分享数据
     */
    getShareData(): ShareData {
        return this.shareData;
    }
}

// 初始化分享功能
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.article-share')) {
        new SocialShare();
    }
});

// 导出到全局
(window as any).SocialShare = SocialShare;
