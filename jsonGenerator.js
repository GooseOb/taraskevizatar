const path = require('path');
const {
    promises: {readFile, writeFile},
    existsSync, mkdirSync
} = require('fs');

const paths = {
    input: path.resolve(__dirname, 'scripts', 'srcs.ts'),
    output: path.resolve(__dirname, 'json')
}

if (!existsSync(paths.output))
    mkdirSync(paths.output);

const regexToStr = obj => {
    for (const key in obj) obj[key] = obj[key].source;
    return obj;
};

readFile(paths.input, 'utf-8').then(data => {
    let wordlist, softers, gobj, latinLetters;
    eval(
        data.match(/\/\/ json-start([\S\s]+)\/\/ json-end/)[1]
    );
    return Promise.all([
        ['wordlist', regexToStr(wordlist)],
        ['softers', regexToStr(softers)],
        ['latinLetters', latinLetters],
        ['g', gobj]
    ].map(([fileName, obj]) =>
        writeFile(`${paths.output}/${fileName}.json`, JSON.stringify(obj))
    ));
});