const {
    cfg,
    additional: {dictRegex, tsRegex}
} = require('./default');
const path = require('path');
const RemovePlugin = require('remove-files-webpack-plugin');

const {plugins, module: {rules}} = cfg;

plugins.push(
    new RemovePlugin({
        after: {
            include: [path.resolve(paths.output, 'style.js')] // does not work
        }
    })
);

rules.find(obj => obj.test === tsRegex)
    .exclude = dictRegex;

rules.push({
    test: dictRegex,
    use: [
        path.resolve('webpack', 'loaders', 'jsonGenerator.js'),
        'ts-loader'
    ]
});

module.exports = Object.assign(cfg, {
    mode: 'production'
});