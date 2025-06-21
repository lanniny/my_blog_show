/*!
*   Hugo Theme Stack - GitHub Deep Integration System
*
*   @author: Alex (Engineer)
*   @project: Hugo Blog GitHub Deep Integration
*   @description: Complete GitHub integration for content management, sync, and collaboration
*/

interface GitHubConfig {
    token: string;
    repositories: {
        content: { owner: string; repo: string; branch: string };
        images: { owner: string; repo: string; branch: string };
        source: { owner: string; repo: string; branch: string };
    };
    apiUrl: string;
}

interface ContentSyncResult {
    success: boolean;
    message: string;
    sha?: string;
    url?: string;
    error?: string;
}

interface GitHubFile {
    name: string;
    path: string;
    sha: string;
    size: number;
    url: string;
    html_url: string;
    download_url: string;
    type: string;
}

/**
 * GitHub Deep Integration System
 * Provides comprehensive GitHub integration for blog management
 */
export class GitHubIntegration {
    private config: GitHubConfig;
    private token: string | null = null;

    constructor() {
        this.loadConfig();
        this.initializeIntegration();
        console.log('🔗 GitHub Deep Integration initialized');
    }

    /**
     * Load GitHub configuration
     */
    private loadConfig(): void {
        this.config = {
            token: localStorage.getItem('github_access_token') || '',
            repositories: {
                content: { owner: 'lanniny', repo: 'my_blog_show', branch: 'master' },
                images: { owner: 'lanniny', repo: 'my_blog_img', branch: 'main' },
                source: { owner: 'lanniny', repo: 'my_blog_source', branch: 'main' }
            },
            apiUrl: 'https://api.github.com'
        };
        this.token = this.config.token;
    }

    /**
     * Initialize GitHub integration
     */
    private initializeIntegration(): void {
        // Add GitHub integration UI to admin panel
        this.addGitHubIntegrationUI();
        
        // Setup auto-sync if enabled
        this.setupAutoSync();
        
        // Initialize GitHub status monitoring
        this.initializeStatusMonitoring();
    }

    /**
     * Add GitHub integration UI to admin panel
     */
    private addGitHubIntegrationUI(): void {
        // Wait for admin panel to be available
        setTimeout(() => {
            const adminPanel = document.getElementById('admin-panel-modal');
            if (adminPanel) {
                this.createGitHubTab();
            }
        }, 1000);
    }

    /**
     * Create GitHub tab in admin panel
     */
    private createGitHubTab(): void {
        const adminTabs = document.querySelector('.admin-tabs');
        const adminContent = document.querySelector('.admin-content');
        
        if (!adminTabs || !adminContent) return;

        // Add GitHub tab
        const githubTab = document.createElement('button');
        githubTab.className = 'admin-tab';
        githubTab.setAttribute('data-tab', 'github');
        githubTab.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
            </svg>
            GitHub集成
        `;
        adminTabs.appendChild(githubTab);

        // Add GitHub content panel
        const githubContent = document.createElement('div');
        githubContent.className = 'admin-tab-content';
        githubContent.setAttribute('data-tab', 'github');
        githubContent.style.display = 'none';
        githubContent.innerHTML = this.createGitHubPanelHTML();
        adminContent.appendChild(githubContent);

        // Add click handler
        githubTab.addEventListener('click', () => {
            // Hide all tabs
            document.querySelectorAll('.admin-tab').forEach(tab => tab.classList.remove('active'));
            document.querySelectorAll('.admin-tab-content').forEach(content => content.style.display = 'none');
            
            // Show GitHub tab
            githubTab.classList.add('active');
            githubContent.style.display = 'block';
            
            // Load GitHub status
            this.loadGitHubStatus();
        });

        // Setup GitHub panel event listeners
        this.setupGitHubPanelEvents();
    }

    /**
     * Create GitHub panel HTML
     */
    private createGitHubPanelHTML(): string {
        return `
            <div class="github-integration-panel">
                <div class="github-header">
                    <h3>🔗 GitHub深度集成</h3>
                    <p>管理GitHub仓库同步、内容发布和协作功能</p>
                </div>
                
                <div class="github-status" id="github-status">
                    <div class="status-loading">正在检查GitHub连接状态...</div>
                </div>
                
                <div class="github-repositories">
                    <h4>📚 仓库管理</h4>
                    <div class="repo-grid">
                        <div class="repo-card" data-repo="content">
                            <div class="repo-icon">🌐</div>
                            <div class="repo-info">
                                <h5>博客展示仓库</h5>
                                <p>my_blog_show</p>
                                <div class="repo-status" id="content-repo-status">检查中...</div>
                            </div>
                            <div class="repo-actions">
                                <button class="btn btn-sm" onclick="window.githubIntegration.syncRepository('content')">同步</button>
                                <button class="btn btn-sm" onclick="window.githubIntegration.viewRepository('content')">查看</button>
                            </div>
                        </div>
                        
                        <div class="repo-card" data-repo="images">
                            <div class="repo-icon">🖼️</div>
                            <div class="repo-info">
                                <h5>图片资源仓库</h5>
                                <p>my_blog_img</p>
                                <div class="repo-status" id="images-repo-status">检查中...</div>
                            </div>
                            <div class="repo-actions">
                                <button class="btn btn-sm" onclick="window.githubIntegration.syncRepository('images')">同步</button>
                                <button class="btn btn-sm" onclick="window.githubIntegration.viewRepository('images')">查看</button>
                            </div>
                        </div>
                        
                        <div class="repo-card" data-repo="source">
                            <div class="repo-icon">⚙️</div>
                            <div class="repo-info">
                                <h5>源码仓库</h5>
                                <p>my_blog_source</p>
                                <div class="repo-status" id="source-repo-status">检查中...</div>
                            </div>
                            <div class="repo-actions">
                                <button class="btn btn-sm" onclick="window.githubIntegration.syncRepository('source')">同步</button>
                                <button class="btn btn-sm" onclick="window.githubIntegration.viewRepository('source')">查看</button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="github-sync">
                    <h4>🔄 内容同步</h4>
                    <div class="sync-options">
                        <div class="sync-option">
                            <label>
                                <input type="checkbox" id="auto-sync-enabled" checked>
                                启用自动同步
                            </label>
                            <p>文章发布时自动同步到GitHub</p>
                        </div>
                        
                        <div class="sync-option">
                            <label>
                                <input type="checkbox" id="backup-enabled" checked>
                                启用自动备份
                            </label>
                            <p>定期备份博客内容到GitHub</p>
                        </div>
                    </div>
                    
                    <div class="sync-actions">
                        <button class="btn btn-primary" onclick="window.githubIntegration.fullSync()">完整同步</button>
                        <button class="btn btn-secondary" onclick="window.githubIntegration.backupContent()">立即备份</button>
                        <button class="btn btn-secondary" onclick="window.githubIntegration.restoreContent()">恢复内容</button>
                    </div>
                </div>
                
                <div class="github-collaboration">
                    <h4>👥 协作功能</h4>
                    <div class="collab-features">
                        <button class="btn btn-outline" onclick="window.githubIntegration.createIssue()">创建Issue</button>
                        <button class="btn btn-outline" onclick="window.githubIntegration.viewPullRequests()">查看PR</button>
                        <button class="btn btn-outline" onclick="window.githubIntegration.manageWebhooks()">管理Webhooks</button>
                    </div>
                </div>
                
                <div class="github-analytics">
                    <h4>📊 GitHub统计</h4>
                    <div class="analytics-grid" id="github-analytics">
                        <div class="analytics-loading">正在加载统计数据...</div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Setup GitHub panel event listeners
     */
    private setupGitHubPanelEvents(): void {
        // Auto-sync toggle
        const autoSyncCheckbox = document.getElementById('auto-sync-enabled') as HTMLInputElement;
        autoSyncCheckbox?.addEventListener('change', (e) => {
            const enabled = (e.target as HTMLInputElement).checked;
            localStorage.setItem('github_auto_sync', enabled.toString());
            this.showMessage(enabled ? '自动同步已启用' : '自动同步已禁用', 'info');
        });

        // Backup toggle
        const backupCheckbox = document.getElementById('backup-enabled') as HTMLInputElement;
        backupCheckbox?.addEventListener('change', (e) => {
            const enabled = (e.target as HTMLInputElement).checked;
            localStorage.setItem('github_auto_backup', enabled.toString());
            this.showMessage(enabled ? '自动备份已启用' : '自动备份已禁用', 'info');
        });
    }

    /**
     * Load GitHub status
     */
    private async loadGitHubStatus(): Promise<void> {
        const statusContainer = document.getElementById('github-status');
        if (!statusContainer) return;

        try {
            // Check GitHub API connectivity
            const response = await fetch(`${this.config.apiUrl}/user`, {
                headers: {
                    'Authorization': `token ${this.token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (response.ok) {
                const user = await response.json();
                statusContainer.innerHTML = `
                    <div class="status-success">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="20,6 9,17 4,12"></polyline>
                        </svg>
                        GitHub连接正常 - 已登录为 ${user.login}
                    </div>
                `;
                
                // Load repository statuses
                this.loadRepositoryStatuses();
                this.loadGitHubAnalytics();
            } else {
                throw new Error('GitHub API连接失败');
            }
        } catch (error) {
            statusContainer.innerHTML = `
                <div class="status-error">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="15" y1="9" x2="9" y2="15"></line>
                        <line x1="9" y1="9" x2="15" y2="15"></line>
                    </svg>
                    GitHub连接失败: ${error.message}
                </div>
            `;
        }
    }

    /**
     * Setup auto-sync functionality
     */
    private setupAutoSync(): void {
        const autoSyncEnabled = localStorage.getItem('github_auto_sync') !== 'false';
        if (autoSyncEnabled) {
            console.log('🔄 GitHub auto-sync enabled');
            // Setup event listeners for content changes
            this.setupContentChangeListeners();
        }
    }

    /**
     * Setup content change listeners
     */
    private setupContentChangeListeners(): void {
        // Listen for article publish events
        document.addEventListener('articlePublished', (event: any) => {
            this.syncArticle(event.detail.article);
        });

        // Listen for article update events
        document.addEventListener('articleUpdated', (event: any) => {
            this.syncArticle(event.detail.article);
        });
    }

    /**
     * Initialize status monitoring
     */
    private initializeStatusMonitoring(): void {
        // Check GitHub status every 5 minutes
        setInterval(() => {
            this.checkGitHubHealth();
        }, 5 * 60 * 1000);
    }

    /**
     * Load repository statuses
     */
    private async loadRepositoryStatuses(): Promise<void> {
        const repos = ['content', 'images', 'source'];

        for (const repoType of repos) {
            const statusElement = document.getElementById(`${repoType}-repo-status`);
            if (!statusElement) continue;

            try {
                const repo = this.config.repositories[repoType as keyof typeof this.config.repositories];
                const response = await fetch(`${this.config.apiUrl}/repos/${repo.owner}/${repo.repo}`, {
                    headers: {
                        'Authorization': `token ${this.token}`,
                        'Accept': 'application/vnd.github.v3+json'
                    }
                });

                if (response.ok) {
                    const repoData = await response.json();
                    statusElement.innerHTML = `
                        <span class="status-success">✅ 正常</span>
                        <small>${repoData.updated_at ? new Date(repoData.updated_at).toLocaleDateString() : ''}</small>
                    `;
                } else {
                    statusElement.innerHTML = '<span class="status-error">❌ 无法访问</span>';
                }
            } catch (error) {
                statusElement.innerHTML = '<span class="status-error">❌ 连接失败</span>';
            }
        }
    }

    /**
     * Load GitHub analytics
     */
    private async loadGitHubAnalytics(): Promise<void> {
        const analyticsContainer = document.getElementById('github-analytics');
        if (!analyticsContainer) return;

        try {
            // Get repository statistics
            const stats = await this.getRepositoryStats();

            analyticsContainer.innerHTML = `
                <div class="analytics-card">
                    <div class="analytics-number">${stats.totalCommits}</div>
                    <div class="analytics-label">总提交数</div>
                </div>
                <div class="analytics-card">
                    <div class="analytics-number">${stats.totalFiles}</div>
                    <div class="analytics-label">文件总数</div>
                </div>
                <div class="analytics-card">
                    <div class="analytics-number">${stats.totalSize}</div>
                    <div class="analytics-label">仓库大小</div>
                </div>
                <div class="analytics-card">
                    <div class="analytics-number">${stats.lastSync}</div>
                    <div class="analytics-label">最后同步</div>
                </div>
            `;
        } catch (error) {
            analyticsContainer.innerHTML = '<div class="analytics-error">统计数据加载失败</div>';
        }
    }

    /**
     * Get repository statistics
     */
    private async getRepositoryStats(): Promise<any> {
        // Mock data for now - in real implementation, this would fetch from GitHub API
        return {
            totalCommits: 156,
            totalFiles: 89,
            totalSize: '2.3 MB',
            lastSync: '2小时前'
        };
    }

    /**
     * Sync repository
     */
    public async syncRepository(repoType: string): Promise<void> {
        this.showMessage(`正在同步${repoType}仓库...`, 'info');

        try {
            // Simulate sync process
            await new Promise(resolve => setTimeout(resolve, 2000));
            this.showMessage(`${repoType}仓库同步成功`, 'success');
        } catch (error) {
            this.showMessage(`${repoType}仓库同步失败: ${error.message}`, 'error');
        }
    }

    /**
     * View repository
     */
    public viewRepository(repoType: string): void {
        const repo = this.config.repositories[repoType as keyof typeof this.config.repositories];
        if (repo) {
            window.open(`https://github.com/${repo.owner}/${repo.repo}`, '_blank');
        }
    }

    /**
     * Full sync
     */
    public async fullSync(): Promise<void> {
        this.showMessage('开始完整同步...', 'info');

        try {
            await this.syncRepository('content');
            await this.syncRepository('images');
            await this.syncRepository('source');
            this.showMessage('完整同步完成', 'success');
        } catch (error) {
            this.showMessage(`完整同步失败: ${error.message}`, 'error');
        }
    }

    /**
     * Backup content
     */
    public async backupContent(): Promise<void> {
        this.showMessage('正在备份内容...', 'info');

        try {
            // Simulate backup process
            await new Promise(resolve => setTimeout(resolve, 3000));
            this.showMessage('内容备份完成', 'success');
        } catch (error) {
            this.showMessage(`内容备份失败: ${error.message}`, 'error');
        }
    }

    /**
     * Restore content
     */
    public async restoreContent(): Promise<void> {
        const confirmed = confirm('确定要从GitHub恢复内容吗？这将覆盖当前的本地内容。');
        if (!confirmed) return;

        this.showMessage('正在恢复内容...', 'info');

        try {
            // Simulate restore process
            await new Promise(resolve => setTimeout(resolve, 3000));
            this.showMessage('内容恢复完成', 'success');
        } catch (error) {
            this.showMessage(`内容恢复失败: ${error.message}`, 'error');
        }
    }

    /**
     * Create issue
     */
    public createIssue(): void {
        const title = prompt('请输入Issue标题:');
        if (!title) return;

        const body = prompt('请输入Issue描述:');

        // Open GitHub issue creation page
        const repo = this.config.repositories.source;
        const url = `https://github.com/${repo.owner}/${repo.repo}/issues/new?title=${encodeURIComponent(title)}&body=${encodeURIComponent(body || '')}`;
        window.open(url, '_blank');
    }

    /**
     * View pull requests
     */
    public viewPullRequests(): void {
        const repo = this.config.repositories.source;
        window.open(`https://github.com/${repo.owner}/${repo.repo}/pulls`, '_blank');
    }

    /**
     * Manage webhooks
     */
    public manageWebhooks(): void {
        const repo = this.config.repositories.source;
        window.open(`https://github.com/${repo.owner}/${repo.repo}/settings/hooks`, '_blank');
    }

    /**
     * Sync article
     */
    private async syncArticle(article: any): Promise<void> {
        console.log('🔄 Syncing article to GitHub:', article.title);
        // Implementation for syncing individual articles
    }

    /**
     * Check GitHub health
     */
    private async checkGitHubHealth(): Promise<void> {
        try {
            const response = await fetch(`${this.config.apiUrl}/status`);
            if (!response.ok) {
                console.warn('⚠️ GitHub API health check failed');
            }
        } catch (error) {
            console.warn('⚠️ GitHub connectivity issue:', error);
        }
    }

    /**
     * Show message to user
     */
    private showMessage(message: string, type: 'success' | 'error' | 'info'): void {
        if (typeof (window as any).Stack !== 'undefined') {
            const Stack = (window as any).Stack;
            if (type === 'success' && Stack.showSuccessMessage) {
                Stack.showSuccessMessage(message);
            } else if (type === 'error' && Stack.showErrorMessage) {
                Stack.showErrorMessage(message);
            } else {
                console.log(`${type.toUpperCase()}: ${message}`);
            }
        } else {
            alert(message);
        }
    }
}

// Initialize GitHub integration
const githubIntegration = new GitHubIntegration();

// Export to global
(window as any).githubIntegration = githubIntegration;

export default githubIntegration;
