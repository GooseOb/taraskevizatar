const path = require('path');
const {
    promises: {writeFile},
    existsSync, mkdirSync
} = require('fs');

const outputPath = path.resolve(__dirname, 'json');

if (!existsSync(outputPath))
    mkdirSync(outputPath);

const regexToStr = obj => {
    for (const key in obj) obj[key] = obj[key].source;
    return obj;
};

module.exports = function(source) {
    let wordlist, softers, gobj, latinLetters;
    eval(source.replace(/const|exports\.|"use strict";/g, ''));
    Promise.all([
        ['wordlist', regexToStr(wordlist)],
        ['softers', regexToStr(softers)],
        ['latinLetters', latinLetters],
        ['g', gobj]
    ].map(([fileName, obj]) =>
        writeFile(`${outputPath}/${fileName}.json`, JSON.stringify(obj))
    ));
    return source;
};