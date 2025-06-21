/*!
*   Hugo Theme Stack - GitHub Image Uploader
*
*   @author: Alex (Engineer)
*   @project: Hugo Blog GitHub Image Upload System
*   @description: Complete GitHub API integration for image upload to my_blog_img repository
*/

/**
 * GitHub API response interface
 */
export interface GitHubApiResponse {
    content?: {
        sha: string;
        download_url: string;
        html_url: string;
    };
    commit?: {
        sha: string;
        html_url: string;
    };
}

/**
 * Upload result interface
 */
export interface UploadResult {
    success: boolean;
    url?: string;
    cdnUrl?: string;
    fileName?: string;
    sha?: string;
    error?: string;
    originalSize?: number;
    compressedSize?: number;
}

/**
 * Upload progress interface
 */
export interface UploadProgress {
    stage: 'validating' | 'compressing' | 'uploading' | 'completed' | 'error';
    progress: number; // 0-100
    message: string;
    fileName?: string;
}

/**
 * Image metadata interface
 */
export interface ImageMetadata {
    title?: string;
    description?: string;
    tags?: string[];
    category?: string;
    alt?: string;
}

/**
 * GitHub Image Uploader Class
 */
export class GitHubImageUploader {
    private config: any;
    private token: string | null = null;
    private progressCallback?: (progress: UploadProgress) => void;

    constructor() {
        this.loadConfig();
        this.loadToken();
    }

    /**
     * Load GitHub configuration
     */
    private loadConfig(): void {
        if (typeof window !== 'undefined' && (window as any).GitHubConfig) {
            this.config = (window as any).GitHubConfig;
        } else {
            throw new Error('GitHub configuration not found. Please ensure github-config.js is loaded.');
        }
    }

    /**
     * Load GitHub access token
     */
    private loadToken(): void {
        // 在生产环境中，token应该通过安全的方式获取
        // 这里使用localStorage作为演示，实际应用中应该使用更安全的方法
        this.token = localStorage.getItem('github_access_token');
        
        if (!this.token && !this.config.development.useMockUpload) {
            console.warn('GitHub access token not found. Some features may not work.');
        }
    }

    /**
     * Set GitHub access token
     */
    public setToken(token: string): void {
        this.token = token;
        localStorage.setItem('github_access_token', token);
        this.config.utils.debugLog('GitHub token updated');
    }

    /**
     * Set progress callback
     */
    public setProgressCallback(callback: (progress: UploadProgress) => void): void {
        this.progressCallback = callback;
    }

    /**
     * Upload single image
     */
    public async uploadImage(
        file: File, 
        metadata: ImageMetadata = {},
        category: string = 'general'
    ): Promise<UploadResult> {
        try {
            this.updateProgress('validating', 0, '验证文件...');

            // Validate file
            const validation = this.validateFile(file);
            if (!validation.valid) {
                throw new Error(validation.error);
            }

            this.updateProgress('validating', 20, '文件验证通过');

            // Generate unique filename
            const fileName = this.config.utils.generateUniqueFileName(file.name, category);
            
            this.updateProgress('compressing', 30, '压缩图片...');

            // Compress image
            const compressedFile = await this.compressImage(file);
            
            this.updateProgress('compressing', 60, '图片压缩完成');
            this.updateProgress('uploading', 70, '上传到GitHub...');

            // Convert to base64
            const base64Content = await this.fileToBase64(compressedFile);

            // Upload to GitHub
            const result = await this.uploadToGitHub(fileName, base64Content, metadata);

            this.updateProgress('completed', 100, '上传完成');

            return {
                success: true,
                url: result.content?.download_url,
                cdnUrl: this.config.utils.getImageUrl(fileName),
                fileName: fileName,
                sha: result.content?.sha,
                originalSize: file.size,
                compressedSize: compressedFile.size
            };

        } catch (error) {
            this.updateProgress('error', 0, `上传失败: ${error.message}`);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Upload multiple images
     */
    public async uploadImages(
        files: File[], 
        metadata: ImageMetadata[] = [],
        category: string = 'general'
    ): Promise<UploadResult[]> {
        const results: UploadResult[] = [];
        
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const meta = metadata[i] || {};
            
            this.updateProgress('uploading', (i / files.length) * 100, `上传第 ${i + 1} 个文件: ${file.name}`);
            
            const result = await this.uploadImage(file, meta, category);
            results.push(result);
            
            // Add delay between uploads to avoid rate limiting
            if (i < files.length - 1) {
                await this.delay(500);
            }
        }
        
        return results;
    }

    /**
     * Validate file
     */
    private validateFile(file: File): { valid: boolean; error?: string } {
        if (!this.config.utils.isValidImageFormat(file)) {
            return {
                valid: false,
                error: this.config.utils.getErrorMessage('unsupported_format')
            };
        }

        if (!this.config.utils.isValidFileSize(file)) {
            return {
                valid: false,
                error: this.config.utils.getErrorMessage('file_too_large')
            };
        }

        return { valid: true };
    }

    /**
     * Compress image
     */
    private async compressImage(file: File): Promise<File> {
        return new Promise((resolve, reject) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();

            img.onload = () => {
                const { maxWidth, maxHeight, quality } = this.config.imageUpload.compression;
                
                // Calculate new dimensions
                let { width, height } = img;
                
                if (width > maxWidth || height > maxHeight) {
                    const ratio = Math.min(maxWidth / width, maxHeight / height);
                    width *= ratio;
                    height *= ratio;
                }

                canvas.width = width;
                canvas.height = height;

                // Draw and compress
                ctx?.drawImage(img, 0, 0, width, height);
                
                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            const compressedFile = new File([blob], file.name, {
                                type: 'image/webp',
                                lastModified: Date.now()
                            });
                            resolve(compressedFile);
                        } else {
                            reject(new Error('Image compression failed'));
                        }
                    },
                    'image/webp',
                    quality
                );
            };

            img.onerror = () => reject(new Error('Failed to load image'));
            img.src = URL.createObjectURL(file);
        });
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
     * Upload to GitHub repository
     */
    private async uploadToGitHub(
        fileName: string, 
        base64Content: string, 
        metadata: ImageMetadata
    ): Promise<GitHubApiResponse> {
        if (this.config.development.useMockUpload) {
            // Mock upload for development
            await this.delay(1000);
            return {
                content: {
                    sha: 'mock_sha_' + Date.now(),
                    download_url: this.config.utils.getImageUrl(fileName, false),
                    html_url: `https://github.com/${this.config.imageRepo.owner}/${this.config.imageRepo.repo}/blob/${this.config.imageRepo.branch}/${fileName}`
                }
            };
        }

        if (!this.token) {
            throw new Error(this.config.utils.getErrorMessage('auth_failed'));
        }

        const { owner, repo, branch } = this.config.imageRepo;
        const url = `${this.config.apiUrl}/repos/${owner}/${repo}/contents/${fileName}`;

        // Create commit message with metadata
        const commitMessage = this.createCommitMessage(fileName, metadata);

        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${this.token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/vnd.github.v3+json'
            },
            body: JSON.stringify({
                message: commitMessage,
                content: base64Content,
                branch: branch
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || this.config.utils.getErrorMessage('upload_failed'));
        }

        return await response.json();
    }

    /**
     * Create commit message with metadata
     */
    private createCommitMessage(fileName: string, metadata: ImageMetadata): string {
        let message = `Add image: ${fileName}`;
        
        if (metadata.title) {
            message += `\n\nTitle: ${metadata.title}`;
        }
        
        if (metadata.description) {
            message += `\nDescription: ${metadata.description}`;
        }
        
        if (metadata.tags && metadata.tags.length > 0) {
            message += `\nTags: ${metadata.tags.join(', ')}`;
        }
        
        if (metadata.category) {
            message += `\nCategory: ${metadata.category}`;
        }

        return message;
    }

    /**
     * Update progress
     */
    private updateProgress(stage: UploadProgress['stage'], progress: number, message: string): void {
        if (this.progressCallback) {
            this.progressCallback({
                stage,
                progress,
                message
            });
        }
        
        this.config.utils.debugLog(`Upload Progress: ${stage} - ${progress}% - ${message}`);
    }

    /**
     * Delay utility
     */
    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Get upload statistics
     */
    public async getUploadStats(): Promise<any> {
        // This would typically fetch from GitHub API or a database
        // For now, return mock data
        return {
            totalUploads: 0,
            totalSize: 0,
            categories: {},
            recentUploads: []
        };
    }

    /**
     * Delete image from repository
     */
    public async deleteImage(fileName: string): Promise<boolean> {
        if (!this.token) {
            throw new Error(this.config.utils.getErrorMessage('auth_failed'));
        }

        try {
            const { owner, repo, branch } = this.config.imageRepo;
            
            // First, get the file to obtain its SHA
            const getUrl = `${this.config.apiUrl}/repos/${owner}/${repo}/contents/${fileName}`;
            const getResponse = await fetch(getUrl, {
                headers: {
                    'Authorization': `token ${this.token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (!getResponse.ok) {
                throw new Error('File not found');
            }

            const fileData = await getResponse.json();
            
            // Delete the file
            const deleteUrl = `${this.config.apiUrl}/repos/${owner}/${repo}/contents/${fileName}`;
            const deleteResponse = await fetch(deleteUrl, {
                method: 'DELETE',
                headers: {
                    'Authorization': `token ${this.token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/vnd.github.v3+json'
                },
                body: JSON.stringify({
                    message: `Delete image: ${fileName}`,
                    sha: fileData.sha,
                    branch: branch
                })
            });

            return deleteResponse.ok;
        } catch (error) {
            this.config.utils.debugLog('Delete failed:', error);
            return false;
        }
    }

    /**
     * List images in repository
     */
    public async listImages(category?: string): Promise<any[]> {
        if (!this.token) {
            throw new Error(this.config.utils.getErrorMessage('auth_failed'));
        }

        try {
            const { owner, repo } = this.config.imageRepo;
            const path = category ? this.config.imageUpload.paths[category] || category : '';
            const url = `${this.config.apiUrl}/repos/${owner}/${repo}/contents/${path}`;

            const response = await fetch(url, {
                headers: {
                    'Authorization': `token ${this.token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to list images');
            }

            const files = await response.json();
            
            // Filter only image files
            return files.filter((file: any) => {
                const extension = file.name.split('.').pop()?.toLowerCase();
                return this.config.imageUpload.supportedFormats.includes(extension);
            });
        } catch (error) {
            this.config.utils.debugLog('List images failed:', error);
            return [];
        }
    }
}

/**
 * Image Manager UI Class
 */
class ImageManagerUI {
    private uploader: GitHubImageUploader;
    private container: HTMLElement | null = null;

    constructor(uploader: GitHubImageUploader) {
        this.uploader = uploader;
    }

    /**
     * Open image manager interface
     */
    public openManager(): void {
        if (!this.container) {
            this.createInterface();
        }
        if (this.container) {
            this.container.style.display = 'block';
        }
    }

    /**
     * Close image manager interface
     */
    public closeManager(): void {
        if (this.container) {
            this.container.style.display = 'none';
        }
    }

    /**
     * Create image manager interface
     */
    private createInterface(): void {
        const imageManagerHTML = `
            <div class="image-manager" id="image-manager" style="display: none;">
                <div class="image-manager-header">
                    <h3>📷 图片管理</h3>
                    <button class="close-btn" onclick="window.imageManagerUI.closeManager()">×</button>
                </div>

                <div class="image-manager-content">
                    <!-- Upload Section -->
                    <div class="upload-section">
                        <h4>📤 上传图片</h4>
                        <div class="upload-area" id="image-upload-area">
                            <div class="upload-placeholder">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                    <path d="M21 15l-5-5L5 21"></path>
                                </svg>
                                <p>拖拽图片到此处或点击上传</p>
                                <small>支持 JPG, PNG, WebP 格式，最大 10MB</small>
                            </div>
                            <input type="file" id="image-file-input" accept="image/*" multiple hidden>
                        </div>

                        <div class="upload-progress" id="upload-progress" style="display: none;">
                            <div class="progress-bar">
                                <div class="progress-fill" id="progress-fill"></div>
                            </div>
                            <div class="progress-text" id="progress-text">准备上传...</div>
                        </div>
                    </div>

                    <!-- Image Gallery -->
                    <div class="gallery-section">
                        <h4>🖼️ 图片库</h4>
                        <div class="gallery-controls">
                            <select id="category-filter">
                                <option value="">所有分类</option>
                                <option value="general">通用</option>
                                <option value="posts">文章</option>
                                <option value="avatars">头像</option>
                                <option value="backgrounds">背景</option>
                            </select>
                            <button class="btn btn-secondary" id="refresh-gallery">刷新</button>
                        </div>
                        <div class="image-gallery" id="image-gallery">
                            <div class="gallery-placeholder">
                                <p>暂无图片，请先上传</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', imageManagerHTML);
        this.container = document.getElementById('image-manager');
        this.setupEventListeners();
    }

    /**
     * Setup event listeners
     */
    private setupEventListeners(): void {
        // Upload area click
        const uploadArea = document.getElementById('image-upload-area');
        const fileInput = document.getElementById('image-file-input') as HTMLInputElement;

        uploadArea?.addEventListener('click', () => {
            fileInput.click();
        });

        // File input change
        fileInput?.addEventListener('change', (e) => {
            const files = (e.target as HTMLInputElement).files;
            if (files && files.length > 0) {
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

            const files = e.dataTransfer?.files;
            if (files && files.length > 0) {
                this.handleFileUpload(Array.from(files));
            }
        });

        // Refresh gallery
        document.getElementById('refresh-gallery')?.addEventListener('click', () => {
            this.loadGallery();
        });

        // Category filter
        document.getElementById('category-filter')?.addEventListener('change', () => {
            this.loadGallery();
        });
    }

    /**
     * Handle file upload
     */
    private async handleFileUpload(files: File[]): Promise<void> {
        const progressContainer = document.getElementById('upload-progress');
        const progressFill = document.getElementById('progress-fill');
        const progressText = document.getElementById('progress-text');

        if (progressContainer) progressContainer.style.display = 'block';

        this.uploader.setProgressCallback((progress) => {
            if (progressFill) {
                progressFill.style.width = `${progress.progress}%`;
            }
            if (progressText) {
                progressText.textContent = progress.message;
            }
        });

        try {
            const results = await this.uploader.uploadImages(files);

            // Show results
            const successCount = results.filter(r => r.success).length;
            const failCount = results.length - successCount;

            if (progressText) {
                progressText.textContent = `上传完成：${successCount} 成功，${failCount} 失败`;
            }

            // Refresh gallery
            setTimeout(() => {
                this.loadGallery();
                if (progressContainer) progressContainer.style.display = 'none';
            }, 2000);

        } catch (error) {
            if (progressText) {
                progressText.textContent = `上传失败：${error.message}`;
            }
        }
    }

    /**
     * Load image gallery
     */
    private async loadGallery(): Promise<void> {
        const gallery = document.getElementById('image-gallery');
        const categoryFilter = document.getElementById('category-filter') as HTMLSelectElement;

        if (!gallery) return;

        gallery.innerHTML = '<div class="loading">加载中...</div>';

        try {
            const category = categoryFilter?.value || undefined;
            const images = await this.uploader.listImages(category);

            if (images.length === 0) {
                gallery.innerHTML = '<div class="gallery-placeholder"><p>暂无图片</p></div>';
                return;
            }

            const imageHTML = images.map(image => `
                <div class="gallery-item">
                    <img src="${image.download_url}" alt="${image.name}" loading="lazy">
                    <div class="gallery-item-info">
                        <div class="image-name">${image.name}</div>
                        <div class="image-actions">
                            <button class="btn btn-sm" onclick="navigator.clipboard.writeText('${image.download_url}')">复制链接</button>
                            <button class="btn btn-sm btn-danger" onclick="window.imageManagerUI.deleteImage('${image.name}')">删除</button>
                        </div>
                    </div>
                </div>
            `).join('');

            gallery.innerHTML = imageHTML;

        } catch (error) {
            gallery.innerHTML = `<div class="error">加载失败：${error.message}</div>`;
        }
    }

    /**
     * Delete image
     */
    public async deleteImage(fileName: string): Promise<void> {
        if (!confirm(`确定要删除图片 "${fileName}" 吗？`)) {
            return;
        }

        try {
            const success = await this.uploader.deleteImage(fileName);
            if (success) {
                alert('删除成功');
                this.loadGallery();
            } else {
                alert('删除失败');
            }
        } catch (error) {
            alert(`删除失败：${error.message}`);
        }
    }
}

// Global functions
declare global {
    interface Window {
        GitHubImageUploader: typeof GitHubImageUploader;
        githubImageUploader: GitHubImageUploader;
        imageManagerUI: ImageManagerUI;
        openImageManager: () => void;
    }
}

// Auto-initialize
let githubImageUploader: GitHubImageUploader;
let imageManagerUI: ImageManagerUI;

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        githubImageUploader = new GitHubImageUploader();
        imageManagerUI = new ImageManagerUI(githubImageUploader);

        window.githubImageUploader = githubImageUploader;
        window.imageManagerUI = imageManagerUI;
        window.openImageManager = () => imageManagerUI.openManager();

        console.log('📤 GitHub Image Uploader initialized');
    });
} else {
    githubImageUploader = new GitHubImageUploader();
    imageManagerUI = new ImageManagerUI(githubImageUploader);

    window.githubImageUploader = githubImageUploader;
    window.imageManagerUI = imageManagerUI;
    window.openImageManager = () => imageManagerUI.openManager();

    console.log('📤 GitHub Image Uploader initialized');
}

// Export to global
window.GitHubImageUploader = GitHubImageUploader;

export default GitHubImageUploader;
