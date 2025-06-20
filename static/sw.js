/**
 * Service Worker for Blog Performance Optimization
 * 提供缓存策略、离线支持和资源优化
 */

const CACHE_NAME = 'blog-cache-v1';
const STATIC_CACHE = 'blog-static-v1';
const DYNAMIC_CACHE = 'blog-dynamic-v1';

// 需要缓存的静态资源
const STATIC_ASSETS = [
    '/',
    '/css/style.css',
    '/js/main.js',
    '/images/logo.png',
    '/manifest.json'
];

// 缓存策略配置
const CACHE_STRATEGIES = {
    // 静态资源：缓存优先
    static: {
        pattern: /\.(css|js|woff2|woff|ttf|eot|ico|png|jpg|jpeg|gif|svg|webp|avif)$/,
        strategy: 'cacheFirst',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30天
        maxEntries: 100
    },
    // HTML页面：网络优先，缓存备用
    pages: {
        pattern: /\.html$|\/$/,
        strategy: 'networkFirst',
        maxAge: 24 * 60 * 60 * 1000, // 1天
        maxEntries: 50
    },
    // API请求：网络优先
    api: {
        pattern: /\/api\//,
        strategy: 'networkFirst',
        maxAge: 5 * 60 * 1000, // 5分钟
        maxEntries: 20
    },
    // 图片：缓存优先
    images: {
        pattern: /\.(png|jpg|jpeg|gif|svg|webp|avif)$/,
        strategy: 'cacheFirst',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7天
        maxEntries: 200
    }
};

/**
 * Service Worker安装事件
 */
self.addEventListener('install', event => {
    console.log('🔧 Service Worker 安装中...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => {
                console.log('📦 缓存静态资源...');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => {
                console.log('✅ Service Worker 安装完成');
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('❌ Service Worker 安装失败:', error);
            })
    );
});

/**
 * Service Worker激活事件
 */
self.addEventListener('activate', event => {
    console.log('🚀 Service Worker 激活中...');
    
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        // 删除旧版本缓存
                        if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                            console.log('🗑️ 删除旧缓存:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('✅ Service Worker 激活完成');
                return self.clients.claim();
            })
    );
});

/**
 * 拦截网络请求
 */
self.addEventListener('fetch', event => {
    const request = event.request;
    const url = new URL(request.url);
    
    // 只处理GET请求
    if (request.method !== 'GET') {
        return;
    }
    
    // 跳过chrome-extension和其他协议
    if (!url.protocol.startsWith('http')) {
        return;
    }
    
    // 根据请求类型选择缓存策略
    const strategy = getStrategy(request.url);
    
    event.respondWith(
        handleRequest(request, strategy)
    );
});

/**
 * 获取请求的缓存策略
 */
function getStrategy(url) {
    for (const [name, config] of Object.entries(CACHE_STRATEGIES)) {
        if (config.pattern.test(url)) {
            return { name, ...config };
        }
    }
    // 默认策略
    return { name: 'networkFirst', strategy: 'networkFirst', maxAge: 60 * 60 * 1000 };
}

/**
 * 处理请求
 */
async function handleRequest(request, strategy) {
    switch (strategy.strategy) {
        case 'cacheFirst':
            return cacheFirst(request, strategy);
        case 'networkFirst':
            return networkFirst(request, strategy);
        case 'staleWhileRevalidate':
            return staleWhileRevalidate(request, strategy);
        default:
            return fetch(request);
    }
}

/**
 * 缓存优先策略
 */
async function cacheFirst(request, strategy) {
    try {
        const cache = await caches.open(DYNAMIC_CACHE);
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse) {
            // 检查缓存是否过期
            const cachedDate = new Date(cachedResponse.headers.get('sw-cached-date'));
            const now = new Date();
            
            if (now - cachedDate < strategy.maxAge) {
                return cachedResponse;
            }
        }
        
        // 缓存未命中或已过期，从网络获取
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            const responseToCache = networkResponse.clone();
            responseToCache.headers.set('sw-cached-date', new Date().toISOString());
            await cache.put(request, responseToCache);
        }
        
        return networkResponse;
    } catch (error) {
        console.error('缓存优先策略失败:', error);
        // 如果网络也失败，尝试返回缓存
        const cache = await caches.open(DYNAMIC_CACHE);
        return await cache.match(request) || new Response('离线状态', { status: 503 });
    }
}

/**
 * 网络优先策略
 */
async function networkFirst(request, strategy) {
    try {
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            const responseToCache = networkResponse.clone();
            responseToCache.headers.set('sw-cached-date', new Date().toISOString());
            await cache.put(request, responseToCache);
        }
        
        return networkResponse;
    } catch (error) {
        console.log('网络请求失败，尝试缓存:', request.url);
        
        // 网络失败，尝试缓存
        const cache = await caches.open(DYNAMIC_CACHE);
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // 返回离线页面
        return new Response(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>离线状态</title>
                <meta charset="utf-8">
                <style>
                    body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                    .offline { color: #666; }
                </style>
            </head>
            <body>
                <div class="offline">
                    <h1>🔌 离线状态</h1>
                    <p>当前网络不可用，请检查网络连接后重试。</p>
                    <button onclick="location.reload()">重新加载</button>
                </div>
            </body>
            </html>
        `, {
            status: 503,
            headers: { 'Content-Type': 'text/html; charset=utf-8' }
        });
    }
}

/**
 * 过期重新验证策略
 */
async function staleWhileRevalidate(request, strategy) {
    const cache = await caches.open(DYNAMIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    // 异步更新缓存
    const fetchPromise = fetch(request).then(networkResponse => {
        if (networkResponse.ok) {
            const responseToCache = networkResponse.clone();
            responseToCache.headers.set('sw-cached-date', new Date().toISOString());
            cache.put(request, responseToCache);
        }
        return networkResponse;
    });
    
    // 如果有缓存，立即返回缓存，否则等待网络响应
    return cachedResponse || fetchPromise;
}

/**
 * 清理过期缓存
 */
async function cleanupCache() {
    const cacheNames = await caches.keys();
    
    for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName);
        const requests = await cache.keys();
        
        for (const request of requests) {
            const response = await cache.match(request);
            const cachedDate = new Date(response.headers.get('sw-cached-date'));
            const now = new Date();
            
            // 删除超过30天的缓存
            if (now - cachedDate > 30 * 24 * 60 * 60 * 1000) {
                await cache.delete(request);
                console.log('🗑️ 删除过期缓存:', request.url);
            }
        }
    }
}

/**
 * 定期清理缓存
 */
setInterval(cleanupCache, 24 * 60 * 60 * 1000); // 每天清理一次

/**
 * 处理消息
 */
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'CACHE_STATS') {
        getCacheStats().then(stats => {
            event.ports[0].postMessage(stats);
        });
    }
});

/**
 * 获取缓存统计信息
 */
async function getCacheStats() {
    const cacheNames = await caches.keys();
    const stats = {};
    
    for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName);
        const requests = await cache.keys();
        stats[cacheName] = requests.length;
    }
    
    return stats;
}
