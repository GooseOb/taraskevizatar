/// <reference lib="webworker" />

import { build, files, version } from '$service-worker';

declare const self: ServiceWorkerGlobalScope;

const cachePaths = {
	[`tarask-build-${version}`]: build,
	[`tarask-files-${version}`]: files,
} as const;

const cacheNames = Object.keys(cachePaths);

const getCacheNameByUrl = (target: string) =>
	cacheNames.find((name) => cachePaths[name].some((path) => target.endsWith(path))) ??
	cacheNames[0];

const log = (...msg: any[]) => console.log('[SW]', ...msg);
const cacheFirst = (req: Request) =>
	caches
		.match(req.url)
		.then(
			(res) =>
				res ||
				Promise.all([fetch(req), caches.open(getCacheNameByUrl(req.url))]).then(([res, cache]) =>
					cache.put(req.url, res.clone()).then(() => res)
				)
		);

self.addEventListener('install', (e) => {
	log('install');

	self.skipWaiting();

	e.waitUntil(
		Promise.all(
			cacheNames.map((name) => caches.open(name).then((cache) => cache.addAll(cachePaths[name])))
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
					keys.filter((name) => !cacheNames.includes(name)).map((name) => caches.delete(name))
				)
			)
	);
});

self.addEventListener('fetch', (e) => {
	if (e.request.url.startsWith('http')) {
		e.respondWith(cacheFirst(e.request));
	}
});

self.addEventListener('message', (e) => {
	if (e.data.type === 'SKIP_WAITING') {
		self.skipWaiting();
	}
});
