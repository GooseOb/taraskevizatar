import path from 'path';
import webpack from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import dotenv from 'dotenv'
import tsConfig from '../../tsconfig.json' assert { type: 'json' }
import {readFile} from 'fs/promises';

global.paths = {
    root: path.resolve('..')
};

paths.context = path.resolve(paths.root, 'client');
paths.output = path.resolve(paths.context, 'build');

const dotEnv = dotenv.config({path: path.resolve(paths.root, '.env')}).parsed;
export const tsRegex = /\.ts$/;
export const dictRegex = /dict.ts$/;

export const resolveLoader = (name) => path.resolve('webpack', 'loaders', name + '.cjs');

const alias = tsConfig.compilerOptions.paths;
for (const key in alias)
    alias[key] = path.resolve(paths.context, alias[key][0]);

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
        sw: '/scripts/serviceWorker/index.ts',
        style: '/styles/index.js'
    },
    resolve: {
        extensions: ['.js', '.ts'],
        alias
    },
    plugins: [
        new webpack.DefinePlugin({
            __BUILD_DATE__: Date.now(),
            __DEFAULT_TEXT__: `\`${await readFile('default-text.txt', 'utf-8')}\``,
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
            }, {
                test: /serviceWorker.index.ts$/,
                use: ['ts-loader', resolveLoader('sw')]
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
    if (env.api) alias['@api'] = path.resolve(paths.context, 'scripts', 'api.ts');
    return Object.assign(cfg, cfgProps);
};

export default cfg;