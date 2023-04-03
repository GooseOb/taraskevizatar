import cacheConfig from './cacheConfig.json'

for (const name in cacheConfig)
    cacheConfig[name].cacheName = name + '-v' + cacheConfig[name].v;

const isCacheConfigActual = cacheName => {
    const [name, v = null] = cacheName.split('-v');
    return v === cacheConfig[name]?.v;
}

const log = (...msg) => console.log('[SW]', ...msg);
const cacheFirst = async (req) =>
    await caches.match(req) || await fetch(req);

self.addEventListener('install', () => {
    log('install');
    for (const name in cacheConfig) {
        const {cacheName, files} = cacheConfig[name];
        caches.open(cacheName).then(cache => cache.addAll(files));
    }
});

self.addEventListener('activate', async () => {
    log('activate');
    const cacheNames = await caches.keys();
    await Promise.all(
        cacheNames
            .filter(name => !isCacheConfigActual(name))
            .map(name => caches.delete(name))
    );
});

self.addEventListener('fetch', e => {
    e.respondWith(cacheFirst(e.request));
});