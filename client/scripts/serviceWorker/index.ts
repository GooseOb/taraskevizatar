import cachePaths from './cachePaths.json';
type CachePathsKey = keyof typeof cachePaths;

//@ts-ignore
const getCacheNameByUrl = (target: string): string => {
	let pwaName: string;
	for (const name in cachePaths) {
		for (const path of cachePaths[name as CachePathsKey]) {
			if (target.endsWith(path)) return name;
		}
		if (/pwa/.test(name)) pwaName = name;
	}
	return pwaName!;
};

//@ts-ignore
const log = (...msg: any[]) => console.log('[SW]', ...msg);
//@ts-ignore
const cacheFirst = async (req: Request) => {
	let res = await caches.match(req);
	if (res) return res;
	res = await fetch(req);
	//@ts-ignore
	const cache = await caches.open(getCacheNameByUrl(req.url));
	cache.put(req, res.clone());
	return res;
};

self.addEventListener('install', async () => {
	log('install');
	for (const name in cachePaths) {
		const cache = await caches.open(name);
		cache.addAll(cachePaths[name as CachePathsKey]);
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

self.addEventListener('fetch', (e) => {
	//@ts-ignore
	(e as FetchEvent).respondWith(cacheFirst((e as FetchEvent).request));
});
