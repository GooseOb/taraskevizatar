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

const tsRegex = /\.ts$/;
const dictRegex = /dict.ts$/;

const cfg = {
    context: relativePath('client'),
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
        path: relativePath('docs'),
        filename: '[name].js',
        clean: true
    }
};

module.exports = (env, argv) => {
    if (argv.mode === 'production') {
        const {plugins, module: {rules}} = cfg;
        plugins.push(
            new RemovePlugin({
                after: {
                    include: [relativePath('docs', 'style.js')]
                }
            })
        );
        rules.find(obj => obj.test === tsRegex)
            .exclude = dictRegex;
        rules.push({
            test: dictRegex,
            use: [
                relativePath('jsonGenerator.js'),
                'ts-loader'
            ]
        });
    } else {
        cfg.devtool = 'source-map';
    }
    return cfg;
}