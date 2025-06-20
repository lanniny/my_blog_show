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
        element.style.display = isAdmin ? "block" : "none";
      });
      guestElements.forEach((element) => {
        element.style.display = isAdmin ? "none" : "block";
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

  // ns-hugo-imp:C:\Users\16643\Desktop\blog\hugo\blog\assets\ts\performance.ts
  var BlogPerformanceOptimizer = class {
    observer = null;
    metrics = {};
    isDebugMode = false;
    constructor() {
      this.isDebugMode = document.documentElement.getAttribute("data-debug") === "true";
      this.init();
    }
    /**
     * 初始化性能优化功能
     */
    init() {
      console.log("\u{1F680} \u521D\u59CB\u5316\u535A\u5BA2\u6027\u80FD\u4F18\u5316...");
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => {
          this.setupOptimizations();
        });
      } else {
        this.setupOptimizations();
      }
    }
    /**
     * 设置所有优化功能
     */
    setupOptimizations() {
      this.setupLazyLoading();
      this.setupResourcePreloading();
      this.setupPerformanceMonitoring();
      this.setupImageOptimization();
      this.setupScrollOptimization();
      this.setupFontOptimization();
      if (this.isDebugMode) {
        this.setupDebugMode();
      }
      console.log("\u2705 \u6027\u80FD\u4F18\u5316\u529F\u80FD\u5DF2\u542F\u7528");
    }
    /**
     * 设置图片懒加载
     */
    setupLazyLoading() {
      if ("loading" in HTMLImageElement.prototype) {
        const images = document.querySelectorAll("img[data-src]");
        images.forEach((img) => {
          const image = img;
          image.src = image.dataset.src || "";
          image.loading = "lazy";
          image.classList.add("loaded");
        });
      } else {
        this.setupIntersectionObserver();
      }
    }
    /**
     * 设置Intersection Observer
     */
    setupIntersectionObserver() {
      const options = {
        root: null,
        rootMargin: "50px",
        threshold: 0.1
      };
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            this.loadImage(img);
            this.observer?.unobserve(img);
          }
        });
      }, options);
      const lazyImages = document.querySelectorAll("img[data-src]");
      lazyImages.forEach((img) => {
        this.observer?.observe(img);
      });
    }
    /**
     * 加载图片
     */
    loadImage(img) {
      const src = img.dataset.src;
      if (!src) return;
      const imageLoader = new Image();
      imageLoader.onload = () => {
        img.src = src;
        img.classList.add("loaded");
        img.removeAttribute("data-src");
      };
      imageLoader.onerror = () => {
        img.classList.add("error");
        console.warn("\u56FE\u7247\u52A0\u8F7D\u5931\u8D25:", src);
      };
      imageLoader.src = src;
    }
    /**
     * 设置资源预加载
     */
    setupResourcePreloading() {
      this.preloadResource("/css/critical.css", "style");
      this.preloadResource("/fonts/main.woff2", "font", "font/woff2");
      this.preconnectDomain("https://fonts.googleapis.com");
      this.preconnectDomain("https://fonts.gstatic.com");
    }
    /**
     * 预加载资源
     */
    preloadResource(href, as, type) {
      const link = document.createElement("link");
      link.rel = "preload";
      link.href = href;
      link.as = as;
      if (type) link.type = type;
      link.crossOrigin = "anonymous";
      document.head.appendChild(link);
    }
    /**
     * 预连接域名
     */
    preconnectDomain(href) {
      const link = document.createElement("link");
      link.rel = "preconnect";
      link.href = href;
      link.crossOrigin = "anonymous";
      document.head.appendChild(link);
    }
    /**
     * 设置性能监控
     */
    setupPerformanceMonitoring() {
      this.measureFCP();
      this.measureLCP();
      this.measureFID();
      this.measureCLS();
      this.measureTTFB();
      setTimeout(() => {
        this.reportMetrics();
      }, 5e3);
    }
    /**
     * 测量First Contentful Paint
     */
    measureFCP() {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const fcpEntry = entries.find((entry) => entry.name === "first-contentful-paint");
        if (fcpEntry) {
          this.metrics.fcp = fcpEntry.startTime;
          observer.disconnect();
        }
      });
      observer.observe({ entryTypes: ["paint"] });
    }
    /**
     * 测量Largest Contentful Paint
     */
    measureLCP() {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.metrics.lcp = lastEntry.startTime;
      });
      observer.observe({ entryTypes: ["largest-contentful-paint"] });
    }
    /**
     * 测量First Input Delay
     */
    measureFID() {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          this.metrics.fid = entry.processingStart - entry.startTime;
        });
      });
      observer.observe({ entryTypes: ["first-input"] });
    }
    /**
     * 测量Cumulative Layout Shift
     */
    measureCLS() {
      let clsValue = 0;
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        this.metrics.cls = clsValue;
      });
      observer.observe({ entryTypes: ["layout-shift"] });
    }
    /**
     * 测量Time to First Byte
     */
    measureTTFB() {
      const navigationEntry = performance.getEntriesByType("navigation")[0];
      if (navigationEntry) {
        this.metrics.ttfb = navigationEntry.responseStart - navigationEntry.requestStart;
      }
    }
    /**
     * 报告性能指标
     */
    reportMetrics() {
      if (this.isDebugMode) {
        console.table(this.metrics);
      }
    }
    /**
     * 设置图片优化
     */
    setupImageOptimization() {
      const images = document.querySelectorAll("img:not([loading])");
      images.forEach((img) => {
        img.loading = "lazy";
      });
      images.forEach((img) => {
        img.addEventListener("error", () => {
          img.classList.add("img-error");
          console.warn("\u56FE\u7247\u52A0\u8F7D\u5931\u8D25:", img.src);
        });
      });
    }
    /**
     * 设置滚动优化
     */
    setupScrollOptimization() {
      let ticking = false;
      const updateScrollPosition = () => {
        const scrollTop = window.pageYOffset;
        const scrollPercent = scrollTop / (document.body.scrollHeight - window.innerHeight);
        const progressBar = document.querySelector(".scroll-progress");
        if (progressBar) {
          progressBar.style.width = `${scrollPercent * 100}%`;
        }
        ticking = false;
      };
      window.addEventListener("scroll", () => {
        if (!ticking) {
          requestAnimationFrame(updateScrollPosition);
          ticking = true;
        }
      }, { passive: true });
    }
    /**
     * 设置字体优化
     */
    setupFontOptimization() {
      if ("fonts" in document) {
        document.fonts.ready.then(() => {
          document.body.classList.add("fonts-loaded");
          console.log("\u2705 \u5B57\u4F53\u52A0\u8F7D\u5B8C\u6210");
        });
      }
    }
    /**
     * 设置调试模式
     */
    setupDebugMode() {
      console.log("\u{1F527} \u8C03\u8BD5\u6A21\u5F0F\u5DF2\u542F\u7528");
      const performanceMarkers = document.querySelectorAll(".performance-marker");
      performanceMarkers.forEach((marker, index) => {
        marker.setAttribute("data-perf-id", `marker-${index}`);
      });
      this.createPerformancePanel();
    }
    /**
     * 创建性能面板
     */
    createPerformancePanel() {
      const panel = document.createElement("div");
      panel.id = "performance-panel";
      panel.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 10px;
            border-radius: 5px;
            font-family: monospace;
            font-size: 12px;
            z-index: 10000;
            max-width: 300px;
        `;
      document.body.appendChild(panel);
      setInterval(() => {
        panel.innerHTML = `
                <div><strong>\u6027\u80FD\u6307\u6807</strong></div>
                <div>FCP: ${this.metrics.fcp?.toFixed(2) || "N/A"}ms</div>
                <div>LCP: ${this.metrics.lcp?.toFixed(2) || "N/A"}ms</div>
                <div>FID: ${this.metrics.fid?.toFixed(2) || "N/A"}ms</div>
                <div>CLS: ${this.metrics.cls?.toFixed(4) || "N/A"}</div>
                <div>TTFB: ${this.metrics.ttfb?.toFixed(2) || "N/A"}ms</div>
                <div>\u5185\u5B58: ${performance.memory ? Math.round(performance.memory.usedJSHeapSize / 1024 / 1024) + "MB" : "N/A"}</div>
            `;
      }, 1e3);
    }
    /**
     * 清理资源
     */
    destroy() {
      if (this.observer) {
        this.observer.disconnect();
        this.observer = null;
      }
    }
  };
  var performanceOptimizer = new BlogPerformanceOptimizer();
  window.BlogPerformanceOptimizer = BlogPerformanceOptimizer;
  window.performanceOptimizer = performanceOptimizer;

  // ns-hugo-imp:C:\Users\16643\Desktop\blog\hugo\blog\assets\ts\frontend-beautify.ts
  var FrontendBeautify = {
    /**
     * 初始化所有美化功能
     */
    init() {
      console.log("\u{1F3A8} Initializing frontend beautification...");
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => {
          this.setupAll();
        });
      } else {
        this.setupAll();
      }
    },
    /**
     * 设置所有功能
     */
    setupAll() {
      this.setupReadingProgress();
      this.setupBackToTop();
      this.setupSmoothScrolling();
      this.setupImageLazyLoading();
      this.setupAnimations();
      console.log("\u2705 Frontend beautification initialized");
    },
    /**
     * 设置阅读进度条
     */
    setupReadingProgress() {
      const progressBar = document.createElement("div");
      progressBar.className = "reading-progress";
      document.body.appendChild(progressBar);
      let ticking = false;
      const updateProgress = () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollTop / scrollHeight * 100;
        progressBar.style.width = `${Math.min(progress, 100)}%`;
        ticking = false;
      };
      window.addEventListener("scroll", () => {
        if (!ticking) {
          requestAnimationFrame(updateProgress);
          ticking = true;
        }
      });
      console.log("\u2705 Reading progress bar setup complete");
    },
    /**
     * 设置返回顶部按钮
     */
    setupBackToTop() {
      const backToTopBtn = document.createElement("a");
      backToTopBtn.href = "#";
      backToTopBtn.className = "back-to-top";
      backToTopBtn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 15l-6-6-6 6"></path>
            </svg>
        `;
      backToTopBtn.setAttribute("aria-label", "\u8FD4\u56DE\u9876\u90E8");
      document.body.appendChild(backToTopBtn);
      let ticking = false;
      const toggleBackToTop = () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop > 300) {
          backToTopBtn.classList.add("visible");
        } else {
          backToTopBtn.classList.remove("visible");
        }
        ticking = false;
      };
      window.addEventListener("scroll", () => {
        if (!ticking) {
          requestAnimationFrame(toggleBackToTop);
          ticking = true;
        }
      });
      backToTopBtn.addEventListener("click", (e) => {
        e.preventDefault();
        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });
      });
      console.log("\u2705 Back to top button setup complete");
    },
    /**
     * 设置平滑滚动
     */
    setupSmoothScrolling() {
      const anchorLinks = document.querySelectorAll('a[href^="#"]');
      anchorLinks.forEach((link) => {
        link.addEventListener("click", (e) => {
          const href = link.getAttribute("href");
          if (href === "#" || href === "#top") {
            e.preventDefault();
            window.scrollTo({
              top: 0,
              behavior: "smooth"
            });
            return;
          }
          const target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            const offsetTop = target.getBoundingClientRect().top + window.pageYOffset - 80;
            window.scrollTo({
              top: offsetTop,
              behavior: "smooth"
            });
          }
        });
      });
      console.log("\u2705 Smooth scrolling setup complete");
    },
    /**
     * 设置图片懒加载增强
     */
    setupImageLazyLoading() {
      if ("IntersectionObserver" in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = entry.target;
              img.style.opacity = "0";
              img.style.transition = "opacity 0.3s ease";
              img.addEventListener("load", () => {
                img.style.opacity = "1";
              });
              observer.unobserve(img);
            }
          });
        });
        const images = document.querySelectorAll(".article-image img");
        images.forEach((img) => {
          imageObserver.observe(img);
        });
        console.log("\u2705 Enhanced image lazy loading setup complete");
      }
    },
    /**
     * 设置动画效果
     */
    setupAnimations() {
      if ("IntersectionObserver" in window) {
        const animationObserver = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("animate-in");
            }
          });
        }, {
          threshold: 0.1,
          rootMargin: "0px 0px -50px 0px"
        });
        const articles = document.querySelectorAll(".article-list article");
        articles.forEach((article, index) => {
          article.style.animationDelay = `${index * 0.1}s`;
          animationObserver.observe(article);
        });
        const widgets = document.querySelectorAll(".widget");
        widgets.forEach((widget, index) => {
          widget.style.animationDelay = `${index * 0.1}s`;
          animationObserver.observe(widget);
        });
        console.log("\u2705 Scroll animations setup complete");
      }
      this.setupHoverEffects();
    },
    /**
     * 设置悬停效果增强
     */
    setupHoverEffects() {
      const articles = document.querySelectorAll(".article-list article");
      articles.forEach((article) => {
        article.addEventListener("mouseenter", () => {
          article.style.transform = "translateY(-8px) rotateX(2deg)";
        });
        article.addEventListener("mouseleave", () => {
          article.style.transform = "translateY(0) rotateX(0deg)";
        });
      });
      const tagLinks = document.querySelectorAll(".tag-cloud a");
      tagLinks.forEach((tag) => {
        tag.addEventListener("mouseenter", () => {
          const colors = [
            "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
            "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
            "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
            "linear-gradient(135deg, #fa709a 0%, #fee140 100%)"
          ];
          const randomColor = colors[Math.floor(Math.random() * colors.length)];
          tag.style.background = randomColor;
        });
      });
      console.log("\u2705 Hover effects setup complete");
    }
  };
  FrontendBeautify.init();
  window.FrontendBeautify = FrontendBeautify;

  // ns-hugo-imp:C:\Users\16643\Desktop\blog\hugo\blog\assets\ts\navigation-enhance.ts
  var NavigationEnhance = {
    /**
     * 初始化导航增强功能
     */
    init() {
      console.log("\u{1F9ED} Initializing navigation enhancement...");
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => {
          this.setupAll();
        });
      } else {
        this.setupAll();
      }
    },
    /**
     * 设置所有功能
     */
    setupAll() {
      this.setupScrollEffects();
      this.setupScrollIndicator();
      this.setupMobileMenu();
      this.setupSearchEnhancement();
      console.log("\u2705 Navigation enhancement initialized");
    },
    /**
     * 设置滚动效果
     */
    setupScrollEffects() {
      const header = document.querySelector(".main-header");
      if (!header) return;
      let lastScrollY = window.scrollY;
      let ticking = false;
      const updateHeader = () => {
        const scrollY = window.scrollY;
        if (scrollY > 50) {
          header.classList.add("scrolled");
        } else {
          header.classList.remove("scrolled");
        }
        if (scrollY > lastScrollY && scrollY > 200) {
          header.style.transform = "translateY(-100%)";
        } else {
          header.style.transform = "translateY(0)";
        }
        lastScrollY = scrollY;
        ticking = false;
      };
      window.addEventListener("scroll", () => {
        if (!ticking) {
          requestAnimationFrame(updateHeader);
          ticking = true;
        }
      });
      console.log("\u2705 Scroll effects setup complete");
    },
    /**
     * 设置滚动指示器
     */
    setupScrollIndicator() {
      const indicator = document.createElement("div");
      indicator.className = "scroll-indicator";
      indicator.innerHTML = '<div class="scroll-indicator-bar"></div>';
      document.body.appendChild(indicator);
      const indicatorBar = indicator.querySelector(".scroll-indicator-bar");
      let ticking = false;
      const updateIndicator = () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollTop / scrollHeight * 100;
        if (indicatorBar) {
          indicatorBar.style.width = `${Math.min(progress, 100)}%`;
        }
        ticking = false;
      };
      window.addEventListener("scroll", () => {
        if (!ticking) {
          requestAnimationFrame(updateIndicator);
          ticking = true;
        }
      });
      console.log("\u2705 Scroll indicator setup complete");
    },
    /**
     * 设置移动端菜单增强
     */
    setupMobileMenu() {
      const menuToggle = document.querySelector(".menu-toggle");
      const mainMenu = document.querySelector(".main-menu");
      if (!menuToggle || !mainMenu) return;
      menuToggle.addEventListener("click", () => {
        menuToggle.classList.toggle("active");
        mainMenu.classList.toggle("active");
        document.body.classList.toggle("menu-open");
      });
      const menuItems = mainMenu.querySelectorAll("a");
      menuItems.forEach((item) => {
        item.addEventListener("click", () => {
          menuToggle.classList.remove("active");
          mainMenu.classList.remove("active");
          document.body.classList.remove("menu-open");
        });
      });
      document.addEventListener("click", (e) => {
        const target = e.target;
        if (!menuToggle.contains(target) && !mainMenu.contains(target)) {
          menuToggle.classList.remove("active");
          mainMenu.classList.remove("active");
          document.body.classList.remove("menu-open");
        }
      });
      console.log("\u2705 Mobile menu enhancement setup complete");
    },
    /**
     * 设置搜索增强
     */
    setupSearchEnhancement() {
      const searchButton = document.querySelector(".search-button");
      const searchModal = document.querySelector(".search-modal");
      if (!searchButton) return;
      searchButton.addEventListener("click", (e) => {
        e.preventDefault();
        searchButton.style.transform = "scale(0.95)";
        setTimeout(() => {
          searchButton.style.transform = "";
        }, 150);
        if (searchModal) {
          searchModal.classList.add("active");
          const searchInput = searchModal.querySelector("input");
          if (searchInput) {
            setTimeout(() => searchInput.focus(), 100);
          }
        }
      });
      if (searchModal) {
        const closeBtn = searchModal.querySelector(".search-close");
        if (closeBtn) {
          closeBtn.addEventListener("click", () => {
            searchModal.classList.remove("active");
          });
        }
        document.addEventListener("keydown", (e) => {
          if (e.key === "Escape" && searchModal.classList.contains("active")) {
            searchModal.classList.remove("active");
          }
        });
        searchModal.addEventListener("click", (e) => {
          if (e.target === searchModal) {
            searchModal.classList.remove("active");
          }
        });
      }
      console.log("\u2705 Search enhancement setup complete");
    }
  };
  NavigationEnhance.init();
  window.NavigationEnhance = NavigationEnhance;

  // ns-hugo-imp:C:\Users\16643\Desktop\blog\hugo\blog\assets\ts\admin-panel-enhance.ts
  var AdminPanelEnhance = {
    /**
     * 初始化管理面板增强功能
     */
    init() {
      console.log("\u{1F3A8} Initializing admin panel enhancement...");
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => {
          this.setupAll();
        });
      } else {
        this.setupAll();
      }
    },
    /**
     * 设置所有功能
     */
    setupAll() {
      this.setupAnimations();
      this.setupFormEnhancements();
      this.setupNotifications();
      this.setupKeyboardShortcuts();
      this.setupTooltips();
      this.setupProgressIndicators();
      console.log("\u2705 Admin panel enhancement initialized");
    },
    /**
     * 设置动画效果
     */
    setupAnimations() {
      const observeAdminElements = () => {
        if ("IntersectionObserver" in window) {
          const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.add("animate-in");
              }
            });
          }, {
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px"
          });
          const adminElements = document.querySelectorAll(".admin-tab-panel, .admin-section, .admin-action-btn");
          adminElements.forEach((element, index) => {
            element.style.animationDelay = `${index * 0.1}s`;
            observer.observe(element);
          });
        }
      };
      const adminPanel = document.getElementById("admin-panel-modal");
      if (adminPanel) {
        const observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (mutation.type === "attributes" && mutation.attributeName === "style") {
              const target = mutation.target;
              if (target.style.display === "flex") {
                setTimeout(observeAdminElements, 100);
              }
            }
          });
        });
        observer.observe(adminPanel, {
          attributes: true,
          attributeFilter: ["style"]
        });
      }
      console.log("\u2705 Admin panel animations setup complete");
    },
    /**
     * 设置表单增强
     */
    setupFormEnhancements() {
      const setupFloatingLabels = () => {
        const formGroups = document.querySelectorAll(".admin-form-group");
        formGroups.forEach((group) => {
          const input = group.querySelector("input, textarea");
          const label = group.querySelector("label");
          if (input && label && !group.classList.contains("floating-label")) {
            group.classList.add("floating-label");
            const checkFloating = () => {
              if (input.value || input === document.activeElement) {
                group.classList.add("floating");
              } else {
                group.classList.remove("floating");
              }
            };
            input.addEventListener("focus", checkFloating);
            input.addEventListener("blur", checkFloating);
            input.addEventListener("input", checkFloating);
            checkFloating();
          }
        });
      };
      const enhanceFormValidation = () => {
        const inputs = document.querySelectorAll(".admin-form-group input, .admin-form-group textarea");
        inputs.forEach((input) => {
          input.addEventListener("input", (e) => {
            const target = e.target;
            const formGroup = target.closest(".admin-form-group");
            if (formGroup) {
              formGroup.classList.remove("valid", "invalid");
              if (target.value.length > 0) {
                if (target.checkValidity()) {
                  formGroup.classList.add("valid");
                } else {
                  formGroup.classList.add("invalid");
                }
              }
            }
          });
        });
      };
      const setupButtonLoading = () => {
        const buttons = document.querySelectorAll(".admin-btn");
        buttons.forEach((button) => {
          button.addEventListener("click", () => {
            if (!button.classList.contains("loading")) {
              button.classList.add("loading");
              setTimeout(() => {
                button.classList.remove("loading");
              }, 2e3);
            }
          });
        });
      };
      setupFloatingLabels();
      enhanceFormValidation();
      setupButtonLoading();
      console.log("\u2705 Form enhancements setup complete");
    },
    /**
     * 设置通知系统
     */
    setupNotifications() {
      let notificationContainer = document.getElementById("admin-notifications");
      if (!notificationContainer) {
        notificationContainer = document.createElement("div");
        notificationContainer.id = "admin-notifications";
        notificationContainer.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10001;
                pointer-events: none;
            `;
        document.body.appendChild(notificationContainer);
      }
      const showNotification = (message, type = "success", duration = 3e3) => {
        const notification = document.createElement("div");
        notification.className = `admin-notification admin-notification-${type} show`;
        notification.style.pointerEvents = "auto";
        const iconMap = {
          success: '<svg class="admin-icon" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"></path></svg>',
          error: '<svg class="admin-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>',
          warning: '<svg class="admin-icon" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>'
        };
        notification.innerHTML = `
                <div class="admin-notification-content">
                    ${iconMap[type]}
                    <span>${message}</span>
                </div>
            `;
        notificationContainer.appendChild(notification);
        setTimeout(() => {
          notification.classList.remove("show");
          setTimeout(() => {
            if (notification.parentNode) {
              notification.parentNode.removeChild(notification);
            }
          }, 300);
        }, duration);
      };
      window.showAdminNotification = showNotification;
      console.log("\u2705 Notification system setup complete");
    },
    /**
     * 设置键盘快捷键
     */
    setupKeyboardShortcuts() {
      document.addEventListener("keydown", (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === "k") {
          e.preventDefault();
          const adminPanelToggle = document.getElementById("admin-panel-toggle");
          if (adminPanelToggle && window.Stack && window.Stack.showAdminPanel) {
            window.Stack.showAdminPanel();
          }
        }
        if (e.key === "Escape") {
          const adminPanel = document.getElementById("admin-panel-modal");
          if (adminPanel && adminPanel.style.display === "flex") {
            if (window.Stack && window.Stack.hideAdminPanel) {
              window.Stack.hideAdminPanel();
            }
          }
        }
        if ((e.ctrlKey || e.metaKey) && e.key === "s") {
          const adminPanel = document.getElementById("admin-panel-modal");
          if (adminPanel && adminPanel.style.display === "flex") {
            e.preventDefault();
            const saveButton = document.getElementById("admin-save-settings");
            if (saveButton) {
              saveButton.click();
            }
          }
        }
        if (e.key === "Tab") {
          const adminPanel = document.getElementById("admin-panel-modal");
          if (adminPanel && adminPanel.style.display === "flex") {
            const focusableElements = adminPanel.querySelectorAll(
              'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            if (e.shiftKey && document.activeElement === firstElement) {
              e.preventDefault();
              lastElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
              e.preventDefault();
              firstElement.focus();
            }
          }
        }
      });
      console.log("\u2705 Keyboard shortcuts setup complete");
    },
    /**
     * 设置工具提示
     */
    setupTooltips() {
      let tooltip = document.getElementById("admin-tooltip");
      if (!tooltip) {
        tooltip = document.createElement("div");
        tooltip.id = "admin-tooltip";
        tooltip.style.cssText = `
                position: absolute;
                background: var(--card-background);
                color: var(--card-text-color-main);
                padding: 0.5rem 0.75rem;
                border-radius: 6px;
                font-size: 0.875rem;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                border: 1px solid var(--card-separator-color);
                z-index: 10002;
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.2s ease;
                max-width: 200px;
                word-wrap: break-word;
            `;
        document.body.appendChild(tooltip);
      }
      const setupTooltipForElement = (element) => {
        const title = element.getAttribute("title") || element.getAttribute("data-tooltip");
        if (title) {
          element.removeAttribute("title");
          element.setAttribute("data-tooltip", title);
          element.addEventListener("mouseenter", (e) => {
            const target = e.target;
            const rect = target.getBoundingClientRect();
            const tooltipText = target.getAttribute("data-tooltip");
            if (tooltipText && tooltip) {
              tooltip.textContent = tooltipText;
              tooltip.style.left = `${rect.left + rect.width / 2}px`;
              tooltip.style.top = `${rect.top - 10}px`;
              tooltip.style.transform = "translateX(-50%) translateY(-100%)";
              tooltip.style.opacity = "1";
            }
          });
          element.addEventListener("mouseleave", () => {
            if (tooltip) {
              tooltip.style.opacity = "0";
            }
          });
        }
      };
      const elementsWithTooltips = document.querySelectorAll("[title], [data-tooltip]");
      elementsWithTooltips.forEach(setupTooltipForElement);
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node;
              if (element.hasAttribute("title") || element.hasAttribute("data-tooltip")) {
                setupTooltipForElement(element);
              }
              const childElements = element.querySelectorAll("[title], [data-tooltip]");
              childElements.forEach(setupTooltipForElement);
            }
          });
        });
      });
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
      console.log("\u2705 Tooltips setup complete");
    },
    /**
     * 设置进度指示器
     */
    setupProgressIndicators() {
      const createProgressBar = (container, progress = 0) => {
        let progressBar = container.querySelector(".admin-progress-bar");
        if (!progressBar) {
          progressBar = document.createElement("div");
          progressBar.className = "admin-progress-bar";
          progressBar.style.cssText = `
                    width: 100%;
                    height: 4px;
                    background: var(--card-separator-color);
                    border-radius: 2px;
                    overflow: hidden;
                    margin-top: 1rem;
                `;
          const progressFill2 = document.createElement("div");
          progressFill2.className = "admin-progress-fill";
          progressFill2.style.cssText = `
                    height: 100%;
                    background: var(--admin-primary-gradient);
                    width: 0%;
                    transition: width 0.3s ease;
                    border-radius: 2px;
                `;
          progressBar.appendChild(progressFill2);
          container.appendChild(progressBar);
        }
        const progressFill = progressBar.querySelector(".admin-progress-fill");
        if (progressFill) {
          progressFill.style.width = `${Math.min(Math.max(progress, 0), 100)}%`;
        }
        return progressBar;
      };
      const forms = document.querySelectorAll(".admin-form");
      forms.forEach((form) => {
        form.addEventListener("submit", (e) => {
          const formElement = e.target;
          const progressBar = createProgressBar(formElement);
          let progress = 0;
          const interval = setInterval(() => {
            progress += Math.random() * 20;
            const progressFill = progressBar.querySelector(".admin-progress-fill");
            if (progressFill) {
              progressFill.style.width = `${Math.min(progress, 90)}%`;
            }
            if (progress >= 90) {
              clearInterval(interval);
            }
          }, 200);
          setTimeout(() => {
            clearInterval(interval);
            const progressFill = progressBar.querySelector(".admin-progress-fill");
            if (progressFill) {
              progressFill.style.width = "100%";
            }
            setTimeout(() => {
              if (progressBar.parentNode) {
                progressBar.parentNode.removeChild(progressBar);
              }
            }, 500);
          }, 3e3);
        });
      });
      window.createAdminProgressBar = createProgressBar;
      console.log("\u2705 Progress indicators setup complete");
    }
  };
  AdminPanelEnhance.init();
  window.AdminPanelEnhance = AdminPanelEnhance;

  // ns-hugo-imp:C:\Users\16643\Desktop\blog\hugo\blog\assets\ts\share.ts
  var SocialShare = class {
    shareData;
    qrCodeGenerated = false;
    constructor() {
      this.shareData = window.shareData || {
        url: window.location.href,
        title: document.title,
        description: "",
        image: ""
      };
      this.init();
    }
    /**
     * 初始化分享功能
     */
    init() {
      console.log("\u{1F517} \u521D\u59CB\u5316\u793E\u4EA4\u5206\u4EAB\u529F\u80FD...");
      this.bindEvents();
      console.log("\u2705 \u793E\u4EA4\u5206\u4EAB\u529F\u80FD\u521D\u59CB\u5316\u5B8C\u6210");
    }
    /**
     * 绑定事件监听器
     */
    bindEvents() {
      const wechatBtn = document.querySelector(".share-btn--wechat");
      if (wechatBtn) {
        wechatBtn.addEventListener("click", () => this.handleWechatShare());
      }
      const copyBtn = document.querySelector(".share-btn--copy");
      if (copyBtn) {
        copyBtn.addEventListener("click", () => this.copyToClipboard());
      }
      const closeBtn = document.getElementById("wechat-qr-close");
      if (closeBtn) {
        closeBtn.addEventListener("click", () => this.closeWechatModal());
      }
      const modal = document.getElementById("wechat-qr-modal");
      if (modal) {
        modal.addEventListener("click", (e) => {
          if (e.target === modal) {
            this.closeWechatModal();
          }
        });
      }
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          this.closeWechatModal();
        }
      });
      console.log("\u2705 \u5206\u4EAB\u4E8B\u4EF6\u76D1\u542C\u5668\u7ED1\u5B9A\u5B8C\u6210");
    }
    /**
     * 处理微信分享
     */
    handleWechatShare() {
      console.log("\u{1F4F1} \u6253\u5F00\u5FAE\u4FE1\u5206\u4EAB\u4E8C\u7EF4\u7801...");
      this.showWechatModal();
      if (!this.qrCodeGenerated) {
        this.generateQRCode();
      }
    }
    /**
     * 显示微信二维码弹窗
     */
    showWechatModal() {
      const modal = document.getElementById("wechat-qr-modal");
      if (modal) {
        modal.classList.add("show");
        document.body.style.overflow = "hidden";
      }
    }
    /**
     * 关闭微信二维码弹窗
     */
    closeWechatModal() {
      const modal = document.getElementById("wechat-qr-modal");
      if (modal) {
        modal.classList.remove("show");
        document.body.style.overflow = "";
      }
    }
    /**
     * 生成二维码
     */
    generateQRCode() {
      const qrContainer = document.getElementById("wechat-qr-code");
      if (!qrContainer) return;
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(this.shareData.url)}`;
      const img = document.createElement("img");
      img.src = qrUrl;
      img.alt = "\u5FAE\u4FE1\u5206\u4EAB\u4E8C\u7EF4\u7801";
      img.style.width = "200px";
      img.style.height = "200px";
      qrContainer.innerHTML = "";
      qrContainer.appendChild(img);
      this.qrCodeGenerated = true;
      console.log("\u2705 \u4E8C\u7EF4\u7801\u751F\u6210\u5B8C\u6210");
    }
    /**
     * 复制链接到剪贴板
     */
    async copyToClipboard() {
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(this.shareData.url);
        } else {
          const textArea = document.createElement("textarea");
          textArea.value = this.shareData.url;
          textArea.style.position = "fixed";
          textArea.style.left = "-999999px";
          textArea.style.top = "-999999px";
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          document.execCommand("copy");
          textArea.remove();
        }
        this.showCopySuccess();
        console.log("\u2705 \u94FE\u63A5\u5DF2\u590D\u5236\u5230\u526A\u8D34\u677F");
      } catch (err) {
        console.error("\u274C \u590D\u5236\u5931\u8D25:", err);
        this.showCopyError();
      }
    }
    /**
     * 显示复制成功提示
     */
    showCopySuccess() {
      this.showNotification("\u94FE\u63A5\u5DF2\u590D\u5236\u5230\u526A\u8D34\u677F\uFF01", "success");
    }
    /**
     * 显示复制失败提示
     */
    showCopyError() {
      this.showNotification("\u590D\u5236\u5931\u8D25\uFF0C\u8BF7\u624B\u52A8\u590D\u5236\u94FE\u63A5", "error");
    }
    /**
     * 显示通知消息
     */
    showNotification(message, type = "success") {
      const notification = document.createElement("div");
      notification.className = `share-notification share-notification--${type}`;
      notification.textContent = message;
      document.body.appendChild(notification);
      setTimeout(() => {
        notification.classList.add("show");
      }, 100);
      setTimeout(() => {
        notification.classList.remove("show");
        setTimeout(() => {
          if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
          }
        }, 300);
      }, 3e3);
    }
    /**
     * 获取分享数据
     */
    getShareData() {
      return this.shareData;
    }
  };
  document.addEventListener("DOMContentLoaded", () => {
    if (document.querySelector(".article-share")) {
      new SocialShare();
    }
  });
  window.SocialShare = SocialShare;

  // <stdin>
  var globalAuth;
  var Stack = {
    init: () => {
      try {
        globalAuth = new auth_default();
        console.log("\u2705 globalAuth created successfully");
      } catch (error) {
        console.error("\u274C Failed to create globalAuth:", error);
        console.log("\u{1F527} Attempting fallback auth creation...");
        globalAuth = {
          config: {
            adminPassword: localStorage.getItem("adminPassword") || "admit"
          },
          isAuthenticated: () => localStorage.getItem("adminAuth") === "authenticated",
          authenticate: function(password) {
            if (password === this.config.adminPassword) {
              localStorage.setItem("adminAuth", "authenticated");
              setTimeout(() => {
                const adminElements = document.querySelectorAll("[data-admin-only]");
                adminElements.forEach((el) => {
                  el.style.display = "block";
                });
                const guestElements = document.querySelectorAll("[data-guest-only]");
                guestElements.forEach((el) => {
                  el.style.display = "none";
                });
                console.log("\u2705 Fallback auth UI updated");
              }, 100);
              return true;
            }
            return false;
          },
          logout: () => {
            localStorage.removeItem("adminAuth");
            const adminElements = document.querySelectorAll("[data-admin-only]");
            adminElements.forEach((el) => {
              el.style.display = "none";
            });
            const guestElements = document.querySelectorAll("[data-guest-only]");
            guestElements.forEach((el) => {
              el.style.display = "block";
            });
          },
          updatePassword: function(newPassword) {
            this.config.adminPassword = newPassword;
            localStorage.setItem("adminPassword", newPassword);
            console.log("\u2705 Fallback auth password updated");
          }
        };
        console.log("\u2705 Fallback auth created");
      }
      window.addEventListener("onAuthStatusChange", (e) => {
        const { status, isAuthenticated, isAdmin, remainingAttempts } = e.detail;
        AuthUtils.toggleAdminElements(isAdmin);
        AuthUtils.updateBodyClass(isAdmin);
        switch (status) {
          case "authenticated":
            AuthUtils.hideLoginModal();
            console.log("Admin authenticated successfully");
            setTimeout(() => {
              console.log("\u{1F527} Force showing admin elements after authentication");
              const adminElements = document.querySelectorAll("[data-admin-only]");
              adminElements.forEach((el) => {
                el.style.display = "block";
              });
              console.log("\u2705 Admin elements forced to show");
            }, 100);
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
      console.log("\u{1F50D} Checking globalAuth:", !!globalAuth);
      if (globalAuth) {
        const isAdmin = globalAuth.isAuthenticated();
        console.log("\u{1F50D} Initial admin status:", isAdmin);
        AuthUtils.toggleAdminElements(isAdmin);
        AuthUtils.updateBodyClass(isAdmin);
      } else {
        console.error("\u274C globalAuth not initialized!");
      }
      setTimeout(() => {
        console.log("\u23F0 DOM ready, loading admin settings...");
        Stack.loadAdminSettings();
      }, 100);
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
            console.log("\u{1F3AF} Admin panel click detected:", target);
            console.log("\u{1F3AF} Clicked text:", clickedText);
            if (globalAuth && globalAuth.isAuthenticated()) {
              console.log("\u2705 User is authenticated, showing admin panel");
              const panel = document.getElementById("admin-panel-modal");
              if (panel) {
                console.log("\u2705 Panel found, showing directly");
                panel.style.display = "flex";
                if (Stack.loadAdminSettings) {
                  Stack.loadAdminSettings();
                }
              } else {
                console.error("\u274C Panel not found in DOM");
              }
            } else {
              console.log("\u274C User not authenticated, cannot show admin panel");
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
          localStorage.setItem("adminThemeColor", target.value);
        });
      }
      const newPostBtn = document.getElementById("admin-new-post");
      if (newPostBtn) {
        newPostBtn.addEventListener("click", () => {
          Stack.handleNewPost();
        });
      }
      const managePostsBtn = document.getElementById("admin-manage-posts");
      if (managePostsBtn) {
        managePostsBtn.addEventListener("click", () => {
          Stack.handleManagePosts();
        });
      }
      const siteStatsBtn = document.getElementById("admin-site-stats");
      if (siteStatsBtn) {
        siteStatsBtn.addEventListener("click", () => {
          Stack.handleSiteStats();
        });
      }
      const darkModeToggle = document.getElementById("admin-dark-mode-default");
      if (darkModeToggle) {
        darkModeToggle.addEventListener("change", (e) => {
          const target = e.target;
          Stack.handleDarkModeToggle(target.checked);
        });
      }
      const changePassword = document.getElementById("admin-change-password");
      if (changePassword) {
        changePassword.addEventListener("click", () => {
          Stack.handlePasswordChange();
        });
      }
      const imageManager = document.getElementById("admin-image-manager");
      if (imageManager) {
        imageManager.addEventListener("click", () => {
          Stack.openImageManager();
        });
      }
      const archivesManager = document.getElementById("admin-archives-manager");
      if (archivesManager) {
        archivesManager.addEventListener("click", () => {
          Stack.openArchivesManager();
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
      const avatarSelectors = [
        ".site-avatar img",
        // 通用头像选择器
        ".site-logo",
        // sidebar中的头像类
        ".site-avatar .site-logo",
        // 组合选择器
        "[data-avatar]"
        // 自定义头像属性
      ];
      avatarSelectors.forEach((selector) => {
        const avatar = document.querySelector(selector);
        if (avatar) {
          avatar.src = avatarUrl;
          console.log(`\u2705 Updated avatar for selector: ${selector}`);
        }
      });
      const allAvatars = document.querySelectorAll('img[alt*="Avatar"], img[alt*="avatar"]');
      allAvatars.forEach((img) => {
        if (!img.id || !img.id.includes("admin")) {
          img.src = avatarUrl;
          console.log(`\u2705 Updated additional avatar: ${img.className || img.id || "unnamed"}`);
        }
      });
    },
    /**
     * Load admin settings with enhanced error handling and default values
     */
    loadAdminSettings: () => {
      console.log("\u{1F504} Loading admin settings...");
      try {
        const defaults = {
          avatar: "/img/avatar_hu_f509edb42ecc0ebd.png",
          title: "lanniny-blog",
          description: "\u6F14\u793A\u6587\u7A3F",
          themeColor: "#34495e",
          password: "admit"
        };
        try {
          const savedAvatar = localStorage.getItem("adminAvatar") || defaults.avatar;
          const avatarImg = document.getElementById("admin-avatar-img");
          if (avatarImg) {
            avatarImg.src = savedAvatar;
            console.log("\u2705 Avatar loaded:", savedAvatar !== defaults.avatar ? "custom" : "default");
          }
          if (savedAvatar !== defaults.avatar) {
            Stack.updateSiteAvatar(savedAvatar);
          }
        } catch (error) {
          console.warn("\u26A0\uFE0F Avatar loading failed:", error);
          const avatarImg = document.getElementById("admin-avatar-img");
          if (avatarImg) avatarImg.src = defaults.avatar;
        }
        try {
          const savedTitle = localStorage.getItem("adminSiteTitle") || defaults.title;
          const titleInput = document.getElementById("admin-site-title");
          if (titleInput) {
            titleInput.value = savedTitle;
            console.log("\u2705 Site title loaded:", savedTitle);
          }
          if (savedTitle !== defaults.title) {
            const siteNameEl = document.querySelector(".site-name a");
            if (siteNameEl) {
              siteNameEl.textContent = savedTitle;
              console.log("\u2705 Site title updated in header");
            }
          }
        } catch (error) {
          console.warn("\u26A0\uFE0F Site title loading failed:", error);
          const titleInput = document.getElementById("admin-site-title");
          if (titleInput) titleInput.value = defaults.title;
        }
        try {
          const savedDesc = localStorage.getItem("adminSiteDescription") || defaults.description;
          const descInput = document.getElementById("admin-site-description");
          if (descInput) {
            descInput.value = savedDesc;
            console.log("\u2705 Site description loaded:", savedDesc);
          }
          if (savedDesc !== defaults.description) {
            const siteDescEl = document.querySelector(".site-description");
            if (siteDescEl) {
              siteDescEl.textContent = savedDesc;
              console.log("\u2705 Site description updated in header");
            }
          }
        } catch (error) {
          console.warn("\u26A0\uFE0F Site description loading failed:", error);
          const descInput = document.getElementById("admin-site-description");
          if (descInput) descInput.value = defaults.description;
        }
        try {
          const savedColor = localStorage.getItem("adminThemeColor") || defaults.themeColor;
          const colorInput = document.getElementById("admin-theme-color");
          if (colorInput) {
            colorInput.value = savedColor;
            console.log("\u2705 Theme color loaded:", savedColor);
          }
          if (savedColor !== defaults.themeColor) {
            Stack.updateThemeColor(savedColor);
            console.log("\u2705 Theme color applied");
          }
        } catch (error) {
          console.warn("\u26A0\uFE0F Theme color loading failed:", error);
          const colorInput = document.getElementById("admin-theme-color");
          if (colorInput) colorInput.value = defaults.themeColor;
        }
        try {
          const savedPassword = localStorage.getItem("adminPassword");
          if (savedPassword && globalAuth) {
            if (globalAuth.config) {
              globalAuth.config.adminPassword = savedPassword;
              console.log("\u2705 Admin password loaded from localStorage");
            } else {
              console.warn("\u26A0\uFE0F globalAuth.config not available, password not loaded");
            }
          } else {
            console.log("\u2139\uFE0F No saved password found, using default");
          }
        } catch (error) {
          console.warn("\u26A0\uFE0F Admin password loading failed:", error);
        }
        console.log("\u2705 Admin settings loading completed");
      } catch (error) {
        console.error("\u274C Critical error in loadAdminSettings:", error);
        console.log("\u{1F527} Attempting to recover with default values...");
      }
    },
    /**
     * Save admin settings with loading state feedback
     */
    saveAdminSettings: () => {
      console.log("\u{1F4BE} Saving admin settings...");
      const saveButton = document.getElementById("admin-save-settings");
      const originalText = saveButton?.textContent || "\u4FDD\u5B58\u8BBE\u7F6E";
      try {
        if (saveButton) {
          saveButton.disabled = true;
          saveButton.innerHTML = `
                    <svg class="admin-icon admin-loading" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 12a9 9 0 11-6.219-8.56"></path>
                    </svg>
                    \u4FDD\u5B58\u4E2D...
                `;
          console.log("\u{1F504} Save button set to loading state");
        }
        let savedCount = 0;
        let totalSettings = 0;
        const isFormValid = Stack.FormValidator.validateAllFields();
        if (!isFormValid) {
          if (saveButton) {
            saveButton.disabled = false;
            saveButton.innerHTML = `
                        <svg class="admin-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"></path>
                            <polyline points="17,21 17,13 7,13 7,21"></polyline>
                            <polyline points="7,3 7,8 15,8"></polyline>
                        </svg>
                        ${originalText}
                    `;
          }
          Stack.showErrorMessage("\u8BF7\u4FEE\u6B63\u8868\u5355\u4E2D\u7684\u9519\u8BEF\u540E\u518D\u4FDD\u5B58");
          return;
        }
        const titleInput = document.getElementById("admin-site-title");
        if (titleInput) {
          totalSettings++;
          const titleValidation = Stack.FormValidator.validateTitle(titleInput.value);
          if (titleValidation.isValid) {
            const titleValue = titleInput.value.trim();
            localStorage.setItem("adminSiteTitle", titleValue);
            const siteNameEl = document.querySelector(".site-name a");
            if (siteNameEl) {
              siteNameEl.textContent = titleValue;
              console.log("\u2705 Site title saved and updated:", titleValue);
            }
            savedCount++;
          } else {
            console.warn("\u26A0\uFE0F Site title validation failed:", titleValidation.message);
          }
        }
        const descInput = document.getElementById("admin-site-description");
        if (descInput) {
          totalSettings++;
          const descValidation = Stack.FormValidator.validateDescription(descInput.value);
          if (descValidation.isValid) {
            const descValue = descInput.value.trim();
            localStorage.setItem("adminSiteDescription", descValue);
            const siteDescEl = document.querySelector(".site-description");
            if (siteDescEl) {
              siteDescEl.textContent = descValue;
              console.log("\u2705 Site description saved and updated:", descValue);
            }
            savedCount++;
          } else {
            console.warn("\u26A0\uFE0F Site description validation failed:", descValidation.message);
          }
        }
        const colorInput = document.getElementById("admin-theme-color");
        if (colorInput) {
          totalSettings++;
          const colorValidation = Stack.FormValidator.validateThemeColor(colorInput.value);
          if (colorValidation.isValid) {
            const colorValue = colorInput.value;
            localStorage.setItem("adminThemeColor", colorValue);
            Stack.updateThemeColor(colorValue);
            console.log("\u2705 Theme color saved and applied:", colorValue);
            savedCount++;
          } else {
            console.warn("\u26A0\uFE0F Theme color validation failed:", colorValidation.message);
          }
        }
        setTimeout(() => {
          if (saveButton) {
            saveButton.disabled = false;
            saveButton.innerHTML = `
                        <svg class="admin-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"></path>
                            <polyline points="17,21 17,13 7,13 7,21"></polyline>
                            <polyline points="7,3 7,8 15,8"></polyline>
                        </svg>
                        ${originalText}
                    `;
          }
          if (savedCount === totalSettings && totalSettings > 0) {
            Stack.showSuccessMessage(`\u8BBE\u7F6E\u5DF2\u4FDD\u5B58\uFF01(${savedCount}/${totalSettings}\u9879)`);
            console.log(`\u2705 All settings saved successfully (${savedCount}/${totalSettings})`);
            Stack.hideAdminPanel();
          } else if (savedCount > 0) {
            Stack.showSuccessMessage(`\u90E8\u5206\u8BBE\u7F6E\u5DF2\u4FDD\u5B58 (${savedCount}/${totalSettings}\u9879)`);
            console.log(`\u26A0\uFE0F Partial save completed (${savedCount}/${totalSettings})`);
          } else {
            Stack.showErrorMessage("\u6CA1\u6709\u6709\u6548\u7684\u8BBE\u7F6E\u9700\u8981\u4FDD\u5B58");
            console.log("\u274C No valid settings to save");
          }
        }, 800);
      } catch (error) {
        console.error("\u274C Error saving admin settings:", error);
        if (saveButton) {
          saveButton.disabled = false;
          saveButton.innerHTML = `
                    <svg class="admin-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"></path>
                        <polyline points="17,21 17,13 7,13 7,21"></polyline>
                        <polyline points="7,3 7,8 15,8"></polyline>
                    </svg>
                    ${originalText}
                `;
        }
        Stack.showErrorMessage("\u8BBE\u7F6E\u4FDD\u5B58\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5");
      }
    },
    /**
     * Check data persistence status and integrity
     */
    checkDataPersistence: () => {
      console.log("\u{1F50D} Checking data persistence status...");
      const persistenceStatus = {
        localStorage: {
          available: false,
          quota: 0,
          used: 0
        },
        settings: {
          avatar: false,
          title: false,
          description: false,
          themeColor: false,
          password: false
        },
        integrity: true
      };
      try {
        if (typeof Storage !== "undefined" && localStorage) {
          persistenceStatus.localStorage.available = true;
          let totalSize = 0;
          for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
              totalSize += localStorage[key].length + key.length;
            }
          }
          persistenceStatus.localStorage.used = totalSize;
          console.log("\u2705 localStorage available, used:", totalSize, "characters");
        } else {
          console.warn("\u26A0\uFE0F localStorage not available");
        }
        persistenceStatus.settings.avatar = !!localStorage.getItem("adminAvatar");
        persistenceStatus.settings.title = !!localStorage.getItem("adminSiteTitle");
        persistenceStatus.settings.description = !!localStorage.getItem("adminSiteDescription");
        persistenceStatus.settings.themeColor = !!localStorage.getItem("adminThemeColor");
        persistenceStatus.settings.password = !!localStorage.getItem("adminPassword");
        const savedCount = Object.values(persistenceStatus.settings).filter(Boolean).length;
        console.log(`\u{1F4CA} Persistence status: ${savedCount}/5 settings saved`);
        try {
          const testKey = "test_persistence_" + Date.now();
          localStorage.setItem(testKey, "test");
          const testValue = localStorage.getItem(testKey);
          localStorage.removeItem(testKey);
          if (testValue !== "test") {
            persistenceStatus.integrity = false;
            console.warn("\u26A0\uFE0F localStorage integrity check failed");
          } else {
            console.log("\u2705 localStorage integrity check passed");
          }
        } catch (error) {
          persistenceStatus.integrity = false;
          console.warn("\u26A0\uFE0F localStorage integrity test failed:", error);
        }
      } catch (error) {
        console.error("\u274C Error checking data persistence:", error);
        persistenceStatus.integrity = false;
      }
      return persistenceStatus;
    },
    /**
     * Reset all admin settings to defaults
     */
    resetAdminSettings: () => {
      console.log("\u{1F504} Resetting all admin settings to defaults...");
      try {
        const adminKeys = [
          "adminAvatar",
          "adminSiteTitle",
          "adminSiteDescription",
          "adminThemeColor",
          "adminPassword"
        ];
        adminKeys.forEach((key) => {
          localStorage.removeItem(key);
          console.log(`\u{1F5D1}\uFE0F Removed ${key}`);
        });
        Stack.loadAdminSettings();
        Stack.showSuccessMessage("\u6240\u6709\u8BBE\u7F6E\u5DF2\u91CD\u7F6E\u4E3A\u9ED8\u8BA4\u503C");
        console.log("\u2705 All admin settings reset to defaults");
      } catch (error) {
        console.error("\u274C Error resetting admin settings:", error);
        Stack.showErrorMessage("\u91CD\u7F6E\u8BBE\u7F6E\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5");
      }
    },
    /**
     * Form validation utilities
     */
    FormValidator: {
      /**
       * Validate site title
       */
      validateTitle: (title) => {
        if (!title || title.trim().length === 0) {
          return { isValid: false, message: "\u7AD9\u70B9\u6807\u9898\u4E0D\u80FD\u4E3A\u7A7A" };
        }
        if (title.trim().length < 2) {
          return { isValid: false, message: "\u7AD9\u70B9\u6807\u9898\u81F3\u5C11\u9700\u89812\u4E2A\u5B57\u7B26" };
        }
        if (title.trim().length > 50) {
          return { isValid: false, message: "\u7AD9\u70B9\u6807\u9898\u4E0D\u80FD\u8D85\u8FC750\u4E2A\u5B57\u7B26" };
        }
        if (!/^[a-zA-Z0-9\u4e00-\u9fa5\s\-_\.]+$/.test(title.trim())) {
          return { isValid: false, message: "\u7AD9\u70B9\u6807\u9898\u53EA\u80FD\u5305\u542B\u5B57\u6BCD\u3001\u6570\u5B57\u3001\u4E2D\u6587\u3001\u7A7A\u683C\u3001\u8FDE\u5B57\u7B26\u3001\u4E0B\u5212\u7EBF\u548C\u70B9\u53F7" };
        }
        return { isValid: true, message: "\u7AD9\u70B9\u6807\u9898\u683C\u5F0F\u6B63\u786E" };
      },
      /**
       * Validate site description
       */
      validateDescription: (description) => {
        if (!description || description.trim().length === 0) {
          return { isValid: false, message: "\u7AD9\u70B9\u63CF\u8FF0\u4E0D\u80FD\u4E3A\u7A7A" };
        }
        if (description.trim().length < 5) {
          return { isValid: false, message: "\u7AD9\u70B9\u63CF\u8FF0\u81F3\u5C11\u9700\u89815\u4E2A\u5B57\u7B26" };
        }
        if (description.trim().length > 200) {
          return { isValid: false, message: "\u7AD9\u70B9\u63CF\u8FF0\u4E0D\u80FD\u8D85\u8FC7200\u4E2A\u5B57\u7B26" };
        }
        return { isValid: true, message: "\u7AD9\u70B9\u63CF\u8FF0\u683C\u5F0F\u6B63\u786E" };
      },
      /**
       * Validate password with enhanced strength checking
       */
      validatePassword: (password) => {
        if (!password || password.trim().length === 0) {
          return { isValid: false, message: "\u5BC6\u7801\u4E0D\u80FD\u4E3A\u7A7A", strength: "weak" };
        }
        if (password.length < 4) {
          return { isValid: false, message: "\u5BC6\u7801\u957F\u5EA6\u81F3\u5C114\u4E2A\u5B57\u7B26", strength: "weak" };
        }
        if (password.length > 50) {
          return { isValid: false, message: "\u5BC6\u7801\u957F\u5EA6\u4E0D\u80FD\u8D85\u8FC750\u4E2A\u5B57\u7B26", strength: "weak" };
        }
        if (!/^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/.test(password)) {
          return { isValid: false, message: "\u5BC6\u7801\u53EA\u80FD\u5305\u542B\u5B57\u6BCD\u3001\u6570\u5B57\u548C\u5E38\u7528\u7B26\u53F7", strength: "weak" };
        }
        let strength = "weak";
        let strengthScore = 0;
        if (password.length >= 8) strengthScore++;
        if (/[a-z]/.test(password)) strengthScore++;
        if (/[A-Z]/.test(password)) strengthScore++;
        if (/[0-9]/.test(password)) strengthScore++;
        if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) strengthScore++;
        if (strengthScore >= 4) {
          strength = "strong";
        } else if (strengthScore >= 2) {
          strength = "medium";
        }
        return {
          isValid: true,
          message: `\u5BC6\u7801\u5F3A\u5EA6: ${strength === "strong" ? "\u5F3A" : strength === "medium" ? "\u4E2D\u7B49" : "\u5F31"}`,
          strength
        };
      },
      /**
       * Validate theme color
       */
      validateThemeColor: (color) => {
        if (!color || color.trim().length === 0) {
          return { isValid: false, message: "\u4E3B\u9898\u8272\u4E0D\u80FD\u4E3A\u7A7A" };
        }
        if (!/^#[0-9A-F]{6}$/i.test(color)) {
          return { isValid: false, message: "\u4E3B\u9898\u8272\u683C\u5F0F\u4E0D\u6B63\u786E\uFF0C\u8BF7\u4F7F\u7528\u5341\u516D\u8FDB\u5236\u989C\u8272\u4EE3\u7801\uFF08\u5982 #FF0000\uFF09" };
        }
        return { isValid: true, message: "\u4E3B\u9898\u8272\u683C\u5F0F\u6B63\u786E" };
      },
      /**
       * Show validation message for a specific field
       */
      showFieldValidation: (fieldId, validation) => {
        const field = document.getElementById(fieldId);
        if (!field) return;
        const existingMessage = field.parentElement?.querySelector(".validation-message");
        if (existingMessage) {
          existingMessage.remove();
        }
        field.classList.remove("validation-success", "validation-error", "validation-warning");
        const messageElement = document.createElement("div");
        messageElement.className = `validation-message ${validation.isValid ? "validation-success" : "validation-error"}`;
        messageElement.innerHTML = `
                <svg class="validation-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    ${validation.isValid ? '<path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path><polyline points="22,4 12,14.01 9,11.01"></polyline>' : '<circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line>'}
                </svg>
                <span>${validation.message}</span>
            `;
        field.classList.add(validation.isValid ? "validation-success" : "validation-error");
        if (fieldId.includes("password") && validation.strength) {
          const strengthClass = `strength-${validation.strength}`;
          messageElement.classList.add(strengthClass);
        }
        field.parentElement?.appendChild(messageElement);
      },
      /**
       * Validate all form fields
       */
      validateAllFields: () => {
        let allValid = true;
        const titleInput = document.getElementById("admin-site-title");
        if (titleInput) {
          const titleValidation = Stack.FormValidator.validateTitle(titleInput.value);
          Stack.FormValidator.showFieldValidation("admin-site-title", titleValidation);
          if (!titleValidation.isValid) allValid = false;
        }
        const descInput = document.getElementById("admin-site-description");
        if (descInput) {
          const descValidation = Stack.FormValidator.validateDescription(descInput.value);
          Stack.FormValidator.showFieldValidation("admin-site-description", descValidation);
          if (!descValidation.isValid) allValid = false;
        }
        const colorInput = document.getElementById("admin-theme-color");
        if (colorInput) {
          const colorValidation = Stack.FormValidator.validateThemeColor(colorInput.value);
          Stack.FormValidator.showFieldValidation("admin-theme-color", colorValidation);
          if (!colorValidation.isValid) allValid = false;
        }
        return allValid;
      }
    },
    /**
     * Setup real-time form validation
     */
    setupFormValidation: () => {
      console.log("\u{1F527} Setting up real-time form validation...");
      const titleInput = document.getElementById("admin-site-title");
      if (titleInput) {
        titleInput.addEventListener("input", () => {
          const validation = Stack.FormValidator.validateTitle(titleInput.value);
          Stack.FormValidator.showFieldValidation("admin-site-title", validation);
        });
        titleInput.addEventListener("blur", () => {
          const validation = Stack.FormValidator.validateTitle(titleInput.value);
          Stack.FormValidator.showFieldValidation("admin-site-title", validation);
        });
      }
      const descInput = document.getElementById("admin-site-description");
      if (descInput) {
        descInput.addEventListener("input", () => {
          const validation = Stack.FormValidator.validateDescription(descInput.value);
          Stack.FormValidator.showFieldValidation("admin-site-description", validation);
        });
        descInput.addEventListener("blur", () => {
          const validation = Stack.FormValidator.validateDescription(descInput.value);
          Stack.FormValidator.showFieldValidation("admin-site-description", validation);
        });
      }
      const passwordInput = document.getElementById("admin-new-password");
      if (passwordInput) {
        passwordInput.addEventListener("input", () => {
          if (passwordInput.value.length > 0) {
            const validation = Stack.FormValidator.validatePassword(passwordInput.value);
            Stack.FormValidator.showFieldValidation("admin-new-password", validation);
          }
        });
        passwordInput.addEventListener("blur", () => {
          if (passwordInput.value.length > 0) {
            const validation = Stack.FormValidator.validatePassword(passwordInput.value);
            Stack.FormValidator.showFieldValidation("admin-new-password", validation);
          }
        });
      }
      const colorInput = document.getElementById("admin-theme-color");
      if (colorInput) {
        colorInput.addEventListener("change", () => {
          const validation = Stack.FormValidator.validateThemeColor(colorInput.value);
          Stack.FormValidator.showFieldValidation("admin-theme-color", validation);
        });
      }
      console.log("\u2705 Real-time form validation setup complete");
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
     * Change admin password with enhanced validation
     */
    changeAdminPassword: () => {
      const newPasswordInput = document.getElementById("admin-new-password");
      if (!newPasswordInput) {
        Stack.showErrorMessage("\u5BC6\u7801\u8F93\u5165\u6846\u672A\u627E\u5230");
        return;
      }
      const newPassword = newPasswordInput.value.trim();
      const validation = Stack.FormValidator.validatePassword(newPassword);
      if (!validation.isValid) {
        Stack.showErrorMessage(validation.message);
        Stack.FormValidator.showFieldValidation("admin-new-password", validation);
        return;
      }
      if (validation.strength === "weak") {
        const confirmWeak = confirm("\u60A8\u7684\u5BC6\u7801\u5F3A\u5EA6\u8F83\u5F31\uFF0C\u5EFA\u8BAE\u4F7F\u7528\u5305\u542B\u5927\u5C0F\u5199\u5B57\u6BCD\u3001\u6570\u5B57\u548C\u7279\u6B8A\u5B57\u7B26\u7684\u5BC6\u7801\u3002\u662F\u5426\u7EE7\u7EED\uFF1F");
        if (!confirmWeak) {
          return;
        }
      }
      try {
        if (globalAuth) {
          if (globalAuth.config) {
            globalAuth.config.adminPassword = newPassword;
            console.log("\u2705 Updated globalAuth.config.adminPassword");
          }
          if (typeof globalAuth.updatePassword === "function") {
            globalAuth.updatePassword(newPassword);
            console.log("\u2705 Called globalAuth.updatePassword()");
          }
        }
        localStorage.setItem("adminPassword", newPassword);
        console.log("\u2705 Saved new password to localStorage");
        newPasswordInput.value = "";
        const validationMessage = newPasswordInput.parentElement?.querySelector(".validation-message");
        if (validationMessage) {
          validationMessage.remove();
        }
        newPasswordInput.classList.remove("validation-success", "validation-error");
        Stack.showSuccessMessage(`\u5BC6\u7801\u5DF2\u6210\u529F\u66F4\u65B0\uFF01\u5BC6\u7801\u5F3A\u5EA6: ${validation.strength === "strong" ? "\u5F3A" : validation.strength === "medium" ? "\u4E2D\u7B49" : "\u5F31"}`);
        console.log("\u{1F510} Password change completed successfully");
      } catch (error) {
        console.error("\u274C Password change failed:", error);
        Stack.showErrorMessage("\u5BC6\u7801\u66F4\u65B0\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5");
      }
    },
    /**
     * Open image manager in new tab
     */
    openImageManager: () => {
      console.log("\u{1F5BC}\uFE0F Opening image manager...");
      const imageManagerUrl = "/page/image-manager/";
      window.open(imageManagerUrl, "_blank");
      Stack.hideAdminPanel();
      console.log("\u2705 Image manager opened in new tab");
    },
    /**
     * Open archives manager in new tab
     */
    openArchivesManager: () => {
      console.log("\u{1F4DA} Opening archives manager...");
      const archivesUrl = "/archives/";
      window.open(archivesUrl, "_blank");
      Stack.hideAdminPanel();
      console.log("\u2705 Archives manager opened in new tab");
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
        setTimeout(() => {
          Stack.setupFormValidation();
        }, 100);
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
     * Handle new post creation
     */
    handleNewPost: () => {
      console.log("\u{1F4DD} Creating new post...");
      Stack.showSuccessMessage("\u65B0\u5EFA\u6587\u7AE0\u529F\u80FD\u6B63\u5728\u5F00\u53D1\u4E2D\uFF0C\u656C\u8BF7\u671F\u5F85\uFF01");
    },
    /**
     * Handle post management
     */
    handleManagePosts: () => {
      console.log("\u{1F4CB} Managing posts...");
      Stack.showSuccessMessage("\u6587\u7AE0\u7BA1\u7406\u529F\u80FD\u6B63\u5728\u5F00\u53D1\u4E2D\uFF0C\u656C\u8BF7\u671F\u5F85\uFF01");
    },
    /**
     * Handle site statistics
     */
    handleSiteStats: () => {
      console.log("\u{1F4CA} Showing site statistics...");
      const stats = {
        totalPosts: 5,
        totalViews: 1234,
        totalComments: 56,
        lastUpdate: (/* @__PURE__ */ new Date()).toLocaleDateString()
      };
      const message = `
            \u{1F4CA} \u7AD9\u70B9\u7EDF\u8BA1\u4FE1\u606F\uFF1A
            \u2022 \u6587\u7AE0\u603B\u6570\uFF1A${stats.totalPosts} \u7BC7
            \u2022 \u603B\u8BBF\u95EE\u91CF\uFF1A${stats.totalViews} \u6B21
            \u2022 \u8BC4\u8BBA\u603B\u6570\uFF1A${stats.totalComments} \u6761
            \u2022 \u6700\u540E\u66F4\u65B0\uFF1A${stats.lastUpdate}
        `;
      Stack.showSuccessMessage(message);
    },
    /**
     * Handle password change
     */
    handlePasswordChange: () => {
      const passwordInput = document.getElementById("admin-new-password");
      if (!passwordInput || !passwordInput.value.trim()) {
        Stack.showErrorMessage("\u8BF7\u8F93\u5165\u65B0\u5BC6\u7801");
        return;
      }
      const newPassword = passwordInput.value.trim();
      if (newPassword.length < 4) {
        Stack.showErrorMessage("\u5BC6\u7801\u957F\u5EA6\u81F3\u5C114\u4E2A\u5B57\u7B26");
        return;
      }
      if (globalAuth && globalAuth.config) {
        globalAuth.config.adminPassword = newPassword;
        localStorage.setItem("adminPassword", newPassword);
        passwordInput.value = "";
        Stack.showSuccessMessage("\u7BA1\u7406\u5458\u5BC6\u7801\u5DF2\u66F4\u65B0");
        console.log("\u2705 Admin password updated");
      } else {
        Stack.showErrorMessage("\u5BC6\u7801\u66F4\u65B0\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5");
      }
    },
    /**
     * Handle dark mode toggle
     */
    handleDarkModeToggle: (enabled) => {
      console.log("\u{1F319} Dark mode toggle:", enabled);
      localStorage.setItem("adminDarkModeDefault", enabled.toString());
      if (enabled) {
        document.documentElement.setAttribute("data-scheme", "dark");
        Stack.showSuccessMessage("\u5DF2\u8BBE\u7F6E\u9ED8\u8BA4\u6DF1\u8272\u6A21\u5F0F");
      } else {
        document.documentElement.setAttribute("data-scheme", "light");
        Stack.showSuccessMessage("\u5DF2\u8BBE\u7F6E\u9ED8\u8BA4\u6D45\u8272\u6A21\u5F0F");
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
  document.addEventListener("DOMContentLoaded", () => {
    console.log("\u{1F3A8} Modern blog layout initialized");
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        }
      });
    });
    document.querySelectorAll(".btn").forEach((button) => {
      button.addEventListener("click", function() {
        if (!this.classList.contains("btn-loading")) {
          this.classList.add("btn-loading");
          setTimeout(() => {
            this.classList.remove("btn-loading");
          }, 2e3);
        }
      });
    });
    document.querySelectorAll(".article-card, .article-list article").forEach((card) => {
      card.addEventListener("mouseenter", function() {
        this.style.transform = "translateY(-4px)";
      });
      card.addEventListener("mouseleave", function() {
        this.style.transform = "translateY(0)";
      });
    });
    console.log("\u2705 Modern layout enhancements applied");
  });
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
