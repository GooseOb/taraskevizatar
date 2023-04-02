import path from 'path';
import readline from 'readline';
import {writeFile} from 'fs';
import {execSync} from 'child_process';
import cacheConfig from './cacheConfig.json' assert { type: "json" };
import {fileURLToPath as utp} from 'url';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
function question(query) {
    return new Promise(resolve => {
        rl.question(query, res => {
            resolve(res.trim());
        });
    });
}

const filePath = path.resolve(path.dirname(utp(import.meta.url)), 'cacheConfig.json');

const changeChecks = {
    html: /index.html/,
    js: /\/js\/|scripts\//,
    css: /\/styles\//,
    static: /\/(fonts|icons)\//
};

const ALL_UNCOMMITTED_ID = 'x';

const exit = msg => {
    rl.close();
    console.log(msg);
    process.exit(0);
};

const doUpdate = /[Yy]/.test(await question('Update service worker cache? (y/n): '));
if (!doUpdate) exit('No cache updated');
const gitDiffFilePaths = execSync('git diff --name-only').toString();
const cacheNames = Object.keys(cacheConfig);
const gitDiffCacheNames = cacheNames.filter(name => changeChecks[name].test(gitDiffFilePaths));
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
    if (cacheName && !cacheNamesToUpdate.includes(cacheName)) cacheNamesToUpdate.add(cacheName);
for (const cacheName of cacheNamesToUpdate) {
    const cache = cacheConfig[cacheName];
    cache.v = String(+cache.v + 1);
}
writeFile(
    filePath,
    JSON.stringify(cacheConfig, null, 2),
    () => {
        console.log('Updated successfully: ' + (cacheNamesToUpdate.join(', ') || 'nothing'))
    }
);