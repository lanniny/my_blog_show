---
title: Links
links:
  - title: GitHub
    description: GitHub is the world's largest software development platform.
    website: https://github.com
    image: https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png
    category: "开发工具"
    tags: ["代码托管", "版本控制", "开源"]
    status: "active"
    featured: true
  - title: TypeScript
    description: TypeScript is a typed superset of JavaScript that compiles to plain JavaScript.
    website: https://www.typescriptlang.org
    image: ts-logo-128.jpg
    category: "编程语言"
    tags: ["JavaScript", "类型安全", "前端"]
    status: "active"
    featured: true
  - title: Vue.js
    description: The Progressive JavaScript Framework for building user interfaces.
    website: https://vuejs.org
    image: https://vuejs.org/images/logo.png
    category: "前端框架"
    tags: ["JavaScript", "前端", "响应式"]
    status: "active"
    featured: false
  - title: Hugo
    description: The world's fastest framework for building websites.
    website: https://gohugo.io
    image: https://gohugo.io/img/hugo-logo-wide.svg
    category: "静态站点"
    tags: ["静态生成", "博客", "Go语言"]
    status: "active"
    featured: true
  - title: Netlify
    description: Build, deploy, and manage modern web projects.
    website: https://netlify.com
    image: https://www.netlify.com/img/press/logos/logomark.png
    category: "部署平台"
    tags: ["部署", "CDN", "无服务器"]
    status: "active"
    featured: false
  - title: Stack Overflow
    description: Where developers learn, share, & build careers.
    website: https://stackoverflow.com
    image: https://cdn.sstatic.net/Sites/stackoverflow/Img/apple-touch-icon.png
    category: "学习资源"
    tags: ["问答", "编程", "社区"]
    status: "active"
    featured: false
menu:
    main:
        weight: -50
        params:
            icon: link

comments: false
---

To use this feature, add `links` section to frontmatter.

This page's frontmatter:

```yaml
links:
  - title: GitHub
    description: GitHub is the world's largest software development platform.
    website: https://github.com
    image: https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png
  - title: TypeScript
    description: TypeScript is a typed superset of JavaScript that compiles to plain JavaScript.
    website: https://www.typescriptlang.org
    image: ts-logo-128.jpg
```

`image` field accepts both local and external images.