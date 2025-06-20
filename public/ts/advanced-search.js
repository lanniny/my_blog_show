(() => {
  // <stdin>
  var AdvancedSearch = class {
    originalSearch;
    // 原始搜索类实例
    form;
    filtersPanel;
    toggleButton;
    closeButton;
    tagFilterInput;
    tagFilterDropdown;
    searchHistory = [];
    isFiltersVisible = false;
    constructor(originalSearchInstance) {
      this.originalSearch = originalSearchInstance;
      this.form = document.querySelector(".search-form");
      this.filtersPanel = document.getElementById("search-filters");
      this.toggleButton = document.querySelector(".advanced-toggle-btn");
      this.closeButton = null;
      this.tagFilterInput = null;
      this.tagFilterDropdown = null;
      this.init();
    }
    /**
     * 初始化高级搜索功能
     */
    init() {
      console.log("\u{1F50D} \u521D\u59CB\u5316\u9AD8\u7EA7\u641C\u7D22\u529F\u80FD...");
      this.loadSearchHistory();
      this.bindEvents();
      this.initTagFilter();
      this.restoreFiltersFromURL();
      console.log("\u2705 \u9AD8\u7EA7\u641C\u7D22\u529F\u80FD\u521D\u59CB\u5316\u5B8C\u6210");
    }
    /**
     * 绑定事件监听器
     */
    bindEvents() {
      if (this.toggleButton) {
        this.toggleButton.addEventListener("click", () => {
          this.toggleFiltersPanel();
        });
      }
      const resetBtn = document.querySelector(".btn-reset");
      if (resetBtn) {
        resetBtn.addEventListener("click", () => {
          this.clearFilters();
        });
      }
      const searchBtn = document.querySelector(".btn-search");
      if (searchBtn) {
        searchBtn.addEventListener("click", (e) => {
          e.preventDefault();
          this.performAdvancedSearch();
        });
      }
      this.form.addEventListener("submit", (e) => {
        e.preventDefault();
        this.performAdvancedSearch();
      });
    }
    /**
     * 切换筛选面板
     */
    toggleFiltersPanel() {
      this.isFiltersVisible = !this.isFiltersVisible;
      if (this.isFiltersVisible) {
        this.filtersPanel.classList.add("show");
        this.toggleButton.classList.add("active");
      } else {
        this.filtersPanel.classList.remove("show");
        this.toggleButton.classList.remove("active");
      }
    }
    /**
     * 初始化标签筛选功能 - 简化版本
     */
    initTagFilter() {
      console.log("\u4F7F\u7528\u7B80\u5316\u7684\u6807\u7B7E\u7B5B\u9009");
    }
    /**
     * 获取当前筛选条件
     */
    getCurrentFilters() {
      const categorySelect = this.form.querySelector('select[name="category"]');
      const tagsSelect = this.form.querySelector('select[name="tags"]');
      const sortSelect = this.form.querySelector('select[name="sort"]');
      const selectedTags = tagsSelect ? Array.from(tagsSelect.selectedOptions).map((option) => option.value) : [];
      return {
        category: categorySelect?.value || "",
        tags: selectedTags,
        dateFrom: "",
        // 简化版本暂时移除日期筛选
        dateTo: "",
        sort: sortSelect?.value || "relevance"
      };
    }
    /**
     * 执行高级搜索
     */
    async performAdvancedSearch() {
      const keywordInput = this.form.querySelector('input[name="keyword"]');
      const keyword = keywordInput.value.trim();
      const filters = this.getCurrentFilters();
      console.log("\u{1F50D} \u6267\u884C\u9AD8\u7EA7\u641C\u7D22:", { keyword, filters });
      this.updateURLParams(keyword, filters);
      const rawData = await this.originalSearch.getData();
      let filteredData = this.applyFilters(rawData, filters);
      if (keyword) {
        filteredData = await this.searchWithKeywords(filteredData, keyword);
      }
      filteredData = this.applySorting(filteredData, filters.sort);
      this.displayResults(filteredData, keyword);
      this.saveSearchHistory(keyword, filters, filteredData.length);
    }
    /**
     * 应用筛选条件
     */
    applyFilters(data, filters) {
      return data.filter((item) => {
        if (filters.category && !item.categories.includes(filters.category)) {
          return false;
        }
        if (filters.tags.length > 0) {
          const hasMatchingTag = filters.tags.some((tag) => item.tags.includes(tag));
          if (!hasMatchingTag) return false;
        }
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
    async searchWithKeywords(data, keyword) {
      const keywords = keyword.split(" ").filter((k) => k.trim() !== "");
      const regex = new RegExp(keywords.map((k) => k.replace(/[.*+\-?^${}()|[\]\\]/g, "\\$&")).join("|"), "gi");
      return data.filter((item) => {
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
    applySorting(data, sortType) {
      switch (sortType) {
        case "date-desc":
          return data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        case "date-asc":
          return data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        case "title":
          return data.sort((a, b) => a.title.localeCompare(b.title));
        case "relevance":
        default:
          return data.sort((a, b) => (b.matchCount || 0) - (a.matchCount || 0));
      }
    }
    /**
     * 显示搜索结果
     */
    displayResults(results, keyword) {
      const resultList = document.querySelector(".search-result--list");
      const resultTitle = document.querySelector(".search-result--title");
      if (!resultList || !resultTitle) return;
      resultList.innerHTML = "";
      const resultText = keyword ? `\u627E\u5230 ${results.length} \u4E2A\u7ED3\u679C` : `\u5171 ${results.length} \u7BC7\u6587\u7AE0`;
      resultTitle.textContent = resultText;
      results.forEach((item) => {
        const articleElement = this.renderAdvancedResult(item);
        resultList.appendChild(articleElement);
      });
    }
    /**
     * 渲染增强的搜索结果
     */
    renderAdvancedResult(item) {
      const article = document.createElement("article");
      article.className = "search-result-item";
      const date = new Date(item.date).toLocaleDateString("zh-CN");
      const readingTime = `${item.readingTime} \u5206\u949F\u9605\u8BFB`;
      article.innerHTML = `
            <a href="${item.permalink}" class="result-link">
                <div class="result-content">
                    <h3 class="result-title">${item.title}</h3>
                    <p class="result-summary">${item.summary}</p>
                    <div class="result-meta">
                        <span class="result-date">${date}</span>
                        <span class="result-reading-time">${readingTime}</span>
                        ${item.categories.length > 0 ? `<span class="result-category">${item.categories[0]}</span>` : ""}
                    </div>
                    ${item.tags.length > 0 ? `
                        <div class="result-tags">
                            ${item.tags.slice(0, 3).map((tag) => `<span class="result-tag">${tag}</span>`).join("")}
                        </div>
                    ` : ""}
                </div>
                ${item.image ? `
                    <div class="result-image">
                        <img src="${item.image}" alt="${item.title}" loading="lazy" />
                    </div>
                ` : ""}
            </a>
        `;
      return article;
    }
    /**
     * 清除筛选条件
     */
    clearFilters() {
      const categorySelect = this.form.querySelector('select[name="category"]');
      const tagsSelect = this.form.querySelector('select[name="tags"]');
      const sortSelect = this.form.querySelector('select[name="sort"]');
      if (categorySelect) categorySelect.value = "";
      if (tagsSelect) tagsSelect.selectedIndex = -1;
      if (sortSelect) sortSelect.value = "relevance";
      this.performAdvancedSearch();
    }
    /**
     * 更新URL参数
     */
    updateURLParams(keyword, filters) {
      const url = new URL(window.location.href);
      if (keyword) {
        url.searchParams.set("keyword", keyword);
      } else {
        url.searchParams.delete("keyword");
      }
      if (filters.category) url.searchParams.set("category", filters.category);
      else url.searchParams.delete("category");
      if (filters.tags.length > 0) url.searchParams.set("tags", filters.tags.join(","));
      else url.searchParams.delete("tags");
      if (filters.dateFrom) url.searchParams.set("from", filters.dateFrom);
      else url.searchParams.delete("from");
      if (filters.dateTo) url.searchParams.set("to", filters.dateTo);
      else url.searchParams.delete("to");
      if (filters.sort !== "relevance") url.searchParams.set("sort", filters.sort);
      else url.searchParams.delete("sort");
      window.history.replaceState({}, "", url.toString());
    }
    /**
     * 从URL恢复筛选条件
     */
    restoreFiltersFromURL() {
      const url = new URL(window.location.href);
      const category = url.searchParams.get("category");
      if (category) {
        const categorySelect = this.form.querySelector('select[name="category"]');
        if (categorySelect) categorySelect.value = category;
      }
      const tags = url.searchParams.get("tags");
      if (tags) {
        const tagList = tags.split(",");
        tagList.forEach((tag) => {
          const checkbox = this.form.querySelector(`input[name="tags"][value="${tag}"]`);
          if (checkbox) checkbox.checked = true;
        });
        this.updateTagFilterInput();
      }
      const dateFrom = url.searchParams.get("from");
      const dateTo = url.searchParams.get("to");
      if (dateFrom) {
        const fromInput = this.form.querySelector('input[name="date-from"]');
        if (fromInput) fromInput.value = dateFrom;
      }
      if (dateTo) {
        const toInput = this.form.querySelector('input[name="date-to"]');
        if (toInput) toInput.value = dateTo;
      }
      const sort = url.searchParams.get("sort");
      if (sort) {
        const sortSelect = this.form.querySelector('select[name="sort"]');
        if (sortSelect) sortSelect.value = sort;
      }
    }
    /**
     * 保存搜索历史
     */
    saveSearchHistory(keyword, filters, resultCount) {
      if (!keyword && !filters.category && filters.tags.length === 0) return;
      const historyItem = {
        keyword,
        filters,
        timestamp: Date.now(),
        resultCount
      };
      this.searchHistory.unshift(historyItem);
      this.searchHistory = this.searchHistory.slice(0, 10);
      localStorage.setItem("searchHistory", JSON.stringify(this.searchHistory));
    }
    /**
     * 加载搜索历史
     */
    loadSearchHistory() {
      const saved = localStorage.getItem("searchHistory");
      if (saved) {
        try {
          this.searchHistory = JSON.parse(saved);
        } catch (e) {
          console.warn("\u641C\u7D22\u5386\u53F2\u52A0\u8F7D\u5931\u8D25:", e);
          this.searchHistory = [];
        }
      }
    }
    /**
     * 获取搜索历史
     */
    getSearchHistory() {
      return this.searchHistory;
    }
  };
  var stdin_default = AdvancedSearch;
  window.AdvancedSearch = AdvancedSearch;
})();
