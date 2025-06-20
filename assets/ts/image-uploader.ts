/*!
*   Hugo Theme Stack - Image Uploader Component
*
*   @author: Alex (Engineer)
*   @project: Hugo Blog Image Management
*   @description: Interactive image upload component with drag-and-drop support
*/

import { imageManager, ImageManager, ImageMetadata, ImageUploadOptions } from './image-manager.js';

/**
 * Image Upload Component
 * Provides drag-and-drop image upload interface
 */
export class ImageUploader {
    private container: HTMLElement;
    private fileInput: HTMLInputElement;
    private dropZone: HTMLElement;
    private progressBar: HTMLElement;
    private statusMessage: HTMLElement;
    private previewContainer: HTMLElement;
    private uploadButton: HTMLElement;
    private manager: ImageManager;
    private isUploading: boolean = false;

    constructor(containerId: string, manager?: ImageManager) {
        const container = document.getElementById(containerId);
        if (!container) {
            throw new Error(`Container element with id "${containerId}" not found`);
        }
        
        this.container = container;
        this.manager = manager || imageManager;
        this.init();
    }

    /**
     * Initialize the uploader component
     */
    private init(): void {
        this.createHTML();
        this.bindEvents();
        this.setupDragAndDrop();
    }

    /**
     * Create HTML structure
     */
    private createHTML(): void {
        this.container.innerHTML = `
            <div class="image-uploader">
                <div class="upload-header">
                    <h3>📸 图片上传</h3>
                    <p>支持拖拽上传或点击选择文件</p>
                </div>
                
                <div class="drop-zone" id="dropZone">
                    <div class="drop-zone-content">
                        <div class="upload-icon">📁</div>
                        <p class="drop-text">拖拽图片到此处或点击上传</p>
                        <p class="file-info">支持 JPG, PNG, GIF, WebP 格式，最大 10MB</p>
                        <button class="upload-btn" id="uploadBtn">选择图片</button>
                    </div>
                </div>
                
                <input type="file" id="fileInput" accept="image/*" multiple style="display: none;">
                
                <div class="upload-progress" id="uploadProgress" style="display: none;">
                    <div class="progress-bar">
                        <div class="progress-fill" id="progressFill"></div>
                    </div>
                    <div class="status-message" id="statusMessage">准备上传...</div>
                </div>
                
                <div class="preview-container" id="previewContainer"></div>
                
                <div class="upload-options" style="display: none;">
                    <h4>上传选项</h4>
                    <div class="option-group">
                        <label>
                            <input type="checkbox" id="compressImage" checked>
                            压缩图片 (推荐)
                        </label>
                    </div>
                    <div class="option-group">
                        <label>
                            图片质量:
                            <input type="range" id="qualitySlider" min="0.1" max="1" step="0.1" value="0.85">
                            <span id="qualityValue">85%</span>
                        </label>
                    </div>
                    <div class="option-group">
                        <label>
                            文件夹:
                            <input type="text" id="folderInput" placeholder="留空使用默认日期文件夹">
                        </label>
                    </div>
                </div>
            </div>
        `;

        // Get references to elements
        this.dropZone = this.container.querySelector('#dropZone') as HTMLElement;
        this.fileInput = this.container.querySelector('#fileInput') as HTMLInputElement;
        this.progressBar = this.container.querySelector('#uploadProgress') as HTMLElement;
        this.statusMessage = this.container.querySelector('#statusMessage') as HTMLElement;
        this.previewContainer = this.container.querySelector('#previewContainer') as HTMLElement;
        this.uploadButton = this.container.querySelector('#uploadBtn') as HTMLElement;
    }

    /**
     * Bind event listeners
     */
    private bindEvents(): void {
        // Upload button click
        this.uploadButton.addEventListener('click', () => {
            this.fileInput.click();
        });

        // File input change
        this.fileInput.addEventListener('change', (e) => {
            const files = (e.target as HTMLInputElement).files;
            if (files && files.length > 0) {
                this.handleFiles(Array.from(files));
            }
        });

        // Quality slider
        const qualitySlider = this.container.querySelector('#qualitySlider') as HTMLInputElement;
        const qualityValue = this.container.querySelector('#qualityValue') as HTMLElement;
        
        qualitySlider?.addEventListener('input', (e) => {
            const value = (e.target as HTMLInputElement).value;
            qualityValue.textContent = `${Math.round(parseFloat(value) * 100)}%`;
        });

        // Listen for image management events
        window.addEventListener('image-management', (e: CustomEvent) => {
            this.handleImageEvent(e.detail);
        });
    }

    /**
     * Setup drag and drop functionality
     */
    private setupDragAndDrop(): void {
        // Prevent default drag behaviors
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            this.dropZone.addEventListener(eventName, this.preventDefaults, false);
            document.body.addEventListener(eventName, this.preventDefaults, false);
        });

        // Highlight drop zone when item is dragged over it
        ['dragenter', 'dragover'].forEach(eventName => {
            this.dropZone.addEventListener(eventName, () => {
                this.dropZone.classList.add('drag-over');
            }, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            this.dropZone.addEventListener(eventName, () => {
                this.dropZone.classList.remove('drag-over');
            }, false);
        });

        // Handle dropped files
        this.dropZone.addEventListener('drop', (e) => {
            const dt = e.dataTransfer;
            const files = dt?.files;
            
            if (files && files.length > 0) {
                this.handleFiles(Array.from(files));
            }
        }, false);
    }

    /**
     * Prevent default drag behaviors
     */
    private preventDefaults(e: Event): void {
        e.preventDefault();
        e.stopPropagation();
    }

    /**
     * Handle selected/dropped files
     */
    private async handleFiles(files: File[]): Promise<void> {
        if (this.isUploading) {
            this.showMessage('正在上传中，请等待...', 'warning');
            return;
        }

        // Filter image files
        const imageFiles = files.filter(file => file.type.startsWith('image/'));
        
        if (imageFiles.length === 0) {
            this.showMessage('请选择有效的图片文件', 'error');
            return;
        }

        if (imageFiles.length !== files.length) {
            this.showMessage(`已过滤 ${files.length - imageFiles.length} 个非图片文件`, 'warning');
        }

        // Show preview
        this.showPreview(imageFiles);

        // Upload files
        await this.uploadFiles(imageFiles);
    }

    /**
     * Show file preview
     */
    private showPreview(files: File[]): void {
        this.previewContainer.innerHTML = '';
        
        files.forEach((file, index) => {
            const previewItem = document.createElement('div');
            previewItem.className = 'preview-item';
            
            const img = document.createElement('img');
            img.src = URL.createObjectURL(file);
            img.alt = file.name;
            
            const info = document.createElement('div');
            info.className = 'preview-info';
            info.innerHTML = `
                <div class="file-name">${file.name}</div>
                <div class="file-size">${this.formatFileSize(file.size)}</div>
            `;
            
            previewItem.appendChild(img);
            previewItem.appendChild(info);
            this.previewContainer.appendChild(previewItem);
        });
    }

    /**
     * Upload files to repository
     */
    private async uploadFiles(files: File[]): Promise<void> {
        this.isUploading = true;
        this.showProgress();
        
        const results: (ImageMetadata | Error)[] = [];
        
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            
            try {
                this.updateProgress(
                    (i / files.length) * 100,
                    `上传 ${file.name} (${i + 1}/${files.length})`
                );

                const options = this.getUploadOptions();
                
                const metadata = await this.manager.uploadImage(
                    file,
                    options,
                    (progress) => {
                        const overallProgress = ((i + progress.percentage / 100) / files.length) * 100;
                        this.updateProgress(overallProgress, progress.message);
                    }
                );
                
                results.push(metadata);
                
            } catch (error) {
                console.error(`Failed to upload ${file.name}:`, error);
                results.push(error as Error);
            }
        }
        
        this.isUploading = false;
        this.hideProgress();
        this.showResults(results);
    }

    /**
     * Get upload options from UI
     */
    private getUploadOptions(): ImageUploadOptions {
        const compressImage = (this.container.querySelector('#compressImage') as HTMLInputElement)?.checked;
        const quality = parseFloat((this.container.querySelector('#qualitySlider') as HTMLInputElement)?.value || '0.85');
        const folder = (this.container.querySelector('#folderInput') as HTMLInputElement)?.value.trim();
        
        return {
            quality: compressImage ? quality : 1.0,
            folder: folder || undefined,
            maxWidth: compressImage ? 1920 : undefined,
            maxHeight: compressImage ? 1080 : undefined
        };
    }

    /**
     * Show upload progress
     */
    private showProgress(): void {
        this.progressBar.style.display = 'block';
        this.dropZone.style.display = 'none';
    }

    /**
     * Hide upload progress
     */
    private hideProgress(): void {
        this.progressBar.style.display = 'none';
        this.dropZone.style.display = 'block';
    }

    /**
     * Update progress bar
     */
    private updateProgress(percentage: number, message: string): void {
        const progressFill = this.container.querySelector('#progressFill') as HTMLElement;
        if (progressFill) {
            progressFill.style.width = `${percentage}%`;
        }
        this.statusMessage.textContent = message;
    }

    /**
     * Show upload results
     */
    private showResults(results: (ImageMetadata | Error)[]): void {
        const successful = results.filter(r => !(r instanceof Error)) as ImageMetadata[];
        const failed = results.filter(r => r instanceof Error) as Error[];
        
        let message = '';
        let type: 'success' | 'error' | 'warning' = 'success';
        
        if (successful.length > 0 && failed.length === 0) {
            message = `成功上传 ${successful.length} 张图片`;
            type = 'success';
        } else if (successful.length > 0 && failed.length > 0) {
            message = `成功上传 ${successful.length} 张图片，${failed.length} 张失败`;
            type = 'warning';
        } else {
            message = `上传失败：${failed[0]?.message || '未知错误'}`;
            type = 'error';
        }
        
        this.showMessage(message, type);
        
        // Show successful uploads
        if (successful.length > 0) {
            this.showUploadedImages(successful);
        }
        
        // Clear preview
        this.previewContainer.innerHTML = '';
        this.fileInput.value = '';
    }

    /**
     * Show uploaded images with CDN links
     */
    private showUploadedImages(images: ImageMetadata[]): void {
        const resultsContainer = document.createElement('div');
        resultsContainer.className = 'upload-results';
        resultsContainer.innerHTML = '<h4>上传成功的图片</h4>';
        
        images.forEach(image => {
            const imageItem = document.createElement('div');
            imageItem.className = 'uploaded-image-item';
            imageItem.innerHTML = `
                <div class="uploaded-image-preview">
                    <img src="${image.thumbnailUrl || image.cdnUrl}" alt="${image.name}">
                </div>
                <div class="uploaded-image-info">
                    <div class="image-name">${image.name}</div>
                    <div class="image-size">${this.formatFileSize(image.size)}</div>
                    <div class="image-links">
                        <input type="text" value="${image.cdnUrl}" readonly class="cdn-link">
                        <button onclick="navigator.clipboard.writeText('${image.cdnUrl}')">复制链接</button>
                    </div>
                </div>
            `;
            resultsContainer.appendChild(imageItem);
        });
        
        this.previewContainer.appendChild(resultsContainer);
    }

    /**
     * Show status message
     */
    private showMessage(message: string, type: 'success' | 'error' | 'warning'): void {
        // Create or update message element
        let messageEl = this.container.querySelector('.status-message-global') as HTMLElement;
        if (!messageEl) {
            messageEl = document.createElement('div');
            messageEl.className = 'status-message-global';
            this.container.appendChild(messageEl);
        }
        
        messageEl.textContent = message;
        messageEl.className = `status-message-global ${type}`;
        
        // Auto hide after 5 seconds
        setTimeout(() => {
            messageEl.style.display = 'none';
        }, 5000);
    }

    /**
     * Handle image management events
     */
    private handleImageEvent(detail: any): void {
        if (detail.type === 'image-uploaded') {
            console.log('Image uploaded successfully:', detail.data);
        } else if (detail.type === 'image-upload-error') {
            console.error('Image upload error:', detail.data);
        }
    }

    /**
     * Format file size for display
     */
    private formatFileSize(bytes: number): string {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}

// Auto-initialize if container exists
document.addEventListener('DOMContentLoaded', () => {
    const uploaderContainer = document.getElementById('image-uploader-container');
    if (uploaderContainer) {
        new ImageUploader('image-uploader-container');
    }
});
