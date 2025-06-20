/**
 * 高级搜索功能扩展
 * 基于现有搜索系统，添加筛选、排序、历史记录等功能
 */

interface ExtendedPageData {
    title: string;
    date: string;
    permalink: string;
    content: string;
    categories: string[];
    tags: string[];
    summary: string;
    readingTime: number;
    wordCount: number;
    lastmod: string;
    image?: string;
    preview: string;
    matchCount: number;
}

interface SearchFilters {
    category: string;
    tags: string[];
    dateFrom: string;
    dateTo: string;
    sort: string;
}

interface SearchHistory {
    keyword: string;
    filters: SearchFilters;
    timestamp: number;
    resultCount: number;
}

class AdvancedSearch {
    private originalSearch: any; // 原始搜索类实例
    private form: HTMLFormElement;
    private filtersPanel: HTMLElement;
    private toggleButton: HTMLElement;
    private closeButton: HTMLElement;
    private tagFilterInput: HTMLInputElement;
    private tagFilterDropdown: HTMLElement;
    private searchHistory: SearchHistory[] = [];
    private isFiltersVisible: boolean = false;

    constructor(originalSearchInstance: any) {
        this.originalSearch = originalSearchInstance;
        this.form = document.querySelector('.search-form') as HTMLFormElement;
        this.filtersPanel = document.getElementById('advanced-filters-panel');
        this.toggleButton = document.querySelector('.advanced-toggle-btn');
        this.closeButton = document.querySelector('.filters-close');
        this.tagFilterInput = document.querySelector('.tag-filter-input') as HTMLInputElement;
        this.tagFilterDropdown = document.querySelector('.tag-filter-dropdown');

        this.init();
    }

    /**
     * 初始化高级搜索功能
     */
    init(): void {
        console.log('🔍 初始化高级搜索功能...');
        
        this.loadSearchHistory();
        this.bindEvents();
        this.initTagFilter();
        this.restoreFiltersFromURL();
        
        console.log('✅ 高级搜索功能初始化完成');
    }

    /**
     * 绑定事件监听器
     */
    bindEvents(): void {
        // 高级筛选面板切换
        if (this.toggleButton) {
            this.toggleButton.addEventListener('click', () => {
                this.toggleFiltersPanel();
            });
        }

        // 关闭筛选面板
        if (this.closeButton) {
            this.closeButton.addEventListener('click', () => {
                this.hideFiltersPanel();
            });
        }

        // 清除筛选按钮
        const clearBtn = document.querySelector('.btn-clear');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                this.clearFilters();
            });
        }

        // 应用筛选按钮
        const applyBtn = document.querySelector('.btn-apply');
        if (applyBtn) {
            applyBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.performAdvancedSearch();
            });
        }

        // 表单提交事件
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.performAdvancedSearch();
        });

        // 标签筛选输入
        if (this.tagFilterInput) {
            this.tagFilterInput.addEventListener('input', () => {
                this.filterTagOptions();
            });
        }
    }

    /**
     * 切换筛选面板
     */
    toggleFiltersPanel(): void {
        this.isFiltersVisible = !this.isFiltersVisible;

        if (this.isFiltersVisible) {
            this.showFiltersPanel();
        } else {
            this.hideFiltersPanel();
        }
    }

    /**
     * 显示筛选面板
     */
    showFiltersPanel(): void {
        this.isFiltersVisible = true;
        this.filtersPanel.classList.add('show');
        this.toggleButton.classList.add('active');
    }

    /**
     * 隐藏筛选面板
     */
    hideFiltersPanel(): void {
        this.isFiltersVisible = false;
        this.filtersPanel.classList.remove('show');
        this.toggleButton.classList.remove('active');
    }

    /**
     * 初始化标签筛选功能
     */
    initTagFilter(): void {
        if (!this.tagFilterDropdown) return;

        // 点击外部关闭下拉菜单
        document.addEventListener('click', (e) => {
            if (!this.tagFilterInput.contains(e.target as Node) && 
                !this.tagFilterDropdown.contains(e.target as Node)) {
                this.tagFilterDropdown.classList.remove('show');
            }
        });

        // 点击输入框显示下拉菜单
        this.tagFilterInput.addEventListener('focus', () => {
            this.tagFilterDropdown.classList.add('show');
        });

        // 标签选项点击事件
        const tagOptions = this.tagFilterDropdown.querySelectorAll('input[type="checkbox"]');
        tagOptions.forEach(option => {
            option.addEventListener('change', () => {
                this.updateTagFilterInput();
            });
        });
    }

    /**
     * 筛选标签选项
     */
    filterTagOptions(): void {
        const query = this.tagFilterInput.value.toLowerCase();
        const options = this.tagFilterDropdown.querySelectorAll('.tag-option');

        options.forEach(option => {
            const tagName = option.querySelector('.tag-text').textContent.toLowerCase();
            const isVisible = tagName.includes(query);
            (option as HTMLElement).style.display = isVisible ? 'flex' : 'none';
        });
    }

    /**
     * 更新标签筛选输入框显示
     */
    updateTagFilterInput(): void {
        const selectedTags = Array.from(
            this.tagFilterDropdown.querySelectorAll('input[type="checkbox"]:checked')
        ).map(input => (input as HTMLInputElement).value);

        this.tagFilterInput.value = selectedTags.join(', ');
        this.tagFilterInput.placeholder = selectedTags.length > 0 ? '' : '搜索标签...';
    }

    /**
     * 获取当前筛选条件
     */
    getCurrentFilters(): SearchFilters {
        const categorySelect = this.form.querySelector('select[name="category"]') as HTMLSelectElement;
        const tagCheckboxes = this.form.querySelectorAll('input[name="tags"]:checked');
        const dateFromInput = this.form.querySelector('input[name="date-from"]') as HTMLInputElement;
        const dateToInput = this.form.querySelector('input[name="date-to"]') as HTMLInputElement;
        const sortSelect = this.form.querySelector('select[name="sort"]') as HTMLSelectElement;

        return {
            category: categorySelect?.value || '',
            tags: Array.from(tagCheckboxes).map(cb => (cb as HTMLInputElement).value),
            dateFrom: dateFromInput?.value || '',
            dateTo: dateToInput?.value || '',
            sort: sortSelect?.value || 'relevance'
        };
    }

    /**
     * 执行高级搜索
     */
    async performAdvancedSearch(): Promise<void> {
        const keywordInput = this.form.querySelector('input[name="keyword"]') as HTMLInputElement;
        const keyword = keywordInput.value.trim();
        const filters = this.getCurrentFilters();

        console.log('🔍 执行高级搜索:', { keyword, filters });

        // 更新URL参数
        this.updateURLParams(keyword, filters);

        // 获取搜索数据
        const rawData = await this.originalSearch.getData();
        
        // 应用筛选
        let filteredData = this.applyFilters(rawData, filters);

        // 执行关键词搜索
        if (keyword) {
            filteredData = await this.searchWithKeywords(filteredData, keyword);
        }

        // 应用排序
        filteredData = this.applySorting(filteredData, filters.sort);

        // 显示结果
        this.displayResults(filteredData, keyword);

        // 保存搜索历史
        this.saveSearchHistory(keyword, filters, filteredData.length);
    }

    /**
     * 应用筛选条件
     */
    applyFilters(data: ExtendedPageData[], filters: SearchFilters): ExtendedPageData[] {
        return data.filter(item => {
            // 分类筛选
            if (filters.category && !item.categories.includes(filters.category)) {
                return false;
            }

            // 标签筛选
            if (filters.tags.length > 0) {
                const hasMatchingTag = filters.tags.some(tag => item.tags.includes(tag));
                if (!hasMatchingTag) return false;
            }

            // 时间范围筛选
            if (filters.dateFrom) {
                const itemDate = new Date(item.date);
                const fromDate = new Date(filters.dateFrom);
                if (itemDate < fromDate) return false;
            }

            if (filters.dateTo) {
                const itemDate = new Date(item.date);
                const toDate = new Date(filters.dateTo);
                if (itemDate > toDate) return false;
            }

            return true;
        });
    }

    /**
     * 关键词搜索
     */
    async searchWithKeywords(data: ExtendedPageData[], keyword: string): Promise<ExtendedPageData[]> {
        // 复用原始搜索的关键词匹配逻辑
        const keywords = keyword.split(' ').filter(k => k.trim() !== '');
        const regex = new RegExp(keywords.map(k => k.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&')).join('|'), 'gi');

        return data.filter(item => {
            const titleMatch = item.title.match(regex);
            const contentMatch = item.content.match(regex);
            const summaryMatch = item.summary.match(regex);
            
            item.matchCount = (titleMatch?.length || 0) + (contentMatch?.length || 0) + (summaryMatch?.length || 0);
            return item.matchCount > 0;
        });
    }

    /**
     * 应用排序
     */
    applySorting(data: ExtendedPageData[], sortType: string): ExtendedPageData[] {
        switch (sortType) {
            case 'date-desc':
                return data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            case 'date-asc':
                return data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
            case 'title':
                return data.sort((a, b) => a.title.localeCompare(b.title));
            case 'relevance':
            default:
                return data.sort((a, b) => (b.matchCount || 0) - (a.matchCount || 0));
        }
    }

    /**
     * 显示搜索结果
     */
    displayResults(results: ExtendedPageData[], keyword: string): void {
        const resultList = document.querySelector('.search-result--list');
        const resultTitle = document.querySelector('.search-result--title');

        if (!resultList || !resultTitle) return;

        // 清空现有结果
        resultList.innerHTML = '';

        // 更新结果标题
        const resultText = keyword ? 
            `找到 ${results.length} 个结果` : 
            `共 ${results.length} 篇文章`;
        resultTitle.textContent = resultText;

        // 渲染结果
        results.forEach(item => {
            const articleElement = this.renderAdvancedResult(item);
            resultList.appendChild(articleElement);
        });
    }

    /**
     * 渲染增强的搜索结果
     */
    renderAdvancedResult(item: ExtendedPageData): HTMLElement {
        const article = document.createElement('article');
        article.className = 'search-result-item';

        const date = new Date(item.date).toLocaleDateString('zh-CN');
        const readingTime = `${item.readingTime} 分钟阅读`;

        article.innerHTML = `
            <a href="${item.permalink}" class="result-link">
                <div class="result-content">
                    <h3 class="result-title">${item.title}</h3>
                    <p class="result-summary">${item.summary}</p>
                    <div class="result-meta">
                        <span class="result-date">${date}</span>
                        <span class="result-reading-time">${readingTime}</span>
                        ${item.categories.length > 0 ? `<span class="result-category">${item.categories[0]}</span>` : ''}
                    </div>
                    ${item.tags.length > 0 ? `
                        <div class="result-tags">
                            ${item.tags.slice(0, 3).map(tag => `<span class="result-tag">${tag}</span>`).join('')}
                        </div>
                    ` : ''}
                </div>
                ${item.image ? `
                    <div class="result-image">
                        <img src="${item.image}" alt="${item.title}" loading="lazy" />
                    </div>
                ` : ''}
            </a>
        `;

        return article;
    }

    /**
     * 清除筛选条件
     */
    clearFilters(): void {
        // 重置表单
        const categorySelect = this.form.querySelector('select[name="category"]') as HTMLSelectElement;
        const tagCheckboxes = this.form.querySelectorAll('input[name="tags"]');
        const dateInputs = this.form.querySelectorAll('input[type="date"]');
        const sortSelect = this.form.querySelector('select[name="sort"]') as HTMLSelectElement;

        if (categorySelect) categorySelect.value = '';
        tagCheckboxes.forEach(cb => (cb as HTMLInputElement).checked = false);
        dateInputs.forEach(input => (input as HTMLInputElement).value = '');
        if (sortSelect) sortSelect.value = 'relevance';
        if (this.tagFilterInput) {
            this.tagFilterInput.value = '';
            this.tagFilterInput.placeholder = '搜索标签...';
        }

        // 重新执行搜索
        this.performAdvancedSearch();
    }

    /**
     * 更新URL参数
     */
    updateURLParams(keyword: string, filters: SearchFilters): void {
        const url = new URL(window.location.href);
        
        if (keyword) {
            url.searchParams.set('keyword', keyword);
        } else {
            url.searchParams.delete('keyword');
        }

        if (filters.category) url.searchParams.set('category', filters.category);
        else url.searchParams.delete('category');

        if (filters.tags.length > 0) url.searchParams.set('tags', filters.tags.join(','));
        else url.searchParams.delete('tags');

        if (filters.dateFrom) url.searchParams.set('from', filters.dateFrom);
        else url.searchParams.delete('from');

        if (filters.dateTo) url.searchParams.set('to', filters.dateTo);
        else url.searchParams.delete('to');

        if (filters.sort !== 'relevance') url.searchParams.set('sort', filters.sort);
        else url.searchParams.delete('sort');

        window.history.replaceState({}, '', url.toString());
    }

    /**
     * 从URL恢复筛选条件
     */
    restoreFiltersFromURL(): void {
        const url = new URL(window.location.href);
        
        // 恢复分类
        const category = url.searchParams.get('category');
        if (category) {
            const categorySelect = this.form.querySelector('select[name="category"]') as HTMLSelectElement;
            if (categorySelect) categorySelect.value = category;
        }

        // 恢复标签
        const tags = url.searchParams.get('tags');
        if (tags) {
            const tagList = tags.split(',');
            tagList.forEach(tag => {
                const checkbox = this.form.querySelector(`input[name="tags"][value="${tag}"]`) as HTMLInputElement;
                if (checkbox) checkbox.checked = true;
            });
            this.updateTagFilterInput();
        }

        // 恢复日期范围
        const dateFrom = url.searchParams.get('from');
        const dateTo = url.searchParams.get('to');
        if (dateFrom) {
            const fromInput = this.form.querySelector('input[name="date-from"]') as HTMLInputElement;
            if (fromInput) fromInput.value = dateFrom;
        }
        if (dateTo) {
            const toInput = this.form.querySelector('input[name="date-to"]') as HTMLInputElement;
            if (toInput) toInput.value = dateTo;
        }

        // 恢复排序
        const sort = url.searchParams.get('sort');
        if (sort) {
            const sortSelect = this.form.querySelector('select[name="sort"]') as HTMLSelectElement;
            if (sortSelect) sortSelect.value = sort;
        }
    }

    /**
     * 保存搜索历史
     */
    saveSearchHistory(keyword: string, filters: SearchFilters, resultCount: number): void {
        if (!keyword && !filters.category && filters.tags.length === 0) return;

        const historyItem: SearchHistory = {
            keyword,
            filters,
            timestamp: Date.now(),
            resultCount
        };

        this.searchHistory.unshift(historyItem);
        this.searchHistory = this.searchHistory.slice(0, 10); // 保留最近10条

        localStorage.setItem('searchHistory', JSON.stringify(this.searchHistory));
    }

    /**
     * 加载搜索历史
     */
    loadSearchHistory(): void {
        const saved = localStorage.getItem('searchHistory');
        if (saved) {
            try {
                this.searchHistory = JSON.parse(saved);
            } catch (e) {
                console.warn('搜索历史加载失败:', e);
                this.searchHistory = [];
            }
        }
    }

    /**
     * 获取搜索历史
     */
    getSearchHistory(): SearchHistory[] {
        return this.searchHistory;
    }
}

// 导出类
export default AdvancedSearch;

// 全局初始化
declare global {
    interface Window {
        AdvancedSearch: typeof AdvancedSearch;
    }
}

window.AdvancedSearch = AdvancedSearch;
