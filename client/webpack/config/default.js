import path from 'path';
import webpack from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import dotenv from 'dotenv'

const rootPath = path.resolve('..');
const contextPath = path.resolve(rootPath, 'client');
const outputPath = path.resolve(contextPath, 'build');

global.paths = {
    root: rootPath,
    context: contextPath,
    output: outputPath
};

const dotEnv = dotenv.config({path: path.resolve(paths.root, '.env')}).parsed;
export const tsRegex = /\.ts$/;
export const dictRegex = /dict.ts$/;

const definedEnv = {};
for (const key in dotEnv)
    definedEnv['process.env.' + key] = `'${dotEnv[key]}'`;

const styleCacheGroups = groups => groups.reduce((acc, name) =>
    Object.assign(acc, {
        [name]: {
            name,
            test: RegExp(name + '\\.sass'),
            chunks: 'all',
            enforce: true
        }
    }), {});

const cfg = {
    context: paths.context,
    performance: {
        assetFilter: filename => !/\.map$/.test(filename) && filename !== 'og.jpg'
    },
    entry: {
        index: '/scripts/index.ts',
        sw: '/scripts/serviceWorker/index.js',
        style: '/styles/index.js'
    },
    resolve: {
        extensions: ['.js', '.ts'],
        alias: {
            '@scripts': path.resolve(paths.root, 'scripts')
        }
    },
    plugins: [
        new webpack.DefinePlugin({
            __BUILD_DATE__: JSON.stringify((new Date()).toLocaleDateString('ru')),
            ...definedEnv
        }),
        new MiniCssExtractPlugin({
            filename: 'styles/[name].css'
        }),
        new CopyPlugin({
            patterns: [
                'icons',
                'fonts',
                'logo',
                'index.html',
                'manifest.json',
                'og.jpg',
            ].map(path => ({
                from: path,
                to: path
            }))
        })
    ],
    optimization: {
        splitChunks: {
            cacheGroups: {
                ...styleCacheGroups(['style', 'dark'])
            }
        }
    },
    devServer: {
        static: ['fonts', 'icons', 'logo'],
        port: dotEnv.CLIENT_PORT,
        open: true,
        hot: true
    },
    module: {
        rules: [
            {
                test: /\.(sa|c)ss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {loader: 'css-loader', options: {url: false}},
                    'sass-loader'
                ]
            }, {
                test: tsRegex,
                use: 'ts-loader'
            }
        ]
    },
    output: {
        path: paths.output,
        filename: '[name].js',
        clean: true
    }
};

export const finalize = cfgProps => env => {
    cfg.resolve.alias['@api'] = path.resolve(paths.root,
        env.api ? 'client/scripts/api.ts' : 'scripts/tarask.ts'
    );
    return Object.assign(cfg, cfgProps);
};

export default cfg;