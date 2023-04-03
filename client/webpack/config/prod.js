import cfg, {finalize, dictRegex, tsRegex} from './default.js';
import path from 'path';
import RemovePlugin from 'remove-files-webpack-plugin';

const {plugins, module: {rules}} = cfg;

plugins.push(
    new RemovePlugin({
        after: {
            include: [path.resolve(paths.output, 'style.js')]
        }
    })
);

rules.find(obj => obj.test === tsRegex)
    .exclude = dictRegex;

rules.push({
    test: dictRegex,
    use: [
        path.resolve('webpack', 'loaders', 'jsonGenerator.cjs'),
        'ts-loader'
    ]
});

export default finalize( {
    mode: 'production'
});