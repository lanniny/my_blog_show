/*!
*   Hugo Theme Stack - Image Gallery Component
*
*   @author: Alex (Engineer)
*   @project: Hugo Blog Image Management
*   @description: Image gallery for browsing and managing uploaded images
*/

import { githubAPI } from './github-api.js';
import { CDNLinkGenerator, ImageMetadata } from './image-manager.js';
import type { GitHubContent, GitHubAPIResponse } from './github-types.js';

/**
 * Gallery view modes
 */
export type GalleryViewMode = 'grid' | 'list';

/**
 * Image Gallery Component
 * Displays and manages images from my_blog_img repository
 */
export class ImageGallery {
    private container: HTMLElement;
    private cdnGenerator: CDNLinkGenerator;
    private images: ImageMetadata[] = [];
    private filteredImages: ImageMetadata[] = [];
    private viewMode: GalleryViewMode = 'grid';
    private currentFolder: string = '';
    private isLoading: boolean = false;

    private readonly config = {
        owner: 'lanniny',
        repo: 'my_blog_img',
        branch: 'main'
    };

    constructor(containerId: string) {
        const container = document.getElementById(containerId);
        if (!container) {
            throw new Error(`Container element with id "${containerId}" not found`);
        }
        
        this.container = container;
        this.cdnGenerator = new CDNLinkGenerator();
        this.init();
    }

    /**
     * Initialize the gallery
     */
    private async init(): Promise<void> {
        await this.loadImages();
        this.render();
    }

    /**
     * Load images from repository
     */
    public async loadImages(): Promise<void> {
        if (this.isLoading) return;
        
        this.isLoading = true;
        this.showLoading();

        try {
            // Get all files from the repository
            const response = await githubAPI.listDirectoryContents('', {
                owner: this.config.owner,
                repo: this.config.repo,
                ref: this.config.branch
            });

            if (response.data) {
                this.images = await this.processRepositoryContents(response.data);
                this.filteredImages = [...this.images];
                this.updateFolderFilter();
                this.render();
            }

        } catch (error) {
            console.error('Failed to load images:', error);
            this.showError('加载图片失败: ' + (error instanceof Error ? error.message : '未知错误'));
        } finally {
            this.isLoading = false;
        }
    }

    /**
     * Process repository contents recursively
     */
    private async processRepositoryContents(contents: GitHubContent[]): Promise<ImageMetadata[]> {
        const images: ImageMetadata[] = [];
        
        for (const item of contents) {
            if (item.type === 'file' && this.isImageFile(item.name)) {
                const metadata = this.createImageMetadata(item);
                images.push(metadata);
            } else if (item.type === 'dir') {
                // Recursively load subdirectories
                try {
                    const subResponse = await githubAPI.listDirectoryContents(item.path, {
                        owner: this.config.owner,
                        repo: this.config.repo,
                        ref: this.config.branch
                    });
                    
                    if (subResponse.data) {
                        const subImages = await this.processRepositoryContents(subResponse.data);
                        images.push(...subImages);
                    }
                } catch (error) {
                    console.warn(`Failed to load directory ${item.path}:`, error);
                }
            }
        }

        return images.sort((a, b) => b.uploadDate.getTime() - a.uploadDate.getTime());
    }

    /**
     * Check if file is an image
     */
    private isImageFile(filename: string): boolean {
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
        const extension = filename.toLowerCase().substring(filename.lastIndexOf('.'));
        return imageExtensions.includes(extension);
    }

    /**
     * Create image metadata from GitHub content
     */
    private createImageMetadata(content: GitHubContent): ImageMetadata {
        const format = this.getImageFormat(content.name);
        const uploadDate = new Date(); // GitHub API doesn't provide creation date easily
        
        return {
            name: content.name,
            path: content.path,
            size: content.size || 0,
            format,
            uploadDate,
            sha: content.sha,
            url: content.html_url || '',
            cdnUrl: this.cdnGenerator.generateCDNUrl(
                this.config.owner,
                this.config.repo,
                content.path
            ),
            thumbnailUrl: this.cdnGenerator.generateThumbnailUrl(
                this.config.owner,
                this.config.repo,
                content.path,
                300,
                200
            )
        };
    }

    /**
     * Get image format from filename
     */
    private getImageFormat(filename: string): string {
        const extension = filename.toLowerCase().substring(filename.lastIndexOf('.') + 1);
        const formatMap: Record<string, string> = {
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'png': 'image/png',
            'gif': 'image/gif',
            'webp': 'image/webp',
            'svg': 'image/svg+xml'
        };
        return formatMap[extension] || 'image/unknown';
    }

    /**
     * Render the gallery
     */
    private render(): void {
        if (this.filteredImages.length === 0) {
            this.showEmpty();
            return;
        }

        const html = this.viewMode === 'grid' 
            ? this.renderGridView() 
            : this.renderListView();
        
        this.container.innerHTML = html;
        this.bindImageEvents();
    }

    /**
     * Render grid view
     */
    private renderGridView(): string {
        return `
            <div class="image-grid">
                ${this.filteredImages.map(image => `
                    <div class="image-grid-item" data-image-path="${image.path}">
                        <div class="image-thumbnail">
                            <img src="${image.thumbnailUrl || image.cdnUrl}" 
                                 alt="${image.name}" 
                                 loading="lazy"
                                 onerror="this.src='${image.cdnUrl}'">
                            <div class="image-overlay">
                                <button class="btn-view" title="查看详情">👁️</button>
                                <button class="btn-copy" title="复制链接">📋</button>
                            </div>
                        </div>
                        <div class="image-info">
                            <div class="image-name" title="${image.name}">${this.truncateText(image.name, 20)}</div>
                            <div class="image-size">${this.formatFileSize(image.size)}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    /**
     * Render list view
     */
    private renderListView(): string {
        return `
            <div class="image-list">
                ${this.filteredImages.map(image => `
                    <div class="image-list-item" data-image-path="${image.path}">
                        <div class="image-thumbnail-small">
                            <img src="${image.thumbnailUrl || image.cdnUrl}" 
                                 alt="${image.name}" 
                                 loading="lazy"
                                 onerror="this.src='${image.cdnUrl}'">
                        </div>
                        <div class="image-details">
                            <div class="image-name">${image.name}</div>
                            <div class="image-meta">
                                <span class="image-size">${this.formatFileSize(image.size)}</span>
                                <span class="image-path">${image.path}</span>
                            </div>
                        </div>
                        <div class="image-actions">
                            <button class="btn btn-sm btn-view">查看</button>
                            <button class="btn btn-sm btn-copy">复制链接</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    /**
     * Bind image event listeners
     */
    private bindImageEvents(): void {
        // View buttons
        this.container.querySelectorAll('.btn-view').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const item = (e.target as HTMLElement).closest('[data-image-path]') as HTMLElement;
                const imagePath = item?.dataset.imagePath;
                if (imagePath) {
                    this.showImageModal(imagePath);
                }
            });
        });

        // Copy buttons
        this.container.querySelectorAll('.btn-copy').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const item = (e.target as HTMLElement).closest('[data-image-path]') as HTMLElement;
                const imagePath = item?.dataset.imagePath;
                if (imagePath) {
                    this.copyImageLink(imagePath);
                }
            });
        });

        // Image click to view
        this.container.querySelectorAll('[data-image-path]').forEach(item => {
            item.addEventListener('click', () => {
                const imagePath = (item as HTMLElement).dataset.imagePath;
                if (imagePath) {
                    this.showImageModal(imagePath);
                }
            });
        });
    }

    /**
     * Show image modal
     */
    private showImageModal(imagePath: string): void {
        const image = this.images.find(img => img.path === imagePath);
        if (!image) return;

        const modal = document.getElementById('imageModal');
        if (!modal) return;

        // Populate modal content
        const modalImage = document.getElementById('modalImage') as HTMLImageElement;
        const modalImageName = document.getElementById('modalImageName');
        const modalImageSize = document.getElementById('modalImageSize');
        const modalImageDate = document.getElementById('modalImageDate');
        const modalCdnLink = document.getElementById('modalCdnLink') as HTMLInputElement;
        const modalMarkdown = document.getElementById('modalMarkdown') as HTMLInputElement;

        if (modalImage) modalImage.src = image.cdnUrl;
        if (modalImageName) modalImageName.textContent = image.name;
        if (modalImageSize) modalImageSize.textContent = this.formatFileSize(image.size);
        if (modalImageDate) modalImageDate.textContent = image.uploadDate.toLocaleDateString();
        if (modalCdnLink) modalCdnLink.value = image.cdnUrl;
        if (modalMarkdown) modalMarkdown.value = `![${image.name}](${image.cdnUrl})`;

        // Show modal
        modal.style.display = 'block';

        // Setup delete button
        const deleteBtn = document.getElementById('deleteImage');
        if (deleteBtn) {
            deleteBtn.onclick = () => this.deleteImage(image);
        }
    }

    /**
     * Copy image link to clipboard
     */
    private async copyImageLink(imagePath: string): Promise<void> {
        const image = this.images.find(img => img.path === imagePath);
        if (!image) return;

        try {
            await navigator.clipboard.writeText(image.cdnUrl);
            this.showToast('链接已复制到剪贴板', 'success');
        } catch (error) {
            console.error('Failed to copy link:', error);
            this.showToast('复制失败', 'error');
        }
    }

    /**
     * Delete image from repository
     */
    private async deleteImage(image: ImageMetadata): Promise<void> {
        if (!confirm(`确定要删除图片 "${image.name}" 吗？此操作不可撤销。`)) {
            return;
        }

        try {
            const result = await githubAPI.deleteFile(
                image.path,
                image.sha,
                `Delete image: ${image.name}`
            );

            if (result.success) {
                this.showToast('图片删除成功', 'success');
                await this.refresh();
                
                // Close modal
                const modal = document.getElementById('imageModal');
                if (modal) modal.style.display = 'none';
            } else {
                throw new Error(result.error || 'Delete failed');
            }

        } catch (error) {
            console.error('Failed to delete image:', error);
            this.showToast('删除失败: ' + (error instanceof Error ? error.message : '未知错误'), 'error');
        }
    }

    /**
     * Refresh gallery
     */
    public async refresh(): Promise<void> {
        await this.loadImages();
    }

    /**
     * Toggle view mode
     */
    public toggleView(): void {
        this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
        this.render();
    }

    /**
     * Filter by folder
     */
    public filterByFolder(folder: string): void {
        this.currentFolder = folder;
        
        if (folder === '') {
            this.filteredImages = [...this.images];
        } else {
            this.filteredImages = this.images.filter(image => 
                image.path.startsWith(folder)
            );
        }
        
        this.render();
    }

    /**
     * Update folder filter dropdown
     */
    private updateFolderFilter(): void {
        const folderFilter = document.getElementById('folderFilter') as HTMLSelectElement;
        if (!folderFilter) return;

        const folders = new Set<string>();
        this.images.forEach(image => {
            const pathParts = image.path.split('/');
            if (pathParts.length > 1) {
                folders.add(pathParts[0]);
            }
        });

        const currentValue = folderFilter.value;
        folderFilter.innerHTML = '<option value="">所有文件夹</option>';
        
        Array.from(folders).sort().forEach(folder => {
            const option = document.createElement('option');
            option.value = folder;
            option.textContent = folder;
            folderFilter.appendChild(option);
        });

        folderFilter.value = currentValue;
    }

    /**
     * Show loading state
     */
    private showLoading(): void {
        this.container.innerHTML = `
            <div class="loading-placeholder">
                <div class="loading-spinner"></div>
                <p>正在加载图片库...</p>
            </div>
        `;
    }

    /**
     * Show empty state
     */
    private showEmpty(): void {
        this.container.innerHTML = `
            <div class="empty-placeholder">
                <div class="empty-icon">📷</div>
                <h3>暂无图片</h3>
                <p>上传一些图片来开始使用图片库吧！</p>
            </div>
        `;
    }

    /**
     * Show error state
     */
    private showError(message: string): void {
        this.container.innerHTML = `
            <div class="error-placeholder">
                <div class="error-icon">❌</div>
                <h3>加载失败</h3>
                <p>${message}</p>
                <button onclick="location.reload()" class="btn btn-primary">重试</button>
            </div>
        `;
    }

    /**
     * Show toast notification
     */
    private showToast(message: string, type: 'success' | 'error' | 'warning' = 'success'): void {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }

    /**
     * Utility functions
     */
    private formatFileSize(bytes: number): string {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    private truncateText(text: string, maxLength: number): string {
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    }
}

// Export for global use
(window as any).ImageGallery = ImageGallery;
