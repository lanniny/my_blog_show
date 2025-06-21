(() => {
  // <stdin>
  var ArchivesEnhancer = class {
    container;
    originalItems = [];
    filteredItems = [];
    stats;
    currentFilters = {};
    constructor(containerId = "archives-container") {
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
    async init() {
      await this.parseExistingArchives();
      this.calculateStats();
      this.createEnhancedInterface();
      this.bindEvents();
      this.renderArchives();
    }
    /**
     * Parse existing archive items from the page
     */
    async parseExistingArchives() {
      const archiveGroups = document.querySelectorAll(".archives-group");
      archiveGroups.forEach((group) => {
        const yearElement = group.querySelector(".archives-date");
        const year = yearElement?.textContent?.trim() || "";
        const articles = group.querySelectorAll(".article-list--compact .article");
        articles.forEach((article) => {
          const titleElement = article.querySelector(".article-title a");
          const dateElement = article.querySelector(".article-time time");
          const categoryElements = article.querySelectorAll(".article-category a");
          const tagElements = article.querySelectorAll(".article-tags a");
          const summaryElement = article.querySelector(".article-excerpt");
          if (titleElement && dateElement) {
            const item = {
              title: titleElement.textContent?.trim() || "",
              url: titleElement.href || "",
              date: new Date(dateElement.getAttribute("datetime") || ""),
              categories: Array.from(categoryElements).map((el) => el.textContent?.trim() || ""),
              tags: Array.from(tagElements).map((el) => el.textContent?.trim() || ""),
              summary: summaryElement?.textContent?.trim(),
              readingTime: this.extractReadingTime(article)
            };
            this.originalItems.push(item);
          }
        });
      });
      this.filteredItems = [...this.originalItems];
      console.log(`\u{1F4DA} Parsed ${this.originalItems.length} archive items`);
    }
    /**
     * Extract reading time from article element
     */
    extractReadingTime(article) {
      const readingTimeElement = article.querySelector(".article-time .reading-time");
      if (readingTimeElement) {
        const text = readingTimeElement.textContent || "";
        const match = text.match(/(\d+)/);
        return match ? parseInt(match[1]) : void 0;
      }
      return void 0;
    }
    /**
     * Calculate archive statistics
     */
    calculateStats() {
      const yearlyStats = {};
      const categoryStats = {};
      const tagStats = {};
      const categories = /* @__PURE__ */ new Set();
      const tags = /* @__PURE__ */ new Set();
      this.originalItems.forEach((item) => {
        const year = item.date.getFullYear().toString();
        yearlyStats[year] = (yearlyStats[year] || 0) + 1;
        item.categories.forEach((category) => {
          categories.add(category);
          categoryStats[category] = (categoryStats[category] || 0) + 1;
        });
        item.tags.forEach((tag) => {
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
      console.log("\u{1F4CA} Archive statistics calculated:", this.stats);
    }
    /**
     * Create enhanced interface
     */
    createEnhancedInterface() {
      const enhancedHTML = `
            <div class="archives-enhanced">
                <!-- Statistics Panel -->
                <div class="archives-stats">
                    <div class="stats-grid">
                        <div class="stat-item">
                            <div class="stat-number">${this.stats.totalPosts}</div>
                            <div class="stat-label">\u603B\u6587\u7AE0\u6570</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-number">${this.stats.totalCategories}</div>
                            <div class="stat-label">\u5206\u7C7B\u6570</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-number">${this.stats.totalTags}</div>
                            <div class="stat-label">\u6807\u7B7E\u6570</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-number">${Object.keys(this.stats.yearlyStats).length}</div>
                            <div class="stat-label">\u5E74\u4EFD\u8DE8\u5EA6</div>
                        </div>
                    </div>
                </div>

                <!-- Filter Panel -->
                <div class="archives-filters">
                    <div class="filter-section">
                        <h3>\u{1F4CB} \u7B5B\u9009\u9009\u9879</h3>
                        <div class="filter-grid">
                            <div class="filter-group">
                                <label for="year-filter">\u5E74\u4EFD</label>
                                <select id="year-filter" class="filter-select">
                                    <option value="">\u6240\u6709\u5E74\u4EFD</option>
                                    ${Object.keys(this.stats.yearlyStats).sort((a, b) => parseInt(b) - parseInt(a)).map((year) => `<option value="${year}">${year} (${this.stats.yearlyStats[year]})</option>`).join("")}
                                </select>
                            </div>
                            
                            <div class="filter-group">
                                <label for="category-filter">\u5206\u7C7B</label>
                                <select id="category-filter" class="filter-select">
                                    <option value="">\u6240\u6709\u5206\u7C7B</option>
                                    ${Object.entries(this.stats.categoryStats).sort(([, a], [, b]) => b - a).map(([category, count]) => `<option value="${category}">${category} (${count})</option>`).join("")}
                                </select>
                            </div>
                            
                            <div class="filter-group">
                                <label for="tag-filter">\u6807\u7B7E</label>
                                <select id="tag-filter" class="filter-select">
                                    <option value="">\u6240\u6709\u6807\u7B7E</option>
                                    ${Object.entries(this.stats.tagStats).sort(([, a], [, b]) => b - a).slice(0, 20).map(([tag, count]) => `<option value="${tag}">${tag} (${count})</option>`).join("")}
                                </select>
                            </div>
                            
                            <div class="filter-group">
                                <label for="search-filter">\u641C\u7D22</label>
                                <input type="text" id="search-filter" class="filter-input" placeholder="\u641C\u7D22\u6587\u7AE0\u6807\u9898...">
                            </div>
                        </div>
                        
                        <div class="filter-actions">
                            <button id="apply-filters" class="btn btn-primary">\u5E94\u7528\u7B5B\u9009</button>
                            <button id="clear-filters" class="btn btn-secondary">\u6E05\u9664\u7B5B\u9009</button>
                            <button id="export-archives" class="btn btn-secondary">\u5BFC\u51FA\u5F52\u6863</button>
                            <button id="random-article" class="btn btn-secondary">\u968F\u673A\u6587\u7AE0</button>
                            <button id="toggle-advanced" class="btn btn-secondary">\u9AD8\u7EA7\u9009\u9879</button>
                        </div>

                        <!-- Advanced Options Panel -->
                        <div id="advanced-options" class="advanced-options" style="display: none;">
                            <h4>\u{1F527} \u9AD8\u7EA7\u9009\u9879</h4>
                            <div class="advanced-grid">
                                <div class="option-group">
                                    <label for="date-range-start">\u5F00\u59CB\u65E5\u671F</label>
                                    <input type="date" id="date-range-start" class="filter-input">
                                </div>
                                <div class="option-group">
                                    <label for="date-range-end">\u7ED3\u675F\u65E5\u671F</label>
                                    <input type="date" id="date-range-end" class="filter-input">
                                </div>
                                <div class="option-group">
                                    <label for="reading-time-min">\u6700\u5C11\u9605\u8BFB\u65F6\u95F4(\u5206\u949F)</label>
                                    <input type="number" id="reading-time-min" class="filter-input" min="0" placeholder="0">
                                </div>
                                <div class="option-group">
                                    <label for="reading-time-max">\u6700\u591A\u9605\u8BFB\u65F6\u95F4(\u5206\u949F)</label>
                                    <input type="number" id="reading-time-max" class="filter-input" min="0" placeholder="\u65E0\u9650\u5236">
                                </div>
                                <div class="option-group">
                                    <label for="sort-order">\u6392\u5E8F\u65B9\u5F0F</label>
                                    <select id="sort-order" class="filter-select">
                                        <option value="date-desc">\u6700\u65B0\u4F18\u5148</option>
                                        <option value="date-asc">\u6700\u65E7\u4F18\u5148</option>
                                        <option value="title-asc">\u6807\u9898A-Z</option>
                                        <option value="title-desc">\u6807\u9898Z-A</option>
                                        <option value="reading-time-asc">\u9605\u8BFB\u65F6\u95F4\u77ED\u2192\u957F</option>
                                        <option value="reading-time-desc">\u9605\u8BFB\u65F6\u95F4\u957F\u2192\u77ED</option>
                                    </select>
                                </div>
                                <div class="option-group">
                                    <label for="items-per-page">\u6BCF\u9875\u663E\u793A</label>
                                    <select id="items-per-page" class="filter-select">
                                        <option value="10">10\u7BC7</option>
                                        <option value="20" selected>20\u7BC7</option>
                                        <option value="50">50\u7BC7</option>
                                        <option value="100">100\u7BC7</option>
                                        <option value="all">\u5168\u90E8</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Results Info -->
                <div class="archives-results-info">
                    <div class="results-count">
                        \u663E\u793A <span id="filtered-count">${this.filteredItems.length}</span> / ${this.originalItems.length} \u7BC7\u6587\u7AE0
                    </div>
                    <div class="view-options">
                        <button id="view-timeline" class="view-btn active" title="\u65F6\u95F4\u7EBF\u89C6\u56FE">\u{1F4C5}</button>
                        <button id="view-grid" class="view-btn" title="\u7F51\u683C\u89C6\u56FE">\u{1F532}</button>
                        <button id="view-list" class="view-btn" title="\u5217\u8868\u89C6\u56FE">\u{1F4CB}</button>
                    </div>
                </div>

                <!-- Archives Content -->
                <div id="archives-content" class="archives-content">
                    <!-- Content will be rendered here -->
                </div>
            </div>
        `;
      this.container.insertAdjacentHTML("afterbegin", enhancedHTML);
    }
    /**
     * Bind event listeners
     */
    bindEvents() {
      const yearFilter = document.getElementById("year-filter");
      const categoryFilter = document.getElementById("category-filter");
      const tagFilter = document.getElementById("tag-filter");
      const searchFilter = document.getElementById("search-filter");
      const applyFilters = document.getElementById("apply-filters");
      applyFilters?.addEventListener("click", () => {
        this.currentFilters = {
          year: yearFilter?.value || void 0,
          category: categoryFilter?.value || void 0,
          tag: tagFilter?.value || void 0,
          searchTerm: searchFilter?.value.trim() || void 0
        };
        this.applyFilters();
      });
      const clearFilters = document.getElementById("clear-filters");
      clearFilters?.addEventListener("click", () => {
        this.clearFilters();
      });
      const exportArchives = document.getElementById("export-archives");
      exportArchives?.addEventListener("click", () => {
        this.exportArchives();
      });
      searchFilter?.addEventListener("input", this.debounce(() => {
        this.currentFilters.searchTerm = searchFilter.value.trim() || void 0;
        this.applyFilters();
      }, 300));
      const viewButtons = document.querySelectorAll(".view-btn");
      viewButtons.forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const target = e.target;
          const viewMode = target.id.replace("view-", "");
          this.switchViewMode(viewMode);
          viewButtons.forEach((b) => b.classList.remove("active"));
          target.classList.add("active");
        });
      });
      const randomArticle = document.getElementById("random-article");
      randomArticle?.addEventListener("click", () => {
        this.goToRandomArticle();
      });
      const toggleAdvanced = document.getElementById("toggle-advanced");
      const advancedOptions = document.getElementById("advanced-options");
      toggleAdvanced?.addEventListener("click", () => {
        if (advancedOptions) {
          const isVisible = advancedOptions.style.display !== "none";
          advancedOptions.style.display = isVisible ? "none" : "block";
          toggleAdvanced.textContent = isVisible ? "\u9AD8\u7EA7\u9009\u9879" : "\u9690\u85CF\u9009\u9879";
        }
      });
      const dateRangeStart = document.getElementById("date-range-start");
      const dateRangeEnd = document.getElementById("date-range-end");
      const readingTimeMin = document.getElementById("reading-time-min");
      const readingTimeMax = document.getElementById("reading-time-max");
      const sortOrder = document.getElementById("sort-order");
      const itemsPerPage = document.getElementById("items-per-page");
      [dateRangeStart, dateRangeEnd, readingTimeMin, readingTimeMax, sortOrder, itemsPerPage].forEach((element) => {
        element?.addEventListener("change", () => {
          this.applyAdvancedFilters();
        });
      });
    }
    /**
     * Apply current filters
     */
    applyFilters() {
      this.filteredItems = this.originalItems.filter((item) => {
        if (this.currentFilters.year) {
          const itemYear = item.date.getFullYear().toString();
          if (itemYear !== this.currentFilters.year) return false;
        }
        if (this.currentFilters.category) {
          if (!item.categories.includes(this.currentFilters.category)) return false;
        }
        if (this.currentFilters.tag) {
          if (!item.tags.includes(this.currentFilters.tag)) return false;
        }
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
      console.log(`\u{1F50D} Applied filters, showing ${this.filteredItems.length} items`);
    }
    /**
     * Clear all filters
     */
    clearFilters() {
      this.currentFilters = {};
      this.filteredItems = [...this.originalItems];
      const yearFilter = document.getElementById("year-filter");
      const categoryFilter = document.getElementById("category-filter");
      const tagFilter = document.getElementById("tag-filter");
      const searchFilter = document.getElementById("search-filter");
      if (yearFilter) yearFilter.value = "";
      if (categoryFilter) categoryFilter.value = "";
      if (tagFilter) tagFilter.value = "";
      if (searchFilter) searchFilter.value = "";
      this.updateResultsCount();
      this.renderArchives();
      console.log("\u{1F9F9} Filters cleared");
    }
    /**
     * Update results count display
     */
    updateResultsCount() {
      const countElement = document.getElementById("filtered-count");
      if (countElement) {
        countElement.textContent = this.filteredItems.length.toString();
      }
    }
    /**
     * Switch view mode
     */
    switchViewMode(mode) {
      const contentContainer = document.getElementById("archives-content");
      if (contentContainer) {
        contentContainer.className = `archives-content view-${mode}`;
        this.renderArchives();
      }
    }
    /**
     * Render archives based on current filters and view mode
     */
    renderArchives() {
      const contentContainer = document.getElementById("archives-content");
      if (!contentContainer) return;
      const viewMode = this.getViewMode(contentContainer);
      if (this.filteredItems.length === 0) {
        contentContainer.innerHTML = `
                <div class="no-results">
                    <div class="no-results-icon">\u{1F4ED}</div>
                    <h3>\u6CA1\u6709\u627E\u5230\u5339\u914D\u7684\u6587\u7AE0</h3>
                    <p>\u5C1D\u8BD5\u8C03\u6574\u7B5B\u9009\u6761\u4EF6\u6216\u6E05\u9664\u6240\u6709\u7B5B\u9009</p>
                </div>
            `;
        return;
      }
      switch (viewMode) {
        case "timeline":
          this.renderTimelineView(contentContainer);
          break;
        case "grid":
          this.renderGridView(contentContainer);
          break;
        case "list":
          this.renderListView(contentContainer);
          break;
        default:
          this.renderTimelineView(contentContainer);
      }
    }
    /**
     * Get current view mode from container class
     */
    getViewMode(container) {
      const classes = container.className.split(" ");
      const viewClass = classes.find((cls) => cls.startsWith("view-"));
      return viewClass ? viewClass.replace("view-", "") : "timeline";
    }
    /**
     * Render timeline view (default)
     */
    renderTimelineView(container) {
      const groupedByYear = this.groupItemsByYear(this.filteredItems);
      let html = "";
      Object.entries(groupedByYear).sort(([a], [b]) => parseInt(b) - parseInt(a)).forEach(([year, items]) => {
        html += `
                    <div class="archives-year-group">
                        <h2 class="archives-year-title">
                            <span class="year">${year}</span>
                            <span class="count">(${items.length}\u7BC7)</span>
                        </h2>
                        <div class="archives-timeline">
                            ${items.map((item) => this.renderTimelineItem(item)).join("")}
                        </div>
                    </div>
                `;
      });
      container.innerHTML = html;
    }
    /**
     * Render grid view
     */
    renderGridView(container) {
      const html = `
            <div class="archives-grid">
                ${this.filteredItems.map((item) => this.renderGridItem(item)).join("")}
            </div>
        `;
      container.innerHTML = html;
    }
    /**
     * Render list view
     */
    renderListView(container) {
      const html = `
            <div class="archives-list">
                ${this.filteredItems.map((item) => this.renderListItem(item)).join("")}
            </div>
        `;
      container.innerHTML = html;
    }
    /**
     * Group items by year
     */
    groupItemsByYear(items) {
      return items.reduce((groups, item) => {
        const year = item.date.getFullYear().toString();
        if (!groups[year]) groups[year] = [];
        groups[year].push(item);
        return groups;
      }, {});
    }
    /**
     * Render timeline item
     */
    renderTimelineItem(item) {
      return `
            <div class="timeline-item">
                <div class="timeline-date">
                    ${this.formatDate(item.date, "MM-DD")}
                </div>
                <div class="timeline-content">
                    <h3 class="timeline-title">
                        <a href="${item.url}">${item.title}</a>
                    </h3>
                    ${item.summary ? `<p class="timeline-summary">${item.summary}</p>` : ""}
                    <div class="timeline-meta">
                        ${item.categories.length > 0 ? `
                            <span class="meta-categories">
                                ${item.categories.map((cat) => `<span class="category-tag">${cat}</span>`).join("")}
                            </span>
                        ` : ""}
                        ${item.readingTime ? `<span class="reading-time">${item.readingTime}\u5206\u949F\u9605\u8BFB</span>` : ""}
                    </div>
                </div>
            </div>
        `;
    }
    /**
     * Render grid item
     */
    renderGridItem(item) {
      return `
            <div class="grid-item">
                <div class="grid-content">
                    <div class="grid-date">${this.formatDate(item.date, "YYYY-MM-DD")}</div>
                    <h3 class="grid-title">
                        <a href="${item.url}">${item.title}</a>
                    </h3>
                    ${item.summary ? `<p class="grid-summary">${this.truncateText(item.summary, 100)}</p>` : ""}
                    <div class="grid-meta">
                        ${item.categories.slice(0, 2).map((cat) => `<span class="category-tag">${cat}</span>`).join("")}
                    </div>
                </div>
            </div>
        `;
    }
    /**
     * Render list item
     */
    renderListItem(item) {
      return `
            <div class="list-item">
                <div class="list-date">${this.formatDate(item.date, "YYYY-MM-DD")}</div>
                <div class="list-content">
                    <h3 class="list-title">
                        <a href="${item.url}">${item.title}</a>
                    </h3>
                    ${item.summary ? `<p class="list-summary">${this.truncateText(item.summary, 150)}</p>` : ""}
                </div>
                <div class="list-meta">
                    ${item.categories.slice(0, 3).map((cat) => `<span class="category-tag">${cat}</span>`).join("")}
                    ${item.readingTime ? `<span class="reading-time">${item.readingTime}min</span>` : ""}
                </div>
            </div>
        `;
    }
    /**
     * Go to random article
     */
    goToRandomArticle() {
      if (this.filteredItems.length === 0) {
        alert("\u6CA1\u6709\u53EF\u7528\u7684\u6587\u7AE0");
        return;
      }
      const randomIndex = Math.floor(Math.random() * this.filteredItems.length);
      const randomArticle = this.filteredItems[randomIndex];
      const confirmed = confirm(`\u5373\u5C06\u8DF3\u8F6C\u5230\u968F\u673A\u6587\u7AE0\uFF1A

"${randomArticle.title}"

\u786E\u5B9A\u8981\u8DF3\u8F6C\u5417\uFF1F`);
      if (confirmed) {
        window.open(randomArticle.url, "_blank");
      }
    }
    /**
     * Apply advanced filters
     */
    applyAdvancedFilters() {
      const dateRangeStart = document.getElementById("date-range-start")?.value;
      const dateRangeEnd = document.getElementById("date-range-end")?.value;
      const readingTimeMin = parseInt(document.getElementById("reading-time-min")?.value) || 0;
      const readingTimeMax = parseInt(document.getElementById("reading-time-max")?.value) || Infinity;
      const sortOrder = document.getElementById("sort-order")?.value || "date-desc";
      let filtered = this.filteredItems.filter((item) => {
        if (dateRangeStart && item.date < new Date(dateRangeStart)) return false;
        if (dateRangeEnd && item.date > /* @__PURE__ */ new Date(dateRangeEnd + "T23:59:59")) return false;
        if (item.readingTime && (item.readingTime < readingTimeMin || item.readingTime > readingTimeMax)) return false;
        return true;
      });
      filtered = this.sortItems(filtered, sortOrder);
      this.filteredItems = filtered;
      this.updateResultsCount();
      this.renderArchives();
      console.log(`\u{1F527} Applied advanced filters, showing ${filtered.length} items`);
    }
    /**
     * Sort items based on criteria
     */
    sortItems(items, sortOrder) {
      return [...items].sort((a, b) => {
        switch (sortOrder) {
          case "date-asc":
            return a.date.getTime() - b.date.getTime();
          case "date-desc":
            return b.date.getTime() - a.date.getTime();
          case "title-asc":
            return a.title.localeCompare(b.title);
          case "title-desc":
            return b.title.localeCompare(a.title);
          case "reading-time-asc":
            return (a.readingTime || 0) - (b.readingTime || 0);
          case "reading-time-desc":
            return (b.readingTime || 0) - (a.readingTime || 0);
          default:
            return b.date.getTime() - a.date.getTime();
        }
      });
    }
    /**
     * Export archives to various formats
     */
    exportArchives() {
      const exportData = {
        exportDate: (/* @__PURE__ */ new Date()).toISOString(),
        totalItems: this.filteredItems.length,
        filters: this.currentFilters,
        statistics: this.stats,
        items: this.filteredItems.map((item) => ({
          title: item.title,
          url: item.url,
          date: item.date.toISOString(),
          categories: item.categories,
          tags: item.tags,
          summary: item.summary,
          readingTime: item.readingTime
        }))
      };
      this.showExportOptions(exportData);
    }
    /**
     * Show export options dialog
     */
    showExportOptions(data) {
      const exportFormats = [
        { name: "JSON", extension: "json", mimeType: "application/json" },
        { name: "CSV", extension: "csv", mimeType: "text/csv" },
        { name: "Markdown", extension: "md", mimeType: "text/markdown" }
      ];
      const formatChoice = prompt(`\u9009\u62E9\u5BFC\u51FA\u683C\u5F0F\uFF1A
1. JSON (\u5B8C\u6574\u6570\u636E)
2. CSV (\u8868\u683C\u683C\u5F0F)
3. Markdown (\u6587\u6863\u683C\u5F0F)

\u8BF7\u8F93\u5165\u6570\u5B57 (1-3):`);
      if (!formatChoice || !["1", "2", "3"].includes(formatChoice)) {
        return;
      }
      const formatIndex = parseInt(formatChoice) - 1;
      const format = exportFormats[formatIndex];
      let content;
      let filename;
      switch (format.extension) {
        case "json":
          content = JSON.stringify(data, null, 2);
          filename = `archives-export-${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.json`;
          break;
        case "csv":
          content = this.convertToCSV(data.items);
          filename = `archives-export-${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.csv`;
          break;
        case "md":
          content = this.convertToMarkdown(data);
          filename = `archives-export-${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.md`;
          break;
        default:
          return;
      }
      const blob = new Blob([content], { type: format.mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      console.log(`\u{1F4E5} Archives exported as ${format.name} successfully`);
    }
    /**
     * Convert data to CSV format
     */
    convertToCSV(items) {
      const headers = ["\u6807\u9898", "\u94FE\u63A5", "\u65E5\u671F", "\u5206\u7C7B", "\u6807\u7B7E", "\u6458\u8981", "\u9605\u8BFB\u65F6\u95F4"];
      const csvContent = [
        headers.join(","),
        ...items.map((item) => [
          `"${item.title.replace(/"/g, '""')}"`,
          `"${item.url}"`,
          `"${item.date.split("T")[0]}"`,
          `"${item.categories.join("; ")}"`,
          `"${item.tags.join("; ")}"`,
          `"${(item.summary || "").replace(/"/g, '""')}"`,
          `"${item.readingTime || ""}"`
        ].join(","))
      ].join("\n");
      return "\uFEFF" + csvContent;
    }
    /**
     * Convert data to Markdown format
     */
    convertToMarkdown(data) {
      const { exportDate, totalItems, statistics, items } = data;
      let markdown = `# \u535A\u5BA2\u6587\u7AE0\u5F52\u6863

`;
      markdown += `**\u5BFC\u51FA\u65E5\u671F**: ${new Date(exportDate).toLocaleDateString()}
`;
      markdown += `**\u6587\u7AE0\u603B\u6570**: ${totalItems}
`;
      markdown += `**\u5206\u7C7B\u6570**: ${statistics.totalCategories}
`;
      markdown += `**\u6807\u7B7E\u6570**: ${statistics.totalTags}

`;
      markdown += `## \u7EDF\u8BA1\u4FE1\u606F

`;
      markdown += `### \u6309\u5E74\u4EFD\u5206\u5E03

`;
      Object.entries(statistics.yearlyStats).sort(([a], [b]) => parseInt(b) - parseInt(a)).forEach(([year, count]) => {
        markdown += `- **${year}\u5E74**: ${count}\u7BC7
`;
      });
      markdown += `
### \u6309\u5206\u7C7B\u5206\u5E03

`;
      Object.entries(statistics.categoryStats).sort(([, a], [, b]) => b - a).slice(0, 10).forEach(([category, count]) => {
        markdown += `- **${category}**: ${count}\u7BC7
`;
      });
      markdown += `
## \u6587\u7AE0\u5217\u8868

`;
      items.forEach((item, index) => {
        markdown += `### ${index + 1}. [${item.title}](${item.url})

`;
        markdown += `**\u65E5\u671F**: ${item.date.split("T")[0]}
`;
        if (item.categories.length > 0) {
          markdown += `**\u5206\u7C7B**: ${item.categories.join(", ")}
`;
        }
        if (item.tags.length > 0) {
          markdown += `**\u6807\u7B7E**: ${item.tags.join(", ")}
`;
        }
        if (item.readingTime) {
          markdown += `**\u9605\u8BFB\u65F6\u95F4**: ${item.readingTime}\u5206\u949F
`;
        }
        if (item.summary) {
          markdown += `
${item.summary}
`;
        }
        markdown += `
---

`;
      });
      return markdown;
    }
    /**
     * Utility functions
     */
    formatDate(date, format) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return format.replace("YYYY", year.toString()).replace("MM", month).replace("DD", day);
    }
    truncateText(text, maxLength) {
      return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
    }
    debounce(func, wait) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    }
  };
  document.addEventListener("DOMContentLoaded", () => {
    if (document.body.classList.contains("template-archives")) {
      new ArchivesEnhancer();
      console.log("\u{1F4DA} Archives enhancement initialized");
    }
  });
  window.ArchivesEnhancer = ArchivesEnhancer;
})();
/*!
*   Hugo Theme Stack - Archives Enhancement
*
*   @author: Alex (Engineer)
*   @project: Hugo Blog Archives Enhancement
*   @description: Enhanced archives functionality with filtering, search, and statistics
*/
