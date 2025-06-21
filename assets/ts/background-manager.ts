/*!
*   Hugo Theme Stack - Background Manager
*
*   @author: Alex (Engineer)
*   @project: Hugo Blog Background Management System
*   @description: Complete background image management system for admin users
*/

/**
 * Background style interface
 */
export interface BackgroundStyle {
    id: string;
    name: string;
    type: 'image' | 'gradient' | 'pattern';
    value: string;
    preview?: string;
    category: 'preset' | 'custom' | 'uploaded';
}

/**
 * Background settings interface
 */
export interface BackgroundSettings {
    style: BackgroundStyle;
    opacity: number;
    blur: number;
    position: string;
    size: string;
    repeat: string;
    attachment: string;
}

/**
 * Background Manager Class
 */
export class BackgroundManager {
    private container: HTMLElement;
    private previewArea: HTMLElement;
    private uploadArea: HTMLElement;
    private styleLibrary: HTMLElement;
    private settingsPanel: HTMLElement;
    private currentSettings: BackgroundSettings;
    private presetStyles: BackgroundStyle[] = [];
    private customStyles: BackgroundStyle[] = [];

    constructor() {
        this.initializePresetStyles();
        this.loadCustomStyles();
        this.init();
        this.autoApplyBackground(); // 自动应用保存的背景
    }

    /**
     * Initialize the background manager
     */
    private init(): void {
        console.log('🎨 初始化背景图片管理系统...');
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupInterface();
            });
        } else {
            this.setupInterface();
        }
    }

    /**
     * Setup the background manager interface
     */
    private setupInterface(): void {
        // Wait for admin panel to be available
        const checkAdminPanel = () => {
            const adminPanel = document.getElementById('admin-panel-modal');
            if (adminPanel) {
                this.createBackgroundManagerInterface();
                this.setupEventListeners();
                this.loadCurrentSettings();
                this.bindBackgroundManagerButton();
                console.log('✅ 背景图片管理系统已启用');
            } else {
                // Retry after a short delay
                setTimeout(checkAdminPanel, 500);
            }
        };

        checkAdminPanel();
    }

    /**
     * Create the background manager interface
     */
    private createBackgroundManagerInterface(): void {
        const backgroundManagerHTML = `
            <div class="background-manager" id="background-manager">
                <div class="background-manager-modal">
                    <div class="background-manager-header">
                        <h3>🎨 背景图片管理</h3>
                        <button class="close-btn" id="close-background-manager">×</button>
                    </div>
                
                <div class="background-manager-content">
                    <!-- Upload Area -->
                    <div class="upload-section">
                        <h4>📤 上传背景图片</h4>
                        <div class="upload-area" id="upload-area">
                            <div class="upload-placeholder">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                    <polyline points="7,10 12,15 17,10"></polyline>
                                    <line x1="12" y1="15" x2="12" y2="3"></line>
                                </svg>
                                <p>拖拽图片到此处或点击上传</p>
                                <small>支持 JPG, PNG, WebP 格式，最大 5MB</small>
                            </div>
                            <input type="file" id="background-upload" accept="image/*" hidden>
                        </div>
                    </div>

                    <!-- Preview Area -->
                    <div class="preview-section">
                        <h4>👁️ 实时预览</h4>
                        <div class="preview-area" id="preview-area">
                            <div class="preview-content">
                                <h3>预览效果</h3>
                                <p>这里显示背景效果预览</p>
                            </div>
                        </div>
                    </div>

                    <!-- Style Library -->
                    <div class="style-library-section">
                        <h4>🎭 样式库</h4>
                        <div class="style-tabs">
                            <button class="style-tab active" data-tab="preset">预设样式</button>
                            <button class="style-tab" data-tab="gradient">渐变背景</button>
                            <button class="style-tab" data-tab="pattern">图案纹理</button>
                            <button class="style-tab" data-tab="custom">自定义</button>
                        </div>
                        <div class="style-library" id="style-library">
                            <!-- Styles will be populated here -->
                        </div>
                    </div>

                    <!-- Settings Panel -->
                    <div class="settings-section">
                        <h4>⚙️ 高级设置</h4>
                        <div class="settings-grid">
                            <div class="setting-group">
                                <label for="opacity-slider">透明度</label>
                                <input type="range" id="opacity-slider" min="0" max="100" value="100">
                                <span class="setting-value" id="opacity-value">100%</span>
                            </div>
                            
                            <div class="setting-group">
                                <label for="blur-slider">模糊效果</label>
                                <input type="range" id="blur-slider" min="0" max="20" value="0">
                                <span class="setting-value" id="blur-value">0px</span>
                            </div>
                            
                            <div class="setting-group">
                                <label for="position-select">位置</label>
                                <select id="position-select">
                                    <option value="center">居中</option>
                                    <option value="top">顶部</option>
                                    <option value="bottom">底部</option>
                                    <option value="left">左侧</option>
                                    <option value="right">右侧</option>
                                </select>
                            </div>
                            
                            <div class="setting-group">
                                <label for="size-select">尺寸</label>
                                <select id="size-select">
                                    <option value="cover">覆盖</option>
                                    <option value="contain">包含</option>
                                    <option value="auto">自动</option>
                                    <option value="100% 100%">拉伸</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="action-buttons">
                        <button class="btn btn-primary" id="apply-background">应用背景</button>
                        <button class="btn btn-secondary" id="reset-background">重置</button>
                        <button class="btn btn-secondary" id="save-preset">保存为预设</button>
                    </div>
                    </div>
                </div>
            </div>
        `;

        // Add to body (as a modal)
        document.body.insertAdjacentHTML('beforeend', backgroundManagerHTML);

        // Get references to elements
        this.container = document.getElementById('background-manager') as HTMLElement;
        this.previewArea = document.getElementById('preview-area') as HTMLElement;
        this.uploadArea = document.getElementById('upload-area') as HTMLElement;
        this.styleLibrary = document.getElementById('style-library') as HTMLElement;

        // Initially hide the manager
        if (this.container) {
            this.container.style.display = 'none';
            this.container.style.position = 'fixed';
            this.container.style.top = '0';
            this.container.style.left = '0';
            this.container.style.width = '100%';
            this.container.style.height = '100%';
            this.container.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
            this.container.style.zIndex = '10000';
            this.container.style.overflow = 'auto';
        }
    }

    /**
     * Bind background manager button in admin panel
     */
    private bindBackgroundManagerButton(): void {
        // Try multiple times to find the button
        const tryBindButton = (attempts = 0) => {
            const backgroundBtn = document.getElementById('admin-background-manager');
            if (backgroundBtn) {
                backgroundBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    console.log('🎨 Opening background manager...');
                    this.openManager();
                });
                console.log('✅ Background manager button bound');
            } else if (attempts < 10) {
                // Retry after a delay
                setTimeout(() => tryBindButton(attempts + 1), 500);
            } else {
                console.warn('⚠️ Background manager button not found after multiple attempts');
                // Create a fallback button if needed
                this.createFallbackButton();
            }
        };

        tryBindButton();
    }

    /**
     * Create fallback background manager button
     */
    private createFallbackButton(): void {
        // Add button to admin panel if it doesn't exist
        const adminPanel = document.querySelector('.admin-actions, .admin-content');
        if (adminPanel) {
            const fallbackBtn = document.createElement('button');
            fallbackBtn.id = 'admin-background-manager-fallback';
            fallbackBtn.className = 'admin-action-btn';
            fallbackBtn.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21,15 16,10 5,21"></polyline>
                </svg>
                背景管理
            `;
            fallbackBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('🎨 Opening background manager (fallback)...');
                this.openManager();
            });

            adminPanel.appendChild(fallbackBtn);
            console.log('✅ Fallback background manager button created');
        }
    }

    /**
     * Initialize preset styles
     */
    private initializePresetStyles(): void {
        this.presetStyles = [
            {
                id: 'preset-1',
                name: '清新蓝色',
                type: 'gradient',
                value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                category: 'preset'
            },
            {
                id: 'preset-2',
                name: '温暖橙色',
                type: 'gradient',
                value: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                category: 'preset'
            },
            {
                id: 'preset-3',
                name: '自然绿色',
                type: 'gradient',
                value: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                category: 'preset'
            },
            {
                id: 'preset-4',
                name: '优雅紫色',
                type: 'gradient',
                value: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
                category: 'preset'
            },
            {
                id: 'preset-5',
                name: '深邃夜空',
                type: 'gradient',
                value: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
                category: 'preset'
            },
            {
                id: 'pattern-1',
                name: '几何图案',
                type: 'pattern',
                value: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                category: 'preset'
            },
            {
                id: 'pattern-2',
                name: '波浪纹理',
                type: 'pattern',
                value: 'url("data:image/svg+xml,%3Csvg width="100" height="20" viewBox="0 0 100 20" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M21.184 20c.357-.13.72-.264 1.088-.402l1.768-.661C33.64 15.347 39.647 14 50 14c10.271 0 15.362 1.222 24.629 4.928.955.383 1.869.74 2.75 1.072h6.225c-2.51-.73-5.139-1.691-8.233-2.928C65.888 13.278 60.562 12 50 12c-10.626 0-16.855 1.397-26.66 5.063l-1.767.662c-2.475.923-4.66 1.674-6.724 2.275h6.335zm0-20C13.258 2.892 8.077 4 0 4V2c5.744 0 9.951-.574 14.85-2h6.334zM77.38 0C85.239 2.966 90.502 4 100 4V2c-6.842 0-11.386-.542-16.396-2h-6.225zM0 14c8.44 0 13.718-1.21 22.272-4.402l1.768-.661C33.64 5.347 39.647 4 50 4c10.271 0 15.362 1.222 24.629 4.928C84.112 12.722 89.438 14 100 14v-2c-10.271 0-15.362-1.222-24.629-4.928C65.888 3.278 60.562 2 50 2 39.374 2 33.145 3.397 23.34 7.063l-1.767.662C13.223 10.84 8.163 12 0 12v2z" fill="%239C92AC" fill-opacity="0.05" fill-rule="evenodd"/%3E%3C/svg%3E")',
                category: 'preset'
            }
        ];
    }

    /**
     * Load custom styles from localStorage
     */
    private loadCustomStyles(): void {
        const saved = localStorage.getItem('background-custom-styles');
        if (saved) {
            try {
                this.customStyles = JSON.parse(saved);
            } catch (error) {
                console.warn('Failed to load custom styles:', error);
                this.customStyles = [];
            }
        }
    }

    /**
     * Save custom styles to localStorage
     */
    private saveCustomStyles(): void {
        localStorage.setItem('background-custom-styles', JSON.stringify(this.customStyles));
    }

    /**
     * Load current background settings
     */
    private loadCurrentSettings(): void {
        const saved = localStorage.getItem('background-current-settings');
        if (saved) {
            try {
                this.currentSettings = JSON.parse(saved);
                this.applySettingsToInterface();
            } catch (error) {
                console.warn('Failed to load current settings:', error);
                this.setDefaultSettings();
            }
        } else {
            this.setDefaultSettings();
        }
    }

    /**
     * Set default background settings
     */
    private setDefaultSettings(): void {
        this.currentSettings = {
            style: this.presetStyles[0],
            opacity: 100,
            blur: 0,
            position: 'center',
            size: 'cover',
            repeat: 'no-repeat',
            attachment: 'fixed'
        };
    }

    /**
     * Apply settings to interface controls
     */
    private applySettingsToInterface(): void {
        const opacitySlider = document.getElementById('opacity-slider') as HTMLInputElement;
        const blurSlider = document.getElementById('blur-slider') as HTMLInputElement;
        const positionSelect = document.getElementById('position-select') as HTMLSelectElement;
        const sizeSelect = document.getElementById('size-select') as HTMLSelectElement;

        if (opacitySlider) opacitySlider.value = this.currentSettings.opacity.toString();
        if (blurSlider) blurSlider.value = this.currentSettings.blur.toString();
        if (positionSelect) positionSelect.value = this.currentSettings.position;
        if (sizeSelect) sizeSelect.value = this.currentSettings.size;

        this.updatePreview();
    }

    /**
     * Setup event listeners
     */
    private setupEventListeners(): void {
        // Upload area events
        this.setupUploadEvents();
        
        // Style selection events
        this.setupStyleEvents();
        
        // Settings controls events
        this.setupSettingsEvents();
        
        // Action buttons events
        this.setupActionEvents();
        
        // Tab switching events
        this.setupTabEvents();
    }

    /**
     * Setup upload events
     */
    private setupUploadEvents(): void {
        const uploadArea = this.uploadArea;
        const fileInput = document.getElementById('background-upload') as HTMLInputElement;

        // Click to upload
        uploadArea.addEventListener('click', () => {
            fileInput.click();
        });

        // File input change
        fileInput.addEventListener('change', (e) => {
            const files = (e.target as HTMLInputElement).files;
            if (files && files.length > 0) {
                this.handleFileUpload(files[0]);
            }
        });

        // Drag and drop
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('drag-over');
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('drag-over');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('drag-over');
            
            const files = e.dataTransfer?.files;
            if (files && files.length > 0) {
                this.handleFileUpload(files[0]);
            }
        });
    }

    /**
     * Handle file upload
     */
    private handleFileUpload(file: File): void {
        // Validate file
        if (!file.type.startsWith('image/')) {
            alert('请选择图片文件');
            return;
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB
            alert('文件大小不能超过 5MB');
            return;
        }

        // Read file as data URL
        const reader = new FileReader();
        reader.onload = (e) => {
            const dataUrl = e.target?.result as string;
            
            // Create custom style
            const customStyle: BackgroundStyle = {
                id: `custom-${Date.now()}`,
                name: file.name,
                type: 'image',
                value: `url("${dataUrl}")`,
                category: 'custom'
            };

            // Add to custom styles
            this.customStyles.push(customStyle);
            this.saveCustomStyles();

            // Apply the uploaded image
            this.currentSettings.style = customStyle;
            this.updatePreview();
            this.renderStyleLibrary('custom');

            console.log('✅ 背景图片上传成功');
        };

        reader.readAsDataURL(file);
    }

    /**
     * Setup style selection events
     */
    private setupStyleEvents(): void {
        // Will be set up when rendering style library
    }

    /**
     * Setup settings controls events
     */
    private setupSettingsEvents(): void {
        // Opacity slider
        const opacitySlider = document.getElementById('opacity-slider') as HTMLInputElement;
        const opacityValue = document.getElementById('opacity-value') as HTMLElement;
        
        opacitySlider?.addEventListener('input', (e) => {
            const value = parseInt((e.target as HTMLInputElement).value);
            this.currentSettings.opacity = value;
            opacityValue.textContent = `${value}%`;
            this.updatePreview();
        });

        // Blur slider
        const blurSlider = document.getElementById('blur-slider') as HTMLInputElement;
        const blurValue = document.getElementById('blur-value') as HTMLElement;
        
        blurSlider?.addEventListener('input', (e) => {
            const value = parseInt((e.target as HTMLInputElement).value);
            this.currentSettings.blur = value;
            blurValue.textContent = `${value}px`;
            this.updatePreview();
        });

        // Position select
        const positionSelect = document.getElementById('position-select') as HTMLSelectElement;
        positionSelect?.addEventListener('change', (e) => {
            this.currentSettings.position = (e.target as HTMLSelectElement).value;
            this.updatePreview();
        });

        // Size select
        const sizeSelect = document.getElementById('size-select') as HTMLSelectElement;
        sizeSelect?.addEventListener('change', (e) => {
            this.currentSettings.size = (e.target as HTMLSelectElement).value;
            this.updatePreview();
        });
    }

    /**
     * Setup action button events
     */
    private setupActionEvents(): void {
        // Apply background
        const applyBtn = document.getElementById('apply-background');
        applyBtn?.addEventListener('click', () => {
            this.applyBackground();
        });

        // Reset background
        const resetBtn = document.getElementById('reset-background');
        resetBtn?.addEventListener('click', () => {
            this.resetBackground();
        });

        // Save as preset
        const savePresetBtn = document.getElementById('save-preset');
        savePresetBtn?.addEventListener('click', () => {
            this.saveAsPreset();
        });

        // Close manager
        const closeBtn = document.getElementById('close-background-manager');
        closeBtn?.addEventListener('click', () => {
            this.closeManager();
        });
    }

    /**
     * Setup tab switching events
     */
    private setupTabEvents(): void {
        const tabs = document.querySelectorAll('.style-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                const target = e.target as HTMLElement;
                const tabType = target.getAttribute('data-tab') as string;
                
                // Update active tab
                tabs.forEach(t => t.classList.remove('active'));
                target.classList.add('active');
                
                // Render corresponding style library
                this.renderStyleLibrary(tabType);
            });
        });

        // Render initial tab
        this.renderStyleLibrary('preset');
    }

    /**
     * Render style library based on tab
     */
    private renderStyleLibrary(tabType: string): void {
        let styles: BackgroundStyle[] = [];
        
        switch (tabType) {
            case 'preset':
                styles = this.presetStyles.filter(s => s.type !== 'pattern');
                break;
            case 'gradient':
                styles = this.presetStyles.filter(s => s.type === 'gradient');
                break;
            case 'pattern':
                styles = this.presetStyles.filter(s => s.type === 'pattern');
                break;
            case 'custom':
                styles = this.customStyles;
                break;
        }

        const html = styles.map(style => `
            <div class="style-item" data-style-id="${style.id}">
                <div class="style-preview" style="background: ${style.value}; background-size: cover;"></div>
                <div class="style-name">${style.name}</div>
                ${style.category === 'custom' ? '<button class="delete-style" data-style-id="' + style.id + '">×</button>' : ''}
            </div>
        `).join('');

        this.styleLibrary.innerHTML = html;

        // Add click events to style items
        const styleItems = this.styleLibrary.querySelectorAll('.style-item');
        styleItems.forEach(item => {
            item.addEventListener('click', (e) => {
                if ((e.target as HTMLElement).classList.contains('delete-style')) {
                    return; // Handle delete separately
                }
                
                const styleId = item.getAttribute('data-style-id');
                const style = styles.find(s => s.id === styleId);
                if (style) {
                    this.currentSettings.style = style;
                    this.updatePreview();
                    
                    // Update active style
                    styleItems.forEach(si => si.classList.remove('active'));
                    item.classList.add('active');
                }
            });
        });

        // Add delete events for custom styles
        const deleteButtons = this.styleLibrary.querySelectorAll('.delete-style');
        deleteButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const styleId = btn.getAttribute('data-style-id');
                this.deleteCustomStyle(styleId);
            });
        });
    }

    /**
     * Delete custom style
     */
    private deleteCustomStyle(styleId: string): void {
        this.customStyles = this.customStyles.filter(s => s.id !== styleId);
        this.saveCustomStyles();
        this.renderStyleLibrary('custom');
        
        // If deleted style was current, reset to default
        if (this.currentSettings.style.id === styleId) {
            this.setDefaultSettings();
            this.applySettingsToInterface();
        }
    }

    /**
     * Update preview area
     */
    private updatePreview(): void {
        if (!this.previewArea) return;

        const { style, opacity, blur, position, size } = this.currentSettings;
        
        const backgroundStyle = `
            background: ${style.value};
            background-position: ${position};
            background-size: ${size};
            background-repeat: no-repeat;
            background-attachment: fixed;
            opacity: ${opacity / 100};
            filter: blur(${blur}px);
        `;

        this.previewArea.style.cssText = backgroundStyle;
    }

    /**
     * Apply background to the website
     */
    private applyBackground(): void {
        const { style, opacity, blur, position, size } = this.currentSettings;
        
        // Apply to body
        document.body.style.background = style.value;
        document.body.style.backgroundPosition = position;
        document.body.style.backgroundSize = size;
        document.body.style.backgroundRepeat = 'no-repeat';
        document.body.style.backgroundAttachment = 'fixed';
        
        // Create overlay for opacity and blur if needed
        let overlay = document.getElementById('background-overlay');
        if (opacity < 100 || blur > 0) {
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.id = 'background-overlay';
                overlay.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                    z-index: -1;
                `;
                document.body.appendChild(overlay);
            }
            
            overlay.style.background = style.value;
            overlay.style.backgroundPosition = position;
            overlay.style.backgroundSize = size;
            overlay.style.backgroundRepeat = 'no-repeat';
            overlay.style.backgroundAttachment = 'fixed';
            overlay.style.opacity = (opacity / 100).toString();
            overlay.style.filter = `blur(${blur}px)`;
            
            // Clear body background
            document.body.style.background = 'transparent';
        } else if (overlay) {
            overlay.remove();
        }

        // Save current settings
        localStorage.setItem('background-current-settings', JSON.stringify(this.currentSettings));
        
        console.log('✅ 背景已应用');
        
        // Show success message
        this.showMessage('背景已成功应用！', 'success');
    }

    /**
     * Reset background to default
     */
    private resetBackground(): void {
        // Clear body styles
        document.body.style.background = '';
        document.body.style.backgroundPosition = '';
        document.body.style.backgroundSize = '';
        document.body.style.backgroundRepeat = '';
        document.body.style.backgroundAttachment = '';
        
        // Remove overlay
        const overlay = document.getElementById('background-overlay');
        if (overlay) {
            overlay.remove();
        }

        // Reset settings
        this.setDefaultSettings();
        this.applySettingsToInterface();
        
        // Clear saved settings
        localStorage.removeItem('background-current-settings');
        
        console.log('✅ 背景已重置');
        this.showMessage('背景已重置为默认设置', 'info');
    }

    /**
     * Save current settings as preset
     */
    private saveAsPreset(): void {
        const name = prompt('请输入预设名称:');
        if (!name) return;

        const preset: BackgroundStyle = {
            id: `preset-custom-${Date.now()}`,
            name: name,
            type: this.currentSettings.style.type,
            value: this.currentSettings.style.value,
            category: 'custom'
        };

        this.customStyles.push(preset);
        this.saveCustomStyles();
        this.renderStyleLibrary('custom');
        
        console.log('✅ 预设已保存');
        this.showMessage(`预设 "${name}" 已保存`, 'success');
    }

    /**
     * Close background manager
     */
    private closeManager(): void {
        if (this.container) {
            this.container.style.display = 'none';
        }
    }

    /**
     * Open background manager
     */
    public openManager(): void {
        if (this.container) {
            this.container.style.display = 'flex';
            this.container.style.alignItems = 'center';
            this.container.style.justifyContent = 'center';

            // Load current settings and render library
            this.loadCurrentSettings();
            this.renderStyleLibrary('preset');

            console.log('✅ Background manager opened');
        }
    }

    /**
     * Show message to user
     */
    private showMessage(message: string, type: 'success' | 'error' | 'info' = 'info'): void {
        const messageEl = document.createElement('div');
        messageEl.className = `background-message ${type}`;
        messageEl.textContent = message;
        messageEl.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: var(--accent-color);
            color: white;
            border-radius: 6px;
            box-shadow: var(--shadow-l2);
            z-index: 10000;
            opacity: 0;
            transform: translateX(100px);
            transition: all 0.3s ease;
        `;

        if (type === 'error') {
            messageEl.style.background = '#ef4444';
        } else if (type === 'success') {
            messageEl.style.background = '#10b981';
        }

        document.body.appendChild(messageEl);

        // Animate in
        setTimeout(() => {
            messageEl.style.opacity = '1';
            messageEl.style.transform = 'translateX(0)';
        }, 10);

        // Remove after 3 seconds
        setTimeout(() => {
            messageEl.style.opacity = '0';
            messageEl.style.transform = 'translateX(100px)';
            setTimeout(() => {
                if (messageEl.parentElement) {
                    messageEl.parentElement.removeChild(messageEl);
                }
            }, 300);
        }, 3000);
    }

    /**
     * Get current settings
     */
    public getCurrentSettings(): BackgroundSettings {
        return { ...this.currentSettings };
    }

    /**
     * Set settings programmatically
     */
    public setSettings(settings: Partial<BackgroundSettings>): void {
        this.currentSettings = { ...this.currentSettings, ...settings };
        this.applySettingsToInterface();
        this.updatePreview();
    }

    /**
     * Auto-apply saved background on page load
     */
    private autoApplyBackground(): void {
        const saved = localStorage.getItem('background-current-settings');
        if (saved) {
            try {
                const settings = JSON.parse(saved);
                this.currentSettings = settings;

                // Apply background immediately
                const { style, opacity, blur, position, size } = settings;

                console.log('🎨 恢复背景设置:', {
                    styleType: style.type,
                    styleName: style.name,
                    styleValue: style.value.substring(0, 50) + '...',
                    opacity,
                    blur
                });

                // Validate style value for custom images
                if (style.type === 'image' && style.value.startsWith('url("data:')) {
                    // Custom uploaded image - ensure data URL is valid
                    const dataUrl = style.value.match(/url\("([^"]+)"\)/)?.[1];
                    if (dataUrl && dataUrl.startsWith('data:image/')) {
                        console.log('✅ 自定义图片背景数据有效');

                        // Ensure custom style is in customStyles array for management
                        const existingCustom = this.customStyles.find(s => s.id === style.id);
                        if (!existingCustom && style.category === 'custom') {
                            console.log('🔄 添加当前自定义背景到样式库');
                            this.customStyles.push(style);
                            this.saveCustomStyles();
                        }
                    } else {
                        console.warn('⚠️ 自定义图片背景数据可能损坏');
                    }
                }

                // Apply to body
                document.body.style.background = style.value;
                document.body.style.backgroundPosition = position;
                document.body.style.backgroundSize = size;
                document.body.style.backgroundRepeat = 'no-repeat';
                document.body.style.backgroundAttachment = 'fixed';

                // Create overlay for opacity and blur if needed
                if (opacity < 100 || blur > 0) {
                    const overlay = document.createElement('div');
                    overlay.id = 'background-overlay';
                    overlay.style.cssText = `
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        pointer-events: none;
                        z-index: -1;
                        background: ${style.value};
                        background-position: ${position};
                        background-size: ${size};
                        background-repeat: no-repeat;
                        background-attachment: fixed;
                        opacity: ${opacity / 100};
                        filter: blur(${blur}px);
                    `;
                    document.body.appendChild(overlay);

                    // Clear body background
                    document.body.style.background = 'transparent';
                }

                console.log('✅ 自动应用保存的背景设置 - 包括自定义背景');
            } catch (error) {
                console.warn('Failed to auto-apply background:', error);
                // Clear corrupted settings
                localStorage.removeItem('background-current-settings');
            }
        }
    }
}

// Global functions
declare global {
    interface Window {
        BackgroundManager: typeof BackgroundManager;
        backgroundManager: BackgroundManager;
        openBackgroundManager: () => void;
    }
}

// Auto-initialize
const backgroundManager = new BackgroundManager();

// Export to global
window.BackgroundManager = BackgroundManager;
window.backgroundManager = backgroundManager;
window.openBackgroundManager = () => backgroundManager.openManager();

export default BackgroundManager;
