const path = require('path');
const {writeFile} = require('fs');
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

const filePath = path.resolve(__dirname, 'cacheConfig.json');
const cacheConfig = require(filePath);

readline.question('Do you want to update cache? (y/n): ', answer => {
    if (answer !== 'y' && answer !== 'Y') {
        readline.close();
        console.log('No cache updated');
        return;
    }
    const cacheNames = Object.keys(cacheConfig);
    const options = cacheNames
        .map((name, i) => `${i}. ${name}`)
        .join('\n');
    readline.question(`Choose caches to update (any separator)\n${options}\n> `, answer => {
        readline.close();
        const ids = answer.match(/\d/g); // change to /\d+/g if options amount more than 10
        if (!ids) {
            console.log('No option chosen');
            return;
        }
        const updatedCacheNames = ids
            .map(id => cacheNames[id])
            .filter(Boolean);
        for (const cacheName of updatedCacheNames) {
            const cache = cacheConfig[cacheName];
            cache.v = String(+cache.v + 1);
        }
        writeFile(
            filePath,
            JSON.stringify(cacheConfig, null, 2),
            ()=>{console.log('Updated successfully: ' + updatedCacheNames.join(', '))}
        );
    })
});