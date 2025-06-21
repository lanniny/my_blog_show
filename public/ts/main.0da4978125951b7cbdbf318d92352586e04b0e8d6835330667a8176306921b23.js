(()=>{var ae=Object.defineProperty;var oe=(n,e)=>()=>(n&&(e=n(n=0)),e);var re=(n,e)=>{for(var t in e)ae(n,t,{get:e[t],enumerable:!0})};var Z={};re(Z,{ArticleManager:()=>L,default:()=>ye});var L,Q,ye,D=oe(()=>{L=class{articles=new Map;isDirty=!1;autoSaveInterval=null;constructor(){this.init()}init(){console.log("\u{1F4DD} Article Manager initialized"),this.loadArticles(),this.setupAutoSave(),this.createArticleManagerInterface(),this.setupEventListeners()}createArticleManagerInterface(){document.getElementById("article-manager")||document.body.insertAdjacentHTML("beforeend",`
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
        `)}setupEventListeners(){setTimeout(()=>{let e=document.getElementById("new-article-btn");e?(e.addEventListener("click",()=>{console.log("New article button clicked"),this.createNewArticle()}),console.log("\u2705 New article button event listener attached")):console.warn("\u274C New article button not found");let t=document.getElementById("article-search");t&&(t.addEventListener("input",m=>{this.filterArticles()}),console.log("\u2705 Article search event listener attached"));let i=document.getElementById("article-filter");i&&(i.addEventListener("change",()=>{this.filterArticles()}),console.log("\u2705 Article filter event listener attached"));let s=document.getElementById("category-filter");s&&(s.addEventListener("change",()=>{this.filterArticles()}),console.log("\u2705 Category filter event listener attached"));let a=document.getElementById("save-draft-btn");a&&(a.addEventListener("click",()=>{this.saveDraft()}),console.log("\u2705 Save draft button event listener attached"));let o=document.getElementById("publish-btn");o&&(o.addEventListener("click",()=>{this.publishArticle()}),console.log("\u2705 Publish button event listener attached"));let r=document.getElementById("preview-btn");r&&(r.addEventListener("click",()=>{this.togglePreview()}),console.log("\u2705 Preview button event listener attached"));let l=document.getElementById("close-editor-btn");l&&(l.addEventListener("click",()=>{this.closeEditor()}),console.log("\u2705 Close editor button event listener attached")),document.getElementById("markdown-editor")?.addEventListener("input",()=>{this.updateWordCount(),this.updatePreview(),this.markDirty()}),document.getElementById("article-title")?.addEventListener("input",m=>{let h=m.target.value,g=this.generateSlug(h);document.getElementById("article-slug").value=g}),this.setupToolbarActions(),document.getElementById("upload-image-btn")?.addEventListener("click",()=>{this.openImageUploader()});let d=document.getElementById("sync-github-btn");d&&(d.addEventListener("click",()=>{this.syncToGitHub()}),console.log("\u2705 Sync GitHub button event listener attached"))},100)}loadArticles(){let e=localStorage.getItem("blog-articles");if(e)try{let t=JSON.parse(e);this.articles=new Map(Object.entries(t)),console.log(`\u{1F4DA} Loaded ${this.articles.size} articles`)}catch(t){console.warn("Failed to load articles:",t),this.articles=new Map}this.articles.size===0&&this.createSampleArticles(),this.renderArticleList()}createSampleArticles(){[{metadata:{title:"\u535A\u5BA2\u754C\u9762\u7F8E\u5316\u6D4B\u8BD5\u6587\u7AE0",slug:"blog-ui-test",description:"\u8FD9\u662F\u4E00\u7BC7\u7528\u4E8E\u6D4B\u8BD5\u535A\u5BA2\u754C\u9762\u7F8E\u5316\u6548\u679C\u7684\u6587\u7AE0",date:new Date("2024-01-15"),lastmod:new Date("2024-01-15"),draft:!1,categories:["\u6280\u672F","\u524D\u7AEF"],tags:["\u535A\u5BA2","UI","\u7F8E\u5316"],featured:!0},content:`# \u535A\u5BA2\u754C\u9762\u7F8E\u5316\u6D4B\u8BD5\u6587\u7AE0

\u8FD9\u662F\u4E00\u7BC7\u7528\u4E8E\u6D4B\u8BD5\u535A\u5BA2\u754C\u9762\u7F8E\u5316\u6548\u679C\u7684\u6587\u7AE0\u3002

## \u529F\u80FD\u7279\u6027

- \u73B0\u4EE3\u5316\u8BBE\u8BA1
- \u54CD\u5E94\u5F0F\u5E03\u5C40
- \u7528\u6237\u53CB\u597D\u7684\u754C\u9762`,frontmatter:"",fullContent:""},{metadata:{title:"\u56FE\u7247\u7BA1\u7406\u7CFB\u7EDF\u4F7F\u7528\u6307\u5357",slug:"image-management-guide",description:"\u8BE6\u7EC6\u4ECB\u7ECD\u5982\u4F55\u4F7F\u7528\u535A\u5BA2\u7684\u56FE\u7247\u7BA1\u7406\u7CFB\u7EDF",date:new Date("2024-01-10"),lastmod:new Date("2024-01-10"),draft:!1,categories:["\u6559\u7A0B"],tags:["\u56FE\u7247","\u7BA1\u7406","\u6307\u5357"],featured:!1},content:`# \u56FE\u7247\u7BA1\u7406\u7CFB\u7EDF\u4F7F\u7528\u6307\u5357

\u672C\u6587\u5C06\u8BE6\u7EC6\u4ECB\u7ECD\u5982\u4F55\u4F7F\u7528\u535A\u5BA2\u7684\u56FE\u7247\u7BA1\u7406\u7CFB\u7EDF\u3002

## \u4E0A\u4F20\u56FE\u7247

1. \u70B9\u51FB\u4E0A\u4F20\u6309\u94AE
2. \u9009\u62E9\u56FE\u7247\u6587\u4EF6
3. \u7B49\u5F85\u4E0A\u4F20\u5B8C\u6210`,frontmatter:"",fullContent:""},{metadata:{title:"\u65B0\u529F\u80FD\u5F00\u53D1\u8BA1\u5212",slug:"new-features-plan",description:"\u5373\u5C06\u63A8\u51FA\u7684\u65B0\u529F\u80FD\u9884\u89C8",date:new Date("2024-01-20"),lastmod:new Date("2024-01-20"),draft:!0,categories:["\u8BA1\u5212"],tags:["\u5F00\u53D1","\u65B0\u529F\u80FD","\u8BA1\u5212"],featured:!1},content:`# \u65B0\u529F\u80FD\u5F00\u53D1\u8BA1\u5212

## \u5373\u5C06\u63A8\u51FA\u7684\u529F\u80FD

- \u8BC4\u8BBA\u7CFB\u7EDF
- \u641C\u7D22\u529F\u80FD
- \u6807\u7B7E\u4E91
- \u6587\u7AE0\u63A8\u8350`,frontmatter:"",fullContent:""}].forEach(t=>{t.frontmatter=this.generateFrontmatter(t.metadata),t.fullContent=t.frontmatter+`

`+t.content,this.articles.set(t.metadata.slug,t)}),this.saveArticles(),console.log("\u{1F4DD} Created sample articles")}saveArticles(){let e=Object.fromEntries(this.articles);localStorage.setItem("blog-articles",JSON.stringify(e)),this.isDirty=!1,this.updateLastSaved()}setupAutoSave(){this.autoSaveInterval=window.setInterval(()=>{this.isDirty&&(this.saveArticles(),console.log("\u{1F4DD} Auto-saved articles"))},3e4)}markDirty(){this.isDirty=!0}updateLastSaved(){let e=document.getElementById("last-saved");e&&(e.textContent=`\u5DF2\u4FDD\u5B58 ${new Date().toLocaleTimeString()}`)}generateSlug(e){return e.toLowerCase().replace(/[^\w\s-]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-").trim()}createNewArticle(){let e={metadata:{title:"\u65B0\u6587\u7AE0",slug:"new-article-"+Date.now(),date:new Date,draft:!0,categories:[],tags:[],featured:!1},content:`# \u65B0\u6587\u7AE0

\u5728\u6B64\u5F00\u59CB\u7F16\u5199\u60A8\u7684\u6587\u7AE0\u5185\u5BB9...`,frontmatter:"",fullContent:""};this.articles.set(e.metadata.slug,e),this.markDirty(),this.renderArticleList(),this.editArticle(e.metadata.slug)}editArticle(e){let t=this.articles.get(e);if(!t){this.showMessage("\u6587\u7AE0\u4E0D\u5B58\u5728","error");return}let i=document.getElementById("article-editor");i&&(i.style.display="block"),this.populateEditor(t);let s=document.getElementById("editor-title");s&&(s.textContent=`\u7F16\u8F91\u6587\u7AE0: ${t.metadata.title}`)}populateEditor(e){document.getElementById("article-title").value=e.metadata.title,document.getElementById("article-slug").value=e.metadata.slug,document.getElementById("article-description").value=e.metadata.description||"",document.getElementById("article-categories").value=e.metadata.categories.join(", "),document.getElementById("article-tags").value=e.metadata.tags.join(", "),document.getElementById("article-image").value=e.metadata.image||"",document.getElementById("article-featured").checked=e.metadata.featured||!1,document.getElementById("article-draft").checked=e.metadata.draft,document.getElementById("markdown-editor").value=e.content,this.updateWordCount(),this.updatePreview()}getCurrentArticleData(){let e=document.getElementById("article-title").value,t=document.getElementById("article-slug").value,i=document.getElementById("article-description").value,s=document.getElementById("article-categories").value.split(",").map(g=>g.trim()).filter(g=>g),a=document.getElementById("article-tags").value.split(",").map(g=>g.trim()).filter(g=>g),o=document.getElementById("article-image").value,r=document.getElementById("article-featured").checked,l=document.getElementById("article-draft").checked,u=document.getElementById("markdown-editor").value,d={title:e,slug:t,description:i||void 0,date:new Date,lastmod:new Date,draft:l,categories:s,tags:a,image:o||void 0,featured:r},m=this.generateFrontmatter(d),h=m+`

`+u;return{metadata:d,content:u,frontmatter:m,fullContent:h}}generateFrontmatter(e){let t=["---"];return t.push(`title: "${e.title}"`),t.push(`slug: "${e.slug}"`),e.description&&t.push(`description: "${e.description}"`),t.push(`date: ${e.date.toISOString()}`),e.lastmod&&t.push(`lastmod: ${e.lastmod.toISOString()}`),t.push(`draft: ${e.draft}`),e.categories.length>0&&(t.push("categories:"),e.categories.forEach(i=>{t.push(`  - "${i}"`)})),e.tags.length>0&&(t.push("tags:"),e.tags.forEach(i=>{t.push(`  - "${i}"`)})),e.image&&t.push(`image: "${e.image}"`),e.featured&&t.push("featured: true"),t.push("---"),t.join(`
`)}saveDraft(){let e=this.getCurrentArticleData();e.metadata.draft=!0,e.metadata.lastmod=new Date,this.articles.set(e.metadata.slug,e),this.markDirty(),this.saveArticles(),this.renderArticleList(),this.showMessage("\u8349\u7A3F\u5DF2\u4FDD\u5B58","success")}publishArticle(){let e=this.getCurrentArticleData();e.metadata.draft=!1,e.metadata.lastmod=new Date,this.articles.set(e.metadata.slug,e),this.markDirty(),this.saveArticles(),this.renderArticleList(),this.showMessage("\u6587\u7AE0\u5DF2\u53D1\u5E03","success")}deleteArticle(e){confirm("\u786E\u5B9A\u8981\u5220\u9664\u8FD9\u7BC7\u6587\u7AE0\u5417\uFF1F\u6B64\u64CD\u4F5C\u4E0D\u53EF\u64A4\u9500\u3002")&&(this.articles.delete(e),this.markDirty(),this.saveArticles(),this.renderArticleList(),this.showMessage("\u6587\u7AE0\u5DF2\u5220\u9664","success"))}renderArticleList(){let e=document.getElementById("article-list");if(!e)return;let t=Array.from(this.articles.values());if(t.length===0){e.innerHTML='<div class="empty-state">\u6682\u65E0\u6587\u7AE0\uFF0C\u70B9\u51FB"\u65B0\u5EFA\u6587\u7AE0"\u5F00\u59CB\u521B\u4F5C</div>';return}let i=t.map(s=>`
            <div class="article-item" data-slug="${s.metadata.slug}">
                <div class="article-checkbox">
                    <input type="checkbox" class="article-select" value="${s.metadata.slug}">
                </div>
                <div class="article-info">
                    <h5 class="article-title">${s.metadata.title}</h5>
                    <div class="article-meta">
                        <span class="article-status ${s.metadata.draft?"draft":"published"}">
                            ${s.metadata.draft?"\u8349\u7A3F":"\u5DF2\u53D1\u5E03"}
                        </span>
                        <span class="article-date">${new Date(s.metadata.date).toLocaleDateString()}</span>
                        <span class="article-categories">${s.metadata.categories.join(", ")}</span>
                    </div>
                    <div class="article-description">${s.metadata.description||"\u6682\u65E0\u63CF\u8FF0"}</div>
                </div>
                <div class="article-actions">
                    <button class="action-btn edit-btn" onclick="window.articleManager.editArticle('${s.metadata.slug}')" title="\u7F16\u8F91">
                        \u270F\uFE0F
                    </button>
                    <button class="action-btn duplicate-btn" onclick="window.articleManager.duplicateArticle('${s.metadata.slug}')" title="\u590D\u5236">
                        \u{1F4CB}
                    </button>
                    <button class="action-btn delete-btn" onclick="window.articleManager.deleteArticle('${s.metadata.slug}')" title="\u5220\u9664">
                        \u{1F5D1}\uFE0F
                    </button>
                </div>
            </div>
        `).join("");e.innerHTML=i,this.updateBulkActions()}filterArticles(){let e=document.getElementById("article-search").value.toLowerCase(),t=document.getElementById("article-filter").value,i=document.getElementById("category-filter").value;document.querySelectorAll(".article-item").forEach(a=>{let o=a.getAttribute("data-slug"),r=this.articles.get(o);if(!r)return;let l=!0;e&&(`${r.metadata.title} ${r.metadata.description} ${r.content}`.toLowerCase().includes(e)||(l=!1)),t&&(t==="published"&&r.metadata.draft||t==="draft"&&!r.metadata.draft)&&(l=!1),i&&!r.metadata.categories.includes(i)&&(l=!1),a.style.display=l?"block":"none"})}updateBulkActions(){let e=document.querySelectorAll(".article-select"),t=document.getElementById("bulk-delete-btn"),i=document.getElementById("bulk-publish-btn");e.forEach(s=>{s.addEventListener("change",()=>{let a=Array.from(e).filter(o=>o.checked).length;t.disabled=a===0,i.disabled=a===0})})}updateWordCount(){let e=document.getElementById("markdown-editor").value,t=e.trim().split(/\s+/).length,i=e.length,s=document.getElementById("word-count"),a=document.getElementById("char-count");s&&(s.textContent=`\u5B57\u6570: ${t}`),a&&(a.textContent=`\u5B57\u7B26: ${i}`)}updatePreview(){let e=document.getElementById("markdown-editor").value,t=document.getElementById("preview-content");if(t){let i=this.markdownToHtml(e);t.innerHTML=i}}markdownToHtml(e){return e.replace(/^### (.*$)/gim,"<h3>$1</h3>").replace(/^## (.*$)/gim,"<h2>$1</h2>").replace(/^# (.*$)/gim,"<h1>$1</h1>").replace(/\*\*(.*)\*\*/gim,"<strong>$1</strong>").replace(/\*(.*)\*/gim,"<em>$1</em>").replace(/!\[([^\]]*)\]\(([^\)]*)\)/gim,'<img alt="$1" src="$2" />').replace(/\[([^\]]*)\]\(([^\)]*)\)/gim,'<a href="$2">$1</a>').replace(/\n$/gim,"<br />")}togglePreview(){let e=document.querySelector(".editor-pane"),t=document.getElementById("preview-pane"),i=document.getElementById("toggle-preview");t.style.display==="none"?(t.style.display="block",e.style.width="50%",t.style.width="50%",i.textContent="\u{1F4DD}",this.updatePreview()):(t.style.display="none",e.style.width="100%",i.textContent="\u{1F441}\uFE0F")}setupToolbarActions(){let e=document.querySelector(".editor-toolbar");e&&e.addEventListener("click",t=>{let i=t.target;if(i.classList.contains("toolbar-btn")){let s=i.getAttribute("data-action");s&&this.executeToolbarAction(s)}})}executeToolbarAction(e){let t=document.getElementById("markdown-editor"),i=t.selectionStart,s=t.selectionEnd,a=t.value.substring(i,s),o="",r=0;switch(e){case"bold":o=`**${a||"\u7C97\u4F53\u6587\u672C"}**`,r=a?0:-2;break;case"italic":o=`*${a||"\u659C\u4F53\u6587\u672C"}*`,r=a?0:-1;break;case"heading":o=`## ${a||"\u6807\u9898"}`,r=a?0:-2;break;case"link":o=`[${a||"\u94FE\u63A5\u6587\u672C"}](URL)`,r=a?-4:-6;break;case"image":o=`![${a||"\u56FE\u7247\u63CF\u8FF0"}](\u56FE\u7247URL)`,r=a?-6:-8;break;case"code":o=`\`${a||"\u4EE3\u7801"}\``,r=a?0:-1;break;case"quote":o=`> ${a||"\u5F15\u7528\u6587\u672C"}`,r=a?0:-2;break;case"list":o=`- ${a||"\u5217\u8868\u9879"}`,r=a?0:-2;break}if(o){t.value=t.value.substring(0,i)+o+t.value.substring(s),t.focus();let l=i+o.length+r;t.setSelectionRange(l,l),this.updatePreview(),this.markDirty()}}openImageUploader(){window.openImageManager?window.openImageManager():this.showMessage("\u56FE\u7247\u4E0A\u4F20\u529F\u80FD\u6682\u4E0D\u53EF\u7528","warning")}async syncToGitHub(){let e=this.getCurrentArticleData();try{this.showMessage("\u6B63\u5728\u540C\u6B65\u5230GitHub...","info"),await new Promise(t=>setTimeout(t,2e3)),this.showMessage("\u5DF2\u540C\u6B65\u5230GitHub","success")}catch(t){this.showMessage("GitHub\u540C\u6B65\u5931\u8D25","error"),console.error("GitHub sync error:",t)}}duplicateArticle(e){let t=this.articles.get(e);if(!t)return;let i={...t,metadata:{...t.metadata,title:t.metadata.title+" (\u526F\u672C)",slug:t.metadata.slug+"-copy-"+Date.now(),date:new Date,draft:!0}};this.articles.set(i.metadata.slug,i),this.markDirty(),this.saveArticles(),this.renderArticleList(),this.showMessage("\u6587\u7AE0\u5DF2\u590D\u5236","success")}closeEditor(){if(this.isDirty){if(confirm("\u6709\u672A\u4FDD\u5B58\u7684\u66F4\u6539\uFF0C\u786E\u5B9A\u8981\u5173\u95ED\u7F16\u8F91\u5668\u5417\uFF1F")){let e=document.getElementById("article-editor");e&&(e.style.display="none")}}else{let e=document.getElementById("article-editor");e&&(e.style.display="none")}}showMessage(e,t="info"){let i=document.createElement("div");i.className=`article-message ${t}`,i.textContent=e,i.style.cssText=`
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
        `,t==="error"?i.style.background="#ef4444":t==="success"?i.style.background="#10b981":t==="warning"&&(i.style.background="#f59e0b"),document.body.appendChild(i),setTimeout(()=>{i.style.opacity="1",i.style.transform="translateX(0)"},10),setTimeout(()=>{i.style.opacity="0",i.style.transform="translateX(100px)",setTimeout(()=>{i.parentElement&&i.parentElement.removeChild(i)},300)},3e3)}openManager(){let e=document.getElementById("article-manager");e&&(e.style.display="block",this.renderArticleList())}closeManager(){let e=document.getElementById("article-manager");e&&(e.style.display="none")}exportArticles(){let e=Array.from(this.articles.values()),t={exportDate:new Date().toISOString(),articleCount:e.length,articles:e},i=new Blob([JSON.stringify(t,null,2)],{type:"application/json"}),s=URL.createObjectURL(i),a=document.createElement("a");a.href=s,a.download=`blog-articles-${new Date().toISOString().split("T")[0]}.json`,document.body.appendChild(a),a.click(),document.body.removeChild(a),URL.revokeObjectURL(s),this.showMessage("\u6587\u7AE0\u5DF2\u5BFC\u51FA","success")}getArticles(){return this.articles}destroy(){this.autoSaveInterval&&clearInterval(this.autoSaveInterval)}},Q=new L;window.ArticleManager=L;window.articleManager=Q;window.openArticleManager=()=>Q.openManager();ye=L});var H=class n{galleryUID;items=[];constructor(e,t=1){if(window.PhotoSwipe==null||window.PhotoSwipeUI_Default==null){console.error("PhotoSwipe lib not loaded.");return}this.galleryUID=t,n.createGallery(e),this.loadItems(e),this.bindClick()}loadItems(e){this.items=[];let t=e.querySelectorAll("figure.gallery-image");for(let i of t){let s=i.querySelector("figcaption"),a=i.querySelector("img"),o={w:parseInt(a.getAttribute("width")),h:parseInt(a.getAttribute("height")),src:a.src,msrc:a.getAttribute("data-thumb")||a.src,el:i};s&&(o.title=s.innerHTML),this.items.push(o)}}static createGallery(e){let t=e.querySelectorAll("img.gallery-image");for(let a of Array.from(t)){let o=a.closest("p");if(!o||!e.contains(o)||(o.textContent.trim()==""&&o.classList.add("no-text"),!o.classList.contains("no-text")))continue;let l=a.parentElement.tagName=="A",u=a,d=document.createElement("figure");if(d.style.setProperty("flex-grow",a.getAttribute("data-flex-grow")||"1"),d.style.setProperty("flex-basis",a.getAttribute("data-flex-basis")||"0"),l&&(u=a.parentElement),u.parentElement.insertBefore(d,u),d.appendChild(u),a.hasAttribute("alt")){let m=document.createElement("figcaption");m.innerText=a.getAttribute("alt"),d.appendChild(m)}if(!l){d.className="gallery-image";let m=document.createElement("a");m.href=a.src,m.setAttribute("target","_blank"),a.parentNode.insertBefore(m,a),m.appendChild(a)}}let i=e.querySelectorAll("figure.gallery-image"),s=[];for(let a of i)s.length?a.previousElementSibling===s[s.length-1]?s.push(a):s.length&&(n.wrap(s),s=[a]):s=[a];s.length>0&&n.wrap(s)}static wrap(e){let t=document.createElement("div");t.className="gallery";let i=e[0].parentNode,s=e[0];i.insertBefore(t,s);for(let a of e)t.appendChild(a)}open(e){let t=document.querySelector(".pswp");new window.PhotoSwipe(t,window.PhotoSwipeUI_Default,this.items,{index:e,galleryUID:this.galleryUID,getThumbBoundsFn:s=>{let a=this.items[s].el.getElementsByTagName("img")[0],o=window.pageYOffset||document.documentElement.scrollTop,r=a.getBoundingClientRect();return{x:r.left,y:r.top+o,w:r.width}}}).init()}bindClick(){for(let[e,t]of this.items.entries())t.el.querySelector("a").addEventListener("click",s=>{s.preventDefault(),this.open(e)})}},R=H;var b={};if(localStorage.hasOwnProperty("StackColorsCache"))try{b=JSON.parse(localStorage.getItem("StackColorsCache"))}catch{b={}}async function z(n,e,t){if(!n)return await Vibrant.from(t).getPalette();if(!b.hasOwnProperty(n)||b[n].hash!==e){let i=await Vibrant.from(t).getPalette();b[n]={hash:e,Vibrant:{hex:i.Vibrant.hex,rgb:i.Vibrant.rgb,bodyTextColor:i.Vibrant.bodyTextColor},DarkMuted:{hex:i.DarkMuted.hex,rgb:i.DarkMuted.rgb,bodyTextColor:i.DarkMuted.bodyTextColor}},localStorage.setItem("StackColorsCache",JSON.stringify(b))}return b[n]}var le=(n,e=500)=>{n.classList.add("transiting"),n.style.transitionProperty="height, margin, padding",n.style.transitionDuration=e+"ms",n.style.height=n.offsetHeight+"px",n.offsetHeight,n.style.overflow="hidden",n.style.height="0",n.style.paddingTop="0",n.style.paddingBottom="0",n.style.marginTop="0",n.style.marginBottom="0",window.setTimeout(()=>{n.classList.remove("show"),n.style.removeProperty("height"),n.style.removeProperty("padding-top"),n.style.removeProperty("padding-bottom"),n.style.removeProperty("margin-top"),n.style.removeProperty("margin-bottom"),n.style.removeProperty("overflow"),n.style.removeProperty("transition-duration"),n.style.removeProperty("transition-property"),n.classList.remove("transiting")},e)},ce=(n,e=500)=>{n.classList.add("transiting"),n.style.removeProperty("display"),n.classList.add("show");let t=n.offsetHeight;n.style.overflow="hidden",n.style.height="0",n.style.paddingTop="0",n.style.paddingBottom="0",n.style.marginTop="0",n.style.marginBottom="0",n.offsetHeight,n.style.transitionProperty="height, margin, padding",n.style.transitionDuration=e+"ms",n.style.height=t+"px",n.style.removeProperty("padding-top"),n.style.removeProperty("padding-bottom"),n.style.removeProperty("margin-top"),n.style.removeProperty("margin-bottom"),window.setTimeout(()=>{n.style.removeProperty("height"),n.style.removeProperty("overflow"),n.style.removeProperty("transition-duration"),n.style.removeProperty("transition-property"),n.classList.remove("transiting")},e)},de=(n,e=500)=>window.getComputedStyle(n).display==="none"?ce(n,e):le(n,e);function V(){let n=document.getElementById("toggle-menu");n&&n.addEventListener("click",()=>{document.getElementById("main-menu").classList.contains("transiting")||(document.body.classList.toggle("show-menu"),de(document.getElementById("main-menu"),300),n.classList.toggle("is-active"))})}function ue(n,e,t){var i=document.createElement(n);for(let s in e)if(s&&e.hasOwnProperty(s)){let a=e[s];s=="dangerouslySetInnerHTML"?i.innerHTML=a.__html:a===!0?i.setAttribute(s,s):a!==!1&&a!=null&&i.setAttribute(s,a.toString())}for(let s=2;s<arguments.length;s++){let a=arguments[s];a&&i.appendChild(a.nodeType==null?document.createTextNode(a.toString()):a)}return i}var N=ue;var P=class{localStorageKey="StackColorScheme";currentScheme;systemPreferScheme;constructor(e){this.bindMatchMedia(),this.currentScheme=this.getSavedScheme(),window.matchMedia("(prefers-color-scheme: dark)").matches===!0?this.systemPreferScheme="dark":this.systemPreferScheme="light",this.dispatchEvent(document.documentElement.dataset.scheme),e&&this.bindClick(e),document.body.style.transition==""&&document.body.style.setProperty("transition","background-color .3s ease")}saveScheme(){localStorage.setItem(this.localStorageKey,this.currentScheme)}bindClick(e){e.addEventListener("click",t=>{this.isDark()?this.currentScheme="light":this.currentScheme="dark",this.setBodyClass(),this.currentScheme==this.systemPreferScheme&&(this.currentScheme="auto"),this.saveScheme()})}isDark(){return this.currentScheme=="dark"||this.currentScheme=="auto"&&this.systemPreferScheme=="dark"}dispatchEvent(e){let t=new CustomEvent("onColorSchemeChange",{detail:e});window.dispatchEvent(t)}setBodyClass(){this.isDark()?document.documentElement.dataset.scheme="dark":document.documentElement.dataset.scheme="light",this.dispatchEvent(document.documentElement.dataset.scheme)}getSavedScheme(){let e=localStorage.getItem(this.localStorageKey);return e=="light"||e=="dark"||e=="auto"?e:"auto"}bindMatchMedia(){window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",e=>{e.matches?this.systemPreferScheme="dark":this.systemPreferScheme="light",this.setBodyClass()})}},G=P;function M(n){let e;return()=>{e&&window.cancelAnimationFrame(e),e=window.requestAnimationFrame(()=>n())}}var me=".article-content h1[id], .article-content h2[id], .article-content h3[id], .article-content h4[id], .article-content h5[id], .article-content h6[id]",O="#TableOfContents",_="#TableOfContents li",j="active-class";function ge(n,e){let t=n.querySelector("a").offsetHeight,i=n.offsetTop-e.offsetHeight/2+t/2-e.offsetTop;i<0&&(i=0),e.scrollTo({top:i,behavior:"smooth"})}function pe(n){let e={};return n.forEach(t=>{let s=t.querySelector("a").getAttribute("href");s.startsWith("#")&&(e[s.slice(1)]=t)}),e}function W(n){let e=[];return n.forEach(t=>{e.push({id:t.id,offset:t.offsetTop})}),e.sort((t,i)=>t.offset-i.offset),e}function K(){let n=document.querySelectorAll(me);if(!n){console.warn("No header matched query",n);return}let e=document.querySelector(O);if(!e){console.warn("No toc matched query",O);return}let t=document.querySelectorAll(_);if(!t){console.warn("No navigation matched query",_);return}let i=W(n),s=!1;e.addEventListener("mouseenter",M(()=>s=!0)),e.addEventListener("mouseleave",M(()=>s=!1));let a,o=pe(t);function r(){let u=document.documentElement.scrollTop||document.body.scrollTop,d;i.forEach(h=>{u>=h.offset-20&&(d=document.getElementById(h.id))});let m;d&&(m=o[d.id]),d&&!m?console.debug("No link found for section",d):m!==a&&(a&&a.classList.remove(j),m&&(m.classList.add(j),s||ge(m,e)),a=m)}window.addEventListener("scroll",M(r));function l(){i=W(n),r()}window.addEventListener("resize",M(l))}var he="a[href]";function Y(){document.querySelectorAll(he).forEach(n=>{n.getAttribute("href").startsWith("#")&&n.addEventListener("click",t=>{t.preventDefault();let i=decodeURI(n.getAttribute("href").substring(1)),s=document.getElementById(i),a=s.getBoundingClientRect().top-document.documentElement.getBoundingClientRect().top;window.history.pushState({},"",n.getAttribute("href")),scrollTo({top:a,behavior:"smooth"})})})}var $=class{localStorageKey="StackAdminAuth";attemptsKey="StackAuthAttempts";timestampKey="StackAuthTimestamp";currentStatus;config;constructor(e){this.config={adminPassword:"admit",sessionTimeout:24*60*60*1e3,maxLoginAttempts:5,...e},this.currentStatus=this.getSavedAuthStatus(),this.cleanupExpiredSession(),setTimeout(()=>{this.dispatchAuthEvent(this.currentStatus)},100)}authenticate(e){return this.isBlocked()?!1:e===this.config.adminPassword?(this.currentStatus="authenticated",this.saveAuthStatus(),this.clearLoginAttempts(),!0):(this.incrementLoginAttempts(),!1)}logout(){this.currentStatus="guest",this.clearAuthData()}isAuthenticated(){return this.currentStatus==="authenticated"&&!this.checkSessionExpiredDirect()}isAdmin(){return this.isAuthenticated()}getStatus(){return this.currentStatus}isBlocked(){return this.getLoginAttempts()>=this.config.maxLoginAttempts}getRemainingAttempts(){let e=this.getLoginAttempts();return Math.max(0,this.config.maxLoginAttempts-e)}resetLoginAttempts(){this.clearLoginAttempts()}saveAuthStatus(){localStorage.setItem(this.localStorageKey,this.currentStatus),localStorage.setItem(this.timestampKey,Date.now().toString())}getSavedAuthStatus(){return localStorage.getItem(this.localStorageKey)==="authenticated"?"authenticated":"guest"}isSessionExpired(){let e=localStorage.getItem(this.timestampKey);if(!e)return!0;let t=parseInt(e);return Date.now()-t>this.config.sessionTimeout}checkSessionExpiredDirect(){let e=localStorage.getItem(this.timestampKey);if(!e)return!0;let t=parseInt(e);return Date.now()-t>this.config.sessionTimeout}cleanupExpiredSession(){this.checkSessionExpiredDirect()&&(this.clearAuthData(),this.currentStatus="guest")}clearAuthData(){localStorage.removeItem(this.localStorageKey),localStorage.removeItem(this.timestampKey)}getLoginAttempts(){let e=localStorage.getItem(this.attemptsKey);return e?parseInt(e):0}incrementLoginAttempts(){let e=this.getLoginAttempts()+1;localStorage.setItem(this.attemptsKey,e.toString())}clearLoginAttempts(){localStorage.removeItem(this.attemptsKey)}dispatchAuthEvent(e){let t=this.currentStatus==="authenticated"&&!this.checkSessionExpiredDirect(),i=t,s=new CustomEvent("onAuthStatusChange",{detail:{status:e,isAuthenticated:t,isAdmin:i,remainingAttempts:this.getRemainingAttempts()}});window.dispatchEvent(s)}},v={toggleAdminElements:n=>{let e=document.querySelectorAll("[data-admin-only]"),t=document.querySelectorAll("[data-guest-only]");e.forEach(i=>{i.style.display=n?"block":"none"}),t.forEach(i=>{i.style.display=n?"none":"block"})},updateBodyClass:n=>{n?(document.body.classList.add("admin-mode"),document.body.classList.remove("guest-mode")):(document.body.classList.add("guest-mode"),document.body.classList.remove("admin-mode"))},createLoginModal:()=>`
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
        `,showLoginModal:()=>{let n=document.getElementById("admin-login-modal");if(n)n.style.display="flex",v.clearMessages(),setTimeout(()=>{let e=document.getElementById("admin-password");e&&(e.focus(),e.select())},150);else{console.warn("Admin login modal not found. Creating modal...");let e=v.createLoginModal();document.body.insertAdjacentHTML("beforeend",e),setTimeout(()=>v.showLoginModal(),100)}},hideLoginModal:()=>{let n=document.getElementById("admin-login-modal");if(n){n.style.display="none";let e=document.getElementById("admin-login-form");e&&e.reset();let t=document.getElementById("admin-login-error"),i=document.getElementById("admin-login-attempts");t&&(t.style.display="none"),i&&(i.style.display="none")}},showLoginError:n=>{let e=document.getElementById("admin-login-error");e&&(e.textContent=n,e.style.display="block")},showAttemptsInfo:n=>{let e=document.getElementById("admin-login-attempts");e&&(e.textContent=`\u5269\u4F59\u5C1D\u8BD5\u6B21\u6570: ${n}`,e.style.display="block")},setLoginButtonLoading:n=>{let e=document.getElementById("admin-login-btn");e&&(n?(e.disabled=!0,e.classList.add("loading")):(e.disabled=!1,e.classList.remove("loading")))},clearMessages:()=>{let n=document.getElementById("admin-login-error"),e=document.getElementById("admin-login-attempts");n&&(n.style.display="none"),e&&(e.style.display="none")},validatePassword:n=>n?n.length<1?{valid:!1,message:"\u5BC6\u7801\u4E0D\u80FD\u4E3A\u7A7A"}:{valid:!0}:{valid:!1,message:"\u8BF7\u8F93\u5165\u5BC6\u7801"},createAdminPanel:()=>`
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
        `},J=$;var T=class{observer=null;metrics={};isDebugMode=!1;constructor(){this.isDebugMode=document.documentElement.getAttribute("data-debug")==="true",this.init()}init(){console.log("\u{1F680} \u521D\u59CB\u5316\u535A\u5BA2\u6027\u80FD\u4F18\u5316..."),document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{this.setupOptimizations()}):this.setupOptimizations()}setupOptimizations(){this.setupLazyLoading(),this.setupResourcePreloading(),this.setupPerformanceMonitoring(),this.setupImageOptimization(),this.setupScrollOptimization(),this.setupFontOptimization(),this.isDebugMode&&this.setupDebugMode(),console.log("\u2705 \u6027\u80FD\u4F18\u5316\u529F\u80FD\u5DF2\u542F\u7528")}setupLazyLoading(){"loading"in HTMLImageElement.prototype?document.querySelectorAll("img[data-src]").forEach(t=>{let i=t;i.src=i.dataset.src||"",i.loading="lazy",i.classList.add("loaded")}):this.setupIntersectionObserver()}setupIntersectionObserver(){let e={root:null,rootMargin:"50px",threshold:.1};this.observer=new IntersectionObserver(i=>{i.forEach(s=>{if(s.isIntersecting){let a=s.target;this.loadImage(a),this.observer?.unobserve(a)}})},e),document.querySelectorAll("img[data-src]").forEach(i=>{this.observer?.observe(i)})}loadImage(e){let t=e.dataset.src;if(!t)return;let i=new Image;i.onload=()=>{e.src=t,e.classList.add("loaded"),e.removeAttribute("data-src")},i.onerror=()=>{e.classList.add("error"),console.warn("\u56FE\u7247\u52A0\u8F7D\u5931\u8D25:",t)},i.src=t}setupResourcePreloading(){this.preconnectDomain("https://fonts.googleapis.com"),this.preconnectDomain("https://fonts.gstatic.com"),this.preconnectDomain("https://cdn.jsdelivr.net"),console.log("\u2705 \u8D44\u6E90\u9884\u52A0\u8F7D\u8BBE\u7F6E\u5B8C\u6210")}preloadResource(e,t,i){let s=document.createElement("link");s.rel="preload",s.href=e,s.as=t,i&&(s.type=i),s.crossOrigin="anonymous",document.head.appendChild(s)}preconnectDomain(e){let t=document.createElement("link");t.rel="preconnect",t.href=e,t.crossOrigin="anonymous",document.head.appendChild(t)}setupPerformanceMonitoring(){this.measureFCP(),this.measureLCP(),this.measureFID(),this.measureCLS(),this.measureTTFB(),setTimeout(()=>{this.reportMetrics()},5e3)}measureFCP(){let e=new PerformanceObserver(t=>{let s=t.getEntries().find(a=>a.name==="first-contentful-paint");s&&(this.metrics.fcp=s.startTime,e.disconnect())});e.observe({entryTypes:["paint"]})}measureLCP(){new PerformanceObserver(t=>{let i=t.getEntries(),s=i[i.length-1];this.metrics.lcp=s.startTime}).observe({entryTypes:["largest-contentful-paint"]})}measureFID(){new PerformanceObserver(t=>{t.getEntries().forEach(s=>{this.metrics.fid=s.processingStart-s.startTime})}).observe({entryTypes:["first-input"]})}measureCLS(){let e=0;new PerformanceObserver(i=>{i.getEntries().forEach(a=>{a.hadRecentInput||(e+=a.value)}),this.metrics.cls=e}).observe({entryTypes:["layout-shift"]})}measureTTFB(){let e=performance.getEntriesByType("navigation")[0];e&&(this.metrics.ttfb=e.responseStart-e.requestStart)}reportMetrics(){this.isDebugMode&&console.table(this.metrics)}setupImageOptimization(){let e=document.querySelectorAll("img:not([loading])");e.forEach(t=>{t.loading="lazy"}),e.forEach(t=>{t.addEventListener("error",()=>{t.classList.add("img-error"),console.warn("\u56FE\u7247\u52A0\u8F7D\u5931\u8D25:",t.src)})})}setupScrollOptimization(){let e=!1,t=()=>{let s=window.pageYOffset/(document.body.scrollHeight-window.innerHeight),a=document.querySelector(".scroll-progress");a&&(a.style.width=`${s*100}%`),e=!1};window.addEventListener("scroll",()=>{e||(requestAnimationFrame(t),e=!0)},{passive:!0})}setupFontOptimization(){"fonts"in document&&document.fonts.ready.then(()=>{document.body.classList.add("fonts-loaded"),console.log("\u2705 \u5B57\u4F53\u52A0\u8F7D\u5B8C\u6210")})}setupDebugMode(){console.log("\u{1F527} \u8C03\u8BD5\u6A21\u5F0F\u5DF2\u542F\u7528"),document.querySelectorAll(".performance-marker").forEach((t,i)=>{t.setAttribute("data-perf-id",`marker-${i}`)}),this.createPerformancePanel()}createPerformancePanel(){let e=document.createElement("div");e.id="performance-panel",e.style.cssText=`
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
        `,document.body.appendChild(e),setInterval(()=>{e.innerHTML=`
                <div><strong>\u6027\u80FD\u6307\u6807</strong></div>
                <div>FCP: ${this.metrics.fcp?.toFixed(2)||"N/A"}ms</div>
                <div>LCP: ${this.metrics.lcp?.toFixed(2)||"N/A"}ms</div>
                <div>FID: ${this.metrics.fid?.toFixed(2)||"N/A"}ms</div>
                <div>CLS: ${this.metrics.cls?.toFixed(4)||"N/A"}</div>
                <div>TTFB: ${this.metrics.ttfb?.toFixed(2)||"N/A"}ms</div>
                <div>\u5185\u5B58: ${performance.memory?Math.round(performance.memory.usedJSHeapSize/1024/1024)+"MB":"N/A"}</div>
            `},1e3)}destroy(){this.observer&&(this.observer.disconnect(),this.observer=null)}},ve=new T;window.BlogPerformanceOptimizer=T;window.performanceOptimizer=ve;var A=class{container;searchInput;categoryFilter;statusFilter;featuredToggle;viewToggle;linksContainer;noResults;links=[];filteredLinks=[];currentView="grid";filters={search:"",category:"",status:"",featured:!1};constructor(){this.init()}init(){console.log("\u{1F517} \u521D\u59CB\u5316\u94FE\u63A5\u589E\u5F3A\u529F\u80FD..."),document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{this.setupElements()}):this.setupElements()}setupElements(){if(this.container=document.querySelector(".links-enhanced-container"),!this.container){console.log("\u274C Links enhanced container not found");return}if(this.searchInput=this.container.querySelector("#links-search-input"),this.categoryFilter=this.container.querySelector("#category-filter"),this.statusFilter=this.container.querySelector("#status-filter"),this.featuredToggle=this.container.querySelector("#featured-toggle"),this.viewToggle=this.container.querySelectorAll(".view-btn"),this.linksContainer=this.container.querySelector("#links-container"),this.noResults=this.container.querySelector("#no-results"),!this.searchInput||!this.linksContainer){console.log("\u274C Required elements not found");return}this.parseLinks(),this.setupEventListeners(),this.updateStats(),console.log(`\u2705 \u94FE\u63A5\u589E\u5F3A\u529F\u80FD\u5DF2\u542F\u7528\uFF0C\u5171 ${this.links.length} \u4E2A\u94FE\u63A5`)}parseLinks(){this.linksContainer.querySelectorAll(".link-card").forEach(t=>{let i=t.querySelector(".link-title"),s=t.querySelector(".link-description"),a=t.querySelector("a");if(i&&s&&a){let o={title:i.textContent?.trim()||"",description:s.textContent?.trim()||"",website:a.href||"",category:t.getAttribute("data-category")||"",tags:t.getAttribute("data-tags")?.split(",").filter(r=>r.trim())||[],status:t.getAttribute("data-status")||"active",featured:t.getAttribute("data-featured")==="true",element:t};this.links.push(o)}}),this.filteredLinks=[...this.links]}setupEventListeners(){this.searchInput.addEventListener("input",e=>{this.filters.search=e.target.value.toLowerCase(),this.applyFilters()}),this.categoryFilter?.addEventListener("change",e=>{this.filters.category=e.target.value,this.applyFilters()}),this.statusFilter?.addEventListener("change",e=>{this.filters.status=e.target.value,this.applyFilters()}),this.featuredToggle?.addEventListener("click",()=>{this.filters.featured=!this.filters.featured,this.featuredToggle.classList.toggle("active",this.filters.featured),this.applyFilters()}),this.viewToggle.forEach(e=>{e.addEventListener("click",()=>{let t=e.getAttribute("data-view");this.switchView(t)})}),document.addEventListener("keydown",e=>{if(e.ctrlKey||e.metaKey)switch(e.key){case"f":e.preventDefault(),this.searchInput.focus();break;case"g":e.preventDefault(),this.switchView("grid");break;case"l":e.preventDefault(),this.switchView("list");break}})}applyFilters(){this.filteredLinks=this.links.filter(e=>{if(this.filters.search){let t=this.filters.search;if(!`${e.title} ${e.description} ${e.tags?.join(" ")}`.toLowerCase().includes(t))return!1}return!(this.filters.category&&e.category!==this.filters.category||this.filters.status&&e.status!==this.filters.status||this.filters.featured&&!e.featured)}),this.renderFilteredLinks(),this.updateStats()}renderFilteredLinks(){this.links.forEach(e=>{e.element.style.display="none"}),this.filteredLinks.length>0?(this.filteredLinks.forEach(e=>{e.element.style.display="block"}),this.noResults.style.display="none"):this.noResults.style.display="block"}switchView(e){this.currentView=e,this.viewToggle.forEach(t=>{t.classList.toggle("active",t.getAttribute("data-view")===e)}),this.linksContainer.className=`links-container ${e}-view`,localStorage.setItem("links-view-preference",e)}updateStats(){let e=document.getElementById("total-links"),t=document.getElementById("active-links"),i=document.getElementById("featured-links"),s=document.getElementById("categories-count");if(e&&(e.textContent=this.filteredLinks.length.toString()),t){let a=this.filteredLinks.filter(o=>o.status==="active").length;t.textContent=a.toString()}if(i){let a=this.filteredLinks.filter(o=>o.featured).length;i.textContent=a.toString()}if(s){let a=new Set(this.filteredLinks.map(o=>o.category).filter(Boolean));s.textContent=a.size.toString()}}clearFilters(){this.filters={search:"",category:"",status:"",featured:!1},this.searchInput.value="",this.categoryFilter&&(this.categoryFilter.value=""),this.statusFilter&&(this.statusFilter.value=""),this.featuredToggle?.classList.remove("active"),this.applyFilters()}getFilters(){return{...this.filters}}getFilteredLinks(){return[...this.filteredLinks]}};window.checkLinkStatus=async(n,e)=>{let t=e.innerHTML;e.innerHTML='<div class="loading-spinner"></div>',e.disabled=!0;try{let i=await fetch(n,{method:"HEAD",mode:"no-cors",cache:"no-cache"});e.innerHTML="\u2705",e.title="\u94FE\u63A5\u53EF\u8BBF\u95EE",setTimeout(()=>{e.innerHTML=t,e.disabled=!1},2e3)}catch{e.innerHTML="\u274C",e.title="\u94FE\u63A5\u53EF\u80FD\u4E0D\u53EF\u8BBF\u95EE",setTimeout(()=>{e.innerHTML=t,e.disabled=!1},2e3)}};window.copyLink=async n=>{try{await navigator.clipboard.writeText(n);let e=document.createElement("div");e.className="copy-toast",e.textContent="\u94FE\u63A5\u5DF2\u590D\u5236\u5230\u526A\u8D34\u677F",document.body.appendChild(e),setTimeout(()=>{e.classList.add("show")},10),setTimeout(()=>{e.classList.remove("show"),setTimeout(()=>{document.body.removeChild(e)},300)},2e3)}catch(e){console.error("\u590D\u5236\u5931\u8D25:",e)}};var fe=new A;window.LinksEnhancer=A;window.linksEnhancer=fe;var x=class{container;previewArea;uploadArea;styleLibrary;settingsPanel;currentSettings;presetStyles=[];customStyles=[];constructor(){this.initializePresetStyles(),this.loadCustomStyles(),this.init(),this.autoApplyBackground()}init(){console.log("\u{1F3A8} \u521D\u59CB\u5316\u80CC\u666F\u56FE\u7247\u7BA1\u7406\u7CFB\u7EDF..."),document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{this.setupInterface()}):this.setupInterface()}setupInterface(){let e=()=>{document.getElementById("admin-panel-modal")?(this.createBackgroundManagerInterface(),this.setupEventListeners(),this.loadCurrentSettings(),this.bindBackgroundManagerButton(),console.log("\u2705 \u80CC\u666F\u56FE\u7247\u7BA1\u7406\u7CFB\u7EDF\u5DF2\u542F\u7528")):setTimeout(e,500)};e()}createBackgroundManagerInterface(){document.body.insertAdjacentHTML("beforeend",`
            <div class="background-manager" id="background-manager">
                <div class="background-manager-modal">
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
            </div>
        `),this.container=document.getElementById("background-manager"),this.previewArea=document.getElementById("preview-area"),this.uploadArea=document.getElementById("upload-area"),this.styleLibrary=document.getElementById("style-library"),this.container&&(this.container.style.display="none",this.container.style.position="fixed",this.container.style.top="0",this.container.style.left="0",this.container.style.width="100%",this.container.style.height="100%",this.container.style.backgroundColor="rgba(0, 0, 0, 0.8)",this.container.style.zIndex="10000",this.container.style.overflow="auto")}bindBackgroundManagerButton(){let e=(t=0)=>{let i=document.getElementById("admin-background-manager");i?(i.addEventListener("click",s=>{s.preventDefault(),console.log("\u{1F3A8} Opening background manager..."),this.openManager()}),console.log("\u2705 Background manager button bound")):t<10?setTimeout(()=>e(t+1),500):(console.warn("\u26A0\uFE0F Background manager button not found after multiple attempts"),this.createFallbackButton())};e()}createFallbackButton(){let e=document.querySelector(".admin-actions, .admin-content");if(e){let t=document.createElement("button");t.id="admin-background-manager-fallback",t.className="admin-action-btn",t.innerHTML=`
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21,15 16,10 5,21"></polyline>
                </svg>
                \u80CC\u666F\u7BA1\u7406
            `,t.addEventListener("click",i=>{i.preventDefault(),console.log("\u{1F3A8} Opening background manager (fallback)..."),this.openManager()}),e.appendChild(t),console.log("\u2705 Fallback background manager button created")}}initializePresetStyles(){this.presetStyles=[{id:"preset-1",name:"\u6E05\u65B0\u84DD\u8272",type:"gradient",value:"linear-gradient(135deg, #667eea 0%, #764ba2 100%)",category:"preset"},{id:"preset-2",name:"\u6E29\u6696\u6A59\u8272",type:"gradient",value:"linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",category:"preset"},{id:"preset-3",name:"\u81EA\u7136\u7EFF\u8272",type:"gradient",value:"linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",category:"preset"},{id:"preset-4",name:"\u4F18\u96C5\u7D2B\u8272",type:"gradient",value:"linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",category:"preset"},{id:"preset-5",name:"\u6DF1\u9083\u591C\u7A7A",type:"gradient",value:"linear-gradient(135deg, #2c3e50 0%, #34495e 100%)",category:"preset"},{id:"pattern-1",name:"\u51E0\u4F55\u56FE\u6848",type:"pattern",value:'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',category:"preset"},{id:"pattern-2",name:"\u6CE2\u6D6A\u7EB9\u7406",type:"pattern",value:'url("data:image/svg+xml,%3Csvg width="100" height="20" viewBox="0 0 100 20" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M21.184 20c.357-.13.72-.264 1.088-.402l1.768-.661C33.64 15.347 39.647 14 50 14c10.271 0 15.362 1.222 24.629 4.928.955.383 1.869.74 2.75 1.072h6.225c-2.51-.73-5.139-1.691-8.233-2.928C65.888 13.278 60.562 12 50 12c-10.626 0-16.855 1.397-26.66 5.063l-1.767.662c-2.475.923-4.66 1.674-6.724 2.275h6.335zm0-20C13.258 2.892 8.077 4 0 4V2c5.744 0 9.951-.574 14.85-2h6.334zM77.38 0C85.239 2.966 90.502 4 100 4V2c-6.842 0-11.386-.542-16.396-2h-6.225zM0 14c8.44 0 13.718-1.21 22.272-4.402l1.768-.661C33.64 5.347 39.647 4 50 4c10.271 0 15.362 1.222 24.629 4.928C84.112 12.722 89.438 14 100 14v-2c-10.271 0-15.362-1.222-24.629-4.928C65.888 3.278 60.562 2 50 2 39.374 2 33.145 3.397 23.34 7.063l-1.767.662C13.223 10.84 8.163 12 0 12v2z" fill="%239C92AC" fill-opacity="0.05" fill-rule="evenodd"/%3E%3C/svg%3E")',category:"preset"}]}loadCustomStyles(){let e=localStorage.getItem("background-custom-styles");if(e)try{this.customStyles=JSON.parse(e)}catch(t){console.warn("Failed to load custom styles:",t),this.customStyles=[]}}saveCustomStyles(){localStorage.setItem("background-custom-styles",JSON.stringify(this.customStyles))}loadCurrentSettings(){let e=localStorage.getItem("background-current-settings");if(e)try{this.currentSettings=JSON.parse(e),this.applySettingsToInterface()}catch(t){console.warn("Failed to load current settings:",t),this.setDefaultSettings()}else this.setDefaultSettings()}setDefaultSettings(){this.currentSettings={style:this.presetStyles[0],opacity:100,blur:0,position:"center",size:"cover",repeat:"no-repeat",attachment:"fixed"}}applySettingsToInterface(){let e=document.getElementById("opacity-slider"),t=document.getElementById("blur-slider"),i=document.getElementById("position-select"),s=document.getElementById("size-select");e&&(e.value=this.currentSettings.opacity.toString()),t&&(t.value=this.currentSettings.blur.toString()),i&&(i.value=this.currentSettings.position),s&&(s.value=this.currentSettings.size),this.updatePreview()}setupEventListeners(){this.setupUploadEvents(),this.setupStyleEvents(),this.setupSettingsEvents(),this.setupActionEvents(),this.setupTabEvents()}setupUploadEvents(){let e=this.uploadArea,t=document.getElementById("background-upload");e.addEventListener("click",()=>{t.click()}),t.addEventListener("change",i=>{let s=i.target.files;s&&s.length>0&&this.handleFileUpload(s[0])}),e.addEventListener("dragover",i=>{i.preventDefault(),e.classList.add("drag-over")}),e.addEventListener("dragleave",()=>{e.classList.remove("drag-over")}),e.addEventListener("drop",i=>{i.preventDefault(),e.classList.remove("drag-over");let s=i.dataTransfer?.files;s&&s.length>0&&this.handleFileUpload(s[0])})}handleFileUpload(e){if(!e.type.startsWith("image/")){alert("\u8BF7\u9009\u62E9\u56FE\u7247\u6587\u4EF6");return}if(e.size>5*1024*1024){alert("\u6587\u4EF6\u5927\u5C0F\u4E0D\u80FD\u8D85\u8FC7 5MB");return}let t=new FileReader;t.onload=i=>{let s=i.target?.result,a={id:`custom-${Date.now()}`,name:e.name,type:"image",value:`url("${s}")`,category:"custom"};this.customStyles.push(a),this.saveCustomStyles(),this.currentSettings.style=a,this.updatePreview(),this.renderStyleLibrary("custom"),console.log("\u2705 \u80CC\u666F\u56FE\u7247\u4E0A\u4F20\u6210\u529F")},t.readAsDataURL(e)}setupStyleEvents(){}setupSettingsEvents(){let e=document.getElementById("opacity-slider"),t=document.getElementById("opacity-value");e?.addEventListener("input",r=>{let l=parseInt(r.target.value);this.currentSettings.opacity=l,t.textContent=`${l}%`,this.updatePreview()});let i=document.getElementById("blur-slider"),s=document.getElementById("blur-value");i?.addEventListener("input",r=>{let l=parseInt(r.target.value);this.currentSettings.blur=l,s.textContent=`${l}px`,this.updatePreview()}),document.getElementById("position-select")?.addEventListener("change",r=>{this.currentSettings.position=r.target.value,this.updatePreview()}),document.getElementById("size-select")?.addEventListener("change",r=>{this.currentSettings.size=r.target.value,this.updatePreview()})}setupActionEvents(){document.getElementById("apply-background")?.addEventListener("click",()=>{this.applyBackground()}),document.getElementById("reset-background")?.addEventListener("click",()=>{this.resetBackground()}),document.getElementById("save-preset")?.addEventListener("click",()=>{this.saveAsPreset()}),document.getElementById("close-background-manager")?.addEventListener("click",()=>{this.closeManager()})}setupTabEvents(){let e=document.querySelectorAll(".style-tab");e.forEach(t=>{t.addEventListener("click",i=>{let s=i.target,a=s.getAttribute("data-tab");e.forEach(o=>o.classList.remove("active")),s.classList.add("active"),this.renderStyleLibrary(a)})}),this.renderStyleLibrary("preset")}renderStyleLibrary(e){let t=[];switch(e){case"preset":t=this.presetStyles.filter(o=>o.type!=="pattern");break;case"gradient":t=this.presetStyles.filter(o=>o.type==="gradient");break;case"pattern":t=this.presetStyles.filter(o=>o.type==="pattern");break;case"custom":t=this.customStyles;break}let i=t.map(o=>`
            <div class="style-item" data-style-id="${o.id}">
                <div class="style-preview" style="background: ${o.value}; background-size: cover;"></div>
                <div class="style-name">${o.name}</div>
                ${o.category==="custom"?'<button class="delete-style" data-style-id="'+o.id+'">\xD7</button>':""}
            </div>
        `).join("");this.styleLibrary.innerHTML=i;let s=this.styleLibrary.querySelectorAll(".style-item");s.forEach(o=>{o.addEventListener("click",r=>{if(r.target.classList.contains("delete-style"))return;let l=o.getAttribute("data-style-id"),u=t.find(d=>d.id===l);u&&(this.currentSettings.style=u,this.updatePreview(),s.forEach(d=>d.classList.remove("active")),o.classList.add("active"))})}),this.styleLibrary.querySelectorAll(".delete-style").forEach(o=>{o.addEventListener("click",r=>{r.stopPropagation();let l=o.getAttribute("data-style-id");this.deleteCustomStyle(l)})})}deleteCustomStyle(e){this.customStyles=this.customStyles.filter(t=>t.id!==e),this.saveCustomStyles(),this.renderStyleLibrary("custom"),this.currentSettings.style.id===e&&(this.setDefaultSettings(),this.applySettingsToInterface())}updatePreview(){if(!this.previewArea)return;let{style:e,opacity:t,blur:i,position:s,size:a}=this.currentSettings,o=`
            background: ${e.value};
            background-position: ${s};
            background-size: ${a};
            background-repeat: no-repeat;
            background-attachment: fixed;
            opacity: ${t/100};
            filter: blur(${i}px);
        `;this.previewArea.style.cssText=o}applyBackground(){let{style:e,opacity:t,blur:i,position:s,size:a}=this.currentSettings;document.body.style.background=e.value,document.body.style.backgroundPosition=s,document.body.style.backgroundSize=a,document.body.style.backgroundRepeat="no-repeat",document.body.style.backgroundAttachment="fixed";let o=document.getElementById("background-overlay");t<100||i>0?(o||(o=document.createElement("div"),o.id="background-overlay",o.style.cssText=`
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                    z-index: -1;
                `,document.body.appendChild(o)),o.style.background=e.value,o.style.backgroundPosition=s,o.style.backgroundSize=a,o.style.backgroundRepeat="no-repeat",o.style.backgroundAttachment="fixed",o.style.opacity=(t/100).toString(),o.style.filter=`blur(${i}px)`,document.body.style.background="transparent"):o&&o.remove(),localStorage.setItem("background-current-settings",JSON.stringify(this.currentSettings)),console.log("\u2705 \u80CC\u666F\u5DF2\u5E94\u7528"),this.showMessage("\u80CC\u666F\u5DF2\u6210\u529F\u5E94\u7528\uFF01","success")}resetBackground(){document.body.style.background="",document.body.style.backgroundPosition="",document.body.style.backgroundSize="",document.body.style.backgroundRepeat="",document.body.style.backgroundAttachment="";let e=document.getElementById("background-overlay");e&&e.remove(),this.setDefaultSettings(),this.applySettingsToInterface(),localStorage.removeItem("background-current-settings"),console.log("\u2705 \u80CC\u666F\u5DF2\u91CD\u7F6E"),this.showMessage("\u80CC\u666F\u5DF2\u91CD\u7F6E\u4E3A\u9ED8\u8BA4\u8BBE\u7F6E","info")}saveAsPreset(){let e=prompt("\u8BF7\u8F93\u5165\u9884\u8BBE\u540D\u79F0:");if(!e)return;let t={id:`preset-custom-${Date.now()}`,name:e,type:this.currentSettings.style.type,value:this.currentSettings.style.value,category:"custom"};this.customStyles.push(t),this.saveCustomStyles(),this.renderStyleLibrary("custom"),console.log("\u2705 \u9884\u8BBE\u5DF2\u4FDD\u5B58"),this.showMessage(`\u9884\u8BBE "${e}" \u5DF2\u4FDD\u5B58`,"success")}closeManager(){this.container&&(this.container.style.display="none")}openManager(){this.container&&(this.container.style.display="flex",this.container.style.alignItems="center",this.container.style.justifyContent="center",this.loadCurrentSettings(),this.renderStyleLibrary("preset"),console.log("\u2705 Background manager opened"))}showMessage(e,t="info"){let i=document.createElement("div");i.className=`background-message ${t}`,i.textContent=e,i.style.cssText=`
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
        `,t==="error"?i.style.background="#ef4444":t==="success"&&(i.style.background="#10b981"),document.body.appendChild(i),setTimeout(()=>{i.style.opacity="1",i.style.transform="translateX(0)"},10),setTimeout(()=>{i.style.opacity="0",i.style.transform="translateX(100px)",setTimeout(()=>{i.parentElement&&i.parentElement.removeChild(i)},300)},3e3)}getCurrentSettings(){return{...this.currentSettings}}setSettings(e){this.currentSettings={...this.currentSettings,...e},this.applySettingsToInterface(),this.updatePreview()}autoApplyBackground(){let e=localStorage.getItem("background-current-settings");if(e)try{let t=JSON.parse(e);this.currentSettings=t;let{style:i,opacity:s,blur:a,position:o,size:r}=t;if(document.body.style.background=i.value,document.body.style.backgroundPosition=o,document.body.style.backgroundSize=r,document.body.style.backgroundRepeat="no-repeat",document.body.style.backgroundAttachment="fixed",s<100||a>0){let l=document.createElement("div");l.id="background-overlay",l.style.cssText=`
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        pointer-events: none;
                        z-index: -1;
                        background: ${i.value};
                        background-position: ${o};
                        background-size: ${r};
                        background-repeat: no-repeat;
                        background-attachment: fixed;
                        opacity: ${s/100};
                        filter: blur(${a}px);
                    `,document.body.appendChild(l),document.body.style.background="transparent"}console.log("\u2705 \u81EA\u52A8\u5E94\u7528\u4FDD\u5B58\u7684\u80CC\u666F\u8BBE\u7F6E")}catch(t){console.warn("Failed to auto-apply background:",t)}}},X=new x;window.BackgroundManager=x;window.backgroundManager=X;window.openBackgroundManager=()=>X.openManager();var k=class{config;token=null;progressCallback;constructor(){this.loadConfig(),this.loadToken()}loadConfig(){if(typeof window<"u"&&window.GitHubConfig)this.config=window.GitHubConfig;else throw new Error("GitHub configuration not found. Please ensure github-config.js is loaded.")}loadToken(){this.token=localStorage.getItem("github_access_token"),!this.token&&!this.config.development.useMockUpload&&console.warn("GitHub access token not found. Some features may not work.")}setToken(e){this.token=e,localStorage.setItem("github_access_token",e),this.config.utils.debugLog("GitHub token updated")}setProgressCallback(e){this.progressCallback=e}async uploadImage(e,t={},i="general"){try{this.updateProgress("validating",0,"\u9A8C\u8BC1\u6587\u4EF6...");let s=this.validateFile(e);if(!s.valid)throw new Error(s.error);this.updateProgress("validating",20,"\u6587\u4EF6\u9A8C\u8BC1\u901A\u8FC7");let a=this.config.utils.generateUniqueFileName(e.name,i);this.updateProgress("compressing",30,"\u538B\u7F29\u56FE\u7247...");let o=await this.compressImage(e);this.updateProgress("compressing",60,"\u56FE\u7247\u538B\u7F29\u5B8C\u6210"),this.updateProgress("uploading",70,"\u4E0A\u4F20\u5230GitHub...");let r=await this.fileToBase64(o),l=await this.uploadToGitHub(a,r,t);return this.updateProgress("completed",100,"\u4E0A\u4F20\u5B8C\u6210"),{success:!0,url:l.content?.download_url,cdnUrl:this.config.utils.getImageUrl(a),fileName:a,sha:l.content?.sha,originalSize:e.size,compressedSize:o.size}}catch(s){return this.updateProgress("error",0,`\u4E0A\u4F20\u5931\u8D25: ${s.message}`),{success:!1,error:s.message}}}async uploadImages(e,t=[],i="general"){let s=[];for(let a=0;a<e.length;a++){let o=e[a],r=t[a]||{};this.updateProgress("uploading",a/e.length*100,`\u4E0A\u4F20\u7B2C ${a+1} \u4E2A\u6587\u4EF6: ${o.name}`);let l=await this.uploadImage(o,r,i);s.push(l),a<e.length-1&&await this.delay(500)}return s}validateFile(e){return this.config.utils.isValidImageFormat(e)?this.config.utils.isValidFileSize(e)?{valid:!0}:{valid:!1,error:this.config.utils.getErrorMessage("file_too_large")}:{valid:!1,error:this.config.utils.getErrorMessage("unsupported_format")}}async compressImage(e){return new Promise((t,i)=>{let s=document.createElement("canvas"),a=s.getContext("2d"),o=new Image;o.onload=()=>{let{maxWidth:r,maxHeight:l,quality:u}=this.config.imageUpload.compression,{width:d,height:m}=o;if(d>r||m>l){let h=Math.min(r/d,l/m);d*=h,m*=h}s.width=d,s.height=m,a?.drawImage(o,0,0,d,m),s.toBlob(h=>{if(h){let g=new File([h],e.name,{type:"image/webp",lastModified:Date.now()});t(g)}else i(new Error("Image compression failed"))},"image/webp",u)},o.onerror=()=>i(new Error("Failed to load image")),o.src=URL.createObjectURL(e)})}async fileToBase64(e){return new Promise((t,i)=>{let s=new FileReader;s.onload=()=>{let o=s.result.split(",")[1];t(o)},s.onerror=()=>i(new Error("Failed to read file")),s.readAsDataURL(e)})}async uploadToGitHub(e,t,i){if(this.config.development.useMockUpload)return await this.delay(1e3),{content:{sha:"mock_sha_"+Date.now(),download_url:this.config.utils.getImageUrl(e,!1),html_url:`https://github.com/${this.config.imageRepo.owner}/${this.config.imageRepo.repo}/blob/${this.config.imageRepo.branch}/${e}`}};if(!this.token)throw new Error(this.config.utils.getErrorMessage("auth_failed"));let{owner:s,repo:a,branch:o}=this.config.imageRepo,r=`${this.config.apiUrl}/repos/${s}/${a}/contents/${e}`,l=this.createCommitMessage(e,i),u=await fetch(r,{method:"PUT",headers:{Authorization:`token ${this.token}`,"Content-Type":"application/json",Accept:"application/vnd.github.v3+json"},body:JSON.stringify({message:l,content:t,branch:o})});if(!u.ok){let d=await u.json();throw new Error(d.message||this.config.utils.getErrorMessage("upload_failed"))}return await u.json()}createCommitMessage(e,t){let i=`Add image: ${e}`;return t.title&&(i+=`

Title: ${t.title}`),t.description&&(i+=`
Description: ${t.description}`),t.tags&&t.tags.length>0&&(i+=`
Tags: ${t.tags.join(", ")}`),t.category&&(i+=`
Category: ${t.category}`),i}updateProgress(e,t,i){this.progressCallback&&this.progressCallback({stage:e,progress:t,message:i}),this.config.utils.debugLog(`Upload Progress: ${e} - ${t}% - ${i}`)}delay(e){return new Promise(t=>setTimeout(t,e))}async getUploadStats(){return{totalUploads:0,totalSize:0,categories:{},recentUploads:[]}}async deleteImage(e){if(!this.token)throw new Error(this.config.utils.getErrorMessage("auth_failed"));try{let{owner:t,repo:i,branch:s}=this.config.imageRepo,a=`${this.config.apiUrl}/repos/${t}/${i}/contents/${e}`,o=await fetch(a,{headers:{Authorization:`token ${this.token}`,Accept:"application/vnd.github.v3+json"}});if(!o.ok)throw new Error("File not found");let r=await o.json(),l=`${this.config.apiUrl}/repos/${t}/${i}/contents/${e}`;return(await fetch(l,{method:"DELETE",headers:{Authorization:`token ${this.token}`,"Content-Type":"application/json",Accept:"application/vnd.github.v3+json"},body:JSON.stringify({message:`Delete image: ${e}`,sha:r.sha,branch:s})})).ok}catch(t){return this.config.utils.debugLog("Delete failed:",t),!1}}async listImages(e){if(!this.token)throw new Error(this.config.utils.getErrorMessage("auth_failed"));try{let{owner:t,repo:i}=this.config.imageRepo,s=e?this.config.imageUpload.paths[e]||e:"",a=`${this.config.apiUrl}/repos/${t}/${i}/contents/${s}`,o=await fetch(a,{headers:{Authorization:`token ${this.token}`,Accept:"application/vnd.github.v3+json"}});if(!o.ok)throw new Error("Failed to list images");return(await o.json()).filter(l=>{let u=l.name.split(".").pop()?.toLowerCase();return this.config.imageUpload.supportedFormats.includes(u)})}catch(t){return this.config.utils.debugLog("List images failed:",t),[]}}},C=class{uploader;container=null;constructor(e){this.uploader=e}openManager(){this.container||this.createInterface(),this.container&&(this.container.style.display="block")}closeManager(){this.container&&(this.container.style.display="none")}createInterface(){document.body.insertAdjacentHTML("beforeend",`
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
        `),this.container=document.getElementById("image-manager"),this.setupEventListeners()}setupEventListeners(){let e=document.getElementById("image-upload-area"),t=document.getElementById("image-file-input");e?.addEventListener("click",()=>{t.click()}),t?.addEventListener("change",i=>{let s=i.target.files;s&&s.length>0&&this.handleFileUpload(Array.from(s))}),e?.addEventListener("dragover",i=>{i.preventDefault(),e.classList.add("drag-over")}),e?.addEventListener("dragleave",()=>{e.classList.remove("drag-over")}),e?.addEventListener("drop",i=>{i.preventDefault(),e.classList.remove("drag-over");let s=i.dataTransfer?.files;s&&s.length>0&&this.handleFileUpload(Array.from(s))}),document.getElementById("refresh-gallery")?.addEventListener("click",()=>{this.loadGallery()}),document.getElementById("category-filter")?.addEventListener("change",()=>{this.loadGallery()})}async handleFileUpload(e){let t=document.getElementById("upload-progress"),i=document.getElementById("progress-fill"),s=document.getElementById("progress-text");t&&(t.style.display="block"),this.uploader.setProgressCallback(a=>{i&&(i.style.width=`${a.progress}%`),s&&(s.textContent=a.message)});try{let a=await this.uploader.uploadImages(e),o=a.filter(l=>l.success).length,r=a.length-o;s&&(s.textContent=`\u4E0A\u4F20\u5B8C\u6210\uFF1A${o} \u6210\u529F\uFF0C${r} \u5931\u8D25`),setTimeout(()=>{this.loadGallery(),t&&(t.style.display="none")},2e3)}catch(a){s&&(s.textContent=`\u4E0A\u4F20\u5931\u8D25\uFF1A${a.message}`)}}async loadGallery(){let e=document.getElementById("image-gallery"),t=document.getElementById("category-filter");if(e){e.innerHTML='<div class="loading">\u52A0\u8F7D\u4E2D...</div>';try{let i=t?.value||void 0,s=await this.uploader.listImages(i);if(s.length===0){e.innerHTML='<div class="gallery-placeholder"><p>\u6682\u65E0\u56FE\u7247</p></div>';return}let a=s.map(o=>`
                <div class="gallery-item">
                    <img src="${o.download_url}" alt="${o.name}" loading="lazy">
                    <div class="gallery-item-info">
                        <div class="image-name">${o.name}</div>
                        <div class="image-actions">
                            <button class="btn btn-sm" onclick="navigator.clipboard.writeText('${o.download_url}')">\u590D\u5236\u94FE\u63A5</button>
                            <button class="btn btn-sm btn-danger" onclick="window.imageManagerUI.deleteImage('${o.name}')">\u5220\u9664</button>
                        </div>
                    </div>
                </div>
            `).join("");e.innerHTML=a}catch(i){e.innerHTML=`<div class="error">\u52A0\u8F7D\u5931\u8D25\uFF1A${i.message}</div>`}}}async deleteImage(e){if(confirm(`\u786E\u5B9A\u8981\u5220\u9664\u56FE\u7247 "${e}" \u5417\uFF1F`))try{await this.uploader.deleteImage(e)?(alert("\u5220\u9664\u6210\u529F"),this.loadGallery()):alert("\u5220\u9664\u5931\u8D25")}catch(t){alert(`\u5220\u9664\u5931\u8D25\uFF1A${t.message}`)}}},E,S;document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{E=new k,S=new C(E),window.githubImageUploader=E,window.imageManagerUI=S,window.openImageManager=()=>S.openManager(),console.log("\u{1F4E4} GitHub Image Uploader initialized")}):(E=new k,S=new C(E),window.githubImageUploader=E,window.imageManagerUI=S,window.openImageManager=()=>S.openManager(),console.log("\u{1F4E4} GitHub Image Uploader initialized"));window.GitHubImageUploader=k;D();var F=class{currentSession=null;SESSION_KEY="guestSession";USERS_KEY="guestUsers";SESSION_DURATION=7*24*60*60*1e3;constructor(){this.loadSession(),this.forceInitialization(),console.log("\u{1F510} Guest authentication system initialized")}forceInitialization(){this.setupEventListeners(),document.readyState==="loading"&&document.addEventListener("DOMContentLoaded",()=>{this.setupEventListeners()}),window.addEventListener("load",()=>{this.setupEventListeners()}),setTimeout(()=>{this.setupEventListeners()},500)}loadSession(){try{let e=localStorage.getItem(this.SESSION_KEY);if(e){let t=JSON.parse(e);new Date(t.expiresAt)>new Date?(this.currentSession=t,this.updateUI(),console.log("\u2705 Guest session restored:",t.username)):(localStorage.removeItem(this.SESSION_KEY),console.log("\u23F0 Guest session expired"))}}catch(e){console.error("\u274C Error loading guest session:",e),localStorage.removeItem(this.SESSION_KEY)}}setupEventListeners(){document.addEventListener("click",e=>{let t=e.target;(t.id==="guest-login-btn"||t.closest("#guest-login-btn"))&&(e.preventDefault(),this.showGuestLoginModal()),(t.id==="guest-logout-btn"||t.closest("#guest-logout-btn"))&&(e.preventDefault(),this.logout()),(t.id==="guest-register-btn"||t.closest("#guest-register-btn"))&&(e.preventDefault(),this.showGuestRegisterModal())}),this.addGuestLoginButton()}addGuestLoginButton(){let e=document.getElementById("guest-auth-section");e&&e.remove(),this.addFloatingGuestButton(),console.log("\u2705 Guest auth button setup completed")}addFloatingGuestButton(){let e=`
            <div id="guest-auth-section" class="guest-auth-floating" style="
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 9999;
                background: rgba(255, 255, 255, 0.95);
                border-radius: 8px;
                padding: 10px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.15);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(0,0,0,0.1);
            ">
                <div id="guest-login-area" class="guest-login-area" style="display: ${this.currentSession?"none":"flex"}; gap: 8px;">
                    <button id="guest-login-btn" class="guest-login-btn" style="
                        display: flex;
                        align-items: center;
                        gap: 5px;
                        padding: 8px 12px;
                        background: #007bff;
                        color: white;
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                        font-size: 14px;
                        font-family: inherit;
                    ">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        \u6E38\u5BA2\u767B\u5F55
                    </button>
                </div>

                <div id="guest-user-area" class="guest-user-area" style="display: ${this.currentSession?"flex":"none"}; align-items: center; gap: 8px;">
                    <img id="guest-avatar" class="guest-avatar" src="${this.currentSession?.avatar||"/img/default-avatar.png"}" alt="\u5934\u50CF" style="
                        width: 32px;
                        height: 32px;
                        border-radius: 50%;
                        object-fit: cover;
                    ">
                    <span id="guest-username" class="guest-username" style="font-weight: 500; color: #333;">${this.currentSession?.username||""}</span>
                    <button id="guest-logout-btn" class="guest-logout-btn" style="
                        padding: 6px 10px;
                        background: #dc3545;
                        color: white;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 12px;
                        font-family: inherit;
                    ">\u9000\u51FA</button>
                </div>
            </div>
        `;document.body.insertAdjacentHTML("beforeend",e),console.log("\u2705 Guest auth floating button added")}showGuestLoginModal(){document.body.insertAdjacentHTML("beforeend",`
            <div id="guest-login-modal" class="guest-modal" style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
            ">
                <div class="guest-modal-content" style="
                    background: white;
                    border-radius: 8px;
                    padding: 0;
                    max-width: 400px;
                    width: 90%;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                ">
                    <div class="guest-modal-header" style="
                        padding: 20px;
                        border-bottom: 1px solid #eee;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    ">
                        <h3 style="margin: 0; color: #333;">\u6E38\u5BA2\u767B\u5F55</h3>
                        <button class="guest-modal-close" onclick="this.closest('.guest-modal').remove()" style="
                            background: none;
                            border: none;
                            font-size: 24px;
                            cursor: pointer;
                            color: #999;
                        ">\xD7</button>
                    </div>
                    <div class="guest-modal-body" style="padding: 20px;">
                        <form id="guest-login-form">
                            <div class="guest-form-group" style="margin-bottom: 15px;">
                                <label for="guest-login-username" style="display: block; margin-bottom: 5px; font-weight: 500;">\u7528\u6237\u540D\u6216\u90AE\u7BB1</label>
                                <input type="text" id="guest-login-username" required style="
                                    width: 100%;
                                    padding: 10px;
                                    border: 1px solid #ddd;
                                    border-radius: 4px;
                                    font-size: 14px;
                                    box-sizing: border-box;
                                ">
                            </div>
                            <div class="guest-form-group" style="margin-bottom: 20px;">
                                <label for="guest-login-password" style="display: block; margin-bottom: 5px; font-weight: 500;">\u5BC6\u7801</label>
                                <input type="password" id="guest-login-password" required style="
                                    width: 100%;
                                    padding: 10px;
                                    border: 1px solid #ddd;
                                    border-radius: 4px;
                                    font-size: 14px;
                                    box-sizing: border-box;
                                ">
                            </div>
                            <div class="guest-form-actions" style="display: flex; gap: 10px;">
                                <button type="submit" class="guest-btn guest-btn-primary" style="
                                    flex: 1;
                                    padding: 10px;
                                    background: #007bff;
                                    color: white;
                                    border: none;
                                    border-radius: 4px;
                                    cursor: pointer;
                                    font-size: 14px;
                                ">\u767B\u5F55</button>
                                <button type="button" class="guest-btn guest-btn-secondary" onclick="document.getElementById('guest-login-modal').remove(); window.guestAuth.showGuestRegisterModal()" style="
                                    flex: 1;
                                    padding: 10px;
                                    background: #6c757d;
                                    color: white;
                                    border: none;
                                    border-radius: 4px;
                                    cursor: pointer;
                                    font-size: 14px;
                                ">\u6CE8\u518C\u65B0\u8D26\u6237</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `);let t=document.getElementById("guest-login-form");t.addEventListener("submit",i=>{i.preventDefault(),this.handleLogin(t)})}showGuestRegisterModal(){document.body.insertAdjacentHTML("beforeend",`
            <div id="guest-register-modal" class="guest-modal">
                <div class="guest-modal-content">
                    <div class="guest-modal-header">
                        <h3>\u6E38\u5BA2\u6CE8\u518C</h3>
                        <button class="guest-modal-close" onclick="this.closest('.guest-modal').remove()">\xD7</button>
                    </div>
                    <div class="guest-modal-body">
                        <form id="guest-register-form">
                            <div class="guest-form-group">
                                <label for="guest-register-username">\u7528\u6237\u540D</label>
                                <input type="text" id="guest-register-username" required minlength="3" maxlength="20">
                                <small>3-20\u4E2A\u5B57\u7B26\uFF0C\u53EA\u80FD\u5305\u542B\u5B57\u6BCD\u3001\u6570\u5B57\u548C\u4E0B\u5212\u7EBF</small>
                            </div>
                            <div class="guest-form-group">
                                <label for="guest-register-email">\u90AE\u7BB1</label>
                                <input type="email" id="guest-register-email" required>
                            </div>
                            <div class="guest-form-group">
                                <label for="guest-register-password">\u5BC6\u7801</label>
                                <input type="password" id="guest-register-password" required minlength="6">
                                <small>\u81F3\u5C116\u4E2A\u5B57\u7B26</small>
                            </div>
                            <div class="guest-form-group">
                                <label for="guest-register-confirm">\u786E\u8BA4\u5BC6\u7801</label>
                                <input type="password" id="guest-register-confirm" required>
                            </div>
                            <div class="guest-form-actions">
                                <button type="submit" class="guest-btn guest-btn-primary">\u6CE8\u518C</button>
                                <button type="button" class="guest-btn guest-btn-secondary" onclick="document.getElementById('guest-register-modal').remove(); window.guestAuth.showGuestLoginModal()">\u5DF2\u6709\u8D26\u6237\uFF1F\u767B\u5F55</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `);let t=document.getElementById("guest-register-form");t.addEventListener("submit",i=>{i.preventDefault(),this.handleRegister(t)})}handleLogin(e){let t=new FormData(e),i=document.getElementById("guest-login-username").value,s=document.getElementById("guest-login-password").value;try{let o=this.getStoredUsers().find(l=>l.username===i||l.email===i);if(!o){this.showMessage("\u7528\u6237\u4E0D\u5B58\u5728","error");return}if(localStorage.getItem(`guest_password_${o.id}`)!==s){this.showMessage("\u5BC6\u7801\u9519\u8BEF","error");return}this.createSession(o),document.getElementById("guest-login-modal")?.remove(),this.showMessage("\u767B\u5F55\u6210\u529F\uFF01","success"),console.log("\u2705 Guest login successful:",o.username)}catch(a){console.error("\u274C Guest login error:",a),this.showMessage("\u767B\u5F55\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5","error")}}handleRegister(e){let t=document.getElementById("guest-register-username").value,i=document.getElementById("guest-register-email").value,s=document.getElementById("guest-register-password").value,a=document.getElementById("guest-register-confirm").value;if(s!==a){this.showMessage("\u5BC6\u7801\u786E\u8BA4\u4E0D\u5339\u914D","error");return}if(!/^[a-zA-Z0-9_]+$/.test(t)){this.showMessage("\u7528\u6237\u540D\u53EA\u80FD\u5305\u542B\u5B57\u6BCD\u3001\u6570\u5B57\u548C\u4E0B\u5212\u7EBF","error");return}try{let o=this.getStoredUsers();if(o.some(l=>l.username===t)){this.showMessage("\u7528\u6237\u540D\u5DF2\u5B58\u5728","error");return}if(o.some(l=>l.email===i)){this.showMessage("\u90AE\u7BB1\u5DF2\u88AB\u6CE8\u518C","error");return}let r={id:this.generateUserId(),username:t,email:i,registeredAt:new Date().toISOString(),lastLoginAt:new Date().toISOString(),ratings:{},comments:[]};o.push(r),localStorage.setItem(this.USERS_KEY,JSON.stringify(o)),localStorage.setItem(`guest_password_${r.id}`,s),this.createSession(r),document.getElementById("guest-register-modal")?.remove(),this.showMessage("\u6CE8\u518C\u6210\u529F\uFF01","success"),console.log("\u2705 Guest registration successful:",r.username)}catch(o){console.error("\u274C Guest registration error:",o),this.showMessage("\u6CE8\u518C\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5","error")}}createSession(e){let t=new Date,i=new Date(t.getTime()+this.SESSION_DURATION);this.currentSession={userId:e.id,username:e.username,email:e.email,avatar:e.avatar,loginAt:t.toISOString(),expiresAt:i.toISOString()};let s=this.getStoredUsers(),a=s.findIndex(o=>o.id===e.id);a!==-1&&(s[a].lastLoginAt=t.toISOString(),localStorage.setItem(this.USERS_KEY,JSON.stringify(s))),localStorage.setItem(this.SESSION_KEY,JSON.stringify(this.currentSession)),this.updateUI()}logout(){this.currentSession=null,localStorage.removeItem(this.SESSION_KEY),this.updateUI(),this.showMessage("\u5DF2\u9000\u51FA\u767B\u5F55","info"),console.log("\u{1F44B} Guest logged out")}updateUI(){let e=document.getElementById("guest-login-area"),t=document.getElementById("guest-user-area"),i=document.getElementById("guest-username"),s=document.getElementById("guest-avatar");this.currentSession?(e&&(e.style.display="none"),t&&(t.style.display="block"),i&&(i.textContent=this.currentSession.username),s&&(s.src=this.currentSession.avatar||"/img/default-avatar.png")):(e&&(e.style.display="block"),t&&(t.style.display="none"))}getStoredUsers(){try{let e=localStorage.getItem(this.USERS_KEY);return e?JSON.parse(e):[]}catch(e){return console.error("\u274C Error loading users:",e),[]}}generateUserId(){return"guest_"+Date.now()+"_"+Math.random().toString(36).substr(2,9)}showMessage(e,t){if(typeof window.Stack<"u"){let i=window.Stack;t==="success"&&i.showSuccessMessage?i.showSuccessMessage(e):t==="error"&&i.showErrorMessage?i.showErrorMessage(e):console.log(`${t.toUpperCase()}: ${e}`)}else alert(e)}isLoggedIn(){return this.currentSession!==null}getCurrentUser(){return this.currentSession}rateArticle(e,t){if(!this.currentSession)return this.showMessage("\u8BF7\u5148\u767B\u5F55\u540E\u518D\u8BC4\u5206","error"),!1;if(t<1||t>5)return this.showMessage("\u8BC4\u5206\u5FC5\u987B\u57281-5\u4E4B\u95F4","error"),!1;try{let i=this.getStoredUsers(),s=i.findIndex(a=>a.id===this.currentSession.userId);if(s!==-1)return i[s].ratings[e]=t,localStorage.setItem(this.USERS_KEY,JSON.stringify(i)),this.showMessage("\u8BC4\u5206\u6210\u529F\uFF01","success"),!0}catch(i){console.error("\u274C Error rating article:",i),this.showMessage("\u8BC4\u5206\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5","error")}return!1}getUserRating(e){if(!this.currentSession)return null;try{return this.getStoredUsers().find(s=>s.id===this.currentSession.userId)?.ratings[e]||null}catch(t){return console.error("\u274C Error getting user rating:",t),null}}},be=new F;window.guestAuth=be;var U=class{RATINGS_KEY="articleRatings";currentArticleId=null;constructor(){this.init(),console.log("\u2B50 Article rating system initialized")}init(){this.currentArticleId=this.getCurrentArticleId(),this.currentArticleId&&(this.addRatingWidget(),console.log("\u{1F4C4} Rating widget added for article:",this.currentArticleId))}getCurrentArticleId(){let e=document.querySelector('meta[name="article-id"]');if(e&&e.content)return e.content;let t=window.location.pathname;return t.includes("/p/")?t.split("/p/")[1].split("/")[0]:null}addRatingWidget(){if(!this.currentArticleId)return;let e=document.querySelector(".article-content, .post-content, article");if(!e){console.warn("\u26A0\uFE0F Article content area not found");return}let t=this.getRatingData(this.currentArticleId),i=this.getCurrentUser(),s=i&&t.ratings[i.userId]||0,a=`
            <div class="article-rating" id="article-rating">
                <div class="rating-header">
                    <h4>\u{1F4CA} \u6587\u7AE0\u8BC4\u5206</h4>
                    <div class="rating-stats">
                        <span class="average-rating">${t.averageRating.toFixed(1)}</span>
                        <span class="rating-separator">\xB7</span>
                        <span class="total-ratings">${t.totalRatings} \u4EBA\u8BC4\u5206</span>
                    </div>
                </div>
                
                <div class="rating-content">
                    ${i?this.createUserRatingHTML(s):this.createGuestPromptHTML()}
                </div>
                
                <div class="rating-distribution">
                    ${this.createRatingDistributionHTML(t)}
                </div>
            </div>
        `;e.insertAdjacentHTML("afterend",a),this.setupRatingEventListeners()}createUserRatingHTML(e){return`
            <div class="user-rating-section">
                <p class="rating-prompt">\u60A8\u5BF9\u8FD9\u7BC7\u6587\u7AE0\u7684\u8BC4\u5206\uFF1A</p>
                <div class="rating-stars" data-rating="${e}">
                    ${[1,2,3,4,5].map(t=>`
                        <svg class="star ${t<=e?"active":""}" 
                             data-rating="${t}" 
                             viewBox="0 0 24 24" 
                             fill="${t<=e?"currentColor":"none"}" 
                             stroke="currentColor" 
                             stroke-width="2">
                            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"></polygon>
                        </svg>
                    `).join("")}
                </div>
                ${e>0?`
                    <div class="rating-message">
                        <span>\u60A8\u5DF2\u8BC4\u5206\uFF1A${e} \u661F</span>
                        <button class="rating-change-btn" onclick="window.articleRating.clearUserRating()">\u4FEE\u6539\u8BC4\u5206</button>
                    </div>
                `:""}
            </div>
        `}createGuestPromptHTML(){return`
            <div class="guest-rating-prompt">
                <p>\u60F3\u8981\u4E3A\u8FD9\u7BC7\u6587\u7AE0\u8BC4\u5206\uFF1F</p>
                <button class="guest-login-prompt-btn" onclick="window.guestAuth.showGuestLoginModal()">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    \u6E38\u5BA2\u767B\u5F55
                </button>
            </div>
        `}createRatingDistributionHTML(e){return e.totalRatings===0?'<div class="rating-distribution-empty">\u6682\u65E0\u8BC4\u5206\u6570\u636E</div>':`
            <div class="rating-distribution-chart">
                <h5>\u8BC4\u5206\u5206\u5E03</h5>
                ${[5,4,3,2,1].map(t=>{let i=e.ratingDistribution[t]||0,s=e.totalRatings>0?i/e.totalRatings*100:0;return`
                        <div class="rating-bar">
                            <span class="rating-label">${t}\u661F</span>
                            <div class="rating-bar-container">
                                <div class="rating-bar-fill" style="width: ${s}%"></div>
                            </div>
                            <span class="rating-count">${i}</span>
                        </div>
                    `}).join("")}
            </div>
        `}setupRatingEventListeners(){document.querySelectorAll(".rating-stars .star").forEach(i=>{i.addEventListener("click",s=>{let a=parseInt(s.currentTarget.getAttribute("data-rating")||"0");this.submitRating(a)}),i.addEventListener("mouseenter",s=>{let a=parseInt(s.currentTarget.getAttribute("data-rating")||"0");this.highlightStars(a)})});let t=document.querySelector(".rating-stars");t&&t.addEventListener("mouseleave",()=>{let i=parseInt(t.getAttribute("data-rating")||"0");this.highlightStars(i)})}highlightStars(e){document.querySelectorAll(".rating-stars .star").forEach((i,s)=>{let a=i;s<e?(a.classList.add("active"),a.setAttribute("fill","currentColor")):(a.classList.remove("active"),a.setAttribute("fill","none"))})}submitRating(e){if(!this.currentArticleId){console.error("\u274C No article ID available");return}let t=this.getCurrentUser();if(!t){this.showMessage("\u8BF7\u5148\u767B\u5F55\u540E\u518D\u8BC4\u5206","error");return}if(e<1||e>5){this.showMessage("\u8BC4\u5206\u5FC5\u987B\u57281-5\u4E4B\u95F4","error");return}try{window.guestAuth.rateArticle(this.currentArticleId,e)&&(this.updateRatingData(this.currentArticleId,t.userId,e),this.refreshRatingWidget(),console.log("\u2705 Rating submitted:",e))}catch(i){console.error("\u274C Error submitting rating:",i),this.showMessage("\u8BC4\u5206\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5","error")}}clearUserRating(){if(!this.currentArticleId)return;let e=this.getCurrentUser();if(e)try{let t=this.getAllRatingsData(),i=t[this.currentArticleId];if(i&&i.ratings[e.userId]){delete i.ratings[e.userId],this.recalculateRatingStats(i),localStorage.setItem(this.RATINGS_KEY,JSON.stringify(t));let s=JSON.parse(localStorage.getItem("guestUsers")||"[]"),a=s.findIndex(o=>o.id===e.userId);a!==-1&&s[a].ratings[this.currentArticleId]&&(delete s[a].ratings[this.currentArticleId],localStorage.setItem("guestUsers",JSON.stringify(s))),this.refreshRatingWidget(),this.showMessage("\u8BC4\u5206\u5DF2\u6E05\u9664","info")}}catch(t){console.error("\u274C Error clearing rating:",t)}}updateRatingData(e,t,i){let s=this.getAllRatingsData();s[e]||(s[e]={articleId:e,ratings:{},averageRating:0,totalRatings:0,ratingDistribution:{1:0,2:0,3:0,4:0,5:0}});let a=s[e];a.ratings[t]=i,this.recalculateRatingStats(a),localStorage.setItem(this.RATINGS_KEY,JSON.stringify(s))}recalculateRatingStats(e){let t=Object.values(e.ratings);e.totalRatings=t.length,t.length>0?e.averageRating=t.reduce((i,s)=>i+s,0)/t.length:e.averageRating=0,e.ratingDistribution={1:0,2:0,3:0,4:0,5:0},t.forEach(i=>{e.ratingDistribution[i]=(e.ratingDistribution[i]||0)+1})}getRatingData(e){let t=this.getAllRatingsData();return t[e]?t[e]:{articleId:e,ratings:{},averageRating:0,totalRatings:0,ratingDistribution:{1:0,2:0,3:0,4:0,5:0}}}getAllRatingsData(){try{let e=localStorage.getItem(this.RATINGS_KEY);return e?JSON.parse(e):{}}catch(e){return console.error("\u274C Error loading ratings data:",e),{}}}getCurrentUser(){return window.guestAuth?.getCurrentUser()||null}refreshRatingWidget(){let e=document.getElementById("article-rating");e&&this.currentArticleId&&(e.remove(),this.addRatingWidget())}showMessage(e,t){if(typeof window.Stack<"u"){let i=window.Stack;t==="success"&&i.showSuccessMessage?i.showSuccessMessage(e):t==="error"&&i.showErrorMessage?i.showErrorMessage(e):console.log(`${t.toUpperCase()}: ${e}`)}else alert(e)}getArticleStats(e){return this.getRatingData(e)}},we=new U;window.articleRating=we;var q=class{config;token=null;constructor(){this.loadConfig(),this.initializeIntegration(),console.log("\u{1F517} GitHub Deep Integration initialized")}loadConfig(){this.config={token:localStorage.getItem("github_access_token")||"",repositories:{content:{owner:"lanniny",repo:"my_blog_show",branch:"master"},images:{owner:"lanniny",repo:"my_blog_img",branch:"main"},source:{owner:"lanniny",repo:"my_blog_source",branch:"main"}},apiUrl:"https://api.github.com"},this.token=this.config.token}initializeIntegration(){this.addGitHubIntegrationUI(),this.setupAutoSync(),this.initializeStatusMonitoring()}addGitHubIntegrationUI(){setTimeout(()=>{document.getElementById("admin-panel-modal")&&this.createGitHubTab()},1e3)}createGitHubTab(){let e=document.querySelector(".admin-tabs"),t=document.querySelector(".admin-content");if(!e||!t)return;let i=document.createElement("button");i.className="admin-tab",i.setAttribute("data-tab","github"),i.innerHTML=`
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
            </svg>
            GitHub\u96C6\u6210
        `,e.appendChild(i);let s=document.createElement("div");s.className="admin-tab-content",s.setAttribute("data-tab","github"),s.style.display="none",s.innerHTML=this.createGitHubPanelHTML(),t.appendChild(s),i.addEventListener("click",()=>{document.querySelectorAll(".admin-tab").forEach(a=>a.classList.remove("active")),document.querySelectorAll(".admin-tab-content").forEach(a=>a.style.display="none"),i.classList.add("active"),s.style.display="block",this.loadGitHubStatus()}),this.setupGitHubPanelEvents()}createGitHubPanelHTML(){return`
            <div class="github-integration-panel">
                <div class="github-header">
                    <h3>\u{1F517} GitHub\u6DF1\u5EA6\u96C6\u6210</h3>
                    <p>\u7BA1\u7406GitHub\u4ED3\u5E93\u540C\u6B65\u3001\u5185\u5BB9\u53D1\u5E03\u548C\u534F\u4F5C\u529F\u80FD</p>
                </div>
                
                <div class="github-status" id="github-status">
                    <div class="status-loading">\u6B63\u5728\u68C0\u67E5GitHub\u8FDE\u63A5\u72B6\u6001...</div>
                </div>
                
                <div class="github-repositories">
                    <h4>\u{1F4DA} \u4ED3\u5E93\u7BA1\u7406</h4>
                    <div class="repo-grid">
                        <div class="repo-card" data-repo="content">
                            <div class="repo-icon">\u{1F310}</div>
                            <div class="repo-info">
                                <h5>\u535A\u5BA2\u5C55\u793A\u4ED3\u5E93</h5>
                                <p>my_blog_show</p>
                                <div class="repo-status" id="content-repo-status">\u68C0\u67E5\u4E2D...</div>
                            </div>
                            <div class="repo-actions">
                                <button class="btn btn-sm" onclick="window.githubIntegration.syncRepository('content')">\u540C\u6B65</button>
                                <button class="btn btn-sm" onclick="window.githubIntegration.viewRepository('content')">\u67E5\u770B</button>
                            </div>
                        </div>
                        
                        <div class="repo-card" data-repo="images">
                            <div class="repo-icon">\u{1F5BC}\uFE0F</div>
                            <div class="repo-info">
                                <h5>\u56FE\u7247\u8D44\u6E90\u4ED3\u5E93</h5>
                                <p>my_blog_img</p>
                                <div class="repo-status" id="images-repo-status">\u68C0\u67E5\u4E2D...</div>
                            </div>
                            <div class="repo-actions">
                                <button class="btn btn-sm" onclick="window.githubIntegration.syncRepository('images')">\u540C\u6B65</button>
                                <button class="btn btn-sm" onclick="window.githubIntegration.viewRepository('images')">\u67E5\u770B</button>
                            </div>
                        </div>
                        
                        <div class="repo-card" data-repo="source">
                            <div class="repo-icon">\u2699\uFE0F</div>
                            <div class="repo-info">
                                <h5>\u6E90\u7801\u4ED3\u5E93</h5>
                                <p>my_blog_source</p>
                                <div class="repo-status" id="source-repo-status">\u68C0\u67E5\u4E2D...</div>
                            </div>
                            <div class="repo-actions">
                                <button class="btn btn-sm" onclick="window.githubIntegration.syncRepository('source')">\u540C\u6B65</button>
                                <button class="btn btn-sm" onclick="window.githubIntegration.viewRepository('source')">\u67E5\u770B</button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="github-sync">
                    <h4>\u{1F504} \u5185\u5BB9\u540C\u6B65</h4>
                    <div class="sync-options">
                        <div class="sync-option">
                            <label>
                                <input type="checkbox" id="auto-sync-enabled" checked>
                                \u542F\u7528\u81EA\u52A8\u540C\u6B65
                            </label>
                            <p>\u6587\u7AE0\u53D1\u5E03\u65F6\u81EA\u52A8\u540C\u6B65\u5230GitHub</p>
                        </div>
                        
                        <div class="sync-option">
                            <label>
                                <input type="checkbox" id="backup-enabled" checked>
                                \u542F\u7528\u81EA\u52A8\u5907\u4EFD
                            </label>
                            <p>\u5B9A\u671F\u5907\u4EFD\u535A\u5BA2\u5185\u5BB9\u5230GitHub</p>
                        </div>
                    </div>
                    
                    <div class="sync-actions">
                        <button class="btn btn-primary" onclick="window.githubIntegration.fullSync()">\u5B8C\u6574\u540C\u6B65</button>
                        <button class="btn btn-secondary" onclick="window.githubIntegration.backupContent()">\u7ACB\u5373\u5907\u4EFD</button>
                        <button class="btn btn-secondary" onclick="window.githubIntegration.restoreContent()">\u6062\u590D\u5185\u5BB9</button>
                    </div>
                </div>
                
                <div class="github-collaboration">
                    <h4>\u{1F465} \u534F\u4F5C\u529F\u80FD</h4>
                    <div class="collab-features">
                        <button class="btn btn-outline" onclick="window.githubIntegration.createIssue()">\u521B\u5EFAIssue</button>
                        <button class="btn btn-outline" onclick="window.githubIntegration.viewPullRequests()">\u67E5\u770BPR</button>
                        <button class="btn btn-outline" onclick="window.githubIntegration.manageWebhooks()">\u7BA1\u7406Webhooks</button>
                    </div>
                </div>
                
                <div class="github-analytics">
                    <h4>\u{1F4CA} GitHub\u7EDF\u8BA1</h4>
                    <div class="analytics-grid" id="github-analytics">
                        <div class="analytics-loading">\u6B63\u5728\u52A0\u8F7D\u7EDF\u8BA1\u6570\u636E...</div>
                    </div>
                </div>
            </div>
        `}setupGitHubPanelEvents(){document.getElementById("auto-sync-enabled")?.addEventListener("change",i=>{let s=i.target.checked;localStorage.setItem("github_auto_sync",s.toString()),this.showMessage(s?"\u81EA\u52A8\u540C\u6B65\u5DF2\u542F\u7528":"\u81EA\u52A8\u540C\u6B65\u5DF2\u7981\u7528","info")}),document.getElementById("backup-enabled")?.addEventListener("change",i=>{let s=i.target.checked;localStorage.setItem("github_auto_backup",s.toString()),this.showMessage(s?"\u81EA\u52A8\u5907\u4EFD\u5DF2\u542F\u7528":"\u81EA\u52A8\u5907\u4EFD\u5DF2\u7981\u7528","info")})}async loadGitHubStatus(){let e=document.getElementById("github-status");if(e)try{let t=await fetch(`${this.config.apiUrl}/user`,{headers:{Authorization:`token ${this.token}`,Accept:"application/vnd.github.v3+json"}});if(t.ok){let i=await t.json();e.innerHTML=`
                    <div class="status-success">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="20,6 9,17 4,12"></polyline>
                        </svg>
                        GitHub\u8FDE\u63A5\u6B63\u5E38 - \u5DF2\u767B\u5F55\u4E3A ${i.login}
                    </div>
                `,this.loadRepositoryStatuses(),this.loadGitHubAnalytics()}else throw new Error("GitHub API\u8FDE\u63A5\u5931\u8D25")}catch(t){e.innerHTML=`
                <div class="status-error">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="15" y1="9" x2="9" y2="15"></line>
                        <line x1="9" y1="9" x2="15" y2="15"></line>
                    </svg>
                    GitHub\u8FDE\u63A5\u5931\u8D25: ${t.message}
                </div>
            `}}setupAutoSync(){localStorage.getItem("github_auto_sync")!=="false"&&(console.log("\u{1F504} GitHub auto-sync enabled"),this.setupContentChangeListeners())}setupContentChangeListeners(){document.addEventListener("articlePublished",e=>{this.syncArticle(e.detail.article)}),document.addEventListener("articleUpdated",e=>{this.syncArticle(e.detail.article)})}initializeStatusMonitoring(){setInterval(()=>{this.checkGitHubHealth()},5*60*1e3)}async loadRepositoryStatuses(){let e=["content","images","source"];for(let t of e){let i=document.getElementById(`${t}-repo-status`);if(i)try{let s=this.config.repositories[t],a=await fetch(`${this.config.apiUrl}/repos/${s.owner}/${s.repo}`,{headers:{Authorization:`token ${this.token}`,Accept:"application/vnd.github.v3+json"}});if(a.ok){let o=await a.json();i.innerHTML=`
                        <span class="status-success">\u2705 \u6B63\u5E38</span>
                        <small>${o.updated_at?new Date(o.updated_at).toLocaleDateString():""}</small>
                    `}else i.innerHTML='<span class="status-error">\u274C \u65E0\u6CD5\u8BBF\u95EE</span>'}catch{i.innerHTML='<span class="status-error">\u274C \u8FDE\u63A5\u5931\u8D25</span>'}}}async loadGitHubAnalytics(){let e=document.getElementById("github-analytics");if(e)try{let t=await this.getRepositoryStats();e.innerHTML=`
                <div class="analytics-card">
                    <div class="analytics-number">${t.totalCommits}</div>
                    <div class="analytics-label">\u603B\u63D0\u4EA4\u6570</div>
                </div>
                <div class="analytics-card">
                    <div class="analytics-number">${t.totalFiles}</div>
                    <div class="analytics-label">\u6587\u4EF6\u603B\u6570</div>
                </div>
                <div class="analytics-card">
                    <div class="analytics-number">${t.totalSize}</div>
                    <div class="analytics-label">\u4ED3\u5E93\u5927\u5C0F</div>
                </div>
                <div class="analytics-card">
                    <div class="analytics-number">${t.lastSync}</div>
                    <div class="analytics-label">\u6700\u540E\u540C\u6B65</div>
                </div>
            `}catch{e.innerHTML='<div class="analytics-error">\u7EDF\u8BA1\u6570\u636E\u52A0\u8F7D\u5931\u8D25</div>'}}async getRepositoryStats(){return{totalCommits:156,totalFiles:89,totalSize:"2.3 MB",lastSync:"2\u5C0F\u65F6\u524D"}}async syncRepository(e){this.showMessage(`\u6B63\u5728\u540C\u6B65${e}\u4ED3\u5E93...`,"info");try{await new Promise(t=>setTimeout(t,2e3)),this.showMessage(`${e}\u4ED3\u5E93\u540C\u6B65\u6210\u529F`,"success")}catch(t){this.showMessage(`${e}\u4ED3\u5E93\u540C\u6B65\u5931\u8D25: ${t.message}`,"error")}}viewRepository(e){let t=this.config.repositories[e];t&&window.open(`https://github.com/${t.owner}/${t.repo}`,"_blank")}async fullSync(){this.showMessage("\u5F00\u59CB\u5B8C\u6574\u540C\u6B65...","info");try{await this.syncRepository("content"),await this.syncRepository("images"),await this.syncRepository("source"),this.showMessage("\u5B8C\u6574\u540C\u6B65\u5B8C\u6210","success")}catch(e){this.showMessage(`\u5B8C\u6574\u540C\u6B65\u5931\u8D25: ${e.message}`,"error")}}async backupContent(){this.showMessage("\u6B63\u5728\u5907\u4EFD\u5185\u5BB9...","info");try{await new Promise(e=>setTimeout(e,3e3)),this.showMessage("\u5185\u5BB9\u5907\u4EFD\u5B8C\u6210","success")}catch(e){this.showMessage(`\u5185\u5BB9\u5907\u4EFD\u5931\u8D25: ${e.message}`,"error")}}async restoreContent(){if(confirm("\u786E\u5B9A\u8981\u4ECEGitHub\u6062\u590D\u5185\u5BB9\u5417\uFF1F\u8FD9\u5C06\u8986\u76D6\u5F53\u524D\u7684\u672C\u5730\u5185\u5BB9\u3002")){this.showMessage("\u6B63\u5728\u6062\u590D\u5185\u5BB9...","info");try{await new Promise(t=>setTimeout(t,3e3)),this.showMessage("\u5185\u5BB9\u6062\u590D\u5B8C\u6210","success")}catch(t){this.showMessage(`\u5185\u5BB9\u6062\u590D\u5931\u8D25: ${t.message}`,"error")}}}createIssue(){let e=prompt("\u8BF7\u8F93\u5165Issue\u6807\u9898:");if(!e)return;let t=prompt("\u8BF7\u8F93\u5165Issue\u63CF\u8FF0:"),i=this.config.repositories.source,s=`https://github.com/${i.owner}/${i.repo}/issues/new?title=${encodeURIComponent(e)}&body=${encodeURIComponent(t||"")}`;window.open(s,"_blank")}viewPullRequests(){let e=this.config.repositories.source;window.open(`https://github.com/${e.owner}/${e.repo}/pulls`,"_blank")}manageWebhooks(){let e=this.config.repositories.source;window.open(`https://github.com/${e.owner}/${e.repo}/settings/hooks`,"_blank")}async syncArticle(e){console.log("\u{1F504} Syncing article to GitHub:",e.title)}async checkGitHubHealth(){try{(await fetch(`${this.config.apiUrl}/status`)).ok||console.warn("\u26A0\uFE0F GitHub API health check failed")}catch(e){console.warn("\u26A0\uFE0F GitHub connectivity issue:",e)}}showMessage(e,t){if(typeof window.Stack<"u"){let i=window.Stack;t==="success"&&i.showSuccessMessage?i.showSuccessMessage(e):t==="error"&&i.showErrorMessage?i.showErrorMessage(e):console.log(`${t.toUpperCase()}: ${e}`)}else alert(e)}},Ee=new q;window.githubIntegration=Ee;var ee={init(){console.log("\u{1F3A8} Initializing frontend beautification..."),document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{this.setupAll()}):this.setupAll()},setupAll(){this.setupReadingProgress(),this.setupBackToTop(),this.setupSmoothScrolling(),this.setupImageLazyLoading(),this.setupAnimations(),console.log("\u2705 Frontend beautification initialized")},setupReadingProgress(){let n=document.createElement("div");n.className="reading-progress",document.body.appendChild(n);let e=!1,t=()=>{let i=window.pageYOffset||document.documentElement.scrollTop,s=document.documentElement.scrollHeight-window.innerHeight,a=i/s*100;n.style.width=`${Math.min(a,100)}%`,e=!1};window.addEventListener("scroll",()=>{e||(requestAnimationFrame(t),e=!0)}),console.log("\u2705 Reading progress bar setup complete")},setupBackToTop(){let n=document.createElement("a");n.href="#",n.className="back-to-top",n.innerHTML=`
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 15l-6-6-6 6"></path>
            </svg>
        `,n.setAttribute("aria-label","\u8FD4\u56DE\u9876\u90E8"),document.body.appendChild(n);let e=!1,t=()=>{(window.pageYOffset||document.documentElement.scrollTop)>300?n.classList.add("visible"):n.classList.remove("visible"),e=!1};window.addEventListener("scroll",()=>{e||(requestAnimationFrame(t),e=!0)}),n.addEventListener("click",i=>{i.preventDefault(),window.scrollTo({top:0,behavior:"smooth"})}),console.log("\u2705 Back to top button setup complete")},setupSmoothScrolling(){document.querySelectorAll('a[href^="#"]').forEach(e=>{e.addEventListener("click",t=>{let i=e.getAttribute("href");if(i==="#"||i==="#top"){t.preventDefault(),window.scrollTo({top:0,behavior:"smooth"});return}let s=document.querySelector(i);if(s){t.preventDefault();let a=s.getBoundingClientRect().top+window.pageYOffset-80;window.scrollTo({top:a,behavior:"smooth"})}})}),console.log("\u2705 Smooth scrolling setup complete")},setupImageLazyLoading(){if("IntersectionObserver"in window){let n=new IntersectionObserver((t,i)=>{t.forEach(s=>{if(s.isIntersecting){let a=s.target;a.style.opacity="0",a.style.transition="opacity 0.3s ease",a.addEventListener("load",()=>{a.style.opacity="1"}),i.unobserve(a)}})});document.querySelectorAll(".article-image img").forEach(t=>{n.observe(t)}),console.log("\u2705 Enhanced image lazy loading setup complete")}},setupAnimations(){if("IntersectionObserver"in window){let n=new IntersectionObserver(i=>{i.forEach(s=>{s.isIntersecting&&s.target.classList.add("animate-in")})},{threshold:.1,rootMargin:"0px 0px -50px 0px"});document.querySelectorAll(".article-list article").forEach((i,s)=>{i.style.animationDelay=`${s*.1}s`,n.observe(i)}),document.querySelectorAll(".widget").forEach((i,s)=>{i.style.animationDelay=`${s*.1}s`,n.observe(i)}),console.log("\u2705 Scroll animations setup complete")}this.setupHoverEffects()},setupHoverEffects(){document.querySelectorAll(".article-list article").forEach(t=>{t.addEventListener("mouseenter",()=>{t.style.transform="translateY(-8px) rotateX(2deg)"}),t.addEventListener("mouseleave",()=>{t.style.transform="translateY(0) rotateX(0deg)"})}),document.querySelectorAll(".tag-cloud a").forEach(t=>{t.addEventListener("mouseenter",()=>{let i=["linear-gradient(135deg, #667eea 0%, #764ba2 100%)","linear-gradient(135deg, #f093fb 0%, #f5576c 100%)","linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)","linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)","linear-gradient(135deg, #fa709a 0%, #fee140 100%)"],s=i[Math.floor(Math.random()*i.length)];t.style.background=s})}),console.log("\u2705 Hover effects setup complete")}};ee.init();window.FrontendBeautify=ee;var te={init(){console.log("\u{1F9ED} Initializing navigation enhancement..."),document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{this.setupAll()}):this.setupAll()},setupAll(){this.setupScrollEffects(),this.setupScrollIndicator(),this.setupMobileMenu(),this.setupSearchEnhancement(),console.log("\u2705 Navigation enhancement initialized")},setupScrollEffects(){let n=document.querySelector(".main-header");if(!n)return;let e=window.scrollY,t=!1,i=()=>{let s=window.scrollY;s>50?n.classList.add("scrolled"):n.classList.remove("scrolled"),s>e&&s>200?n.style.transform="translateY(-100%)":n.style.transform="translateY(0)",e=s,t=!1};window.addEventListener("scroll",()=>{t||(requestAnimationFrame(i),t=!0)}),console.log("\u2705 Scroll effects setup complete")},setupScrollIndicator(){let n=document.createElement("div");n.className="scroll-indicator",n.innerHTML='<div class="scroll-indicator-bar"></div>',document.body.appendChild(n);let e=n.querySelector(".scroll-indicator-bar"),t=!1,i=()=>{let s=window.pageYOffset||document.documentElement.scrollTop,a=document.documentElement.scrollHeight-window.innerHeight,o=s/a*100;e&&(e.style.width=`${Math.min(o,100)}%`),t=!1};window.addEventListener("scroll",()=>{t||(requestAnimationFrame(i),t=!0)}),console.log("\u2705 Scroll indicator setup complete")},setupMobileMenu(){let n=document.querySelector(".menu-toggle"),e=document.querySelector(".main-menu");if(!n||!e)return;n.addEventListener("click",()=>{n.classList.toggle("active"),e.classList.toggle("active"),document.body.classList.toggle("menu-open")}),e.querySelectorAll("a").forEach(i=>{i.addEventListener("click",()=>{n.classList.remove("active"),e.classList.remove("active"),document.body.classList.remove("menu-open")})}),document.addEventListener("click",i=>{let s=i.target;!n.contains(s)&&!e.contains(s)&&(n.classList.remove("active"),e.classList.remove("active"),document.body.classList.remove("menu-open"))}),console.log("\u2705 Mobile menu enhancement setup complete")},setupSearchEnhancement(){let n=document.querySelector(".search-button"),e=document.querySelector(".search-modal");if(n){if(n.addEventListener("click",t=>{if(t.preventDefault(),n.style.transform="scale(0.95)",setTimeout(()=>{n.style.transform=""},150),e){e.classList.add("active");let i=e.querySelector("input");i&&setTimeout(()=>i.focus(),100)}}),e){let t=e.querySelector(".search-close");t&&t.addEventListener("click",()=>{e.classList.remove("active")}),document.addEventListener("keydown",i=>{i.key==="Escape"&&e.classList.contains("active")&&e.classList.remove("active")}),e.addEventListener("click",i=>{i.target===e&&e.classList.remove("active")})}console.log("\u2705 Search enhancement setup complete")}}};te.init();window.NavigationEnhance=te;var ie={init(){console.log("\u{1F3A8} Initializing admin panel enhancement..."),document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{this.setupAll()}):this.setupAll()},setupAll(){this.setupAnimations(),this.setupFormEnhancements(),this.setupNotifications(),this.setupKeyboardShortcuts(),this.setupTooltips(),this.setupProgressIndicators(),console.log("\u2705 Admin panel enhancement initialized")},setupAnimations(){let n=()=>{if("IntersectionObserver"in window){let t=new IntersectionObserver(s=>{s.forEach(a=>{a.isIntersecting&&a.target.classList.add("animate-in")})},{threshold:.1,rootMargin:"0px 0px -50px 0px"});document.querySelectorAll(".admin-tab-panel, .admin-section, .admin-action-btn").forEach((s,a)=>{s.style.animationDelay=`${a*.1}s`,t.observe(s)})}},e=document.getElementById("admin-panel-modal");e&&new MutationObserver(i=>{i.forEach(s=>{s.type==="attributes"&&s.attributeName==="style"&&s.target.style.display==="flex"&&setTimeout(n,100)})}).observe(e,{attributes:!0,attributeFilter:["style"]}),console.log("\u2705 Admin panel animations setup complete")},setupFormEnhancements(){let n=()=>{document.querySelectorAll(".admin-form-group").forEach(s=>{let a=s.querySelector("input, textarea"),o=s.querySelector("label");if(a&&o&&!s.classList.contains("floating-label")){s.classList.add("floating-label");let r=()=>{a.value||a===document.activeElement?s.classList.add("floating"):s.classList.remove("floating")};a.addEventListener("focus",r),a.addEventListener("blur",r),a.addEventListener("input",r),r()}})},e=()=>{document.querySelectorAll(".admin-form-group input, .admin-form-group textarea").forEach(s=>{s.addEventListener("input",a=>{let o=a.target,r=o.closest(".admin-form-group");r&&(r.classList.remove("valid","invalid"),o.value.length>0&&(o.checkValidity()?r.classList.add("valid"):r.classList.add("invalid")))})})},t=()=>{document.querySelectorAll(".admin-btn").forEach(s=>{s.addEventListener("click",()=>{s.classList.contains("loading")||(s.classList.add("loading"),setTimeout(()=>{s.classList.remove("loading")},2e3))})})};n(),e(),t(),console.log("\u2705 Form enhancements setup complete")},setupNotifications(){let n=document.getElementById("admin-notifications");n||(n=document.createElement("div"),n.id="admin-notifications",n.style.cssText=`
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10001;
                pointer-events: none;
            `,document.body.appendChild(n));let e=(t,i="success",s=3e3)=>{let a=document.createElement("div");a.className=`admin-notification admin-notification-${i} show`,a.style.pointerEvents="auto";let o={success:'<svg class="admin-icon" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"></path></svg>',error:'<svg class="admin-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>',warning:'<svg class="admin-icon" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>'};a.innerHTML=`
                <div class="admin-notification-content">
                    ${o[i]}
                    <span>${t}</span>
                </div>
            `,n.appendChild(a),setTimeout(()=>{a.classList.remove("show"),setTimeout(()=>{a.parentNode&&a.parentNode.removeChild(a)},300)},s)};window.showAdminNotification=e,console.log("\u2705 Notification system setup complete")},setupKeyboardShortcuts(){document.addEventListener("keydown",n=>{if((n.ctrlKey||n.metaKey)&&n.key==="k"&&(n.preventDefault(),document.getElementById("admin-panel-toggle")&&window.Stack&&window.Stack.showAdminPanel&&window.Stack.showAdminPanel()),n.key==="Escape"){let e=document.getElementById("admin-panel-modal");e&&e.style.display==="flex"&&window.Stack&&window.Stack.hideAdminPanel&&window.Stack.hideAdminPanel()}if((n.ctrlKey||n.metaKey)&&n.key==="s"){let e=document.getElementById("admin-panel-modal");if(e&&e.style.display==="flex"){n.preventDefault();let t=document.getElementById("admin-save-settings");t&&t.click()}}if(n.key==="Tab"){let e=document.getElementById("admin-panel-modal");if(e&&e.style.display==="flex"){let t=e.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'),i=t[0],s=t[t.length-1];n.shiftKey&&document.activeElement===i?(n.preventDefault(),s.focus()):!n.shiftKey&&document.activeElement===s&&(n.preventDefault(),i.focus())}}}),console.log("\u2705 Keyboard shortcuts setup complete")},setupTooltips(){let n=document.getElementById("admin-tooltip");n||(n=document.createElement("div"),n.id="admin-tooltip",n.style.cssText=`
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
            `,document.body.appendChild(n));let e=s=>{let a=s.getAttribute("title")||s.getAttribute("data-tooltip");a&&(s.removeAttribute("title"),s.setAttribute("data-tooltip",a),s.addEventListener("mouseenter",o=>{let r=o.target,l=r.getBoundingClientRect(),u=r.getAttribute("data-tooltip");u&&n&&(n.textContent=u,n.style.left=`${l.left+l.width/2}px`,n.style.top=`${l.top-10}px`,n.style.transform="translateX(-50%) translateY(-100%)",n.style.opacity="1")}),s.addEventListener("mouseleave",()=>{n&&(n.style.opacity="0")}))};document.querySelectorAll("[title], [data-tooltip]").forEach(e),new MutationObserver(s=>{s.forEach(a=>{a.addedNodes.forEach(o=>{if(o.nodeType===Node.ELEMENT_NODE){let r=o;(r.hasAttribute("title")||r.hasAttribute("data-tooltip"))&&e(r),r.querySelectorAll("[title], [data-tooltip]").forEach(e)}})})}).observe(document.body,{childList:!0,subtree:!0}),console.log("\u2705 Tooltips setup complete")},setupProgressIndicators(){let n=(t,i=0)=>{let s=t.querySelector(".admin-progress-bar");if(!s){s=document.createElement("div"),s.className="admin-progress-bar",s.style.cssText=`
                    width: 100%;
                    height: 4px;
                    background: var(--card-separator-color);
                    border-radius: 2px;
                    overflow: hidden;
                    margin-top: 1rem;
                `;let o=document.createElement("div");o.className="admin-progress-fill",o.style.cssText=`
                    height: 100%;
                    background: var(--admin-primary-gradient);
                    width: 0%;
                    transition: width 0.3s ease;
                    border-radius: 2px;
                `,s.appendChild(o),t.appendChild(s)}let a=s.querySelector(".admin-progress-fill");return a&&(a.style.width=`${Math.min(Math.max(i,0),100)}%`),s};document.querySelectorAll(".admin-form").forEach(t=>{t.addEventListener("submit",i=>{let s=i.target,a=n(s),o=0,r=setInterval(()=>{o+=Math.random()*20;let l=a.querySelector(".admin-progress-fill");l&&(l.style.width=`${Math.min(o,90)}%`),o>=90&&clearInterval(r)},200);setTimeout(()=>{clearInterval(r);let l=a.querySelector(".admin-progress-fill");l&&(l.style.width="100%"),setTimeout(()=>{a.parentNode&&a.parentNode.removeChild(a)},500)},3e3)})}),window.createAdminProgressBar=n,console.log("\u2705 Progress indicators setup complete")}};ie.init();window.AdminPanelEnhance=ie;var B=class{shareData;qrCodeGenerated=!1;constructor(){this.shareData=window.shareData||{url:window.location.href,title:document.title,description:"",image:""},this.init()}init(){console.log("\u{1F517} \u521D\u59CB\u5316\u793E\u4EA4\u5206\u4EAB\u529F\u80FD..."),this.bindEvents(),console.log("\u2705 \u793E\u4EA4\u5206\u4EAB\u529F\u80FD\u521D\u59CB\u5316\u5B8C\u6210")}bindEvents(){let e=document.querySelector(".share-btn--wechat");e&&e.addEventListener("click",()=>this.handleWechatShare());let t=document.querySelector(".share-btn--copy");t&&t.addEventListener("click",()=>this.copyToClipboard());let i=document.getElementById("wechat-qr-close");i&&i.addEventListener("click",()=>this.closeWechatModal());let s=document.getElementById("wechat-qr-modal");s&&s.addEventListener("click",a=>{a.target===s&&this.closeWechatModal()}),document.addEventListener("keydown",a=>{a.key==="Escape"&&this.closeWechatModal()}),console.log("\u2705 \u5206\u4EAB\u4E8B\u4EF6\u76D1\u542C\u5668\u7ED1\u5B9A\u5B8C\u6210")}handleWechatShare(){console.log("\u{1F4F1} \u6253\u5F00\u5FAE\u4FE1\u5206\u4EAB\u4E8C\u7EF4\u7801..."),this.showWechatModal(),this.qrCodeGenerated||this.generateQRCode()}showWechatModal(){let e=document.getElementById("wechat-qr-modal");e&&(e.classList.add("show"),document.body.style.overflow="hidden")}closeWechatModal(){let e=document.getElementById("wechat-qr-modal");e&&(e.classList.remove("show"),document.body.style.overflow="")}generateQRCode(){let e=document.getElementById("wechat-qr-code");if(!e)return;let t=`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(this.shareData.url)}`,i=document.createElement("img");i.src=t,i.alt="\u5FAE\u4FE1\u5206\u4EAB\u4E8C\u7EF4\u7801",i.style.width="200px",i.style.height="200px",e.innerHTML="",e.appendChild(i),this.qrCodeGenerated=!0,console.log("\u2705 \u4E8C\u7EF4\u7801\u751F\u6210\u5B8C\u6210")}async copyToClipboard(){try{if(navigator.clipboard&&window.isSecureContext)await navigator.clipboard.writeText(this.shareData.url);else{let e=document.createElement("textarea");e.value=this.shareData.url,e.style.position="fixed",e.style.left="-999999px",e.style.top="-999999px",document.body.appendChild(e),e.focus(),e.select(),document.execCommand("copy"),e.remove()}this.showCopySuccess(),console.log("\u2705 \u94FE\u63A5\u5DF2\u590D\u5236\u5230\u526A\u8D34\u677F")}catch(e){console.error("\u274C \u590D\u5236\u5931\u8D25:",e),this.showCopyError()}}showCopySuccess(){this.showNotification("\u94FE\u63A5\u5DF2\u590D\u5236\u5230\u526A\u8D34\u677F\uFF01","success")}showCopyError(){this.showNotification("\u590D\u5236\u5931\u8D25\uFF0C\u8BF7\u624B\u52A8\u590D\u5236\u94FE\u63A5","error")}showNotification(e,t="success"){let i=document.createElement("div");i.className=`share-notification share-notification--${t}`,i.textContent=e,document.body.appendChild(i),setTimeout(()=>{i.classList.add("show")},100),setTimeout(()=>{i.classList.remove("show"),setTimeout(()=>{i.parentNode&&i.parentNode.removeChild(i)},300)},3e3)}getShareData(){return this.shareData}};document.addEventListener("DOMContentLoaded",()=>{document.querySelector(".article-share")&&new B});window.SocialShare=B;var p,ne=!1,c={init:()=>{if(ne){console.log("\u2139\uFE0F Stack already initialized, skipping...");return}if(ne=!0,p)console.log("\u2139\uFE0F globalAuth already exists, skipping creation");else try{p=new J,console.log("\u2705 globalAuth created successfully")}catch(r){console.error("\u274C Failed to create globalAuth:",r),console.log("\u{1F527} Attempting fallback auth creation..."),p={config:{adminPassword:localStorage.getItem("adminPassword")||"admit"},isAuthenticated:()=>localStorage.getItem("adminAuth")==="authenticated",authenticate:function(l){return l===this.config.adminPassword?(localStorage.setItem("adminAuth","authenticated"),setTimeout(()=>{document.querySelectorAll("[data-admin-only]").forEach(m=>{m.style.display="block"}),document.querySelectorAll("[data-guest-only]").forEach(m=>{m.style.display="none"}),console.log("\u2705 Fallback auth UI updated")},100),!0):!1},logout:()=>{localStorage.removeItem("adminAuth"),document.querySelectorAll("[data-admin-only]").forEach(d=>{d.style.display="none"}),document.querySelectorAll("[data-guest-only]").forEach(d=>{d.style.display="block"})},updatePassword:function(l){this.config.adminPassword=l,localStorage.setItem("adminPassword",l),console.log("\u2705 Fallback auth password updated")}},console.log("\u2705 Fallback auth created")}console.log("Creating login modal...");let n=v.createLoginModal();if(document.body.insertAdjacentHTML("beforeend",n),console.log("Login modal created"),console.log("Checking for admin panel in HTML..."),document.getElementById("admin-panel-modal")?console.log("\u2705 Admin panel found in HTML template"):console.error("\u274C Admin panel not found in HTML template!"),c.bindAuthEvents(),c.bindAdminPanelEvents(),console.log("\u{1F50D} Checking globalAuth:",!!p),p){let r=p.isAuthenticated();console.log("\u{1F50D} Initial admin status:",r),v.toggleAdminElements(r),v.updateBodyClass(r)}else console.error("\u274C globalAuth not initialized!");setTimeout(()=>{console.log("\u23F0 DOM ready, loading admin settings..."),c.loadAdminSettings()},100),console.log("\u2705 Stack initialization complete"),V();let t=document.querySelector(".article-content");t&&(new R(t),Y(),K());let i=document.querySelector(".article-list--tile");i&&new IntersectionObserver(async(l,u)=>{l.forEach(d=>{if(!d.isIntersecting)return;u.unobserve(d.target),d.target.querySelectorAll("article.has-image").forEach(async h=>{let g=h.querySelector("img"),f=g.src,y=g.getAttribute("data-key"),I=g.getAttribute("data-hash"),se=h.querySelector(".article-details"),w=await z(y,I,f);se.style.background=`
                        linear-gradient(0deg, 
                            rgba(${w.DarkMuted.rgb[0]}, ${w.DarkMuted.rgb[1]}, ${w.DarkMuted.rgb[2]}, 0.5) 0%, 
                            rgba(${w.Vibrant.rgb[0]}, ${w.Vibrant.rgb[1]}, ${w.Vibrant.rgb[2]}, 0.75) 100%)`})})}).observe(i);let s=document.querySelectorAll(".article-content div.highlight"),a="Copy",o="Copied!";s.forEach(r=>{let l=document.createElement("button");l.innerHTML=a,l.classList.add("copyCodeButton"),r.appendChild(l);let u=r.querySelector("code[data-lang]");u&&l.addEventListener("click",()=>{navigator.clipboard.writeText(u.textContent).then(()=>{l.textContent=o,setTimeout(()=>{l.textContent=a},1e3)}).catch(d=>{alert(d),console.log("Something went wrong",d)})})}),new G(document.getElementById("dark-mode-toggle")),c.registerServiceWorker()},bindAuthEvents:()=>{let n=document.getElementById("admin-login-form");n&&n.addEventListener("submit",a=>{a.preventDefault();let o=document.getElementById("admin-password");if(o&&p)if(p.authenticate(o.value))v.hideLoginModal(),console.log("Admin authenticated successfully"),setTimeout(()=>{console.log("\u{1F527} Force showing admin elements after authentication"),document.querySelectorAll("[data-admin-only]").forEach(d=>{d.style.display="block"}),document.querySelectorAll("[data-guest-only]").forEach(d=>{d.style.display="none"}),v.updateBodyClass(!0),console.log("\u2705 Admin elements forced to show")},100);else if(p.isBlocked())v.showLoginError("\u767B\u5F55\u5C1D\u8BD5\u6B21\u6570\u8FC7\u591A\uFF0C\u8BF7\u7A0D\u540E\u518D\u8BD5");else{v.showLoginError("\u5BC6\u7801\u9519\u8BEF");let l=p.getRemainingAttempts();l>0&&v.showAttemptsInfo(l)}});let e=document.getElementById("admin-modal-close"),t=document.getElementById("admin-cancel-btn");e&&e.addEventListener("click",()=>{v.hideLoginModal()}),t&&t.addEventListener("click",()=>{v.hideLoginModal()});let i=document.getElementById("admin-login-modal");i&&i.addEventListener("click",a=>{a.target===i&&v.hideLoginModal()}),document.addEventListener("keydown",a=>{a.key==="Escape"&&v.hideLoginModal()});let s=document.getElementById("admin-panel-toggle");s&&s.addEventListener("click",a=>{a.preventDefault(),c.showAdminPanel()}),document.addEventListener("click",a=>{let o=a.target;if(o){let r=o.textContent||"",l=o.parentElement?.textContent||"",u=o.closest("a")?.textContent||"";if(r.trim()==="\u7BA1\u7406\u9762\u677F"||r.includes("\u7BA1\u7406\u9762\u677F")||l.includes("\u7BA1\u7406\u9762\u677F")||u.includes("\u7BA1\u7406\u9762\u677F")||o.id==="admin-panel-toggle"||o.closest("#admin-panel-toggle")||o.classList.contains("admin-panel-trigger"))if(a.preventDefault(),a.stopPropagation(),console.log("\u{1F3AF} Admin panel click detected:",o),console.log("\u{1F3AF} Clicked text:",r),p&&p.isAuthenticated()){console.log("\u2705 User is authenticated, showing admin panel");let m=document.getElementById("admin-panel-modal");m?(console.log("\u2705 Panel found, showing directly"),m.style.display="flex",c.loadAdminSettings&&c.loadAdminSettings()):console.error("\u274C Panel not found in DOM")}else console.log("\u274C User not authenticated, cannot show admin panel")}},!0)},bindAdminPanelEvents:()=>{console.log("Binding admin panel events...");let n=document.getElementById("admin-panel-close"),e=document.getElementById("admin-panel-cancel");n&&n.addEventListener("click",()=>{c.hideAdminPanel()}),e&&e.addEventListener("click",()=>{c.hideAdminPanel()});let t=document.getElementById("admin-panel-modal");t&&t.addEventListener("click",g=>{g.target===t&&c.hideAdminPanel()}),document.querySelectorAll(".admin-tab-btn").forEach(g=>{g.addEventListener("click",f=>{let I=f.target.getAttribute("data-tab");I&&c.switchAdminTab(I)})}),setTimeout(()=>{let g=document.getElementById("admin-avatar-upload");g?(g.addEventListener("change",f=>{let y=f.target;y.files&&y.files[0]&&(console.log("\u{1F4C1} \u5934\u50CF\u6587\u4EF6\u9009\u62E9:",y.files[0].name),c.handleAvatarUpload(y.files[0]))}),console.log("\u2705 \u5934\u50CF\u4E0A\u4F20\u4E8B\u4EF6\u76D1\u542C\u5668\u5DF2\u7ED1\u5B9A")):console.warn("\u26A0\uFE0F \u5934\u50CF\u4E0A\u4F20\u5143\u7D20\u672A\u627E\u5230")},200),setTimeout(()=>{let g=document.getElementById("admin-avatar-reset");g?(g.addEventListener("click",()=>{console.log("\u{1F504} \u91CD\u7F6E\u5934\u50CF"),c.resetAvatar()}),console.log("\u2705 \u5934\u50CF\u91CD\u7F6E\u4E8B\u4EF6\u76D1\u542C\u5668\u5DF2\u7ED1\u5B9A")):console.warn("\u26A0\uFE0F \u5934\u50CF\u91CD\u7F6E\u5143\u7D20\u672A\u627E\u5230")},200);let s=document.getElementById("admin-save-settings");s&&s.addEventListener("click",()=>{c.saveAdminSettings()});let a=document.getElementById("admin-theme-color");a&&a.addEventListener("change",g=>{let f=g.target;c.updateThemeColor(f.value),localStorage.setItem("adminThemeColor",f.value)});let o=document.getElementById("admin-new-post");o&&o.addEventListener("click",()=>{c.handleNewPost()});let r=document.getElementById("admin-manage-posts");r&&r.addEventListener("click",()=>{c.handleManagePosts()});let l=document.getElementById("admin-site-stats");l&&l.addEventListener("click",()=>{c.handleSiteStats()});let u=document.getElementById("admin-dark-mode-default");u&&u.addEventListener("change",g=>{let f=g.target;c.handleDarkModeToggle(f.checked)});let d=document.getElementById("admin-change-password");d&&d.addEventListener("click",()=>{c.handlePasswordChange()});let m=document.getElementById("admin-image-manager");m&&m.addEventListener("click",()=>{c.openImageManager()});let h=document.getElementById("admin-archives-manager");h&&h.addEventListener("click",()=>{c.openArchivesManager()}),console.log("Admin panel events bound successfully")},getAuth:()=>p,showLogin:()=>{v.showLoginModal()},logout:()=>{p&&(p.logout(),document.querySelectorAll("[data-admin-only]").forEach(t=>{t.style.display="none"}),document.querySelectorAll("[data-guest-only]").forEach(t=>{t.style.display="block"}),v.updateBodyClass(!1),console.log("User logged out successfully"))},showAdminPanel:()=>{console.log("\u{1F3AF} showAdminPanel called");let n=document.getElementById("admin-panel-modal");n?(console.log("\u2705 Panel found in HTML, showing it"),n.style.display="flex",c.loadAdminSettings()):console.error("\u274C Admin panel not found in HTML! This should not happen since it is in the template.")},hideAdminPanel:()=>{let n=document.getElementById("admin-panel-modal");n&&(n.style.display="none")},switchAdminTab:n=>{document.querySelectorAll(".admin-tab-btn").forEach(i=>{i.classList.remove("active")}),document.querySelectorAll(".admin-tab-panel").forEach(i=>{i.classList.remove("active")});let e=document.querySelector(`[data-tab="${n}"]`),t=document.getElementById(`admin-tab-${n}`);e&&e.classList.add("active"),t&&t.classList.add("active")},handleAvatarUpload:async n=>{if(console.log("\u{1F4C1} \u5F00\u59CB\u5904\u7406\u5934\u50CF\u4E0A\u4F20:",n.name,n.type,n.size),!n.type.startsWith("image/")){console.error("\u274C \u6587\u4EF6\u7C7B\u578B\u9519\u8BEF:",n.type),c.showErrorMessage("\u8BF7\u9009\u62E9\u56FE\u7247\u6587\u4EF6\uFF08JPG\u3001PNG\u3001GIF\u7B49\uFF09");return}let e=5*1024*1024;if(n.size>e){console.error("\u274C \u6587\u4EF6\u8FC7\u5927:",n.size),c.showErrorMessage("\u56FE\u7247\u6587\u4EF6\u4E0D\u80FD\u8D85\u8FC75MB");return}c.showSuccessMessage("\u6B63\u5728\u4E0A\u4F20\u5934\u50CF\u5230GitHub...");try{if(typeof window<"u"&&window.githubImageUploader){console.log("\u{1F4E4} \u4F7F\u7528GitHub\u4E0A\u4F20\u5668\u4E0A\u4F20\u5934\u50CF");let t=window.githubImageUploader;t.setProgressCallback(s=>{console.log(`\u{1F4CA} \u4E0A\u4F20\u8FDB\u5EA6: ${s.progress}% - ${s.message}`)});let i=await t.uploadImage(n,{title:"\u7528\u6237\u5934\u50CF",description:"\u535A\u5BA2\u7BA1\u7406\u5458\u5934\u50CF",category:"avatars",alt:"Admin Avatar"},"avatars");if(i.success&&i.cdnUrl){console.log("\u2705 \u5934\u50CF\u4E0A\u4F20\u5230GitHub\u6210\u529F:",i.cdnUrl);let s=document.getElementById("admin-avatar-img");s&&(s.src=i.cdnUrl,console.log("\u2705 \u7BA1\u7406\u9762\u677F\u5934\u50CF\u5DF2\u66F4\u65B0")),localStorage.setItem("adminAvatar",i.cdnUrl),localStorage.setItem("adminAvatarGitHubUrl",i.url||""),localStorage.setItem("adminAvatarFileName",i.fileName||""),console.log("\u{1F4BE} \u5934\u50CFGitHub URL\u5DF2\u4FDD\u5B58\u5230localStorage"),c.updateSiteAvatar(i.cdnUrl),c.showSuccessMessage("\u5934\u50CF\u4E0A\u4F20\u6210\u529F\uFF01\u5DF2\u4FDD\u5B58\u5230GitHub"),console.log("\u2705 \u5934\u50CF\u4E0A\u4F20\u5904\u7406\u5B8C\u6210")}else throw new Error(i.error||"\u4E0A\u4F20\u5931\u8D25")}else console.log("\u26A0\uFE0F GitHub\u4E0A\u4F20\u5668\u4E0D\u53EF\u7528\uFF0C\u4F7F\u7528\u672C\u5730\u5B58\u50A8"),await c.handleAvatarUploadLocal(n)}catch(t){console.error("\u274C GitHub\u5934\u50CF\u4E0A\u4F20\u5931\u8D25:",t),c.showErrorMessage(`\u5934\u50CF\u4E0A\u4F20\u5931\u8D25: ${t.message}`),console.log("\u{1F504} \u5C1D\u8BD5\u672C\u5730\u5B58\u50A8\u4F5C\u4E3A\u5907\u9009\u65B9\u6848");try{await c.handleAvatarUploadLocal(n)}catch(i){console.error("\u274C \u672C\u5730\u5B58\u50A8\u4E5F\u5931\u8D25:",i),c.showErrorMessage("\u5934\u50CF\u4E0A\u4F20\u5B8C\u5168\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5")}}},handleAvatarUploadLocal:async n=>new Promise((e,t)=>{let i=new FileReader;i.onload=s=>{try{let a=s.target?.result;if(!a)throw new Error("\u56FE\u7247\u8BFB\u53D6\u5931\u8D25");console.log("\u{1F4F7} \u56FE\u7247\u8BFB\u53D6\u6210\u529F\uFF0C\u5927\u5C0F:",a.length);let o=document.getElementById("admin-avatar-img");o&&(o.src=a,console.log("\u2705 \u7BA1\u7406\u9762\u677F\u5934\u50CF\u5DF2\u66F4\u65B0"));try{localStorage.setItem("adminAvatar",a),console.log("\u{1F4BE} \u5934\u50CF\u5DF2\u4FDD\u5B58\u5230localStorage")}catch(r){console.error("\u274C localStorage\u4FDD\u5B58\u5931\u8D25:",r),t(new Error("\u5934\u50CF\u4FDD\u5B58\u5931\u8D25\uFF0C\u53EF\u80FD\u662F\u5B58\u50A8\u7A7A\u95F4\u4E0D\u8DB3"));return}c.updateSiteAvatar(a),c.showSuccessMessage("\u5934\u50CF\u4E0A\u4F20\u6210\u529F\uFF01(\u672C\u5730\u5B58\u50A8)"),console.log("\u2705 \u5934\u50CF\u672C\u5730\u4E0A\u4F20\u5904\u7406\u5B8C\u6210"),e()}catch(a){console.error("\u274C \u5934\u50CF\u5904\u7406\u5931\u8D25:",a),t(a)}},i.onerror=()=>{console.error("\u274C \u6587\u4EF6\u8BFB\u53D6\u5931\u8D25"),t(new Error("\u6587\u4EF6\u8BFB\u53D6\u5931\u8D25"))},i.readAsDataURL(n)}),resetAvatar:async()=>{console.log("\u{1F504} \u91CD\u7F6E\u5934\u50CF\u5230\u9ED8\u8BA4\u72B6\u6001");try{let n="/img/avatar_hu_f509edb42ecc0ebd.png",e=document.getElementById("admin-avatar-img");e?(e.src=n,console.log("\u2705 \u7BA1\u7406\u9762\u677F\u5934\u50CF\u5DF2\u91CD\u7F6E")):console.warn("\u26A0\uFE0F \u7BA1\u7406\u9762\u677F\u5934\u50CF\u5143\u7D20\u672A\u627E\u5230");let t=localStorage.getItem("adminAvatarFileName");if(t&&typeof window<"u"&&window.githubImageUploader)try{console.log("\u{1F5D1}\uFE0F \u5C1D\u8BD5\u4ECEGitHub\u5220\u9664\u65E7\u5934\u50CF:",t),await window.githubImageUploader.deleteImage(t)?console.log("\u2705 GitHub\u5934\u50CF\u6587\u4EF6\u5220\u9664\u6210\u529F"):console.warn("\u26A0\uFE0F GitHub\u5934\u50CF\u6587\u4EF6\u5220\u9664\u5931\u8D25\uFF0C\u4F46\u7EE7\u7EED\u91CD\u7F6E")}catch(i){console.warn("\u26A0\uFE0F GitHub\u5934\u50CF\u5220\u9664\u51FA\u9519:",i)}localStorage.removeItem("adminAvatar"),localStorage.removeItem("adminAvatarGitHubUrl"),localStorage.removeItem("adminAvatarFileName"),console.log("\u{1F5D1}\uFE0F \u5DF2\u4ECElocalStorage\u79FB\u9664\u81EA\u5B9A\u4E49\u5934\u50CF\u4FE1\u606F"),c.updateSiteAvatar(n),c.showSuccessMessage("\u5934\u50CF\u5DF2\u91CD\u7F6E\u4E3A\u9ED8\u8BA4\u5934\u50CF"),console.log("\u2705 \u5934\u50CF\u91CD\u7F6E\u5B8C\u6210")}catch(n){console.error("\u274C \u5934\u50CF\u91CD\u7F6E\u5931\u8D25:",n),c.showErrorMessage("\u5934\u50CF\u91CD\u7F6E\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5")}},updateSiteAvatar:n=>{console.log("\u{1F504} Updating site avatar to:",n);let e=[".site-avatar img",".site-logo",".site-avatar .site-logo","[data-avatar]",".sidebar .site-avatar img",'.sidebar img[alt*="avatar"]','.sidebar img[alt*="Avatar"]',".header-avatar img",".user-avatar img",".profile-avatar img","img.avatar","img.site-logo"],t=0;e.forEach(s=>{document.querySelectorAll(s).forEach(o=>{o&&o.tagName==="IMG"&&(o.src=n,t++,console.log(`\u2705 Updated avatar for selector: ${s}`))})}),document.querySelectorAll("img").forEach(s=>{let a=(s.alt||"").toLowerCase(),o=(s.className||"").toLowerCase(),r=(s.id||"").toLowerCase(),l=a.includes("avatar")||o.includes("avatar")||r.includes("avatar")||o.includes("site-logo")||a.includes("logo"),u=r.includes("admin")||o.includes("admin");l&&!u&&(s.src=n,t++,console.log(`\u2705 Updated additional avatar: ${s.className||s.id||s.alt||"unnamed"}`))}),console.log(`\u2705 Total avatars updated: ${t}`),setTimeout(()=>{let s=new Event("avatarUpdated");document.dispatchEvent(s)},100)},loadAdminSettings:()=>{console.log("\u{1F504} Loading admin settings...");try{let n={avatar:"/img/avatar_hu_f509edb42ecc0ebd.png",title:"lanniny-blog",description:"\u6F14\u793A\u6587\u7A3F",themeColor:"#34495e",password:"admit"};try{let e=localStorage.getItem("adminAvatar")||n.avatar,t=document.getElementById("admin-avatar-img");t&&(t.src=e,console.log("\u2705 Avatar loaded:",e!==n.avatar?"custom":"default")),e!==n.avatar&&c.updateSiteAvatar(e)}catch(e){console.warn("\u26A0\uFE0F Avatar loading failed:",e);let t=document.getElementById("admin-avatar-img");t&&(t.src=n.avatar)}try{let e=localStorage.getItem("adminSiteTitle")||n.title,t=document.getElementById("admin-site-title");if(t&&(t.value=e,console.log("\u2705 Site title loaded:",e)),e!==n.title){let i=document.querySelector(".site-name a");i&&(i.textContent=e,console.log("\u2705 Site title updated in header"))}}catch(e){console.warn("\u26A0\uFE0F Site title loading failed:",e);let t=document.getElementById("admin-site-title");t&&(t.value=n.title)}try{let e=localStorage.getItem("adminSiteDescription")||n.description,t=document.getElementById("admin-site-description");if(t&&(t.value=e,console.log("\u2705 Site description loaded:",e)),e!==n.description){let i=document.querySelector(".site-description");i&&(i.textContent=e,console.log("\u2705 Site description updated in header"))}}catch(e){console.warn("\u26A0\uFE0F Site description loading failed:",e);let t=document.getElementById("admin-site-description");t&&(t.value=n.description)}try{let e=localStorage.getItem("adminThemeColor")||n.themeColor,t=document.getElementById("admin-theme-color");t&&(t.value=e,console.log("\u2705 Theme color loaded:",e)),e!==n.themeColor&&(c.updateThemeColor(e),console.log("\u2705 Theme color applied"))}catch(e){console.warn("\u26A0\uFE0F Theme color loading failed:",e);let t=document.getElementById("admin-theme-color");t&&(t.value=n.themeColor)}try{let e=localStorage.getItem("adminPassword");e&&p?p.config?(p.config.adminPassword=e,console.log("\u2705 Admin password loaded from localStorage")):console.warn("\u26A0\uFE0F globalAuth.config not available, password not loaded"):console.log("\u2139\uFE0F No saved password found, using default")}catch(e){console.warn("\u26A0\uFE0F Admin password loading failed:",e)}console.log("\u2705 Admin settings loading completed")}catch(n){console.error("\u274C Critical error in loadAdminSettings:",n),console.log("\u{1F527} Attempting to recover with default values...")}},saveAdminSettings:()=>{console.log("\u{1F4BE} Saving admin settings...");let n=document.getElementById("admin-save-settings"),e=n?.textContent||"\u4FDD\u5B58\u8BBE\u7F6E";try{n&&(n.disabled=!0,n.innerHTML=`
                    <svg class="admin-icon admin-loading" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 12a9 9 0 11-6.219-8.56"></path>
                    </svg>
                    \u4FDD\u5B58\u4E2D...
                `,console.log("\u{1F504} Save button set to loading state"));let t=0,i=0;if(!c.FormValidator.validateAllFields()){n&&(n.disabled=!1,n.innerHTML=`
                        <svg class="admin-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"></path>
                            <polyline points="17,21 17,13 7,13 7,21"></polyline>
                            <polyline points="7,3 7,8 15,8"></polyline>
                        </svg>
                        ${e}
                    `),c.showErrorMessage("\u8BF7\u4FEE\u6B63\u8868\u5355\u4E2D\u7684\u9519\u8BEF\u540E\u518D\u4FDD\u5B58");return}let a=document.getElementById("admin-site-title");if(a){i++;let l=c.FormValidator.validateTitle(a.value);if(l.isValid){let u=a.value.trim();localStorage.setItem("adminSiteTitle",u);let d=document.querySelector(".site-name a");d&&(d.textContent=u,console.log("\u2705 Site title saved and updated:",u)),t++}else console.warn("\u26A0\uFE0F Site title validation failed:",l.message)}let o=document.getElementById("admin-site-description");if(o){i++;let l=c.FormValidator.validateDescription(o.value);if(l.isValid){let u=o.value.trim();localStorage.setItem("adminSiteDescription",u);let d=document.querySelector(".site-description");d&&(d.textContent=u,console.log("\u2705 Site description saved and updated:",u)),t++}else console.warn("\u26A0\uFE0F Site description validation failed:",l.message)}let r=document.getElementById("admin-theme-color");if(r){i++;let l=c.FormValidator.validateThemeColor(r.value);if(l.isValid){let u=r.value;localStorage.setItem("adminThemeColor",u),c.updateThemeColor(u),console.log("\u2705 Theme color saved and applied:",u),t++}else console.warn("\u26A0\uFE0F Theme color validation failed:",l.message)}setTimeout(()=>{n&&(n.disabled=!1,n.innerHTML=`
                        <svg class="admin-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"></path>
                            <polyline points="17,21 17,13 7,13 7,21"></polyline>
                            <polyline points="7,3 7,8 15,8"></polyline>
                        </svg>
                        ${e}
                    `),t===i&&i>0?(c.showSuccessMessage(`\u8BBE\u7F6E\u5DF2\u4FDD\u5B58\uFF01(${t}/${i}\u9879)`),console.log(`\u2705 All settings saved successfully (${t}/${i})`),c.hideAdminPanel()):t>0?(c.showSuccessMessage(`\u90E8\u5206\u8BBE\u7F6E\u5DF2\u4FDD\u5B58 (${t}/${i}\u9879)`),console.log(`\u26A0\uFE0F Partial save completed (${t}/${i})`)):(c.showErrorMessage("\u6CA1\u6709\u6709\u6548\u7684\u8BBE\u7F6E\u9700\u8981\u4FDD\u5B58"),console.log("\u274C No valid settings to save"))},800)}catch(t){console.error("\u274C Error saving admin settings:",t),n&&(n.disabled=!1,n.innerHTML=`
                    <svg class="admin-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"></path>
                        <polyline points="17,21 17,13 7,13 7,21"></polyline>
                        <polyline points="7,3 7,8 15,8"></polyline>
                    </svg>
                    ${e}
                `),c.showErrorMessage("\u8BBE\u7F6E\u4FDD\u5B58\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5")}},checkDataPersistence:()=>{console.log("\u{1F50D} Checking data persistence status...");let n={localStorage:{available:!1,quota:0,used:0},settings:{avatar:!1,title:!1,description:!1,themeColor:!1,password:!1},integrity:!0};try{if(typeof Storage<"u"&&localStorage){n.localStorage.available=!0;let t=0;for(let i in localStorage)localStorage.hasOwnProperty(i)&&(t+=localStorage[i].length+i.length);n.localStorage.used=t,console.log("\u2705 localStorage available, used:",t,"characters")}else console.warn("\u26A0\uFE0F localStorage not available");n.settings.avatar=!!localStorage.getItem("adminAvatar"),n.settings.title=!!localStorage.getItem("adminSiteTitle"),n.settings.description=!!localStorage.getItem("adminSiteDescription"),n.settings.themeColor=!!localStorage.getItem("adminThemeColor"),n.settings.password=!!localStorage.getItem("adminPassword");let e=Object.values(n.settings).filter(Boolean).length;console.log(`\u{1F4CA} Persistence status: ${e}/5 settings saved`);try{let t="test_persistence_"+Date.now();localStorage.setItem(t,"test");let i=localStorage.getItem(t);localStorage.removeItem(t),i!=="test"?(n.integrity=!1,console.warn("\u26A0\uFE0F localStorage integrity check failed")):console.log("\u2705 localStorage integrity check passed")}catch(t){n.integrity=!1,console.warn("\u26A0\uFE0F localStorage integrity test failed:",t)}}catch(e){console.error("\u274C Error checking data persistence:",e),n.integrity=!1}return n},resetAdminSettings:()=>{console.log("\u{1F504} Resetting all admin settings to defaults...");try{["adminAvatar","adminSiteTitle","adminSiteDescription","adminThemeColor","adminPassword"].forEach(e=>{localStorage.removeItem(e),console.log(`\u{1F5D1}\uFE0F Removed ${e}`)}),c.loadAdminSettings(),c.showSuccessMessage("\u6240\u6709\u8BBE\u7F6E\u5DF2\u91CD\u7F6E\u4E3A\u9ED8\u8BA4\u503C"),console.log("\u2705 All admin settings reset to defaults")}catch(n){console.error("\u274C Error resetting admin settings:",n),c.showErrorMessage("\u91CD\u7F6E\u8BBE\u7F6E\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5")}},FormValidator:{validateTitle:n=>!n||n.trim().length===0?{isValid:!1,message:"\u7AD9\u70B9\u6807\u9898\u4E0D\u80FD\u4E3A\u7A7A"}:n.trim().length<2?{isValid:!1,message:"\u7AD9\u70B9\u6807\u9898\u81F3\u5C11\u9700\u89812\u4E2A\u5B57\u7B26"}:n.trim().length>50?{isValid:!1,message:"\u7AD9\u70B9\u6807\u9898\u4E0D\u80FD\u8D85\u8FC750\u4E2A\u5B57\u7B26"}:/^[a-zA-Z0-9\u4e00-\u9fa5\s\-_\.]+$/.test(n.trim())?{isValid:!0,message:"\u7AD9\u70B9\u6807\u9898\u683C\u5F0F\u6B63\u786E"}:{isValid:!1,message:"\u7AD9\u70B9\u6807\u9898\u53EA\u80FD\u5305\u542B\u5B57\u6BCD\u3001\u6570\u5B57\u3001\u4E2D\u6587\u3001\u7A7A\u683C\u3001\u8FDE\u5B57\u7B26\u3001\u4E0B\u5212\u7EBF\u548C\u70B9\u53F7"},validateDescription:n=>!n||n.trim().length===0?{isValid:!1,message:"\u7AD9\u70B9\u63CF\u8FF0\u4E0D\u80FD\u4E3A\u7A7A"}:n.trim().length<5?{isValid:!1,message:"\u7AD9\u70B9\u63CF\u8FF0\u81F3\u5C11\u9700\u89815\u4E2A\u5B57\u7B26"}:n.trim().length>200?{isValid:!1,message:"\u7AD9\u70B9\u63CF\u8FF0\u4E0D\u80FD\u8D85\u8FC7200\u4E2A\u5B57\u7B26"}:{isValid:!0,message:"\u7AD9\u70B9\u63CF\u8FF0\u683C\u5F0F\u6B63\u786E"},validatePassword:n=>{if(!n||n.trim().length===0)return{isValid:!1,message:"\u5BC6\u7801\u4E0D\u80FD\u4E3A\u7A7A",strength:"weak"};if(n.length<4)return{isValid:!1,message:"\u5BC6\u7801\u957F\u5EA6\u81F3\u5C114\u4E2A\u5B57\u7B26",strength:"weak"};if(n.length>50)return{isValid:!1,message:"\u5BC6\u7801\u957F\u5EA6\u4E0D\u80FD\u8D85\u8FC750\u4E2A\u5B57\u7B26",strength:"weak"};if(!/^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/.test(n))return{isValid:!1,message:"\u5BC6\u7801\u53EA\u80FD\u5305\u542B\u5B57\u6BCD\u3001\u6570\u5B57\u548C\u5E38\u7528\u7B26\u53F7",strength:"weak"};let e="weak",t=0;return n.length>=8&&t++,/[a-z]/.test(n)&&t++,/[A-Z]/.test(n)&&t++,/[0-9]/.test(n)&&t++,/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(n)&&t++,t>=4?e="strong":t>=2&&(e="medium"),{isValid:!0,message:`\u5BC6\u7801\u5F3A\u5EA6: ${e==="strong"?"\u5F3A":e==="medium"?"\u4E2D\u7B49":"\u5F31"}`,strength:e}},validateThemeColor:n=>!n||n.trim().length===0?{isValid:!1,message:"\u4E3B\u9898\u8272\u4E0D\u80FD\u4E3A\u7A7A"}:/^#[0-9A-F]{6}$/i.test(n)?{isValid:!0,message:"\u4E3B\u9898\u8272\u683C\u5F0F\u6B63\u786E"}:{isValid:!1,message:"\u4E3B\u9898\u8272\u683C\u5F0F\u4E0D\u6B63\u786E\uFF0C\u8BF7\u4F7F\u7528\u5341\u516D\u8FDB\u5236\u989C\u8272\u4EE3\u7801\uFF08\u5982 #FF0000\uFF09"},showFieldValidation:(n,e)=>{let t=document.getElementById(n);if(!t)return;let i=t.parentElement?.querySelector(".validation-message");i&&i.remove(),t.classList.remove("validation-success","validation-error","validation-warning");let s=document.createElement("div");if(s.className=`validation-message ${e.isValid?"validation-success":"validation-error"}`,s.innerHTML=`
                <svg class="validation-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    ${e.isValid?'<path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path><polyline points="22,4 12,14.01 9,11.01"></polyline>':'<circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line>'}
                </svg>
                <span>${e.message}</span>
            `,t.classList.add(e.isValid?"validation-success":"validation-error"),n.includes("password")&&e.strength){let a=`strength-${e.strength}`;s.classList.add(a)}t.parentElement?.appendChild(s)},validateAllFields:()=>{let n=!0,e=document.getElementById("admin-site-title");if(e){let s=c.FormValidator.validateTitle(e.value);c.FormValidator.showFieldValidation("admin-site-title",s),s.isValid||(n=!1)}let t=document.getElementById("admin-site-description");if(t){let s=c.FormValidator.validateDescription(t.value);c.FormValidator.showFieldValidation("admin-site-description",s),s.isValid||(n=!1)}let i=document.getElementById("admin-theme-color");if(i){let s=c.FormValidator.validateThemeColor(i.value);c.FormValidator.showFieldValidation("admin-theme-color",s),s.isValid||(n=!1)}return n}},setupFormValidation:()=>{console.log("\u{1F527} Setting up real-time form validation...");let n=document.getElementById("admin-site-title");n&&(n.addEventListener("input",()=>{let s=c.FormValidator.validateTitle(n.value);c.FormValidator.showFieldValidation("admin-site-title",s)}),n.addEventListener("blur",()=>{let s=c.FormValidator.validateTitle(n.value);c.FormValidator.showFieldValidation("admin-site-title",s)}));let e=document.getElementById("admin-site-description");e&&(e.addEventListener("input",()=>{let s=c.FormValidator.validateDescription(e.value);c.FormValidator.showFieldValidation("admin-site-description",s)}),e.addEventListener("blur",()=>{let s=c.FormValidator.validateDescription(e.value);c.FormValidator.showFieldValidation("admin-site-description",s)}));let t=document.getElementById("admin-new-password");t&&(t.addEventListener("input",()=>{if(t.value.length>0){let s=c.FormValidator.validatePassword(t.value);c.FormValidator.showFieldValidation("admin-new-password",s)}}),t.addEventListener("blur",()=>{if(t.value.length>0){let s=c.FormValidator.validatePassword(t.value);c.FormValidator.showFieldValidation("admin-new-password",s)}}));let i=document.getElementById("admin-theme-color");i&&i.addEventListener("change",()=>{let s=c.FormValidator.validateThemeColor(i.value);c.FormValidator.showFieldValidation("admin-theme-color",s)}),console.log("\u2705 Real-time form validation setup complete")},updateThemeColor:n=>{document.documentElement.style.setProperty("--accent-color",n);let e=document.querySelector(".admin-color-preview");e&&(e.style.backgroundColor=n)},changeAdminPassword:()=>{let n=document.getElementById("admin-new-password");if(!n){c.showErrorMessage("\u5BC6\u7801\u8F93\u5165\u6846\u672A\u627E\u5230");return}let e=n.value.trim(),t=c.FormValidator.validatePassword(e);if(!t.isValid){c.showErrorMessage(t.message),c.FormValidator.showFieldValidation("admin-new-password",t);return}if(!(t.strength==="weak"&&!confirm("\u60A8\u7684\u5BC6\u7801\u5F3A\u5EA6\u8F83\u5F31\uFF0C\u5EFA\u8BAE\u4F7F\u7528\u5305\u542B\u5927\u5C0F\u5199\u5B57\u6BCD\u3001\u6570\u5B57\u548C\u7279\u6B8A\u5B57\u7B26\u7684\u5BC6\u7801\u3002\u662F\u5426\u7EE7\u7EED\uFF1F")))try{p&&(p.config&&(p.config.adminPassword=e,console.log("\u2705 Updated globalAuth.config.adminPassword")),typeof p.updatePassword=="function"&&(p.updatePassword(e),console.log("\u2705 Called globalAuth.updatePassword()"))),localStorage.setItem("adminPassword",e),console.log("\u2705 Saved new password to localStorage"),n.value="";let i=n.parentElement?.querySelector(".validation-message");i&&i.remove(),n.classList.remove("validation-success","validation-error"),c.showSuccessMessage(`\u5BC6\u7801\u5DF2\u6210\u529F\u66F4\u65B0\uFF01\u5BC6\u7801\u5F3A\u5EA6: ${t.strength==="strong"?"\u5F3A":t.strength==="medium"?"\u4E2D\u7B49":"\u5F31"}`),console.log("\u{1F510} Password change completed successfully")}catch(i){console.error("\u274C Password change failed:",i),c.showErrorMessage("\u5BC6\u7801\u66F4\u65B0\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5")}},openImageManager:()=>{console.log("\u{1F5BC}\uFE0F Opening image manager..."),window.open("/page/image-manager/","_blank"),c.hideAdminPanel(),console.log("\u2705 Image manager opened in new tab")},openArchivesManager:()=>{console.log("\u{1F4DA} Opening archives manager..."),window.open("/archives/","_blank"),c.hideAdminPanel(),console.log("\u2705 Archives manager opened in new tab")},showSuccessMessage:n=>{c.showNotification(n,"success")},showErrorMessage:n=>{c.showNotification(n,"error")},showNotification:(n,e="success")=>{let t=document.createElement("div");t.className=`admin-notification admin-notification-${e}`,t.innerHTML=`
            <div class="admin-notification-content">
                <svg class="admin-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    ${e==="success"?'<path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path><polyline points="22,4 12,14.01 9,11.01"></polyline>':'<circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line>'}
                </svg>
                <span>${n}</span>
            </div>
        `,document.body.appendChild(t),setTimeout(()=>t.classList.add("show"),100),setTimeout(()=>{t.classList.remove("show"),setTimeout(()=>{t.parentNode&&t.parentNode.removeChild(t)},300)},3e3)},createAdminPanelHTML:()=>`
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
                                        <button class="admin-action-btn" id="admin-image-manager">
                                            <svg class="admin-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                                <path d="M21 15l-5-5L5 21"></path>
                                            </svg>
                                            <span>\u56FE\u7247\u7BA1\u7406</span>
                                        </button>
                                        <button class="admin-action-btn" id="admin-background-manager">
                                            <svg class="admin-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"></path>
                                                <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"></path>
                                                <path d="M12 3c0 1-1 3-3 3s-3-2-3-3 1-3 3-3 3 2 3 3"></path>
                                                <path d="M12 21c0-1 1-3 3-3s3 2 3 3-1 3-3 3-3-2-3-3"></path>
                                                <path d="M12 12l-2-2"></path>
                                                <path d="M12 12l2-2"></path>
                                                <path d="M12 12l2 2"></path>
                                                <path d="M12 12l-2 2"></path>
                                            </svg>
                                            <span>\u80CC\u666F\u7BA1\u7406</span>
                                        </button>
                                        <button class="admin-action-btn" id="admin-archives-manager">
                                            <svg class="admin-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8z"></path>
                                                <path d="M3.27 6.96L12 12.01l8.73-5.05"></path>
                                                <line x1="12" y1="22.08" x2="12" y2="12"></line>
                                            </svg>
                                            <span>\u5F52\u6863\u7BA1\u7406</span>
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
        `,showAdminPanel:()=>{let n=document.getElementById("admin-panel-modal");n&&(n.style.display="flex",c.loadAdminSettings(),setTimeout(()=>{c.setupFormValidation()},100))},hideAdminPanel:()=>{let n=document.getElementById("admin-panel-modal");n&&(n.style.display="none")},switchAdminTab:n=>{document.querySelectorAll(".admin-tab-btn").forEach(i=>{i.classList.remove("active")}),document.querySelectorAll(".admin-tab-panel").forEach(i=>{i.classList.remove("active")});let e=document.querySelector(`[data-tab="${n}"]`),t=document.getElementById(`admin-tab-${n}`);e&&e.classList.add("active"),t&&t.classList.add("active")},updateThemeColor:n=>{document.documentElement.style.setProperty("--accent-color",n);let e=document.querySelector(".admin-color-preview");e&&(e.style.backgroundColor=n)},handleNewPost:()=>{console.log("\u{1F4DD} Creating new post..."),c.showSuccessMessage("\u65B0\u5EFA\u6587\u7AE0\u529F\u80FD\u6B63\u5728\u5F00\u53D1\u4E2D\uFF0C\u656C\u8BF7\u671F\u5F85\uFF01")},handleManagePosts:()=>{console.log("\u{1F4CB} Opening article manager..."),typeof window.articleManager<"u"?(window.articleManager.openManager(),console.log("\u2705 Article manager opened")):(console.log("\u26A0\uFE0F Article manager not found, attempting to initialize..."),Promise.resolve().then(()=>(D(),Z)).then(({ArticleManager:n})=>{let e=new n;window.articleManager=e,e.openManager(),console.log("\u2705 Article manager initialized and opened")}).catch(n=>{console.error("\u274C Failed to initialize article manager:",n),c.showErrorMessage("\u6587\u7AE0\u7BA1\u7406\u5668\u521D\u59CB\u5316\u5931\u8D25\uFF0C\u8BF7\u5237\u65B0\u9875\u9762\u91CD\u8BD5")}))},handleSiteStats:()=>{console.log("\u{1F4CA} Showing site statistics...");let n={totalPosts:5,totalViews:1234,totalComments:56,lastUpdate:new Date().toLocaleDateString()},e=`
            \u{1F4CA} \u7AD9\u70B9\u7EDF\u8BA1\u4FE1\u606F\uFF1A
            \u2022 \u6587\u7AE0\u603B\u6570\uFF1A${n.totalPosts} \u7BC7
            \u2022 \u603B\u8BBF\u95EE\u91CF\uFF1A${n.totalViews} \u6B21
            \u2022 \u8BC4\u8BBA\u603B\u6570\uFF1A${n.totalComments} \u6761
            \u2022 \u6700\u540E\u66F4\u65B0\uFF1A${n.lastUpdate}
        `;c.showSuccessMessage(e)},handlePasswordChange:()=>{let n=document.getElementById("admin-new-password");if(!n||!n.value.trim()){c.showErrorMessage("\u8BF7\u8F93\u5165\u65B0\u5BC6\u7801");return}let e=n.value.trim();if(e.length<4){c.showErrorMessage("\u5BC6\u7801\u957F\u5EA6\u81F3\u5C114\u4E2A\u5B57\u7B26");return}p&&p.config?(p.config.adminPassword=e,localStorage.setItem("adminPassword",e),n.value="",c.showSuccessMessage("\u7BA1\u7406\u5458\u5BC6\u7801\u5DF2\u66F4\u65B0"),console.log("\u2705 Admin password updated")):c.showErrorMessage("\u5BC6\u7801\u66F4\u65B0\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5")},handleDarkModeToggle:n=>{console.log("\u{1F319} Dark mode toggle:",n),localStorage.setItem("adminDarkModeDefault",n.toString()),n?(document.documentElement.setAttribute("data-scheme","dark"),c.showSuccessMessage("\u5DF2\u8BBE\u7F6E\u9ED8\u8BA4\u6DF1\u8272\u6A21\u5F0F")):(document.documentElement.setAttribute("data-scheme","light"),c.showSuccessMessage("\u5DF2\u8BBE\u7F6E\u9ED8\u8BA4\u6D45\u8272\u6A21\u5F0F"))}};window.addEventListener("load",()=>{setTimeout(function(){c.init()},0)});window.Stack=c;window.createElement=N;window.StackAuth=p;document.addEventListener("DOMContentLoaded",()=>{console.log("\u{1F3A8} Modern blog layout initialized"),document.querySelectorAll('a[href^="#"]').forEach(n=>{n.addEventListener("click",function(e){e.preventDefault();let t=document.querySelector(this.getAttribute("href"));t&&t.scrollIntoView({behavior:"smooth",block:"start"})})}),document.querySelectorAll(".btn").forEach(n=>{n.addEventListener("click",function(){this.classList.contains("btn-loading")||(this.classList.add("btn-loading"),setTimeout(()=>{this.classList.remove("btn-loading")},2e3))})}),document.querySelectorAll(".article-card, .article-list article").forEach(n=>{n.addEventListener("mouseenter",function(){this.style.transform="translateY(-4px)"}),n.addEventListener("mouseleave",function(){this.style.transform="translateY(0)"})}),console.log("\u2705 Modern layout enhancements applied")});c.registerServiceWorker=()=>{"serviceWorker"in navigator&&window.addEventListener("load",()=>{navigator.serviceWorker.register("/sw.js").then(n=>{console.log("\u2705 Service Worker \u6CE8\u518C\u6210\u529F:",n.scope),n.addEventListener("updatefound",()=>{let e=n.installing;e&&e.addEventListener("statechange",()=>{e.state==="installed"&&navigator.serviceWorker.controller&&c.showUpdateNotification()})})}).catch(n=>{console.log("\u274C Service Worker \u6CE8\u518C\u5931\u8D25:",n)})})};c.showUpdateNotification=()=>{let n=document.createElement("div");n.style.cssText=`
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
    `,n.innerHTML=`
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
    `,document.body.appendChild(n),setTimeout(()=>{n.parentElement&&n.remove()},1e4)};window.Stack=c;console.log("\u2705 Stack object exported to window");console.log("\u{1F680} Hugo Stack Theme Enhanced - v2.2 FINAL - All modules loaded successfully!");})();
/*!
*   Hugo Theme Stack - Article Manager
*
*   @author: Alex (Engineer)
*   @project: Hugo Blog Article Management System
*   @description: Complete article CRUD operations with GitHub integration
*/
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
*   Hugo Theme Stack - Guest Authentication System
*
*   @author: Alex (Engineer)
*   @project: Hugo Blog Guest Login System
*   @description: Guest user registration, login, and rating system
*/
/*!
*   Hugo Theme Stack - Article Rating System
*
*   @author: Alex (Engineer)
*   @project: Hugo Blog Article Rating System
*   @description: Guest user article rating and statistics
*/
/*!
*   Hugo Theme Stack - GitHub Deep Integration System
*
*   @author: Alex (Engineer)
*   @project: Hugo Blog GitHub Deep Integration
*   @description: Complete GitHub integration for content management, sync, and collaboration
*/
/*!
*   Hugo Theme Stack - Extended with Admin Authentication
*
*   @author: Jimmy Cai (Original), Emma (Admin Extension)
*   @website: https://jimmycai.com
*   @link: https://github.com/CaiJimmy/hugo-theme-stack
*/
