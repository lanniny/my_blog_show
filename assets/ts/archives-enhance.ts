/*!
*   Hugo Theme Stack - Archives Enhancement
*
*   @author: Alex (Engineer)
*   @project: Hugo Blog Archives Enhancement
*   @description: Enhanced archives functionality with filtering, search, and statistics
*/

/**
 * Archive item interface
 */
export interface ArchiveItem {
    title: string;
    url: string;
    date: Date;
    categories: string[];
    tags: string[];
    summary?: string;
    readingTime?: number;
}

/**
 * Archive statistics interface
 */
export interface ArchiveStats {
    totalPosts: number;
    totalCategories: number;
    totalTags: number;
    yearlyStats: { [year: string]: number };
    categoryStats: { [category: string]: number };
    tagStats: { [tag: string]: number };
}

/**
 * Filter options interface
 */
export interface FilterOptions {
    year?: string;
    category?: string;
    tag?: string;
    searchTerm?: string;
}

/**
 * Archives Enhancement Class
 * Provides advanced filtering, search, and statistics for archives
 */
export class ArchivesEnhancer {
    private container: HTMLElement;
    private originalItems: ArchiveItem[] = [];
    private filteredItems: ArchiveItem[] = [];
    private stats: ArchiveStats;
    private currentFilters: FilterOptions = {};

    constructor(containerId: string = 'archives-container') {
        const container = document.getElementById(containerId);
        if (!container) {
            console.warn(`Archives container with id "${containerId}" not found`);
            return;
        }
        
        this.container = container;
        this.init();
    }

    /**
     * Initialize the archives enhancer
     */
    private async init(): Promise<void> {
        await this.parseExistingArchives();
        this.calculateStats();
        this.createEnhancedInterface();
        this.bindEvents();
        this.renderArchives();
    }

    /**
     * Parse existing archive items from the page
     */
    private async parseExistingArchives(): Promise<void> {
        const archiveGroups = document.querySelectorAll('.archives-group');
        
        archiveGroups.forEach(group => {
            const yearElement = group.querySelector('.archives-date');
            const year = yearElement?.textContent?.trim() || '';
            
            const articles = group.querySelectorAll('.article-list--compact .article');
            articles.forEach(article => {
                const titleElement = article.querySelector('.article-title a');
                const dateElement = article.querySelector('.article-time time');
                const categoryElements = article.querySelectorAll('.article-category a');
                const tagElements = article.querySelectorAll('.article-tags a');
                const summaryElement = article.querySelector('.article-excerpt');
                
                if (titleElement && dateElement) {
                    const item: ArchiveItem = {
                        title: titleElement.textContent?.trim() || '',
                        url: (titleElement as HTMLAnchorElement).href || '',
                        date: new Date(dateElement.getAttribute('datetime') || ''),
                        categories: Array.from(categoryElements).map(el => el.textContent?.trim() || ''),
                        tags: Array.from(tagElements).map(el => el.textContent?.trim() || ''),
                        summary: summaryElement?.textContent?.trim(),
                        readingTime: this.extractReadingTime(article)
                    };
                    
                    this.originalItems.push(item);
                }
            });
        });

        this.filteredItems = [...this.originalItems];
        console.log(`📚 Parsed ${this.originalItems.length} archive items`);
    }

    /**
     * Extract reading time from article element
     */
    private extractReadingTime(article: Element): number | undefined {
        const readingTimeElement = article.querySelector('.article-time .reading-time');
        if (readingTimeElement) {
            const text = readingTimeElement.textContent || '';
            const match = text.match(/(\d+)/);
            return match ? parseInt(match[1]) : undefined;
        }
        return undefined;
    }

    /**
     * Calculate archive statistics
     */
    private calculateStats(): void {
        const yearlyStats: { [year: string]: number } = {};
        const categoryStats: { [category: string]: number } = {};
        const tagStats: { [tag: string]: number } = {};
        const categories = new Set<string>();
        const tags = new Set<string>();

        this.originalItems.forEach(item => {
            // Yearly stats
            const year = item.date.getFullYear().toString();
            yearlyStats[year] = (yearlyStats[year] || 0) + 1;

            // Category stats
            item.categories.forEach(category => {
                categories.add(category);
                categoryStats[category] = (categoryStats[category] || 0) + 1;
            });

            // Tag stats
            item.tags.forEach(tag => {
                tags.add(tag);
                tagStats[tag] = (tagStats[tag] || 0) + 1;
            });
        });

        this.stats = {
            totalPosts: this.originalItems.length,
            totalCategories: categories.size,
            totalTags: tags.size,
            yearlyStats,
            categoryStats,
            tagStats
        };

        console.log('📊 Archive statistics calculated:', this.stats);
    }

    /**
     * Create enhanced interface
     */
    private createEnhancedInterface(): void {
        const enhancedHTML = `
            <div class="archives-enhanced">
                <!-- Statistics Panel -->
                <div class="archives-stats">
                    <div class="stats-grid">
                        <div class="stat-item">
                            <div class="stat-number">${this.stats.totalPosts}</div>
                            <div class="stat-label">总文章数</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-number">${this.stats.totalCategories}</div>
                            <div class="stat-label">分类数</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-number">${this.stats.totalTags}</div>
                            <div class="stat-label">标签数</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-number">${Object.keys(this.stats.yearlyStats).length}</div>
                            <div class="stat-label">年份跨度</div>
                        </div>
                    </div>
                </div>

                <!-- Filter Panel -->
                <div class="archives-filters">
                    <div class="filter-section">
                        <h3>📋 筛选选项</h3>
                        <div class="filter-grid">
                            <div class="filter-group">
                                <label for="year-filter">年份</label>
                                <select id="year-filter" class="filter-select">
                                    <option value="">所有年份</option>
                                    ${Object.keys(this.stats.yearlyStats)
                                        .sort((a, b) => parseInt(b) - parseInt(a))
                                        .map(year => `<option value="${year}">${year} (${this.stats.yearlyStats[year]})</option>`)
                                        .join('')}
                                </select>
                            </div>
                            
                            <div class="filter-group">
                                <label for="category-filter">分类</label>
                                <select id="category-filter" class="filter-select">
                                    <option value="">所有分类</option>
                                    ${Object.entries(this.stats.categoryStats)
                                        .sort(([,a], [,b]) => b - a)
                                        .map(([category, count]) => `<option value="${category}">${category} (${count})</option>`)
                                        .join('')}
                                </select>
                            </div>
                            
                            <div class="filter-group">
                                <label for="tag-filter">标签</label>
                                <select id="tag-filter" class="filter-select">
                                    <option value="">所有标签</option>
                                    ${Object.entries(this.stats.tagStats)
                                        .sort(([,a], [,b]) => b - a)
                                        .slice(0, 20) // 只显示前20个最常用标签
                                        .map(([tag, count]) => `<option value="${tag}">${tag} (${count})</option>`)
                                        .join('')}
                                </select>
                            </div>
                            
                            <div class="filter-group">
                                <label for="search-filter">搜索</label>
                                <input type="text" id="search-filter" class="filter-input" placeholder="搜索文章标题...">
                            </div>
                        </div>
                        
                        <div class="filter-actions">
                            <button id="apply-filters" class="btn btn-primary">应用筛选</button>
                            <button id="clear-filters" class="btn btn-secondary">清除筛选</button>
                            <button id="export-archives" class="btn btn-secondary">导出归档</button>
                            <button id="random-article" class="btn btn-secondary">随机文章</button>
                            <button id="toggle-advanced" class="btn btn-secondary">高级选项</button>
                        </div>

                        <!-- Advanced Options Panel -->
                        <div id="advanced-options" class="advanced-options" style="display: none;">
                            <h4>🔧 高级选项</h4>
                            <div class="advanced-grid">
                                <div class="option-group">
                                    <label for="date-range-start">开始日期</label>
                                    <input type="date" id="date-range-start" class="filter-input">
                                </div>
                                <div class="option-group">
                                    <label for="date-range-end">结束日期</label>
                                    <input type="date" id="date-range-end" class="filter-input">
                                </div>
                                <div class="option-group">
                                    <label for="reading-time-min">最少阅读时间(分钟)</label>
                                    <input type="number" id="reading-time-min" class="filter-input" min="0" placeholder="0">
                                </div>
                                <div class="option-group">
                                    <label for="reading-time-max">最多阅读时间(分钟)</label>
                                    <input type="number" id="reading-time-max" class="filter-input" min="0" placeholder="无限制">
                                </div>
                                <div class="option-group">
                                    <label for="sort-order">排序方式</label>
                                    <select id="sort-order" class="filter-select">
                                        <option value="date-desc">最新优先</option>
                                        <option value="date-asc">最旧优先</option>
                                        <option value="title-asc">标题A-Z</option>
                                        <option value="title-desc">标题Z-A</option>
                                        <option value="reading-time-asc">阅读时间短→长</option>
                                        <option value="reading-time-desc">阅读时间长→短</option>
                                    </select>
                                </div>
                                <div class="option-group">
                                    <label for="items-per-page">每页显示</label>
                                    <select id="items-per-page" class="filter-select">
                                        <option value="10">10篇</option>
                                        <option value="20" selected>20篇</option>
                                        <option value="50">50篇</option>
                                        <option value="100">100篇</option>
                                        <option value="all">全部</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Results Info -->
                <div class="archives-results-info">
                    <div class="results-count">
                        显示 <span id="filtered-count">${this.filteredItems.length}</span> / ${this.originalItems.length} 篇文章
                    </div>
                    <div class="view-options">
                        <button id="view-timeline" class="view-btn active" title="时间线视图">📅</button>
                        <button id="view-grid" class="view-btn" title="网格视图">🔲</button>
                        <button id="view-list" class="view-btn" title="列表视图">📋</button>
                    </div>
                </div>

                <!-- Archives Content -->
                <div id="archives-content" class="archives-content">
                    <!-- Content will be rendered here -->
                </div>
            </div>
        `;

        // Insert enhanced interface before existing archives
        this.container.insertAdjacentHTML('afterbegin', enhancedHTML);
    }

    /**
     * Bind event listeners
     */
    private bindEvents(): void {
        // Filter controls
        const yearFilter = document.getElementById('year-filter') as HTMLSelectElement;
        const categoryFilter = document.getElementById('category-filter') as HTMLSelectElement;
        const tagFilter = document.getElementById('tag-filter') as HTMLSelectElement;
        const searchFilter = document.getElementById('search-filter') as HTMLInputElement;
        
        // Apply filters button
        const applyFilters = document.getElementById('apply-filters');
        applyFilters?.addEventListener('click', () => {
            this.currentFilters = {
                year: yearFilter?.value || undefined,
                category: categoryFilter?.value || undefined,
                tag: tagFilter?.value || undefined,
                searchTerm: searchFilter?.value.trim() || undefined
            };
            this.applyFilters();
        });

        // Clear filters button
        const clearFilters = document.getElementById('clear-filters');
        clearFilters?.addEventListener('click', () => {
            this.clearFilters();
        });

        // Export archives button
        const exportArchives = document.getElementById('export-archives');
        exportArchives?.addEventListener('click', () => {
            this.exportArchives();
        });

        // Search input real-time filtering
        searchFilter?.addEventListener('input', this.debounce(() => {
            this.currentFilters.searchTerm = searchFilter.value.trim() || undefined;
            this.applyFilters();
        }, 300));

        // View mode buttons
        const viewButtons = document.querySelectorAll('.view-btn');
        viewButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = e.target as HTMLElement;
                const viewMode = target.id.replace('view-', '');
                this.switchViewMode(viewMode);

                // Update active state
                viewButtons.forEach(b => b.classList.remove('active'));
                target.classList.add('active');
            });
        });

        // Random article button
        const randomArticle = document.getElementById('random-article');
        randomArticle?.addEventListener('click', () => {
            this.goToRandomArticle();
        });

        // Toggle advanced options
        const toggleAdvanced = document.getElementById('toggle-advanced');
        const advancedOptions = document.getElementById('advanced-options');
        toggleAdvanced?.addEventListener('click', () => {
            if (advancedOptions) {
                const isVisible = advancedOptions.style.display !== 'none';
                advancedOptions.style.display = isVisible ? 'none' : 'block';
                toggleAdvanced.textContent = isVisible ? '高级选项' : '隐藏选项';
            }
        });

        // Advanced filter controls
        const dateRangeStart = document.getElementById('date-range-start') as HTMLInputElement;
        const dateRangeEnd = document.getElementById('date-range-end') as HTMLInputElement;
        const readingTimeMin = document.getElementById('reading-time-min') as HTMLInputElement;
        const readingTimeMax = document.getElementById('reading-time-max') as HTMLInputElement;
        const sortOrder = document.getElementById('sort-order') as HTMLSelectElement;
        const itemsPerPage = document.getElementById('items-per-page') as HTMLSelectElement;

        // Add change listeners for advanced options
        [dateRangeStart, dateRangeEnd, readingTimeMin, readingTimeMax, sortOrder, itemsPerPage].forEach(element => {
            element?.addEventListener('change', () => {
                this.applyAdvancedFilters();
            });
        });
    }

    /**
     * Apply current filters
     */
    private applyFilters(): void {
        this.filteredItems = this.originalItems.filter(item => {
            // Year filter
            if (this.currentFilters.year) {
                const itemYear = item.date.getFullYear().toString();
                if (itemYear !== this.currentFilters.year) return false;
            }

            // Category filter
            if (this.currentFilters.category) {
                if (!item.categories.includes(this.currentFilters.category)) return false;
            }

            // Tag filter
            if (this.currentFilters.tag) {
                if (!item.tags.includes(this.currentFilters.tag)) return false;
            }

            // Search filter
            if (this.currentFilters.searchTerm) {
                const searchTerm = this.currentFilters.searchTerm.toLowerCase();
                const titleMatch = item.title.toLowerCase().includes(searchTerm);
                const summaryMatch = item.summary?.toLowerCase().includes(searchTerm) || false;
                if (!titleMatch && !summaryMatch) return false;
            }

            return true;
        });

        this.updateResultsCount();
        this.renderArchives();
        
        console.log(`🔍 Applied filters, showing ${this.filteredItems.length} items`);
    }

    /**
     * Clear all filters
     */
    private clearFilters(): void {
        this.currentFilters = {};
        this.filteredItems = [...this.originalItems];
        
        // Reset form controls
        const yearFilter = document.getElementById('year-filter') as HTMLSelectElement;
        const categoryFilter = document.getElementById('category-filter') as HTMLSelectElement;
        const tagFilter = document.getElementById('tag-filter') as HTMLSelectElement;
        const searchFilter = document.getElementById('search-filter') as HTMLInputElement;
        
        if (yearFilter) yearFilter.value = '';
        if (categoryFilter) categoryFilter.value = '';
        if (tagFilter) tagFilter.value = '';
        if (searchFilter) searchFilter.value = '';
        
        this.updateResultsCount();
        this.renderArchives();
        
        console.log('🧹 Filters cleared');
    }

    /**
     * Update results count display
     */
    private updateResultsCount(): void {
        const countElement = document.getElementById('filtered-count');
        if (countElement) {
            countElement.textContent = this.filteredItems.length.toString();
        }
    }

    /**
     * Switch view mode
     */
    private switchViewMode(mode: string): void {
        const contentContainer = document.getElementById('archives-content');
        if (contentContainer) {
            contentContainer.className = `archives-content view-${mode}`;
            this.renderArchives();
        }
    }

    /**
     * Render archives based on current filters and view mode
     */
    private renderArchives(): void {
        const contentContainer = document.getElementById('archives-content');
        if (!contentContainer) return;

        const viewMode = this.getViewMode(contentContainer);
        
        if (this.filteredItems.length === 0) {
            contentContainer.innerHTML = `
                <div class="no-results">
                    <div class="no-results-icon">📭</div>
                    <h3>没有找到匹配的文章</h3>
                    <p>尝试调整筛选条件或清除所有筛选</p>
                </div>
            `;
            return;
        }

        switch (viewMode) {
            case 'timeline':
                this.renderTimelineView(contentContainer);
                break;
            case 'grid':
                this.renderGridView(contentContainer);
                break;
            case 'list':
                this.renderListView(contentContainer);
                break;
            default:
                this.renderTimelineView(contentContainer);
        }
    }

    /**
     * Get current view mode from container class
     */
    private getViewMode(container: HTMLElement): string {
        const classes = container.className.split(' ');
        const viewClass = classes.find(cls => cls.startsWith('view-'));
        return viewClass ? viewClass.replace('view-', '') : 'timeline';
    }

    /**
     * Render timeline view (default)
     */
    private renderTimelineView(container: HTMLElement): void {
        const groupedByYear = this.groupItemsByYear(this.filteredItems);
        
        let html = '';
        Object.entries(groupedByYear)
            .sort(([a], [b]) => parseInt(b) - parseInt(a))
            .forEach(([year, items]) => {
                html += `
                    <div class="archives-year-group">
                        <h2 class="archives-year-title">
                            <span class="year">${year}</span>
                            <span class="count">(${items.length}篇)</span>
                        </h2>
                        <div class="archives-timeline">
                            ${items.map(item => this.renderTimelineItem(item)).join('')}
                        </div>
                    </div>
                `;
            });
        
        container.innerHTML = html;
    }

    /**
     * Render grid view
     */
    private renderGridView(container: HTMLElement): void {
        const html = `
            <div class="archives-grid">
                ${this.filteredItems.map(item => this.renderGridItem(item)).join('')}
            </div>
        `;
        container.innerHTML = html;
    }

    /**
     * Render list view
     */
    private renderListView(container: HTMLElement): void {
        const html = `
            <div class="archives-list">
                ${this.filteredItems.map(item => this.renderListItem(item)).join('')}
            </div>
        `;
        container.innerHTML = html;
    }

    /**
     * Group items by year
     */
    private groupItemsByYear(items: ArchiveItem[]): { [year: string]: ArchiveItem[] } {
        return items.reduce((groups, item) => {
            const year = item.date.getFullYear().toString();
            if (!groups[year]) groups[year] = [];
            groups[year].push(item);
            return groups;
        }, {} as { [year: string]: ArchiveItem[] });
    }

    /**
     * Render timeline item
     */
    private renderTimelineItem(item: ArchiveItem): string {
        return `
            <div class="timeline-item">
                <div class="timeline-date">
                    ${this.formatDate(item.date, 'MM-DD')}
                </div>
                <div class="timeline-content">
                    <h3 class="timeline-title">
                        <a href="${item.url}">${item.title}</a>
                    </h3>
                    ${item.summary ? `<p class="timeline-summary">${item.summary}</p>` : ''}
                    <div class="timeline-meta">
                        ${item.categories.length > 0 ? `
                            <span class="meta-categories">
                                ${item.categories.map(cat => `<span class="category-tag">${cat}</span>`).join('')}
                            </span>
                        ` : ''}
                        ${item.readingTime ? `<span class="reading-time">${item.readingTime}分钟阅读</span>` : ''}
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Render grid item
     */
    private renderGridItem(item: ArchiveItem): string {
        return `
            <div class="grid-item">
                <div class="grid-content">
                    <div class="grid-date">${this.formatDate(item.date, 'YYYY-MM-DD')}</div>
                    <h3 class="grid-title">
                        <a href="${item.url}">${item.title}</a>
                    </h3>
                    ${item.summary ? `<p class="grid-summary">${this.truncateText(item.summary, 100)}</p>` : ''}
                    <div class="grid-meta">
                        ${item.categories.slice(0, 2).map(cat => `<span class="category-tag">${cat}</span>`).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Render list item
     */
    private renderListItem(item: ArchiveItem): string {
        return `
            <div class="list-item">
                <div class="list-date">${this.formatDate(item.date, 'YYYY-MM-DD')}</div>
                <div class="list-content">
                    <h3 class="list-title">
                        <a href="${item.url}">${item.title}</a>
                    </h3>
                    ${item.summary ? `<p class="list-summary">${this.truncateText(item.summary, 150)}</p>` : ''}
                </div>
                <div class="list-meta">
                    ${item.categories.slice(0, 3).map(cat => `<span class="category-tag">${cat}</span>`).join('')}
                    ${item.readingTime ? `<span class="reading-time">${item.readingTime}min</span>` : ''}
                </div>
            </div>
        `;
    }

    /**
     * Go to random article
     */
    private goToRandomArticle(): void {
        if (this.filteredItems.length === 0) {
            alert('没有可用的文章');
            return;
        }

        const randomIndex = Math.floor(Math.random() * this.filteredItems.length);
        const randomArticle = this.filteredItems[randomIndex];

        // Show confirmation with article info
        const confirmed = confirm(`即将跳转到随机文章：\n\n"${randomArticle.title}"\n\n确定要跳转吗？`);
        if (confirmed) {
            window.open(randomArticle.url, '_blank');
        }
    }

    /**
     * Apply advanced filters
     */
    private applyAdvancedFilters(): void {
        const dateRangeStart = (document.getElementById('date-range-start') as HTMLInputElement)?.value;
        const dateRangeEnd = (document.getElementById('date-range-end') as HTMLInputElement)?.value;
        const readingTimeMin = parseInt((document.getElementById('reading-time-min') as HTMLInputElement)?.value) || 0;
        const readingTimeMax = parseInt((document.getElementById('reading-time-max') as HTMLInputElement)?.value) || Infinity;
        const sortOrder = (document.getElementById('sort-order') as HTMLSelectElement)?.value || 'date-desc';

        // Apply date range filter
        let filtered = this.filteredItems.filter(item => {
            if (dateRangeStart && item.date < new Date(dateRangeStart)) return false;
            if (dateRangeEnd && item.date > new Date(dateRangeEnd + 'T23:59:59')) return false;
            if (item.readingTime && (item.readingTime < readingTimeMin || item.readingTime > readingTimeMax)) return false;
            return true;
        });

        // Apply sorting
        filtered = this.sortItems(filtered, sortOrder);

        // Update display
        this.filteredItems = filtered;
        this.updateResultsCount();
        this.renderArchives();

        console.log(`🔧 Applied advanced filters, showing ${filtered.length} items`);
    }

    /**
     * Sort items based on criteria
     */
    private sortItems(items: ArchiveItem[], sortOrder: string): ArchiveItem[] {
        return [...items].sort((a, b) => {
            switch (sortOrder) {
                case 'date-asc':
                    return a.date.getTime() - b.date.getTime();
                case 'date-desc':
                    return b.date.getTime() - a.date.getTime();
                case 'title-asc':
                    return a.title.localeCompare(b.title);
                case 'title-desc':
                    return b.title.localeCompare(a.title);
                case 'reading-time-asc':
                    return (a.readingTime || 0) - (b.readingTime || 0);
                case 'reading-time-desc':
                    return (b.readingTime || 0) - (a.readingTime || 0);
                default:
                    return b.date.getTime() - a.date.getTime();
            }
        });
    }

    /**
     * Export archives to various formats
     */
    private exportArchives(): void {
        const exportData = {
            exportDate: new Date().toISOString(),
            totalItems: this.filteredItems.length,
            filters: this.currentFilters,
            statistics: this.stats,
            items: this.filteredItems.map(item => ({
                title: item.title,
                url: item.url,
                date: item.date.toISOString(),
                categories: item.categories,
                tags: item.tags,
                summary: item.summary,
                readingTime: item.readingTime
            }))
        };

        // Create multiple export formats
        this.showExportOptions(exportData);
    }

    /**
     * Show export options dialog
     */
    private showExportOptions(data: any): void {
        const exportFormats = [
            { name: 'JSON', extension: 'json', mimeType: 'application/json' },
            { name: 'CSV', extension: 'csv', mimeType: 'text/csv' },
            { name: 'Markdown', extension: 'md', mimeType: 'text/markdown' }
        ];

        const formatChoice = prompt(`选择导出格式：\n1. JSON (完整数据)\n2. CSV (表格格式)\n3. Markdown (文档格式)\n\n请输入数字 (1-3):`);

        if (!formatChoice || !['1', '2', '3'].includes(formatChoice)) {
            return;
        }

        const formatIndex = parseInt(formatChoice) - 1;
        const format = exportFormats[formatIndex];

        let content: string;
        let filename: string;

        switch (format.extension) {
            case 'json':
                content = JSON.stringify(data, null, 2);
                filename = `archives-export-${new Date().toISOString().split('T')[0]}.json`;
                break;
            case 'csv':
                content = this.convertToCSV(data.items);
                filename = `archives-export-${new Date().toISOString().split('T')[0]}.csv`;
                break;
            case 'md':
                content = this.convertToMarkdown(data);
                filename = `archives-export-${new Date().toISOString().split('T')[0]}.md`;
                break;
            default:
                return;
        }

        // Download file
        const blob = new Blob([content], { type: format.mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        console.log(`📥 Archives exported as ${format.name} successfully`);
    }

    /**
     * Convert data to CSV format
     */
    private convertToCSV(items: any[]): string {
        const headers = ['标题', '链接', '日期', '分类', '标签', '摘要', '阅读时间'];
        const csvContent = [
            headers.join(','),
            ...items.map(item => [
                `"${item.title.replace(/"/g, '""')}"`,
                `"${item.url}"`,
                `"${item.date.split('T')[0]}"`,
                `"${item.categories.join('; ')}"`,
                `"${item.tags.join('; ')}"`,
                `"${(item.summary || '').replace(/"/g, '""')}"`,
                `"${item.readingTime || ''}"`
            ].join(','))
        ].join('\n');

        return '\uFEFF' + csvContent; // Add BOM for Excel compatibility
    }

    /**
     * Convert data to Markdown format
     */
    private convertToMarkdown(data: any): string {
        const { exportDate, totalItems, statistics, items } = data;

        let markdown = `# 博客文章归档\n\n`;
        markdown += `**导出日期**: ${new Date(exportDate).toLocaleDateString()}\n`;
        markdown += `**文章总数**: ${totalItems}\n`;
        markdown += `**分类数**: ${statistics.totalCategories}\n`;
        markdown += `**标签数**: ${statistics.totalTags}\n\n`;

        markdown += `## 统计信息\n\n`;
        markdown += `### 按年份分布\n\n`;
        Object.entries(statistics.yearlyStats)
            .sort(([a], [b]) => parseInt(b) - parseInt(a))
            .forEach(([year, count]) => {
                markdown += `- **${year}年**: ${count}篇\n`;
            });

        markdown += `\n### 按分类分布\n\n`;
        Object.entries(statistics.categoryStats)
            .sort(([,a], [,b]) => (b as number) - (a as number))
            .slice(0, 10)
            .forEach(([category, count]) => {
                markdown += `- **${category}**: ${count}篇\n`;
            });

        markdown += `\n## 文章列表\n\n`;
        items.forEach((item: any, index: number) => {
            markdown += `### ${index + 1}. [${item.title}](${item.url})\n\n`;
            markdown += `**日期**: ${item.date.split('T')[0]}\n`;
            if (item.categories.length > 0) {
                markdown += `**分类**: ${item.categories.join(', ')}\n`;
            }
            if (item.tags.length > 0) {
                markdown += `**标签**: ${item.tags.join(', ')}\n`;
            }
            if (item.readingTime) {
                markdown += `**阅读时间**: ${item.readingTime}分钟\n`;
            }
            if (item.summary) {
                markdown += `\n${item.summary}\n`;
            }
            markdown += `\n---\n\n`;
        });

        return markdown;
    }

    /**
     * Utility functions
     */
    private formatDate(date: Date, format: string): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return format
            .replace('YYYY', year.toString())
            .replace('MM', month)
            .replace('DD', day);
    }

    private truncateText(text: string, maxLength: number): string {
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    }

    private debounce(func: Function, wait: number): Function {
        let timeout: NodeJS.Timeout;
        return function executedFunction(...args: any[]) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize on archives page
    if (document.body.classList.contains('template-archives')) {
        new ArchivesEnhancer();
        console.log('📚 Archives enhancement initialized');
    }
});

// Export for global use
(window as any).ArchivesEnhancer = ArchivesEnhancer;
