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
  var ImageManagerUI = class {
    imageManager;
    isOpen = false;
    constructor(imageManager2) {
      this.imageManager = imageManager2;
      this.createInterface();
      this.setupEventListeners();
    }
    /**
     * Create image manager interface
     */
    createInterface() {
      const imageManagerHTML = `
            <div class="image-manager-modal" id="image-manager-modal" style="display: none;">
                <div class="image-manager-container">
                    <div class="image-manager-header">
                        <h3>\u{1F5BC}\uFE0F \u56FE\u7247\u7BA1\u7406</h3>
                        <button class="close-btn" id="image-manager-close">\xD7</button>
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
                                    <p>\u62D6\u62FD\u56FE\u7247\u5230\u6B64\u5904\u6216\u70B9\u51FB\u4E0A\u4F20</p>
                                    <small>\u652F\u6301 JPG\u3001PNG\u3001GIF\u3001WebP \u683C\u5F0F\uFF0C\u6700\u5927 10MB</small>
                                </div>
                                <input type="file" id="image-file-input" accept="image/*" multiple style="display: none;">
                            </div>

                            <div class="upload-progress" id="upload-progress" style="display: none;">
                                <div class="progress-bar">
                                    <div class="progress-fill" id="progress-fill"></div>
                                </div>
                                <div class="progress-text" id="progress-text">\u51C6\u5907\u4E0A\u4F20...</div>
                            </div>
                        </div>

                        <!-- Image Gallery -->
                        <div class="image-gallery-section">
                            <div class="gallery-header">
                                <h4>\u{1F4DA} \u56FE\u7247\u5E93</h4>
                                <div class="gallery-controls">
                                    <input type="text" id="image-search" placeholder="\u641C\u7D22\u56FE\u7247...">
                                    <select id="image-filter">
                                        <option value="">\u6240\u6709\u56FE\u7247</option>
                                        <option value="recent">\u6700\u8FD1\u4E0A\u4F20</option>
                                        <option value="large">\u5927\u56FE\u7247</option>
                                        <option value="small">\u5C0F\u56FE\u7247</option>
                                    </select>
                                    <button class="btn btn-secondary" id="refresh-gallery">\u5237\u65B0</button>
                                </div>
                            </div>

                            <div class="image-gallery" id="image-gallery">
                                <div class="loading-state">\u6B63\u5728\u52A0\u8F7D\u56FE\u7247...</div>
                            </div>

                            <div class="gallery-pagination" id="gallery-pagination" style="display: none;">
                                <button class="btn btn-secondary" id="prev-page" disabled>\u4E0A\u4E00\u9875</button>
                                <span class="page-info" id="page-info">\u7B2C 1 \u9875\uFF0C\u5171 1 \u9875</span>
                                <button class="btn btn-secondary" id="next-page" disabled>\u4E0B\u4E00\u9875</button>
                            </div>
                        </div>

                        <!-- Image Details Panel -->
                        <div class="image-details-panel" id="image-details-panel" style="display: none;">
                            <div class="details-header">
                                <h4>\u56FE\u7247\u8BE6\u60C5</h4>
                                <button class="close-details" id="close-details">\xD7</button>
                            </div>

                            <div class="details-content">
                                <div class="image-preview">
                                    <img id="details-image" src="" alt="\u56FE\u7247\u9884\u89C8">
                                </div>

                                <div class="image-info">
                                    <div class="info-group">
                                        <label>\u6587\u4EF6\u540D:</label>
                                        <input type="text" id="details-name" readonly>
                                        <button class="btn btn-small" id="edit-name">\u7F16\u8F91</button>
                                    </div>

                                    <div class="info-group">
                                        <label>CDN\u94FE\u63A5:</label>
                                        <input type="text" id="details-cdn-url" readonly>
                                        <button class="btn btn-small" id="copy-cdn-url">\u590D\u5236</button>
                                    </div>

                                    <div class="info-group">
                                        <label>Markdown:</label>
                                        <input type="text" id="details-markdown" readonly>
                                        <button class="btn btn-small" id="copy-markdown">\u590D\u5236</button>
                                    </div>

                                    <div class="info-group">
                                        <label>\u6587\u4EF6\u5927\u5C0F:</label>
                                        <span id="details-size">-</span>
                                    </div>

                                    <div class="info-group">
                                        <label>\u4E0A\u4F20\u65F6\u95F4:</label>
                                        <span id="details-date">-</span>
                                    </div>
                                </div>

                                <div class="details-actions">
                                    <button class="btn btn-primary" id="use-image">\u4F7F\u7528\u56FE\u7247</button>
                                    <button class="btn btn-secondary" id="download-image">\u4E0B\u8F7D</button>
                                    <button class="btn btn-danger" id="delete-image">\u5220\u9664</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
      if (!document.getElementById("image-manager-modal")) {
        document.body.insertAdjacentHTML("beforeend", imageManagerHTML);
      }
    }
    /**
     * Setup event listeners
     */
    setupEventListeners() {
      const closeBtn = document.getElementById("image-manager-close");
      closeBtn?.addEventListener("click", () => this.closeManager());
      const uploadArea = document.getElementById("image-upload-area");
      const fileInput = document.getElementById("image-file-input");
      uploadArea?.addEventListener("click", () => fileInput?.click());
      fileInput?.addEventListener("change", (e) => {
        const files = e.target.files;
        if (files) {
          this.handleFileUpload(Array.from(files));
        }
      });
      uploadArea?.addEventListener("dragover", (e) => {
        e.preventDefault();
        uploadArea.classList.add("drag-over");
      });
      uploadArea?.addEventListener("dragleave", () => {
        uploadArea.classList.remove("drag-over");
      });
      uploadArea?.addEventListener("drop", (e) => {
        e.preventDefault();
        uploadArea.classList.remove("drag-over");
        const files = Array.from(e.dataTransfer?.files || []);
        if (files.length > 0) {
          this.handleFileUpload(files);
        }
      });
      const searchInput = document.getElementById("image-search");
      searchInput?.addEventListener("input", () => this.filterImages());
      const filterSelect = document.getElementById("image-filter");
      filterSelect?.addEventListener("change", () => this.filterImages());
      const refreshBtn = document.getElementById("refresh-gallery");
      refreshBtn?.addEventListener("click", () => this.loadImageGallery());
      const closeDetails = document.getElementById("close-details");
      closeDetails?.addEventListener("click", () => this.closeDetailsPanel());
      const copyCdnBtn = document.getElementById("copy-cdn-url");
      copyCdnBtn?.addEventListener("click", () => this.copyToClipboard("details-cdn-url"));
      const copyMarkdownBtn = document.getElementById("copy-markdown");
      copyMarkdownBtn?.addEventListener("click", () => this.copyToClipboard("details-markdown"));
    }
    /**
     * Open image manager
     */
    openManager() {
      const modal = document.getElementById("image-manager-modal");
      if (modal) {
        modal.style.display = "flex";
        this.isOpen = true;
        this.loadImageGallery();
      }
    }
    /**
     * Close image manager
     */
    closeManager() {
      const modal = document.getElementById("image-manager-modal");
      if (modal) {
        modal.style.display = "none";
        this.isOpen = false;
        this.closeDetailsPanel();
      }
    }
    /**
     * Handle file upload
     */
    async handleFileUpload(files) {
      const progressContainer = document.getElementById("upload-progress");
      const progressFill = document.getElementById("progress-fill");
      const progressText = document.getElementById("progress-text");
      if (!progressContainer || !progressFill || !progressText) return;
      progressContainer.style.display = "block";
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        try {
          await this.imageManager.uploadImage(file, {}, (progress) => {
            const overallProgress = (i / files.length + progress.percentage / 100 / files.length) * 100;
            progressFill.style.width = `${overallProgress}%`;
            progressText.textContent = `${progress.message} (${i + 1}/${files.length})`;
          });
          console.log(`\u2705 Uploaded: ${file.name}`);
        } catch (error) {
          console.error(`\u274C Failed to upload ${file.name}:`, error);
          this.showMessage(`\u4E0A\u4F20\u5931\u8D25: ${file.name}`, "error");
        }
      }
      setTimeout(() => {
        progressContainer.style.display = "none";
        this.loadImageGallery();
      }, 1e3);
    }
    /**
     * Load image gallery
     */
    async loadImageGallery() {
      const gallery = document.getElementById("image-gallery");
      if (!gallery) return;
      gallery.innerHTML = '<div class="loading-state">\u6B63\u5728\u52A0\u8F7D\u56FE\u7247...</div>';
      try {
        gallery.innerHTML = `
                <div class="empty-gallery">
                    <p>\u6682\u65E0\u56FE\u7247</p>
                    <p>\u4E0A\u4F20\u60A8\u7684\u7B2C\u4E00\u5F20\u56FE\u7247\u5F00\u59CB\u4F7F\u7528\u56FE\u7247\u7BA1\u7406\u529F\u80FD</p>
                </div>
            `;
      } catch (error) {
        console.error("Failed to load image gallery:", error);
        gallery.innerHTML = '<div class="error-state">\u52A0\u8F7D\u56FE\u7247\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5</div>';
      }
    }
    /**
     * Filter images
     */
    filterImages() {
      console.log("Filtering images...");
    }
    /**
     * Close details panel
     */
    closeDetailsPanel() {
      const panel = document.getElementById("image-details-panel");
      if (panel) {
        panel.style.display = "none";
      }
    }
    /**
     * Copy text to clipboard
     */
    async copyToClipboard(elementId) {
      const element = document.getElementById(elementId);
      if (element) {
        try {
          await navigator.clipboard.writeText(element.value);
          this.showMessage("\u5DF2\u590D\u5236\u5230\u526A\u8D34\u677F", "success");
        } catch (error) {
          console.error("Failed to copy to clipboard:", error);
          this.showMessage("\u590D\u5236\u5931\u8D25", "error");
        }
      }
    }
    /**
     * Show message to user
     */
    showMessage(message, type) {
      if (typeof window.Stack !== "undefined") {
        const Stack = window.Stack;
        if (type === "success" && Stack.showSuccessMessage) {
          Stack.showSuccessMessage(message);
        } else if (type === "error" && Stack.showErrorMessage) {
          Stack.showErrorMessage(message);
        } else {
          console.log(`${type.toUpperCase()}: ${message}`);
        }
      } else {
        alert(message);
      }
    }
  };
  var imageManager = new ImageManager();
  var imageManagerUI = new ImageManagerUI(imageManager);
  window.ImageManager = ImageManager;
  window.CDNLinkGenerator = CDNLinkGenerator;
  window.ImageProcessor = ImageProcessor;
  window.imageManager = imageManager;
  window.imageManagerUI = imageManagerUI;
  window.openImageManager = () => imageManagerUI.openManager();

  // <stdin>
  var ImageUploader = class {
    container;
    fileInput;
    dropZone;
    progressBar;
    statusMessage;
    previewContainer;
    uploadButton;
    manager;
    isUploading = false;
    constructor(containerId, manager) {
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
    init() {
      this.createHTML();
      this.bindEvents();
      this.setupDragAndDrop();
    }
    /**
     * Create HTML structure
     */
    createHTML() {
      this.container.innerHTML = `
            <div class="image-uploader">
                <div class="upload-header">
                    <h3>\u{1F4F8} \u56FE\u7247\u4E0A\u4F20</h3>
                    <p>\u652F\u6301\u62D6\u62FD\u4E0A\u4F20\u6216\u70B9\u51FB\u9009\u62E9\u6587\u4EF6</p>
                </div>
                
                <div class="drop-zone" id="dropZone">
                    <div class="drop-zone-content">
                        <div class="upload-icon">\u{1F4C1}</div>
                        <p class="drop-text">\u62D6\u62FD\u56FE\u7247\u5230\u6B64\u5904\u6216\u70B9\u51FB\u4E0A\u4F20</p>
                        <p class="file-info">\u652F\u6301 JPG, PNG, GIF, WebP \u683C\u5F0F\uFF0C\u6700\u5927 10MB</p>
                        <button class="upload-btn" id="uploadBtn">\u9009\u62E9\u56FE\u7247</button>
                    </div>
                </div>
                
                <input type="file" id="fileInput" accept="image/*" multiple style="display: none;">
                
                <div class="upload-progress" id="uploadProgress" style="display: none;">
                    <div class="progress-bar">
                        <div class="progress-fill" id="progressFill"></div>
                    </div>
                    <div class="status-message" id="statusMessage">\u51C6\u5907\u4E0A\u4F20...</div>
                </div>
                
                <div class="preview-container" id="previewContainer"></div>
                
                <div class="upload-options" style="display: none;">
                    <h4>\u4E0A\u4F20\u9009\u9879</h4>
                    <div class="option-group">
                        <label>
                            <input type="checkbox" id="compressImage" checked>
                            \u538B\u7F29\u56FE\u7247 (\u63A8\u8350)
                        </label>
                    </div>
                    <div class="option-group">
                        <label>
                            \u56FE\u7247\u8D28\u91CF:
                            <input type="range" id="qualitySlider" min="0.1" max="1" step="0.1" value="0.85">
                            <span id="qualityValue">85%</span>
                        </label>
                    </div>
                    <div class="option-group">
                        <label>
                            \u6587\u4EF6\u5939:
                            <input type="text" id="folderInput" placeholder="\u7559\u7A7A\u4F7F\u7528\u9ED8\u8BA4\u65E5\u671F\u6587\u4EF6\u5939">
                        </label>
                    </div>
                </div>
            </div>
        `;
      this.dropZone = this.container.querySelector("#dropZone");
      this.fileInput = this.container.querySelector("#fileInput");
      this.progressBar = this.container.querySelector("#uploadProgress");
      this.statusMessage = this.container.querySelector("#statusMessage");
      this.previewContainer = this.container.querySelector("#previewContainer");
      this.uploadButton = this.container.querySelector("#uploadBtn");
    }
    /**
     * Bind event listeners
     */
    bindEvents() {
      this.uploadButton.addEventListener("click", () => {
        this.fileInput.click();
      });
      this.fileInput.addEventListener("change", (e) => {
        const files = e.target.files;
        if (files && files.length > 0) {
          this.handleFiles(Array.from(files));
        }
      });
      const qualitySlider = this.container.querySelector("#qualitySlider");
      const qualityValue = this.container.querySelector("#qualityValue");
      qualitySlider?.addEventListener("input", (e) => {
        const value = e.target.value;
        qualityValue.textContent = `${Math.round(parseFloat(value) * 100)}%`;
      });
      window.addEventListener("image-management", (e) => {
        this.handleImageEvent(e.detail);
      });
    }
    /**
     * Setup drag and drop functionality
     */
    setupDragAndDrop() {
      ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
        this.dropZone.addEventListener(eventName, this.preventDefaults, false);
        document.body.addEventListener(eventName, this.preventDefaults, false);
      });
      ["dragenter", "dragover"].forEach((eventName) => {
        this.dropZone.addEventListener(eventName, () => {
          this.dropZone.classList.add("drag-over");
        }, false);
      });
      ["dragleave", "drop"].forEach((eventName) => {
        this.dropZone.addEventListener(eventName, () => {
          this.dropZone.classList.remove("drag-over");
        }, false);
      });
      this.dropZone.addEventListener("drop", (e) => {
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
    preventDefaults(e) {
      e.preventDefault();
      e.stopPropagation();
    }
    /**
     * Handle selected/dropped files
     */
    async handleFiles(files) {
      if (this.isUploading) {
        this.showMessage("\u6B63\u5728\u4E0A\u4F20\u4E2D\uFF0C\u8BF7\u7B49\u5F85...", "warning");
        return;
      }
      const imageFiles = files.filter((file) => file.type.startsWith("image/"));
      if (imageFiles.length === 0) {
        this.showMessage("\u8BF7\u9009\u62E9\u6709\u6548\u7684\u56FE\u7247\u6587\u4EF6", "error");
        return;
      }
      if (imageFiles.length !== files.length) {
        this.showMessage(`\u5DF2\u8FC7\u6EE4 ${files.length - imageFiles.length} \u4E2A\u975E\u56FE\u7247\u6587\u4EF6`, "warning");
      }
      this.showPreview(imageFiles);
      await this.uploadFiles(imageFiles);
    }
    /**
     * Show file preview
     */
    showPreview(files) {
      this.previewContainer.innerHTML = "";
      files.forEach((file, index) => {
        const previewItem = document.createElement("div");
        previewItem.className = "preview-item";
        const img = document.createElement("img");
        img.src = URL.createObjectURL(file);
        img.alt = file.name;
        const info = document.createElement("div");
        info.className = "preview-info";
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
    async uploadFiles(files) {
      this.isUploading = true;
      this.showProgress();
      const results = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        try {
          this.updateProgress(
            i / files.length * 100,
            `\u4E0A\u4F20 ${file.name} (${i + 1}/${files.length})`
          );
          const options = this.getUploadOptions();
          const metadata = await this.manager.uploadImage(
            file,
            options,
            (progress) => {
              const overallProgress = (i + progress.percentage / 100) / files.length * 100;
              this.updateProgress(overallProgress, progress.message);
            }
          );
          results.push(metadata);
        } catch (error) {
          console.error(`Failed to upload ${file.name}:`, error);
          results.push(error);
        }
      }
      this.isUploading = false;
      this.hideProgress();
      this.showResults(results);
    }
    /**
     * Get upload options from UI
     */
    getUploadOptions() {
      const compressImage = this.container.querySelector("#compressImage")?.checked;
      const quality = parseFloat(this.container.querySelector("#qualitySlider")?.value || "0.85");
      const folder = this.container.querySelector("#folderInput")?.value.trim();
      return {
        quality: compressImage ? quality : 1,
        folder: folder || void 0,
        maxWidth: compressImage ? 1920 : void 0,
        maxHeight: compressImage ? 1080 : void 0
      };
    }
    /**
     * Show upload progress
     */
    showProgress() {
      this.progressBar.style.display = "block";
      this.dropZone.style.display = "none";
    }
    /**
     * Hide upload progress
     */
    hideProgress() {
      this.progressBar.style.display = "none";
      this.dropZone.style.display = "block";
    }
    /**
     * Update progress bar
     */
    updateProgress(percentage, message) {
      const progressFill = this.container.querySelector("#progressFill");
      if (progressFill) {
        progressFill.style.width = `${percentage}%`;
      }
      this.statusMessage.textContent = message;
    }
    /**
     * Show upload results
     */
    showResults(results) {
      const successful = results.filter((r) => !(r instanceof Error));
      const failed = results.filter((r) => r instanceof Error);
      let message = "";
      let type = "success";
      if (successful.length > 0 && failed.length === 0) {
        message = `\u6210\u529F\u4E0A\u4F20 ${successful.length} \u5F20\u56FE\u7247`;
        type = "success";
      } else if (successful.length > 0 && failed.length > 0) {
        message = `\u6210\u529F\u4E0A\u4F20 ${successful.length} \u5F20\u56FE\u7247\uFF0C${failed.length} \u5F20\u5931\u8D25`;
        type = "warning";
      } else {
        message = `\u4E0A\u4F20\u5931\u8D25\uFF1A${failed[0]?.message || "\u672A\u77E5\u9519\u8BEF"}`;
        type = "error";
      }
      this.showMessage(message, type);
      if (successful.length > 0) {
        this.showUploadedImages(successful);
      }
      this.previewContainer.innerHTML = "";
      this.fileInput.value = "";
    }
    /**
     * Show uploaded images with CDN links
     */
    showUploadedImages(images) {
      const resultsContainer = document.createElement("div");
      resultsContainer.className = "upload-results";
      resultsContainer.innerHTML = "<h4>\u4E0A\u4F20\u6210\u529F\u7684\u56FE\u7247</h4>";
      images.forEach((image) => {
        const imageItem = document.createElement("div");
        imageItem.className = "uploaded-image-item";
        imageItem.innerHTML = `
                <div class="uploaded-image-preview">
                    <img src="${image.thumbnailUrl || image.cdnUrl}" alt="${image.name}">
                </div>
                <div class="uploaded-image-info">
                    <div class="image-name">${image.name}</div>
                    <div class="image-size">${this.formatFileSize(image.size)}</div>
                    <div class="image-links">
                        <input type="text" value="${image.cdnUrl}" readonly class="cdn-link">
                        <button onclick="navigator.clipboard.writeText('${image.cdnUrl}')">\u590D\u5236\u94FE\u63A5</button>
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
    showMessage(message, type) {
      let messageEl = this.container.querySelector(".status-message-global");
      if (!messageEl) {
        messageEl = document.createElement("div");
        messageEl.className = "status-message-global";
        this.container.appendChild(messageEl);
      }
      messageEl.textContent = message;
      messageEl.className = `status-message-global ${type}`;
      setTimeout(() => {
        messageEl.style.display = "none";
      }, 5e3);
    }
    /**
     * Handle image management events
     */
    handleImageEvent(detail) {
      if (detail.type === "image-uploaded") {
        console.log("Image uploaded successfully:", detail.data);
      } else if (detail.type === "image-upload-error") {
        console.error("Image upload error:", detail.data);
      }
    }
    /**
     * Format file size for display
     */
    formatFileSize(bytes) {
      if (bytes === 0) return "0 Bytes";
      const k = 1024;
      const sizes = ["Bytes", "KB", "MB", "GB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    }
  };
  document.addEventListener("DOMContentLoaded", () => {
    const uploaderContainer = document.getElementById("image-uploader-container");
    if (uploaderContainer) {
      new ImageUploader("image-uploader-container");
    }
  });
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
*   Hugo Theme Stack - Image Uploader Component
*
*   @author: Alex (Engineer)
*   @project: Hugo Blog Image Management
*   @description: Interactive image upload component with drag-and-drop support
*/
