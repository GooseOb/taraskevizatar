import cachePaths from './cachePaths.json';

const getCacheNameByUrl = (target: string): string => {
	let pwaName: string;
	for (const name in cachePaths) {
		for (const path of cachePaths[name]) {
			log(target, path, target.includes(path));
			if (target.includes(path)) return name;
		}
		if (/pwa/.test(name)) pwaName = name;
	}
	return pwaName;
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
		const { cacheName, files } = cachePaths[name];
		const cache = await caches.open(cacheName);
		cache.addAll(files);
	}
});

self.addEventListener('activate', async () => {
	log('activate');
	const cacheNames = Object.keys(cachePaths);

	const cachesToDelete: string[] = [];

	for (const name of await caches.keys())
		if (!cacheNames.includes(name)) cachesToDelete.push(name);

	await Promise.all(cachesToDelete.map((name) => caches.delete(name)));
});

self.addEventListener('fetch', (e: FetchEvent) => {
	e.respondWith(cacheFirst(e.request));
});
