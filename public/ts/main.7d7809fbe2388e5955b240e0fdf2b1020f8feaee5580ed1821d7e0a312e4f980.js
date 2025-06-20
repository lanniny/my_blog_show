(() => {
  // ns-hugo-imp:C:\Users\16643\Desktop\blog\hugo\blog\themes\hugo-theme-stack\assets\ts\gallery.ts
  var StackGallery = class _StackGallery {
    galleryUID;
    items = [];
    constructor(container, galleryUID = 1) {
      if (window.PhotoSwipe == void 0 || window.PhotoSwipeUI_Default == void 0) {
        console.error("PhotoSwipe lib not loaded.");
        return;
      }
      this.galleryUID = galleryUID;
      _StackGallery.createGallery(container);
      this.loadItems(container);
      this.bindClick();
    }
    loadItems(container) {
      this.items = [];
      const figures = container.querySelectorAll("figure.gallery-image");
      for (const el of figures) {
        const figcaption = el.querySelector("figcaption"), img = el.querySelector("img");
        let aux = {
          w: parseInt(img.getAttribute("width")),
          h: parseInt(img.getAttribute("height")),
          src: img.src,
          msrc: img.getAttribute("data-thumb") || img.src,
          el
        };
        if (figcaption) {
          aux.title = figcaption.innerHTML;
        }
        this.items.push(aux);
      }
    }
    static createGallery(container) {
      const images = container.querySelectorAll("img.gallery-image");
      for (const img of Array.from(images)) {
        const paragraph = img.closest("p");
        if (!paragraph || !container.contains(paragraph)) continue;
        if (paragraph.textContent.trim() == "") {
          paragraph.classList.add("no-text");
        }
        let isNewLineImage = paragraph.classList.contains("no-text");
        if (!isNewLineImage) continue;
        const hasLink = img.parentElement.tagName == "A";
        let el = img;
        const figure = document.createElement("figure");
        figure.style.setProperty("flex-grow", img.getAttribute("data-flex-grow") || "1");
        figure.style.setProperty("flex-basis", img.getAttribute("data-flex-basis") || "0");
        if (hasLink) {
          el = img.parentElement;
        }
        el.parentElement.insertBefore(figure, el);
        figure.appendChild(el);
        if (img.hasAttribute("alt")) {
          const figcaption = document.createElement("figcaption");
          figcaption.innerText = img.getAttribute("alt");
          figure.appendChild(figcaption);
        }
        if (!hasLink) {
          figure.className = "gallery-image";
          const a = document.createElement("a");
          a.href = img.src;
          a.setAttribute("target", "_blank");
          img.parentNode.insertBefore(a, img);
          a.appendChild(img);
        }
      }
      const figuresEl = container.querySelectorAll("figure.gallery-image");
      let currentGallery = [];
      for (const figure of figuresEl) {
        if (!currentGallery.length) {
          currentGallery = [figure];
        } else if (figure.previousElementSibling === currentGallery[currentGallery.length - 1]) {
          currentGallery.push(figure);
        } else if (currentGallery.length) {
          _StackGallery.wrap(currentGallery);
          currentGallery = [figure];
        }
      }
      if (currentGallery.length > 0) {
        _StackGallery.wrap(currentGallery);
      }
    }
    /**
     * Wrap adjacent figure tags with div.gallery
     * @param figures 
     */
    static wrap(figures) {
      const galleryContainer = document.createElement("div");
      galleryContainer.className = "gallery";
      const parentNode = figures[0].parentNode, first = figures[0];
      parentNode.insertBefore(galleryContainer, first);
      for (const figure of figures) {
        galleryContainer.appendChild(figure);
      }
    }
    open(index) {
      const pswp = document.querySelector(".pswp");
      const ps = new window.PhotoSwipe(pswp, window.PhotoSwipeUI_Default, this.items, {
        index,
        galleryUID: this.galleryUID,
        getThumbBoundsFn: (index2) => {
          const thumbnail = this.items[index2].el.getElementsByTagName("img")[0], pageYScroll = window.pageYOffset || document.documentElement.scrollTop, rect = thumbnail.getBoundingClientRect();
          return { x: rect.left, y: rect.top + pageYScroll, w: rect.width };
        }
      });
      ps.init();
    }
    bindClick() {
      for (const [index, item] of this.items.entries()) {
        const a = item.el.querySelector("a");
        a.addEventListener("click", (e) => {
          e.preventDefault();
          this.open(index);
        });
      }
    }
  };
  var gallery_default = StackGallery;

  // ns-hugo-imp:C:\Users\16643\Desktop\blog\hugo\blog\themes\hugo-theme-stack\assets\ts\color.ts
  var colorsCache = {};
  if (localStorage.hasOwnProperty("StackColorsCache")) {
    try {
      colorsCache = JSON.parse(localStorage.getItem("StackColorsCache"));
    } catch (e) {
      colorsCache = {};
    }
  }
  async function getColor(key, hash, imageURL) {
    if (!key) {
      return await Vibrant.from(imageURL).getPalette();
    }
    if (!colorsCache.hasOwnProperty(key) || colorsCache[key].hash !== hash) {
      const palette = await Vibrant.from(imageURL).getPalette();
      colorsCache[key] = {
        hash,
        Vibrant: {
          hex: palette.Vibrant.hex,
          rgb: palette.Vibrant.rgb,
          bodyTextColor: palette.Vibrant.bodyTextColor
        },
        DarkMuted: {
          hex: palette.DarkMuted.hex,
          rgb: palette.DarkMuted.rgb,
          bodyTextColor: palette.DarkMuted.bodyTextColor
        }
      };
      localStorage.setItem("StackColorsCache", JSON.stringify(colorsCache));
    }
    return colorsCache[key];
  }

  // ns-hugo-imp:C:\Users\16643\Desktop\blog\hugo\blog\themes\hugo-theme-stack\assets\ts\menu.ts
  var slideUp = (target, duration = 500) => {
    target.classList.add("transiting");
    target.style.transitionProperty = "height, margin, padding";
    target.style.transitionDuration = duration + "ms";
    target.style.height = target.offsetHeight + "px";
    target.offsetHeight;
    target.style.overflow = "hidden";
    target.style.height = "0";
    target.style.paddingTop = "0";
    target.style.paddingBottom = "0";
    target.style.marginTop = "0";
    target.style.marginBottom = "0";
    window.setTimeout(() => {
      target.classList.remove("show");
      target.style.removeProperty("height");
      target.style.removeProperty("padding-top");
      target.style.removeProperty("padding-bottom");
      target.style.removeProperty("margin-top");
      target.style.removeProperty("margin-bottom");
      target.style.removeProperty("overflow");
      target.style.removeProperty("transition-duration");
      target.style.removeProperty("transition-property");
      target.classList.remove("transiting");
    }, duration);
  };
  var slideDown = (target, duration = 500) => {
    target.classList.add("transiting");
    target.style.removeProperty("display");
    target.classList.add("show");
    let height = target.offsetHeight;
    target.style.overflow = "hidden";
    target.style.height = "0";
    target.style.paddingTop = "0";
    target.style.paddingBottom = "0";
    target.style.marginTop = "0";
    target.style.marginBottom = "0";
    target.offsetHeight;
    target.style.transitionProperty = "height, margin, padding";
    target.style.transitionDuration = duration + "ms";
    target.style.height = height + "px";
    target.style.removeProperty("padding-top");
    target.style.removeProperty("padding-bottom");
    target.style.removeProperty("margin-top");
    target.style.removeProperty("margin-bottom");
    window.setTimeout(() => {
      target.style.removeProperty("height");
      target.style.removeProperty("overflow");
      target.style.removeProperty("transition-duration");
      target.style.removeProperty("transition-property");
      target.classList.remove("transiting");
    }, duration);
  };
  var slideToggle = (target, duration = 500) => {
    if (window.getComputedStyle(target).display === "none") {
      return slideDown(target, duration);
    } else {
      return slideUp(target, duration);
    }
  };
  function menu_default() {
    const toggleMenu = document.getElementById("toggle-menu");
    if (toggleMenu) {
      toggleMenu.addEventListener("click", () => {
        if (document.getElementById("main-menu").classList.contains("transiting")) return;
        document.body.classList.toggle("show-menu");
        slideToggle(document.getElementById("main-menu"), 300);
        toggleMenu.classList.toggle("is-active");
      });
    }
  }

  // ns-hugo-imp:C:\Users\16643\Desktop\blog\hugo\blog\themes\hugo-theme-stack\assets\ts\createElement.ts
  function createElement(tag, attrs, children) {
    var element = document.createElement(tag);
    for (let name in attrs) {
      if (name && attrs.hasOwnProperty(name)) {
        let value = attrs[name];
        if (name == "dangerouslySetInnerHTML") {
          element.innerHTML = value.__html;
        } else if (value === true) {
          element.setAttribute(name, name);
        } else if (value !== false && value != null) {
          element.setAttribute(name, value.toString());
        }
      }
    }
    for (let i = 2; i < arguments.length; i++) {
      let child = arguments[i];
      if (child) {
        element.appendChild(
          child.nodeType == null ? document.createTextNode(child.toString()) : child
        );
      }
    }
    return element;
  }
  var createElement_default = createElement;

  // ns-hugo-imp:C:\Users\16643\Desktop\blog\hugo\blog\themes\hugo-theme-stack\assets\ts\colorScheme.ts
  var StackColorScheme = class {
    localStorageKey = "StackColorScheme";
    currentScheme;
    systemPreferScheme;
    constructor(toggleEl) {
      this.bindMatchMedia();
      this.currentScheme = this.getSavedScheme();
      if (window.matchMedia("(prefers-color-scheme: dark)").matches === true)
        this.systemPreferScheme = "dark";
      else
        this.systemPreferScheme = "light";
      this.dispatchEvent(document.documentElement.dataset.scheme);
      if (toggleEl)
        this.bindClick(toggleEl);
      if (document.body.style.transition == "")
        document.body.style.setProperty("transition", "background-color .3s ease");
    }
    saveScheme() {
      localStorage.setItem(this.localStorageKey, this.currentScheme);
    }
    bindClick(toggleEl) {
      toggleEl.addEventListener("click", (e) => {
        if (this.isDark()) {
          this.currentScheme = "light";
        } else {
          this.currentScheme = "dark";
        }
        this.setBodyClass();
        if (this.currentScheme == this.systemPreferScheme) {
          this.currentScheme = "auto";
        }
        this.saveScheme();
      });
    }
    isDark() {
      return this.currentScheme == "dark" || this.currentScheme == "auto" && this.systemPreferScheme == "dark";
    }
    dispatchEvent(colorScheme) {
      const event = new CustomEvent("onColorSchemeChange", {
        detail: colorScheme
      });
      window.dispatchEvent(event);
    }
    setBodyClass() {
      if (this.isDark()) {
        document.documentElement.dataset.scheme = "dark";
      } else {
        document.documentElement.dataset.scheme = "light";
      }
      this.dispatchEvent(document.documentElement.dataset.scheme);
    }
    getSavedScheme() {
      const savedScheme = localStorage.getItem(this.localStorageKey);
      if (savedScheme == "light" || savedScheme == "dark" || savedScheme == "auto") return savedScheme;
      else return "auto";
    }
    bindMatchMedia() {
      window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
        if (e.matches) {
          this.systemPreferScheme = "dark";
        } else {
          this.systemPreferScheme = "light";
        }
        this.setBodyClass();
      });
    }
  };
  var colorScheme_default = StackColorScheme;

  // ns-hugo-imp:C:\Users\16643\Desktop\blog\hugo\blog\themes\hugo-theme-stack\assets\ts\scrollspy.ts
  function debounced(func) {
    let timeout;
    return () => {
      if (timeout) {
        window.cancelAnimationFrame(timeout);
      }
      timeout = window.requestAnimationFrame(() => func());
    };
  }
  var headersQuery = ".article-content h1[id], .article-content h2[id], .article-content h3[id], .article-content h4[id], .article-content h5[id], .article-content h6[id]";
  var tocQuery = "#TableOfContents";
  var navigationQuery = "#TableOfContents li";
  var activeClass = "active-class";
  function scrollToTocElement(tocElement, scrollableNavigation) {
    let textHeight = tocElement.querySelector("a").offsetHeight;
    let scrollTop = tocElement.offsetTop - scrollableNavigation.offsetHeight / 2 + textHeight / 2 - scrollableNavigation.offsetTop;
    if (scrollTop < 0) {
      scrollTop = 0;
    }
    scrollableNavigation.scrollTo({ top: scrollTop, behavior: "smooth" });
  }
  function buildIdToNavigationElementMap(navigation) {
    const sectionLinkRef = {};
    navigation.forEach((navigationElement) => {
      const link = navigationElement.querySelector("a");
      const href = link.getAttribute("href");
      if (href.startsWith("#")) {
        sectionLinkRef[href.slice(1)] = navigationElement;
      }
    });
    return sectionLinkRef;
  }
  function computeOffsets(headers) {
    let sectionsOffsets = [];
    headers.forEach((header) => {
      sectionsOffsets.push({ id: header.id, offset: header.offsetTop });
    });
    sectionsOffsets.sort((a, b) => a.offset - b.offset);
    return sectionsOffsets;
  }
  function setupScrollspy() {
    let headers = document.querySelectorAll(headersQuery);
    if (!headers) {
      console.warn("No header matched query", headers);
      return;
    }
    let scrollableNavigation = document.querySelector(tocQuery);
    if (!scrollableNavigation) {
      console.warn("No toc matched query", tocQuery);
      return;
    }
    let navigation = document.querySelectorAll(navigationQuery);
    if (!navigation) {
      console.warn("No navigation matched query", navigationQuery);
      return;
    }
    let sectionsOffsets = computeOffsets(headers);
    let tocHovered = false;
    scrollableNavigation.addEventListener("mouseenter", debounced(() => tocHovered = true));
    scrollableNavigation.addEventListener("mouseleave", debounced(() => tocHovered = false));
    let activeSectionLink;
    let idToNavigationElement = buildIdToNavigationElementMap(navigation);
    function scrollHandler() {
      let scrollPosition = document.documentElement.scrollTop || document.body.scrollTop;
      let newActiveSection;
      sectionsOffsets.forEach((section) => {
        if (scrollPosition >= section.offset - 20) {
          newActiveSection = document.getElementById(section.id);
        }
      });
      let newActiveSectionLink;
      if (newActiveSection) {
        newActiveSectionLink = idToNavigationElement[newActiveSection.id];
      }
      if (newActiveSection && !newActiveSectionLink) {
        console.debug("No link found for section", newActiveSection);
      } else if (newActiveSectionLink !== activeSectionLink) {
        if (activeSectionLink)
          activeSectionLink.classList.remove(activeClass);
        if (newActiveSectionLink) {
          newActiveSectionLink.classList.add(activeClass);
          if (!tocHovered) {
            scrollToTocElement(newActiveSectionLink, scrollableNavigation);
          }
        }
        activeSectionLink = newActiveSectionLink;
      }
    }
    window.addEventListener("scroll", debounced(scrollHandler));
    function resizeHandler() {
      sectionsOffsets = computeOffsets(headers);
      scrollHandler();
    }
    window.addEventListener("resize", debounced(resizeHandler));
  }

  // ns-hugo-imp:C:\Users\16643\Desktop\blog\hugo\blog\themes\hugo-theme-stack\assets\ts\smoothAnchors.ts
  var anchorLinksQuery = "a[href]";
  function setupSmoothAnchors() {
    document.querySelectorAll(anchorLinksQuery).forEach((aElement) => {
      let href = aElement.getAttribute("href");
      if (!href.startsWith("#")) {
        return;
      }
      aElement.addEventListener("click", (clickEvent) => {
        clickEvent.preventDefault();
        const targetId = decodeURI(aElement.getAttribute("href").substring(1)), target = document.getElementById(targetId), offset = target.getBoundingClientRect().top - document.documentElement.getBoundingClientRect().top;
        window.history.pushState({}, "", aElement.getAttribute("href"));
        scrollTo({
          top: offset,
          behavior: "smooth"
        });
      });
    });
  }

  // ns-hugo-imp:C:\Users\16643\Desktop\blog\hugo\blog\assets\ts\auth.ts
  var StackAuth = class {
    localStorageKey = "StackAdminAuth";
    attemptsKey = "StackAuthAttempts";
    timestampKey = "StackAuthTimestamp";
    currentStatus;
    config;
    constructor(config) {
      this.config = {
        adminPassword: "admit",
        sessionTimeout: 24 * 60 * 60 * 1e3,
        // 24 hours
        maxLoginAttempts: 5,
        ...config
      };
      this.currentStatus = this.getSavedAuthStatus();
      this.cleanupExpiredSession();
      this.dispatchAuthEvent(this.currentStatus);
    }
    /**
     * Authenticate user with password
     * @param password - The password to verify
     * @returns boolean - Authentication result
     */
    authenticate(password) {
      if (this.isBlocked()) {
        this.dispatchAuthEvent("blocked");
        return false;
      }
      if (password === this.config.adminPassword) {
        this.currentStatus = "authenticated";
        this.saveAuthStatus();
        this.clearLoginAttempts();
        this.dispatchAuthEvent("authenticated");
        return true;
      } else {
        this.incrementLoginAttempts();
        this.dispatchAuthEvent("failed");
        return false;
      }
    }
    /**
     * Logout current user
     */
    logout() {
      this.currentStatus = "guest";
      this.clearAuthData();
      this.dispatchAuthEvent("guest");
    }
    /**
     * Check if user is authenticated
     * @returns boolean - Authentication status
     */
    isAuthenticated() {
      if (this.isSessionExpired()) {
        this.logout();
        return false;
      }
      return this.currentStatus === "authenticated";
    }
    /**
     * Check if user is admin
     * @returns boolean - Admin status
     */
    isAdmin() {
      return this.isAuthenticated();
    }
    /**
     * Get current authentication status
     * @returns authStatus - Current status
     */
    getStatus() {
      return this.currentStatus;
    }
    /**
     * Check if login attempts are blocked
     * @returns boolean - Block status
     */
    isBlocked() {
      const attempts = this.getLoginAttempts();
      return attempts >= this.config.maxLoginAttempts;
    }
    /**
     * Get remaining login attempts
     * @returns number - Remaining attempts
     */
    getRemainingAttempts() {
      const attempts = this.getLoginAttempts();
      return Math.max(0, this.config.maxLoginAttempts - attempts);
    }
    /**
     * Reset login attempts (for admin use)
     */
    resetLoginAttempts() {
      this.clearLoginAttempts();
    }
    /**
     * Save authentication status to localStorage
     */
    saveAuthStatus() {
      localStorage.setItem(this.localStorageKey, this.currentStatus);
      localStorage.setItem(this.timestampKey, Date.now().toString());
    }
    /**
     * Get saved authentication status from localStorage
     */
    getSavedAuthStatus() {
      const savedStatus = localStorage.getItem(this.localStorageKey);
      if (savedStatus === "authenticated") {
        return "authenticated";
      }
      return "guest";
    }
    /**
     * Check if session is expired
     */
    isSessionExpired() {
      const timestamp = localStorage.getItem(this.timestampKey);
      if (!timestamp) return true;
      const sessionTime = parseInt(timestamp);
      const currentTime = Date.now();
      return currentTime - sessionTime > this.config.sessionTimeout;
    }
    /**
     * Clean up expired session
     */
    cleanupExpiredSession() {
      if (this.isSessionExpired()) {
        this.clearAuthData();
        this.currentStatus = "guest";
      }
    }
    /**
     * Clear all authentication data
     */
    clearAuthData() {
      localStorage.removeItem(this.localStorageKey);
      localStorage.removeItem(this.timestampKey);
    }
    /**
     * Get login attempts count
     */
    getLoginAttempts() {
      const attempts = localStorage.getItem(this.attemptsKey);
      return attempts ? parseInt(attempts) : 0;
    }
    /**
     * Increment login attempts
     */
    incrementLoginAttempts() {
      const attempts = this.getLoginAttempts() + 1;
      localStorage.setItem(this.attemptsKey, attempts.toString());
    }
    /**
     * Clear login attempts
     */
    clearLoginAttempts() {
      localStorage.removeItem(this.attemptsKey);
    }
    /**
     * Dispatch authentication event
     */
    dispatchAuthEvent(status) {
      const event = new CustomEvent("onAuthStatusChange", {
        detail: {
          status,
          isAuthenticated: this.isAuthenticated(),
          isAdmin: this.isAdmin(),
          remainingAttempts: this.getRemainingAttempts()
        }
      });
      window.dispatchEvent(event);
    }
  };
  var AuthUtils = {
    /**
     * Show/hide elements based on authentication status
     */
    toggleAdminElements: (isAdmin) => {
      const adminElements = document.querySelectorAll("[data-admin-only]");
      const guestElements = document.querySelectorAll("[data-guest-only]");
      adminElements.forEach((element) => {
        element.style.display = isAdmin ? "" : "none";
      });
      guestElements.forEach((element) => {
        element.style.display = isAdmin ? "none" : "";
      });
    },
    /**
     * Add admin class to body for CSS styling
     */
    updateBodyClass: (isAdmin) => {
      if (isAdmin) {
        document.body.classList.add("admin-mode");
        document.body.classList.remove("guest-mode");
      } else {
        document.body.classList.add("guest-mode");
        document.body.classList.remove("admin-mode");
      }
    },
    /**
     * Create login modal HTML
     */
    createLoginModal: () => {
      return `
            <div id="admin-login-modal" class="admin-modal" style="display: none;">
                <div class="admin-modal-content">
                    <div class="admin-modal-header">
                        <h3>
                            <div class="admin-icon-wrapper">
                                <svg class="admin-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                    <circle cx="12" cy="16" r="1"></circle>
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                </svg>
                            </div>
                            <span class="admin-title-text">\u7BA1\u7406\u5458\u767B\u5F55</span>
                        </h3>
                        <button class="admin-modal-close" id="admin-modal-close" type="button" aria-label="\u5173\u95ED\u767B\u5F55\u7A97\u53E3">
                            <svg class="admin-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                    <div class="admin-modal-body">
                        <form id="admin-login-form" novalidate>
                            <div class="admin-form-group">
                                <label for="admin-password">
                                    <svg class="admin-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                        <circle cx="12" cy="16" r="1"></circle>
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                    </svg>
                                    \u7BA1\u7406\u5458\u5BC6\u7801
                                </label>
                                <input
                                    type="password"
                                    id="admin-password"
                                    name="password"
                                    placeholder="\u8BF7\u8F93\u5165\u7BA1\u7406\u5458\u5BC6\u7801"
                                    autocomplete="current-password"
                                    required
                                    aria-describedby="admin-login-error admin-login-attempts"
                                >
                            </div>
                            <div class="admin-form-actions">
                                <button type="submit" id="admin-login-btn" class="admin-btn admin-btn-primary">
                                    <svg class="admin-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                                        <polyline points="10,17 15,12 10,7"></polyline>
                                        <line x1="15" y1="12" x2="3" y2="12"></line>
                                    </svg>
                                    \u767B\u5F55
                                </button>
                                <button type="button" id="admin-cancel-btn" class="admin-btn admin-btn-secondary">
                                    <svg class="admin-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                    </svg>
                                    \u53D6\u6D88
                                </button>
                            </div>
                            <div id="admin-login-error" class="admin-error" style="display: none;" role="alert" aria-live="polite">
                                <!-- Error message will be inserted here -->
                            </div>
                            <div id="admin-login-attempts" class="admin-info" style="display: none;" role="status" aria-live="polite">
                                <!-- Attempts info will be inserted here -->
                            </div>
                        </form>
                        <div class="admin-login-help">
                            <p class="admin-help-text">
                                <svg class="admin-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                                </svg>
                                \u63D0\u793A\uFF1A\u4F7F\u7528\u5FEB\u6377\u952E <kbd>Ctrl + Alt + A</kbd> \u53EF\u5FEB\u901F\u6253\u5F00\u767B\u5F55\u7A97\u53E3
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
    /**
     * Show login modal
     */
    showLoginModal: () => {
      const modal = document.getElementById("admin-login-modal");
      if (modal) {
        modal.style.display = "flex";
        AuthUtils.clearMessages();
        setTimeout(() => {
          const passwordInput = document.getElementById("admin-password");
          if (passwordInput) {
            passwordInput.focus();
            passwordInput.select();
          }
        }, 150);
      } else {
        console.warn("Admin login modal not found. Creating modal...");
        const modalHTML = AuthUtils.createLoginModal();
        document.body.insertAdjacentHTML("beforeend", modalHTML);
        setTimeout(() => AuthUtils.showLoginModal(), 100);
      }
    },
    /**
     * Hide login modal
     */
    hideLoginModal: () => {
      const modal = document.getElementById("admin-login-modal");
      if (modal) {
        modal.style.display = "none";
        const form = document.getElementById("admin-login-form");
        if (form) {
          form.reset();
        }
        const errorDiv = document.getElementById("admin-login-error");
        const attemptsDiv = document.getElementById("admin-login-attempts");
        if (errorDiv) errorDiv.style.display = "none";
        if (attemptsDiv) attemptsDiv.style.display = "none";
      }
    },
    /**
     * Show error message in login modal
     */
    showLoginError: (message) => {
      const errorDiv = document.getElementById("admin-login-error");
      if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.display = "block";
      }
    },
    /**
     * Show attempts info in login modal
     */
    showAttemptsInfo: (remaining) => {
      const attemptsDiv = document.getElementById("admin-login-attempts");
      if (attemptsDiv) {
        attemptsDiv.textContent = `\u5269\u4F59\u5C1D\u8BD5\u6B21\u6570: ${remaining}`;
        attemptsDiv.style.display = "block";
      }
    },
    /**
     * Set login button loading state
     */
    setLoginButtonLoading: (loading) => {
      const loginBtn = document.getElementById("admin-login-btn");
      if (loginBtn) {
        if (loading) {
          loginBtn.disabled = true;
          loginBtn.classList.add("loading");
        } else {
          loginBtn.disabled = false;
          loginBtn.classList.remove("loading");
        }
      }
    },
    /**
     * Clear all error and info messages
     */
    clearMessages: () => {
      const errorDiv = document.getElementById("admin-login-error");
      const attemptsDiv = document.getElementById("admin-login-attempts");
      if (errorDiv) errorDiv.style.display = "none";
      if (attemptsDiv) attemptsDiv.style.display = "none";
    },
    /**
     * Validate password input
     */
    validatePassword: (password) => {
      if (!password) {
        return { valid: false, message: "\u8BF7\u8F93\u5165\u5BC6\u7801" };
      }
      if (password.length < 1) {
        return { valid: false, message: "\u5BC6\u7801\u4E0D\u80FD\u4E3A\u7A7A" };
      }
      return { valid: true };
    },
    /**
     * Create admin panel HTML
     */
    createAdminPanel: () => {
      return `
            <div id="admin-panel-modal" class="admin-modal" style="display: none;">
                <div class="admin-panel-content">
                    <div class="admin-panel-header">
                        <h2>
                            <div class="admin-icon-wrapper">
                                <svg class="admin-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M12.22 2h-.44a2 2 0 00-2 2v.18a2 2 0 01-1 1.73l-.43.25a2 2 0 01-2 0l-.15-.08a2 2 0 00-2.73.73l-.22.38a2 2 0 00.73 2.73l.15.1a2 2 0 011 1.72v.51a2 2 0 01-1 1.74l-.15.09a2 2 0 00-.73 2.73l.22.38a2 2 0 002.73.73l.15-.08a2 2 0 012 0l.43.25a2 2 0 011 1.73V20a2 2 0 002 2h.44a2 2 0 002-2v-.18a2 2 0 011-1.73l.43-.25a2 2 0 012 0l.15.08a2 2 0 002.73-.73l.22-.39a2 2 0 00-.73-2.73l-.15-.08a2 2 0 01-1-1.74v-.5a2 2 0 011-1.74l.15-.09a2 2 0 00.73-2.73l-.22-.38a2 2 0 00-2.73-.73l-.15.08a2 2 0 01-2 0l-.43-.25a2 2 0 01-1-1.73V4a2 2 0 00-2-2z"></path>
                                    <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                            </div>
                            <span class="admin-title-text">\u7BA1\u7406\u5458\u9762\u677F</span>
                        </h2>
                        <button class="admin-modal-close" id="admin-panel-close" type="button" aria-label="\u5173\u95ED\u7BA1\u7406\u9762\u677F">
                            <svg class="admin-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                    <div class="admin-panel-body">
                        <div class="admin-tabs">
                            <button class="admin-tab-btn active" data-tab="profile">\u4E2A\u4EBA\u8D44\u6599</button>
                            <button class="admin-tab-btn" data-tab="content">\u5185\u5BB9\u7BA1\u7406</button>
                            <button class="admin-tab-btn" data-tab="settings">\u7AD9\u70B9\u8BBE\u7F6E</button>
                        </div>
                        <div class="admin-tab-content">
                            <div id="admin-tab-profile" class="admin-tab-panel active">
                                <div class="admin-section">
                                    <h3>\u5934\u50CF\u8BBE\u7F6E</h3>
                                    <div class="admin-avatar-section">
                                        <div class="admin-avatar-preview">
                                            <img id="admin-avatar-img" src="/img/avatar_hu_f509edb42ecc0ebd.png" alt="\u5F53\u524D\u5934\u50CF">
                                            <div class="admin-avatar-overlay">
                                                <svg class="admin-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                    <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"></path>
                                                    <circle cx="12" cy="13" r="4"></circle>
                                                </svg>
                                            </div>
                                        </div>
                                        <div class="admin-avatar-controls">
                                            <input type="file" id="admin-avatar-upload" accept="image/*" style="display: none;">
                                            <button class="admin-btn admin-btn-primary" onclick="document.getElementById('admin-avatar-upload').click()">
                                                <svg class="admin-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"></path>
                                                    <polyline points="7,10 12,15 17,10"></polyline>
                                                    <line x1="12" y1="15" x2="12" y2="3"></line>
                                                </svg>
                                                \u4E0A\u4F20\u5934\u50CF
                                            </button>
                                            <button class="admin-btn admin-btn-secondary" id="admin-avatar-reset">
                                                <svg class="admin-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                    <polyline points="1,4 1,10 7,10"></polyline>
                                                    <path d="M3.51 15a9 9 0 102.13-9.36L1 10"></path>
                                                </svg>
                                                \u91CD\u7F6E\u9ED8\u8BA4
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div class="admin-section">
                                    <h3>\u4E2A\u4EBA\u4FE1\u606F</h3>
                                    <div class="admin-form-group">
                                        <label for="admin-site-title">\u7AD9\u70B9\u6807\u9898</label>
                                        <input type="text" id="admin-site-title" value="lanniny-blog" placeholder="\u8F93\u5165\u7AD9\u70B9\u6807\u9898">
                                    </div>
                                    <div class="admin-form-group">
                                        <label for="admin-site-description">\u7AD9\u70B9\u63CF\u8FF0</label>
                                        <textarea id="admin-site-description" placeholder="\u8F93\u5165\u7AD9\u70B9\u63CF\u8FF0" rows="3">\u6F14\u793A\u6587\u7A3F</textarea>
                                    </div>
                                </div>
                            </div>
                            <div id="admin-tab-content" class="admin-tab-panel">
                                <div class="admin-section">
                                    <h3>\u5FEB\u901F\u64CD\u4F5C</h3>
                                    <div class="admin-quick-actions">
                                        <button class="admin-action-btn" id="admin-new-post">
                                            <svg class="admin-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                <path d="M14.5 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V7.5L14.5 2z"></path>
                                                <polyline points="14,2 14,8 20,8"></polyline>
                                                <line x1="16" y1="13" x2="8" y2="13"></line>
                                                <line x1="16" y1="17" x2="8" y2="17"></line>
                                                <polyline points="10,9 9,9 8,9"></polyline>
                                            </svg>
                                            <span>\u65B0\u5EFA\u6587\u7AE0</span>
                                        </button>
                                        <button class="admin-action-btn" id="admin-manage-posts">
                                            <svg class="admin-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"></path>
                                                <polyline points="14,2 14,8 20,8"></polyline>
                                                <line x1="16" y1="13" x2="8" y2="13"></line>
                                                <line x1="16" y1="17" x2="8" y2="17"></line>
                                            </svg>
                                            <span>\u7BA1\u7406\u6587\u7AE0</span>
                                        </button>
                                        <button class="admin-action-btn" id="admin-site-stats">
                                            <svg class="admin-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                <path d="M3 3v18h18"></path>
                                                <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"></path>
                                            </svg>
                                            <span>\u7AD9\u70B9\u7EDF\u8BA1</span>
                                        </button>
                                    </div>
                                </div>
                                <div class="admin-section">
                                    <h3>\u6700\u8FD1\u6587\u7AE0</h3>
                                    <div class="admin-recent-posts">
                                        <div class="admin-post-item">
                                            <div class="admin-post-info">
                                                <h4>Vision Transformer (VIT) \u6E90\u7801\u89E3\u8BFB</h4>
                                                <p>Deep Learning \u2022 2025-01-19</p>
                                            </div>
                                            <div class="admin-post-actions">
                                                <button class="admin-btn-small">\u7F16\u8F91</button>
                                                <button class="admin-btn-small admin-btn-danger">\u5220\u9664</button>
                                            </div>
                                        </div>
                                        <div class="admin-post-item">
                                            <div class="admin-post-info">
                                                <h4>Transformer\u67B6\u6784\u6DF1\u5EA6\u89E3\u6790</h4>
                                                <p>Deep Learning \u2022 2025-01-19</p>
                                            </div>
                                            <div class="admin-post-actions">
                                                <button class="admin-btn-small">\u7F16\u8F91</button>
                                                <button class="admin-btn-small admin-btn-danger">\u5220\u9664</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div id="admin-tab-settings" class="admin-tab-panel">
                                <div class="admin-section">
                                    <h3>\u4E3B\u9898\u8BBE\u7F6E</h3>
                                    <div class="admin-form-group">
                                        <label for="admin-theme-color">\u4E3B\u9898\u8272\u5F69</label>
                                        <div class="admin-color-picker">
                                            <input type="color" id="admin-theme-color" value="#34495e">
                                            <span class="admin-color-preview"></span>
                                        </div>
                                    </div>
                                    <div class="admin-form-group">
                                        <label>
                                            <input type="checkbox" id="admin-dark-mode-default"> \u9ED8\u8BA4\u6DF1\u8272\u6A21\u5F0F
                                        </label>
                                    </div>
                                </div>
                                <div class="admin-section">
                                    <h3>\u5B89\u5168\u8BBE\u7F6E</h3>
                                    <div class="admin-form-group">
                                        <label for="admin-new-password">\u66F4\u6539\u7BA1\u7406\u5458\u5BC6\u7801</label>
                                        <input type="password" id="admin-new-password" placeholder="\u8F93\u5165\u65B0\u5BC6\u7801">
                                    </div>
                                    <button class="admin-btn admin-btn-primary" id="admin-change-password">\u66F4\u65B0\u5BC6\u7801</button>
                                </div>
                            </div>
                        </div>
                        <div class="admin-panel-footer">
                            <button class="admin-btn admin-btn-primary" id="admin-save-settings">
                                <svg class="admin-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"></path>
                                    <polyline points="17,21 17,13 7,13 7,21"></polyline>
                                    <polyline points="7,3 7,8 15,8"></polyline>
                                </svg>
                                \u4FDD\u5B58\u8BBE\u7F6E
                            </button>
                            <button class="admin-btn admin-btn-secondary" id="admin-panel-cancel">\u53D6\u6D88</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
  };
  var auth_default = StackAuth;

  // <stdin>
  var globalAuth;
  var Stack = {
    init: () => {
      globalAuth = new auth_default();
      window.addEventListener("onAuthStatusChange", (e) => {
        const { status, isAuthenticated, isAdmin: isAdmin2, remainingAttempts } = e.detail;
        AuthUtils.toggleAdminElements(isAdmin2);
        AuthUtils.updateBodyClass(isAdmin2);
        switch (status) {
          case "authenticated":
            AuthUtils.hideLoginModal();
            console.log("Admin authenticated successfully");
            break;
          case "failed":
            AuthUtils.showLoginError("\u5BC6\u7801\u9519\u8BEF");
            if (remainingAttempts > 0) {
              AuthUtils.showAttemptsInfo(remainingAttempts);
            }
            break;
          case "blocked":
            AuthUtils.showLoginError("\u767B\u5F55\u5C1D\u8BD5\u6B21\u6570\u8FC7\u591A\uFF0C\u8BF7\u7A0D\u540E\u518D\u8BD5");
            break;
          case "guest":
            console.log("User logged out or session expired");
            break;
        }
      });
      console.log("Creating login modal...");
      const modalHTML = AuthUtils.createLoginModal();
      document.body.insertAdjacentHTML("beforeend", modalHTML);
      console.log("Login modal created");
      console.log("Checking for admin panel in HTML...");
      const panel = document.getElementById("admin-panel-modal");
      if (panel) {
        console.log("\u2705 Admin panel found in HTML template");
      } else {
        console.error("\u274C Admin panel not found in HTML template!");
      }
      Stack.bindAuthEvents();
      Stack.bindAdminPanelEvents();
      const isAdmin = globalAuth.isAuthenticated();
      AuthUtils.toggleAdminElements(isAdmin);
      AuthUtils.updateBodyClass(isAdmin);
      Stack.loadAdminSettings();
      console.log("\u2705 Stack initialization complete");
      menu_default();
      const articleContent = document.querySelector(".article-content");
      if (articleContent) {
        new gallery_default(articleContent);
        setupSmoothAnchors();
        setupScrollspy();
      }
      const articleTile = document.querySelector(".article-list--tile");
      if (articleTile) {
        let observer = new IntersectionObserver(async (entries, observer2) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            observer2.unobserve(entry.target);
            const articles = entry.target.querySelectorAll("article.has-image");
            articles.forEach(async (articles2) => {
              const image = articles2.querySelector("img"), imageURL = image.src, key = image.getAttribute("data-key"), hash = image.getAttribute("data-hash"), articleDetails = articles2.querySelector(".article-details");
              const colors = await getColor(key, hash, imageURL);
              articleDetails.style.background = `
                        linear-gradient(0deg, 
                            rgba(${colors.DarkMuted.rgb[0]}, ${colors.DarkMuted.rgb[1]}, ${colors.DarkMuted.rgb[2]}, 0.5) 0%, 
                            rgba(${colors.Vibrant.rgb[0]}, ${colors.Vibrant.rgb[1]}, ${colors.Vibrant.rgb[2]}, 0.75) 100%)`;
            });
          });
        });
        observer.observe(articleTile);
      }
      const highlights = document.querySelectorAll(".article-content div.highlight");
      const copyText = `Copy`, copiedText = `Copied!`;
      highlights.forEach((highlight) => {
        const copyButton = document.createElement("button");
        copyButton.innerHTML = copyText;
        copyButton.classList.add("copyCodeButton");
        highlight.appendChild(copyButton);
        const codeBlock = highlight.querySelector("code[data-lang]");
        if (!codeBlock) return;
        copyButton.addEventListener("click", () => {
          navigator.clipboard.writeText(codeBlock.textContent).then(() => {
            copyButton.textContent = copiedText;
            setTimeout(() => {
              copyButton.textContent = copyText;
            }, 1e3);
          }).catch((err) => {
            alert(err);
            console.log("Something went wrong", err);
          });
        });
      });
      new colorScheme_default(document.getElementById("dark-mode-toggle"));
      setTimeout(() => {
        const panel2 = document.getElementById("admin-panel-modal");
        if (!panel2) {
          console.log("\u{1F504} Admin panel not found after initialization, creating backup...");
          const backupPanelHTML = Stack.createAdminPanelHTML();
          document.body.insertAdjacentHTML("beforeend", backupPanelHTML);
          const backupPanel = document.getElementById("admin-panel-modal");
          if (backupPanel) {
            console.log("\u2705 Backup admin panel created successfully");
            Stack.bindAdminPanelEvents();
          } else {
            console.error("\u274C Backup admin panel creation also failed");
          }
        } else {
          console.log("\u2705 Admin panel already exists, no backup needed");
        }
      }, 1e3);
    },
    /**
     * Bind authentication related events
     */
    bindAuthEvents: () => {
      const loginForm = document.getElementById("admin-login-form");
      if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
          e.preventDefault();
          const passwordInput = document.getElementById("admin-password");
          if (passwordInput) {
            globalAuth.authenticate(passwordInput.value);
          }
        });
      }
      const closeBtn = document.getElementById("admin-modal-close");
      const cancelBtn = document.getElementById("admin-cancel-btn");
      if (closeBtn) {
        closeBtn.addEventListener("click", () => {
          AuthUtils.hideLoginModal();
        });
      }
      if (cancelBtn) {
        cancelBtn.addEventListener("click", () => {
          AuthUtils.hideLoginModal();
        });
      }
      const modal = document.getElementById("admin-login-modal");
      if (modal) {
        modal.addEventListener("click", (e) => {
          if (e.target === modal) {
            AuthUtils.hideLoginModal();
          }
        });
      }
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          AuthUtils.hideLoginModal();
        }
      });
      const adminPanelToggle = document.getElementById("admin-panel-toggle");
      if (adminPanelToggle) {
        adminPanelToggle.addEventListener("click", (e) => {
          e.preventDefault();
          Stack.showAdminPanel();
        });
      }
      document.addEventListener("click", (e) => {
        const target = e.target;
        if (target) {
          const clickedText = target.textContent || "";
          const parentText = target.parentElement?.textContent || "";
          const linkText = target.closest("a")?.textContent || "";
          const isAdminPanelClick = clickedText.trim() === "\u7BA1\u7406\u9762\u677F" || clickedText.includes("\u7BA1\u7406\u9762\u677F") || parentText.includes("\u7BA1\u7406\u9762\u677F") || linkText.includes("\u7BA1\u7406\u9762\u677F") || target.id === "admin-panel-toggle" || target.closest("#admin-panel-toggle") || target.classList.contains("admin-panel-trigger");
          if (isAdminPanelClick) {
            e.preventDefault();
            e.stopPropagation();
            console.log("Admin panel click detected:", target);
            console.log("Clicked text:", clickedText);
            if (globalAuth && globalAuth.isAuthenticated()) {
              console.log("User is authenticated, showing admin panel");
              Stack.showAdminPanel();
            } else {
              console.log("User not authenticated, cannot show admin panel");
            }
          }
        }
      }, true);
    },
    /**
     * Bind admin panel related events
     */
    bindAdminPanelEvents: () => {
      console.log("Binding admin panel events...");
      const panelCloseBtn = document.getElementById("admin-panel-close");
      const panelCancelBtn = document.getElementById("admin-panel-cancel");
      if (panelCloseBtn) {
        panelCloseBtn.addEventListener("click", () => {
          Stack.hideAdminPanel();
        });
      }
      if (panelCancelBtn) {
        panelCancelBtn.addEventListener("click", () => {
          Stack.hideAdminPanel();
        });
      }
      const panel = document.getElementById("admin-panel-modal");
      if (panel) {
        panel.addEventListener("click", (e) => {
          if (e.target === panel) {
            Stack.hideAdminPanel();
          }
        });
      }
      const tabBtns = document.querySelectorAll(".admin-tab-btn");
      tabBtns.forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const target = e.target;
          const tabName = target.getAttribute("data-tab");
          if (tabName) {
            Stack.switchAdminTab(tabName);
          }
        });
      });
      const avatarUpload = document.getElementById("admin-avatar-upload");
      if (avatarUpload) {
        avatarUpload.addEventListener("change", (e) => {
          const target = e.target;
          if (target.files && target.files[0]) {
            Stack.handleAvatarUpload(target.files[0]);
          }
        });
      }
      const avatarReset = document.getElementById("admin-avatar-reset");
      if (avatarReset) {
        avatarReset.addEventListener("click", () => {
          Stack.resetAvatar();
        });
      }
      const saveSettings = document.getElementById("admin-save-settings");
      if (saveSettings) {
        saveSettings.addEventListener("click", () => {
          Stack.saveAdminSettings();
        });
      }
      const themeColor = document.getElementById("admin-theme-color");
      if (themeColor) {
        themeColor.addEventListener("change", (e) => {
          const target = e.target;
          Stack.updateThemeColor(target.value);
        });
      }
      const changePassword = document.getElementById("admin-change-password");
      if (changePassword) {
        changePassword.addEventListener("click", () => {
          Stack.changeAdminPassword();
        });
      }
      console.log("Admin panel events bound successfully");
    },
    /**
     * Get global auth instance
     */
    getAuth: () => {
      return globalAuth;
    },
    /**
     * Show admin login modal
     */
    showLogin: () => {
      AuthUtils.showLoginModal();
    },
    /**
     * Admin logout
     */
    logout: () => {
      if (globalAuth) {
        globalAuth.logout();
      }
    },
    /**
     * Show admin panel
     */
    showAdminPanel: () => {
      console.log("\u{1F3AF} showAdminPanel called");
      const panel = document.getElementById("admin-panel-modal");
      if (panel) {
        console.log("\u2705 Panel found in HTML, showing it");
        panel.style.display = "flex";
        Stack.loadAdminSettings();
      } else {
        console.error("\u274C Admin panel not found in HTML! This should not happen since it is in the template.");
      }
    },
    /**
     * Hide admin panel
     */
    hideAdminPanel: () => {
      const panel = document.getElementById("admin-panel-modal");
      if (panel) {
        panel.style.display = "none";
      }
    },
    /**
     * Switch admin panel tab
     */
    switchAdminTab: (tabName) => {
      document.querySelectorAll(".admin-tab-btn").forEach((btn) => {
        btn.classList.remove("active");
      });
      document.querySelectorAll(".admin-tab-panel").forEach((panel) => {
        panel.classList.remove("active");
      });
      const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
      const selectedPanel = document.getElementById(`admin-tab-${tabName}`);
      if (selectedTab) selectedTab.classList.add("active");
      if (selectedPanel) selectedPanel.classList.add("active");
    },
    /**
     * Handle avatar upload
     */
    handleAvatarUpload: (file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result;
          const avatarImg = document.getElementById("admin-avatar-img");
          if (avatarImg) {
            avatarImg.src = result;
            localStorage.setItem("adminAvatar", result);
            Stack.updateSiteAvatar(result);
          }
        };
        reader.readAsDataURL(file);
      }
    },
    /**
     * Reset avatar to default
     */
    resetAvatar: () => {
      const defaultAvatar = "/img/avatar_hu_f509edb42ecc0ebd.png";
      const avatarImg = document.getElementById("admin-avatar-img");
      if (avatarImg) {
        avatarImg.src = defaultAvatar;
        localStorage.removeItem("adminAvatar");
        Stack.updateSiteAvatar(defaultAvatar);
      }
    },
    /**
     * Update site avatar
     */
    updateSiteAvatar: (avatarUrl) => {
      const siteAvatar = document.querySelector(".site-avatar img");
      if (siteAvatar) {
        siteAvatar.src = avatarUrl;
      }
    },
    /**
     * Load admin settings
     */
    loadAdminSettings: () => {
      const savedAvatar = localStorage.getItem("adminAvatar");
      if (savedAvatar) {
        const avatarImg = document.getElementById("admin-avatar-img");
        if (avatarImg) avatarImg.src = savedAvatar;
        Stack.updateSiteAvatar(savedAvatar);
      }
      const savedTitle = localStorage.getItem("adminSiteTitle");
      if (savedTitle) {
        const titleInput = document.getElementById("admin-site-title");
        if (titleInput) titleInput.value = savedTitle;
        const siteNameEl = document.querySelector(".site-name a");
        if (siteNameEl) siteNameEl.textContent = savedTitle;
      }
      const savedDesc = localStorage.getItem("adminSiteDescription");
      if (savedDesc) {
        const descInput = document.getElementById("admin-site-description");
        if (descInput) descInput.value = savedDesc;
        const siteDescEl = document.querySelector(".site-description");
        if (siteDescEl) siteDescEl.textContent = savedDesc;
      }
      const savedColor = localStorage.getItem("adminThemeColor");
      if (savedColor) {
        const colorInput = document.getElementById("admin-theme-color");
        if (colorInput) colorInput.value = savedColor;
        Stack.updateThemeColor(savedColor);
      }
    },
    /**
     * Save admin settings
     */
    saveAdminSettings: () => {
      const titleInput = document.getElementById("admin-site-title");
      if (titleInput) {
        localStorage.setItem("adminSiteTitle", titleInput.value);
        const siteNameEl = document.querySelector(".site-name a");
        if (siteNameEl) siteNameEl.textContent = titleInput.value;
      }
      const descInput = document.getElementById("admin-site-description");
      if (descInput) {
        localStorage.setItem("adminSiteDescription", descInput.value);
        const siteDescEl = document.querySelector(".site-description");
        if (siteDescEl) siteDescEl.textContent = descInput.value;
      }
      const colorInput = document.getElementById("admin-theme-color");
      if (colorInput) {
        localStorage.setItem("adminThemeColor", colorInput.value);
      }
      Stack.showSuccessMessage("\u8BBE\u7F6E\u5DF2\u4FDD\u5B58\uFF01");
      Stack.hideAdminPanel();
    },
    /**
     * Update theme color
     */
    updateThemeColor: (color) => {
      document.documentElement.style.setProperty("--accent-color", color);
      const preview = document.querySelector(".admin-color-preview");
      if (preview) {
        preview.style.backgroundColor = color;
      }
    },
    /**
     * Change admin password
     */
    changeAdminPassword: () => {
      const newPasswordInput = document.getElementById("admin-new-password");
      if (newPasswordInput && newPasswordInput.value) {
        Stack.showSuccessMessage("\u5BC6\u7801\u66F4\u6539\u529F\u80FD\u9700\u8981\u540E\u7AEF\u652F\u6301\uFF0C\u5F53\u524D\u4E3A\u6F14\u793A\u6A21\u5F0F");
        newPasswordInput.value = "";
      } else {
        Stack.showErrorMessage("\u8BF7\u8F93\u5165\u65B0\u5BC6\u7801");
      }
    },
    /**
     * Show success message
     */
    showSuccessMessage: (message) => {
      Stack.showNotification(message, "success");
    },
    /**
     * Show error message
     */
    showErrorMessage: (message) => {
      Stack.showNotification(message, "error");
    },
    /**
     * Show notification
     */
    showNotification: (message, type = "success") => {
      const notification = document.createElement("div");
      notification.className = `admin-notification admin-notification-${type}`;
      notification.innerHTML = `
            <div class="admin-notification-content">
                <svg class="admin-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    ${type === "success" ? '<path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path><polyline points="22,4 12,14.01 9,11.01"></polyline>' : '<circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line>'}
                </svg>
                <span>${message}</span>
            </div>
        `;
      document.body.appendChild(notification);
      setTimeout(() => notification.classList.add("show"), 100);
      setTimeout(() => {
        notification.classList.remove("show");
        setTimeout(() => {
          if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
          }
        }, 300);
      }, 3e3);
    },
    /**
     * Create admin panel HTML
     */
    createAdminPanelHTML: () => {
      return `
            <div id="admin-panel-modal" class="admin-modal" style="display: none;">
                <div class="admin-panel-content">
                    <div class="admin-panel-header">
                        <h2>
                            <div class="admin-icon-wrapper">
                                <svg class="admin-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M12.22 2h-.44a2 2 0 00-2 2v.18a2 2 0 01-1 1.73l-.43.25a2 2 0 01-2 0l-.15-.08a2 2 0 00-2.73.73l-.22.38a2 2 0 00.73 2.73l.15.1a2 2 0 011 1.72v.51a2 2 0 01-1 1.74l-.15.09a2 2 0 00-.73 2.73l.22.38a2 2 0 002.73.73l.15-.08a2 2 0 012 0l.43.25a2 2 0 011 1.73V20a2 2 0 002 2h.44a2 2 0 002-2v-.18a2 2 0 011-1.73l.43-.25a2 2 0 012 0l.15.08a2 2 0 002.73-.73l.22-.39a2 2 0 00-.73-2.73l-.15-.08a2 2 0 01-1-1.74v-.5a2 2 0 011-1.74l.15-.09a2 2 0 00.73-2.73l-.22-.38a2 2 0 00-2.73-.73l-.15.08a2 2 0 01-2 0l-.43-.25a2 2 0 01-1-1.73V4a2 2 0 00-2-2z"></path>
                                    <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                            </div>
                            <span class="admin-title-text">\u7BA1\u7406\u5458\u9762\u677F</span>
                        </h2>
                        <button class="admin-modal-close" id="admin-panel-close" type="button" aria-label="\u5173\u95ED\u7BA1\u7406\u9762\u677F">
                            <svg class="admin-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                    <div class="admin-panel-body">
                        <div class="admin-tabs">
                            <button class="admin-tab-btn active" data-tab="profile">\u4E2A\u4EBA\u8D44\u6599</button>
                            <button class="admin-tab-btn" data-tab="content">\u5185\u5BB9\u7BA1\u7406</button>
                            <button class="admin-tab-btn" data-tab="settings">\u7AD9\u70B9\u8BBE\u7F6E</button>
                        </div>
                        <div class="admin-tab-content">
                            <div id="admin-tab-profile" class="admin-tab-panel active">
                                <div class="admin-section">
                                    <h3>\u5934\u50CF\u8BBE\u7F6E</h3>
                                    <div class="admin-avatar-section">
                                        <div class="admin-avatar-preview">
                                            <img id="admin-avatar-img" src="/img/avatar_hu_f509edb42ecc0ebd.png" alt="\u5F53\u524D\u5934\u50CF">
                                            <div class="admin-avatar-overlay">
                                                <svg class="admin-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                    <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"></path>
                                                    <circle cx="12" cy="13" r="4"></circle>
                                                </svg>
                                            </div>
                                        </div>
                                        <div class="admin-avatar-controls">
                                            <input type="file" id="admin-avatar-upload" accept="image/*" style="display: none;">
                                            <button class="admin-btn admin-btn-primary" onclick="document.getElementById('admin-avatar-upload').click()">
                                                <svg class="admin-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"></path>
                                                    <polyline points="7,10 12,15 17,10"></polyline>
                                                    <line x1="12" y1="15" x2="12" y2="3"></line>
                                                </svg>
                                                \u4E0A\u4F20\u5934\u50CF
                                            </button>
                                            <button class="admin-btn admin-btn-secondary" id="admin-avatar-reset">
                                                <svg class="admin-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                    <polyline points="1,4 1,10 7,10"></polyline>
                                                    <path d="M3.51 15a9 9 0 102.13-9.36L1 10"></path>
                                                </svg>
                                                \u91CD\u7F6E\u9ED8\u8BA4
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div class="admin-section">
                                    <h3>\u4E2A\u4EBA\u4FE1\u606F</h3>
                                    <div class="admin-form-group">
                                        <label for="admin-site-title">\u7AD9\u70B9\u6807\u9898</label>
                                        <input type="text" id="admin-site-title" value="lanniny-blog" placeholder="\u8F93\u5165\u7AD9\u70B9\u6807\u9898">
                                    </div>
                                    <div class="admin-form-group">
                                        <label for="admin-site-description">\u7AD9\u70B9\u63CF\u8FF0</label>
                                        <textarea id="admin-site-description" placeholder="\u8F93\u5165\u7AD9\u70B9\u63CF\u8FF0" rows="3">\u6F14\u793A\u6587\u7A3F</textarea>
                                    </div>
                                </div>
                            </div>
                            <div id="admin-tab-content" class="admin-tab-panel">
                                <div class="admin-section">
                                    <h3>\u5FEB\u901F\u64CD\u4F5C</h3>
                                    <div class="admin-quick-actions">
                                        <button class="admin-action-btn" id="admin-new-post">
                                            <svg class="admin-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                <path d="M14.5 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V7.5L14.5 2z"></path>
                                                <polyline points="14,2 14,8 20,8"></polyline>
                                                <line x1="16" y1="13" x2="8" y2="13"></line>
                                                <line x1="16" y1="17" x2="8" y2="17"></line>
                                                <polyline points="10,9 9,9 8,9"></polyline>
                                            </svg>
                                            <span>\u65B0\u5EFA\u6587\u7AE0</span>
                                        </button>
                                        <button class="admin-action-btn" id="admin-manage-posts">
                                            <svg class="admin-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"></path>
                                                <polyline points="14,2 14,8 20,8"></polyline>
                                                <line x1="16" y1="13" x2="8" y2="13"></line>
                                                <line x1="16" y1="17" x2="8" y2="17"></line>
                                            </svg>
                                            <span>\u7BA1\u7406\u6587\u7AE0</span>
                                        </button>
                                        <button class="admin-action-btn" id="admin-site-stats">
                                            <svg class="admin-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                <path d="M3 3v18h18"></path>
                                                <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"></path>
                                            </svg>
                                            <span>\u7AD9\u70B9\u7EDF\u8BA1</span>
                                        </button>
                                    </div>
                                </div>
                                <div class="admin-section">
                                    <h3>\u6700\u8FD1\u6587\u7AE0</h3>
                                    <div class="admin-recent-posts">
                                        <div class="admin-post-item">
                                            <div class="admin-post-info">
                                                <h4>Vision Transformer (VIT) \u6E90\u7801\u89E3\u8BFB</h4>
                                                <p>Deep Learning \u2022 2025-01-19</p>
                                            </div>
                                            <div class="admin-post-actions">
                                                <button class="admin-btn-small">\u7F16\u8F91</button>
                                                <button class="admin-btn-small admin-btn-danger">\u5220\u9664</button>
                                            </div>
                                        </div>
                                        <div class="admin-post-item">
                                            <div class="admin-post-info">
                                                <h4>Transformer\u67B6\u6784\u6DF1\u5EA6\u89E3\u6790</h4>
                                                <p>Deep Learning \u2022 2025-01-19</p>
                                            </div>
                                            <div class="admin-post-actions">
                                                <button class="admin-btn-small">\u7F16\u8F91</button>
                                                <button class="admin-btn-small admin-btn-danger">\u5220\u9664</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div id="admin-tab-settings" class="admin-tab-panel">
                                <div class="admin-section">
                                    <h3>\u4E3B\u9898\u8BBE\u7F6E</h3>
                                    <div class="admin-form-group">
                                        <label for="admin-theme-color">\u4E3B\u9898\u8272\u5F69</label>
                                        <div class="admin-color-picker">
                                            <input type="color" id="admin-theme-color" value="#34495e">
                                            <span class="admin-color-preview"></span>
                                        </div>
                                    </div>
                                    <div class="admin-form-group">
                                        <label>
                                            <input type="checkbox" id="admin-dark-mode-default"> \u9ED8\u8BA4\u6DF1\u8272\u6A21\u5F0F
                                        </label>
                                    </div>
                                </div>
                                <div class="admin-section">
                                    <h3>\u5B89\u5168\u8BBE\u7F6E</h3>
                                    <div class="admin-form-group">
                                        <label for="admin-new-password">\u66F4\u6539\u7BA1\u7406\u5458\u5BC6\u7801</label>
                                        <input type="password" id="admin-new-password" placeholder="\u8F93\u5165\u65B0\u5BC6\u7801">
                                    </div>
                                    <button class="admin-btn admin-btn-primary" id="admin-change-password">\u66F4\u65B0\u5BC6\u7801</button>
                                </div>
                            </div>
                        </div>
                        <div class="admin-panel-footer">
                            <button class="admin-btn admin-btn-primary" id="admin-save-settings">
                                <svg class="admin-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"></path>
                                    <polyline points="17,21 17,13 7,13 7,21"></polyline>
                                    <polyline points="7,3 7,8 15,8"></polyline>
                                </svg>
                                \u4FDD\u5B58\u8BBE\u7F6E
                            </button>
                            <button class="admin-btn admin-btn-secondary" id="admin-panel-cancel">\u53D6\u6D88</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
    /**
     * Show admin panel
     */
    showAdminPanel: () => {
      const panel = document.getElementById("admin-panel-modal");
      if (panel) {
        panel.style.display = "flex";
        Stack.loadAdminSettings();
      }
    },
    /**
     * Hide admin panel
     */
    hideAdminPanel: () => {
      const panel = document.getElementById("admin-panel-modal");
      if (panel) {
        panel.style.display = "none";
      }
    },
    /**
     * Switch admin panel tab
     */
    switchAdminTab: (tabName) => {
      document.querySelectorAll(".admin-tab-btn").forEach((btn) => {
        btn.classList.remove("active");
      });
      document.querySelectorAll(".admin-tab-panel").forEach((panel) => {
        panel.classList.remove("active");
      });
      const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
      const selectedPanel = document.getElementById(`admin-tab-${tabName}`);
      if (selectedTab) selectedTab.classList.add("active");
      if (selectedPanel) selectedPanel.classList.add("active");
    },
    /**
     * Handle avatar upload
     */
    handleAvatarUpload: (file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result;
          const avatarImg = document.getElementById("admin-avatar-img");
          if (avatarImg) {
            avatarImg.src = result;
            localStorage.setItem("adminAvatar", result);
          }
        };
        reader.readAsDataURL(file);
      }
    },
    /**
     * Reset avatar to default
     */
    resetAvatar: () => {
      const avatarImg = document.getElementById("admin-avatar-img");
      if (avatarImg) {
        avatarImg.src = "/img/avatar_hu_f509edb42ecc0ebd.png";
        localStorage.removeItem("adminAvatar");
      }
    },
    /**
     * Load admin settings
     */
    loadAdminSettings: () => {
      const savedAvatar = localStorage.getItem("adminAvatar");
      if (savedAvatar) {
        const avatarImg = document.getElementById("admin-avatar-img");
        if (avatarImg) avatarImg.src = savedAvatar;
      }
      const savedTitle = localStorage.getItem("adminSiteTitle");
      if (savedTitle) {
        const titleInput = document.getElementById("admin-site-title");
        if (titleInput) titleInput.value = savedTitle;
      }
      const savedDesc = localStorage.getItem("adminSiteDescription");
      if (savedDesc) {
        const descInput = document.getElementById("admin-site-description");
        if (descInput) descInput.value = savedDesc;
      }
      const savedColor = localStorage.getItem("adminThemeColor");
      if (savedColor) {
        const colorInput = document.getElementById("admin-theme-color");
        if (colorInput) colorInput.value = savedColor;
        Stack.updateThemeColor(savedColor);
      }
    },
    /**
     * Save admin settings
     */
    saveAdminSettings: () => {
      const titleInput = document.getElementById("admin-site-title");
      if (titleInput) {
        localStorage.setItem("adminSiteTitle", titleInput.value);
        const siteNameEl = document.querySelector(".site-name a");
        if (siteNameEl) siteNameEl.textContent = titleInput.value;
      }
      const descInput = document.getElementById("admin-site-description");
      if (descInput) {
        localStorage.setItem("adminSiteDescription", descInput.value);
        const siteDescEl = document.querySelector(".site-description");
        if (siteDescEl) siteDescEl.textContent = descInput.value;
      }
      const colorInput = document.getElementById("admin-theme-color");
      if (colorInput) {
        localStorage.setItem("adminThemeColor", colorInput.value);
      }
      alert("\u8BBE\u7F6E\u5DF2\u4FDD\u5B58\uFF01");
      Stack.hideAdminPanel();
    },
    /**
     * Update theme color
     */
    updateThemeColor: (color) => {
      document.documentElement.style.setProperty("--accent-color", color);
      const preview = document.querySelector(".admin-color-preview");
      if (preview) {
        preview.style.backgroundColor = color;
      }
    },
    /**
     * Change admin password
     */
    changeAdminPassword: () => {
      const newPasswordInput = document.getElementById("admin-new-password");
      if (newPasswordInput && newPasswordInput.value) {
        alert("\u5BC6\u7801\u66F4\u6539\u529F\u80FD\u9700\u8981\u540E\u7AEF\u652F\u6301\uFF0C\u5F53\u524D\u4E3A\u6F14\u793A\u6A21\u5F0F");
        newPasswordInput.value = "";
      } else {
        alert("\u8BF7\u8F93\u5165\u65B0\u5BC6\u7801");
      }
    }
  };
  window.addEventListener("load", () => {
    setTimeout(function() {
      Stack.init();
    }, 0);
  });
  window.Stack = Stack;
  window.createElement = createElement_default;
  window.StackAuth = globalAuth;
})();
/*!
*   Hugo Theme Stack - Authentication Module
*
*   @author: Emma (Product Manager)
*   @project: Hugo Blog Admin System
*   @description: Admin authentication and permission management
*/
/*!
*   Hugo Theme Stack - Extended with Admin Authentication
*
*   @author: Jimmy Cai (Original), Emma (Admin Extension)
*   @website: https://jimmycai.com
*   @link: https://github.com/CaiJimmy/hugo-theme-stack
*/
