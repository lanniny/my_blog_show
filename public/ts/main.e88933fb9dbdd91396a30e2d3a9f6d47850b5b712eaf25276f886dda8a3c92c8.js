(()=>{var w=class e{galleryUID;items=[];constructor(t,n=1){if(window.PhotoSwipe==null||window.PhotoSwipeUI_Default==null){console.error("PhotoSwipe lib not loaded.");return}this.galleryUID=n,e.createGallery(t),this.loadItems(t),this.bindClick()}loadItems(t){this.items=[];let n=t.querySelectorAll("figure.gallery-image");for(let a of n){let i=a.querySelector("figcaption"),o=a.querySelector("img"),d={w:parseInt(o.getAttribute("width")),h:parseInt(o.getAttribute("height")),src:o.src,msrc:o.getAttribute("data-thumb")||o.src,el:a};i&&(d.title=i.innerHTML),this.items.push(d)}}static createGallery(t){let n=t.querySelectorAll("img.gallery-image");for(let o of Array.from(n)){let d=o.closest("p");if(!d||!t.contains(d)||(d.textContent.trim()==""&&d.classList.add("no-text"),!d.classList.contains("no-text")))continue;let c=o.parentElement.tagName=="A",r=o,l=document.createElement("figure");if(l.style.setProperty("flex-grow",o.getAttribute("data-flex-grow")||"1"),l.style.setProperty("flex-basis",o.getAttribute("data-flex-basis")||"0"),c&&(r=o.parentElement),r.parentElement.insertBefore(l,r),l.appendChild(r),o.hasAttribute("alt")){let u=document.createElement("figcaption");u.innerText=o.getAttribute("alt"),l.appendChild(u)}if(!c){l.className="gallery-image";let u=document.createElement("a");u.href=o.src,u.setAttribute("target","_blank"),o.parentNode.insertBefore(u,o),u.appendChild(o)}}let a=t.querySelectorAll("figure.gallery-image"),i=[];for(let o of a)i.length?o.previousElementSibling===i[i.length-1]?i.push(o):i.length&&(e.wrap(i),i=[o]):i=[o];i.length>0&&e.wrap(i)}static wrap(t){let n=document.createElement("div");n.className="gallery";let a=t[0].parentNode,i=t[0];a.insertBefore(n,i);for(let o of t)n.appendChild(o)}open(t){let n=document.querySelector(".pswp");new window.PhotoSwipe(n,window.PhotoSwipeUI_Default,this.items,{index:t,galleryUID:this.galleryUID,getThumbBoundsFn:i=>{let o=this.items[i].el.getElementsByTagName("img")[0],d=window.pageYOffset||document.documentElement.scrollTop,m=o.getBoundingClientRect();return{x:m.left,y:m.top+d,w:m.width}}}).init()}bindClick(){for(let[t,n]of this.items.entries())n.el.querySelector("a").addEventListener("click",i=>{i.preventDefault(),this.open(t)})}},L=w;var v={};if(localStorage.hasOwnProperty("StackColorsCache"))try{v=JSON.parse(localStorage.getItem("StackColorsCache"))}catch{v={}}async function A(e,t,n){if(!e)return await Vibrant.from(n).getPalette();if(!v.hasOwnProperty(e)||v[e].hash!==t){let a=await Vibrant.from(n).getPalette();v[e]={hash:t,Vibrant:{hex:a.Vibrant.hex,rgb:a.Vibrant.rgb,bodyTextColor:a.Vibrant.bodyTextColor},DarkMuted:{hex:a.DarkMuted.hex,rgb:a.DarkMuted.rgb,bodyTextColor:a.DarkMuted.bodyTextColor}},localStorage.setItem("StackColorsCache",JSON.stringify(v))}return v[e]}var z=(e,t=500)=>{e.classList.add("transiting"),e.style.transitionProperty="height, margin, padding",e.style.transitionDuration=t+"ms",e.style.height=e.offsetHeight+"px",e.offsetHeight,e.style.overflow="hidden",e.style.height="0",e.style.paddingTop="0",e.style.paddingBottom="0",e.style.marginTop="0",e.style.marginBottom="0",window.setTimeout(()=>{e.classList.remove("show"),e.style.removeProperty("height"),e.style.removeProperty("padding-top"),e.style.removeProperty("padding-bottom"),e.style.removeProperty("margin-top"),e.style.removeProperty("margin-bottom"),e.style.removeProperty("overflow"),e.style.removeProperty("transition-duration"),e.style.removeProperty("transition-property"),e.classList.remove("transiting")},t)},U=(e,t=500)=>{e.classList.add("transiting"),e.style.removeProperty("display"),e.classList.add("show");let n=e.offsetHeight;e.style.overflow="hidden",e.style.height="0",e.style.paddingTop="0",e.style.paddingBottom="0",e.style.marginTop="0",e.style.marginBottom="0",e.offsetHeight,e.style.transitionProperty="height, margin, padding",e.style.transitionDuration=t+"ms",e.style.height=n+"px",e.style.removeProperty("padding-top"),e.style.removeProperty("padding-bottom"),e.style.removeProperty("margin-top"),e.style.removeProperty("margin-bottom"),window.setTimeout(()=>{e.style.removeProperty("height"),e.style.removeProperty("overflow"),e.style.removeProperty("transition-duration"),e.style.removeProperty("transition-property"),e.classList.remove("transiting")},t)},R=(e,t=500)=>window.getComputedStyle(e).display==="none"?U(e,t):z(e,t);function T(){let e=document.getElementById("toggle-menu");e&&e.addEventListener("click",()=>{document.getElementById("main-menu").classList.contains("transiting")||(document.body.classList.toggle("show-menu"),R(document.getElementById("main-menu"),300),e.classList.toggle("is-active"))})}function K(e,t,n){var a=document.createElement(e);for(let i in t)if(i&&t.hasOwnProperty(i)){let o=t[i];i=="dangerouslySetInnerHTML"?a.innerHTML=o.__html:o===!0?a.setAttribute(i,i):o!==!1&&o!=null&&a.setAttribute(i,o.toString())}for(let i=2;i<arguments.length;i++){let o=arguments[i];o&&a.appendChild(o.nodeType==null?document.createTextNode(o.toString()):o)}return a}var k=K;var E=class{localStorageKey="StackColorScheme";currentScheme;systemPreferScheme;constructor(t){this.bindMatchMedia(),this.currentScheme=this.getSavedScheme(),window.matchMedia("(prefers-color-scheme: dark)").matches===!0?this.systemPreferScheme="dark":this.systemPreferScheme="light",this.dispatchEvent(document.documentElement.dataset.scheme),t&&this.bindClick(t),document.body.style.transition==""&&document.body.style.setProperty("transition","background-color .3s ease")}saveScheme(){localStorage.setItem(this.localStorageKey,this.currentScheme)}bindClick(t){t.addEventListener("click",n=>{this.isDark()?this.currentScheme="light":this.currentScheme="dark",this.setBodyClass(),this.currentScheme==this.systemPreferScheme&&(this.currentScheme="auto"),this.saveScheme()})}isDark(){return this.currentScheme=="dark"||this.currentScheme=="auto"&&this.systemPreferScheme=="dark"}dispatchEvent(t){let n=new CustomEvent("onColorSchemeChange",{detail:t});window.dispatchEvent(n)}setBodyClass(){this.isDark()?document.documentElement.dataset.scheme="dark":document.documentElement.dataset.scheme="light",this.dispatchEvent(document.documentElement.dataset.scheme)}getSavedScheme(){let t=localStorage.getItem(this.localStorageKey);return t=="light"||t=="dark"||t=="auto"?t:"auto"}bindMatchMedia(){window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",t=>{t.matches?this.systemPreferScheme="dark":this.systemPreferScheme="light",this.setBodyClass()})}},I=E;function b(e){let t;return()=>{t&&window.cancelAnimationFrame(t),t=window.requestAnimationFrame(()=>e())}}var _=".article-content h1[id], .article-content h2[id], .article-content h3[id], .article-content h4[id], .article-content h5[id], .article-content h6[id]",M="#TableOfContents",x="#TableOfContents li",C="active-class";function Y(e,t){let n=e.querySelector("a").offsetHeight,a=e.offsetTop-t.offsetHeight/2+n/2-t.offsetTop;a<0&&(a=0),t.scrollTo({top:a,behavior:"smooth"})}function W(e){let t={};return e.forEach(n=>{let i=n.querySelector("a").getAttribute("href");i.startsWith("#")&&(t[i.slice(1)]=n)}),t}function B(e){let t=[];return e.forEach(n=>{t.push({id:n.id,offset:n.offsetTop})}),t.sort((n,a)=>n.offset-a.offset),t}function H(){let e=document.querySelectorAll(_);if(!e){console.warn("No header matched query",e);return}let t=document.querySelector(M);if(!t){console.warn("No toc matched query",M);return}let n=document.querySelectorAll(x);if(!n){console.warn("No navigation matched query",x);return}let a=B(e),i=!1;t.addEventListener("mouseenter",b(()=>i=!0)),t.addEventListener("mouseleave",b(()=>i=!1));let o,d=W(n);function m(){let r=document.documentElement.scrollTop||document.body.scrollTop,l;a.forEach(h=>{r>=h.offset-20&&(l=document.getElementById(h.id))});let u;l&&(u=d[l.id]),l&&!u?console.debug("No link found for section",l):u!==o&&(o&&o.classList.remove(C),u&&(u.classList.add(C),i||Y(u,t)),o=u)}window.addEventListener("scroll",b(m));function c(){a=B(e),m()}window.addEventListener("resize",b(c))}var Q="a[href]";function V(){document.querySelectorAll(Q).forEach(e=>{e.getAttribute("href").startsWith("#")&&e.addEventListener("click",n=>{n.preventDefault();let a=decodeURI(e.getAttribute("href").substring(1)),i=document.getElementById(a),o=i.getBoundingClientRect().top-document.documentElement.getBoundingClientRect().top;window.history.pushState({},"",e.getAttribute("href")),scrollTo({top:o,behavior:"smooth"})})})}var S=class{localStorageKey="StackAdminAuth";attemptsKey="StackAuthAttempts";timestampKey="StackAuthTimestamp";currentStatus;config;constructor(t){this.config={adminPassword:"admit",sessionTimeout:24*60*60*1e3,maxLoginAttempts:5,...t},this.currentStatus=this.getSavedAuthStatus(),this.cleanupExpiredSession(),this.dispatchAuthEvent(this.currentStatus)}authenticate(t){return this.isBlocked()?(this.dispatchAuthEvent("blocked"),!1):t===this.config.adminPassword?(this.currentStatus="authenticated",this.saveAuthStatus(),this.clearLoginAttempts(),this.dispatchAuthEvent("authenticated"),!0):(this.incrementLoginAttempts(),this.dispatchAuthEvent("failed"),!1)}logout(){this.currentStatus="guest",this.clearAuthData(),this.dispatchAuthEvent("guest")}isAuthenticated(){return this.isSessionExpired()?(this.logout(),!1):this.currentStatus==="authenticated"}isAdmin(){return this.isAuthenticated()}getStatus(){return this.currentStatus}isBlocked(){return this.getLoginAttempts()>=this.config.maxLoginAttempts}getRemainingAttempts(){let t=this.getLoginAttempts();return Math.max(0,this.config.maxLoginAttempts-t)}resetLoginAttempts(){this.clearLoginAttempts()}saveAuthStatus(){localStorage.setItem(this.localStorageKey,this.currentStatus),localStorage.setItem(this.timestampKey,Date.now().toString())}getSavedAuthStatus(){return localStorage.getItem(this.localStorageKey)==="authenticated"?"authenticated":"guest"}isSessionExpired(){let t=localStorage.getItem(this.timestampKey);if(!t)return!0;let n=parseInt(t);return Date.now()-n>this.config.sessionTimeout}cleanupExpiredSession(){this.isSessionExpired()&&(this.clearAuthData(),this.currentStatus="guest")}clearAuthData(){localStorage.removeItem(this.localStorageKey),localStorage.removeItem(this.timestampKey)}getLoginAttempts(){let t=localStorage.getItem(this.attemptsKey);return t?parseInt(t):0}incrementLoginAttempts(){let t=this.getLoginAttempts()+1;localStorage.setItem(this.attemptsKey,t.toString())}clearLoginAttempts(){localStorage.removeItem(this.attemptsKey)}dispatchAuthEvent(t){let n=new CustomEvent("onAuthStatusChange",{detail:{status:t,isAuthenticated:this.isAuthenticated(),isAdmin:this.isAdmin(),remainingAttempts:this.getRemainingAttempts()}});window.dispatchEvent(n)}},p={toggleAdminElements:e=>{let t=document.querySelectorAll("[data-admin-only]"),n=document.querySelectorAll("[data-guest-only]");t.forEach(a=>{a.style.display=e?"block":"none"}),n.forEach(a=>{a.style.display=e?"none":"block"})},updateBodyClass:e=>{e?(document.body.classList.add("admin-mode"),document.body.classList.remove("guest-mode")):(document.body.classList.add("guest-mode"),document.body.classList.remove("admin-mode"))},createLoginModal:()=>`
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
        `},P=S;var q={init(){console.log("\u{1F3A8} Initializing frontend beautification..."),document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{this.setupAll()}):this.setupAll()},setupAll(){this.setupReadingProgress(),this.setupBackToTop(),this.setupSmoothScrolling(),this.setupImageLazyLoading(),this.setupAnimations(),console.log("\u2705 Frontend beautification initialized")},setupReadingProgress(){let e=document.createElement("div");e.className="reading-progress",document.body.appendChild(e);let t=!1,n=()=>{let a=window.pageYOffset||document.documentElement.scrollTop,i=document.documentElement.scrollHeight-window.innerHeight,o=a/i*100;e.style.width=`${Math.min(o,100)}%`,t=!1};window.addEventListener("scroll",()=>{t||(requestAnimationFrame(n),t=!0)}),console.log("\u2705 Reading progress bar setup complete")},setupBackToTop(){let e=document.createElement("a");e.href="#",e.className="back-to-top",e.innerHTML=`
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 15l-6-6-6 6"></path>
            </svg>
        `,e.setAttribute("aria-label","\u8FD4\u56DE\u9876\u90E8"),document.body.appendChild(e);let t=!1,n=()=>{(window.pageYOffset||document.documentElement.scrollTop)>300?e.classList.add("visible"):e.classList.remove("visible"),t=!1};window.addEventListener("scroll",()=>{t||(requestAnimationFrame(n),t=!0)}),e.addEventListener("click",a=>{a.preventDefault(),window.scrollTo({top:0,behavior:"smooth"})}),console.log("\u2705 Back to top button setup complete")},setupSmoothScrolling(){document.querySelectorAll('a[href^="#"]').forEach(t=>{t.addEventListener("click",n=>{let a=t.getAttribute("href");if(a==="#"||a==="#top"){n.preventDefault(),window.scrollTo({top:0,behavior:"smooth"});return}let i=document.querySelector(a);if(i){n.preventDefault();let o=i.getBoundingClientRect().top+window.pageYOffset-80;window.scrollTo({top:o,behavior:"smooth"})}})}),console.log("\u2705 Smooth scrolling setup complete")},setupImageLazyLoading(){if("IntersectionObserver"in window){let e=new IntersectionObserver((n,a)=>{n.forEach(i=>{if(i.isIntersecting){let o=i.target;o.style.opacity="0",o.style.transition="opacity 0.3s ease",o.addEventListener("load",()=>{o.style.opacity="1"}),a.unobserve(o)}})});document.querySelectorAll(".article-image img").forEach(n=>{e.observe(n)}),console.log("\u2705 Enhanced image lazy loading setup complete")}},setupAnimations(){if("IntersectionObserver"in window){let e=new IntersectionObserver(a=>{a.forEach(i=>{i.isIntersecting&&i.target.classList.add("animate-in")})},{threshold:.1,rootMargin:"0px 0px -50px 0px"});document.querySelectorAll(".article-list article").forEach((a,i)=>{a.style.animationDelay=`${i*.1}s`,e.observe(a)}),document.querySelectorAll(".widget").forEach((a,i)=>{a.style.animationDelay=`${i*.1}s`,e.observe(a)}),console.log("\u2705 Scroll animations setup complete")}this.setupHoverEffects()},setupHoverEffects(){document.querySelectorAll(".article-list article").forEach(n=>{n.addEventListener("mouseenter",()=>{n.style.transform="translateY(-8px) rotateX(2deg)"}),n.addEventListener("mouseleave",()=>{n.style.transform="translateY(0) rotateX(0deg)"})}),document.querySelectorAll(".tag-cloud a").forEach(n=>{n.addEventListener("mouseenter",()=>{let a=["linear-gradient(135deg, #667eea 0%, #764ba2 100%)","linear-gradient(135deg, #f093fb 0%, #f5576c 100%)","linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)","linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)","linear-gradient(135deg, #fa709a 0%, #fee140 100%)"],i=a[Math.floor(Math.random()*a.length)];n.style.background=i})}),console.log("\u2705 Hover effects setup complete")}};q.init();window.FrontendBeautify=q;var F={init(){console.log("\u{1F9ED} Initializing navigation enhancement..."),document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{this.setupAll()}):this.setupAll()},setupAll(){this.setupScrollEffects(),this.setupScrollIndicator(),this.setupMobileMenu(),this.setupSearchEnhancement(),console.log("\u2705 Navigation enhancement initialized")},setupScrollEffects(){let e=document.querySelector(".main-header");if(!e)return;let t=window.scrollY,n=!1,a=()=>{let i=window.scrollY;i>50?e.classList.add("scrolled"):e.classList.remove("scrolled"),i>t&&i>200?e.style.transform="translateY(-100%)":e.style.transform="translateY(0)",t=i,n=!1};window.addEventListener("scroll",()=>{n||(requestAnimationFrame(a),n=!0)}),console.log("\u2705 Scroll effects setup complete")},setupScrollIndicator(){let e=document.createElement("div");e.className="scroll-indicator",e.innerHTML='<div class="scroll-indicator-bar"></div>',document.body.appendChild(e);let t=e.querySelector(".scroll-indicator-bar"),n=!1,a=()=>{let i=window.pageYOffset||document.documentElement.scrollTop,o=document.documentElement.scrollHeight-window.innerHeight,d=i/o*100;t&&(t.style.width=`${Math.min(d,100)}%`),n=!1};window.addEventListener("scroll",()=>{n||(requestAnimationFrame(a),n=!0)}),console.log("\u2705 Scroll indicator setup complete")},setupMobileMenu(){let e=document.querySelector(".menu-toggle"),t=document.querySelector(".main-menu");if(!e||!t)return;e.addEventListener("click",()=>{e.classList.toggle("active"),t.classList.toggle("active"),document.body.classList.toggle("menu-open")}),t.querySelectorAll("a").forEach(a=>{a.addEventListener("click",()=>{e.classList.remove("active"),t.classList.remove("active"),document.body.classList.remove("menu-open")})}),document.addEventListener("click",a=>{let i=a.target;!e.contains(i)&&!t.contains(i)&&(e.classList.remove("active"),t.classList.remove("active"),document.body.classList.remove("menu-open"))}),console.log("\u2705 Mobile menu enhancement setup complete")},setupSearchEnhancement(){let e=document.querySelector(".search-button"),t=document.querySelector(".search-modal");if(e){if(e.addEventListener("click",n=>{if(n.preventDefault(),e.style.transform="scale(0.95)",setTimeout(()=>{e.style.transform=""},150),t){t.classList.add("active");let a=t.querySelector("input");a&&setTimeout(()=>a.focus(),100)}}),t){let n=t.querySelector(".search-close");n&&n.addEventListener("click",()=>{t.classList.remove("active")}),document.addEventListener("keydown",a=>{a.key==="Escape"&&t.classList.contains("active")&&t.classList.remove("active")}),t.addEventListener("click",a=>{a.target===t&&t.classList.remove("active")})}console.log("\u2705 Search enhancement setup complete")}}};F.init();window.NavigationEnhance=F;var g,s={init:()=>{try{g=new P,console.log("\u2705 globalAuth created successfully")}catch(m){console.error("\u274C Failed to create globalAuth:",m),console.log("\u{1F527} Attempting fallback auth creation..."),g={config:{adminPassword:localStorage.getItem("adminPassword")||"admit"},isAuthenticated:()=>localStorage.getItem("adminAuth")==="authenticated",authenticate:function(c){return c===this.config.adminPassword?(localStorage.setItem("adminAuth","authenticated"),setTimeout(()=>{document.querySelectorAll("[data-admin-only]").forEach(u=>{u.style.display="block"}),document.querySelectorAll("[data-guest-only]").forEach(u=>{u.style.display="none"}),console.log("\u2705 Fallback auth UI updated")},100),!0):!1},logout:()=>{localStorage.removeItem("adminAuth"),document.querySelectorAll("[data-admin-only]").forEach(l=>{l.style.display="none"}),document.querySelectorAll("[data-guest-only]").forEach(l=>{l.style.display="block"})},updatePassword:function(c){this.config.adminPassword=c,localStorage.setItem("adminPassword",c),console.log("\u2705 Fallback auth password updated")}},console.log("\u2705 Fallback auth created")}window.addEventListener("onAuthStatusChange",m=>{let{status:c,isAuthenticated:r,isAdmin:l,remainingAttempts:u}=m.detail;switch(p.toggleAdminElements(l),p.updateBodyClass(l),c){case"authenticated":p.hideLoginModal(),console.log("Admin authenticated successfully"),setTimeout(()=>{console.log("\u{1F527} Force showing admin elements after authentication"),document.querySelectorAll("[data-admin-only]").forEach(y=>{y.style.display="block"}),console.log("\u2705 Admin elements forced to show")},100);break;case"failed":p.showLoginError("\u5BC6\u7801\u9519\u8BEF"),u>0&&p.showAttemptsInfo(u);break;case"blocked":p.showLoginError("\u767B\u5F55\u5C1D\u8BD5\u6B21\u6570\u8FC7\u591A\uFF0C\u8BF7\u7A0D\u540E\u518D\u8BD5");break;case"guest":console.log("User logged out or session expired");break}}),console.log("Creating login modal...");let e=p.createLoginModal();if(document.body.insertAdjacentHTML("beforeend",e),console.log("Login modal created"),console.log("Checking for admin panel in HTML..."),document.getElementById("admin-panel-modal")?console.log("\u2705 Admin panel found in HTML template"):console.error("\u274C Admin panel not found in HTML template!"),s.bindAuthEvents(),s.bindAdminPanelEvents(),console.log("\u{1F50D} Checking globalAuth:",!!g),g){let m=g.isAuthenticated();console.log("\u{1F50D} Initial admin status:",m),p.toggleAdminElements(m),p.updateBodyClass(m)}else console.error("\u274C globalAuth not initialized!");setTimeout(()=>{console.log("\u23F0 DOM ready, loading admin settings..."),s.loadAdminSettings()},100),console.log("\u2705 Stack initialization complete"),T();let n=document.querySelector(".article-content");n&&(new L(n),V(),H());let a=document.querySelector(".article-list--tile");a&&new IntersectionObserver(async(c,r)=>{c.forEach(l=>{if(!l.isIntersecting)return;r.unobserve(l.target),l.target.querySelectorAll("article.has-image").forEach(async h=>{let y=h.querySelector("img"),D=y.src,$=y.getAttribute("data-key"),N=y.getAttribute("data-hash"),O=h.querySelector(".article-details"),f=await A($,N,D);O.style.background=`
                        linear-gradient(0deg, 
                            rgba(${f.DarkMuted.rgb[0]}, ${f.DarkMuted.rgb[1]}, ${f.DarkMuted.rgb[2]}, 0.5) 0%, 
                            rgba(${f.Vibrant.rgb[0]}, ${f.Vibrant.rgb[1]}, ${f.Vibrant.rgb[2]}, 0.75) 100%)`})})}).observe(a);let i=document.querySelectorAll(".article-content div.highlight"),o="Copy",d="Copied!";i.forEach(m=>{let c=document.createElement("button");c.innerHTML=o,c.classList.add("copyCodeButton"),m.appendChild(c);let r=m.querySelector("code[data-lang]");r&&c.addEventListener("click",()=>{navigator.clipboard.writeText(r.textContent).then(()=>{c.textContent=d,setTimeout(()=>{c.textContent=o},1e3)}).catch(l=>{alert(l),console.log("Something went wrong",l)})})}),new I(document.getElementById("dark-mode-toggle"))},bindAuthEvents:()=>{let e=document.getElementById("admin-login-form");e&&e.addEventListener("submit",o=>{o.preventDefault();let d=document.getElementById("admin-password");d&&g.authenticate(d.value)});let t=document.getElementById("admin-modal-close"),n=document.getElementById("admin-cancel-btn");t&&t.addEventListener("click",()=>{p.hideLoginModal()}),n&&n.addEventListener("click",()=>{p.hideLoginModal()});let a=document.getElementById("admin-login-modal");a&&a.addEventListener("click",o=>{o.target===a&&p.hideLoginModal()}),document.addEventListener("keydown",o=>{o.key==="Escape"&&p.hideLoginModal()});let i=document.getElementById("admin-panel-toggle");i&&i.addEventListener("click",o=>{o.preventDefault(),s.showAdminPanel()}),document.addEventListener("click",o=>{let d=o.target;if(d){let m=d.textContent||"",c=d.parentElement?.textContent||"",r=d.closest("a")?.textContent||"";if(m.trim()==="\u7BA1\u7406\u9762\u677F"||m.includes("\u7BA1\u7406\u9762\u677F")||c.includes("\u7BA1\u7406\u9762\u677F")||r.includes("\u7BA1\u7406\u9762\u677F")||d.id==="admin-panel-toggle"||d.closest("#admin-panel-toggle")||d.classList.contains("admin-panel-trigger"))if(o.preventDefault(),o.stopPropagation(),console.log("\u{1F3AF} Admin panel click detected:",d),console.log("\u{1F3AF} Clicked text:",m),g&&g.isAuthenticated()){console.log("\u2705 User is authenticated, showing admin panel");let u=document.getElementById("admin-panel-modal");u?(console.log("\u2705 Panel found, showing directly"),u.style.display="flex",s.loadAdminSettings&&s.loadAdminSettings()):console.error("\u274C Panel not found in DOM")}else console.log("\u274C User not authenticated, cannot show admin panel")}},!0)},bindAdminPanelEvents:()=>{console.log("Binding admin panel events...");let e=document.getElementById("admin-panel-close"),t=document.getElementById("admin-panel-cancel");e&&e.addEventListener("click",()=>{s.hideAdminPanel()}),t&&t.addEventListener("click",()=>{s.hideAdminPanel()});let n=document.getElementById("admin-panel-modal");n&&n.addEventListener("click",r=>{r.target===n&&s.hideAdminPanel()}),document.querySelectorAll(".admin-tab-btn").forEach(r=>{r.addEventListener("click",l=>{let h=l.target.getAttribute("data-tab");h&&s.switchAdminTab(h)})});let i=document.getElementById("admin-avatar-upload");i&&i.addEventListener("change",r=>{let l=r.target;l.files&&l.files[0]&&s.handleAvatarUpload(l.files[0])});let o=document.getElementById("admin-avatar-reset");o&&o.addEventListener("click",()=>{s.resetAvatar()});let d=document.getElementById("admin-save-settings");d&&d.addEventListener("click",()=>{s.saveAdminSettings()});let m=document.getElementById("admin-theme-color");m&&m.addEventListener("change",r=>{let l=r.target;s.updateThemeColor(l.value)});let c=document.getElementById("admin-change-password");c&&c.addEventListener("click",()=>{s.changeAdminPassword()}),console.log("Admin panel events bound successfully")},getAuth:()=>g,showLogin:()=>{p.showLoginModal()},logout:()=>{g&&g.logout()},showAdminPanel:()=>{console.log("\u{1F3AF} showAdminPanel called");let e=document.getElementById("admin-panel-modal");e?(console.log("\u2705 Panel found in HTML, showing it"),e.style.display="flex",s.loadAdminSettings()):console.error("\u274C Admin panel not found in HTML! This should not happen since it is in the template.")},hideAdminPanel:()=>{let e=document.getElementById("admin-panel-modal");e&&(e.style.display="none")},switchAdminTab:e=>{document.querySelectorAll(".admin-tab-btn").forEach(a=>{a.classList.remove("active")}),document.querySelectorAll(".admin-tab-panel").forEach(a=>{a.classList.remove("active")});let t=document.querySelector(`[data-tab="${e}"]`),n=document.getElementById(`admin-tab-${e}`);t&&t.classList.add("active"),n&&n.classList.add("active")},handleAvatarUpload:e=>{if(e.type.startsWith("image/")){let t=new FileReader;t.onload=n=>{let a=n.target?.result,i=document.getElementById("admin-avatar-img");i&&(i.src=a,localStorage.setItem("adminAvatar",a),s.updateSiteAvatar(a))},t.readAsDataURL(e)}},resetAvatar:()=>{let e="/img/avatar_hu_f509edb42ecc0ebd.png",t=document.getElementById("admin-avatar-img");t&&(t.src=e,localStorage.removeItem("adminAvatar"),s.updateSiteAvatar(e))},updateSiteAvatar:e=>{[".site-avatar img",".site-logo",".site-avatar .site-logo","[data-avatar]"].forEach(a=>{let i=document.querySelector(a);i&&(i.src=e,console.log(`\u2705 Updated avatar for selector: ${a}`))}),document.querySelectorAll('img[alt*="Avatar"], img[alt*="avatar"]').forEach(a=>{(!a.id||!a.id.includes("admin"))&&(a.src=e,console.log(`\u2705 Updated additional avatar: ${a.className||a.id||"unnamed"}`))})},loadAdminSettings:()=>{console.log("\u{1F504} Loading admin settings...");try{let e={avatar:"/img/avatar_hu_f509edb42ecc0ebd.png",title:"lanniny-blog",description:"\u6F14\u793A\u6587\u7A3F",themeColor:"#34495e",password:"admit"};try{let t=localStorage.getItem("adminAvatar")||e.avatar,n=document.getElementById("admin-avatar-img");n&&(n.src=t,console.log("\u2705 Avatar loaded:",t!==e.avatar?"custom":"default")),t!==e.avatar&&s.updateSiteAvatar(t)}catch(t){console.warn("\u26A0\uFE0F Avatar loading failed:",t);let n=document.getElementById("admin-avatar-img");n&&(n.src=e.avatar)}try{let t=localStorage.getItem("adminSiteTitle")||e.title,n=document.getElementById("admin-site-title");if(n&&(n.value=t,console.log("\u2705 Site title loaded:",t)),t!==e.title){let a=document.querySelector(".site-name a");a&&(a.textContent=t,console.log("\u2705 Site title updated in header"))}}catch(t){console.warn("\u26A0\uFE0F Site title loading failed:",t);let n=document.getElementById("admin-site-title");n&&(n.value=e.title)}try{let t=localStorage.getItem("adminSiteDescription")||e.description,n=document.getElementById("admin-site-description");if(n&&(n.value=t,console.log("\u2705 Site description loaded:",t)),t!==e.description){let a=document.querySelector(".site-description");a&&(a.textContent=t,console.log("\u2705 Site description updated in header"))}}catch(t){console.warn("\u26A0\uFE0F Site description loading failed:",t);let n=document.getElementById("admin-site-description");n&&(n.value=e.description)}try{let t=localStorage.getItem("adminThemeColor")||e.themeColor,n=document.getElementById("admin-theme-color");n&&(n.value=t,console.log("\u2705 Theme color loaded:",t)),t!==e.themeColor&&(s.updateThemeColor(t),console.log("\u2705 Theme color applied"))}catch(t){console.warn("\u26A0\uFE0F Theme color loading failed:",t);let n=document.getElementById("admin-theme-color");n&&(n.value=e.themeColor)}try{let t=localStorage.getItem("adminPassword");t&&g?g.config?(g.config.adminPassword=t,console.log("\u2705 Admin password loaded from localStorage")):console.warn("\u26A0\uFE0F globalAuth.config not available, password not loaded"):console.log("\u2139\uFE0F No saved password found, using default")}catch(t){console.warn("\u26A0\uFE0F Admin password loading failed:",t)}console.log("\u2705 Admin settings loading completed")}catch(e){console.error("\u274C Critical error in loadAdminSettings:",e),console.log("\u{1F527} Attempting to recover with default values...")}},saveAdminSettings:()=>{console.log("\u{1F4BE} Saving admin settings...");let e=document.getElementById("admin-save-settings"),t=e?.textContent||"\u4FDD\u5B58\u8BBE\u7F6E";try{e&&(e.disabled=!0,e.innerHTML=`
                    <svg class="admin-icon admin-loading" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 12a9 9 0 11-6.219-8.56"></path>
                    </svg>
                    \u4FDD\u5B58\u4E2D...
                `,console.log("\u{1F504} Save button set to loading state"));let n=0,a=0;if(!s.FormValidator.validateAllFields()){e&&(e.disabled=!1,e.innerHTML=`
                        <svg class="admin-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"></path>
                            <polyline points="17,21 17,13 7,13 7,21"></polyline>
                            <polyline points="7,3 7,8 15,8"></polyline>
                        </svg>
                        ${t}
                    `),s.showErrorMessage("\u8BF7\u4FEE\u6B63\u8868\u5355\u4E2D\u7684\u9519\u8BEF\u540E\u518D\u4FDD\u5B58");return}let o=document.getElementById("admin-site-title");if(o){a++;let c=s.FormValidator.validateTitle(o.value);if(c.isValid){let r=o.value.trim();localStorage.setItem("adminSiteTitle",r);let l=document.querySelector(".site-name a");l&&(l.textContent=r,console.log("\u2705 Site title saved and updated:",r)),n++}else console.warn("\u26A0\uFE0F Site title validation failed:",c.message)}let d=document.getElementById("admin-site-description");if(d){a++;let c=s.FormValidator.validateDescription(d.value);if(c.isValid){let r=d.value.trim();localStorage.setItem("adminSiteDescription",r);let l=document.querySelector(".site-description");l&&(l.textContent=r,console.log("\u2705 Site description saved and updated:",r)),n++}else console.warn("\u26A0\uFE0F Site description validation failed:",c.message)}let m=document.getElementById("admin-theme-color");if(m){a++;let c=s.FormValidator.validateThemeColor(m.value);if(c.isValid){let r=m.value;localStorage.setItem("adminThemeColor",r),s.updateThemeColor(r),console.log("\u2705 Theme color saved and applied:",r),n++}else console.warn("\u26A0\uFE0F Theme color validation failed:",c.message)}setTimeout(()=>{e&&(e.disabled=!1,e.innerHTML=`
                        <svg class="admin-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"></path>
                            <polyline points="17,21 17,13 7,13 7,21"></polyline>
                            <polyline points="7,3 7,8 15,8"></polyline>
                        </svg>
                        ${t}
                    `),n===a&&a>0?(s.showSuccessMessage(`\u8BBE\u7F6E\u5DF2\u4FDD\u5B58\uFF01(${n}/${a}\u9879)`),console.log(`\u2705 All settings saved successfully (${n}/${a})`),s.hideAdminPanel()):n>0?(s.showSuccessMessage(`\u90E8\u5206\u8BBE\u7F6E\u5DF2\u4FDD\u5B58 (${n}/${a}\u9879)`),console.log(`\u26A0\uFE0F Partial save completed (${n}/${a})`)):(s.showErrorMessage("\u6CA1\u6709\u6709\u6548\u7684\u8BBE\u7F6E\u9700\u8981\u4FDD\u5B58"),console.log("\u274C No valid settings to save"))},800)}catch(n){console.error("\u274C Error saving admin settings:",n),e&&(e.disabled=!1,e.innerHTML=`
                    <svg class="admin-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"></path>
                        <polyline points="17,21 17,13 7,13 7,21"></polyline>
                        <polyline points="7,3 7,8 15,8"></polyline>
                    </svg>
                    ${t}
                `),s.showErrorMessage("\u8BBE\u7F6E\u4FDD\u5B58\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5")}},checkDataPersistence:()=>{console.log("\u{1F50D} Checking data persistence status...");let e={localStorage:{available:!1,quota:0,used:0},settings:{avatar:!1,title:!1,description:!1,themeColor:!1,password:!1},integrity:!0};try{if(typeof Storage<"u"&&localStorage){e.localStorage.available=!0;let n=0;for(let a in localStorage)localStorage.hasOwnProperty(a)&&(n+=localStorage[a].length+a.length);e.localStorage.used=n,console.log("\u2705 localStorage available, used:",n,"characters")}else console.warn("\u26A0\uFE0F localStorage not available");e.settings.avatar=!!localStorage.getItem("adminAvatar"),e.settings.title=!!localStorage.getItem("adminSiteTitle"),e.settings.description=!!localStorage.getItem("adminSiteDescription"),e.settings.themeColor=!!localStorage.getItem("adminThemeColor"),e.settings.password=!!localStorage.getItem("adminPassword");let t=Object.values(e.settings).filter(Boolean).length;console.log(`\u{1F4CA} Persistence status: ${t}/5 settings saved`);try{let n="test_persistence_"+Date.now();localStorage.setItem(n,"test");let a=localStorage.getItem(n);localStorage.removeItem(n),a!=="test"?(e.integrity=!1,console.warn("\u26A0\uFE0F localStorage integrity check failed")):console.log("\u2705 localStorage integrity check passed")}catch(n){e.integrity=!1,console.warn("\u26A0\uFE0F localStorage integrity test failed:",n)}}catch(t){console.error("\u274C Error checking data persistence:",t),e.integrity=!1}return e},resetAdminSettings:()=>{console.log("\u{1F504} Resetting all admin settings to defaults...");try{["adminAvatar","adminSiteTitle","adminSiteDescription","adminThemeColor","adminPassword"].forEach(t=>{localStorage.removeItem(t),console.log(`\u{1F5D1}\uFE0F Removed ${t}`)}),s.loadAdminSettings(),s.showSuccessMessage("\u6240\u6709\u8BBE\u7F6E\u5DF2\u91CD\u7F6E\u4E3A\u9ED8\u8BA4\u503C"),console.log("\u2705 All admin settings reset to defaults")}catch(e){console.error("\u274C Error resetting admin settings:",e),s.showErrorMessage("\u91CD\u7F6E\u8BBE\u7F6E\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5")}},FormValidator:{validateTitle:e=>!e||e.trim().length===0?{isValid:!1,message:"\u7AD9\u70B9\u6807\u9898\u4E0D\u80FD\u4E3A\u7A7A"}:e.trim().length<2?{isValid:!1,message:"\u7AD9\u70B9\u6807\u9898\u81F3\u5C11\u9700\u89812\u4E2A\u5B57\u7B26"}:e.trim().length>50?{isValid:!1,message:"\u7AD9\u70B9\u6807\u9898\u4E0D\u80FD\u8D85\u8FC750\u4E2A\u5B57\u7B26"}:/^[a-zA-Z0-9\u4e00-\u9fa5\s\-_\.]+$/.test(e.trim())?{isValid:!0,message:"\u7AD9\u70B9\u6807\u9898\u683C\u5F0F\u6B63\u786E"}:{isValid:!1,message:"\u7AD9\u70B9\u6807\u9898\u53EA\u80FD\u5305\u542B\u5B57\u6BCD\u3001\u6570\u5B57\u3001\u4E2D\u6587\u3001\u7A7A\u683C\u3001\u8FDE\u5B57\u7B26\u3001\u4E0B\u5212\u7EBF\u548C\u70B9\u53F7"},validateDescription:e=>!e||e.trim().length===0?{isValid:!1,message:"\u7AD9\u70B9\u63CF\u8FF0\u4E0D\u80FD\u4E3A\u7A7A"}:e.trim().length<5?{isValid:!1,message:"\u7AD9\u70B9\u63CF\u8FF0\u81F3\u5C11\u9700\u89815\u4E2A\u5B57\u7B26"}:e.trim().length>200?{isValid:!1,message:"\u7AD9\u70B9\u63CF\u8FF0\u4E0D\u80FD\u8D85\u8FC7200\u4E2A\u5B57\u7B26"}:{isValid:!0,message:"\u7AD9\u70B9\u63CF\u8FF0\u683C\u5F0F\u6B63\u786E"},validatePassword:e=>{if(!e||e.trim().length===0)return{isValid:!1,message:"\u5BC6\u7801\u4E0D\u80FD\u4E3A\u7A7A",strength:"weak"};if(e.length<4)return{isValid:!1,message:"\u5BC6\u7801\u957F\u5EA6\u81F3\u5C114\u4E2A\u5B57\u7B26",strength:"weak"};if(e.length>50)return{isValid:!1,message:"\u5BC6\u7801\u957F\u5EA6\u4E0D\u80FD\u8D85\u8FC750\u4E2A\u5B57\u7B26",strength:"weak"};if(!/^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/.test(e))return{isValid:!1,message:"\u5BC6\u7801\u53EA\u80FD\u5305\u542B\u5B57\u6BCD\u3001\u6570\u5B57\u548C\u5E38\u7528\u7B26\u53F7",strength:"weak"};let t="weak",n=0;return e.length>=8&&n++,/[a-z]/.test(e)&&n++,/[A-Z]/.test(e)&&n++,/[0-9]/.test(e)&&n++,/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(e)&&n++,n>=4?t="strong":n>=2&&(t="medium"),{isValid:!0,message:`\u5BC6\u7801\u5F3A\u5EA6: ${t==="strong"?"\u5F3A":t==="medium"?"\u4E2D\u7B49":"\u5F31"}`,strength:t}},validateThemeColor:e=>!e||e.trim().length===0?{isValid:!1,message:"\u4E3B\u9898\u8272\u4E0D\u80FD\u4E3A\u7A7A"}:/^#[0-9A-F]{6}$/i.test(e)?{isValid:!0,message:"\u4E3B\u9898\u8272\u683C\u5F0F\u6B63\u786E"}:{isValid:!1,message:"\u4E3B\u9898\u8272\u683C\u5F0F\u4E0D\u6B63\u786E\uFF0C\u8BF7\u4F7F\u7528\u5341\u516D\u8FDB\u5236\u989C\u8272\u4EE3\u7801\uFF08\u5982 #FF0000\uFF09"},showFieldValidation:(e,t)=>{let n=document.getElementById(e);if(!n)return;let a=n.parentElement?.querySelector(".validation-message");a&&a.remove(),n.classList.remove("validation-success","validation-error","validation-warning");let i=document.createElement("div");if(i.className=`validation-message ${t.isValid?"validation-success":"validation-error"}`,i.innerHTML=`
                <svg class="validation-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    ${t.isValid?'<path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path><polyline points="22,4 12,14.01 9,11.01"></polyline>':'<circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line>'}
                </svg>
                <span>${t.message}</span>
            `,n.classList.add(t.isValid?"validation-success":"validation-error"),e.includes("password")&&t.strength){let o=`strength-${t.strength}`;i.classList.add(o)}n.parentElement?.appendChild(i)},validateAllFields:()=>{let e=!0,t=document.getElementById("admin-site-title");if(t){let i=s.FormValidator.validateTitle(t.value);s.FormValidator.showFieldValidation("admin-site-title",i),i.isValid||(e=!1)}let n=document.getElementById("admin-site-description");if(n){let i=s.FormValidator.validateDescription(n.value);s.FormValidator.showFieldValidation("admin-site-description",i),i.isValid||(e=!1)}let a=document.getElementById("admin-theme-color");if(a){let i=s.FormValidator.validateThemeColor(a.value);s.FormValidator.showFieldValidation("admin-theme-color",i),i.isValid||(e=!1)}return e}},setupFormValidation:()=>{console.log("\u{1F527} Setting up real-time form validation...");let e=document.getElementById("admin-site-title");e&&(e.addEventListener("input",()=>{let i=s.FormValidator.validateTitle(e.value);s.FormValidator.showFieldValidation("admin-site-title",i)}),e.addEventListener("blur",()=>{let i=s.FormValidator.validateTitle(e.value);s.FormValidator.showFieldValidation("admin-site-title",i)}));let t=document.getElementById("admin-site-description");t&&(t.addEventListener("input",()=>{let i=s.FormValidator.validateDescription(t.value);s.FormValidator.showFieldValidation("admin-site-description",i)}),t.addEventListener("blur",()=>{let i=s.FormValidator.validateDescription(t.value);s.FormValidator.showFieldValidation("admin-site-description",i)}));let n=document.getElementById("admin-new-password");n&&(n.addEventListener("input",()=>{if(n.value.length>0){let i=s.FormValidator.validatePassword(n.value);s.FormValidator.showFieldValidation("admin-new-password",i)}}),n.addEventListener("blur",()=>{if(n.value.length>0){let i=s.FormValidator.validatePassword(n.value);s.FormValidator.showFieldValidation("admin-new-password",i)}}));let a=document.getElementById("admin-theme-color");a&&a.addEventListener("change",()=>{let i=s.FormValidator.validateThemeColor(a.value);s.FormValidator.showFieldValidation("admin-theme-color",i)}),console.log("\u2705 Real-time form validation setup complete")},updateThemeColor:e=>{document.documentElement.style.setProperty("--accent-color",e);let t=document.querySelector(".admin-color-preview");t&&(t.style.backgroundColor=e)},changeAdminPassword:()=>{let e=document.getElementById("admin-new-password");if(!e){s.showErrorMessage("\u5BC6\u7801\u8F93\u5165\u6846\u672A\u627E\u5230");return}let t=e.value.trim(),n=s.FormValidator.validatePassword(t);if(!n.isValid){s.showErrorMessage(n.message),s.FormValidator.showFieldValidation("admin-new-password",n);return}if(!(n.strength==="weak"&&!confirm("\u60A8\u7684\u5BC6\u7801\u5F3A\u5EA6\u8F83\u5F31\uFF0C\u5EFA\u8BAE\u4F7F\u7528\u5305\u542B\u5927\u5C0F\u5199\u5B57\u6BCD\u3001\u6570\u5B57\u548C\u7279\u6B8A\u5B57\u7B26\u7684\u5BC6\u7801\u3002\u662F\u5426\u7EE7\u7EED\uFF1F")))try{g&&(g.config&&(g.config.adminPassword=t,console.log("\u2705 Updated globalAuth.config.adminPassword")),typeof g.updatePassword=="function"&&(g.updatePassword(t),console.log("\u2705 Called globalAuth.updatePassword()"))),localStorage.setItem("adminPassword",t),console.log("\u2705 Saved new password to localStorage"),e.value="";let a=e.parentElement?.querySelector(".validation-message");a&&a.remove(),e.classList.remove("validation-success","validation-error"),s.showSuccessMessage(`\u5BC6\u7801\u5DF2\u6210\u529F\u66F4\u65B0\uFF01\u5BC6\u7801\u5F3A\u5EA6: ${n.strength==="strong"?"\u5F3A":n.strength==="medium"?"\u4E2D\u7B49":"\u5F31"}`),console.log("\u{1F510} Password change completed successfully")}catch(a){console.error("\u274C Password change failed:",a),s.showErrorMessage("\u5BC6\u7801\u66F4\u65B0\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5")}},showSuccessMessage:e=>{s.showNotification(e,"success")},showErrorMessage:e=>{s.showNotification(e,"error")},showNotification:(e,t="success")=>{let n=document.createElement("div");n.className=`admin-notification admin-notification-${t}`,n.innerHTML=`
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
        `,showAdminPanel:()=>{let e=document.getElementById("admin-panel-modal");e&&(e.style.display="flex",s.loadAdminSettings(),setTimeout(()=>{s.setupFormValidation()},100))},hideAdminPanel:()=>{let e=document.getElementById("admin-panel-modal");e&&(e.style.display="none")},switchAdminTab:e=>{document.querySelectorAll(".admin-tab-btn").forEach(a=>{a.classList.remove("active")}),document.querySelectorAll(".admin-tab-panel").forEach(a=>{a.classList.remove("active")});let t=document.querySelector(`[data-tab="${e}"]`),n=document.getElementById(`admin-tab-${e}`);t&&t.classList.add("active"),n&&n.classList.add("active")},handleAvatarUpload:e=>{if(e.type.startsWith("image/")){let t=new FileReader;t.onload=n=>{let a=n.target?.result,i=document.getElementById("admin-avatar-img");i&&(i.src=a,localStorage.setItem("adminAvatar",a),s.updateSiteAvatar(a))},t.readAsDataURL(e)}},resetAvatar:()=>{let e="/img/avatar_hu_f509edb42ecc0ebd.png",t=document.getElementById("admin-avatar-img");t&&(t.src=e,localStorage.removeItem("adminAvatar"),s.updateSiteAvatar(e))},updateThemeColor:e=>{document.documentElement.style.setProperty("--accent-color",e);let t=document.querySelector(".admin-color-preview");t&&(t.style.backgroundColor=e)}};window.addEventListener("load",()=>{setTimeout(function(){s.init()},0)});window.Stack=s;window.createElement=k;window.StackAuth=g;})();
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
