import path from 'path';
import webpack from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CopyPlugin from 'copy-webpack-plugin';

const rootPath = path.resolve('..');
const contextPath = path.resolve(rootPath, 'client');
const outputPath = path.resolve(contextPath, 'build');

global.paths = {
    root: rootPath,
    context: contextPath,
    output: outputPath
};

export const tsRegex = /\.ts$/;
export const dictRegex = /dict.ts$/;

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
    context: contextPath,
    performance: {
        assetFilter: filename => !/\.map$/.test(filename) && filename !== 'og.jpg'
    },
    entry: {
        index: '/js/index.ts',
        sw: '/serviceWorker/index.js',
        style: '/styles/index.js'
    },
    resolve: {
        extensions: ['.js', '.ts']
    },
    plugins: [
        new webpack.DefinePlugin({
            __BUILD_DATE__: JSON.stringify((new Date()).toLocaleDateString('ru'))
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
        port: 3000,
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
        path: outputPath,
        filename: '[name].js',
        clean: true
    }
};

export default cfg;