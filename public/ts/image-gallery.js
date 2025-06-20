(() => {
  // ns-hugo-imp:C:\Users\16643\Desktop\blog\hugo\blog\assets\ts\github-auth.ts
  var GitHubTokenManager = class {
    storageKey = "github_token_info";
    encryptionKey = "github_blog_integration";
    tokenInfo = null;
    constructor() {
      this.loadTokenFromStorage();
    }
    /**
     * Store GitHub token securely
     */
    setToken(token, type = "personal", scopes) {
      const tokenInfo = {
        token: this.encryptToken(token),
        type,
        scopes,
        createdAt: /* @__PURE__ */ new Date(),
        lastUsed: /* @__PURE__ */ new Date()
      };
      this.tokenInfo = tokenInfo;
      this.saveTokenToStorage();
      this.dispatchEvent("auth", "token_stored", { type, scopes });
    }
    /**
     * Get stored GitHub token
     */
    getToken() {
      if (!this.tokenInfo) {
        return null;
      }
      this.tokenInfo.lastUsed = /* @__PURE__ */ new Date();
      this.saveTokenToStorage();
      return this.decryptToken(this.tokenInfo.token);
    }
    /**
     * Check if token exists
     */
    hasToken() {
      return this.tokenInfo !== null && this.tokenInfo.token.length > 0;
    }
    /**
     * Get token information (without the actual token)
     */
    getTokenInfo() {
      if (!this.tokenInfo) {
        return null;
      }
      const { token, ...info } = this.tokenInfo;
      return info;
    }
    /**
     * Clear stored token
     */
    clearToken() {
      this.tokenInfo = null;
      localStorage.removeItem(this.storageKey);
      this.dispatchEvent("auth", "token_cleared");
    }
    /**
     * Validate token with GitHub API
     */
    async validateToken() {
      const token = this.getToken();
      if (!token) {
        return {
          valid: false,
          error: "No token available"
        };
      }
      try {
        const response = await fetch("https://api.github.com/user", {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/vnd.github.v3+json",
            "User-Agent": "Hugo-Blog-Integration/1.0"
          }
        });
        if (!response.ok) {
          throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
        }
        const user = await response.json();
        const scopes = response.headers.get("X-OAuth-Scopes")?.split(", ") || [];
        const rateLimit = {
          limit: parseInt(response.headers.get("X-RateLimit-Limit") || "0"),
          remaining: parseInt(response.headers.get("X-RateLimit-Remaining") || "0"),
          reset: parseInt(response.headers.get("X-RateLimit-Reset") || "0"),
          used: parseInt(response.headers.get("X-RateLimit-Used") || "0"),
          resource: "core"
        };
        this.dispatchEvent("auth", "token_validated", { user, scopes, rateLimit });
        return {
          valid: true,
          user,
          scopes,
          rateLimit
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        this.dispatchEvent("auth", "token_validation_failed", { error: errorMessage });
        return {
          valid: false,
          error: errorMessage
        };
      }
    }
    /**
     * Check if token has required scopes
     */
    hasRequiredScopes(requiredScopes) {
      if (!this.tokenInfo?.scopes) {
        return false;
      }
      return requiredScopes.every(
        (scope) => this.tokenInfo.scopes.includes(scope)
      );
    }
    /**
     * Simple encryption for token storage
     * Note: This is basic obfuscation, not cryptographically secure
     */
    encryptToken(token) {
      let encrypted = "";
      for (let i = 0; i < token.length; i++) {
        const charCode = token.charCodeAt(i) ^ this.encryptionKey.charCodeAt(i % this.encryptionKey.length);
        encrypted += String.fromCharCode(charCode);
      }
      return btoa(encrypted);
    }
    /**
     * Decrypt token from storage
     */
    decryptToken(encryptedToken) {
      try {
        const encrypted = atob(encryptedToken);
        let decrypted = "";
        for (let i = 0; i < encrypted.length; i++) {
          const charCode = encrypted.charCodeAt(i) ^ this.encryptionKey.charCodeAt(i % this.encryptionKey.length);
          decrypted += String.fromCharCode(charCode);
        }
        return decrypted;
      } catch (error) {
        console.error("Failed to decrypt token:", error);
        return "";
      }
    }
    /**
     * Save token to localStorage
     */
    saveTokenToStorage() {
      if (this.tokenInfo) {
        try {
          const serialized = JSON.stringify({
            ...this.tokenInfo,
            createdAt: this.tokenInfo.createdAt.toISOString(),
            lastUsed: this.tokenInfo.lastUsed?.toISOString(),
            expiresAt: this.tokenInfo.expiresAt?.toISOString()
          });
          localStorage.setItem(this.storageKey, serialized);
        } catch (error) {
          console.error("Failed to save token to storage:", error);
        }
      }
    }
    /**
     * Load token from localStorage
     */
    loadTokenFromStorage() {
      try {
        const stored = localStorage.getItem(this.storageKey);
        if (stored) {
          const parsed = JSON.parse(stored);
          this.tokenInfo = {
            ...parsed,
            createdAt: new Date(parsed.createdAt),
            lastUsed: parsed.lastUsed ? new Date(parsed.lastUsed) : void 0,
            expiresAt: parsed.expiresAt ? new Date(parsed.expiresAt) : void 0
          };
        }
      } catch (error) {
        console.error("Failed to load token from storage:", error);
        this.clearToken();
      }
    }
    /**
     * Dispatch GitHub integration events
     */
    dispatchEvent(type, action, data) {
      const event = new CustomEvent("github-integration", {
        detail: {
          type,
          action,
          data,
          timestamp: Date.now()
        }
      });
      window.dispatchEvent(event);
    }
  };
  var githubTokenManager = new GitHubTokenManager();

  // ns-hugo-imp:C:\Users\16643\Desktop\blog\hugo\blog\assets\ts\github-api.ts
  var GitHubRateLimiter = class {
    rateLimitInfo = null;
    requestQueue = [];
    isProcessingQueue = false;
    /**
     * Update rate limit information from API response
     */
    updateRateLimit(headers) {
      this.rateLimitInfo = {
        limit: parseInt(headers["x-ratelimit-limit"] || "0"),
        remaining: parseInt(headers["x-ratelimit-remaining"] || "0"),
        reset: parseInt(headers["x-ratelimit-reset"] || "0"),
        used: parseInt(headers["x-ratelimit-used"] || "0"),
        resource: headers["x-ratelimit-resource"] || "core"
      };
    }
    /**
     * Check if we can make a request now
     */
    canMakeRequest() {
      if (!this.rateLimitInfo) {
        return true;
      }
      return this.rateLimitInfo.remaining > 0;
    }
    /**
     * Get time until rate limit reset (in milliseconds)
     */
    getTimeUntilReset() {
      if (!this.rateLimitInfo) {
        return 0;
      }
      const resetTime = this.rateLimitInfo.reset * 1e3;
      const currentTime = Date.now();
      return Math.max(0, resetTime - currentTime);
    }
    /**
     * Wait for rate limit reset if necessary
     */
    async waitForRateLimit() {
      if (this.canMakeRequest()) {
        return;
      }
      const waitTime = this.getTimeUntilReset();
      if (waitTime > 0) {
        console.log(`Rate limit exceeded. Waiting ${Math.ceil(waitTime / 1e3)} seconds...`);
        await new Promise((resolve) => setTimeout(resolve, waitTime + 1e3));
      }
    }
    /**
     * Add request to queue if rate limited
     */
    async queueRequest(requestFn) {
      return new Promise((resolve, reject) => {
        this.requestQueue.push(async () => {
          try {
            await this.waitForRateLimit();
            const result = await requestFn();
            resolve(result);
          } catch (error) {
            reject(error);
          }
        });
        this.processQueue();
      });
    }
    /**
     * Process queued requests
     */
    async processQueue() {
      if (this.isProcessingQueue || this.requestQueue.length === 0) {
        return;
      }
      this.isProcessingQueue = true;
      while (this.requestQueue.length > 0) {
        const request = this.requestQueue.shift();
        if (request) {
          await request();
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      }
      this.isProcessingQueue = false;
    }
    /**
     * Get current rate limit status
     */
    getRateLimitStatus() {
      return this.rateLimitInfo;
    }
  };
  var GitHubErrorHandler = class {
    /**
     * Create standardized GitHub API error
     */
    static createError(status, message, response, headers) {
      const error = new Error(message);
      error.name = "GitHubAPIError";
      error.status = status;
      error.response = response;
      error.headers = headers;
      return error;
    }
    /**
     * Handle API response errors
     */
    static async handleResponse(response) {
      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = { message: response.statusText };
        }
        const headers = {};
        response.headers.forEach((value, key) => {
          headers[key] = value;
        });
        throw this.createError(
          response.status,
          errorData.message || `HTTP ${response.status}: ${response.statusText}`,
          errorData,
          headers
        );
      }
    }
    /**
     * Determine if error is retryable
     */
    static isRetryableError(error) {
      return error.status >= 500 || // Server errors
      error.status === 429 || // Rate limit
      error.status === 408 || // Request timeout
      error.status === 502 || // Bad gateway
      error.status === 503 || // Service unavailable
      error.status === 504;
    }
  };
  var GitHubAPI = class {
    config;
    tokenManager;
    rateLimiter;
    baseUrl;
    constructor(config, tokenManager) {
      this.config = {
        token: "",
        owner: "",
        repo: "",
        branch: "main",
        baseUrl: "https://api.github.com",
        timeout: 3e4,
        retryAttempts: 3,
        retryDelay: 1e3,
        ...config
      };
      this.tokenManager = tokenManager || githubTokenManager;
      this.rateLimiter = new GitHubRateLimiter();
      this.baseUrl = this.config.baseUrl;
    }
    /**
     * Make authenticated API request
     */
    async request(endpoint, options = {}) {
      const token = this.config.token || this.tokenManager.getToken();
      if (!token) {
        throw GitHubErrorHandler.createError(401, "No GitHub token available");
      }
      const url = endpoint.startsWith("http") ? endpoint : `${this.baseUrl}${endpoint}`;
      const requestOptions = {
        method: options.method || "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/vnd.github.v3+json",
          "User-Agent": "Hugo-Blog-Integration/1.0",
          "Content-Type": "application/json",
          ...options.headers
        },
        body: options.body,
        signal: AbortSignal.timeout(options.timeout || this.config.timeout)
      };
      return this.rateLimiter.queueRequest(async () => {
        return this.executeRequestWithRetry(url, requestOptions, options.retries || this.config.retryAttempts);
      });
    }
    /**
     * Execute request with retry logic
     */
    async executeRequestWithRetry(url, options, maxRetries) {
      let lastError = null;
      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
          const response = await fetch(url, options);
          const headers = {};
          response.headers.forEach((value, key) => {
            headers[key] = value;
          });
          this.rateLimiter.updateRateLimit(headers);
          await GitHubErrorHandler.handleResponse(response);
          const data = await response.json();
          this.dispatchEvent("api", "request_success", {
            url,
            method: options.method,
            status: response.status
          });
          return {
            data,
            status: response.status,
            headers,
            rateLimit: this.rateLimiter.getRateLimitStatus() || void 0
          };
        } catch (error) {
          lastError = error;
          if (!GitHubErrorHandler.isRetryableError(lastError) || attempt === maxRetries) {
            break;
          }
          const delay = this.config.retryDelay * Math.pow(2, attempt);
          await new Promise((resolve) => setTimeout(resolve, delay));
          console.log(`Request failed, retrying in ${delay}ms... (attempt ${attempt + 1}/${maxRetries + 1})`);
        }
      }
      this.dispatchEvent("error", "request_failed", {
        url,
        method: options.method,
        error: lastError?.message,
        status: lastError?.status
      });
      throw lastError;
    }
    /**
     * Get authenticated user information
     */
    async getUser() {
      return this.request("/user");
    }
    /**
     * Get repository information
     */
    async getRepository(owner, repo) {
      const repoOwner = owner || this.config.owner;
      const repoName = repo || this.config.repo;
      return this.request(`/repos/${repoOwner}/${repoName}`);
    }
    /**
     * Get file content from repository
     */
    async getFileContent(path, options = {}) {
      const owner = options.owner || this.config.owner;
      const repo = options.repo || this.config.repo;
      const ref = options.ref || this.config.branch;
      const endpoint = `/repos/${owner}/${repo}/contents/${path}${ref ? `?ref=${ref}` : ""}`;
      return this.request(endpoint);
    }
    /**
     * Create or update file in repository
     */
    async createOrUpdateFile(path, content, message, options = {}) {
      try {
        const owner = options.owner || this.config.owner;
        const repo = options.repo || this.config.repo;
        const branch = options.branch || this.config.branch;
        const encoding = options.encoding || "utf-8";
        const encodedContent = encoding === "base64" ? content : btoa(unescape(encodeURIComponent(content)));
        const requestBody = {
          message,
          content: encodedContent,
          branch,
          ...options.sha && { sha: options.sha }
        };
        const endpoint = `/repos/${owner}/${repo}/contents/${path}`;
        const method = options.sha ? "PUT" : "PUT";
        const response = await this.request(endpoint, {
          method,
          body: JSON.stringify(requestBody)
        });
        this.dispatchEvent("api", "file_operation_success", {
          operation: options.sha ? "update" : "create",
          path,
          sha: response.data.content?.sha
        });
        return {
          success: true,
          sha: response.data.content?.sha,
          url: response.data.content?.html_url,
          content: response.data.content,
          commit: response.data.commit
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        this.dispatchEvent("error", "file_operation_failed", {
          operation: options.sha ? "update" : "create",
          path,
          error: errorMessage
        });
        return {
          success: false,
          error: errorMessage
        };
      }
    }
    /**
     * Delete file from repository
     */
    async deleteFile(path, sha, message, options = {}) {
      try {
        const owner = options.owner || this.config.owner;
        const repo = options.repo || this.config.repo;
        const branch = options.branch || this.config.branch;
        const requestBody = {
          message,
          sha,
          branch
        };
        const endpoint = `/repos/${owner}/${repo}/contents/${path}`;
        const response = await this.request(endpoint, {
          method: "DELETE",
          body: JSON.stringify(requestBody)
        });
        this.dispatchEvent("api", "file_operation_success", {
          operation: "delete",
          path,
          sha
        });
        return {
          success: true,
          commit: response.data.commit
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        this.dispatchEvent("error", "file_operation_failed", {
          operation: "delete",
          path,
          error: errorMessage
        });
        return {
          success: false,
          error: errorMessage
        };
      }
    }
    /**
     * List directory contents
     */
    async listDirectoryContents(path = "", options = {}) {
      const owner = options.owner || this.config.owner;
      const repo = options.repo || this.config.repo;
      const ref = options.ref || this.config.branch;
      const endpoint = `/repos/${owner}/${repo}/contents/${path}${ref ? `?ref=${ref}` : ""}`;
      return this.request(endpoint);
    }
    /**
     * Check if file exists in repository
     */
    async fileExists(path, options = {}) {
      try {
        const response = await this.getFileContent(path, options);
        return {
          exists: true,
          sha: response.data.sha,
          content: response.data
        };
      } catch (error) {
        const apiError = error;
        if (apiError.status === 404) {
          return { exists: false };
        }
        throw error;
      }
    }
    /**
     * Get rate limit status
     */
    async getRateLimit() {
      return this.request("/rate_limit");
    }
    /**
     * Test API connection and authentication
     */
    async testConnection() {
      try {
        const userResponse = await this.getUser();
        const rateLimitResponse = await this.getRateLimit();
        this.dispatchEvent("api", "connection_test_success", {
          user: userResponse.data,
          rateLimit: userResponse.rateLimit
        });
        return {
          success: true,
          user: userResponse.data,
          rateLimit: userResponse.rateLimit
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        this.dispatchEvent("error", "connection_test_failed", {
          error: errorMessage
        });
        return {
          success: false,
          error: errorMessage
        };
      }
    }
    /**
     * Dispatch GitHub integration events
     */
    dispatchEvent(type, action, data) {
      const event = new CustomEvent("github-integration", {
        detail: {
          type,
          action,
          data,
          timestamp: Date.now()
        }
      });
      window.dispatchEvent(event);
    }
  };
  var GitHubRepositoryManager = class {
    api;
    constructor(api) {
      this.api = api;
    }
    /**
     * Upload file to repository with automatic conflict resolution
     */
    async uploadFile(path, content, message, options = {}) {
      try {
        const existsResult = await this.api.fileExists(path);
        if (existsResult.exists && !options.overwrite) {
          return {
            success: false,
            error: "File already exists and overwrite is disabled"
          };
        }
        return await this.api.createOrUpdateFile(path, content, message, {
          sha: existsResult.sha,
          encoding: options.encoding
        });
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Unknown error"
        };
      }
    }
    /**
     * Download file from repository
     */
    async downloadFile(path) {
      try {
        const response = await this.api.getFileContent(path);
        const content = response.data.content;
        const encoding = response.data.encoding;
        if (!content) {
          return {
            success: false,
            error: "File content is empty"
          };
        }
        const decodedContent = encoding === "base64" ? decodeURIComponent(escape(atob(content))) : content;
        return {
          success: true,
          content: decodedContent,
          encoding
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Unknown error"
        };
      }
    }
    /**
     * Batch upload multiple files
     */
    async batchUpload(files, options = {}) {
      const results = [];
      let successful = 0;
      let failed = 0;
      for (const file of files) {
        const message = file.message || options.defaultMessage || `Upload ${file.path}`;
        const result = await this.uploadFile(file.path, file.content, message, {
          overwrite: options.overwrite,
          encoding: options.encoding
        });
        results.push(result);
        if (result.success) {
          successful++;
        } else {
          failed++;
        }
        await new Promise((resolve) => setTimeout(resolve, 200));
      }
      return {
        success: failed === 0,
        results,
        summary: {
          total: files.length,
          successful,
          failed
        }
      };
    }
  };
  var githubAPI = new GitHubAPI({});
  var githubRepositoryManager = new GitHubRepositoryManager(githubAPI);

  // ns-hugo-imp:C:\Users\16643\Desktop\blog\hugo\blog\assets\ts\image-manager.ts
  var CDNLinkGenerator = class {
    baseUrls = {
      github: "https://raw.githubusercontent.com",
      jsdelivr: "https://cdn.jsdelivr.net/gh",
      githubPages: "https://lanniny.github.io"
    };
    /**
     * Generate CDN URL for image
     */
    generateCDNUrl(owner, repo, path, provider = "jsdelivr") {
      switch (provider) {
        case "github":
          return `${this.baseUrls.github}/${owner}/${repo}/main/${path}`;
        case "jsdelivr":
          return `${this.baseUrls.jsdelivr}/${owner}/${repo}@main/${path}`;
        case "githubPages":
          return `${this.baseUrls.githubPages}/${repo}/${path}`;
        default:
          return `${this.baseUrls.jsdelivr}/${owner}/${repo}@main/${path}`;
      }
    }
    /**
     * Generate multiple CDN URLs for fallback
     */
    generateFallbackUrls(owner, repo, path) {
      return [
        this.generateCDNUrl(owner, repo, path, "jsdelivr"),
        this.generateCDNUrl(owner, repo, path, "github"),
        this.generateCDNUrl(owner, repo, path, "githubPages")
      ];
    }
    /**
     * Generate thumbnail URL with size parameters
     */
    generateThumbnailUrl(owner, repo, path, width = 300, height = 200) {
      const baseUrl = this.generateCDNUrl(owner, repo, path, "jsdelivr");
      return `${baseUrl}?w=${width}&h=${height}&fit=crop`;
    }
  };
  var ImageProcessor = class {
    /**
     * Compress image file
     */
    async compressImage(file, options = {}) {
      return new Promise((resolve, reject) => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();
        img.onload = () => {
          const { width, height } = this.calculateDimensions(
            img.width,
            img.height,
            options.maxWidth || 1920,
            options.maxHeight || 1080
          );
          canvas.width = width;
          canvas.height = height;
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
                reject(new Error("Image compression failed"));
              }
            },
            options.format ? `image/${options.format}` : file.type,
            options.quality || 0.8
          );
        };
        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = URL.createObjectURL(file);
      });
    }
    /**
     * Calculate optimal dimensions maintaining aspect ratio
     */
    calculateDimensions(originalWidth, originalHeight, maxWidth, maxHeight) {
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
    async generateThumbnail(file, width = 300, height = 200) {
      return this.compressImage(file, {
        maxWidth: width,
        maxHeight: height,
        quality: 0.7,
        format: "jpeg"
      });
    }
    /**
     * Validate image file
     */
    validateImage(file) {
      const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"];
      if (!allowedTypes.includes(file.type)) {
        return {
          valid: false,
          error: `\u4E0D\u652F\u6301\u7684\u56FE\u7247\u683C\u5F0F: ${file.type}`
        };
      }
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        return {
          valid: false,
          error: `\u56FE\u7247\u6587\u4EF6\u8FC7\u5927: ${(file.size / 1024 / 1024).toFixed(2)}MB (\u6700\u592710MB)`
        };
      }
      return { valid: true };
    }
  };
  var ImageManager = class {
    repositoryManager;
    cdnGenerator;
    processor;
    config = {
      owner: "lanniny",
      repo: "my_blog_img",
      branch: "main"
    };
    constructor(repositoryManager) {
      this.repositoryManager = repositoryManager || new GitHubRepositoryManager(githubAPI);
      this.cdnGenerator = new CDNLinkGenerator();
      this.processor = new ImageProcessor();
    }
    /**
     * Upload image to repository
     */
    async uploadImage(file, options = {}, progressCallback) {
      try {
        progressCallback?.({
          stage: "preparing",
          percentage: 10,
          message: "\u51C6\u5907\u4E0A\u4F20\u56FE\u7247..."
        });
        const validation = this.processor.validateImage(file);
        if (!validation.valid) {
          throw new Error(validation.error);
        }
        progressCallback?.({
          stage: "processing",
          percentage: 30,
          message: "\u5904\u7406\u56FE\u7247..."
        });
        const processedFile = await this.processor.compressImage(file, {
          quality: options.quality || 0.85,
          maxWidth: options.maxWidth || 1920,
          maxHeight: options.maxHeight || 1080
        });
        const folder = options.folder || this.generateDateFolder();
        const filename = options.filename || this.generateUniqueFilename(file.name);
        const filePath = `${folder}/${filename}`;
        progressCallback?.({
          stage: "uploading",
          percentage: 60,
          message: "\u4E0A\u4F20\u5230GitHub\u4ED3\u5E93..."
        });
        const base64Content = await this.fileToBase64(processedFile);
        const uploadResult = await this.repositoryManager.uploadFile(
          filePath,
          base64Content,
          `Upload image: ${filename}`,
          {
            overwrite: false,
            encoding: "base64"
          }
        );
        if (!uploadResult.success) {
          throw new Error(uploadResult.error || "Upload failed");
        }
        progressCallback?.({
          stage: "complete",
          percentage: 100,
          message: "\u4E0A\u4F20\u5B8C\u6210\uFF01"
        });
        const metadata = {
          name: filename,
          path: filePath,
          size: processedFile.size,
          format: processedFile.type,
          uploadDate: /* @__PURE__ */ new Date(),
          sha: uploadResult.sha || "",
          url: uploadResult.url || "",
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
        this.dispatchEvent("image-uploaded", metadata);
        return metadata;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        progressCallback?.({
          stage: "complete",
          percentage: 0,
          message: `\u4E0A\u4F20\u5931\u8D25: ${errorMessage}`
        });
        this.dispatchEvent("image-upload-error", { error: errorMessage });
        throw error;
      }
    }
    /**
     * Convert file to base64
     */
    async fileToBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result;
          const base64 = result.split(",")[1];
          resolve(base64);
        };
        reader.onerror = () => reject(new Error("Failed to read file"));
        reader.readAsDataURL(file);
      });
    }
    /**
     * Generate date-based folder structure
     */
    generateDateFolder() {
      const now = /* @__PURE__ */ new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      return `images/${year}/${month}`;
    }
    /**
     * Generate unique filename
     */
    generateUniqueFilename(originalName) {
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(2, 8);
      const extension = originalName.split(".").pop() || "jpg";
      return `img_${timestamp}_${random}.${extension}`;
    }
    /**
     * Delete image from repository
     */
    async deleteImage(imagePath, sha) {
      try {
        const result = await this.repositoryManager.deleteFile(
          imagePath,
          sha,
          `Delete image: ${imagePath.split("/").pop()}`
        );
        if (result.success) {
          this.dispatchEvent("image-deleted", { path: imagePath });
          return { success: true };
        } else {
          return { success: false, error: result.error };
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        this.dispatchEvent("image-delete-error", { error: errorMessage, path: imagePath });
        return { success: false, error: errorMessage };
      }
    }
    /**
     * Rename image in repository
     */
    async renameImage(oldPath, newPath, sha) {
      try {
        const fileResponse = await this.repositoryManager.getFileContent(oldPath);
        if (!fileResponse.success || !fileResponse.content) {
          throw new Error("Failed to get file content");
        }
        const uploadResult = await this.repositoryManager.uploadFile(
          newPath,
          fileResponse.content,
          `Rename image: ${oldPath} -> ${newPath}`,
          {
            overwrite: false,
            encoding: "base64"
          }
        );
        if (!uploadResult.success) {
          throw new Error(uploadResult.error || "Upload to new path failed");
        }
        const deleteResult = await this.repositoryManager.deleteFile(
          oldPath,
          sha,
          `Remove old image after rename: ${oldPath}`
        );
        if (!deleteResult.success) {
          console.warn("Failed to delete old file after rename:", deleteResult.error);
        }
        const newMetadata = {
          name: newPath.split("/").pop() || "",
          path: newPath,
          size: 0,
          // Size not available from upload response
          format: this.getImageFormatFromPath(newPath),
          uploadDate: /* @__PURE__ */ new Date(),
          sha: uploadResult.sha || "",
          url: uploadResult.url || "",
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
        this.dispatchEvent("image-renamed", {
          oldPath,
          newPath,
          newMetadata
        });
        return { success: true, newMetadata };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        this.dispatchEvent("image-rename-error", {
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
    async listImages(folder) {
      try {
        const path = folder || "";
        const response = await this.repositoryManager.listDirectoryContents(path);
        if (!response.success || !response.data) {
          throw new Error(response.error || "Failed to list directory contents");
        }
        const images = [];
        for (const item of response.data) {
          if (item.type === "file" && this.isImageFile(item.name)) {
            const metadata = {
              name: item.name,
              path: item.path,
              size: item.size || 0,
              format: this.getImageFormatFromPath(item.name),
              uploadDate: /* @__PURE__ */ new Date(),
              // GitHub API doesn't provide creation date easily
              sha: item.sha,
              url: item.html_url || "",
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
        console.error("Failed to list images:", error);
        return [];
      }
    }
    /**
     * Check if file is an image
     */
    isImageFile(filename) {
      const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"];
      const extension = filename.toLowerCase().substring(filename.lastIndexOf("."));
      return imageExtensions.includes(extension);
    }
    /**
     * Get image format from file path
     */
    getImageFormatFromPath(path) {
      const extension = path.toLowerCase().substring(path.lastIndexOf(".") + 1);
      const formatMap = {
        "jpg": "image/jpeg",
        "jpeg": "image/jpeg",
        "png": "image/png",
        "gif": "image/gif",
        "webp": "image/webp",
        "svg": "image/svg+xml"
      };
      return formatMap[extension] || "image/unknown";
    }
    /**
     * Dispatch image management events
     */
    dispatchEvent(type, data) {
      const event = new CustomEvent("image-management", {
        detail: {
          type,
          data,
          timestamp: Date.now()
        }
      });
      window.dispatchEvent(event);
    }
  };
  var imageManager = new ImageManager();

  // <stdin>
  var ImageGallery = class {
    container;
    cdnGenerator;
    images = [];
    filteredImages = [];
    viewMode = "grid";
    currentFolder = "";
    isLoading = false;
    config = {
      owner: "lanniny",
      repo: "my_blog_img",
      branch: "main"
    };
    constructor(containerId) {
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
    async init() {
      await this.loadImages();
      this.render();
    }
    /**
     * Load images from repository
     */
    async loadImages() {
      if (this.isLoading) return;
      this.isLoading = true;
      this.showLoading();
      try {
        const response = await githubAPI.listDirectoryContents("", {
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
        console.error("Failed to load images:", error);
        this.showError("\u52A0\u8F7D\u56FE\u7247\u5931\u8D25: " + (error instanceof Error ? error.message : "\u672A\u77E5\u9519\u8BEF"));
      } finally {
        this.isLoading = false;
      }
    }
    /**
     * Process repository contents recursively
     */
    async processRepositoryContents(contents) {
      const images = [];
      for (const item of contents) {
        if (item.type === "file" && this.isImageFile(item.name)) {
          const metadata = this.createImageMetadata(item);
          images.push(metadata);
        } else if (item.type === "dir") {
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
    isImageFile(filename) {
      const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"];
      const extension = filename.toLowerCase().substring(filename.lastIndexOf("."));
      return imageExtensions.includes(extension);
    }
    /**
     * Create image metadata from GitHub content
     */
    createImageMetadata(content) {
      const format = this.getImageFormat(content.name);
      const uploadDate = /* @__PURE__ */ new Date();
      return {
        name: content.name,
        path: content.path,
        size: content.size || 0,
        format,
        uploadDate,
        sha: content.sha,
        url: content.html_url || "",
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
    getImageFormat(filename) {
      const extension = filename.toLowerCase().substring(filename.lastIndexOf(".") + 1);
      const formatMap = {
        "jpg": "image/jpeg",
        "jpeg": "image/jpeg",
        "png": "image/png",
        "gif": "image/gif",
        "webp": "image/webp",
        "svg": "image/svg+xml"
      };
      return formatMap[extension] || "image/unknown";
    }
    /**
     * Render the gallery
     */
    render() {
      if (this.filteredImages.length === 0) {
        this.showEmpty();
        return;
      }
      const html = this.viewMode === "grid" ? this.renderGridView() : this.renderListView();
      this.container.innerHTML = html;
      this.bindImageEvents();
    }
    /**
     * Render grid view
     */
    renderGridView() {
      return `
            <div class="image-grid">
                ${this.filteredImages.map((image) => `
                    <div class="image-grid-item" data-image-path="${image.path}">
                        <div class="image-thumbnail">
                            <img src="${image.thumbnailUrl || image.cdnUrl}" 
                                 alt="${image.name}" 
                                 loading="lazy"
                                 onerror="this.src='${image.cdnUrl}'">
                            <div class="image-overlay">
                                <button class="btn-view" title="\u67E5\u770B\u8BE6\u60C5">\u{1F441}\uFE0F</button>
                                <button class="btn-copy" title="\u590D\u5236\u94FE\u63A5">\u{1F4CB}</button>
                            </div>
                        </div>
                        <div class="image-info">
                            <div class="image-name" title="${image.name}">${this.truncateText(image.name, 20)}</div>
                            <div class="image-size">${this.formatFileSize(image.size)}</div>
                        </div>
                    </div>
                `).join("")}
            </div>
        `;
    }
    /**
     * Render list view
     */
    renderListView() {
      return `
            <div class="image-list">
                ${this.filteredImages.map((image) => `
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
                            <button class="btn btn-sm btn-view">\u67E5\u770B</button>
                            <button class="btn btn-sm btn-copy">\u590D\u5236\u94FE\u63A5</button>
                        </div>
                    </div>
                `).join("")}
            </div>
        `;
    }
    /**
     * Bind image event listeners
     */
    bindImageEvents() {
      this.container.querySelectorAll(".btn-view").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          const item = e.target.closest("[data-image-path]");
          const imagePath = item?.dataset.imagePath;
          if (imagePath) {
            this.showImageModal(imagePath);
          }
        });
      });
      this.container.querySelectorAll(".btn-copy").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          const item = e.target.closest("[data-image-path]");
          const imagePath = item?.dataset.imagePath;
          if (imagePath) {
            this.copyImageLink(imagePath);
          }
        });
      });
      this.container.querySelectorAll("[data-image-path]").forEach((item) => {
        item.addEventListener("click", () => {
          const imagePath = item.dataset.imagePath;
          if (imagePath) {
            this.showImageModal(imagePath);
          }
        });
      });
    }
    /**
     * Show image modal
     */
    showImageModal(imagePath) {
      const image = this.images.find((img) => img.path === imagePath);
      if (!image) return;
      const modal = document.getElementById("imageModal");
      if (!modal) return;
      const modalImage = document.getElementById("modalImage");
      const modalImageName = document.getElementById("modalImageName");
      const modalImageSize = document.getElementById("modalImageSize");
      const modalImageDate = document.getElementById("modalImageDate");
      const modalCdnLink = document.getElementById("modalCdnLink");
      const modalMarkdown = document.getElementById("modalMarkdown");
      if (modalImage) modalImage.src = image.cdnUrl;
      if (modalImageName) modalImageName.textContent = image.name;
      if (modalImageSize) modalImageSize.textContent = this.formatFileSize(image.size);
      if (modalImageDate) modalImageDate.textContent = image.uploadDate.toLocaleDateString();
      if (modalCdnLink) modalCdnLink.value = image.cdnUrl;
      if (modalMarkdown) modalMarkdown.value = `![${image.name}](${image.cdnUrl})`;
      modal.style.display = "block";
      const deleteBtn = document.getElementById("deleteImage");
      if (deleteBtn) {
        deleteBtn.onclick = () => this.deleteImage(image);
      }
    }
    /**
     * Copy image link to clipboard
     */
    async copyImageLink(imagePath) {
      const image = this.images.find((img) => img.path === imagePath);
      if (!image) return;
      try {
        await navigator.clipboard.writeText(image.cdnUrl);
        this.showToast("\u94FE\u63A5\u5DF2\u590D\u5236\u5230\u526A\u8D34\u677F", "success");
      } catch (error) {
        console.error("Failed to copy link:", error);
        this.showToast("\u590D\u5236\u5931\u8D25", "error");
      }
    }
    /**
     * Delete image from repository
     */
    async deleteImage(image) {
      if (!confirm(`\u786E\u5B9A\u8981\u5220\u9664\u56FE\u7247 "${image.name}" \u5417\uFF1F\u6B64\u64CD\u4F5C\u4E0D\u53EF\u64A4\u9500\u3002`)) {
        return;
      }
      try {
        const result = await githubAPI.deleteFile(
          image.path,
          image.sha,
          `Delete image: ${image.name}`
        );
        if (result.success) {
          this.showToast("\u56FE\u7247\u5220\u9664\u6210\u529F", "success");
          await this.refresh();
          const modal = document.getElementById("imageModal");
          if (modal) modal.style.display = "none";
        } else {
          throw new Error(result.error || "Delete failed");
        }
      } catch (error) {
        console.error("Failed to delete image:", error);
        this.showToast("\u5220\u9664\u5931\u8D25: " + (error instanceof Error ? error.message : "\u672A\u77E5\u9519\u8BEF"), "error");
      }
    }
    /**
     * Refresh gallery
     */
    async refresh() {
      await this.loadImages();
    }
    /**
     * Toggle view mode
     */
    toggleView() {
      this.viewMode = this.viewMode === "grid" ? "list" : "grid";
      this.render();
    }
    /**
     * Filter by folder
     */
    filterByFolder(folder) {
      this.currentFolder = folder;
      if (folder === "") {
        this.filteredImages = [...this.images];
      } else {
        this.filteredImages = this.images.filter(
          (image) => image.path.startsWith(folder)
        );
      }
      this.render();
    }
    /**
     * Update folder filter dropdown
     */
    updateFolderFilter() {
      const folderFilter = document.getElementById("folderFilter");
      if (!folderFilter) return;
      const folders = /* @__PURE__ */ new Set();
      this.images.forEach((image) => {
        const pathParts = image.path.split("/");
        if (pathParts.length > 1) {
          folders.add(pathParts[0]);
        }
      });
      const currentValue = folderFilter.value;
      folderFilter.innerHTML = '<option value="">\u6240\u6709\u6587\u4EF6\u5939</option>';
      Array.from(folders).sort().forEach((folder) => {
        const option = document.createElement("option");
        option.value = folder;
        option.textContent = folder;
        folderFilter.appendChild(option);
      });
      folderFilter.value = currentValue;
    }
    /**
     * Show loading state
     */
    showLoading() {
      this.container.innerHTML = `
            <div class="loading-placeholder">
                <div class="loading-spinner"></div>
                <p>\u6B63\u5728\u52A0\u8F7D\u56FE\u7247\u5E93...</p>
            </div>
        `;
    }
    /**
     * Show empty state
     */
    showEmpty() {
      this.container.innerHTML = `
            <div class="empty-placeholder">
                <div class="empty-icon">\u{1F4F7}</div>
                <h3>\u6682\u65E0\u56FE\u7247</h3>
                <p>\u4E0A\u4F20\u4E00\u4E9B\u56FE\u7247\u6765\u5F00\u59CB\u4F7F\u7528\u56FE\u7247\u5E93\u5427\uFF01</p>
            </div>
        `;
    }
    /**
     * Show error state
     */
    showError(message) {
      this.container.innerHTML = `
            <div class="error-placeholder">
                <div class="error-icon">\u274C</div>
                <h3>\u52A0\u8F7D\u5931\u8D25</h3>
                <p>${message}</p>
                <button onclick="location.reload()" class="btn btn-primary">\u91CD\u8BD5</button>
            </div>
        `;
    }
    /**
     * Show toast notification
     */
    showToast(message, type = "success") {
      const toast = document.createElement("div");
      toast.className = `toast toast-${type}`;
      toast.textContent = message;
      document.body.appendChild(toast);
      setTimeout(() => {
        toast.classList.add("show");
      }, 100);
      setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => {
          document.body.removeChild(toast);
        }, 300);
      }, 3e3);
    }
    /**
     * Utility functions
     */
    formatFileSize(bytes) {
      if (bytes === 0) return "0 Bytes";
      const k = 1024;
      const sizes = ["Bytes", "KB", "MB", "GB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    }
    truncateText(text, maxLength) {
      return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
    }
  };
  window.ImageGallery = ImageGallery;
})();
/*!
*   Hugo Theme Stack - GitHub Authentication & Token Management
*
*   @author: Alex (Engineer)
*   @project: Hugo Blog GitHub Integration
*   @description: GitHub authentication and secure token management
*/
/*!
*   Hugo Theme Stack - GitHub API Integration Core
*
*   @author: Alex (Engineer)
*   @project: Hugo Blog GitHub Integration
*   @description: Core GitHub API integration with rate limiting, error handling, and retry logic
*/
/*!
*   Hugo Theme Stack - Image Management System
*
*   @author: Alex (Engineer)
*   @project: Hugo Blog Image Management
*   @description: Unified image management system for my_blog_img repository integration
*/
/*!
*   Hugo Theme Stack - Image Gallery Component
*
*   @author: Alex (Engineer)
*   @project: Hugo Blog Image Management
*   @description: Image gallery for browsing and managing uploaded images
*/
