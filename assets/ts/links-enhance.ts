/*!
*   Hugo Theme Stack - Links Enhancement
*
*   @author: Alex (Engineer)
*   @project: Hugo Blog Links Enhancement
*   @description: Enhanced links functionality with filtering, search, and status checking
*/

/**
 * Link item interface
 */
export interface LinkItem {
    title: string;
    description: string;
    website: string;
    image?: string;
    category?: string;
    tags?: string[];
    status?: 'active' | 'inactive';
    featured?: boolean;
    element: HTMLElement;
}

/**
 * Links enhancement class
 */
export class LinksEnhancer {
    private container: HTMLElement;
    private searchInput: HTMLInputElement;
    private categoryFilter: HTMLSelectElement;
    private statusFilter: HTMLSelectElement;
    private featuredToggle: HTMLButtonElement;
    private viewToggle: NodeListOf<HTMLButtonElement>;
    private linksContainer: HTMLElement;
    private noResults: HTMLElement;
    private links: LinkItem[] = [];
    private filteredLinks: LinkItem[] = [];
    private currentView: 'grid' | 'list' = 'grid';
    private filters = {
        search: '',
        category: '',
        status: '',
        featured: false
    };

    constructor() {
        this.init();
    }

    /**
     * Initialize the links enhancer
     */
    private init(): void {
        console.log('🔗 初始化链接增强功能...');
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupElements();
            });
        } else {
            this.setupElements();
        }
    }

    /**
     * Setup DOM elements and event listeners
     */
    private setupElements(): void {
        this.container = document.querySelector('.links-enhanced-container');
        if (!this.container) {
            console.log('❌ Links enhanced container not found');
            return;
        }

        // Get control elements
        this.searchInput = this.container.querySelector('#links-search-input');
        this.categoryFilter = this.container.querySelector('#category-filter');
        this.statusFilter = this.container.querySelector('#status-filter');
        this.featuredToggle = this.container.querySelector('#featured-toggle');
        this.viewToggle = this.container.querySelectorAll('.view-btn');
        this.linksContainer = this.container.querySelector('#links-container');
        this.noResults = this.container.querySelector('#no-results');

        if (!this.searchInput || !this.linksContainer) {
            console.log('❌ Required elements not found');
            return;
        }

        this.parseLinks();
        this.setupEventListeners();
        this.updateStats();
        
        console.log(`✅ 链接增强功能已启用，共 ${this.links.length} 个链接`);
    }

    /**
     * Parse existing links from DOM
     */
    private parseLinks(): void {
        const linkCards = this.linksContainer.querySelectorAll('.link-card');
        
        linkCards.forEach(card => {
            const titleElement = card.querySelector('.link-title');
            const descElement = card.querySelector('.link-description');
            const linkElement = card.querySelector('a');
            
            if (titleElement && descElement && linkElement) {
                const link: LinkItem = {
                    title: titleElement.textContent?.trim() || '',
                    description: descElement.textContent?.trim() || '',
                    website: linkElement.href || '',
                    category: card.getAttribute('data-category') || '',
                    tags: card.getAttribute('data-tags')?.split(',').filter(t => t.trim()) || [],
                    status: (card.getAttribute('data-status') as 'active' | 'inactive') || 'active',
                    featured: card.getAttribute('data-featured') === 'true',
                    element: card as HTMLElement
                };
                
                this.links.push(link);
            }
        });

        this.filteredLinks = [...this.links];
    }

    /**
     * Setup event listeners
     */
    private setupEventListeners(): void {
        // Search input
        this.searchInput.addEventListener('input', (e) => {
            this.filters.search = (e.target as HTMLInputElement).value.toLowerCase();
            this.applyFilters();
        });

        // Category filter
        this.categoryFilter?.addEventListener('change', (e) => {
            this.filters.category = (e.target as HTMLSelectElement).value;
            this.applyFilters();
        });

        // Status filter
        this.statusFilter?.addEventListener('change', (e) => {
            this.filters.status = (e.target as HTMLSelectElement).value;
            this.applyFilters();
        });

        // Featured toggle
        this.featuredToggle?.addEventListener('click', () => {
            this.filters.featured = !this.filters.featured;
            this.featuredToggle.classList.toggle('active', this.filters.featured);
            this.applyFilters();
        });

        // View toggle
        this.viewToggle.forEach(btn => {
            btn.addEventListener('click', () => {
                const view = btn.getAttribute('data-view') as 'grid' | 'list';
                this.switchView(view);
            });
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'f':
                        e.preventDefault();
                        this.searchInput.focus();
                        break;
                    case 'g':
                        e.preventDefault();
                        this.switchView('grid');
                        break;
                    case 'l':
                        e.preventDefault();
                        this.switchView('list');
                        break;
                }
            }
        });
    }

    /**
     * Apply current filters to links
     */
    private applyFilters(): void {
        this.filteredLinks = this.links.filter(link => {
            // Search filter
            if (this.filters.search) {
                const searchTerm = this.filters.search;
                const searchableText = `${link.title} ${link.description} ${link.tags?.join(' ')}`.toLowerCase();
                if (!searchableText.includes(searchTerm)) {
                    return false;
                }
            }

            // Category filter
            if (this.filters.category && link.category !== this.filters.category) {
                return false;
            }

            // Status filter
            if (this.filters.status && link.status !== this.filters.status) {
                return false;
            }

            // Featured filter
            if (this.filters.featured && !link.featured) {
                return false;
            }

            return true;
        });

        this.renderFilteredLinks();
        this.updateStats();
    }

    /**
     * Render filtered links
     */
    private renderFilteredLinks(): void {
        // Hide all links first
        this.links.forEach(link => {
            link.element.style.display = 'none';
        });

        // Show filtered links
        if (this.filteredLinks.length > 0) {
            this.filteredLinks.forEach(link => {
                link.element.style.display = 'block';
            });
            this.noResults.style.display = 'none';
        } else {
            this.noResults.style.display = 'block';
        }
    }

    /**
     * Switch between grid and list view
     */
    private switchView(view: 'grid' | 'list'): void {
        this.currentView = view;
        
        // Update view toggle buttons
        this.viewToggle.forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-view') === view);
        });

        // Update container class
        this.linksContainer.className = `links-container ${view}-view`;
        
        // Save preference
        localStorage.setItem('links-view-preference', view);
    }

    /**
     * Update statistics
     */
    private updateStats(): void {
        const totalElement = document.getElementById('total-links');
        const activeElement = document.getElementById('active-links');
        const featuredElement = document.getElementById('featured-links');
        const categoriesElement = document.getElementById('categories-count');

        if (totalElement) totalElement.textContent = this.filteredLinks.length.toString();
        if (activeElement) {
            const activeCount = this.filteredLinks.filter(l => l.status === 'active').length;
            activeElement.textContent = activeCount.toString();
        }
        if (featuredElement) {
            const featuredCount = this.filteredLinks.filter(l => l.featured).length;
            featuredElement.textContent = featuredCount.toString();
        }
        if (categoriesElement) {
            const categories = new Set(this.filteredLinks.map(l => l.category).filter(Boolean));
            categoriesElement.textContent = categories.size.toString();
        }
    }

    /**
     * Clear all filters
     */
    public clearFilters(): void {
        this.filters = {
            search: '',
            category: '',
            status: '',
            featured: false
        };

        this.searchInput.value = '';
        if (this.categoryFilter) this.categoryFilter.value = '';
        if (this.statusFilter) this.statusFilter.value = '';
        this.featuredToggle?.classList.remove('active');

        this.applyFilters();
    }

    /**
     * Get current filter state
     */
    public getFilters() {
        return { ...this.filters };
    }

    /**
     * Get filtered links
     */
    public getFilteredLinks(): LinkItem[] {
        return [...this.filteredLinks];
    }
}

/**
 * Global functions for link actions
 */
declare global {
    interface Window {
        checkLinkStatus: (url: string, button: HTMLElement) => void;
        copyLink: (url: string) => void;
        LinksEnhancer: typeof LinksEnhancer;
        linksEnhancer: LinksEnhancer;
    }
}

/**
 * Check link status
 */
window.checkLinkStatus = async (url: string, button: HTMLElement) => {
    const originalHTML = button.innerHTML;
    button.innerHTML = '<div class="loading-spinner"></div>';
    button.disabled = true;

    try {
        // Use a simple fetch to check if the link is accessible
        const response = await fetch(url, { 
            method: 'HEAD', 
            mode: 'no-cors',
            cache: 'no-cache'
        });
        
        // Since we're using no-cors, we can't check the actual status
        // But if the fetch doesn't throw, the URL is likely accessible
        button.innerHTML = '✅';
        button.title = '链接可访问';
        setTimeout(() => {
            button.innerHTML = originalHTML;
            button.disabled = false;
        }, 2000);
    } catch (error) {
        button.innerHTML = '❌';
        button.title = '链接可能不可访问';
        setTimeout(() => {
            button.innerHTML = originalHTML;
            button.disabled = false;
        }, 2000);
    }
};

/**
 * Copy link to clipboard
 */
window.copyLink = async (url: string) => {
    try {
        await navigator.clipboard.writeText(url);
        
        // Show toast notification
        const toast = document.createElement('div');
        toast.className = 'copy-toast';
        toast.textContent = '链接已复制到剪贴板';
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 2000);
    } catch (error) {
        console.error('复制失败:', error);
    }
};

// Auto-initialize
const linksEnhancer = new LinksEnhancer();

// Export to global
window.LinksEnhancer = LinksEnhancer;
window.linksEnhancer = linksEnhancer;

export default LinksEnhancer;
