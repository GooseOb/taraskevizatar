const cacheName = 'v1';
const staticCacheName = 'v1';

const assetUrls = [
    'index.html',
    'script.js',
    'styles/style.css',
    'styles/dark.css',
];

const staticAssetUrls = [
    'fonts/NotoSansArabic-SemiBold.ttf',
    'icons/close.svg',
    'icons/copy.svg',
    'icons/edit.svg',
    'icons/info.svg',
    'icons/settings.svg',
    'icons/theme/light.svg',
    'icons/theme/dark.svg',
];

const cacheFirst = async (req) =>
    await caches.match(req) || await fetch(req);

self.addEventListener('install', () => {
    console.log('[SW] install');
    caches.open(cacheName).then(cache => cache.addAll(assetUrls));
    caches.open(staticCacheName).then(cache => cache.addAll(staticAssetUrls));
});

self.addEventListener('activate', async () => {
    console.log('[SW] activate');
    const cacheNames = await caches.keys();
    await Promise.all(
        cacheNames
            .filter(name => name !== cacheName && name !== staticCacheName)
            .map(name => caches.delete(name))
    );
});

self.addEventListener('fetch', e => {
    e.respondWith(cacheFirst(e.request));
});