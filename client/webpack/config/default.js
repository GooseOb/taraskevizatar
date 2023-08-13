import webpack from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import tsConfig from '../../tsconfig.json' assert { type: 'json' };
import {
	getAliasFromTsConfig,
	getClientApiPath,
	getDefaultText,
	getDotEnv,
	resolveLoader,
	styleCacheGroups,
} from './utils.js';
import paths from '../paths.cjs';

const tsRegex = /\.ts$/;

const cfg = {
	context: paths.context,
	performance: {
		assetFilter: (filename) =>
			!/\.map$/.test(filename) && filename !== 'og.jpg',
	},
	entry: {
		index: '/scripts/index.ts',
		sw: '/scripts/serviceWorker/index.ts',
		style: '/styles/index.js',
	},
	resolve: {
		extensions: ['.js', '.ts'],
		alias: getAliasFromTsConfig(tsConfig),
	},
	plugins: [
		new webpack.DefinePlugin({
			__BUILD_DATE__: Date.now(),
			__DEFAULT_TEXT__: `\`${await getDefaultText()}\``,
			...getDotEnv(),
		}),
		new MiniCssExtractPlugin({
			filename: 'styles/[name].css',
		}),
		new CopyPlugin({
			patterns: [
				'icons',
				'fonts',
				'logo',
				'index.html',
				'manifest.json',
				'og.jpg',
			].map((path) => ({
				from: path,
				to: path,
			})),
		}),
	],
	optimization: {
		splitChunks: {
			cacheGroups: {
				...styleCacheGroups(['style', 'dark']),
			},
		},
	},
	module: {
		rules: [
			{
				test: /\.(sa|c)ss$/,
				use: [
					MiniCssExtractPlugin.loader,
					{ loader: 'css-loader', options: { url: false } },
					'sass-loader',
				],
			},
			{
				test: tsRegex,
				use: 'ts-loader',
			},
			{
				test: /serviceWorker.index\.ts$/,
				use: ['ts-loader'],
			},
		],
	},
	output: {
		path: paths.output,
		filename: '[name].js',
		clean: true,
	},
};

export const finalize = (cfgProps) => (env) => {
	if (env.api) cfg.resolve.alias['@api'] = getClientApiPath();
	return Object.assign(cfg, cfgProps);
};

export default cfg;
