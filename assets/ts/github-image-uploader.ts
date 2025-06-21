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

// Global functions
declare global {
    interface Window {
        GitHubImageUploader: typeof GitHubImageUploader;
        githubImageUploader: GitHubImageUploader;
    }
}

// Auto-initialize
let githubImageUploader: GitHubImageUploader;

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        githubImageUploader = new GitHubImageUploader();
        window.githubImageUploader = githubImageUploader;
        console.log('📤 GitHub Image Uploader initialized');
    });
} else {
    githubImageUploader = new GitHubImageUploader();
    window.githubImageUploader = githubImageUploader;
    console.log('📤 GitHub Image Uploader initialized');
}

// Export to global
window.GitHubImageUploader = GitHubImageUploader;

export default GitHubImageUploader;
