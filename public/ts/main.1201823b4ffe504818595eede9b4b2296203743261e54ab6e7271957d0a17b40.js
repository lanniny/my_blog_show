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
      const isAuth = this.currentStatus === "authenticated" && !this.isSessionExpired();
      const isAdminUser = isAuth;
      const event = new CustomEvent("onAuthStatusChange", {
        detail: {
          status,
          isAuthenticated: isAuth,
          isAdmin: isAdminUser,
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
      this.preconnectDomain("https://fonts.googleapis.com");
      this.preconnectDomain("https://fonts.gstatic.com");
      this.preconnectDomain("https://cdn.jsdelivr.net");
      console.log("\u2705 \u8D44\u6E90\u9884\u52A0\u8F7D\u8BBE\u7F6E\u5B8C\u6210");
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

  // ns-hugo-imp:C:\Users\16643\Desktop\blog\hugo\blog\assets\ts\links-enhance.ts
  var LinksEnhancer = class {
    container;
    searchInput;
    categoryFilter;
    statusFilter;
    featuredToggle;
    viewToggle;
    linksContainer;
    noResults;
    links = [];
    filteredLinks = [];
    currentView = "grid";
    filters = {
      search: "",
      category: "",
      status: "",
      featured: false
    };
    constructor() {
      this.init();
    }
    /**
     * Initialize the links enhancer
     */
    init() {
      console.log("\u{1F517} \u521D\u59CB\u5316\u94FE\u63A5\u589E\u5F3A\u529F\u80FD...");
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => {
          this.setupElements();
        });
      } else {
        this.setupElements();
      }
    }
    /**
     * Setup DOM elements and event listeners
     */
    setupElements() {
      this.container = document.querySelector(".links-enhanced-container");
      if (!this.container) {
        console.log("\u274C Links enhanced container not found");
        return;
      }
      this.searchInput = this.container.querySelector("#links-search-input");
      this.categoryFilter = this.container.querySelector("#category-filter");
      this.statusFilter = this.container.querySelector("#status-filter");
      this.featuredToggle = this.container.querySelector("#featured-toggle");
      this.viewToggle = this.container.querySelectorAll(".view-btn");
      this.linksContainer = this.container.querySelector("#links-container");
      this.noResults = this.container.querySelector("#no-results");
      if (!this.searchInput || !this.linksContainer) {
        console.log("\u274C Required elements not found");
        return;
      }
      this.parseLinks();
      this.setupEventListeners();
      this.updateStats();
      console.log(`\u2705 \u94FE\u63A5\u589E\u5F3A\u529F\u80FD\u5DF2\u542F\u7528\uFF0C\u5171 ${this.links.length} \u4E2A\u94FE\u63A5`);
    }
    /**
     * Parse existing links from DOM
     */
    parseLinks() {
      const linkCards = this.linksContainer.querySelectorAll(".link-card");
      linkCards.forEach((card) => {
        const titleElement = card.querySelector(".link-title");
        const descElement = card.querySelector(".link-description");
        const linkElement = card.querySelector("a");
        if (titleElement && descElement && linkElement) {
          const link = {
            title: titleElement.textContent?.trim() || "",
            description: descElement.textContent?.trim() || "",
            website: linkElement.href || "",
            category: card.getAttribute("data-category") || "",
            tags: card.getAttribute("data-tags")?.split(",").filter((t) => t.trim()) || [],
            status: card.getAttribute("data-status") || "active",
            featured: card.getAttribute("data-featured") === "true",
            element: card
          };
          this.links.push(link);
        }
      });
      this.filteredLinks = [...this.links];
    }
    /**
     * Setup event listeners
     */
    setupEventListeners() {
      this.searchInput.addEventListener("input", (e) => {
        this.filters.search = e.target.value.toLowerCase();
        this.applyFilters();
      });
      this.categoryFilter?.addEventListener("change", (e) => {
        this.filters.category = e.target.value;
        this.applyFilters();
      });
      this.statusFilter?.addEventListener("change", (e) => {
        this.filters.status = e.target.value;
        this.applyFilters();
      });
      this.featuredToggle?.addEventListener("click", () => {
        this.filters.featured = !this.filters.featured;
        this.featuredToggle.classList.toggle("active", this.filters.featured);
        this.applyFilters();
      });
      this.viewToggle.forEach((btn) => {
        btn.addEventListener("click", () => {
          const view = btn.getAttribute("data-view");
          this.switchView(view);
        });
      });
      document.addEventListener("keydown", (e) => {
        if (e.ctrlKey || e.metaKey) {
          switch (e.key) {
            case "f":
              e.preventDefault();
              this.searchInput.focus();
              break;
            case "g":
              e.preventDefault();
              this.switchView("grid");
              break;
            case "l":
              e.preventDefault();
              this.switchView("list");
              break;
          }
        }
      });
    }
    /**
     * Apply current filters to links
     */
    applyFilters() {
      this.filteredLinks = this.links.filter((link) => {
        if (this.filters.search) {
          const searchTerm = this.filters.search;
          const searchableText = `${link.title} ${link.description} ${link.tags?.join(" ")}`.toLowerCase();
          if (!searchableText.includes(searchTerm)) {
            return false;
          }
        }
        if (this.filters.category && link.category !== this.filters.category) {
          return false;
        }
        if (this.filters.status && link.status !== this.filters.status) {
          return false;
        }
        if (this.filters.featured && !link.featured) {
          return false;
        }
        return true;
      });
      this.renderFilteredLinks();
      this.updateStats();
    }
    /**
     * Render filtered links
     */
    renderFilteredLinks() {
      this.links.forEach((link) => {
        link.element.style.display = "none";
      });
      if (this.filteredLinks.length > 0) {
        this.filteredLinks.forEach((link) => {
          link.element.style.display = "block";
        });
        this.noResults.style.display = "none";
      } else {
        this.noResults.style.display = "block";
      }
    }
    /**
     * Switch between grid and list view
     */
    switchView(view) {
      this.currentView = view;
      this.viewToggle.forEach((btn) => {
        btn.classList.toggle("active", btn.getAttribute("data-view") === view);
      });
      this.linksContainer.className = `links-container ${view}-view`;
      localStorage.setItem("links-view-preference", view);
    }
    /**
     * Update statistics
     */
    updateStats() {
      const totalElement = document.getElementById("total-links");
      const activeElement = document.getElementById("active-links");
      const featuredElement = document.getElementById("featured-links");
      const categoriesElement = document.getElementById("categories-count");
      if (totalElement) totalElement.textContent = this.filteredLinks.length.toString();
      if (activeElement) {
        const activeCount = this.filteredLinks.filter((l) => l.status === "active").length;
        activeElement.textContent = activeCount.toString();
      }
      if (featuredElement) {
        const featuredCount = this.filteredLinks.filter((l) => l.featured).length;
        featuredElement.textContent = featuredCount.toString();
      }
      if (categoriesElement) {
        const categories = new Set(this.filteredLinks.map((l) => l.category).filter(Boolean));
        categoriesElement.textContent = categories.size.toString();
      }
    }
    /**
     * Clear all filters
     */
    clearFilters() {
      this.filters = {
        search: "",
        category: "",
        status: "",
        featured: false
      };
      this.searchInput.value = "";
      if (this.categoryFilter) this.categoryFilter.value = "";
      if (this.statusFilter) this.statusFilter.value = "";
      this.featuredToggle?.classList.remove("active");
      this.applyFilters();
    }
    /**
     * Get current filter state
     */
    getFilters() {
      return { ...this.filters };
    }
    /**
     * Get filtered links
     */
    getFilteredLinks() {
      return [...this.filteredLinks];
    }
  };
  window.checkLinkStatus = async (url, button) => {
    const originalHTML = button.innerHTML;
    button.innerHTML = '<div class="loading-spinner"></div>';
    button.disabled = true;
    try {
      const response = await fetch(url, {
        method: "HEAD",
        mode: "no-cors",
        cache: "no-cache"
      });
      button.innerHTML = "\u2705";
      button.title = "\u94FE\u63A5\u53EF\u8BBF\u95EE";
      setTimeout(() => {
        button.innerHTML = originalHTML;
        button.disabled = false;
      }, 2e3);
    } catch (error) {
      button.innerHTML = "\u274C";
      button.title = "\u94FE\u63A5\u53EF\u80FD\u4E0D\u53EF\u8BBF\u95EE";
      setTimeout(() => {
        button.innerHTML = originalHTML;
        button.disabled = false;
      }, 2e3);
    }
  };
  window.copyLink = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
      const toast = document.createElement("div");
      toast.className = "copy-toast";
      toast.textContent = "\u94FE\u63A5\u5DF2\u590D\u5236\u5230\u526A\u8D34\u677F";
      document.body.appendChild(toast);
      setTimeout(() => {
        toast.classList.add("show");
      }, 10);
      setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => {
          document.body.removeChild(toast);
        }, 300);
      }, 2e3);
    } catch (error) {
      console.error("\u590D\u5236\u5931\u8D25:", error);
    }
  };
  var linksEnhancer = new LinksEnhancer();
  window.LinksEnhancer = LinksEnhancer;
  window.linksEnhancer = linksEnhancer;

  // ns-hugo-imp:C:\Users\16643\Desktop\blog\hugo\blog\assets\ts\background-manager.ts
  var BackgroundManager = class {
    container;
    previewArea;
    uploadArea;
    styleLibrary;
    settingsPanel;
    currentSettings;
    presetStyles = [];
    customStyles = [];
    constructor() {
      this.initializePresetStyles();
      this.loadCustomStyles();
      this.init();
    }
    /**
     * Initialize the background manager
     */
    init() {
      console.log("\u{1F3A8} \u521D\u59CB\u5316\u80CC\u666F\u56FE\u7247\u7BA1\u7406\u7CFB\u7EDF...");
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => {
          this.setupInterface();
        });
      } else {
        this.setupInterface();
      }
    }
    /**
     * Setup the background manager interface
     */
    setupInterface() {
      const adminPanel = document.querySelector(".admin-panel");
      if (!adminPanel) {
        console.log("\u274C Admin panel not found, background manager not initialized");
        return;
      }
      this.createBackgroundManagerInterface();
      this.setupEventListeners();
      this.loadCurrentSettings();
      console.log("\u2705 \u80CC\u666F\u56FE\u7247\u7BA1\u7406\u7CFB\u7EDF\u5DF2\u542F\u7528");
    }
    /**
     * Create the background manager interface
     */
    createBackgroundManagerInterface() {
      const backgroundManagerHTML = `
            <div class="background-manager" id="background-manager">
                <div class="background-manager-header">
                    <h3>\u{1F3A8} \u80CC\u666F\u56FE\u7247\u7BA1\u7406</h3>
                    <button class="close-btn" id="close-background-manager">\xD7</button>
                </div>
                
                <div class="background-manager-content">
                    <!-- Upload Area -->
                    <div class="upload-section">
                        <h4>\u{1F4E4} \u4E0A\u4F20\u80CC\u666F\u56FE\u7247</h4>
                        <div class="upload-area" id="upload-area">
                            <div class="upload-placeholder">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                    <polyline points="7,10 12,15 17,10"></polyline>
                                    <line x1="12" y1="15" x2="12" y2="3"></line>
                                </svg>
                                <p>\u62D6\u62FD\u56FE\u7247\u5230\u6B64\u5904\u6216\u70B9\u51FB\u4E0A\u4F20</p>
                                <small>\u652F\u6301 JPG, PNG, WebP \u683C\u5F0F\uFF0C\u6700\u5927 5MB</small>
                            </div>
                            <input type="file" id="background-upload" accept="image/*" hidden>
                        </div>
                    </div>

                    <!-- Preview Area -->
                    <div class="preview-section">
                        <h4>\u{1F441}\uFE0F \u5B9E\u65F6\u9884\u89C8</h4>
                        <div class="preview-area" id="preview-area">
                            <div class="preview-content">
                                <h3>\u9884\u89C8\u6548\u679C</h3>
                                <p>\u8FD9\u91CC\u663E\u793A\u80CC\u666F\u6548\u679C\u9884\u89C8</p>
                            </div>
                        </div>
                    </div>

                    <!-- Style Library -->
                    <div class="style-library-section">
                        <h4>\u{1F3AD} \u6837\u5F0F\u5E93</h4>
                        <div class="style-tabs">
                            <button class="style-tab active" data-tab="preset">\u9884\u8BBE\u6837\u5F0F</button>
                            <button class="style-tab" data-tab="gradient">\u6E10\u53D8\u80CC\u666F</button>
                            <button class="style-tab" data-tab="pattern">\u56FE\u6848\u7EB9\u7406</button>
                            <button class="style-tab" data-tab="custom">\u81EA\u5B9A\u4E49</button>
                        </div>
                        <div class="style-library" id="style-library">
                            <!-- Styles will be populated here -->
                        </div>
                    </div>

                    <!-- Settings Panel -->
                    <div class="settings-section">
                        <h4>\u2699\uFE0F \u9AD8\u7EA7\u8BBE\u7F6E</h4>
                        <div class="settings-grid">
                            <div class="setting-group">
                                <label for="opacity-slider">\u900F\u660E\u5EA6</label>
                                <input type="range" id="opacity-slider" min="0" max="100" value="100">
                                <span class="setting-value" id="opacity-value">100%</span>
                            </div>
                            
                            <div class="setting-group">
                                <label for="blur-slider">\u6A21\u7CCA\u6548\u679C</label>
                                <input type="range" id="blur-slider" min="0" max="20" value="0">
                                <span class="setting-value" id="blur-value">0px</span>
                            </div>
                            
                            <div class="setting-group">
                                <label for="position-select">\u4F4D\u7F6E</label>
                                <select id="position-select">
                                    <option value="center">\u5C45\u4E2D</option>
                                    <option value="top">\u9876\u90E8</option>
                                    <option value="bottom">\u5E95\u90E8</option>
                                    <option value="left">\u5DE6\u4FA7</option>
                                    <option value="right">\u53F3\u4FA7</option>
                                </select>
                            </div>
                            
                            <div class="setting-group">
                                <label for="size-select">\u5C3A\u5BF8</label>
                                <select id="size-select">
                                    <option value="cover">\u8986\u76D6</option>
                                    <option value="contain">\u5305\u542B</option>
                                    <option value="auto">\u81EA\u52A8</option>
                                    <option value="100% 100%">\u62C9\u4F38</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="action-buttons">
                        <button class="btn btn-primary" id="apply-background">\u5E94\u7528\u80CC\u666F</button>
                        <button class="btn btn-secondary" id="reset-background">\u91CD\u7F6E</button>
                        <button class="btn btn-secondary" id="save-preset">\u4FDD\u5B58\u4E3A\u9884\u8BBE</button>
                    </div>
                </div>
            </div>
        `;
      const adminPanel = document.querySelector(".admin-panel");
      if (adminPanel) {
        adminPanel.insertAdjacentHTML("beforeend", backgroundManagerHTML);
        this.container = document.getElementById("background-manager");
        this.previewArea = document.getElementById("preview-area");
        this.uploadArea = document.getElementById("upload-area");
        this.styleLibrary = document.getElementById("style-library");
      }
    }
    /**
     * Initialize preset styles
     */
    initializePresetStyles() {
      this.presetStyles = [
        {
          id: "preset-1",
          name: "\u6E05\u65B0\u84DD\u8272",
          type: "gradient",
          value: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          category: "preset"
        },
        {
          id: "preset-2",
          name: "\u6E29\u6696\u6A59\u8272",
          type: "gradient",
          value: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
          category: "preset"
        },
        {
          id: "preset-3",
          name: "\u81EA\u7136\u7EFF\u8272",
          type: "gradient",
          value: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
          category: "preset"
        },
        {
          id: "preset-4",
          name: "\u4F18\u96C5\u7D2B\u8272",
          type: "gradient",
          value: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
          category: "preset"
        },
        {
          id: "preset-5",
          name: "\u6DF1\u9083\u591C\u7A7A",
          type: "gradient",
          value: "linear-gradient(135deg, #2c3e50 0%, #34495e 100%)",
          category: "preset"
        },
        {
          id: "pattern-1",
          name: "\u51E0\u4F55\u56FE\u6848",
          type: "pattern",
          value: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          category: "preset"
        },
        {
          id: "pattern-2",
          name: "\u6CE2\u6D6A\u7EB9\u7406",
          type: "pattern",
          value: 'url("data:image/svg+xml,%3Csvg width="100" height="20" viewBox="0 0 100 20" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M21.184 20c.357-.13.72-.264 1.088-.402l1.768-.661C33.64 15.347 39.647 14 50 14c10.271 0 15.362 1.222 24.629 4.928.955.383 1.869.74 2.75 1.072h6.225c-2.51-.73-5.139-1.691-8.233-2.928C65.888 13.278 60.562 12 50 12c-10.626 0-16.855 1.397-26.66 5.063l-1.767.662c-2.475.923-4.66 1.674-6.724 2.275h6.335zm0-20C13.258 2.892 8.077 4 0 4V2c5.744 0 9.951-.574 14.85-2h6.334zM77.38 0C85.239 2.966 90.502 4 100 4V2c-6.842 0-11.386-.542-16.396-2h-6.225zM0 14c8.44 0 13.718-1.21 22.272-4.402l1.768-.661C33.64 5.347 39.647 4 50 4c10.271 0 15.362 1.222 24.629 4.928C84.112 12.722 89.438 14 100 14v-2c-10.271 0-15.362-1.222-24.629-4.928C65.888 3.278 60.562 2 50 2 39.374 2 33.145 3.397 23.34 7.063l-1.767.662C13.223 10.84 8.163 12 0 12v2z" fill="%239C92AC" fill-opacity="0.05" fill-rule="evenodd"/%3E%3C/svg%3E")',
          category: "preset"
        }
      ];
    }
    /**
     * Load custom styles from localStorage
     */
    loadCustomStyles() {
      const saved = localStorage.getItem("background-custom-styles");
      if (saved) {
        try {
          this.customStyles = JSON.parse(saved);
        } catch (error) {
          console.warn("Failed to load custom styles:", error);
          this.customStyles = [];
        }
      }
    }
    /**
     * Save custom styles to localStorage
     */
    saveCustomStyles() {
      localStorage.setItem("background-custom-styles", JSON.stringify(this.customStyles));
    }
    /**
     * Load current background settings
     */
    loadCurrentSettings() {
      const saved = localStorage.getItem("background-current-settings");
      if (saved) {
        try {
          this.currentSettings = JSON.parse(saved);
          this.applySettingsToInterface();
        } catch (error) {
          console.warn("Failed to load current settings:", error);
          this.setDefaultSettings();
        }
      } else {
        this.setDefaultSettings();
      }
    }
    /**
     * Set default background settings
     */
    setDefaultSettings() {
      this.currentSettings = {
        style: this.presetStyles[0],
        opacity: 100,
        blur: 0,
        position: "center",
        size: "cover",
        repeat: "no-repeat",
        attachment: "fixed"
      };
    }
    /**
     * Apply settings to interface controls
     */
    applySettingsToInterface() {
      const opacitySlider = document.getElementById("opacity-slider");
      const blurSlider = document.getElementById("blur-slider");
      const positionSelect = document.getElementById("position-select");
      const sizeSelect = document.getElementById("size-select");
      if (opacitySlider) opacitySlider.value = this.currentSettings.opacity.toString();
      if (blurSlider) blurSlider.value = this.currentSettings.blur.toString();
      if (positionSelect) positionSelect.value = this.currentSettings.position;
      if (sizeSelect) sizeSelect.value = this.currentSettings.size;
      this.updatePreview();
    }
    /**
     * Setup event listeners
     */
    setupEventListeners() {
      this.setupUploadEvents();
      this.setupStyleEvents();
      this.setupSettingsEvents();
      this.setupActionEvents();
      this.setupTabEvents();
    }
    /**
     * Setup upload events
     */
    setupUploadEvents() {
      const uploadArea = this.uploadArea;
      const fileInput = document.getElementById("background-upload");
      uploadArea.addEventListener("click", () => {
        fileInput.click();
      });
      fileInput.addEventListener("change", (e) => {
        const files = e.target.files;
        if (files && files.length > 0) {
          this.handleFileUpload(files[0]);
        }
      });
      uploadArea.addEventListener("dragover", (e) => {
        e.preventDefault();
        uploadArea.classList.add("drag-over");
      });
      uploadArea.addEventListener("dragleave", () => {
        uploadArea.classList.remove("drag-over");
      });
      uploadArea.addEventListener("drop", (e) => {
        e.preventDefault();
        uploadArea.classList.remove("drag-over");
        const files = e.dataTransfer?.files;
        if (files && files.length > 0) {
          this.handleFileUpload(files[0]);
        }
      });
    }
    /**
     * Handle file upload
     */
    handleFileUpload(file) {
      if (!file.type.startsWith("image/")) {
        alert("\u8BF7\u9009\u62E9\u56FE\u7247\u6587\u4EF6");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert("\u6587\u4EF6\u5927\u5C0F\u4E0D\u80FD\u8D85\u8FC7 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result;
        const customStyle = {
          id: `custom-${Date.now()}`,
          name: file.name,
          type: "image",
          value: `url("${dataUrl}")`,
          category: "custom"
        };
        this.customStyles.push(customStyle);
        this.saveCustomStyles();
        this.currentSettings.style = customStyle;
        this.updatePreview();
        this.renderStyleLibrary("custom");
        console.log("\u2705 \u80CC\u666F\u56FE\u7247\u4E0A\u4F20\u6210\u529F");
      };
      reader.readAsDataURL(file);
    }
    /**
     * Setup style selection events
     */
    setupStyleEvents() {
    }
    /**
     * Setup settings controls events
     */
    setupSettingsEvents() {
      const opacitySlider = document.getElementById("opacity-slider");
      const opacityValue = document.getElementById("opacity-value");
      opacitySlider?.addEventListener("input", (e) => {
        const value = parseInt(e.target.value);
        this.currentSettings.opacity = value;
        opacityValue.textContent = `${value}%`;
        this.updatePreview();
      });
      const blurSlider = document.getElementById("blur-slider");
      const blurValue = document.getElementById("blur-value");
      blurSlider?.addEventListener("input", (e) => {
        const value = parseInt(e.target.value);
        this.currentSettings.blur = value;
        blurValue.textContent = `${value}px`;
        this.updatePreview();
      });
      const positionSelect = document.getElementById("position-select");
      positionSelect?.addEventListener("change", (e) => {
        this.currentSettings.position = e.target.value;
        this.updatePreview();
      });
      const sizeSelect = document.getElementById("size-select");
      sizeSelect?.addEventListener("change", (e) => {
        this.currentSettings.size = e.target.value;
        this.updatePreview();
      });
    }
    /**
     * Setup action button events
     */
    setupActionEvents() {
      const applyBtn = document.getElementById("apply-background");
      applyBtn?.addEventListener("click", () => {
        this.applyBackground();
      });
      const resetBtn = document.getElementById("reset-background");
      resetBtn?.addEventListener("click", () => {
        this.resetBackground();
      });
      const savePresetBtn = document.getElementById("save-preset");
      savePresetBtn?.addEventListener("click", () => {
        this.saveAsPreset();
      });
      const closeBtn = document.getElementById("close-background-manager");
      closeBtn?.addEventListener("click", () => {
        this.closeManager();
      });
    }
    /**
     * Setup tab switching events
     */
    setupTabEvents() {
      const tabs = document.querySelectorAll(".style-tab");
      tabs.forEach((tab) => {
        tab.addEventListener("click", (e) => {
          const target = e.target;
          const tabType = target.getAttribute("data-tab");
          tabs.forEach((t) => t.classList.remove("active"));
          target.classList.add("active");
          this.renderStyleLibrary(tabType);
        });
      });
      this.renderStyleLibrary("preset");
    }
    /**
     * Render style library based on tab
     */
    renderStyleLibrary(tabType) {
      let styles = [];
      switch (tabType) {
        case "preset":
          styles = this.presetStyles.filter((s) => s.type !== "pattern");
          break;
        case "gradient":
          styles = this.presetStyles.filter((s) => s.type === "gradient");
          break;
        case "pattern":
          styles = this.presetStyles.filter((s) => s.type === "pattern");
          break;
        case "custom":
          styles = this.customStyles;
          break;
      }
      const html = styles.map((style) => `
            <div class="style-item" data-style-id="${style.id}">
                <div class="style-preview" style="background: ${style.value}; background-size: cover;"></div>
                <div class="style-name">${style.name}</div>
                ${style.category === "custom" ? '<button class="delete-style" data-style-id="' + style.id + '">\xD7</button>' : ""}
            </div>
        `).join("");
      this.styleLibrary.innerHTML = html;
      const styleItems = this.styleLibrary.querySelectorAll(".style-item");
      styleItems.forEach((item) => {
        item.addEventListener("click", (e) => {
          if (e.target.classList.contains("delete-style")) {
            return;
          }
          const styleId = item.getAttribute("data-style-id");
          const style = styles.find((s) => s.id === styleId);
          if (style) {
            this.currentSettings.style = style;
            this.updatePreview();
            styleItems.forEach((si) => si.classList.remove("active"));
            item.classList.add("active");
          }
        });
      });
      const deleteButtons = this.styleLibrary.querySelectorAll(".delete-style");
      deleteButtons.forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          const styleId = btn.getAttribute("data-style-id");
          this.deleteCustomStyle(styleId);
        });
      });
    }
    /**
     * Delete custom style
     */
    deleteCustomStyle(styleId) {
      this.customStyles = this.customStyles.filter((s) => s.id !== styleId);
      this.saveCustomStyles();
      this.renderStyleLibrary("custom");
      if (this.currentSettings.style.id === styleId) {
        this.setDefaultSettings();
        this.applySettingsToInterface();
      }
    }
    /**
     * Update preview area
     */
    updatePreview() {
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
    applyBackground() {
      const { style, opacity, blur, position, size } = this.currentSettings;
      document.body.style.background = style.value;
      document.body.style.backgroundPosition = position;
      document.body.style.backgroundSize = size;
      document.body.style.backgroundRepeat = "no-repeat";
      document.body.style.backgroundAttachment = "fixed";
      let overlay = document.getElementById("background-overlay");
      if (opacity < 100 || blur > 0) {
        if (!overlay) {
          overlay = document.createElement("div");
          overlay.id = "background-overlay";
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
        overlay.style.backgroundRepeat = "no-repeat";
        overlay.style.backgroundAttachment = "fixed";
        overlay.style.opacity = (opacity / 100).toString();
        overlay.style.filter = `blur(${blur}px)`;
        document.body.style.background = "transparent";
      } else if (overlay) {
        overlay.remove();
      }
      localStorage.setItem("background-current-settings", JSON.stringify(this.currentSettings));
      console.log("\u2705 \u80CC\u666F\u5DF2\u5E94\u7528");
      this.showMessage("\u80CC\u666F\u5DF2\u6210\u529F\u5E94\u7528\uFF01", "success");
    }
    /**
     * Reset background to default
     */
    resetBackground() {
      document.body.style.background = "";
      document.body.style.backgroundPosition = "";
      document.body.style.backgroundSize = "";
      document.body.style.backgroundRepeat = "";
      document.body.style.backgroundAttachment = "";
      const overlay = document.getElementById("background-overlay");
      if (overlay) {
        overlay.remove();
      }
      this.setDefaultSettings();
      this.applySettingsToInterface();
      localStorage.removeItem("background-current-settings");
      console.log("\u2705 \u80CC\u666F\u5DF2\u91CD\u7F6E");
      this.showMessage("\u80CC\u666F\u5DF2\u91CD\u7F6E\u4E3A\u9ED8\u8BA4\u8BBE\u7F6E", "info");
    }
    /**
     * Save current settings as preset
     */
    saveAsPreset() {
      const name = prompt("\u8BF7\u8F93\u5165\u9884\u8BBE\u540D\u79F0:");
      if (!name) return;
      const preset = {
        id: `preset-custom-${Date.now()}`,
        name,
        type: this.currentSettings.style.type,
        value: this.currentSettings.style.value,
        category: "custom"
      };
      this.customStyles.push(preset);
      this.saveCustomStyles();
      this.renderStyleLibrary("custom");
      console.log("\u2705 \u9884\u8BBE\u5DF2\u4FDD\u5B58");
      this.showMessage(`\u9884\u8BBE "${name}" \u5DF2\u4FDD\u5B58`, "success");
    }
    /**
     * Close background manager
     */
    closeManager() {
      if (this.container) {
        this.container.style.display = "none";
      }
    }
    /**
     * Open background manager
     */
    openManager() {
      if (this.container) {
        this.container.style.display = "block";
      }
    }
    /**
     * Show message to user
     */
    showMessage(message, type = "info") {
      const messageEl = document.createElement("div");
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
      if (type === "error") {
        messageEl.style.background = "#ef4444";
      } else if (type === "success") {
        messageEl.style.background = "#10b981";
      }
      document.body.appendChild(messageEl);
      setTimeout(() => {
        messageEl.style.opacity = "1";
        messageEl.style.transform = "translateX(0)";
      }, 10);
      setTimeout(() => {
        messageEl.style.opacity = "0";
        messageEl.style.transform = "translateX(100px)";
        setTimeout(() => {
          if (messageEl.parentElement) {
            messageEl.parentElement.removeChild(messageEl);
          }
        }, 300);
      }, 3e3);
    }
    /**
     * Get current settings
     */
    getCurrentSettings() {
      return { ...this.currentSettings };
    }
    /**
     * Set settings programmatically
     */
    setSettings(settings) {
      this.currentSettings = { ...this.currentSettings, ...settings };
      this.applySettingsToInterface();
      this.updatePreview();
    }
  };
  var backgroundManager = new BackgroundManager();
  window.BackgroundManager = BackgroundManager;
  window.backgroundManager = backgroundManager;
  window.openBackgroundManager = () => backgroundManager.openManager();

  // ns-hugo-imp:C:\Users\16643\Desktop\blog\hugo\blog\assets\ts\github-image-uploader.ts
  var GitHubImageUploader = class {
    config;
    token = null;
    progressCallback;
    constructor() {
      this.loadConfig();
      this.loadToken();
    }
    /**
     * Load GitHub configuration
     */
    loadConfig() {
      if (typeof window !== "undefined" && window.GitHubConfig) {
        this.config = window.GitHubConfig;
      } else {
        throw new Error("GitHub configuration not found. Please ensure github-config.js is loaded.");
      }
    }
    /**
     * Load GitHub access token
     */
    loadToken() {
      this.token = localStorage.getItem("github_access_token");
      if (!this.token && !this.config.development.useMockUpload) {
        console.warn("GitHub access token not found. Some features may not work.");
      }
    }
    /**
     * Set GitHub access token
     */
    setToken(token) {
      this.token = token;
      localStorage.setItem("github_access_token", token);
      this.config.utils.debugLog("GitHub token updated");
    }
    /**
     * Set progress callback
     */
    setProgressCallback(callback) {
      this.progressCallback = callback;
    }
    /**
     * Upload single image
     */
    async uploadImage(file, metadata = {}, category = "general") {
      try {
        this.updateProgress("validating", 0, "\u9A8C\u8BC1\u6587\u4EF6...");
        const validation = this.validateFile(file);
        if (!validation.valid) {
          throw new Error(validation.error);
        }
        this.updateProgress("validating", 20, "\u6587\u4EF6\u9A8C\u8BC1\u901A\u8FC7");
        const fileName = this.config.utils.generateUniqueFileName(file.name, category);
        this.updateProgress("compressing", 30, "\u538B\u7F29\u56FE\u7247...");
        const compressedFile = await this.compressImage(file);
        this.updateProgress("compressing", 60, "\u56FE\u7247\u538B\u7F29\u5B8C\u6210");
        this.updateProgress("uploading", 70, "\u4E0A\u4F20\u5230GitHub...");
        const base64Content = await this.fileToBase64(compressedFile);
        const result = await this.uploadToGitHub(fileName, base64Content, metadata);
        this.updateProgress("completed", 100, "\u4E0A\u4F20\u5B8C\u6210");
        return {
          success: true,
          url: result.content?.download_url,
          cdnUrl: this.config.utils.getImageUrl(fileName),
          fileName,
          sha: result.content?.sha,
          originalSize: file.size,
          compressedSize: compressedFile.size
        };
      } catch (error) {
        this.updateProgress("error", 0, `\u4E0A\u4F20\u5931\u8D25: ${error.message}`);
        return {
          success: false,
          error: error.message
        };
      }
    }
    /**
     * Upload multiple images
     */
    async uploadImages(files, metadata = [], category = "general") {
      const results = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const meta = metadata[i] || {};
        this.updateProgress("uploading", i / files.length * 100, `\u4E0A\u4F20\u7B2C ${i + 1} \u4E2A\u6587\u4EF6: ${file.name}`);
        const result = await this.uploadImage(file, meta, category);
        results.push(result);
        if (i < files.length - 1) {
          await this.delay(500);
        }
      }
      return results;
    }
    /**
     * Validate file
     */
    validateFile(file) {
      if (!this.config.utils.isValidImageFormat(file)) {
        return {
          valid: false,
          error: this.config.utils.getErrorMessage("unsupported_format")
        };
      }
      if (!this.config.utils.isValidFileSize(file)) {
        return {
          valid: false,
          error: this.config.utils.getErrorMessage("file_too_large")
        };
      }
      return { valid: true };
    }
    /**
     * Compress image
     */
    async compressImage(file) {
      return new Promise((resolve, reject) => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();
        img.onload = () => {
          const { maxWidth, maxHeight, quality } = this.config.imageUpload.compression;
          let { width, height } = img;
          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width *= ratio;
            height *= ratio;
          }
          canvas.width = width;
          canvas.height = height;
          ctx?.drawImage(img, 0, 0, width, height);
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedFile = new File([blob], file.name, {
                  type: "image/webp",
                  lastModified: Date.now()
                });
                resolve(compressedFile);
              } else {
                reject(new Error("Image compression failed"));
              }
            },
            "image/webp",
            quality
          );
        };
        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = URL.createObjectURL(file);
      });
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
     * Upload to GitHub repository
     */
    async uploadToGitHub(fileName, base64Content, metadata) {
      if (this.config.development.useMockUpload) {
        await this.delay(1e3);
        return {
          content: {
            sha: "mock_sha_" + Date.now(),
            download_url: this.config.utils.getImageUrl(fileName, false),
            html_url: `https://github.com/${this.config.imageRepo.owner}/${this.config.imageRepo.repo}/blob/${this.config.imageRepo.branch}/${fileName}`
          }
        };
      }
      if (!this.token) {
        throw new Error(this.config.utils.getErrorMessage("auth_failed"));
      }
      const { owner, repo, branch } = this.config.imageRepo;
      const url = `${this.config.apiUrl}/repos/${owner}/${repo}/contents/${fileName}`;
      const commitMessage = this.createCommitMessage(fileName, metadata);
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Authorization": `token ${this.token}`,
          "Content-Type": "application/json",
          "Accept": "application/vnd.github.v3+json"
        },
        body: JSON.stringify({
          message: commitMessage,
          content: base64Content,
          branch
        })
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || this.config.utils.getErrorMessage("upload_failed"));
      }
      return await response.json();
    }
    /**
     * Create commit message with metadata
     */
    createCommitMessage(fileName, metadata) {
      let message = `Add image: ${fileName}`;
      if (metadata.title) {
        message += `

Title: ${metadata.title}`;
      }
      if (metadata.description) {
        message += `
Description: ${metadata.description}`;
      }
      if (metadata.tags && metadata.tags.length > 0) {
        message += `
Tags: ${metadata.tags.join(", ")}`;
      }
      if (metadata.category) {
        message += `
Category: ${metadata.category}`;
      }
      return message;
    }
    /**
     * Update progress
     */
    updateProgress(stage, progress, message) {
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
    delay(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }
    /**
     * Get upload statistics
     */
    async getUploadStats() {
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
    async deleteImage(fileName) {
      if (!this.token) {
        throw new Error(this.config.utils.getErrorMessage("auth_failed"));
      }
      try {
        const { owner, repo, branch } = this.config.imageRepo;
        const getUrl = `${this.config.apiUrl}/repos/${owner}/${repo}/contents/${fileName}`;
        const getResponse = await fetch(getUrl, {
          headers: {
            "Authorization": `token ${this.token}`,
            "Accept": "application/vnd.github.v3+json"
          }
        });
        if (!getResponse.ok) {
          throw new Error("File not found");
        }
        const fileData = await getResponse.json();
        const deleteUrl = `${this.config.apiUrl}/repos/${owner}/${repo}/contents/${fileName}`;
        const deleteResponse = await fetch(deleteUrl, {
          method: "DELETE",
          headers: {
            "Authorization": `token ${this.token}`,
            "Content-Type": "application/json",
            "Accept": "application/vnd.github.v3+json"
          },
          body: JSON.stringify({
            message: `Delete image: ${fileName}`,
            sha: fileData.sha,
            branch
          })
        });
        return deleteResponse.ok;
      } catch (error) {
        this.config.utils.debugLog("Delete failed:", error);
        return false;
      }
    }
    /**
     * List images in repository
     */
    async listImages(category) {
      if (!this.token) {
        throw new Error(this.config.utils.getErrorMessage("auth_failed"));
      }
      try {
        const { owner, repo } = this.config.imageRepo;
        const path = category ? this.config.imageUpload.paths[category] || category : "";
        const url = `${this.config.apiUrl}/repos/${owner}/${repo}/contents/${path}`;
        const response = await fetch(url, {
          headers: {
            "Authorization": `token ${this.token}`,
            "Accept": "application/vnd.github.v3+json"
          }
        });
        if (!response.ok) {
          throw new Error("Failed to list images");
        }
        const files = await response.json();
        return files.filter((file) => {
          const extension = file.name.split(".").pop()?.toLowerCase();
          return this.config.imageUpload.supportedFormats.includes(extension);
        });
      } catch (error) {
        this.config.utils.debugLog("List images failed:", error);
        return [];
      }
    }
  };
  var ImageManagerUI = class {
    uploader;
    container = null;
    constructor(uploader) {
      this.uploader = uploader;
    }
    /**
     * Open image manager interface
     */
    openManager() {
      if (!this.container) {
        this.createInterface();
      }
      if (this.container) {
        this.container.style.display = "block";
      }
    }
    /**
     * Close image manager interface
     */
    closeManager() {
      if (this.container) {
        this.container.style.display = "none";
      }
    }
    /**
     * Create image manager interface
     */
    createInterface() {
      const imageManagerHTML = `
            <div class="image-manager" id="image-manager" style="display: none;">
                <div class="image-manager-header">
                    <h3>\u{1F4F7} \u56FE\u7247\u7BA1\u7406</h3>
                    <button class="close-btn" onclick="window.imageManagerUI.closeManager()">\xD7</button>
                </div>

                <div class="image-manager-content">
                    <!-- Upload Section -->
                    <div class="upload-section">
                        <h4>\u{1F4E4} \u4E0A\u4F20\u56FE\u7247</h4>
                        <div class="upload-area" id="image-upload-area">
                            <div class="upload-placeholder">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                    <path d="M21 15l-5-5L5 21"></path>
                                </svg>
                                <p>\u62D6\u62FD\u56FE\u7247\u5230\u6B64\u5904\u6216\u70B9\u51FB\u4E0A\u4F20</p>
                                <small>\u652F\u6301 JPG, PNG, WebP \u683C\u5F0F\uFF0C\u6700\u5927 10MB</small>
                            </div>
                            <input type="file" id="image-file-input" accept="image/*" multiple hidden>
                        </div>

                        <div class="upload-progress" id="upload-progress" style="display: none;">
                            <div class="progress-bar">
                                <div class="progress-fill" id="progress-fill"></div>
                            </div>
                            <div class="progress-text" id="progress-text">\u51C6\u5907\u4E0A\u4F20...</div>
                        </div>
                    </div>

                    <!-- Image Gallery -->
                    <div class="gallery-section">
                        <h4>\u{1F5BC}\uFE0F \u56FE\u7247\u5E93</h4>
                        <div class="gallery-controls">
                            <select id="category-filter">
                                <option value="">\u6240\u6709\u5206\u7C7B</option>
                                <option value="general">\u901A\u7528</option>
                                <option value="posts">\u6587\u7AE0</option>
                                <option value="avatars">\u5934\u50CF</option>
                                <option value="backgrounds">\u80CC\u666F</option>
                            </select>
                            <button class="btn btn-secondary" id="refresh-gallery">\u5237\u65B0</button>
                        </div>
                        <div class="image-gallery" id="image-gallery">
                            <div class="gallery-placeholder">
                                <p>\u6682\u65E0\u56FE\u7247\uFF0C\u8BF7\u5148\u4E0A\u4F20</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
      document.body.insertAdjacentHTML("beforeend", imageManagerHTML);
      this.container = document.getElementById("image-manager");
      this.setupEventListeners();
    }
    /**
     * Setup event listeners
     */
    setupEventListeners() {
      const uploadArea = document.getElementById("image-upload-area");
      const fileInput = document.getElementById("image-file-input");
      uploadArea?.addEventListener("click", () => {
        fileInput.click();
      });
      fileInput?.addEventListener("change", (e) => {
        const files = e.target.files;
        if (files && files.length > 0) {
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
        const files = e.dataTransfer?.files;
        if (files && files.length > 0) {
          this.handleFileUpload(Array.from(files));
        }
      });
      document.getElementById("refresh-gallery")?.addEventListener("click", () => {
        this.loadGallery();
      });
      document.getElementById("category-filter")?.addEventListener("change", () => {
        this.loadGallery();
      });
    }
    /**
     * Handle file upload
     */
    async handleFileUpload(files) {
      const progressContainer = document.getElementById("upload-progress");
      const progressFill = document.getElementById("progress-fill");
      const progressText = document.getElementById("progress-text");
      if (progressContainer) progressContainer.style.display = "block";
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
        const successCount = results.filter((r) => r.success).length;
        const failCount = results.length - successCount;
        if (progressText) {
          progressText.textContent = `\u4E0A\u4F20\u5B8C\u6210\uFF1A${successCount} \u6210\u529F\uFF0C${failCount} \u5931\u8D25`;
        }
        setTimeout(() => {
          this.loadGallery();
          if (progressContainer) progressContainer.style.display = "none";
        }, 2e3);
      } catch (error) {
        if (progressText) {
          progressText.textContent = `\u4E0A\u4F20\u5931\u8D25\uFF1A${error.message}`;
        }
      }
    }
    /**
     * Load image gallery
     */
    async loadGallery() {
      const gallery = document.getElementById("image-gallery");
      const categoryFilter = document.getElementById("category-filter");
      if (!gallery) return;
      gallery.innerHTML = '<div class="loading">\u52A0\u8F7D\u4E2D...</div>';
      try {
        const category = categoryFilter?.value || void 0;
        const images = await this.uploader.listImages(category);
        if (images.length === 0) {
          gallery.innerHTML = '<div class="gallery-placeholder"><p>\u6682\u65E0\u56FE\u7247</p></div>';
          return;
        }
        const imageHTML = images.map((image) => `
                <div class="gallery-item">
                    <img src="${image.download_url}" alt="${image.name}" loading="lazy">
                    <div class="gallery-item-info">
                        <div class="image-name">${image.name}</div>
                        <div class="image-actions">
                            <button class="btn btn-sm" onclick="navigator.clipboard.writeText('${image.download_url}')">\u590D\u5236\u94FE\u63A5</button>
                            <button class="btn btn-sm btn-danger" onclick="window.imageManagerUI.deleteImage('${image.name}')">\u5220\u9664</button>
                        </div>
                    </div>
                </div>
            `).join("");
        gallery.innerHTML = imageHTML;
      } catch (error) {
        gallery.innerHTML = `<div class="error">\u52A0\u8F7D\u5931\u8D25\uFF1A${error.message}</div>`;
      }
    }
    /**
     * Delete image
     */
    async deleteImage(fileName) {
      if (!confirm(`\u786E\u5B9A\u8981\u5220\u9664\u56FE\u7247 "${fileName}" \u5417\uFF1F`)) {
        return;
      }
      try {
        const success = await this.uploader.deleteImage(fileName);
        if (success) {
          alert("\u5220\u9664\u6210\u529F");
          this.loadGallery();
        } else {
          alert("\u5220\u9664\u5931\u8D25");
        }
      } catch (error) {
        alert(`\u5220\u9664\u5931\u8D25\uFF1A${error.message}`);
      }
    }
  };
  var githubImageUploader;
  var imageManagerUI;
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      githubImageUploader = new GitHubImageUploader();
      imageManagerUI = new ImageManagerUI(githubImageUploader);
      window.githubImageUploader = githubImageUploader;
      window.imageManagerUI = imageManagerUI;
      window.openImageManager = () => imageManagerUI.openManager();
      console.log("\u{1F4E4} GitHub Image Uploader initialized");
    });
  } else {
    githubImageUploader = new GitHubImageUploader();
    imageManagerUI = new ImageManagerUI(githubImageUploader);
    window.githubImageUploader = githubImageUploader;
    window.imageManagerUI = imageManagerUI;
    window.openImageManager = () => imageManagerUI.openManager();
    console.log("\u{1F4E4} GitHub Image Uploader initialized");
  }
  window.GitHubImageUploader = GitHubImageUploader;

  // ns-hugo-imp:C:\Users\16643\Desktop\blog\hugo\blog\assets\ts\article-manager.ts
  var ArticleManager = class {
    articles = /* @__PURE__ */ new Map();
    isDirty = false;
    autoSaveInterval = null;
    constructor() {
      this.init();
    }
    /**
     * Initialize article manager
     */
    init() {
      console.log("\u{1F4DD} Article Manager initialized");
      this.loadArticles();
      this.setupAutoSave();
      this.createArticleManagerInterface();
      this.setupEventListeners();
    }
    /**
     * Create article manager interface
     */
    createArticleManagerInterface() {
      const articleManagerHTML = `
            <div class="article-manager" id="article-manager" style="display: none;">
                <div class="article-manager-header">
                    <h3>\u{1F4DD} \u6587\u7AE0\u7BA1\u7406</h3>
                    <div class="header-actions">
                        <button class="btn btn-primary" id="new-article-btn">\u65B0\u5EFA\u6587\u7AE0</button>
                        <button class="close-btn" onclick="window.articleManager.closeManager()">\xD7</button>
                    </div>
                </div>

                <div class="article-manager-content">
                    <!-- Article List -->
                    <div class="article-list-section">
                        <div class="list-header">
                            <h4>\u{1F4DA} \u6587\u7AE0\u5217\u8868</h4>
                            <div class="list-controls">
                                <input type="text" id="article-search" placeholder="\u641C\u7D22\u6587\u7AE0...">
                                <select id="article-filter">
                                    <option value="">\u6240\u6709\u72B6\u6001</option>
                                    <option value="published">\u5DF2\u53D1\u5E03</option>
                                    <option value="draft">\u8349\u7A3F</option>
                                </select>
                                <select id="category-filter">
                                    <option value="">\u6240\u6709\u5206\u7C7B</option>
                                </select>
                            </div>
                        </div>

                        <div class="article-list" id="article-list">
                            <!-- Articles will be populated here -->
                        </div>

                        <div class="list-actions">
                            <button class="btn btn-secondary" id="bulk-delete-btn" disabled>\u6279\u91CF\u5220\u9664</button>
                            <button class="btn btn-secondary" id="bulk-publish-btn" disabled>\u6279\u91CF\u53D1\u5E03</button>
                            <button class="btn btn-secondary" id="export-articles-btn">\u5BFC\u51FA\u6587\u7AE0</button>
                        </div>
                    </div>

                    <!-- Article Editor -->
                    <div class="article-editor-section" id="article-editor" style="display: none;">
                        <div class="editor-header">
                            <h4 id="editor-title">\u7F16\u8F91\u6587\u7AE0</h4>
                            <div class="editor-actions">
                                <button class="btn btn-secondary" id="save-draft-btn">\u4FDD\u5B58\u8349\u7A3F</button>
                                <button class="btn btn-primary" id="publish-btn">\u53D1\u5E03</button>
                                <button class="btn btn-secondary" id="preview-btn">\u9884\u89C8</button>
                                <button class="btn btn-secondary" id="close-editor-btn">\u5173\u95ED</button>
                            </div>
                        </div>

                        <!-- Article Metadata -->
                        <div class="article-metadata">
                            <div class="metadata-row">
                                <div class="field-group">
                                    <label for="article-title">\u6807\u9898</label>
                                    <input type="text" id="article-title" placeholder="\u6587\u7AE0\u6807\u9898">
                                </div>
                                <div class="field-group">
                                    <label for="article-slug">URL\u522B\u540D</label>
                                    <input type="text" id="article-slug" placeholder="url-slug">
                                </div>
                            </div>

                            <div class="metadata-row">
                                <div class="field-group">
                                    <label for="article-categories">\u5206\u7C7B</label>
                                    <input type="text" id="article-categories" placeholder="\u5206\u7C7B\uFF0C\u7528\u9017\u53F7\u5206\u9694">
                                </div>
                                <div class="field-group">
                                    <label for="article-tags">\u6807\u7B7E</label>
                                    <input type="text" id="article-tags" placeholder="\u6807\u7B7E\uFF0C\u7528\u9017\u53F7\u5206\u9694">
                                </div>
                            </div>

                            <div class="metadata-row">
                                <div class="field-group">
                                    <label for="article-description">\u63CF\u8FF0</label>
                                    <textarea id="article-description" placeholder="\u6587\u7AE0\u63CF\u8FF0" rows="2"></textarea>
                                </div>
                                <div class="field-group">
                                    <label for="article-image">\u7279\u8272\u56FE\u7247</label>
                                    <div class="image-input-group">
                                        <input type="text" id="article-image" placeholder="\u56FE\u7247URL">
                                        <button class="btn btn-secondary" id="upload-image-btn">\u4E0A\u4F20</button>
                                    </div>
                                </div>
                            </div>

                            <div class="metadata-row">
                                <div class="field-group">
                                    <label>
                                        <input type="checkbox" id="article-featured"> \u7CBE\u9009\u6587\u7AE0
                                    </label>
                                </div>
                                <div class="field-group">
                                    <label>
                                        <input type="checkbox" id="article-draft"> \u8349\u7A3F\u72B6\u6001
                                    </label>
                                </div>
                            </div>
                        </div>

                        <!-- Markdown Editor -->
                        <div class="markdown-editor-container">
                            <div class="editor-toolbar">
                                <button class="toolbar-btn" data-action="bold" title="\u7C97\u4F53">B</button>
                                <button class="toolbar-btn" data-action="italic" title="\u659C\u4F53">I</button>
                                <button class="toolbar-btn" data-action="heading" title="\u6807\u9898">H</button>
                                <button class="toolbar-btn" data-action="link" title="\u94FE\u63A5">\u{1F517}</button>
                                <button class="toolbar-btn" data-action="image" title="\u56FE\u7247">\u{1F5BC}\uFE0F</button>
                                <button class="toolbar-btn" data-action="code" title="\u4EE3\u7801">\u{1F4BB}</button>
                                <button class="toolbar-btn" data-action="quote" title="\u5F15\u7528">\u{1F4AC}</button>
                                <button class="toolbar-btn" data-action="list" title="\u5217\u8868">\u{1F4DD}</button>
                                <div class="toolbar-divider"></div>
                                <button class="toolbar-btn" id="toggle-preview" title="\u5207\u6362\u9884\u89C8">\u{1F441}\uFE0F</button>
                                <button class="toolbar-btn" id="fullscreen-btn" title="\u5168\u5C4F">\u26F6</button>
                            </div>

                            <div class="editor-content">
                                <div class="editor-pane">
                                    <textarea id="markdown-editor" placeholder="\u5728\u6B64\u8F93\u5165Markdown\u5185\u5BB9..."></textarea>
                                </div>
                                <div class="preview-pane" id="preview-pane" style="display: none;">
                                    <div class="preview-content" id="preview-content"></div>
                                </div>
                            </div>
                        </div>

                        <!-- Editor Status -->
                        <div class="editor-status">
                            <div class="status-info">
                                <span id="word-count">\u5B57\u6570: 0</span>
                                <span id="char-count">\u5B57\u7B26: 0</span>
                                <span id="last-saved">\u672A\u4FDD\u5B58</span>
                            </div>
                            <div class="status-actions">
                                <button class="btn btn-secondary" id="sync-github-btn">\u540C\u6B65\u5230GitHub</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
      if (!document.getElementById("article-manager")) {
        document.body.insertAdjacentHTML("beforeend", articleManagerHTML);
      }
    }
    /**
     * Setup event listeners
     */
    setupEventListeners() {
      setTimeout(() => {
        const newArticleBtn = document.getElementById("new-article-btn");
        if (newArticleBtn) {
          newArticleBtn.addEventListener("click", () => {
            console.log("New article button clicked");
            this.createNewArticle();
          });
          console.log("\u2705 New article button event listener attached");
        } else {
          console.warn("\u274C New article button not found");
        }
        const articleSearch = document.getElementById("article-search");
        if (articleSearch) {
          articleSearch.addEventListener("input", (e) => {
            this.filterArticles();
          });
          console.log("\u2705 Article search event listener attached");
        }
        const articleFilter = document.getElementById("article-filter");
        if (articleFilter) {
          articleFilter.addEventListener("change", () => {
            this.filterArticles();
          });
          console.log("\u2705 Article filter event listener attached");
        }
        const categoryFilter = document.getElementById("category-filter");
        if (categoryFilter) {
          categoryFilter.addEventListener("change", () => {
            this.filterArticles();
          });
          console.log("\u2705 Category filter event listener attached");
        }
        const saveDraftBtn = document.getElementById("save-draft-btn");
        if (saveDraftBtn) {
          saveDraftBtn.addEventListener("click", () => {
            this.saveDraft();
          });
          console.log("\u2705 Save draft button event listener attached");
        }
        const publishBtn = document.getElementById("publish-btn");
        if (publishBtn) {
          publishBtn.addEventListener("click", () => {
            this.publishArticle();
          });
          console.log("\u2705 Publish button event listener attached");
        }
        const previewBtn = document.getElementById("preview-btn");
        if (previewBtn) {
          previewBtn.addEventListener("click", () => {
            this.togglePreview();
          });
          console.log("\u2705 Preview button event listener attached");
        }
        const closeEditorBtn = document.getElementById("close-editor-btn");
        if (closeEditorBtn) {
          closeEditorBtn.addEventListener("click", () => {
            this.closeEditor();
          });
          console.log("\u2705 Close editor button event listener attached");
        }
        const markdownEditor = document.getElementById("markdown-editor");
        markdownEditor?.addEventListener("input", () => {
          this.updateWordCount();
          this.updatePreview();
          this.markDirty();
        });
        document.getElementById("article-title")?.addEventListener("input", (e) => {
          const title = e.target.value;
          const slug = this.generateSlug(title);
          document.getElementById("article-slug").value = slug;
        });
        this.setupToolbarActions();
        document.getElementById("upload-image-btn")?.addEventListener("click", () => {
          this.openImageUploader();
        });
        const syncGitHubBtn = document.getElementById("sync-github-btn");
        if (syncGitHubBtn) {
          syncGitHubBtn.addEventListener("click", () => {
            this.syncToGitHub();
          });
          console.log("\u2705 Sync GitHub button event listener attached");
        }
      }, 100);
    }
    /**
     * Load articles from localStorage
     */
    loadArticles() {
      const saved = localStorage.getItem("blog-articles");
      if (saved) {
        try {
          const articlesData = JSON.parse(saved);
          this.articles = new Map(Object.entries(articlesData));
          console.log(`\u{1F4DA} Loaded ${this.articles.size} articles`);
        } catch (error) {
          console.warn("Failed to load articles:", error);
          this.articles = /* @__PURE__ */ new Map();
        }
      }
      if (this.articles.size === 0) {
        this.createSampleArticles();
      }
      this.renderArticleList();
    }
    /**
     * Create sample articles for demonstration
     */
    createSampleArticles() {
      const sampleArticles = [
        {
          metadata: {
            title: "\u535A\u5BA2\u754C\u9762\u7F8E\u5316\u6D4B\u8BD5\u6587\u7AE0",
            slug: "blog-ui-test",
            description: "\u8FD9\u662F\u4E00\u7BC7\u7528\u4E8E\u6D4B\u8BD5\u535A\u5BA2\u754C\u9762\u7F8E\u5316\u6548\u679C\u7684\u6587\u7AE0",
            date: /* @__PURE__ */ new Date("2024-01-15"),
            lastmod: /* @__PURE__ */ new Date("2024-01-15"),
            draft: false,
            categories: ["\u6280\u672F", "\u524D\u7AEF"],
            tags: ["\u535A\u5BA2", "UI", "\u7F8E\u5316"],
            featured: true
          },
          content: "# \u535A\u5BA2\u754C\u9762\u7F8E\u5316\u6D4B\u8BD5\u6587\u7AE0\n\n\u8FD9\u662F\u4E00\u7BC7\u7528\u4E8E\u6D4B\u8BD5\u535A\u5BA2\u754C\u9762\u7F8E\u5316\u6548\u679C\u7684\u6587\u7AE0\u3002\n\n## \u529F\u80FD\u7279\u6027\n\n- \u73B0\u4EE3\u5316\u8BBE\u8BA1\n- \u54CD\u5E94\u5F0F\u5E03\u5C40\n- \u7528\u6237\u53CB\u597D\u7684\u754C\u9762",
          frontmatter: "",
          fullContent: ""
        },
        {
          metadata: {
            title: "\u56FE\u7247\u7BA1\u7406\u7CFB\u7EDF\u4F7F\u7528\u6307\u5357",
            slug: "image-management-guide",
            description: "\u8BE6\u7EC6\u4ECB\u7ECD\u5982\u4F55\u4F7F\u7528\u535A\u5BA2\u7684\u56FE\u7247\u7BA1\u7406\u7CFB\u7EDF",
            date: /* @__PURE__ */ new Date("2024-01-10"),
            lastmod: /* @__PURE__ */ new Date("2024-01-10"),
            draft: false,
            categories: ["\u6559\u7A0B"],
            tags: ["\u56FE\u7247", "\u7BA1\u7406", "\u6307\u5357"],
            featured: false
          },
          content: "# \u56FE\u7247\u7BA1\u7406\u7CFB\u7EDF\u4F7F\u7528\u6307\u5357\n\n\u672C\u6587\u5C06\u8BE6\u7EC6\u4ECB\u7ECD\u5982\u4F55\u4F7F\u7528\u535A\u5BA2\u7684\u56FE\u7247\u7BA1\u7406\u7CFB\u7EDF\u3002\n\n## \u4E0A\u4F20\u56FE\u7247\n\n1. \u70B9\u51FB\u4E0A\u4F20\u6309\u94AE\n2. \u9009\u62E9\u56FE\u7247\u6587\u4EF6\n3. \u7B49\u5F85\u4E0A\u4F20\u5B8C\u6210",
          frontmatter: "",
          fullContent: ""
        },
        {
          metadata: {
            title: "\u65B0\u529F\u80FD\u5F00\u53D1\u8BA1\u5212",
            slug: "new-features-plan",
            description: "\u5373\u5C06\u63A8\u51FA\u7684\u65B0\u529F\u80FD\u9884\u89C8",
            date: /* @__PURE__ */ new Date("2024-01-20"),
            lastmod: /* @__PURE__ */ new Date("2024-01-20"),
            draft: true,
            categories: ["\u8BA1\u5212"],
            tags: ["\u5F00\u53D1", "\u65B0\u529F\u80FD", "\u8BA1\u5212"],
            featured: false
          },
          content: "# \u65B0\u529F\u80FD\u5F00\u53D1\u8BA1\u5212\n\n## \u5373\u5C06\u63A8\u51FA\u7684\u529F\u80FD\n\n- \u8BC4\u8BBA\u7CFB\u7EDF\n- \u641C\u7D22\u529F\u80FD\n- \u6807\u7B7E\u4E91\n- \u6587\u7AE0\u63A8\u8350",
          frontmatter: "",
          fullContent: ""
        }
      ];
      sampleArticles.forEach((article) => {
        article.frontmatter = this.generateFrontmatter(article.metadata);
        article.fullContent = article.frontmatter + "\n\n" + article.content;
        this.articles.set(article.metadata.slug, article);
      });
      this.saveArticles();
      console.log("\u{1F4DD} Created sample articles");
    }
    /**
     * Save articles to localStorage
     */
    saveArticles() {
      const articlesData = Object.fromEntries(this.articles);
      localStorage.setItem("blog-articles", JSON.stringify(articlesData));
      this.isDirty = false;
      this.updateLastSaved();
    }
    /**
     * Setup auto-save
     */
    setupAutoSave() {
      this.autoSaveInterval = window.setInterval(() => {
        if (this.isDirty) {
          this.saveArticles();
          console.log("\u{1F4DD} Auto-saved articles");
        }
      }, 3e4);
    }
    /**
     * Mark as dirty (needs saving)
     */
    markDirty() {
      this.isDirty = true;
    }
    /**
     * Update last saved timestamp
     */
    updateLastSaved() {
      const lastSavedEl = document.getElementById("last-saved");
      if (lastSavedEl) {
        lastSavedEl.textContent = `\u5DF2\u4FDD\u5B58 ${(/* @__PURE__ */ new Date()).toLocaleTimeString()}`;
      }
    }
    /**
     * Generate URL slug from title
     */
    generateSlug(title) {
      return title.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();
    }
    /**
     * Create new article
     */
    createNewArticle() {
      const newArticle = {
        metadata: {
          title: "\u65B0\u6587\u7AE0",
          slug: "new-article-" + Date.now(),
          date: /* @__PURE__ */ new Date(),
          draft: true,
          categories: [],
          tags: [],
          featured: false
        },
        content: "# \u65B0\u6587\u7AE0\n\n\u5728\u6B64\u5F00\u59CB\u7F16\u5199\u60A8\u7684\u6587\u7AE0\u5185\u5BB9...",
        frontmatter: "",
        fullContent: ""
      };
      this.articles.set(newArticle.metadata.slug, newArticle);
      this.markDirty();
      this.renderArticleList();
      this.editArticle(newArticle.metadata.slug);
    }
    /**
     * Edit article
     */
    editArticle(slug) {
      const article = this.articles.get(slug);
      if (!article) {
        this.showMessage("\u6587\u7AE0\u4E0D\u5B58\u5728", "error");
        return;
      }
      const editorSection = document.getElementById("article-editor");
      if (editorSection) {
        editorSection.style.display = "block";
      }
      this.populateEditor(article);
      const editorTitle = document.getElementById("editor-title");
      if (editorTitle) {
        editorTitle.textContent = `\u7F16\u8F91\u6587\u7AE0: ${article.metadata.title}`;
      }
    }
    /**
     * Populate editor with article data
     */
    populateEditor(article) {
      document.getElementById("article-title").value = article.metadata.title;
      document.getElementById("article-slug").value = article.metadata.slug;
      document.getElementById("article-description").value = article.metadata.description || "";
      document.getElementById("article-categories").value = article.metadata.categories.join(", ");
      document.getElementById("article-tags").value = article.metadata.tags.join(", ");
      document.getElementById("article-image").value = article.metadata.image || "";
      document.getElementById("article-featured").checked = article.metadata.featured || false;
      document.getElementById("article-draft").checked = article.metadata.draft;
      document.getElementById("markdown-editor").value = article.content;
      this.updateWordCount();
      this.updatePreview();
    }
    /**
     * Get current article data from editor
     */
    getCurrentArticleData() {
      const title = document.getElementById("article-title").value;
      const slug = document.getElementById("article-slug").value;
      const description = document.getElementById("article-description").value;
      const categories = document.getElementById("article-categories").value.split(",").map((c) => c.trim()).filter((c) => c);
      const tags = document.getElementById("article-tags").value.split(",").map((t) => t.trim()).filter((t) => t);
      const image = document.getElementById("article-image").value;
      const featured = document.getElementById("article-featured").checked;
      const draft = document.getElementById("article-draft").checked;
      const content = document.getElementById("markdown-editor").value;
      const metadata = {
        title,
        slug,
        description: description || void 0,
        date: /* @__PURE__ */ new Date(),
        lastmod: /* @__PURE__ */ new Date(),
        draft,
        categories,
        tags,
        image: image || void 0,
        featured
      };
      const frontmatter = this.generateFrontmatter(metadata);
      const fullContent = frontmatter + "\n\n" + content;
      return {
        metadata,
        content,
        frontmatter,
        fullContent
      };
    }
    /**
     * Generate Hugo frontmatter
     */
    generateFrontmatter(metadata) {
      const frontmatter = ["---"];
      frontmatter.push(`title: "${metadata.title}"`);
      frontmatter.push(`slug: "${metadata.slug}"`);
      if (metadata.description) {
        frontmatter.push(`description: "${metadata.description}"`);
      }
      frontmatter.push(`date: ${metadata.date.toISOString()}`);
      if (metadata.lastmod) {
        frontmatter.push(`lastmod: ${metadata.lastmod.toISOString()}`);
      }
      frontmatter.push(`draft: ${metadata.draft}`);
      if (metadata.categories.length > 0) {
        frontmatter.push(`categories:`);
        metadata.categories.forEach((cat) => {
          frontmatter.push(`  - "${cat}"`);
        });
      }
      if (metadata.tags.length > 0) {
        frontmatter.push(`tags:`);
        metadata.tags.forEach((tag) => {
          frontmatter.push(`  - "${tag}"`);
        });
      }
      if (metadata.image) {
        frontmatter.push(`image: "${metadata.image}"`);
      }
      if (metadata.featured) {
        frontmatter.push(`featured: true`);
      }
      frontmatter.push("---");
      return frontmatter.join("\n");
    }
    /**
     * Save draft
     */
    saveDraft() {
      const articleData = this.getCurrentArticleData();
      articleData.metadata.draft = true;
      articleData.metadata.lastmod = /* @__PURE__ */ new Date();
      this.articles.set(articleData.metadata.slug, articleData);
      this.markDirty();
      this.saveArticles();
      this.renderArticleList();
      this.showMessage("\u8349\u7A3F\u5DF2\u4FDD\u5B58", "success");
    }
    /**
     * Publish article
     */
    publishArticle() {
      const articleData = this.getCurrentArticleData();
      articleData.metadata.draft = false;
      articleData.metadata.lastmod = /* @__PURE__ */ new Date();
      this.articles.set(articleData.metadata.slug, articleData);
      this.markDirty();
      this.saveArticles();
      this.renderArticleList();
      this.showMessage("\u6587\u7AE0\u5DF2\u53D1\u5E03", "success");
    }
    /**
     * Delete article
     */
    deleteArticle(slug) {
      if (!confirm("\u786E\u5B9A\u8981\u5220\u9664\u8FD9\u7BC7\u6587\u7AE0\u5417\uFF1F\u6B64\u64CD\u4F5C\u4E0D\u53EF\u64A4\u9500\u3002")) {
        return;
      }
      this.articles.delete(slug);
      this.markDirty();
      this.saveArticles();
      this.renderArticleList();
      this.showMessage("\u6587\u7AE0\u5DF2\u5220\u9664", "success");
    }
    /**
     * Render article list
     */
    renderArticleList() {
      const listContainer = document.getElementById("article-list");
      if (!listContainer) return;
      const articles = Array.from(this.articles.values());
      if (articles.length === 0) {
        listContainer.innerHTML = '<div class="empty-state">\u6682\u65E0\u6587\u7AE0\uFF0C\u70B9\u51FB"\u65B0\u5EFA\u6587\u7AE0"\u5F00\u59CB\u521B\u4F5C</div>';
        return;
      }
      const html = articles.map((article) => `
            <div class="article-item" data-slug="${article.metadata.slug}">
                <div class="article-checkbox">
                    <input type="checkbox" class="article-select" value="${article.metadata.slug}">
                </div>
                <div class="article-info">
                    <h5 class="article-title">${article.metadata.title}</h5>
                    <div class="article-meta">
                        <span class="article-status ${article.metadata.draft ? "draft" : "published"}">
                            ${article.metadata.draft ? "\u8349\u7A3F" : "\u5DF2\u53D1\u5E03"}
                        </span>
                        <span class="article-date">${new Date(article.metadata.date).toLocaleDateString()}</span>
                        <span class="article-categories">${article.metadata.categories.join(", ")}</span>
                    </div>
                    <div class="article-description">${article.metadata.description || "\u6682\u65E0\u63CF\u8FF0"}</div>
                </div>
                <div class="article-actions">
                    <button class="action-btn edit-btn" onclick="window.articleManager.editArticle('${article.metadata.slug}')" title="\u7F16\u8F91">
                        \u270F\uFE0F
                    </button>
                    <button class="action-btn duplicate-btn" onclick="window.articleManager.duplicateArticle('${article.metadata.slug}')" title="\u590D\u5236">
                        \u{1F4CB}
                    </button>
                    <button class="action-btn delete-btn" onclick="window.articleManager.deleteArticle('${article.metadata.slug}')" title="\u5220\u9664">
                        \u{1F5D1}\uFE0F
                    </button>
                </div>
            </div>
        `).join("");
      listContainer.innerHTML = html;
      this.updateBulkActions();
    }
    /**
     * Filter articles
     */
    filterArticles() {
      const searchTerm = document.getElementById("article-search").value.toLowerCase();
      const statusFilter = document.getElementById("article-filter").value;
      const categoryFilter = document.getElementById("category-filter").value;
      const articleItems = document.querySelectorAll(".article-item");
      articleItems.forEach((item) => {
        const slug = item.getAttribute("data-slug");
        const article = this.articles.get(slug);
        if (!article) return;
        let visible = true;
        if (searchTerm) {
          const searchableText = `${article.metadata.title} ${article.metadata.description} ${article.content}`.toLowerCase();
          if (!searchableText.includes(searchTerm)) {
            visible = false;
          }
        }
        if (statusFilter) {
          if (statusFilter === "published" && article.metadata.draft) {
            visible = false;
          } else if (statusFilter === "draft" && !article.metadata.draft) {
            visible = false;
          }
        }
        if (categoryFilter && !article.metadata.categories.includes(categoryFilter)) {
          visible = false;
        }
        item.style.display = visible ? "block" : "none";
      });
    }
    /**
     * Update bulk actions
     */
    updateBulkActions() {
      const checkboxes = document.querySelectorAll(".article-select");
      const bulkDeleteBtn = document.getElementById("bulk-delete-btn");
      const bulkPublishBtn = document.getElementById("bulk-publish-btn");
      checkboxes.forEach((checkbox) => {
        checkbox.addEventListener("change", () => {
          const selectedCount = Array.from(checkboxes).filter((cb) => cb.checked).length;
          bulkDeleteBtn.disabled = selectedCount === 0;
          bulkPublishBtn.disabled = selectedCount === 0;
        });
      });
    }
    /**
     * Update word count
     */
    updateWordCount() {
      const content = document.getElementById("markdown-editor").value;
      const wordCount = content.trim().split(/\s+/).length;
      const charCount = content.length;
      const wordCountEl = document.getElementById("word-count");
      const charCountEl = document.getElementById("char-count");
      if (wordCountEl) wordCountEl.textContent = `\u5B57\u6570: ${wordCount}`;
      if (charCountEl) charCountEl.textContent = `\u5B57\u7B26: ${charCount}`;
    }
    /**
     * Update preview
     */
    updatePreview() {
      const content = document.getElementById("markdown-editor").value;
      const previewContent = document.getElementById("preview-content");
      if (previewContent) {
        const html = this.markdownToHtml(content);
        previewContent.innerHTML = html;
      }
    }
    /**
     * Basic markdown to HTML conversion
     */
    markdownToHtml(markdown) {
      return markdown.replace(/^### (.*$)/gim, "<h3>$1</h3>").replace(/^## (.*$)/gim, "<h2>$1</h2>").replace(/^# (.*$)/gim, "<h1>$1</h1>").replace(/\*\*(.*)\*\*/gim, "<strong>$1</strong>").replace(/\*(.*)\*/gim, "<em>$1</em>").replace(/!\[([^\]]*)\]\(([^\)]*)\)/gim, '<img alt="$1" src="$2" />').replace(/\[([^\]]*)\]\(([^\)]*)\)/gim, '<a href="$2">$1</a>').replace(/\n$/gim, "<br />");
    }
    /**
     * Toggle preview
     */
    togglePreview() {
      const editorPane = document.querySelector(".editor-pane");
      const previewPane = document.getElementById("preview-pane");
      const toggleBtn = document.getElementById("toggle-preview");
      if (previewPane.style.display === "none") {
        previewPane.style.display = "block";
        editorPane.style.width = "50%";
        previewPane.style.width = "50%";
        toggleBtn.textContent = "\u{1F4DD}";
        this.updatePreview();
      } else {
        previewPane.style.display = "none";
        editorPane.style.width = "100%";
        toggleBtn.textContent = "\u{1F441}\uFE0F";
      }
    }
    /**
     * Setup toolbar actions
     */
    setupToolbarActions() {
      const toolbar = document.querySelector(".editor-toolbar");
      if (!toolbar) return;
      toolbar.addEventListener("click", (e) => {
        const target = e.target;
        if (target.classList.contains("toolbar-btn")) {
          const action = target.getAttribute("data-action");
          if (action) {
            this.executeToolbarAction(action);
          }
        }
      });
    }
    /**
     * Execute toolbar action
     */
    executeToolbarAction(action) {
      const editor = document.getElementById("markdown-editor");
      const start = editor.selectionStart;
      const end = editor.selectionEnd;
      const selectedText = editor.value.substring(start, end);
      let replacement = "";
      let cursorOffset = 0;
      switch (action) {
        case "bold":
          replacement = `**${selectedText || "\u7C97\u4F53\u6587\u672C"}**`;
          cursorOffset = selectedText ? 0 : -2;
          break;
        case "italic":
          replacement = `*${selectedText || "\u659C\u4F53\u6587\u672C"}*`;
          cursorOffset = selectedText ? 0 : -1;
          break;
        case "heading":
          replacement = `## ${selectedText || "\u6807\u9898"}`;
          cursorOffset = selectedText ? 0 : -2;
          break;
        case "link":
          replacement = `[${selectedText || "\u94FE\u63A5\u6587\u672C"}](URL)`;
          cursorOffset = selectedText ? -4 : -6;
          break;
        case "image":
          replacement = `![${selectedText || "\u56FE\u7247\u63CF\u8FF0"}](\u56FE\u7247URL)`;
          cursorOffset = selectedText ? -6 : -8;
          break;
        case "code":
          replacement = `\`${selectedText || "\u4EE3\u7801"}\``;
          cursorOffset = selectedText ? 0 : -1;
          break;
        case "quote":
          replacement = `> ${selectedText || "\u5F15\u7528\u6587\u672C"}`;
          cursorOffset = selectedText ? 0 : -2;
          break;
        case "list":
          replacement = `- ${selectedText || "\u5217\u8868\u9879"}`;
          cursorOffset = selectedText ? 0 : -2;
          break;
      }
      if (replacement) {
        editor.value = editor.value.substring(0, start) + replacement + editor.value.substring(end);
        editor.focus();
        const newPosition = start + replacement.length + cursorOffset;
        editor.setSelectionRange(newPosition, newPosition);
        this.updatePreview();
        this.markDirty();
      }
    }
    /**
     * Open image uploader
     */
    openImageUploader() {
      if (window.openImageManager) {
        window.openImageManager();
      } else {
        this.showMessage("\u56FE\u7247\u4E0A\u4F20\u529F\u80FD\u6682\u4E0D\u53EF\u7528", "warning");
      }
    }
    /**
     * Sync to GitHub
     */
    async syncToGitHub() {
      const articleData = this.getCurrentArticleData();
      try {
        this.showMessage("\u6B63\u5728\u540C\u6B65\u5230GitHub...", "info");
        await new Promise((resolve) => setTimeout(resolve, 2e3));
        this.showMessage("\u5DF2\u540C\u6B65\u5230GitHub", "success");
      } catch (error) {
        this.showMessage("GitHub\u540C\u6B65\u5931\u8D25", "error");
        console.error("GitHub sync error:", error);
      }
    }
    /**
     * Duplicate article
     */
    duplicateArticle(slug) {
      const article = this.articles.get(slug);
      if (!article) return;
      const duplicatedArticle = {
        ...article,
        metadata: {
          ...article.metadata,
          title: article.metadata.title + " (\u526F\u672C)",
          slug: article.metadata.slug + "-copy-" + Date.now(),
          date: /* @__PURE__ */ new Date(),
          draft: true
        }
      };
      this.articles.set(duplicatedArticle.metadata.slug, duplicatedArticle);
      this.markDirty();
      this.saveArticles();
      this.renderArticleList();
      this.showMessage("\u6587\u7AE0\u5DF2\u590D\u5236", "success");
    }
    /**
     * Close editor
     */
    closeEditor() {
      if (this.isDirty) {
        if (confirm("\u6709\u672A\u4FDD\u5B58\u7684\u66F4\u6539\uFF0C\u786E\u5B9A\u8981\u5173\u95ED\u7F16\u8F91\u5668\u5417\uFF1F")) {
          const editorSection = document.getElementById("article-editor");
          if (editorSection) {
            editorSection.style.display = "none";
          }
        }
      } else {
        const editorSection = document.getElementById("article-editor");
        if (editorSection) {
          editorSection.style.display = "none";
        }
      }
    }
    /**
     * Show message to user
     */
    showMessage(message, type = "info") {
      const messageEl = document.createElement("div");
      messageEl.className = `article-message ${type}`;
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
      if (type === "error") {
        messageEl.style.background = "#ef4444";
      } else if (type === "success") {
        messageEl.style.background = "#10b981";
      } else if (type === "warning") {
        messageEl.style.background = "#f59e0b";
      }
      document.body.appendChild(messageEl);
      setTimeout(() => {
        messageEl.style.opacity = "1";
        messageEl.style.transform = "translateX(0)";
      }, 10);
      setTimeout(() => {
        messageEl.style.opacity = "0";
        messageEl.style.transform = "translateX(100px)";
        setTimeout(() => {
          if (messageEl.parentElement) {
            messageEl.parentElement.removeChild(messageEl);
          }
        }, 300);
      }, 3e3);
    }
    /**
     * Open article manager
     */
    openManager() {
      const manager = document.getElementById("article-manager");
      if (manager) {
        manager.style.display = "block";
        this.renderArticleList();
      }
    }
    /**
     * Close article manager
     */
    closeManager() {
      const manager = document.getElementById("article-manager");
      if (manager) {
        manager.style.display = "none";
      }
    }
    /**
     * Export articles
     */
    exportArticles() {
      const articles = Array.from(this.articles.values());
      const exportData = {
        exportDate: (/* @__PURE__ */ new Date()).toISOString(),
        articleCount: articles.length,
        articles
      };
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `blog-articles-${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      this.showMessage("\u6587\u7AE0\u5DF2\u5BFC\u51FA", "success");
    }
    /**
     * Get articles
     */
    getArticles() {
      return this.articles;
    }
    /**
     * Cleanup
     */
    destroy() {
      if (this.autoSaveInterval) {
        clearInterval(this.autoSaveInterval);
      }
    }
  };
  var articleManager = new ArticleManager();
  window.ArticleManager = ArticleManager;
  window.articleManager = articleManager;
  window.openArticleManager = () => articleManager.openManager();

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
      Stack.registerServiceWorker();
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
  Stack.registerServiceWorker = () => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("/sw.js").then((registration) => {
          console.log("\u2705 Service Worker \u6CE8\u518C\u6210\u529F:", registration.scope);
          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener("statechange", () => {
                if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                  Stack.showUpdateNotification();
                }
              });
            }
          });
        }).catch((error) => {
          console.log("\u274C Service Worker \u6CE8\u518C\u5931\u8D25:", error);
        });
      });
    }
  };
  Stack.showUpdateNotification = () => {
    const notification = document.createElement("div");
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--accent-color);
        color: white;
        padding: 1rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        max-width: 300px;
        font-size: 0.9rem;
    `;
    notification.innerHTML = `
        <div style="margin-bottom: 0.5rem;">\u{1F504} \u6709\u65B0\u7248\u672C\u53EF\u7528</div>
        <button onclick="location.reload()" style="
            background: white;
            color: var(--accent-color);
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 4px;
            cursor: pointer;
            font-weight: 600;
        ">\u7ACB\u5373\u66F4\u65B0</button>
        <button onclick="this.parentElement.remove()" style="
            background: transparent;
            color: white;
            border: 1px solid white;
            padding: 0.5rem 1rem;
            border-radius: 4px;
            cursor: pointer;
            margin-left: 0.5rem;
        ">\u7A0D\u540E</button>
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 1e4);
  };
})();
/*!
*   Hugo Theme Stack - Authentication Module
*
*   @author: Emma (Product Manager)
*   @project: Hugo Blog Admin System
*   @description: Admin authentication and permission management
*/
/*!
*   Hugo Theme Stack - Links Enhancement
*
*   @author: Alex (Engineer)
*   @project: Hugo Blog Links Enhancement
*   @description: Enhanced links functionality with filtering, search, and status checking
*/
/*!
*   Hugo Theme Stack - Background Manager
*
*   @author: Alex (Engineer)
*   @project: Hugo Blog Background Management System
*   @description: Complete background image management system for admin users
*/
/*!
*   Hugo Theme Stack - GitHub Image Uploader
*
*   @author: Alex (Engineer)
*   @project: Hugo Blog GitHub Image Upload System
*   @description: Complete GitHub API integration for image upload to my_blog_img repository
*/
/*!
*   Hugo Theme Stack - Article Manager
*
*   @author: Alex (Engineer)
*   @project: Hugo Blog Article Management System
*   @description: Complete article CRUD operations with GitHub integration
*/
/*!
*   Hugo Theme Stack - Extended with Admin Authentication
*
*   @author: Jimmy Cai (Original), Emma (Admin Extension)
*   @website: https://jimmycai.com
*   @link: https://github.com/CaiJimmy/hugo-theme-stack
*/
