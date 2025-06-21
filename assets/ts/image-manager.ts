/*!
*   Hugo Theme Stack - Image Management System
*
*   @author: Alex (Engineer)
*   @project: Hugo Blog Image Management
*   @description: Unified image management system for my_blog_img repository integration
*/

import { githubAPI, GitHubRepositoryManager } from './github-api.js';
import type { 
    FileOperationResult, 
    GitHubContent,
    GitHubAPIResponse 
} from './github-types.js';

/**
 * Image metadata interface
 */
export interface ImageMetadata {
    name: string;
    path: string;
    size: number;
    format: string;
    uploadDate: Date;
    sha: string;
    url: string;
    cdnUrl: string;
    thumbnailUrl?: string;
}

/**
 * Image upload options
 */
export interface ImageUploadOptions {
    folder?: string;
    filename?: string;
    generateThumbnail?: boolean;
    quality?: number;
    maxWidth?: number;
    maxHeight?: number;
}

/**
 * Image upload progress callback
 */
export type ImageUploadProgressCallback = (progress: {
    stage: 'preparing' | 'uploading' | 'processing' | 'complete';
    percentage: number;
    message: string;
}) => void;

/**
 * CDN Link Generator
 * Generates optimized CDN links for GitHub-hosted images
 */
export class CDNLinkGenerator {
    private readonly baseUrls = {
        github: 'https://raw.githubusercontent.com',
        jsdelivr: 'https://cdn.jsdelivr.net/gh',
        githubPages: 'https://lanniny.github.io'
    };

    /**
     * Generate CDN URL for image
     */
    public generateCDNUrl(
        owner: string,
        repo: string,
        path: string,
        provider: 'github' | 'jsdelivr' | 'githubPages' = 'jsdelivr'
    ): string {
        switch (provider) {
            case 'github':
                return `${this.baseUrls.github}/${owner}/${repo}/main/${path}`;
            case 'jsdelivr':
                return `${this.baseUrls.jsdelivr}/${owner}/${repo}@main/${path}`;
            case 'githubPages':
                return `${this.baseUrls.githubPages}/${repo}/${path}`;
            default:
                return `${this.baseUrls.jsdelivr}/${owner}/${repo}@main/${path}`;
        }
    }

    /**
     * Generate multiple CDN URLs for fallback
     */
    public generateFallbackUrls(owner: string, repo: string, path: string): string[] {
        return [
            this.generateCDNUrl(owner, repo, path, 'jsdelivr'),
            this.generateCDNUrl(owner, repo, path, 'github'),
            this.generateCDNUrl(owner, repo, path, 'githubPages')
        ];
    }

    /**
     * Generate thumbnail URL with size parameters
     */
    public generateThumbnailUrl(
        owner: string,
        repo: string,
        path: string,
        width: number = 300,
        height: number = 200
    ): string {
        // Use jsDelivr with size parameters for thumbnails
        const baseUrl = this.generateCDNUrl(owner, repo, path, 'jsdelivr');
        return `${baseUrl}?w=${width}&h=${height}&fit=crop`;
    }
}

/**
 * Image Processor
 * Handles image compression and format optimization
 */
export class ImageProcessor {
    /**
     * Compress image file
     */
    public async compressImage(
        file: File,
        options: {
            quality?: number;
            maxWidth?: number;
            maxHeight?: number;
            format?: 'jpeg' | 'png' | 'webp';
        } = {}
    ): Promise<File> {
        return new Promise((resolve, reject) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();

            img.onload = () => {
                // Calculate new dimensions
                const { width, height } = this.calculateDimensions(
                    img.width,
                    img.height,
                    options.maxWidth || 1920,
                    options.maxHeight || 1080
                );

                canvas.width = width;
                canvas.height = height;

                // Draw and compress
                ctx?.drawImage(img, 0, 0, width, height);

                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            const compressedFile = new File(
                                [blob],
                                file.name,
                                { type: blob.type }
                            );
                            resolve(compressedFile);
                        } else {
                            reject(new Error('Image compression failed'));
                        }
                    },
                    options.format ? `image/${options.format}` : file.type,
                    options.quality || 0.8
                );
            };

            img.onerror = () => reject(new Error('Failed to load image'));
            img.src = URL.createObjectURL(file);
        });
    }

    /**
     * Calculate optimal dimensions maintaining aspect ratio
     */
    private calculateDimensions(
        originalWidth: number,
        originalHeight: number,
        maxWidth: number,
        maxHeight: number
    ): { width: number; height: number } {
        const aspectRatio = originalWidth / originalHeight;

        let width = originalWidth;
        let height = originalHeight;

        if (width > maxWidth) {
            width = maxWidth;
            height = width / aspectRatio;
        }

        if (height > maxHeight) {
            height = maxHeight;
            width = height * aspectRatio;
        }

        return { width: Math.round(width), height: Math.round(height) };
    }

    /**
     * Generate thumbnail from image file
     */
    public async generateThumbnail(
        file: File,
        width: number = 300,
        height: number = 200
    ): Promise<File> {
        return this.compressImage(file, {
            maxWidth: width,
            maxHeight: height,
            quality: 0.7,
            format: 'jpeg'
        });
    }

    /**
     * Validate image file
     */
    public validateImage(file: File): { valid: boolean; error?: string } {
        // Check file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
        if (!allowedTypes.includes(file.type)) {
            return {
                valid: false,
                error: `不支持的图片格式: ${file.type}`
            };
        }

        // Check file size (max 10MB)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            return {
                valid: false,
                error: `图片文件过大: ${(file.size / 1024 / 1024).toFixed(2)}MB (最大10MB)`
            };
        }

        return { valid: true };
    }
}

/**
 * Image Manager
 * Main class for managing images in my_blog_img repository
 */
export class ImageManager {
    private repositoryManager: GitHubRepositoryManager;
    private cdnGenerator: CDNLinkGenerator;
    private processor: ImageProcessor;
    private readonly config = {
        owner: 'lanniny',
        repo: 'my_blog_img',
        branch: 'main'
    };

    constructor(repositoryManager?: GitHubRepositoryManager) {
        this.repositoryManager = repositoryManager || new GitHubRepositoryManager(githubAPI);
        this.cdnGenerator = new CDNLinkGenerator();
        this.processor = new ImageProcessor();
    }

    /**
     * Upload image to repository
     */
    public async uploadImage(
        file: File,
        options: ImageUploadOptions = {},
        progressCallback?: ImageUploadProgressCallback
    ): Promise<ImageMetadata> {
        try {
            // Stage 1: Preparing
            progressCallback?.({
                stage: 'preparing',
                percentage: 10,
                message: '准备上传图片...'
            });

            // Validate image
            const validation = this.processor.validateImage(file);
            if (!validation.valid) {
                throw new Error(validation.error);
            }

            // Process image
            progressCallback?.({
                stage: 'processing',
                percentage: 30,
                message: '处理图片...'
            });

            const processedFile = await this.processor.compressImage(file, {
                quality: options.quality || 0.85,
                maxWidth: options.maxWidth || 1920,
                maxHeight: options.maxHeight || 1080
            });

            // Generate file path
            const folder = options.folder || this.generateDateFolder();
            const filename = options.filename || this.generateUniqueFilename(file.name);
            const filePath = `${folder}/${filename}`;

            // Stage 2: Uploading
            progressCallback?.({
                stage: 'uploading',
                percentage: 60,
                message: '上传到GitHub仓库...'
            });

            // Convert file to base64
            const base64Content = await this.fileToBase64(processedFile);

            // Upload to repository
            const uploadResult = await this.repositoryManager.uploadFile(
                filePath,
                base64Content,
                `Upload image: ${filename}`,
                {
                    overwrite: false,
                    encoding: 'base64'
                }
            );

            if (!uploadResult.success) {
                throw new Error(uploadResult.error || 'Upload failed');
            }

            // Stage 3: Complete
            progressCallback?.({
                stage: 'complete',
                percentage: 100,
                message: '上传完成！'
            });

            // Generate metadata
            const metadata: ImageMetadata = {
                name: filename,
                path: filePath,
                size: processedFile.size,
                format: processedFile.type,
                uploadDate: new Date(),
                sha: uploadResult.sha || '',
                url: uploadResult.url || '',
                cdnUrl: this.cdnGenerator.generateCDNUrl(
                    this.config.owner,
                    this.config.repo,
                    filePath
                ),
                thumbnailUrl: this.cdnGenerator.generateThumbnailUrl(
                    this.config.owner,
                    this.config.repo,
                    filePath
                )
            };

            // Dispatch success event
            this.dispatchEvent('image-uploaded', metadata);

            return metadata;

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            
            progressCallback?.({
                stage: 'complete',
                percentage: 0,
                message: `上传失败: ${errorMessage}`
            });

            // Dispatch error event
            this.dispatchEvent('image-upload-error', { error: errorMessage });

            throw error;
        }
    }

    /**
     * Convert file to base64
     */
    private async fileToBase64(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const result = reader.result as string;
                // Remove data URL prefix
                const base64 = result.split(',')[1];
                resolve(base64);
            };
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsDataURL(file);
        });
    }

    /**
     * Generate date-based folder structure
     */
    private generateDateFolder(): string {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        return `images/${year}/${month}`;
    }

    /**
     * Generate unique filename
     */
    private generateUniqueFilename(originalName: string): string {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 8);
        const extension = originalName.split('.').pop() || 'jpg';
        return `img_${timestamp}_${random}.${extension}`;
    }

    /**
     * Delete image from repository
     */
    public async deleteImage(
        imagePath: string,
        sha: string
    ): Promise<{ success: boolean; error?: string }> {
        try {
            const result = await this.repositoryManager.deleteFile(
                imagePath,
                sha,
                `Delete image: ${imagePath.split('/').pop()}`
            );

            if (result.success) {
                // Dispatch delete event
                this.dispatchEvent('image-deleted', { path: imagePath });
                return { success: true };
            } else {
                return { success: false, error: result.error };
            }

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            this.dispatchEvent('image-delete-error', { error: errorMessage, path: imagePath });
            return { success: false, error: errorMessage };
        }
    }

    /**
     * Rename image in repository
     */
    public async renameImage(
        oldPath: string,
        newPath: string,
        sha: string
    ): Promise<{ success: boolean; error?: string; newMetadata?: ImageMetadata }> {
        try {
            // First, get the file content
            const fileResponse = await this.repositoryManager.getFileContent(oldPath);
            if (!fileResponse.success || !fileResponse.content) {
                throw new Error('Failed to get file content');
            }

            // Upload to new path
            const uploadResult = await this.repositoryManager.uploadFile(
                newPath,
                fileResponse.content,
                `Rename image: ${oldPath} -> ${newPath}`,
                {
                    overwrite: false,
                    encoding: 'base64'
                }
            );

            if (!uploadResult.success) {
                throw new Error(uploadResult.error || 'Upload to new path failed');
            }

            // Delete old file
            const deleteResult = await this.repositoryManager.deleteFile(
                oldPath,
                sha,
                `Remove old image after rename: ${oldPath}`
            );

            if (!deleteResult.success) {
                console.warn('Failed to delete old file after rename:', deleteResult.error);
                // Continue anyway, as the new file was created successfully
            }

            // Create new metadata
            const newMetadata: ImageMetadata = {
                name: newPath.split('/').pop() || '',
                path: newPath,
                size: 0, // Size not available from upload response
                format: this.getImageFormatFromPath(newPath),
                uploadDate: new Date(),
                sha: uploadResult.sha || '',
                url: uploadResult.url || '',
                cdnUrl: this.cdnGenerator.generateCDNUrl(
                    this.config.owner,
                    this.config.repo,
                    newPath
                ),
                thumbnailUrl: this.cdnGenerator.generateThumbnailUrl(
                    this.config.owner,
                    this.config.repo,
                    newPath
                )
            };

            // Dispatch rename event
            this.dispatchEvent('image-renamed', {
                oldPath,
                newPath,
                newMetadata
            });

            return { success: true, newMetadata };

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            this.dispatchEvent('image-rename-error', {
                error: errorMessage,
                oldPath,
                newPath
            });
            return { success: false, error: errorMessage };
        }
    }

    /**
     * List all images in repository
     */
    public async listImages(folder?: string): Promise<ImageMetadata[]> {
        try {
            const path = folder || '';
            const response = await this.repositoryManager.listDirectoryContents(path);

            if (!response.success || !response.data) {
                throw new Error(response.error || 'Failed to list directory contents');
            }

            const images: ImageMetadata[] = [];

            for (const item of response.data) {
                if (item.type === 'file' && this.isImageFile(item.name)) {
                    const metadata: ImageMetadata = {
                        name: item.name,
                        path: item.path,
                        size: item.size || 0,
                        format: this.getImageFormatFromPath(item.name),
                        uploadDate: new Date(), // GitHub API doesn't provide creation date easily
                        sha: item.sha,
                        url: item.html_url || '',
                        cdnUrl: this.cdnGenerator.generateCDNUrl(
                            this.config.owner,
                            this.config.repo,
                            item.path
                        ),
                        thumbnailUrl: this.cdnGenerator.generateThumbnailUrl(
                            this.config.owner,
                            this.config.repo,
                            item.path
                        )
                    };
                    images.push(metadata);
                }
            }

            return images.sort((a, b) => b.uploadDate.getTime() - a.uploadDate.getTime());

        } catch (error) {
            console.error('Failed to list images:', error);
            return [];
        }
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
     * Get image format from file path
     */
    private getImageFormatFromPath(path: string): string {
        const extension = path.toLowerCase().substring(path.lastIndexOf('.') + 1);
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
     * Dispatch image management events
     */
    private dispatchEvent(type: string, data: any): void {
        const event = new CustomEvent('image-management', {
            detail: {
                type,
                data,
                timestamp: Date.now()
            }
        });
        window.dispatchEvent(event);
    }
}

/**
 * Image Manager UI
 * Provides user interface for image management
 */
export class ImageManagerUI {
    private imageManager: ImageManager;
    private isOpen: boolean = false;

    constructor(imageManager: ImageManager) {
        this.imageManager = imageManager;
        this.createInterface();
        this.setupEventListeners();
    }

    /**
     * Create image manager interface
     */
    private createInterface(): void {
        const imageManagerHTML = `
            <div class="image-manager-modal" id="image-manager-modal" style="display: none;">
                <div class="image-manager-container">
                    <div class="image-manager-header">
                        <h3>🖼️ 图片管理</h3>
                        <button class="close-btn" id="image-manager-close">×</button>
                    </div>

                    <div class="image-manager-content">
                        <!-- Upload Section -->
                        <div class="upload-section">
                            <div class="upload-area" id="image-upload-area">
                                <div class="upload-placeholder">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                        <polyline points="7,10 12,15 17,10"></polyline>
                                        <line x1="12" y1="15" x2="12" y2="3"></line>
                                    </svg>
                                    <p>拖拽图片到此处或点击上传</p>
                                    <small>支持 JPG、PNG、GIF、WebP 格式，最大 10MB</small>
                                </div>
                                <input type="file" id="image-file-input" accept="image/*" multiple style="display: none;">
                            </div>

                            <div class="upload-progress" id="upload-progress" style="display: none;">
                                <div class="progress-bar">
                                    <div class="progress-fill" id="progress-fill"></div>
                                </div>
                                <div class="progress-text" id="progress-text">准备上传...</div>
                            </div>
                        </div>

                        <!-- Image Gallery -->
                        <div class="image-gallery-section">
                            <div class="gallery-header">
                                <h4>📚 图片库</h4>
                                <div class="gallery-controls">
                                    <input type="text" id="image-search" placeholder="搜索图片...">
                                    <select id="image-filter">
                                        <option value="">所有图片</option>
                                        <option value="recent">最近上传</option>
                                        <option value="large">大图片</option>
                                        <option value="small">小图片</option>
                                    </select>
                                    <button class="btn btn-secondary" id="refresh-gallery">刷新</button>
                                </div>
                            </div>

                            <div class="image-gallery" id="image-gallery">
                                <div class="loading-state">正在加载图片...</div>
                            </div>

                            <div class="gallery-pagination" id="gallery-pagination" style="display: none;">
                                <button class="btn btn-secondary" id="prev-page" disabled>上一页</button>
                                <span class="page-info" id="page-info">第 1 页，共 1 页</span>
                                <button class="btn btn-secondary" id="next-page" disabled>下一页</button>
                            </div>
                        </div>

                        <!-- Image Details Panel -->
                        <div class="image-details-panel" id="image-details-panel" style="display: none;">
                            <div class="details-header">
                                <h4>图片详情</h4>
                                <button class="close-details" id="close-details">×</button>
                            </div>

                            <div class="details-content">
                                <div class="image-preview">
                                    <img id="details-image" src="" alt="图片预览">
                                </div>

                                <div class="image-info">
                                    <div class="info-group">
                                        <label>文件名:</label>
                                        <input type="text" id="details-name" readonly>
                                        <button class="btn btn-small" id="edit-name">编辑</button>
                                    </div>

                                    <div class="info-group">
                                        <label>CDN链接:</label>
                                        <input type="text" id="details-cdn-url" readonly>
                                        <button class="btn btn-small" id="copy-cdn-url">复制</button>
                                    </div>

                                    <div class="info-group">
                                        <label>Markdown:</label>
                                        <input type="text" id="details-markdown" readonly>
                                        <button class="btn btn-small" id="copy-markdown">复制</button>
                                    </div>

                                    <div class="info-group">
                                        <label>文件大小:</label>
                                        <span id="details-size">-</span>
                                    </div>

                                    <div class="info-group">
                                        <label>上传时间:</label>
                                        <span id="details-date">-</span>
                                    </div>
                                </div>

                                <div class="details-actions">
                                    <button class="btn btn-primary" id="use-image">使用图片</button>
                                    <button class="btn btn-secondary" id="download-image">下载</button>
                                    <button class="btn btn-danger" id="delete-image">删除</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add to body if not exists
        if (!document.getElementById('image-manager-modal')) {
            document.body.insertAdjacentHTML('beforeend', imageManagerHTML);
        }
    }

    /**
     * Setup event listeners
     */
    private setupEventListeners(): void {
        // Close modal
        const closeBtn = document.getElementById('image-manager-close');
        closeBtn?.addEventListener('click', () => this.closeManager());

        // Upload area click
        const uploadArea = document.getElementById('image-upload-area');
        const fileInput = document.getElementById('image-file-input') as HTMLInputElement;

        uploadArea?.addEventListener('click', () => fileInput?.click());

        // File input change
        fileInput?.addEventListener('change', (e) => {
            const files = (e.target as HTMLInputElement).files;
            if (files) {
                this.handleFileUpload(Array.from(files));
            }
        });

        // Drag and drop
        uploadArea?.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('drag-over');
        });

        uploadArea?.addEventListener('dragleave', () => {
            uploadArea.classList.remove('drag-over');
        });

        uploadArea?.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('drag-over');

            const files = Array.from(e.dataTransfer?.files || []);
            if (files.length > 0) {
                this.handleFileUpload(files);
            }
        });

        // Search and filter
        const searchInput = document.getElementById('image-search');
        searchInput?.addEventListener('input', () => this.filterImages());

        const filterSelect = document.getElementById('image-filter');
        filterSelect?.addEventListener('change', () => this.filterImages());

        // Refresh gallery
        const refreshBtn = document.getElementById('refresh-gallery');
        refreshBtn?.addEventListener('click', () => this.loadImageGallery());

        // Close details panel
        const closeDetails = document.getElementById('close-details');
        closeDetails?.addEventListener('click', () => this.closeDetailsPanel());

        // Copy buttons
        const copyCdnBtn = document.getElementById('copy-cdn-url');
        copyCdnBtn?.addEventListener('click', () => this.copyToClipboard('details-cdn-url'));

        const copyMarkdownBtn = document.getElementById('copy-markdown');
        copyMarkdownBtn?.addEventListener('click', () => this.copyToClipboard('details-markdown'));
    }

    /**
     * Open image manager
     */
    public openManager(): void {
        const modal = document.getElementById('image-manager-modal');
        if (modal) {
            modal.style.display = 'flex';
            this.isOpen = true;
            this.loadImageGallery();
        }
    }

    /**
     * Close image manager
     */
    public closeManager(): void {
        const modal = document.getElementById('image-manager-modal');
        if (modal) {
            modal.style.display = 'none';
            this.isOpen = false;
            this.closeDetailsPanel();
        }
    }

    /**
     * Handle file upload
     */
    private async handleFileUpload(files: File[]): Promise<void> {
        const progressContainer = document.getElementById('upload-progress');
        const progressFill = document.getElementById('progress-fill');
        const progressText = document.getElementById('progress-text');

        if (!progressContainer || !progressFill || !progressText) return;

        progressContainer.style.display = 'block';

        for (let i = 0; i < files.length; i++) {
            const file = files[i];

            try {
                await this.imageManager.uploadImage(file, {}, (progress) => {
                    const overallProgress = ((i / files.length) + (progress.percentage / 100 / files.length)) * 100;
                    progressFill.style.width = `${overallProgress}%`;
                    progressText.textContent = `${progress.message} (${i + 1}/${files.length})`;
                });

                console.log(`✅ Uploaded: ${file.name}`);
            } catch (error) {
                console.error(`❌ Failed to upload ${file.name}:`, error);
                this.showMessage(`上传失败: ${file.name}`, 'error');
            }
        }

        // Hide progress and refresh gallery
        setTimeout(() => {
            progressContainer.style.display = 'none';
            this.loadImageGallery();
        }, 1000);
    }

    /**
     * Load image gallery
     */
    private async loadImageGallery(): Promise<void> {
        const gallery = document.getElementById('image-gallery');
        if (!gallery) return;

        gallery.innerHTML = '<div class="loading-state">正在加载图片...</div>';

        try {
            // This would typically load from GitHub repository
            // For now, we'll show a placeholder
            gallery.innerHTML = `
                <div class="empty-gallery">
                    <p>暂无图片</p>
                    <p>上传您的第一张图片开始使用图片管理功能</p>
                </div>
            `;
        } catch (error) {
            console.error('Failed to load image gallery:', error);
            gallery.innerHTML = '<div class="error-state">加载图片失败，请重试</div>';
        }
    }

    /**
     * Filter images
     */
    private filterImages(): void {
        // Implementation for filtering images
        console.log('Filtering images...');
    }

    /**
     * Close details panel
     */
    private closeDetailsPanel(): void {
        const panel = document.getElementById('image-details-panel');
        if (panel) {
            panel.style.display = 'none';
        }
    }

    /**
     * Copy text to clipboard
     */
    private async copyToClipboard(elementId: string): Promise<void> {
        const element = document.getElementById(elementId) as HTMLInputElement;
        if (element) {
            try {
                await navigator.clipboard.writeText(element.value);
                this.showMessage('已复制到剪贴板', 'success');
            } catch (error) {
                console.error('Failed to copy to clipboard:', error);
                this.showMessage('复制失败', 'error');
            }
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

// Export singleton instance
export const imageManager = new ImageManager();
export const imageManagerUI = new ImageManagerUI(imageManager);

// Export to global
window.ImageManager = ImageManager;
window.CDNLinkGenerator = CDNLinkGenerator;
window.ImageProcessor = ImageProcessor;
window.imageManager = imageManager;
window.imageManagerUI = imageManagerUI;
window.openImageManager = () => imageManagerUI.openManager();

export default ImageManager;
