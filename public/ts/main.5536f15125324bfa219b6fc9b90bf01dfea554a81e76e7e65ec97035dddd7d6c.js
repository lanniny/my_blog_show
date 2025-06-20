(()=>{var E=class e{galleryUID;items=[];constructor(t,a=1){if(window.PhotoSwipe==null||window.PhotoSwipeUI_Default==null){console.error("PhotoSwipe lib not loaded.");return}this.galleryUID=a,e.createGallery(t),this.loadItems(t),this.bindClick()}loadItems(t){this.items=[];let a=t.querySelectorAll("figure.gallery-image");for(let n of a){let i=n.querySelector("figcaption"),o=n.querySelector("img"),d={w:parseInt(o.getAttribute("width")),h:parseInt(o.getAttribute("height")),src:o.src,msrc:o.getAttribute("data-thumb")||o.src,el:n};i&&(d.title=i.innerHTML),this.items.push(d)}}static createGallery(t){let a=t.querySelectorAll("img.gallery-image");for(let o of Array.from(a)){let d=o.closest("p");if(!d||!t.contains(d)||(d.textContent.trim()==""&&d.classList.add("no-text"),!d.classList.contains("no-text")))continue;let u=o.parentElement.tagName=="A",m=o,s=document.createElement("figure");if(s.style.setProperty("flex-grow",o.getAttribute("data-flex-grow")||"1"),s.style.setProperty("flex-basis",o.getAttribute("data-flex-basis")||"0"),u&&(m=o.parentElement),m.parentElement.insertBefore(s,m),s.appendChild(m),o.hasAttribute("alt")){let r=document.createElement("figcaption");r.innerText=o.getAttribute("alt"),s.appendChild(r)}if(!u){s.className="gallery-image";let r=document.createElement("a");r.href=o.src,r.setAttribute("target","_blank"),o.parentNode.insertBefore(r,o),r.appendChild(o)}}let n=t.querySelectorAll("figure.gallery-image"),i=[];for(let o of n)i.length?o.previousElementSibling===i[i.length-1]?i.push(o):i.length&&(e.wrap(i),i=[o]):i=[o];i.length>0&&e.wrap(i)}static wrap(t){let a=document.createElement("div");a.className="gallery";let n=t[0].parentNode,i=t[0];n.insertBefore(a,i);for(let o of t)a.appendChild(o)}open(t){let a=document.querySelector(".pswp");new window.PhotoSwipe(a,window.PhotoSwipeUI_Default,this.items,{index:t,galleryUID:this.galleryUID,getThumbBoundsFn:i=>{let o=this.items[i].el.getElementsByTagName("img")[0],d=window.pageYOffset||document.documentElement.scrollTop,c=o.getBoundingClientRect();return{x:c.left,y:c.top+d,w:c.width}}}).init()}bindClick(){for(let[t,a]of this.items.entries())a.el.querySelector("a").addEventListener("click",i=>{i.preventDefault(),this.open(t)})}},A=E;var v={};if(localStorage.hasOwnProperty("StackColorsCache"))try{v=JSON.parse(localStorage.getItem("StackColorsCache"))}catch{v={}}async function L(e,t,a){if(!e)return await Vibrant.from(a).getPalette();if(!v.hasOwnProperty(e)||v[e].hash!==t){let n=await Vibrant.from(a).getPalette();v[e]={hash:t,Vibrant:{hex:n.Vibrant.hex,rgb:n.Vibrant.rgb,bodyTextColor:n.Vibrant.bodyTextColor},DarkMuted:{hex:n.DarkMuted.hex,rgb:n.DarkMuted.rgb,bodyTextColor:n.DarkMuted.bodyTextColor}},localStorage.setItem("StackColorsCache",JSON.stringify(v))}return v[e]}var $=(e,t=500)=>{e.classList.add("transiting"),e.style.transitionProperty="height, margin, padding",e.style.transitionDuration=t+"ms",e.style.height=e.offsetHeight+"px",e.offsetHeight,e.style.overflow="hidden",e.style.height="0",e.style.paddingTop="0",e.style.paddingBottom="0",e.style.marginTop="0",e.style.marginBottom="0",window.setTimeout(()=>{e.classList.remove("show"),e.style.removeProperty("height"),e.style.removeProperty("padding-top"),e.style.removeProperty("padding-bottom"),e.style.removeProperty("margin-top"),e.style.removeProperty("margin-bottom"),e.style.removeProperty("overflow"),e.style.removeProperty("transition-duration"),e.style.removeProperty("transition-property"),e.classList.remove("transiting")},t)},K=(e,t=500)=>{e.classList.add("transiting"),e.style.removeProperty("display"),e.classList.add("show");let a=e.offsetHeight;e.style.overflow="hidden",e.style.height="0",e.style.paddingTop="0",e.style.paddingBottom="0",e.style.marginTop="0",e.style.marginBottom="0",e.offsetHeight,e.style.transitionProperty="height, margin, padding",e.style.transitionDuration=t+"ms",e.style.height=a+"px",e.style.removeProperty("padding-top"),e.style.removeProperty("padding-bottom"),e.style.removeProperty("margin-top"),e.style.removeProperty("margin-bottom"),window.setTimeout(()=>{e.style.removeProperty("height"),e.style.removeProperty("overflow"),e.style.removeProperty("transition-duration"),e.style.removeProperty("transition-property"),e.classList.remove("transiting")},t)},O=(e,t=500)=>window.getComputedStyle(e).display==="none"?K(e,t):$(e,t);function I(){let e=document.getElementById("toggle-menu");e&&e.addEventListener("click",()=>{document.getElementById("main-menu").classList.contains("transiting")||(document.body.classList.toggle("show-menu"),O(document.getElementById("main-menu"),300),e.classList.toggle("is-active"))})}function z(e,t,a){var n=document.createElement(e);for(let i in t)if(i&&t.hasOwnProperty(i)){let o=t[i];i=="dangerouslySetInnerHTML"?n.innerHTML=o.__html:o===!0?n.setAttribute(i,i):o!==!1&&o!=null&&n.setAttribute(i,o.toString())}for(let i=2;i<arguments.length;i++){let o=arguments[i];o&&n.appendChild(o.nodeType==null?document.createTextNode(o.toString()):o)}return n}var x=z;var w=class{localStorageKey="StackColorScheme";currentScheme;systemPreferScheme;constructor(t){this.bindMatchMedia(),this.currentScheme=this.getSavedScheme(),window.matchMedia("(prefers-color-scheme: dark)").matches===!0?this.systemPreferScheme="dark":this.systemPreferScheme="light",this.dispatchEvent(document.documentElement.dataset.scheme),t&&this.bindClick(t),document.body.style.transition==""&&document.body.style.setProperty("transition","background-color .3s ease")}saveScheme(){localStorage.setItem(this.localStorageKey,this.currentScheme)}bindClick(t){t.addEventListener("click",a=>{this.isDark()?this.currentScheme="light":this.currentScheme="dark",this.setBodyClass(),this.currentScheme==this.systemPreferScheme&&(this.currentScheme="auto"),this.saveScheme()})}isDark(){return this.currentScheme=="dark"||this.currentScheme=="auto"&&this.systemPreferScheme=="dark"}dispatchEvent(t){let a=new CustomEvent("onColorSchemeChange",{detail:t});window.dispatchEvent(a)}setBodyClass(){this.isDark()?document.documentElement.dataset.scheme="dark":document.documentElement.dataset.scheme="light",this.dispatchEvent(document.documentElement.dataset.scheme)}getSavedScheme(){let t=localStorage.getItem(this.localStorageKey);return t=="light"||t=="dark"||t=="auto"?t:"auto"}bindMatchMedia(){window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",t=>{t.matches?this.systemPreferScheme="dark":this.systemPreferScheme="light",this.setBodyClass()})}},T=w;function b(e){let t;return()=>{t&&window.cancelAnimationFrame(t),t=window.requestAnimationFrame(()=>e())}}var F=".article-content h1[id], .article-content h2[id], .article-content h3[id], .article-content h4[id], .article-content h5[id], .article-content h6[id]",k="#TableOfContents",M="#TableOfContents li",C="active-class";function R(e,t){let a=e.querySelector("a").offsetHeight,n=e.offsetTop-t.offsetHeight/2+a/2-t.offsetTop;n<0&&(n=0),t.scrollTo({top:n,behavior:"smooth"})}function _(e){let t={};return e.forEach(a=>{let i=a.querySelector("a").getAttribute("href");i.startsWith("#")&&(t[i.slice(1)]=a)}),t}function B(e){let t=[];return e.forEach(a=>{t.push({id:a.id,offset:a.offsetTop})}),t.sort((a,n)=>a.offset-n.offset),t}function H(){let e=document.querySelectorAll(F);if(!e){console.warn("No header matched query",e);return}let t=document.querySelector(k);if(!t){console.warn("No toc matched query",k);return}let a=document.querySelectorAll(M);if(!a){console.warn("No navigation matched query",M);return}let n=B(e),i=!1;t.addEventListener("mouseenter",b(()=>i=!0)),t.addEventListener("mouseleave",b(()=>i=!1));let o,d=_(a);function c(){let m=document.documentElement.scrollTop||document.body.scrollTop,s;n.forEach(h=>{m>=h.offset-20&&(s=document.getElementById(h.id))});let r;s&&(r=d[s.id]),s&&!r?console.debug("No link found for section",s):r!==o&&(o&&o.classList.remove(C),r&&(r.classList.add(C),i||R(r,t)),o=r)}window.addEventListener("scroll",b(c));function u(){n=B(e),c()}window.addEventListener("resize",b(u))}var W="a[href]";function P(){document.querySelectorAll(W).forEach(e=>{e.getAttribute("href").startsWith("#")&&e.addEventListener("click",a=>{a.preventDefault();let n=decodeURI(e.getAttribute("href").substring(1)),i=document.getElementById(n),o=i.getBoundingClientRect().top-document.documentElement.getBoundingClientRect().top;window.history.pushState({},"",e.getAttribute("href")),scrollTo({top:o,behavior:"smooth"})})})}var S=class{localStorageKey="StackAdminAuth";attemptsKey="StackAuthAttempts";timestampKey="StackAuthTimestamp";currentStatus;config;constructor(t){this.config={adminPassword:"admit",sessionTimeout:24*60*60*1e3,maxLoginAttempts:5,...t},this.currentStatus=this.getSavedAuthStatus(),this.cleanupExpiredSession(),this.dispatchAuthEvent(this.currentStatus)}authenticate(t){return this.isBlocked()?(this.dispatchAuthEvent("blocked"),!1):t===this.config.adminPassword?(this.currentStatus="authenticated",this.saveAuthStatus(),this.clearLoginAttempts(),this.dispatchAuthEvent("authenticated"),!0):(this.incrementLoginAttempts(),this.dispatchAuthEvent("failed"),!1)}logout(){this.currentStatus="guest",this.clearAuthData(),this.dispatchAuthEvent("guest")}isAuthenticated(){return this.isSessionExpired()?(this.logout(),!1):this.currentStatus==="authenticated"}isAdmin(){return this.isAuthenticated()}getStatus(){return this.currentStatus}isBlocked(){return this.getLoginAttempts()>=this.config.maxLoginAttempts}getRemainingAttempts(){let t=this.getLoginAttempts();return Math.max(0,this.config.maxLoginAttempts-t)}resetLoginAttempts(){this.clearLoginAttempts()}saveAuthStatus(){localStorage.setItem(this.localStorageKey,this.currentStatus),localStorage.setItem(this.timestampKey,Date.now().toString())}getSavedAuthStatus(){return localStorage.getItem(this.localStorageKey)==="authenticated"?"authenticated":"guest"}isSessionExpired(){let t=localStorage.getItem(this.timestampKey);if(!t)return!0;let a=parseInt(t);return Date.now()-a>this.config.sessionTimeout}cleanupExpiredSession(){this.isSessionExpired()&&(this.clearAuthData(),this.currentStatus="guest")}clearAuthData(){localStorage.removeItem(this.localStorageKey),localStorage.removeItem(this.timestampKey)}getLoginAttempts(){let t=localStorage.getItem(this.attemptsKey);return t?parseInt(t):0}incrementLoginAttempts(){let t=this.getLoginAttempts()+1;localStorage.setItem(this.attemptsKey,t.toString())}clearLoginAttempts(){localStorage.removeItem(this.attemptsKey)}dispatchAuthEvent(t){let a=new CustomEvent("onAuthStatusChange",{detail:{status:t,isAuthenticated:this.isAuthenticated(),isAdmin:this.isAdmin(),remainingAttempts:this.getRemainingAttempts()}});window.dispatchEvent(a)}},p={toggleAdminElements:e=>{let t=document.querySelectorAll("[data-admin-only]"),a=document.querySelectorAll("[data-guest-only]");t.forEach(n=>{n.style.display=e?"block":"none"}),a.forEach(n=>{n.style.display=e?"none":"block"})},updateBodyClass:e=>{e?(document.body.classList.add("admin-mode"),document.body.classList.remove("guest-mode")):(document.body.classList.add("guest-mode"),document.body.classList.remove("admin-mode"))},createLoginModal:()=>`
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
        `,showLoginModal:()=>{let e=document.getElementById("admin-login-modal");if(e)e.style.display="flex",p.clearMessages(),setTimeout(()=>{let t=document.getElementById("admin-password");t&&(t.focus(),t.select())},150);else{console.warn("Admin login modal not found. Creating modal...");let t=p.createLoginModal();document.body.insertAdjacentHTML("beforeend",t),setTimeout(()=>p.showLoginModal(),100)}},hideLoginModal:()=>{let e=document.getElementById("admin-login-modal");if(e){e.style.display="none";let t=document.getElementById("admin-login-form");t&&t.reset();let a=document.getElementById("admin-login-error"),n=document.getElementById("admin-login-attempts");a&&(a.style.display="none"),n&&(n.style.display="none")}},showLoginError:e=>{let t=document.getElementById("admin-login-error");t&&(t.textContent=e,t.style.display="block")},showAttemptsInfo:e=>{let t=document.getElementById("admin-login-attempts");t&&(t.textContent=`\u5269\u4F59\u5C1D\u8BD5\u6B21\u6570: ${e}`,t.style.display="block")},setLoginButtonLoading:e=>{let t=document.getElementById("admin-login-btn");t&&(e?(t.disabled=!0,t.classList.add("loading")):(t.disabled=!1,t.classList.remove("loading")))},clearMessages:()=>{let e=document.getElementById("admin-login-error"),t=document.getElementById("admin-login-attempts");e&&(e.style.display="none"),t&&(t.style.display="none")},validatePassword:e=>e?e.length<1?{valid:!1,message:"\u5BC6\u7801\u4E0D\u80FD\u4E3A\u7A7A"}:{valid:!0}:{valid:!1,message:"\u8BF7\u8F93\u5165\u5BC6\u7801"},createAdminPanel:()=>`
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
        `},D=S;var g,l={init:()=>{try{g=new D,console.log("\u2705 globalAuth created successfully")}catch(c){console.error("\u274C Failed to create globalAuth:",c),console.log("\u{1F527} Attempting fallback auth creation..."),g={isAuthenticated:()=>localStorage.getItem("adminAuth")==="authenticated",authenticate:u=>u==="admit"?(localStorage.setItem("adminAuth","authenticated"),setTimeout(()=>{document.querySelectorAll("[data-admin-only]").forEach(r=>{r.style.display="block"}),document.querySelectorAll("[data-guest-only]").forEach(r=>{r.style.display="none"}),console.log("\u2705 Fallback auth UI updated")},100),!0):!1,logout:()=>{localStorage.removeItem("adminAuth"),document.querySelectorAll("[data-admin-only]").forEach(s=>{s.style.display="none"}),document.querySelectorAll("[data-guest-only]").forEach(s=>{s.style.display="block"})}},console.log("\u2705 Fallback auth created")}window.addEventListener("onAuthStatusChange",c=>{let{status:u,isAuthenticated:m,isAdmin:s,remainingAttempts:r}=c.detail;switch(p.toggleAdminElements(s),p.updateBodyClass(s),u){case"authenticated":p.hideLoginModal(),console.log("Admin authenticated successfully"),setTimeout(()=>{console.log("\u{1F527} Force showing admin elements after authentication"),document.querySelectorAll("[data-admin-only]").forEach(f=>{f.style.display="block"}),console.log("\u2705 Admin elements forced to show")},100);break;case"failed":p.showLoginError("\u5BC6\u7801\u9519\u8BEF"),r>0&&p.showAttemptsInfo(r);break;case"blocked":p.showLoginError("\u767B\u5F55\u5C1D\u8BD5\u6B21\u6570\u8FC7\u591A\uFF0C\u8BF7\u7A0D\u540E\u518D\u8BD5");break;case"guest":console.log("User logged out or session expired");break}}),console.log("Creating login modal...");let e=p.createLoginModal();if(document.body.insertAdjacentHTML("beforeend",e),console.log("Login modal created"),console.log("Checking for admin panel in HTML..."),document.getElementById("admin-panel-modal")?console.log("\u2705 Admin panel found in HTML template"):console.error("\u274C Admin panel not found in HTML template!"),l.bindAuthEvents(),l.bindAdminPanelEvents(),console.log("\u{1F50D} Checking globalAuth:",!!g),g){let c=g.isAuthenticated();console.log("\u{1F50D} Initial admin status:",c),p.toggleAdminElements(c),p.updateBodyClass(c)}else console.error("\u274C globalAuth not initialized!");l.loadAdminSettings(),console.log("\u2705 Stack initialization complete"),I();let a=document.querySelector(".article-content");a&&(new A(a),P(),H());let n=document.querySelector(".article-list--tile");n&&new IntersectionObserver(async(u,m)=>{u.forEach(s=>{if(!s.isIntersecting)return;m.unobserve(s.target),s.target.querySelectorAll("article.has-image").forEach(async h=>{let f=h.querySelector("img"),q=f.src,N=f.getAttribute("data-key"),V=f.getAttribute("data-hash"),U=h.querySelector(".article-details"),y=await L(N,V,q);U.style.background=`
                        linear-gradient(0deg, 
                            rgba(${y.DarkMuted.rgb[0]}, ${y.DarkMuted.rgb[1]}, ${y.DarkMuted.rgb[2]}, 0.5) 0%, 
                            rgba(${y.Vibrant.rgb[0]}, ${y.Vibrant.rgb[1]}, ${y.Vibrant.rgb[2]}, 0.75) 100%)`})})}).observe(n);let i=document.querySelectorAll(".article-content div.highlight"),o="Copy",d="Copied!";i.forEach(c=>{let u=document.createElement("button");u.innerHTML=o,u.classList.add("copyCodeButton"),c.appendChild(u);let m=c.querySelector("code[data-lang]");m&&u.addEventListener("click",()=>{navigator.clipboard.writeText(m.textContent).then(()=>{u.textContent=d,setTimeout(()=>{u.textContent=o},1e3)}).catch(s=>{alert(s),console.log("Something went wrong",s)})})}),new T(document.getElementById("dark-mode-toggle"))},bindAuthEvents:()=>{let e=document.getElementById("admin-login-form");e&&e.addEventListener("submit",o=>{o.preventDefault();let d=document.getElementById("admin-password");d&&g.authenticate(d.value)});let t=document.getElementById("admin-modal-close"),a=document.getElementById("admin-cancel-btn");t&&t.addEventListener("click",()=>{p.hideLoginModal()}),a&&a.addEventListener("click",()=>{p.hideLoginModal()});let n=document.getElementById("admin-login-modal");n&&n.addEventListener("click",o=>{o.target===n&&p.hideLoginModal()}),document.addEventListener("keydown",o=>{o.key==="Escape"&&p.hideLoginModal()});let i=document.getElementById("admin-panel-toggle");i&&i.addEventListener("click",o=>{o.preventDefault(),l.showAdminPanel()}),document.addEventListener("click",o=>{let d=o.target;if(d){let c=d.textContent||"",u=d.parentElement?.textContent||"",m=d.closest("a")?.textContent||"";if(c.trim()==="\u7BA1\u7406\u9762\u677F"||c.includes("\u7BA1\u7406\u9762\u677F")||u.includes("\u7BA1\u7406\u9762\u677F")||m.includes("\u7BA1\u7406\u9762\u677F")||d.id==="admin-panel-toggle"||d.closest("#admin-panel-toggle")||d.classList.contains("admin-panel-trigger"))if(o.preventDefault(),o.stopPropagation(),console.log("\u{1F3AF} Admin panel click detected:",d),console.log("\u{1F3AF} Clicked text:",c),g&&g.isAuthenticated()){console.log("\u2705 User is authenticated, showing admin panel");let r=document.getElementById("admin-panel-modal");r?(console.log("\u2705 Panel found, showing directly"),r.style.display="flex",l.loadAdminSettings&&l.loadAdminSettings()):console.error("\u274C Panel not found in DOM")}else console.log("\u274C User not authenticated, cannot show admin panel")}},!0)},bindAdminPanelEvents:()=>{console.log("Binding admin panel events...");let e=document.getElementById("admin-panel-close"),t=document.getElementById("admin-panel-cancel");e&&e.addEventListener("click",()=>{l.hideAdminPanel()}),t&&t.addEventListener("click",()=>{l.hideAdminPanel()});let a=document.getElementById("admin-panel-modal");a&&a.addEventListener("click",m=>{m.target===a&&l.hideAdminPanel()}),document.querySelectorAll(".admin-tab-btn").forEach(m=>{m.addEventListener("click",s=>{let h=s.target.getAttribute("data-tab");h&&l.switchAdminTab(h)})});let i=document.getElementById("admin-avatar-upload");i&&i.addEventListener("change",m=>{let s=m.target;s.files&&s.files[0]&&l.handleAvatarUpload(s.files[0])});let o=document.getElementById("admin-avatar-reset");o&&o.addEventListener("click",()=>{l.resetAvatar()});let d=document.getElementById("admin-save-settings");d&&d.addEventListener("click",()=>{l.saveAdminSettings()});let c=document.getElementById("admin-theme-color");c&&c.addEventListener("change",m=>{let s=m.target;l.updateThemeColor(s.value)});let u=document.getElementById("admin-change-password");u&&u.addEventListener("click",()=>{l.changeAdminPassword()}),console.log("Admin panel events bound successfully")},getAuth:()=>g,showLogin:()=>{p.showLoginModal()},logout:()=>{g&&g.logout()},showAdminPanel:()=>{console.log("\u{1F3AF} showAdminPanel called");let e=document.getElementById("admin-panel-modal");e?(console.log("\u2705 Panel found in HTML, showing it"),e.style.display="flex",l.loadAdminSettings()):console.error("\u274C Admin panel not found in HTML! This should not happen since it is in the template.")},hideAdminPanel:()=>{let e=document.getElementById("admin-panel-modal");e&&(e.style.display="none")},switchAdminTab:e=>{document.querySelectorAll(".admin-tab-btn").forEach(n=>{n.classList.remove("active")}),document.querySelectorAll(".admin-tab-panel").forEach(n=>{n.classList.remove("active")});let t=document.querySelector(`[data-tab="${e}"]`),a=document.getElementById(`admin-tab-${e}`);t&&t.classList.add("active"),a&&a.classList.add("active")},handleAvatarUpload:e=>{if(e.type.startsWith("image/")){let t=new FileReader;t.onload=a=>{let n=a.target?.result,i=document.getElementById("admin-avatar-img");i&&(i.src=n,localStorage.setItem("adminAvatar",n),l.updateSiteAvatar(n))},t.readAsDataURL(e)}},resetAvatar:()=>{let e="/img/avatar_hu_f509edb42ecc0ebd.png",t=document.getElementById("admin-avatar-img");t&&(t.src=e,localStorage.removeItem("adminAvatar"),l.updateSiteAvatar(e))},updateSiteAvatar:e=>{[".site-avatar img",".site-logo",".site-avatar .site-logo","[data-avatar]"].forEach(n=>{let i=document.querySelector(n);i&&(i.src=e,console.log(`\u2705 Updated avatar for selector: ${n}`))}),document.querySelectorAll('img[alt*="Avatar"], img[alt*="avatar"]').forEach(n=>{(!n.id||!n.id.includes("admin"))&&(n.src=e,console.log(`\u2705 Updated additional avatar: ${n.className||n.id||"unnamed"}`))})},loadAdminSettings:()=>{let e=localStorage.getItem("adminAvatar");if(e){let i=document.getElementById("admin-avatar-img");i&&(i.src=e),l.updateSiteAvatar(e)}let t=localStorage.getItem("adminSiteTitle");if(t){let i=document.getElementById("admin-site-title");i&&(i.value=t);let o=document.querySelector(".site-name a");o&&(o.textContent=t)}let a=localStorage.getItem("adminSiteDescription");if(a){let i=document.getElementById("admin-site-description");i&&(i.value=a);let o=document.querySelector(".site-description");o&&(o.textContent=a)}let n=localStorage.getItem("adminThemeColor");if(n){let i=document.getElementById("admin-theme-color");i&&(i.value=n),l.updateThemeColor(n)}},saveAdminSettings:()=>{let e=document.getElementById("admin-site-title");if(e){localStorage.setItem("adminSiteTitle",e.value);let n=document.querySelector(".site-name a");n&&(n.textContent=e.value)}let t=document.getElementById("admin-site-description");if(t){localStorage.setItem("adminSiteDescription",t.value);let n=document.querySelector(".site-description");n&&(n.textContent=t.value)}let a=document.getElementById("admin-theme-color");a&&localStorage.setItem("adminThemeColor",a.value),l.showSuccessMessage("\u8BBE\u7F6E\u5DF2\u4FDD\u5B58\uFF01"),l.hideAdminPanel()},updateThemeColor:e=>{document.documentElement.style.setProperty("--accent-color",e);let t=document.querySelector(".admin-color-preview");t&&(t.style.backgroundColor=e)},changeAdminPassword:()=>{let e=document.getElementById("admin-new-password");e&&e.value?(l.showSuccessMessage("\u5BC6\u7801\u66F4\u6539\u529F\u80FD\u9700\u8981\u540E\u7AEF\u652F\u6301\uFF0C\u5F53\u524D\u4E3A\u6F14\u793A\u6A21\u5F0F"),e.value=""):l.showErrorMessage("\u8BF7\u8F93\u5165\u65B0\u5BC6\u7801")},showSuccessMessage:e=>{l.showNotification(e,"success")},showErrorMessage:e=>{l.showNotification(e,"error")},showNotification:(e,t="success")=>{let a=document.createElement("div");a.className=`admin-notification admin-notification-${t}`,a.innerHTML=`
            <div class="admin-notification-content">
                <svg class="admin-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    ${t==="success"?'<path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path><polyline points="22,4 12,14.01 9,11.01"></polyline>':'<circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line>'}
                </svg>
                <span>${e}</span>
            </div>
        `,document.body.appendChild(a),setTimeout(()=>a.classList.add("show"),100),setTimeout(()=>{a.classList.remove("show"),setTimeout(()=>{a.parentNode&&a.parentNode.removeChild(a)},300)},3e3)},createAdminPanelHTML:()=>`
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
        `,showAdminPanel:()=>{let e=document.getElementById("admin-panel-modal");e&&(e.style.display="flex",l.loadAdminSettings())},hideAdminPanel:()=>{let e=document.getElementById("admin-panel-modal");e&&(e.style.display="none")},switchAdminTab:e=>{document.querySelectorAll(".admin-tab-btn").forEach(n=>{n.classList.remove("active")}),document.querySelectorAll(".admin-tab-panel").forEach(n=>{n.classList.remove("active")});let t=document.querySelector(`[data-tab="${e}"]`),a=document.getElementById(`admin-tab-${e}`);t&&t.classList.add("active"),a&&a.classList.add("active")},handleAvatarUpload:e=>{if(e.type.startsWith("image/")){let t=new FileReader;t.onload=a=>{let n=a.target?.result,i=document.getElementById("admin-avatar-img");i&&(i.src=n,localStorage.setItem("adminAvatar",n))},t.readAsDataURL(e)}},resetAvatar:()=>{let e=document.getElementById("admin-avatar-img");e&&(e.src="/img/avatar_hu_f509edb42ecc0ebd.png",localStorage.removeItem("adminAvatar"))},loadAdminSettings:()=>{let e=localStorage.getItem("adminAvatar");if(e){let i=document.getElementById("admin-avatar-img");i&&(i.src=e)}let t=localStorage.getItem("adminSiteTitle");if(t){let i=document.getElementById("admin-site-title");i&&(i.value=t)}let a=localStorage.getItem("adminSiteDescription");if(a){let i=document.getElementById("admin-site-description");i&&(i.value=a)}let n=localStorage.getItem("adminThemeColor");if(n){let i=document.getElementById("admin-theme-color");i&&(i.value=n),l.updateThemeColor(n)}},saveAdminSettings:()=>{let e=document.getElementById("admin-site-title");if(e){localStorage.setItem("adminSiteTitle",e.value);let n=document.querySelector(".site-name a");n&&(n.textContent=e.value)}let t=document.getElementById("admin-site-description");if(t){localStorage.setItem("adminSiteDescription",t.value);let n=document.querySelector(".site-description");n&&(n.textContent=t.value)}let a=document.getElementById("admin-theme-color");a&&localStorage.setItem("adminThemeColor",a.value),alert("\u8BBE\u7F6E\u5DF2\u4FDD\u5B58\uFF01"),l.hideAdminPanel()},updateThemeColor:e=>{document.documentElement.style.setProperty("--accent-color",e);let t=document.querySelector(".admin-color-preview");t&&(t.style.backgroundColor=e)},changeAdminPassword:()=>{let e=document.getElementById("admin-new-password");e&&e.value?(alert("\u5BC6\u7801\u66F4\u6539\u529F\u80FD\u9700\u8981\u540E\u7AEF\u652F\u6301\uFF0C\u5F53\u524D\u4E3A\u6F14\u793A\u6A21\u5F0F"),e.value=""):alert("\u8BF7\u8F93\u5165\u65B0\u5BC6\u7801")}};window.addEventListener("load",()=>{setTimeout(function(){l.init()},0)});window.Stack=l;window.createElement=x;window.StackAuth=g;})();
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
