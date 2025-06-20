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
     * Export archives to various formats
     */
    exportArchives() {
      const exportData = {
        exportDate: (/* @__PURE__ */ new Date()).toISOString(),
        totalItems: this.filteredItems.length,
        filters: this.currentFilters,
        items: this.filteredItems.map((item) => ({
          title: item.title,
          url: item.url,
          date: item.date.toISOString(),
          categories: item.categories,
          tags: item.tags,
          summary: item.summary
        }))
      };
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `archives-export-${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      console.log("\u{1F4E5} Archives exported successfully");
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
