(()=>{var w=class e{galleryUID;items=[];constructor(t,n=1){if(window.PhotoSwipe==null||window.PhotoSwipeUI_Default==null){console.error("PhotoSwipe lib not loaded.");return}this.galleryUID=n,e.createGallery(t),this.loadItems(t),this.bindClick()}loadItems(t){this.items=[];let n=t.querySelectorAll("figure.gallery-image");for(let a of n){let o=a.querySelector("figcaption"),i=a.querySelector("img"),d={w:parseInt(i.getAttribute("width")),h:parseInt(i.getAttribute("height")),src:i.src,msrc:i.getAttribute("data-thumb")||i.src,el:a};o&&(d.title=o.innerHTML),this.items.push(d)}}static createGallery(t){let n=t.querySelectorAll("img.gallery-image");for(let i of Array.from(n)){let d=i.closest("p");if(!d||!t.contains(d)||(d.textContent.trim()==""&&d.classList.add("no-text"),!d.classList.contains("no-text")))continue;let c=i.parentElement.tagName=="A",u=i,r=document.createElement("figure");if(r.style.setProperty("flex-grow",i.getAttribute("data-flex-grow")||"1"),r.style.setProperty("flex-basis",i.getAttribute("data-flex-basis")||"0"),c&&(u=i.parentElement),u.parentElement.insertBefore(r,u),r.appendChild(u),i.hasAttribute("alt")){let m=document.createElement("figcaption");m.innerText=i.getAttribute("alt"),r.appendChild(m)}if(!c){r.className="gallery-image";let m=document.createElement("a");m.href=i.src,m.setAttribute("target","_blank"),i.parentNode.insertBefore(m,i),m.appendChild(i)}}let a=t.querySelectorAll("figure.gallery-image"),o=[];for(let i of a)o.length?i.previousElementSibling===o[o.length-1]?o.push(i):o.length&&(e.wrap(o),o=[i]):o=[i];o.length>0&&e.wrap(o)}static wrap(t){let n=document.createElement("div");n.className="gallery";let a=t[0].parentNode,o=t[0];a.insertBefore(n,o);for(let i of t)n.appendChild(i)}open(t){let n=document.querySelector(".pswp");new window.PhotoSwipe(n,window.PhotoSwipeUI_Default,this.items,{index:t,galleryUID:this.galleryUID,getThumbBoundsFn:o=>{let i=this.items[o].el.getElementsByTagName("img")[0],d=window.pageYOffset||document.documentElement.scrollTop,s=i.getBoundingClientRect();return{x:s.left,y:s.top+d,w:s.width}}}).init()}bindClick(){for(let[t,n]of this.items.entries())n.el.querySelector("a").addEventListener("click",o=>{o.preventDefault(),this.open(t)})}},A=w;var v={};if(localStorage.hasOwnProperty("StackColorsCache"))try{v=JSON.parse(localStorage.getItem("StackColorsCache"))}catch{v={}}async function L(e,t,n){if(!e)return await Vibrant.from(n).getPalette();if(!v.hasOwnProperty(e)||v[e].hash!==t){let a=await Vibrant.from(n).getPalette();v[e]={hash:t,Vibrant:{hex:a.Vibrant.hex,rgb:a.Vibrant.rgb,bodyTextColor:a.Vibrant.bodyTextColor},DarkMuted:{hex:a.DarkMuted.hex,rgb:a.DarkMuted.rgb,bodyTextColor:a.DarkMuted.bodyTextColor}},localStorage.setItem("StackColorsCache",JSON.stringify(v))}return v[e]}var U=(e,t=500)=>{e.classList.add("transiting"),e.style.transitionProperty="height, margin, padding",e.style.transitionDuration=t+"ms",e.style.height=e.offsetHeight+"px",e.offsetHeight,e.style.overflow="hidden",e.style.height="0",e.style.paddingTop="0",e.style.paddingBottom="0",e.style.marginTop="0",e.style.marginBottom="0",window.setTimeout(()=>{e.classList.remove("show"),e.style.removeProperty("height"),e.style.removeProperty("padding-top"),e.style.removeProperty("padding-bottom"),e.style.removeProperty("margin-top"),e.style.removeProperty("margin-bottom"),e.style.removeProperty("overflow"),e.style.removeProperty("transition-duration"),e.style.removeProperty("transition-property"),e.classList.remove("transiting")},t)},z=(e,t=500)=>{e.classList.add("transiting"),e.style.removeProperty("display"),e.classList.add("show");let n=e.offsetHeight;e.style.overflow="hidden",e.style.height="0",e.style.paddingTop="0",e.style.paddingBottom="0",e.style.marginTop="0",e.style.marginBottom="0",e.offsetHeight,e.style.transitionProperty="height, margin, padding",e.style.transitionDuration=t+"ms",e.style.height=n+"px",e.style.removeProperty("padding-top"),e.style.removeProperty("padding-bottom"),e.style.removeProperty("margin-top"),e.style.removeProperty("margin-bottom"),window.setTimeout(()=>{e.style.removeProperty("height"),e.style.removeProperty("overflow"),e.style.removeProperty("transition-duration"),e.style.removeProperty("transition-property"),e.classList.remove("transiting")},t)},K=(e,t=500)=>window.getComputedStyle(e).display==="none"?z(e,t):U(e,t);function k(){let e=document.getElementById("toggle-menu");e&&e.addEventListener("click",()=>{document.getElementById("main-menu").classList.contains("transiting")||(document.body.classList.toggle("show-menu"),K(document.getElementById("main-menu"),300),e.classList.toggle("is-active"))})}function O(e,t,n){var a=document.createElement(e);for(let o in t)if(o&&t.hasOwnProperty(o)){let i=t[o];o=="dangerouslySetInnerHTML"?a.innerHTML=i.__html:i===!0?a.setAttribute(o,o):i!==!1&&i!=null&&a.setAttribute(o,i.toString())}for(let o=2;o<arguments.length;o++){let i=arguments[o];i&&a.appendChild(i.nodeType==null?document.createTextNode(i.toString()):i)}return a}var T=O;var S=class{localStorageKey="StackColorScheme";currentScheme;systemPreferScheme;constructor(t){this.bindMatchMedia(),this.currentScheme=this.getSavedScheme(),window.matchMedia("(prefers-color-scheme: dark)").matches===!0?this.systemPreferScheme="dark":this.systemPreferScheme="light",this.dispatchEvent(document.documentElement.dataset.scheme),t&&this.bindClick(t),document.body.style.transition==""&&document.body.style.setProperty("transition","background-color .3s ease")}saveScheme(){localStorage.setItem(this.localStorageKey,this.currentScheme)}bindClick(t){t.addEventListener("click",n=>{this.isDark()?this.currentScheme="light":this.currentScheme="dark",this.setBodyClass(),this.currentScheme==this.systemPreferScheme&&(this.currentScheme="auto"),this.saveScheme()})}isDark(){return this.currentScheme=="dark"||this.currentScheme=="auto"&&this.systemPreferScheme=="dark"}dispatchEvent(t){let n=new CustomEvent("onColorSchemeChange",{detail:t});window.dispatchEvent(n)}setBodyClass(){this.isDark()?document.documentElement.dataset.scheme="dark":document.documentElement.dataset.scheme="light",this.dispatchEvent(document.documentElement.dataset.scheme)}getSavedScheme(){let t=localStorage.getItem(this.localStorageKey);return t=="light"||t=="dark"||t=="auto"?t:"auto"}bindMatchMedia(){window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",t=>{t.matches?this.systemPreferScheme="dark":this.systemPreferScheme="light",this.setBodyClass()})}},x=S;function b(e){let t;return()=>{t&&window.cancelAnimationFrame(t),t=window.requestAnimationFrame(()=>e())}}var F=".article-content h1[id], .article-content h2[id], .article-content h3[id], .article-content h4[id], .article-content h5[id], .article-content h6[id]",I="#TableOfContents",M="#TableOfContents li",C="active-class";function _(e,t){let n=e.querySelector("a").offsetHeight,a=e.offsetTop-t.offsetHeight/2+n/2-t.offsetTop;a<0&&(a=0),t.scrollTo({top:a,behavior:"smooth"})}function R(e){let t={};return e.forEach(n=>{let o=n.querySelector("a").getAttribute("href");o.startsWith("#")&&(t[o.slice(1)]=n)}),t}function B(e){let t=[];return e.forEach(n=>{t.push({id:n.id,offset:n.offsetTop})}),t.sort((n,a)=>n.offset-a.offset),t}function P(){let e=document.querySelectorAll(F);if(!e){console.warn("No header matched query",e);return}let t=document.querySelector(I);if(!t){console.warn("No toc matched query",I);return}let n=document.querySelectorAll(M);if(!n){console.warn("No navigation matched query",M);return}let a=B(e),o=!1;t.addEventListener("mouseenter",b(()=>o=!0)),t.addEventListener("mouseleave",b(()=>o=!1));let i,d=R(n);function s(){let u=document.documentElement.scrollTop||document.body.scrollTop,r;a.forEach(h=>{u>=h.offset-20&&(r=document.getElementById(h.id))});let m;r&&(m=d[r.id]),r&&!m?console.debug("No link found for section",r):m!==i&&(i&&i.classList.remove(C),m&&(m.classList.add(C),o||_(m,t)),i=m)}window.addEventListener("scroll",b(s));function c(){a=B(e),s()}window.addEventListener("resize",b(c))}var W="a[href]";function H(){document.querySelectorAll(W).forEach(e=>{e.getAttribute("href").startsWith("#")&&e.addEventListener("click",n=>{n.preventDefault();let a=decodeURI(e.getAttribute("href").substring(1)),o=document.getElementById(a),i=o.getBoundingClientRect().top-document.documentElement.getBoundingClientRect().top;window.history.pushState({},"",e.getAttribute("href")),scrollTo({top:i,behavior:"smooth"})})})}var E=class{localStorageKey="StackAdminAuth";attemptsKey="StackAuthAttempts";timestampKey="StackAuthTimestamp";currentStatus;config;constructor(t){this.config={adminPassword:"admit",sessionTimeout:24*60*60*1e3,maxLoginAttempts:5,...t},this.currentStatus=this.getSavedAuthStatus(),this.cleanupExpiredSession(),this.dispatchAuthEvent(this.currentStatus)}authenticate(t){return this.isBlocked()?(this.dispatchAuthEvent("blocked"),!1):t===this.config.adminPassword?(this.currentStatus="authenticated",this.saveAuthStatus(),this.clearLoginAttempts(),this.dispatchAuthEvent("authenticated"),!0):(this.incrementLoginAttempts(),this.dispatchAuthEvent("failed"),!1)}logout(){this.currentStatus="guest",this.clearAuthData(),this.dispatchAuthEvent("guest")}isAuthenticated(){return this.isSessionExpired()?(this.logout(),!1):this.currentStatus==="authenticated"}isAdmin(){return this.isAuthenticated()}getStatus(){return this.currentStatus}isBlocked(){return this.getLoginAttempts()>=this.config.maxLoginAttempts}getRemainingAttempts(){let t=this.getLoginAttempts();return Math.max(0,this.config.maxLoginAttempts-t)}resetLoginAttempts(){this.clearLoginAttempts()}saveAuthStatus(){localStorage.setItem(this.localStorageKey,this.currentStatus),localStorage.setItem(this.timestampKey,Date.now().toString())}getSavedAuthStatus(){return localStorage.getItem(this.localStorageKey)==="authenticated"?"authenticated":"guest"}isSessionExpired(){let t=localStorage.getItem(this.timestampKey);if(!t)return!0;let n=parseInt(t);return Date.now()-n>this.config.sessionTimeout}cleanupExpiredSession(){this.isSessionExpired()&&(this.clearAuthData(),this.currentStatus="guest")}clearAuthData(){localStorage.removeItem(this.localStorageKey),localStorage.removeItem(this.timestampKey)}getLoginAttempts(){let t=localStorage.getItem(this.attemptsKey);return t?parseInt(t):0}incrementLoginAttempts(){let t=this.getLoginAttempts()+1;localStorage.setItem(this.attemptsKey,t.toString())}clearLoginAttempts(){localStorage.removeItem(this.attemptsKey)}dispatchAuthEvent(t){let n=new CustomEvent("onAuthStatusChange",{detail:{status:t,isAuthenticated:this.isAuthenticated(),isAdmin:this.isAdmin(),remainingAttempts:this.getRemainingAttempts()}});window.dispatchEvent(n)}},p={toggleAdminElements:e=>{let t=document.querySelectorAll("[data-admin-only]"),n=document.querySelectorAll("[data-guest-only]");t.forEach(a=>{a.style.display=e?"block":"none"}),n.forEach(a=>{a.style.display=e?"none":"block"})},updateBodyClass:e=>{e?(document.body.classList.add("admin-mode"),document.body.classList.remove("guest-mode")):(document.body.classList.add("guest-mode"),document.body.classList.remove("admin-mode"))},createLoginModal:()=>`
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
        `,showLoginModal:()=>{let e=document.getElementById("admin-login-modal");if(e)e.style.display="flex",p.clearMessages(),setTimeout(()=>{let t=document.getElementById("admin-password");t&&(t.focus(),t.select())},150);else{console.warn("Admin login modal not found. Creating modal...");let t=p.createLoginModal();document.body.insertAdjacentHTML("beforeend",t),setTimeout(()=>p.showLoginModal(),100)}},hideLoginModal:()=>{let e=document.getElementById("admin-login-modal");if(e){e.style.display="none";let t=document.getElementById("admin-login-form");t&&t.reset();let n=document.getElementById("admin-login-error"),a=document.getElementById("admin-login-attempts");n&&(n.style.display="none"),a&&(a.style.display="none")}},showLoginError:e=>{let t=document.getElementById("admin-login-error");t&&(t.textContent=e,t.style.display="block")},showAttemptsInfo:e=>{let t=document.getElementById("admin-login-attempts");t&&(t.textContent=`\u5269\u4F59\u5C1D\u8BD5\u6B21\u6570: ${e}`,t.style.display="block")},setLoginButtonLoading:e=>{let t=document.getElementById("admin-login-btn");t&&(e?(t.disabled=!0,t.classList.add("loading")):(t.disabled=!1,t.classList.remove("loading")))},clearMessages:()=>{let e=document.getElementById("admin-login-error"),t=document.getElementById("admin-login-attempts");e&&(e.style.display="none"),t&&(t.style.display="none")},validatePassword:e=>e?e.length<1?{valid:!1,message:"\u5BC6\u7801\u4E0D\u80FD\u4E3A\u7A7A"}:{valid:!0}:{valid:!1,message:"\u8BF7\u8F93\u5165\u5BC6\u7801"},createAdminPanel:()=>`
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
        `},D=E;var g,l={init:()=>{try{g=new D,console.log("\u2705 globalAuth created successfully")}catch(s){console.error("\u274C Failed to create globalAuth:",s),console.log("\u{1F527} Attempting fallback auth creation..."),g={config:{adminPassword:localStorage.getItem("adminPassword")||"admit"},isAuthenticated:()=>localStorage.getItem("adminAuth")==="authenticated",authenticate:function(c){return c===this.config.adminPassword?(localStorage.setItem("adminAuth","authenticated"),setTimeout(()=>{document.querySelectorAll("[data-admin-only]").forEach(m=>{m.style.display="block"}),document.querySelectorAll("[data-guest-only]").forEach(m=>{m.style.display="none"}),console.log("\u2705 Fallback auth UI updated")},100),!0):!1},logout:()=>{localStorage.removeItem("adminAuth"),document.querySelectorAll("[data-admin-only]").forEach(r=>{r.style.display="none"}),document.querySelectorAll("[data-guest-only]").forEach(r=>{r.style.display="block"})},updatePassword:function(c){this.config.adminPassword=c,localStorage.setItem("adminPassword",c),console.log("\u2705 Fallback auth password updated")}},console.log("\u2705 Fallback auth created")}window.addEventListener("onAuthStatusChange",s=>{let{status:c,isAuthenticated:u,isAdmin:r,remainingAttempts:m}=s.detail;switch(p.toggleAdminElements(r),p.updateBodyClass(r),c){case"authenticated":p.hideLoginModal(),console.log("Admin authenticated successfully"),setTimeout(()=>{console.log("\u{1F527} Force showing admin elements after authentication"),document.querySelectorAll("[data-admin-only]").forEach(y=>{y.style.display="block"}),console.log("\u2705 Admin elements forced to show")},100);break;case"failed":p.showLoginError("\u5BC6\u7801\u9519\u8BEF"),m>0&&p.showAttemptsInfo(m);break;case"blocked":p.showLoginError("\u767B\u5F55\u5C1D\u8BD5\u6B21\u6570\u8FC7\u591A\uFF0C\u8BF7\u7A0D\u540E\u518D\u8BD5");break;case"guest":console.log("User logged out or session expired");break}}),console.log("Creating login modal...");let e=p.createLoginModal();if(document.body.insertAdjacentHTML("beforeend",e),console.log("Login modal created"),console.log("Checking for admin panel in HTML..."),document.getElementById("admin-panel-modal")?console.log("\u2705 Admin panel found in HTML template"):console.error("\u274C Admin panel not found in HTML template!"),l.bindAuthEvents(),l.bindAdminPanelEvents(),console.log("\u{1F50D} Checking globalAuth:",!!g),g){let s=g.isAuthenticated();console.log("\u{1F50D} Initial admin status:",s),p.toggleAdminElements(s),p.updateBodyClass(s)}else console.error("\u274C globalAuth not initialized!");setTimeout(()=>{console.log("\u23F0 DOM ready, loading admin settings..."),l.loadAdminSettings()},100),console.log("\u2705 Stack initialization complete"),k();let n=document.querySelector(".article-content");n&&(new A(n),H(),P());let a=document.querySelector(".article-list--tile");a&&new IntersectionObserver(async(c,u)=>{c.forEach(r=>{if(!r.isIntersecting)return;u.unobserve(r.target),r.target.querySelectorAll("article.has-image").forEach(async h=>{let y=h.querySelector("img"),q=y.src,V=y.getAttribute("data-key"),N=y.getAttribute("data-hash"),$=h.querySelector(".article-details"),f=await L(V,N,q);$.style.background=`
                        linear-gradient(0deg, 
                            rgba(${f.DarkMuted.rgb[0]}, ${f.DarkMuted.rgb[1]}, ${f.DarkMuted.rgb[2]}, 0.5) 0%, 
                            rgba(${f.Vibrant.rgb[0]}, ${f.Vibrant.rgb[1]}, ${f.Vibrant.rgb[2]}, 0.75) 100%)`})})}).observe(a);let o=document.querySelectorAll(".article-content div.highlight"),i="Copy",d="Copied!";o.forEach(s=>{let c=document.createElement("button");c.innerHTML=i,c.classList.add("copyCodeButton"),s.appendChild(c);let u=s.querySelector("code[data-lang]");u&&c.addEventListener("click",()=>{navigator.clipboard.writeText(u.textContent).then(()=>{c.textContent=d,setTimeout(()=>{c.textContent=i},1e3)}).catch(r=>{alert(r),console.log("Something went wrong",r)})})}),new x(document.getElementById("dark-mode-toggle"))},bindAuthEvents:()=>{let e=document.getElementById("admin-login-form");e&&e.addEventListener("submit",i=>{i.preventDefault();let d=document.getElementById("admin-password");d&&g.authenticate(d.value)});let t=document.getElementById("admin-modal-close"),n=document.getElementById("admin-cancel-btn");t&&t.addEventListener("click",()=>{p.hideLoginModal()}),n&&n.addEventListener("click",()=>{p.hideLoginModal()});let a=document.getElementById("admin-login-modal");a&&a.addEventListener("click",i=>{i.target===a&&p.hideLoginModal()}),document.addEventListener("keydown",i=>{i.key==="Escape"&&p.hideLoginModal()});let o=document.getElementById("admin-panel-toggle");o&&o.addEventListener("click",i=>{i.preventDefault(),l.showAdminPanel()}),document.addEventListener("click",i=>{let d=i.target;if(d){let s=d.textContent||"",c=d.parentElement?.textContent||"",u=d.closest("a")?.textContent||"";if(s.trim()==="\u7BA1\u7406\u9762\u677F"||s.includes("\u7BA1\u7406\u9762\u677F")||c.includes("\u7BA1\u7406\u9762\u677F")||u.includes("\u7BA1\u7406\u9762\u677F")||d.id==="admin-panel-toggle"||d.closest("#admin-panel-toggle")||d.classList.contains("admin-panel-trigger"))if(i.preventDefault(),i.stopPropagation(),console.log("\u{1F3AF} Admin panel click detected:",d),console.log("\u{1F3AF} Clicked text:",s),g&&g.isAuthenticated()){console.log("\u2705 User is authenticated, showing admin panel");let m=document.getElementById("admin-panel-modal");m?(console.log("\u2705 Panel found, showing directly"),m.style.display="flex",l.loadAdminSettings&&l.loadAdminSettings()):console.error("\u274C Panel not found in DOM")}else console.log("\u274C User not authenticated, cannot show admin panel")}},!0)},bindAdminPanelEvents:()=>{console.log("Binding admin panel events...");let e=document.getElementById("admin-panel-close"),t=document.getElementById("admin-panel-cancel");e&&e.addEventListener("click",()=>{l.hideAdminPanel()}),t&&t.addEventListener("click",()=>{l.hideAdminPanel()});let n=document.getElementById("admin-panel-modal");n&&n.addEventListener("click",u=>{u.target===n&&l.hideAdminPanel()}),document.querySelectorAll(".admin-tab-btn").forEach(u=>{u.addEventListener("click",r=>{let h=r.target.getAttribute("data-tab");h&&l.switchAdminTab(h)})});let o=document.getElementById("admin-avatar-upload");o&&o.addEventListener("change",u=>{let r=u.target;r.files&&r.files[0]&&l.handleAvatarUpload(r.files[0])});let i=document.getElementById("admin-avatar-reset");i&&i.addEventListener("click",()=>{l.resetAvatar()});let d=document.getElementById("admin-save-settings");d&&d.addEventListener("click",()=>{l.saveAdminSettings()});let s=document.getElementById("admin-theme-color");s&&s.addEventListener("change",u=>{let r=u.target;l.updateThemeColor(r.value)});let c=document.getElementById("admin-change-password");c&&c.addEventListener("click",()=>{l.changeAdminPassword()}),console.log("Admin panel events bound successfully")},getAuth:()=>g,showLogin:()=>{p.showLoginModal()},logout:()=>{g&&g.logout()},showAdminPanel:()=>{console.log("\u{1F3AF} showAdminPanel called");let e=document.getElementById("admin-panel-modal");e?(console.log("\u2705 Panel found in HTML, showing it"),e.style.display="flex",l.loadAdminSettings()):console.error("\u274C Admin panel not found in HTML! This should not happen since it is in the template.")},hideAdminPanel:()=>{let e=document.getElementById("admin-panel-modal");e&&(e.style.display="none")},switchAdminTab:e=>{document.querySelectorAll(".admin-tab-btn").forEach(a=>{a.classList.remove("active")}),document.querySelectorAll(".admin-tab-panel").forEach(a=>{a.classList.remove("active")});let t=document.querySelector(`[data-tab="${e}"]`),n=document.getElementById(`admin-tab-${e}`);t&&t.classList.add("active"),n&&n.classList.add("active")},handleAvatarUpload:e=>{if(e.type.startsWith("image/")){let t=new FileReader;t.onload=n=>{let a=n.target?.result,o=document.getElementById("admin-avatar-img");o&&(o.src=a,localStorage.setItem("adminAvatar",a),l.updateSiteAvatar(a))},t.readAsDataURL(e)}},resetAvatar:()=>{let e="/img/avatar_hu_f509edb42ecc0ebd.png",t=document.getElementById("admin-avatar-img");t&&(t.src=e,localStorage.removeItem("adminAvatar"),l.updateSiteAvatar(e))},updateSiteAvatar:e=>{[".site-avatar img",".site-logo",".site-avatar .site-logo","[data-avatar]"].forEach(a=>{let o=document.querySelector(a);o&&(o.src=e,console.log(`\u2705 Updated avatar for selector: ${a}`))}),document.querySelectorAll('img[alt*="Avatar"], img[alt*="avatar"]').forEach(a=>{(!a.id||!a.id.includes("admin"))&&(a.src=e,console.log(`\u2705 Updated additional avatar: ${a.className||a.id||"unnamed"}`))})},loadAdminSettings:()=>{console.log("\u{1F504} Loading admin settings...");try{let e={avatar:"/img/avatar_hu_f509edb42ecc0ebd.png",title:"lanniny-blog",description:"\u6F14\u793A\u6587\u7A3F",themeColor:"#34495e",password:"admit"};try{let t=localStorage.getItem("adminAvatar")||e.avatar,n=document.getElementById("admin-avatar-img");n&&(n.src=t,console.log("\u2705 Avatar loaded:",t!==e.avatar?"custom":"default")),t!==e.avatar&&l.updateSiteAvatar(t)}catch(t){console.warn("\u26A0\uFE0F Avatar loading failed:",t);let n=document.getElementById("admin-avatar-img");n&&(n.src=e.avatar)}try{let t=localStorage.getItem("adminSiteTitle")||e.title,n=document.getElementById("admin-site-title");if(n&&(n.value=t,console.log("\u2705 Site title loaded:",t)),t!==e.title){let a=document.querySelector(".site-name a");a&&(a.textContent=t,console.log("\u2705 Site title updated in header"))}}catch(t){console.warn("\u26A0\uFE0F Site title loading failed:",t);let n=document.getElementById("admin-site-title");n&&(n.value=e.title)}try{let t=localStorage.getItem("adminSiteDescription")||e.description,n=document.getElementById("admin-site-description");if(n&&(n.value=t,console.log("\u2705 Site description loaded:",t)),t!==e.description){let a=document.querySelector(".site-description");a&&(a.textContent=t,console.log("\u2705 Site description updated in header"))}}catch(t){console.warn("\u26A0\uFE0F Site description loading failed:",t);let n=document.getElementById("admin-site-description");n&&(n.value=e.description)}try{let t=localStorage.getItem("adminThemeColor")||e.themeColor,n=document.getElementById("admin-theme-color");n&&(n.value=t,console.log("\u2705 Theme color loaded:",t)),t!==e.themeColor&&(l.updateThemeColor(t),console.log("\u2705 Theme color applied"))}catch(t){console.warn("\u26A0\uFE0F Theme color loading failed:",t);let n=document.getElementById("admin-theme-color");n&&(n.value=e.themeColor)}try{let t=localStorage.getItem("adminPassword");t&&g?g.config?(g.config.adminPassword=t,console.log("\u2705 Admin password loaded from localStorage")):console.warn("\u26A0\uFE0F globalAuth.config not available, password not loaded"):console.log("\u2139\uFE0F No saved password found, using default")}catch(t){console.warn("\u26A0\uFE0F Admin password loading failed:",t)}console.log("\u2705 Admin settings loading completed")}catch(e){console.error("\u274C Critical error in loadAdminSettings:",e),console.log("\u{1F527} Attempting to recover with default values...")}},saveAdminSettings:()=>{console.log("\u{1F4BE} Saving admin settings...");let e=document.getElementById("admin-save-settings"),t=e?.textContent||"\u4FDD\u5B58\u8BBE\u7F6E";try{e&&(e.disabled=!0,e.innerHTML=`
                    <svg class="admin-icon admin-loading" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 12a9 9 0 11-6.219-8.56"></path>
                    </svg>
                    \u4FDD\u5B58\u4E2D...
                `,console.log("\u{1F504} Save button set to loading state"));let n=0,a=0,o=document.getElementById("admin-site-title");if(o){a++;let s=o.value.trim();if(s){localStorage.setItem("adminSiteTitle",s);let c=document.querySelector(".site-name a");c&&(c.textContent=s,console.log("\u2705 Site title saved and updated:",s)),n++}else console.warn("\u26A0\uFE0F Site title is empty, not saved")}let i=document.getElementById("admin-site-description");if(i){a++;let s=i.value.trim();if(s){localStorage.setItem("adminSiteDescription",s);let c=document.querySelector(".site-description");c&&(c.textContent=s,console.log("\u2705 Site description saved and updated:",s)),n++}else console.warn("\u26A0\uFE0F Site description is empty, not saved")}let d=document.getElementById("admin-theme-color");if(d){a++;let s=d.value;s&&/^#[0-9A-F]{6}$/i.test(s)?(localStorage.setItem("adminThemeColor",s),l.updateThemeColor(s),console.log("\u2705 Theme color saved and applied:",s),n++):console.warn("\u26A0\uFE0F Invalid theme color format, not saved:",s)}setTimeout(()=>{e&&(e.disabled=!1,e.innerHTML=`
                        <svg class="admin-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"></path>
                            <polyline points="17,21 17,13 7,13 7,21"></polyline>
                            <polyline points="7,3 7,8 15,8"></polyline>
                        </svg>
                        ${t}
                    `),n===a&&a>0?(l.showSuccessMessage(`\u8BBE\u7F6E\u5DF2\u4FDD\u5B58\uFF01(${n}/${a}\u9879)`),console.log(`\u2705 All settings saved successfully (${n}/${a})`),l.hideAdminPanel()):n>0?(l.showSuccessMessage(`\u90E8\u5206\u8BBE\u7F6E\u5DF2\u4FDD\u5B58 (${n}/${a}\u9879)`),console.log(`\u26A0\uFE0F Partial save completed (${n}/${a})`)):(l.showErrorMessage("\u6CA1\u6709\u6709\u6548\u7684\u8BBE\u7F6E\u9700\u8981\u4FDD\u5B58"),console.log("\u274C No valid settings to save"))},800)}catch(n){console.error("\u274C Error saving admin settings:",n),e&&(e.disabled=!1,e.innerHTML=`
                    <svg class="admin-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"></path>
                        <polyline points="17,21 17,13 7,13 7,21"></polyline>
                        <polyline points="7,3 7,8 15,8"></polyline>
                    </svg>
                    ${t}
                `),l.showErrorMessage("\u8BBE\u7F6E\u4FDD\u5B58\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5")}},checkDataPersistence:()=>{console.log("\u{1F50D} Checking data persistence status...");let e={localStorage:{available:!1,quota:0,used:0},settings:{avatar:!1,title:!1,description:!1,themeColor:!1,password:!1},integrity:!0};try{if(typeof Storage<"u"&&localStorage){e.localStorage.available=!0;let n=0;for(let a in localStorage)localStorage.hasOwnProperty(a)&&(n+=localStorage[a].length+a.length);e.localStorage.used=n,console.log("\u2705 localStorage available, used:",n,"characters")}else console.warn("\u26A0\uFE0F localStorage not available");e.settings.avatar=!!localStorage.getItem("adminAvatar"),e.settings.title=!!localStorage.getItem("adminSiteTitle"),e.settings.description=!!localStorage.getItem("adminSiteDescription"),e.settings.themeColor=!!localStorage.getItem("adminThemeColor"),e.settings.password=!!localStorage.getItem("adminPassword");let t=Object.values(e.settings).filter(Boolean).length;console.log(`\u{1F4CA} Persistence status: ${t}/5 settings saved`);try{let n="test_persistence_"+Date.now();localStorage.setItem(n,"test");let a=localStorage.getItem(n);localStorage.removeItem(n),a!=="test"?(e.integrity=!1,console.warn("\u26A0\uFE0F localStorage integrity check failed")):console.log("\u2705 localStorage integrity check passed")}catch(n){e.integrity=!1,console.warn("\u26A0\uFE0F localStorage integrity test failed:",n)}}catch(t){console.error("\u274C Error checking data persistence:",t),e.integrity=!1}return e},resetAdminSettings:()=>{console.log("\u{1F504} Resetting all admin settings to defaults...");try{["adminAvatar","adminSiteTitle","adminSiteDescription","adminThemeColor","adminPassword"].forEach(t=>{localStorage.removeItem(t),console.log(`\u{1F5D1}\uFE0F Removed ${t}`)}),l.loadAdminSettings(),l.showSuccessMessage("\u6240\u6709\u8BBE\u7F6E\u5DF2\u91CD\u7F6E\u4E3A\u9ED8\u8BA4\u503C"),console.log("\u2705 All admin settings reset to defaults")}catch(e){console.error("\u274C Error resetting admin settings:",e),l.showErrorMessage("\u91CD\u7F6E\u8BBE\u7F6E\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5")}},updateThemeColor:e=>{document.documentElement.style.setProperty("--accent-color",e);let t=document.querySelector(".admin-color-preview");t&&(t.style.backgroundColor=e)},changeAdminPassword:()=>{let e=document.getElementById("admin-new-password");if(!e||!e.value.trim()){l.showErrorMessage("\u8BF7\u8F93\u5165\u65B0\u5BC6\u7801");return}let t=e.value.trim();if(t.length<4){l.showErrorMessage("\u5BC6\u7801\u957F\u5EA6\u81F3\u5C114\u4E2A\u5B57\u7B26");return}if(t.length>50){l.showErrorMessage("\u5BC6\u7801\u957F\u5EA6\u4E0D\u80FD\u8D85\u8FC750\u4E2A\u5B57\u7B26");return}if(!/^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/.test(t)){l.showErrorMessage("\u5BC6\u7801\u53EA\u80FD\u5305\u542B\u5B57\u6BCD\u3001\u6570\u5B57\u548C\u5E38\u7528\u7B26\u53F7");return}try{g&&(g.config&&(g.config.adminPassword=t,console.log("\u2705 Updated globalAuth.config.adminPassword")),typeof g.updatePassword=="function"&&(g.updatePassword(t),console.log("\u2705 Called globalAuth.updatePassword()"))),localStorage.setItem("adminPassword",t),console.log("\u2705 Saved new password to localStorage"),e.value="",l.showSuccessMessage("\u5BC6\u7801\u5DF2\u6210\u529F\u66F4\u65B0\uFF01\u65B0\u5BC6\u7801\u7ACB\u5373\u751F\u6548"),console.log("\u{1F510} Password change completed successfully")}catch(n){console.error("\u274C Password change failed:",n),l.showErrorMessage("\u5BC6\u7801\u66F4\u65B0\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5")}},showSuccessMessage:e=>{l.showNotification(e,"success")},showErrorMessage:e=>{l.showNotification(e,"error")},showNotification:(e,t="success")=>{let n=document.createElement("div");n.className=`admin-notification admin-notification-${t}`,n.innerHTML=`
            <div class="admin-notification-content">
                <svg class="admin-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    ${t==="success"?'<path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path><polyline points="22,4 12,14.01 9,11.01"></polyline>':'<circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line>'}
                </svg>
                <span>${e}</span>
            </div>
        `,document.body.appendChild(n),setTimeout(()=>n.classList.add("show"),100),setTimeout(()=>{n.classList.remove("show"),setTimeout(()=>{n.parentNode&&n.parentNode.removeChild(n)},300)},3e3)},createAdminPanelHTML:()=>`
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
        `,showAdminPanel:()=>{let e=document.getElementById("admin-panel-modal");e&&(e.style.display="flex",l.loadAdminSettings())},hideAdminPanel:()=>{let e=document.getElementById("admin-panel-modal");e&&(e.style.display="none")},switchAdminTab:e=>{document.querySelectorAll(".admin-tab-btn").forEach(a=>{a.classList.remove("active")}),document.querySelectorAll(".admin-tab-panel").forEach(a=>{a.classList.remove("active")});let t=document.querySelector(`[data-tab="${e}"]`),n=document.getElementById(`admin-tab-${e}`);t&&t.classList.add("active"),n&&n.classList.add("active")},handleAvatarUpload:e=>{if(e.type.startsWith("image/")){let t=new FileReader;t.onload=n=>{let a=n.target?.result,o=document.getElementById("admin-avatar-img");o&&(o.src=a,localStorage.setItem("adminAvatar",a),l.updateSiteAvatar(a))},t.readAsDataURL(e)}},resetAvatar:()=>{let e="/img/avatar_hu_f509edb42ecc0ebd.png",t=document.getElementById("admin-avatar-img");t&&(t.src=e,localStorage.removeItem("adminAvatar"),l.updateSiteAvatar(e))},updateThemeColor:e=>{document.documentElement.style.setProperty("--accent-color",e);let t=document.querySelector(".admin-color-preview");t&&(t.style.backgroundColor=e)}};window.addEventListener("load",()=>{setTimeout(function(){l.init()},0)});window.Stack=l;window.createElement=T;window.StackAuth=g;})();
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
