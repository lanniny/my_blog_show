/*!
 * 评论系统状态检查脚本
 * 用于验证Gitalk评论系统的配置和状态
 */

(function() {
    'use strict';

    // 评论系统检查器
    class CommentSystemChecker {
        constructor() {
            this.results = {
                provider: null,
                gitalkConfig: null,
                templateLoaded: false,
                scriptsLoaded: false,
                containerFound: false,
                errors: []
            };
        }

        // 检查Hugo配置中的评论提供商
        checkProvider() {
            // 通过页面中的脚本标签推断当前使用的评论系统
            const scripts = Array.from(document.querySelectorAll('script')).map(s => s.src);
            
            if (scripts.some(src => src.includes('gitalk'))) {
                this.results.provider = 'gitalk';
                this.results.scriptsLoaded = true;
            } else if (scripts.some(src => src.includes('disqus'))) {
                this.results.provider = 'disqus';
            } else if (scripts.some(src => src.includes('utterances'))) {
                this.results.provider = 'utterances';
            } else if (scripts.some(src => src.includes('giscus'))) {
                this.results.provider = 'giscus';
            } else {
                this.results.provider = 'unknown';
                this.results.errors.push('未检测到已知的评论系统脚本');
            }
        }

        // 检查Gitalk配置
        checkGitalkConfig() {
            const container = document.getElementById('gitalk-container');
            if (container) {
                this.results.containerFound = true;
                this.results.templateLoaded = true;

                // 检查配置状态
                const content = container.innerHTML;
                if (content.includes('配置中')) {
                    this.results.gitalkConfig = 'configuration_needed';
                } else if (content.includes('加载失败')) {
                    this.results.gitalkConfig = 'error';
                    this.results.errors.push('Gitalk加载失败');
                } else if (content.includes('本地预览')) {
                    this.results.gitalkConfig = 'local_preview';
                } else if (content.trim() === '') {
                    this.results.gitalkConfig = 'loading';
                } else {
                    this.results.gitalkConfig = 'loaded';
                }
            } else {
                this.results.containerFound = false;
                this.results.errors.push('未找到gitalk-container元素');
            }
        }

        // 检查CSS样式加载
        checkStyles() {
            const gitalkCSS = Array.from(document.querySelectorAll('link')).some(link => 
                link.href && link.href.includes('gitalk.css')
            );
            
            if (gitalkCSS) {
                this.results.stylesLoaded = true;
            } else {
                this.results.stylesLoaded = false;
                this.results.errors.push('Gitalk CSS样式未加载');
            }
        }

        // 执行完整检查
        async runCheck() {
            console.log('🔍 开始评论系统状态检查...');
            
            this.checkProvider();
            this.checkGitalkConfig();
            this.checkStyles();

            // 等待一下，让异步加载的内容有时间渲染
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // 再次检查容器状态
            this.checkGitalkConfig();

            return this.results;
        }

        // 生成检查报告
        generateReport() {
            const report = {
                timestamp: new Date().toISOString(),
                status: this.getOverallStatus(),
                details: this.results,
                recommendations: this.getRecommendations()
            };

            return report;
        }

        // 获取整体状态
        getOverallStatus() {
            if (this.results.errors.length > 0) {
                return 'error';
            } else if (this.results.provider === 'gitalk' && this.results.containerFound) {
                if (this.results.gitalkConfig === 'configuration_needed') {
                    return 'configuration_needed';
                } else if (this.results.gitalkConfig === 'loaded') {
                    return 'success';
                } else {
                    return 'partial';
                }
            } else {
                return 'not_configured';
            }
        }

        // 获取建议
        getRecommendations() {
            const recommendations = [];

            if (this.results.provider !== 'gitalk') {
                recommendations.push('将hugo.yaml中的comments.provider设置为gitalk');
            }

            if (!this.results.containerFound) {
                recommendations.push('检查gitalk.html模板是否正确放置在layouts/partials/comments/provider/目录');
            }

            if (!this.results.scriptsLoaded) {
                recommendations.push('检查Gitalk JavaScript脚本是否正确加载');
            }

            if (this.results.gitalkConfig === 'configuration_needed') {
                recommendations.push('创建GitHub OAuth应用并配置clientID和clientSecret');
            }

            if (this.results.errors.length === 0 && recommendations.length === 0) {
                recommendations.push('评论系统配置正常，可以正常使用');
            }

            return recommendations;
        }

        // 在控制台输出详细报告
        logReport() {
            const report = this.generateReport();
            
            console.log('\n📊 评论系统检查报告');
            console.log('='.repeat(50));
            console.log(`🕐 检查时间: ${report.timestamp}`);
            console.log(`📈 整体状态: ${this.getStatusEmoji(report.status)} ${report.status.toUpperCase()}`);
            
            console.log('\n📋 详细信息:');
            console.log(`  评论提供商: ${report.details.provider || '未知'}`);
            console.log(`  Gitalk容器: ${report.details.containerFound ? '✅ 找到' : '❌ 未找到'}`);
            console.log(`  脚本加载: ${report.details.scriptsLoaded ? '✅ 已加载' : '❌ 未加载'}`);
            console.log(`  配置状态: ${report.details.gitalkConfig || '未知'}`);
            
            if (report.details.errors.length > 0) {
                console.log('\n❌ 发现的问题:');
                report.details.errors.forEach((error, index) => {
                    console.log(`  ${index + 1}. ${error}`);
                });
            }
            
            if (report.recommendations.length > 0) {
                console.log('\n💡 建议操作:');
                report.recommendations.forEach((rec, index) => {
                    console.log(`  ${index + 1}. ${rec}`);
                });
            }
            
            console.log('='.repeat(50));
            
            return report;
        }

        // 获取状态表情符号
        getStatusEmoji(status) {
            const emojis = {
                'success': '🎉',
                'configuration_needed': '⚙️',
                'partial': '⚠️',
                'error': '❌',
                'not_configured': '🔧'
            };
            return emojis[status] || '❓';
        }
    }

    // 自动运行检查（仅在文章页面）
    if (document.body.classList.contains('article-page') || 
        document.querySelector('article.post') ||
        window.location.pathname.includes('/post/')) {
        
        document.addEventListener('DOMContentLoaded', async function() {
            // 等待页面完全加载
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            const checker = new CommentSystemChecker();
            await checker.runCheck();
            const report = checker.logReport();
            
            // 将报告存储到全局变量，方便调试
            window.commentSystemReport = report;
        });
    }

    // 导出检查器类，方便手动调用
    window.CommentSystemChecker = CommentSystemChecker;

    // 提供手动检查函数
    window.checkCommentSystem = async function() {
        const checker = new CommentSystemChecker();
        await checker.runCheck();
        return checker.logReport();
    };

})();
