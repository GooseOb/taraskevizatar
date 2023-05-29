import cfg, {finalize, dictRegex, tsRegex, resolveLoader} from './default.js';
import webpack from 'webpack';
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
plugins.push(
    new webpack.DefinePlugin({
        __SW_SCOPE__: '"/taraskevizatar/"'
    })
);

rules.find(obj => obj.test === tsRegex)
    .exclude = dictRegex;

rules.push({
    test: dictRegex,
    use: [
        resolveLoader('jsonGenerator'),
        resolveLoader('buildTimeFunctions'),
        'ts-loader'
    ]
});

export default finalize( {
    mode: 'production'
});