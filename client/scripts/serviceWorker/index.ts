import cachePaths from './cachePaths.json';
type CacheKey = keyof typeof cachePaths;
type CacheName<T extends CacheKey = CacheKey> =
	`${T}-v${SpecificCachePaths<T>['v']}`;
type SpecificCachePaths<T extends CacheKey = CacheKey> = (typeof cachePaths)[T];
type ModifiedCachePaths = {
	[Key in CacheKey]: SpecificCachePaths<Key> & { cacheName: CacheName<Key> };
};

for (const name in cachePaths)
	cachePaths[name].cacheName = name + '-v' + cachePaths[name].v;

const isCacheConfigActual = (cacheName: CacheName) => {
	const [name, v = null] = cacheName.split('-v');
	return v === cachePaths[name]?.v;
};

const getCacheNameByUrl = (target: string): CacheName => {
	for (const name in cachePaths)
		for (const path in cachePaths[name])
			if (target.includes(path)) return name as CacheName;
	// @ts-ignore (compilation error)
	return (cachePaths as ModifiedCachePaths).pwa.cacheName;
};

const log = (...msg: any[]) => console.log('[SW]', ...msg);
const cacheFirst = async (req: Request) => {
	let res = await caches.match(req);
	if (res) return res;
	res = await fetch(req);
	const cache = await caches.open(getCacheNameByUrl(req.url));
	cache.put(req, res.clone());
	return res;
};

self.addEventListener('install', async () => {
	log('install');
	for (const name in cachePaths) {
		const { cacheName, files } = (cachePaths as ModifiedCachePaths)[name];
		const cache = await caches.open(cacheName);
		cache.addAll(files);
	}
});

self.addEventListener('activate', async () => {
	log('activate');
	const cacheNames = (await caches.keys()) as CacheName[];
	await Promise.all(
		cacheNames
			.filter((name) => !isCacheConfigActual(name))
			.map((name) => caches.delete(name))
	);
});

self.addEventListener('fetch', (e: FetchEvent) => {
	e.respondWith(cacheFirst(e.request));
});
