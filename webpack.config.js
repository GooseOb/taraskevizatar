const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const RemovePlugin = require('remove-files-webpack-plugin');

const relativePath = (...relPath) => path.resolve(__dirname, ...relPath);

const styleCacheGroups = groups => groups.reduce((acc, name) =>
    Object.assign(acc, {
        [name]: {
            name,
            test: RegExp(name + '\\.sass'),
            chunks: 'all',
            enforce: true
        }
    }), {});

module.exports = {
    mode: 'none',
    context: relativePath('src'),
    // devtool: 'source-map',
    entry: {
        index: '/js/index.js',
        sw: '/sw.js',
        style: '/style.js'
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
                'logo.png'
            ].map(path => ({
                from: path,
                to: path
            }))
        }),
        new RemovePlugin({
            after: {
                include: [relativePath('docs', 'style.js')]
            }
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
                test: /\.ts$/,
                use: 'ts-loader'
            }
        ]
    },
    output: {
        path: relativePath('docs'),
        filename: '[name].js',
        clean: true
    }
}