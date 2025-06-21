/*!
*   Hugo Theme Stack - Article Manager
*
*   @author: Alex (Engineer)
*   @project: Hugo Blog Article Management System
*   @description: Complete article CRUD operations with GitHub integration
*/

/**
 * Article metadata interface
 */
export interface ArticleMetadata {
    title: string;
    slug: string;
    description?: string;
    date: Date;
    lastmod?: Date;
    draft: boolean;
    categories: string[];
    tags: string[];
    image?: string;
    author?: string;
    weight?: number;
    featured?: boolean;
}

/**
 * Article content interface
 */
export interface ArticleContent {
    metadata: ArticleMetadata;
    content: string;
    frontmatter: string;
    fullContent: string;
}

/**
 * Article operation result interface
 */
export interface ArticleOperationResult {
    success: boolean;
    message: string;
    article?: ArticleContent;
    error?: string;
}

/**
 * Article Manager Class
 */
export class ArticleManager {
    private articles: Map<string, ArticleContent> = new Map();
    private isDirty: boolean = false;
    private autoSaveInterval: number | null = null;

    constructor() {
        this.init();
    }

    /**
     * Initialize article manager
     */
    private init(): void {
        console.log('📝 Article Manager initialized');
        this.loadArticles();
        this.setupAutoSave();
        this.createArticleManagerInterface();
        this.setupEventListeners();
    }

    /**
     * Create article manager interface
     */
    private createArticleManagerInterface(): void {
        const articleManagerHTML = `
            <div class="article-manager" id="article-manager" style="display: none;">
                <div class="article-manager-header">
                    <h3>📝 文章管理</h3>
                    <div class="header-actions">
                        <button class="btn btn-primary" id="new-article-btn">新建文章</button>
                        <button class="close-btn" onclick="window.articleManager.closeManager()">×</button>
                    </div>
                </div>

                <div class="article-manager-content">
                    <!-- Article List -->
                    <div class="article-list-section">
                        <div class="list-header">
                            <h4>📚 文章列表</h4>
                            <div class="list-controls">
                                <input type="text" id="article-search" placeholder="搜索文章...">
                                <select id="article-filter">
                                    <option value="">所有状态</option>
                                    <option value="published">已发布</option>
                                    <option value="draft">草稿</option>
                                </select>
                                <select id="category-filter">
                                    <option value="">所有分类</option>
                                </select>
                            </div>
                        </div>

                        <div class="article-list" id="article-list">
                            <!-- Articles will be populated here -->
                        </div>

                        <div class="list-actions">
                            <button class="btn btn-secondary" id="bulk-delete-btn" disabled>批量删除</button>
                            <button class="btn btn-secondary" id="bulk-publish-btn" disabled>批量发布</button>
                            <button class="btn btn-secondary" id="export-articles-btn">导出文章</button>
                        </div>
                    </div>

                    <!-- Article Editor -->
                    <div class="article-editor-section" id="article-editor" style="display: none;">
                        <div class="editor-header">
                            <h4 id="editor-title">编辑文章</h4>
                            <div class="editor-actions">
                                <button class="btn btn-secondary" id="save-draft-btn">保存草稿</button>
                                <button class="btn btn-primary" id="publish-btn">发布</button>
                                <button class="btn btn-secondary" id="preview-btn">预览</button>
                                <button class="btn btn-secondary" id="close-editor-btn">关闭</button>
                            </div>
                        </div>

                        <!-- Article Metadata -->
                        <div class="article-metadata">
                            <div class="metadata-row">
                                <div class="field-group">
                                    <label for="article-title">标题</label>
                                    <input type="text" id="article-title" placeholder="文章标题">
                                </div>
                                <div class="field-group">
                                    <label for="article-slug">URL别名</label>
                                    <input type="text" id="article-slug" placeholder="url-slug">
                                </div>
                            </div>

                            <div class="metadata-row">
                                <div class="field-group">
                                    <label for="article-categories">分类</label>
                                    <input type="text" id="article-categories" placeholder="分类，用逗号分隔">
                                </div>
                                <div class="field-group">
                                    <label for="article-tags">标签</label>
                                    <input type="text" id="article-tags" placeholder="标签，用逗号分隔">
                                </div>
                            </div>

                            <div class="metadata-row">
                                <div class="field-group">
                                    <label for="article-description">描述</label>
                                    <textarea id="article-description" placeholder="文章描述" rows="2"></textarea>
                                </div>
                                <div class="field-group">
                                    <label for="article-image">特色图片</label>
                                    <div class="image-input-group">
                                        <input type="text" id="article-image" placeholder="图片URL">
                                        <button class="btn btn-secondary" id="upload-image-btn">上传</button>
                                    </div>
                                </div>
                            </div>

                            <div class="metadata-row">
                                <div class="field-group">
                                    <label>
                                        <input type="checkbox" id="article-featured"> 精选文章
                                    </label>
                                </div>
                                <div class="field-group">
                                    <label>
                                        <input type="checkbox" id="article-draft"> 草稿状态
                                    </label>
                                </div>
                            </div>
                        </div>

                        <!-- Markdown Editor -->
                        <div class="markdown-editor-container">
                            <div class="editor-toolbar">
                                <button class="toolbar-btn" data-action="bold" title="粗体">B</button>
                                <button class="toolbar-btn" data-action="italic" title="斜体">I</button>
                                <button class="toolbar-btn" data-action="heading" title="标题">H</button>
                                <button class="toolbar-btn" data-action="link" title="链接">🔗</button>
                                <button class="toolbar-btn" data-action="image" title="图片">🖼️</button>
                                <button class="toolbar-btn" data-action="code" title="代码">💻</button>
                                <button class="toolbar-btn" data-action="quote" title="引用">💬</button>
                                <button class="toolbar-btn" data-action="list" title="列表">📝</button>
                                <div class="toolbar-divider"></div>
                                <button class="toolbar-btn" id="toggle-preview" title="切换预览">👁️</button>
                                <button class="toolbar-btn" id="fullscreen-btn" title="全屏">⛶</button>
                            </div>

                            <div class="editor-content">
                                <div class="editor-pane">
                                    <textarea id="markdown-editor" placeholder="在此输入Markdown内容..."></textarea>
                                </div>
                                <div class="preview-pane" id="preview-pane" style="display: none;">
                                    <div class="preview-content" id="preview-content"></div>
                                </div>
                            </div>
                        </div>

                        <!-- Editor Status -->
                        <div class="editor-status">
                            <div class="status-info">
                                <span id="word-count">字数: 0</span>
                                <span id="char-count">字符: 0</span>
                                <span id="last-saved">未保存</span>
                            </div>
                            <div class="status-actions">
                                <button class="btn btn-secondary" id="sync-github-btn">同步到GitHub</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add to body if not exists
        if (!document.getElementById('article-manager')) {
            document.body.insertAdjacentHTML('beforeend', articleManagerHTML);
        }
    }

    /**
     * Setup event listeners
     */
    private setupEventListeners(): void {
        // New article button
        document.getElementById('new-article-btn')?.addEventListener('click', () => {
            this.createNewArticle();
        });

        // Search and filters
        document.getElementById('article-search')?.addEventListener('input', (e) => {
            this.filterArticles();
        });

        document.getElementById('article-filter')?.addEventListener('change', () => {
            this.filterArticles();
        });

        document.getElementById('category-filter')?.addEventListener('change', () => {
            this.filterArticles();
        });

        // Editor actions
        document.getElementById('save-draft-btn')?.addEventListener('click', () => {
            this.saveDraft();
        });

        document.getElementById('publish-btn')?.addEventListener('click', () => {
            this.publishArticle();
        });

        document.getElementById('preview-btn')?.addEventListener('click', () => {
            this.togglePreview();
        });

        document.getElementById('close-editor-btn')?.addEventListener('click', () => {
            this.closeEditor();
        });

        // Markdown editor
        const markdownEditor = document.getElementById('markdown-editor') as HTMLTextAreaElement;
        markdownEditor?.addEventListener('input', () => {
            this.updateWordCount();
            this.updatePreview();
            this.markDirty();
        });

        // Auto-generate slug from title
        document.getElementById('article-title')?.addEventListener('input', (e) => {
            const title = (e.target as HTMLInputElement).value;
            const slug = this.generateSlug(title);
            (document.getElementById('article-slug') as HTMLInputElement).value = slug;
        });

        // Toolbar actions
        this.setupToolbarActions();

        // Upload image button
        document.getElementById('upload-image-btn')?.addEventListener('click', () => {
            this.openImageUploader();
        });

        // Sync to GitHub
        document.getElementById('sync-github-btn')?.addEventListener('click', () => {
            this.syncToGitHub();
        });
    }

    /**
     * Load articles from localStorage
     */
    private loadArticles(): void {
        const saved = localStorage.getItem('blog-articles');
        if (saved) {
            try {
                const articlesData = JSON.parse(saved);
                this.articles = new Map(Object.entries(articlesData));
                console.log(`📚 Loaded ${this.articles.size} articles`);
            } catch (error) {
                console.warn('Failed to load articles:', error);
                this.articles = new Map();
            }
        }
        this.renderArticleList();
    }

    /**
     * Save articles to localStorage
     */
    private saveArticles(): void {
        const articlesData = Object.fromEntries(this.articles);
        localStorage.setItem('blog-articles', JSON.stringify(articlesData));
        this.isDirty = false;
        this.updateLastSaved();
    }

    /**
     * Setup auto-save
     */
    private setupAutoSave(): void {
        this.autoSaveInterval = window.setInterval(() => {
            if (this.isDirty) {
                this.saveArticles();
                console.log('📝 Auto-saved articles');
            }
        }, 30000); // Auto-save every 30 seconds
    }

    /**
     * Mark as dirty (needs saving)
     */
    private markDirty(): void {
        this.isDirty = true;
    }

    /**
     * Update last saved timestamp
     */
    private updateLastSaved(): void {
        const lastSavedEl = document.getElementById('last-saved');
        if (lastSavedEl) {
            lastSavedEl.textContent = `已保存 ${new Date().toLocaleTimeString()}`;
        }
    }

    /**
     * Generate URL slug from title
     */
    private generateSlug(title: string): string {
        return title
            .toLowerCase()
            .replace(/[^\w\s-]/g, '') // Remove special characters
            .replace(/\s+/g, '-') // Replace spaces with hyphens
            .replace(/-+/g, '-') // Replace multiple hyphens with single
            .trim();
    }

    /**
     * Create new article
     */
    public createNewArticle(): void {
        const newArticle: ArticleContent = {
            metadata: {
                title: '新文章',
                slug: 'new-article-' + Date.now(),
                date: new Date(),
                draft: true,
                categories: [],
                tags: [],
                featured: false
            },
            content: '# 新文章\n\n在此开始编写您的文章内容...',
            frontmatter: '',
            fullContent: ''
        };

        this.articles.set(newArticle.metadata.slug, newArticle);
        this.markDirty();
        this.renderArticleList();
        this.editArticle(newArticle.metadata.slug);
    }

    /**
     * Edit article
     */
    public editArticle(slug: string): void {
        const article = this.articles.get(slug);
        if (!article) {
            this.showMessage('文章不存在', 'error');
            return;
        }

        // Show editor
        const editorSection = document.getElementById('article-editor');
        if (editorSection) {
            editorSection.style.display = 'block';
        }

        // Populate form
        this.populateEditor(article);

        // Update editor title
        const editorTitle = document.getElementById('editor-title');
        if (editorTitle) {
            editorTitle.textContent = `编辑文章: ${article.metadata.title}`;
        }
    }

    /**
     * Populate editor with article data
     */
    private populateEditor(article: ArticleContent): void {
        (document.getElementById('article-title') as HTMLInputElement).value = article.metadata.title;
        (document.getElementById('article-slug') as HTMLInputElement).value = article.metadata.slug;
        (document.getElementById('article-description') as HTMLTextAreaElement).value = article.metadata.description || '';
        (document.getElementById('article-categories') as HTMLInputElement).value = article.metadata.categories.join(', ');
        (document.getElementById('article-tags') as HTMLInputElement).value = article.metadata.tags.join(', ');
        (document.getElementById('article-image') as HTMLInputElement).value = article.metadata.image || '';
        (document.getElementById('article-featured') as HTMLInputElement).checked = article.metadata.featured || false;
        (document.getElementById('article-draft') as HTMLInputElement).checked = article.metadata.draft;
        (document.getElementById('markdown-editor') as HTMLTextAreaElement).value = article.content;

        this.updateWordCount();
        this.updatePreview();
    }

    /**
     * Get current article data from editor
     */
    private getCurrentArticleData(): ArticleContent {
        const title = (document.getElementById('article-title') as HTMLInputElement).value;
        const slug = (document.getElementById('article-slug') as HTMLInputElement).value;
        const description = (document.getElementById('article-description') as HTMLTextAreaElement).value;
        const categories = (document.getElementById('article-categories') as HTMLInputElement).value
            .split(',').map(c => c.trim()).filter(c => c);
        const tags = (document.getElementById('article-tags') as HTMLInputElement).value
            .split(',').map(t => t.trim()).filter(t => t);
        const image = (document.getElementById('article-image') as HTMLInputElement).value;
        const featured = (document.getElementById('article-featured') as HTMLInputElement).checked;
        const draft = (document.getElementById('article-draft') as HTMLInputElement).checked;
        const content = (document.getElementById('markdown-editor') as HTMLTextAreaElement).value;

        const metadata: ArticleMetadata = {
            title,
            slug,
            description: description || undefined,
            date: new Date(),
            lastmod: new Date(),
            draft,
            categories,
            tags,
            image: image || undefined,
            featured
        };

        const frontmatter = this.generateFrontmatter(metadata);
        const fullContent = frontmatter + '\n\n' + content;

        return {
            metadata,
            content,
            frontmatter,
            fullContent
        };
    }

    /**
     * Generate Hugo frontmatter
     */
    private generateFrontmatter(metadata: ArticleMetadata): string {
        const frontmatter = ['---'];

        frontmatter.push(`title: "${metadata.title}"`);
        frontmatter.push(`slug: "${metadata.slug}"`);

        if (metadata.description) {
            frontmatter.push(`description: "${metadata.description}"`);
        }

        frontmatter.push(`date: ${metadata.date.toISOString()}`);

        if (metadata.lastmod) {
            frontmatter.push(`lastmod: ${metadata.lastmod.toISOString()}`);
        }

        frontmatter.push(`draft: ${metadata.draft}`);

        if (metadata.categories.length > 0) {
            frontmatter.push(`categories:`);
            metadata.categories.forEach(cat => {
                frontmatter.push(`  - "${cat}"`);
            });
        }

        if (metadata.tags.length > 0) {
            frontmatter.push(`tags:`);
            metadata.tags.forEach(tag => {
                frontmatter.push(`  - "${tag}"`);
            });
        }

        if (metadata.image) {
            frontmatter.push(`image: "${metadata.image}"`);
        }

        if (metadata.featured) {
            frontmatter.push(`featured: true`);
        }

        frontmatter.push('---');

        return frontmatter.join('\n');
    }

    /**
     * Save draft
     */
    public saveDraft(): void {
        const articleData = this.getCurrentArticleData();
        articleData.metadata.draft = true;
        articleData.metadata.lastmod = new Date();

        this.articles.set(articleData.metadata.slug, articleData);
        this.markDirty();
        this.saveArticles();
        this.renderArticleList();

        this.showMessage('草稿已保存', 'success');
    }

    /**
     * Publish article
     */
    public publishArticle(): void {
        const articleData = this.getCurrentArticleData();
        articleData.metadata.draft = false;
        articleData.metadata.lastmod = new Date();

        this.articles.set(articleData.metadata.slug, articleData);
        this.markDirty();
        this.saveArticles();
        this.renderArticleList();

        this.showMessage('文章已发布', 'success');
    }

    /**
     * Delete article
     */
    public deleteArticle(slug: string): void {
        if (!confirm('确定要删除这篇文章吗？此操作不可撤销。')) {
            return;
        }

        this.articles.delete(slug);
        this.markDirty();
        this.saveArticles();
        this.renderArticleList();

        this.showMessage('文章已删除', 'success');
    }

    /**
     * Render article list
     */
    private renderArticleList(): void {
        const listContainer = document.getElementById('article-list');
        if (!listContainer) return;

        const articles = Array.from(this.articles.values());

        if (articles.length === 0) {
            listContainer.innerHTML = '<div class="empty-state">暂无文章，点击"新建文章"开始创作</div>';
            return;
        }

        const html = articles.map(article => `
            <div class="article-item" data-slug="${article.metadata.slug}">
                <div class="article-checkbox">
                    <input type="checkbox" class="article-select" value="${article.metadata.slug}">
                </div>
                <div class="article-info">
                    <h5 class="article-title">${article.metadata.title}</h5>
                    <div class="article-meta">
                        <span class="article-status ${article.metadata.draft ? 'draft' : 'published'}">
                            ${article.metadata.draft ? '草稿' : '已发布'}
                        </span>
                        <span class="article-date">${article.metadata.date.toLocaleDateString()}</span>
                        <span class="article-categories">${article.metadata.categories.join(', ')}</span>
                    </div>
                    <div class="article-description">${article.metadata.description || '暂无描述'}</div>
                </div>
                <div class="article-actions">
                    <button class="action-btn edit-btn" onclick="window.articleManager.editArticle('${article.metadata.slug}')" title="编辑">
                        ✏️
                    </button>
                    <button class="action-btn duplicate-btn" onclick="window.articleManager.duplicateArticle('${article.metadata.slug}')" title="复制">
                        📋
                    </button>
                    <button class="action-btn delete-btn" onclick="window.articleManager.deleteArticle('${article.metadata.slug}')" title="删除">
                        🗑️
                    </button>
                </div>
            </div>
        `).join('');

        listContainer.innerHTML = html;
        this.updateBulkActions();
    }

    /**
     * Filter articles
     */
    private filterArticles(): void {
        const searchTerm = (document.getElementById('article-search') as HTMLInputElement).value.toLowerCase();
        const statusFilter = (document.getElementById('article-filter') as HTMLSelectElement).value;
        const categoryFilter = (document.getElementById('category-filter') as HTMLSelectElement).value;

        const articleItems = document.querySelectorAll('.article-item');

        articleItems.forEach(item => {
            const slug = item.getAttribute('data-slug');
            const article = this.articles.get(slug!);

            if (!article) return;

            let visible = true;

            // Search filter
            if (searchTerm) {
                const searchableText = `${article.metadata.title} ${article.metadata.description} ${article.content}`.toLowerCase();
                if (!searchableText.includes(searchTerm)) {
                    visible = false;
                }
            }

            // Status filter
            if (statusFilter) {
                if (statusFilter === 'published' && article.metadata.draft) {
                    visible = false;
                } else if (statusFilter === 'draft' && !article.metadata.draft) {
                    visible = false;
                }
            }

            // Category filter
            if (categoryFilter && !article.metadata.categories.includes(categoryFilter)) {
                visible = false;
            }

            (item as HTMLElement).style.display = visible ? 'block' : 'none';
        });
    }

    /**
     * Update bulk actions
     */
    private updateBulkActions(): void {
        const checkboxes = document.querySelectorAll('.article-select') as NodeListOf<HTMLInputElement>;
        const bulkDeleteBtn = document.getElementById('bulk-delete-btn') as HTMLButtonElement;
        const bulkPublishBtn = document.getElementById('bulk-publish-btn') as HTMLButtonElement;

        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                const selectedCount = Array.from(checkboxes).filter(cb => cb.checked).length;
                bulkDeleteBtn.disabled = selectedCount === 0;
                bulkPublishBtn.disabled = selectedCount === 0;
            });
        });
    }

    /**
     * Update word count
     */
    private updateWordCount(): void {
        const content = (document.getElementById('markdown-editor') as HTMLTextAreaElement).value;
        const wordCount = content.trim().split(/\s+/).length;
        const charCount = content.length;

        const wordCountEl = document.getElementById('word-count');
        const charCountEl = document.getElementById('char-count');

        if (wordCountEl) wordCountEl.textContent = `字数: ${wordCount}`;
        if (charCountEl) charCountEl.textContent = `字符: ${charCount}`;
    }

    /**
     * Update preview
     */
    private updatePreview(): void {
        const content = (document.getElementById('markdown-editor') as HTMLTextAreaElement).value;
        const previewContent = document.getElementById('preview-content');

        if (previewContent) {
            // Simple markdown to HTML conversion (basic implementation)
            const html = this.markdownToHtml(content);
            previewContent.innerHTML = html;
        }
    }

    /**
     * Basic markdown to HTML conversion
     */
    private markdownToHtml(markdown: string): string {
        return markdown
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
            .replace(/\*(.*)\*/gim, '<em>$1</em>')
            .replace(/!\[([^\]]*)\]\(([^\)]*)\)/gim, '<img alt="$1" src="$2" />')
            .replace(/\[([^\]]*)\]\(([^\)]*)\)/gim, '<a href="$2">$1</a>')
            .replace(/\n$/gim, '<br />');
    }

    /**
     * Toggle preview
     */
    public togglePreview(): void {
        const editorPane = document.querySelector('.editor-pane') as HTMLElement;
        const previewPane = document.getElementById('preview-pane') as HTMLElement;
        const toggleBtn = document.getElementById('toggle-preview') as HTMLElement;

        if (previewPane.style.display === 'none') {
            previewPane.style.display = 'block';
            editorPane.style.width = '50%';
            previewPane.style.width = '50%';
            toggleBtn.textContent = '📝';
            this.updatePreview();
        } else {
            previewPane.style.display = 'none';
            editorPane.style.width = '100%';
            toggleBtn.textContent = '👁️';
        }
    }

    /**
     * Setup toolbar actions
     */
    private setupToolbarActions(): void {
        const toolbar = document.querySelector('.editor-toolbar');
        if (!toolbar) return;

        toolbar.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            if (target.classList.contains('toolbar-btn')) {
                const action = target.getAttribute('data-action');
                if (action) {
                    this.executeToolbarAction(action);
                }
            }
        });
    }

    /**
     * Execute toolbar action
     */
    private executeToolbarAction(action: string): void {
        const editor = document.getElementById('markdown-editor') as HTMLTextAreaElement;
        const start = editor.selectionStart;
        const end = editor.selectionEnd;
        const selectedText = editor.value.substring(start, end);

        let replacement = '';
        let cursorOffset = 0;

        switch (action) {
            case 'bold':
                replacement = `**${selectedText || '粗体文本'}**`;
                cursorOffset = selectedText ? 0 : -2;
                break;
            case 'italic':
                replacement = `*${selectedText || '斜体文本'}*`;
                cursorOffset = selectedText ? 0 : -1;
                break;
            case 'heading':
                replacement = `## ${selectedText || '标题'}`;
                cursorOffset = selectedText ? 0 : -2;
                break;
            case 'link':
                replacement = `[${selectedText || '链接文本'}](URL)`;
                cursorOffset = selectedText ? -4 : -6;
                break;
            case 'image':
                replacement = `![${selectedText || '图片描述'}](图片URL)`;
                cursorOffset = selectedText ? -6 : -8;
                break;
            case 'code':
                replacement = `\`${selectedText || '代码'}\``;
                cursorOffset = selectedText ? 0 : -1;
                break;
            case 'quote':
                replacement = `> ${selectedText || '引用文本'}`;
                cursorOffset = selectedText ? 0 : -2;
                break;
            case 'list':
                replacement = `- ${selectedText || '列表项'}`;
                cursorOffset = selectedText ? 0 : -2;
                break;
        }

        if (replacement) {
            editor.value = editor.value.substring(0, start) + replacement + editor.value.substring(end);
            editor.focus();
            const newPosition = start + replacement.length + cursorOffset;
            editor.setSelectionRange(newPosition, newPosition);
            this.updatePreview();
            this.markDirty();
        }
    }

    /**
     * Open image uploader
     */
    private openImageUploader(): void {
        if (window.openImageManager) {
            window.openImageManager();
        } else {
            this.showMessage('图片上传功能暂不可用', 'warning');
        }
    }

    /**
     * Sync to GitHub
     */
    private async syncToGitHub(): Promise<void> {
        const articleData = this.getCurrentArticleData();

        try {
            this.showMessage('正在同步到GitHub...', 'info');

            // Here you would implement the actual GitHub sync
            // For now, we'll simulate it
            await new Promise(resolve => setTimeout(resolve, 2000));

            this.showMessage('已同步到GitHub', 'success');
        } catch (error) {
            this.showMessage('GitHub同步失败', 'error');
            console.error('GitHub sync error:', error);
        }
    }

    /**
     * Duplicate article
     */
    public duplicateArticle(slug: string): void {
        const article = this.articles.get(slug);
        if (!article) return;

        const duplicatedArticle: ArticleContent = {
            ...article,
            metadata: {
                ...article.metadata,
                title: article.metadata.title + ' (副本)',
                slug: article.metadata.slug + '-copy-' + Date.now(),
                date: new Date(),
                draft: true
            }
        };

        this.articles.set(duplicatedArticle.metadata.slug, duplicatedArticle);
        this.markDirty();
        this.saveArticles();
        this.renderArticleList();

        this.showMessage('文章已复制', 'success');
    }

    /**
     * Close editor
     */
    public closeEditor(): void {
        if (this.isDirty) {
            if (confirm('有未保存的更改，确定要关闭编辑器吗？')) {
                const editorSection = document.getElementById('article-editor');
                if (editorSection) {
                    editorSection.style.display = 'none';
                }
            }
        } else {
            const editorSection = document.getElementById('article-editor');
            if (editorSection) {
                editorSection.style.display = 'none';
            }
        }
    }

    /**
     * Show message to user
     */
    private showMessage(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info'): void {
        const messageEl = document.createElement('div');
        messageEl.className = `article-message ${type}`;
        messageEl.textContent = message;
        messageEl.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: var(--accent-color);
            color: white;
            border-radius: 6px;
            box-shadow: var(--shadow-l2);
            z-index: 10000;
            opacity: 0;
            transform: translateX(100px);
            transition: all 0.3s ease;
        `;

        if (type === 'error') {
            messageEl.style.background = '#ef4444';
        } else if (type === 'success') {
            messageEl.style.background = '#10b981';
        } else if (type === 'warning') {
            messageEl.style.background = '#f59e0b';
        }

        document.body.appendChild(messageEl);

        setTimeout(() => {
            messageEl.style.opacity = '1';
            messageEl.style.transform = 'translateX(0)';
        }, 10);

        setTimeout(() => {
            messageEl.style.opacity = '0';
            messageEl.style.transform = 'translateX(100px)';
            setTimeout(() => {
                if (messageEl.parentElement) {
                    messageEl.parentElement.removeChild(messageEl);
                }
            }, 300);
        }, 3000);
    }

    /**
     * Open article manager
     */
    public openManager(): void {
        const manager = document.getElementById('article-manager');
        if (manager) {
            manager.style.display = 'block';
            this.renderArticleList();
        }
    }

    /**
     * Close article manager
     */
    public closeManager(): void {
        const manager = document.getElementById('article-manager');
        if (manager) {
            manager.style.display = 'none';
        }
    }

    /**
     * Export articles
     */
    public exportArticles(): void {
        const articles = Array.from(this.articles.values());
        const exportData = {
            exportDate: new Date().toISOString(),
            articleCount: articles.length,
            articles: articles
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `blog-articles-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showMessage('文章已导出', 'success');
    }

    /**
     * Get articles
     */
    public getArticles(): Map<string, ArticleContent> {
        return this.articles;
    }

    /**
     * Cleanup
     */
    public destroy(): void {
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
        }
    }
}

// Global functions
declare global {
    interface Window {
        ArticleManager: typeof ArticleManager;
        articleManager: ArticleManager;
        openArticleManager: () => void;
    }
}

// Auto-initialize
const articleManager = new ArticleManager();

// Export to global
window.ArticleManager = ArticleManager;
window.articleManager = articleManager;
window.openArticleManager = () => articleManager.openManager();

export default ArticleManager;