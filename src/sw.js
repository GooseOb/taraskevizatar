const cacheConfig = {
    names: ['html', 'css', 'js', 'static'],
    html: {
        v: '3',
        files: ['index.html']
    },
    js: {
        v: '10',
        files: ['script.js']
    },
    css: {
        v: '2',
        files: [
            'styles/style.css',
            'styles/dark.css'
        ]
    },
    static: {
        v: '1',
        files: [
            'fonts/NotoSansArabic-SemiBold.ttf',
            'icons/close.svg',
            'icons/copy.svg',
            'icons/edit.svg',
            'icons/info.svg',
            'icons/settings.svg',
            'icons/theme/light.svg',
            'icons/theme/dark.svg'
        ]
    },
    isActual(cacheName) {
        const [name, v = null] = cacheName.split('-v');
        return v === this[name]?.v;
    }
};
cacheConfig.names.forEach(name => {
    cacheConfig[name].cacheName = name + '-v' + cacheConfig[name].v;
});

const log = (...msg) => console.log('[SW]', ...msg);
const cacheFirst = async (req) =>
    await caches.match(req) || await fetch(req);

self.addEventListener('install', () => {
    log('install');
    cacheConfig.names.forEach(name => {
        const {cacheName, files} = cacheConfig[name];
        caches.open(cacheName).then(cache => cache.addAll(files));
    });
});

self.addEventListener('activate', async () => {
    log('activate');
    const cacheNames = await caches.keys();
    await Promise.all(
        cacheNames
            .filter(name => !cacheConfig.isActual(name))
            .map(name => caches.delete(name))
    );
});

self.addEventListener('fetch', e => {
    e.respondWith(cacheFirst(e.request));
});