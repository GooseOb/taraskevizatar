import path from 'path';
import readline from 'readline';
import { writeFile } from 'fs/promises';
import { fileURLToPath as utp } from 'url';
import cacheConfig from './cacheConfig.json' assert { type: "json" };
import { simpleGit } from 'simple-git';

const SW_DIR = path.dirname(utp(import.meta.url));
const ROOT_DIR = path.resolve(SW_DIR, '..', '..', '..');
const BUILD_PATH = path.resolve(ROOT_DIR, 'client', 'build');

const git = simpleGit({
    baseDir: ROOT_DIR
});

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
const question = query =>
    new Promise(res => {
        rl.question(query, answer => {
            res(answer.trim());
        });
    });

const filePath = path.resolve(SW_DIR, 'cacheConfig.json');

// const changeChecks = {
//     html: {test: /index.html/},
//     js: {
//         test: /core\//,
//         exclude: /serviceWorker/
//     },
//     css: {test: /\/styles\//},
//     static: {test: /\/(fonts|icons)\//}
// };

const ALL_UNCOMMITTED_ID = 'x';

const exit = msg => {
    rl.close();
    console.log(msg);
    process.exit(0);
};

const doUpdate = /[Yy]/.test(await question('Update service worker cache? (y/n): '));
if (!doUpdate) exit('No cache updated');
await git.checkout('gh-pages');

const diffFile = (filePath) =>
    git.diff(['--no-index', path.resolve(BUILD_PATH, filePath), filePath])
        .catch(err => {
            if (/\n@@ /.test(err)) return err;
            throw err;
        });

const updateSuggestions = [];

try {
    if (await diffFile('index.js')) updateSuggestions.push('js');
    if (
        (await diffFile('styles/style.css')) ||
        (await diffFile('styles/dark.css'))
    ) updateSuggestions.push('css');
    if (await diffFile('index.html')) updateSuggestions.push('html');
} finally {
    await git.checkout('main');
}

const cacheNames = Object.keys(cacheConfig);
const gitDiffCacheNames = cacheNames.filter(name => updateSuggestions.includes(name));
const getSuggestion = name => gitDiffCacheNames.includes(name) ? '<- uncommitted changes' : '';
let options = cacheNames
    .map((name, i) => `${i}. ${name} ${getSuggestion(name)}`)
    .join('\n');
const optionsAmount = options.length;
if (gitDiffCacheNames.length) options += `\n${ALL_UNCOMMITTED_ID}. all uncommitted`;
const optionIdsToUpdate = (await question(`Choose caches to update (any separator)\n${options}\n> `))
    .match(new RegExp(ALL_UNCOMMITTED_ID + '|\\d' + (optionsAmount > 10 ? '+' : ''), 'g'));
if (!optionIdsToUpdate) exit('No option chosen');
rl.close();
const cacheNamesToUpdate = optionIdsToUpdate.includes(ALL_UNCOMMITTED_ID)
    ? gitDiffCacheNames : [];
for (const cacheName of optionIdsToUpdate.map(id => cacheNames[id]))
    if (cacheName && !cacheNamesToUpdate.includes(cacheName)) cacheNamesToUpdate.push(cacheName);
for (const cacheName of cacheNamesToUpdate) {
    const cache = cacheConfig[cacheName];
    cache.v = String(+cache.v + 1);
}
writeFile(
    filePath, JSON.stringify(cacheConfig, null, 2)
).then(() => {
    console.log('Updated successfully: ' + (cacheNamesToUpdate.join(', ') || 'nothing'))
});
