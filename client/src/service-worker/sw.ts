import cachePaths from './cache-paths.bundle.json';
type CachePathsKey = keyof typeof cachePaths;
const cacheNames = Object.keys(cachePaths) as CachePathsKey[];

declare const self: ServiceWorkerGlobalScope;

const getCacheNameByUrl = (target: string): CachePathsKey => {
	let pwaName: CachePathsKey;
	for (const name of cacheNames) {
		for (const path of cachePaths[name]) {
			if (target.endsWith(path)) return name;
		}
		if (/pwa/.test(name)) pwaName = name;
	}
	return pwaName!;
};

const log = (...msg: any[]) => console.log('[SW]', ...msg);
const cacheFirst = (req: Request) =>
	caches
		.match(req)
		.then(
			(res) =>
				res ||
				Promise.all([fetch(req), caches.open(getCacheNameByUrl(req.url))]).then(
					([res, cache]) => cache.put(req, res.clone()).then(() => res)
				)
		);

self.addEventListener('install', (e) => {
	log('install');

	self.skipWaiting();

	e.waitUntil(
		Promise.all(
			cacheNames.map((name) =>
				caches.open(name).then((cache) => cache.addAll(cachePaths[name]))
			)
		)
	);
});

self.addEventListener('activate', (e) => {
	log('activate');

	e.waitUntil(
		caches
			.keys()
			.then((keys) =>
				Promise.all(
					keys
						.filter((name) => !cacheNames.includes(name))
						.map((name) => caches.delete(name))
				)
			)
	);
});

self.addEventListener('fetch', (e) => {
	e.respondWith(cacheFirst(e.request));
});
