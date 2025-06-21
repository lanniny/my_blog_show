/*!
*   GitHub Configuration for Image Upload
*
*   @author: Alex (Engineer)
*   @project: Hugo Blog GitHub Integration
*   @description: GitHub API configuration for image upload to my_blog_img repository
*/

/**
 * GitHub Configuration
 * 注意：在生产环境中，这些配置应该通过环境变量或安全的配置管理系统来管理
 */
window.GitHubConfig = {
    // GitHub API 基础配置
    apiUrl: 'https://api.github.com',
    
    // 图片仓库配置
    imageRepo: {
        owner: 'lanniny',
        repo: 'my_blog_img',
        branch: 'main'
    },
    
    // 博客源码仓库配置
    sourceRepo: {
        owner: 'lanniny',
        repo: 'my_blog_source',
        branch: 'main'
    },
    
    // 博客展示仓库配置
    showRepo: {
        owner: 'lanniny',
        repo: 'my_blog_show',
        branch: 'main'
    },
    
    // 图片上传配置
    imageUpload: {
        // 支持的图片格式
        supportedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
        
        // 最大文件大小 (5MB)
        maxFileSize: 5 * 1024 * 1024,
        
        // 图片压缩配置
        compression: {
            quality: 0.8,
            maxWidth: 1920,
            maxHeight: 1080,
            format: 'webp' // 默认转换为WebP格式
        },
        
        // 图片存储路径配置
        paths: {
            articles: 'articles/',
            avatars: 'avatars/',
            backgrounds: 'backgrounds/',
            general: 'general/',
            thumbnails: 'thumbnails/'
        },
        
        // CDN配置
        cdn: {
            baseUrl: 'https://raw.githubusercontent.com/lanniny/my_blog_img/main/',
            // 或者使用 jsDelivr CDN
            jsDelivrUrl: 'https://cdn.jsdelivr.net/gh/lanniny/my_blog_img@main/'
        }
    },
    
    // API 限制配置
    rateLimit: {
        // GitHub API 每小时请求限制
        requestsPerHour: 5000,
        
        // 上传重试配置
        maxRetries: 3,
        retryDelay: 1000 // 毫秒
    },
    
    // 安全配置
    security: {
        // 是否启用CORS检查
        enableCors: true,
        
        // 允许的域名
        allowedDomains: [
            'lanniny-blog.netlify.app',
            'localhost',
            '127.0.0.1'
        ]
    },
    
    // 开发模式配置
    development: {
        // 是否启用调试日志
        enableDebugLog: true,
        
        // 是否使用模拟上传（不实际上传到GitHub）
        useMockUpload: false,
        
        // 本地测试仓库配置
        localTestRepo: {
            owner: 'lanniny',
            repo: 'test-blog-img',
            branch: 'main'
        }
    },
    
    // 错误消息配置
    errorMessages: {
        'auth_failed': '认证失败，请检查访问令牌',
        'file_too_large': '文件大小超过限制（最大5MB）',
        'unsupported_format': '不支持的文件格式',
        'upload_failed': '上传失败，请稍后重试',
        'network_error': '网络错误，请检查网络连接',
        'rate_limit_exceeded': 'API请求频率超限，请稍后重试',
        'repo_not_found': '仓库不存在或无访问权限',
        'invalid_token': '无效的访问令牌'
    },
    
    // 成功消息配置
    successMessages: {
        'upload_success': '图片上传成功',
        'compression_success': '图片压缩完成',
        'format_converted': '图片格式转换完成'
    },
    
    // 工具函数
    utils: {
        /**
         * 获取完整的图片URL
         * @param {string} path - 图片在仓库中的路径
         * @param {boolean} useCDN - 是否使用CDN
         * @returns {string} 完整的图片URL
         */
        getImageUrl: function(path, useCDN = true) {
            const config = window.GitHubConfig.imageUpload;
            const baseUrl = useCDN ? config.cdn.jsDelivrUrl : config.cdn.baseUrl;
            return baseUrl + path;
        },
        
        /**
         * 生成唯一的文件名
         * @param {string} originalName - 原始文件名
         * @param {string} category - 图片分类
         * @returns {string} 唯一的文件名
         */
        generateUniqueFileName: function(originalName, category = 'general') {
            const timestamp = Date.now();
            const random = Math.random().toString(36).substring(2, 8);
            const extension = originalName.split('.').pop().toLowerCase();
            const baseName = originalName.split('.').slice(0, -1).join('.');
            const safeName = baseName.replace(/[^a-zA-Z0-9\-_]/g, '_');
            
            return `${category}/${timestamp}_${random}_${safeName}.${extension}`;
        },
        
        /**
         * 验证文件格式
         * @param {File} file - 文件对象
         * @returns {boolean} 是否为支持的格式
         */
        isValidImageFormat: function(file) {
            const extension = file.name.split('.').pop().toLowerCase();
            return window.GitHubConfig.imageUpload.supportedFormats.includes(extension);
        },
        
        /**
         * 验证文件大小
         * @param {File} file - 文件对象
         * @returns {boolean} 是否在大小限制内
         */
        isValidFileSize: function(file) {
            return file.size <= window.GitHubConfig.imageUpload.maxFileSize;
        },
        
        /**
         * 获取错误消息
         * @param {string} errorCode - 错误代码
         * @returns {string} 错误消息
         */
        getErrorMessage: function(errorCode) {
            return window.GitHubConfig.errorMessages[errorCode] || '未知错误';
        },
        
        /**
         * 获取成功消息
         * @param {string} successCode - 成功代码
         * @returns {string} 成功消息
         */
        getSuccessMessage: function(successCode) {
            return window.GitHubConfig.successMessages[successCode] || '操作成功';
        },
        
        /**
         * 检查是否为开发环境
         * @returns {boolean} 是否为开发环境
         */
        isDevelopment: function() {
            return window.location.hostname === 'localhost' || 
                   window.location.hostname === '127.0.0.1' ||
                   window.GitHubConfig.development.useMockUpload;
        },
        
        /**
         * 记录调试信息
         * @param {string} message - 调试消息
         * @param {any} data - 调试数据
         */
        debugLog: function(message, data = null) {
            if (window.GitHubConfig.development.enableDebugLog) {
                console.log(`[GitHub Image Uploader] ${message}`, data || '');
            }
        }
    }
};

// 导出配置（如果在模块环境中）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = window.GitHubConfig;
}

// 初始化日志
if (window.GitHubConfig.development.enableDebugLog) {
    console.log('🔧 GitHub Configuration loaded successfully');
}

// Force deployment trigger - 2025-06-21T13:20:00Z
