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
            var scripts = document.querySelectorAll('script');
            var scriptSrcs = [];

            for (var i = 0; i < scripts.length; i++) {
                if (scripts[i].src) {
                    scriptSrcs.push(scripts[i].src);
                }
            }

            var hasGitalk = false;
            var hasDisqus = false;
            var hasUtterances = false;
            var hasGiscus = false;

            for (var j = 0; j < scriptSrcs.length; j++) {
                var src = scriptSrcs[j];
                if (src.indexOf('gitalk') !== -1) hasGitalk = true;
                if (src.indexOf('disqus') !== -1) hasDisqus = true;
                if (src.indexOf('utterances') !== -1) hasUtterances = true;
                if (src.indexOf('giscus') !== -1) hasGiscus = true;
            }

            if (hasGitalk) {
                this.results.provider = 'gitalk';
                this.results.scriptsLoaded = true;
            } else if (hasDisqus) {
                this.results.provider = 'disqus';
            } else if (hasUtterances) {
                this.results.provider = 'utterances';
            } else if (hasGiscus) {
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
            var links = document.querySelectorAll('link');
            var gitalkCSS = false;

            for (var i = 0; i < links.length; i++) {
                var link = links[i];
                if (link.href && link.href.indexOf('gitalk.css') !== -1) {
                    gitalkCSS = true;
                    break;
                }
            }

            if (gitalkCSS) {
                this.results.stylesLoaded = true;
            } else {
                this.results.stylesLoaded = false;
                this.results.errors.push('Gitalk CSS样式未加载');
            }
        }

        // 执行完整检查
        runCheck() {
            var self = this;
            console.log('🔍 开始评论系统状态检查...');

            this.checkProvider();
            this.checkGitalkConfig();
            this.checkStyles();

            // 等待一下，让异步加载的内容有时间渲染
            return new Promise(function(resolve) {
                setTimeout(function() {
                    // 再次检查容器状态
                    self.checkGitalkConfig();
                    resolve(self.results);
                }, 1000);
            });
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
            console.log('==================================================');
            console.log('🕐 检查时间: ' + report.timestamp);
            console.log('📈 整体状态: ' + this.getStatusEmoji(report.status) + ' ' + report.status.toUpperCase());

            console.log('\n📋 详细信息:');
            console.log('  评论提供商: ' + (report.details.provider || '未知'));
            console.log('  Gitalk容器: ' + (report.details.containerFound ? '✅ 找到' : '❌ 未找到'));
            console.log('  脚本加载: ' + (report.details.scriptsLoaded ? '✅ 已加载' : '❌ 未加载'));
            console.log('  配置状态: ' + (report.details.gitalkConfig || '未知'));
            
            if (report.details.errors.length > 0) {
                console.log('\n❌ 发现的问题:');
                for (var i = 0; i < report.details.errors.length; i++) {
                    console.log('  ' + (i + 1) + '. ' + report.details.errors[i]);
                }
            }

            if (report.recommendations.length > 0) {
                console.log('\n💡 建议操作:');
                for (var j = 0; j < report.recommendations.length; j++) {
                    console.log('  ' + (j + 1) + '. ' + report.recommendations[j]);
                }
            }
            
            console.log('==================================================');
            
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
        window.location.pathname.indexOf('/post/') !== -1) {

        document.addEventListener('DOMContentLoaded', function() {
            // 等待页面完全加载
            setTimeout(function() {
                var checker = new CommentSystemChecker();
                checker.runCheck().then(function() {
                    var report = checker.logReport();
                    // 将报告存储到全局变量，方便调试
                    window.commentSystemReport = report;
                });
            }, 2000);
        });
    }

    // 导出检查器类，方便手动调用
    window.CommentSystemChecker = CommentSystemChecker;

    // 提供手动检查函数
    window.checkCommentSystem = function() {
        var checker = new CommentSystemChecker();
        return checker.runCheck().then(function() {
            return checker.logReport();
        });
    };

})();
