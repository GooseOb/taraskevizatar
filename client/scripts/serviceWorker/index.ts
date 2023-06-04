import cacheConfig from './cacheConfig.json';
type CacheKey = keyof typeof cacheConfig;
type CacheName = `${CacheKey}-v${number}`;
type SpecificCacheConfig = {v: string, files: string[]};
type ModifiedCacheConfig = Record<CacheKey, SpecificCacheConfig & {cacheName: CacheName}>;

for (const name in cacheConfig)
    cacheConfig[name].cacheName = name + '-v' + cacheConfig[name].v;

const isCacheConfigActual = (cacheName: CacheName) => {
    const [name, v = null] = cacheName.split('-v');
    return v === cacheConfig[name]?.v;
}

const log = (...msg: any[]) => console.log('[SW]', ...msg);
const cacheFirst = async (req: Request) =>
    await caches.match(req) || await fetch(req);

self.addEventListener('install', async () => {
    log('install');
    for (const name in cacheConfig) {
        const {cacheName, files} = (cacheConfig as ModifiedCacheConfig)[name as CacheKey];
        const cache = await caches.open(cacheName);
        cache.addAll(files);
    }
});

self.addEventListener('activate', async () => {
    log('activate');
    const cacheNames = await caches.keys() as CacheName[];
    await Promise.all(
        cacheNames
            .filter(name => !isCacheConfigActual(name))
            .map(name => caches.delete(name))
    );
});

self.addEventListener('fetch', (e: FetchEvent) => {
    e.respondWith(cacheFirst(e.request));
});