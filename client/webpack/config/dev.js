import cfg, {finalize} from './default.js'
import webpack from 'webpack';

cfg.plugins.push(
    new webpack.DefinePlugin({
        __SW_SCOPE__: '"/"'
    })
);

export default finalize({
    mode: 'development',
    devtool: 'source-map'
});