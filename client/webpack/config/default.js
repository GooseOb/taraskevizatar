const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const rootPath = path.resolve('..');
const contextPath = path.resolve(rootPath, 'client');
const outputPath = path.resolve(contextPath, 'build');

global.paths = {
    root: rootPath,
    context: contextPath,
    output: outputPath
};

const tsRegex = /\.ts$/;
const dictRegex = /dict.ts$/;

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
        new CopyWebpackPlugin({
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

module.exports = {
    cfg,
    additional: {tsRegex, dictRegex}
}