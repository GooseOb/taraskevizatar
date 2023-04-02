const path = require('path');
const {writeFile} = require('fs');
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});
const exec = require('util').promisify(require('node:child_process').exec);

const filePath = path.resolve(__dirname, 'cacheConfig.json');
const cacheConfig = require(filePath);

const changeChecks = {
    html: /index.html/,
    js: /\/js\/|scripts\//,
    css: /\/styles\//,
    static: /\/(fonts|icons)\//
};

readline.question('Update service worker cache? (y/n): ', async answer => {
    if (answer !== 'y' && answer !== 'Y') {
        readline.close();
        console.log('No cache updated');
        return;
    }
    const {stdout: gitDiffFilePaths} = await exec('git diff --name-only');
    const cacheNames = Object.keys(cacheConfig);
    const gitDiffCacheNames = cacheNames.filter(name => changeChecks[name].test(gitDiffFilePaths));
    const getSuggestion = name => gitDiffCacheNames.includes(name) ? '<- uncommitted changes' : '';
    let options = cacheNames
        .map((name, i) => `${i}. ${name} ${getSuggestion(name)}`)
        .join('\n');
    if (gitDiffCacheNames.length) options += '\nx. all uncommitted';
    readline.question(`Choose caches to update (any separator)\n${options}\n> `, answer => {
        readline.close();
        answer = answer.trim();
        let updatedCacheNames;
        if (answer === 'x' || answer === 'X') {
            updatedCacheNames = gitDiffCacheNames;
        } else {
            const ids = answer.match(/\d/g); // change to /\d+/g if options amount more than 10
            if (!ids) {
                console.log('No option chosen');
                return;
            }
            updatedCacheNames = ids
                .map(id => cacheNames[id])
                .filter(Boolean);
        }
        for (const cacheName of updatedCacheNames) {
            const cache = cacheConfig[cacheName];
            cache.v = String(+cache.v + 1);
        }
        writeFile(
            filePath,
            JSON.stringify(cacheConfig, null, 2),
            ()=>{console.log('Updated successfully: ' + updatedCacheNames.join(', ') || 'nothing')}
        );
    })
});