const path = require('path');
const fs = require('fs');
const exists = require('util').promisify(fs.exists);
const {writeFile, mkdir} = fs.promises;

const outputPath = path.resolve(paths.root, 'json');

const regexToStr = obj => {
    for (const key in obj) obj[key] = obj[key].source;
    return obj;
};

module.exports = function(source) {
    let wordlist, softers, gobj, latinLetters, latinLettersUpperCase;
    eval(source.replace(/const|exports\.|"use strict";/g, ''));
    exists(outputPath)
        .then(doesExist => doesExist || mkdir(outputPath))
        .then(() => Promise.all([
            ['wordlist', regexToStr(wordlist)],
            ['softers', regexToStr(softers)],
            ['latinLetters', regexToStr(latinLetters)],
            ['latinLettersUpperCase', regexToStr(latinLettersUpperCase)],
            ['g', gobj]
        ].map(([fileName, obj]) =>
            writeFile(path.resolve(outputPath, fileName + '.json'), JSON.stringify(obj))
        )));
    return source;
};