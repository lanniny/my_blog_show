/*!
*   Hugo Theme Stack - Article Rating System
*
*   @author: Alex (Engineer)
*   @project: Hugo Blog Article Rating System
*   @description: Guest user article rating and statistics
*/

interface ArticleRatingData {
    articleId: string;
    ratings: { [userId: string]: number };
    averageRating: number;
    totalRatings: number;
    ratingDistribution: { [rating: number]: number };
}

class ArticleRatingSystem {
    private readonly RATINGS_KEY = 'articleRatings';
    private currentArticleId: string | null = null;

    constructor() {
        this.init();
        console.log('⭐ Article rating system initialized');
    }

    /**
     * Initialize the rating system
     */
    private init(): void {
        // Get current article ID from URL or meta tag
        this.currentArticleId = this.getCurrentArticleId();
        
        if (this.currentArticleId) {
            this.addRatingWidget();
            console.log('📄 Rating widget added for article:', this.currentArticleId);
        }
    }

    /**
     * Get current article ID
     */
    private getCurrentArticleId(): string | null {
        // Try to get from meta tag first
        const metaTag = document.querySelector('meta[name="article-id"]') as HTMLMetaElement;
        if (metaTag && metaTag.content) {
            return metaTag.content;
        }

        // Fallback to URL path
        const path = window.location.pathname;
        if (path.includes('/p/')) {
            return path.split('/p/')[1].split('/')[0];
        }

        return null;
    }

    /**
     * Add rating widget to article page
     */
    private addRatingWidget(): void {
        if (!this.currentArticleId) return;

        // Find article content area
        const articleContent = document.querySelector('.article-content, .post-content, article');
        if (!articleContent) {
            console.warn('⚠️ Article content area not found');
            return;
        }

        const ratingData = this.getRatingData(this.currentArticleId);
        const currentUser = this.getCurrentUser();
        const userRating = currentUser ? ratingData.ratings[currentUser.userId] || 0 : 0;

        const ratingHTML = `
            <div class="article-rating" id="article-rating">
                <div class="rating-header">
                    <h4>📊 文章评分</h4>
                    <div class="rating-stats">
                        <span class="average-rating">${ratingData.averageRating.toFixed(1)}</span>
                        <span class="rating-separator">·</span>
                        <span class="total-ratings">${ratingData.totalRatings} 人评分</span>
                    </div>
                </div>
                
                <div class="rating-content">
                    ${currentUser ? this.createUserRatingHTML(userRating) : this.createGuestPromptHTML()}
                </div>
                
                <div class="rating-distribution">
                    ${this.createRatingDistributionHTML(ratingData)}
                </div>
            </div>
        `;

        // Insert after article content
        articleContent.insertAdjacentHTML('afterend', ratingHTML);
        
        // Setup event listeners
        this.setupRatingEventListeners();
    }

    /**
     * Create user rating HTML
     */
    private createUserRatingHTML(userRating: number): string {
        return `
            <div class="user-rating-section">
                <p class="rating-prompt">您对这篇文章的评分：</p>
                <div class="rating-stars" data-rating="${userRating}">
                    ${[1, 2, 3, 4, 5].map(star => `
                        <svg class="star ${star <= userRating ? 'active' : ''}" 
                             data-rating="${star}" 
                             viewBox="0 0 24 24" 
                             fill="${star <= userRating ? 'currentColor' : 'none'}" 
                             stroke="currentColor" 
                             stroke-width="2">
                            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"></polygon>
                        </svg>
                    `).join('')}
                </div>
                ${userRating > 0 ? `
                    <div class="rating-message">
                        <span>您已评分：${userRating} 星</span>
                        <button class="rating-change-btn" onclick="window.articleRating.clearUserRating()">修改评分</button>
                    </div>
                ` : ''}
            </div>
        `;
    }

    /**
     * Create guest prompt HTML
     */
    private createGuestPromptHTML(): string {
        return `
            <div class="guest-rating-prompt">
                <p>想要为这篇文章评分？</p>
                <button class="guest-login-prompt-btn" onclick="window.guestAuth.showGuestLoginModal()">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    游客登录
                </button>
            </div>
        `;
    }

    /**
     * Create rating distribution HTML
     */
    private createRatingDistributionHTML(ratingData: ArticleRatingData): string {
        if (ratingData.totalRatings === 0) {
            return '<div class="rating-distribution-empty">暂无评分数据</div>';
        }

        return `
            <div class="rating-distribution-chart">
                <h5>评分分布</h5>
                ${[5, 4, 3, 2, 1].map(rating => {
                    const count = ratingData.ratingDistribution[rating] || 0;
                    const percentage = ratingData.totalRatings > 0 ? (count / ratingData.totalRatings * 100) : 0;
                    
                    return `
                        <div class="rating-bar">
                            <span class="rating-label">${rating}星</span>
                            <div class="rating-bar-container">
                                <div class="rating-bar-fill" style="width: ${percentage}%"></div>
                            </div>
                            <span class="rating-count">${count}</span>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    /**
     * Setup rating event listeners
     */
    private setupRatingEventListeners(): void {
        const stars = document.querySelectorAll('.rating-stars .star');
        
        stars.forEach(star => {
            star.addEventListener('click', (e) => {
                const rating = parseInt((e.currentTarget as HTMLElement).getAttribute('data-rating') || '0');
                this.submitRating(rating);
            });

            star.addEventListener('mouseenter', (e) => {
                const rating = parseInt((e.currentTarget as HTMLElement).getAttribute('data-rating') || '0');
                this.highlightStars(rating);
            });
        });

        const ratingStars = document.querySelector('.rating-stars');
        if (ratingStars) {
            ratingStars.addEventListener('mouseleave', () => {
                const currentRating = parseInt(ratingStars.getAttribute('data-rating') || '0');
                this.highlightStars(currentRating);
            });
        }
    }

    /**
     * Highlight stars up to rating
     */
    private highlightStars(rating: number): void {
        const stars = document.querySelectorAll('.rating-stars .star');
        stars.forEach((star, index) => {
            const starElement = star as HTMLElement;
            if (index < rating) {
                starElement.classList.add('active');
                starElement.setAttribute('fill', 'currentColor');
            } else {
                starElement.classList.remove('active');
                starElement.setAttribute('fill', 'none');
            }
        });
    }

    /**
     * Submit rating
     */
    public submitRating(rating: number): void {
        if (!this.currentArticleId) {
            console.error('❌ No article ID available');
            return;
        }

        const currentUser = this.getCurrentUser();
        if (!currentUser) {
            this.showMessage('请先登录后再评分', 'error');
            return;
        }

        if (rating < 1 || rating > 5) {
            this.showMessage('评分必须在1-5之间', 'error');
            return;
        }

        try {
            // Use guest auth system to rate article
            const success = (window as any).guestAuth.rateArticle(this.currentArticleId, rating);
            
            if (success) {
                // Update local rating data
                this.updateRatingData(this.currentArticleId, currentUser.userId, rating);
                
                // Refresh the widget
                this.refreshRatingWidget();
                
                console.log('✅ Rating submitted:', rating);
            }
        } catch (error) {
            console.error('❌ Error submitting rating:', error);
            this.showMessage('评分失败，请重试', 'error');
        }
    }

    /**
     * Clear user rating
     */
    public clearUserRating(): void {
        if (!this.currentArticleId) return;

        const currentUser = this.getCurrentUser();
        if (!currentUser) return;

        try {
            const ratingsData = this.getAllRatingsData();
            const articleData = ratingsData[this.currentArticleId];
            
            if (articleData && articleData.ratings[currentUser.userId]) {
                delete articleData.ratings[currentUser.userId];
                this.recalculateRatingStats(articleData);
                localStorage.setItem(this.RATINGS_KEY, JSON.stringify(ratingsData));
                
                // Also clear from guest auth system
                const users = JSON.parse(localStorage.getItem('guestUsers') || '[]');
                const userIndex = users.findIndex((u: any) => u.id === currentUser.userId);
                if (userIndex !== -1 && users[userIndex].ratings[this.currentArticleId]) {
                    delete users[userIndex].ratings[this.currentArticleId];
                    localStorage.setItem('guestUsers', JSON.stringify(users));
                }
                
                this.refreshRatingWidget();
                this.showMessage('评分已清除', 'info');
            }
        } catch (error) {
            console.error('❌ Error clearing rating:', error);
        }
    }

    /**
     * Update rating data
     */
    private updateRatingData(articleId: string, userId: string, rating: number): void {
        const ratingsData = this.getAllRatingsData();
        
        if (!ratingsData[articleId]) {
            ratingsData[articleId] = {
                articleId,
                ratings: {},
                averageRating: 0,
                totalRatings: 0,
                ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
            };
        }

        const articleData = ratingsData[articleId];
        articleData.ratings[userId] = rating;
        
        this.recalculateRatingStats(articleData);
        localStorage.setItem(this.RATINGS_KEY, JSON.stringify(ratingsData));
    }

    /**
     * Recalculate rating statistics
     */
    private recalculateRatingStats(articleData: ArticleRatingData): void {
        const ratings = Object.values(articleData.ratings);
        articleData.totalRatings = ratings.length;
        
        if (ratings.length > 0) {
            articleData.averageRating = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
        } else {
            articleData.averageRating = 0;
        }

        // Reset distribution
        articleData.ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        
        // Count ratings
        ratings.forEach(rating => {
            articleData.ratingDistribution[rating] = (articleData.ratingDistribution[rating] || 0) + 1;
        });
    }

    /**
     * Get rating data for article
     */
    private getRatingData(articleId: string): ArticleRatingData {
        const ratingsData = this.getAllRatingsData();
        
        if (!ratingsData[articleId]) {
            return {
                articleId,
                ratings: {},
                averageRating: 0,
                totalRatings: 0,
                ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
            };
        }

        return ratingsData[articleId];
    }

    /**
     * Get all ratings data
     */
    private getAllRatingsData(): { [articleId: string]: ArticleRatingData } {
        try {
            const data = localStorage.getItem(this.RATINGS_KEY);
            return data ? JSON.parse(data) : {};
        } catch (error) {
            console.error('❌ Error loading ratings data:', error);
            return {};
        }
    }

    /**
     * Get current user from guest auth system
     */
    private getCurrentUser(): any {
        return (window as any).guestAuth?.getCurrentUser() || null;
    }

    /**
     * Refresh rating widget
     */
    private refreshRatingWidget(): void {
        const ratingWidget = document.getElementById('article-rating');
        if (ratingWidget && this.currentArticleId) {
            ratingWidget.remove();
            this.addRatingWidget();
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

    /**
     * Get article rating statistics (public method)
     */
    public getArticleStats(articleId: string): ArticleRatingData {
        return this.getRatingData(articleId);
    }
}

// Initialize article rating system
const articleRating = new ArticleRatingSystem();

// Make it globally available
(window as any).articleRating = articleRating;

export default articleRating;
