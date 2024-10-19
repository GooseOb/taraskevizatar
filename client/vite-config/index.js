import { loadEnv, defineConfig } from 'vite';
import { readFile } from 'node:fs/promises';
import path from 'path';
import cacheVersioner from './plugins/cache-versioner';
import { createHtmlPlugin } from 'vite-plugin-html';
import { version as pkgVersion } from '../node_modules/taraskevizer/package.json';
import { build } from 'esbuild';

const __DEFAULT_TEXT__ = `"${(
	await readFile('default-text.txt', 'utf-8')
).replace(/[\r\n]+/g, '\\n')}"`;

export default defineConfig(({ command, mode }) => {
	const env = loadEnv(mode, path.resolve('..'), '');
	const isProd = command === 'build';
	const base = isProd ? '/taraskevizatar/' : '/';
	const isClientServerMode = !!env.CLIENT_SERVER_MODE;
	const port = isClientServerMode ? +env.CLIENT_PORT : undefined;
	return {
		base,
		preview: { port },
		server: { port },
		plugins: [
			isProd &&
				createHtmlPlugin({
					minify: true,
				}),
			{
				apply: 'build',
				enforce: 'post',
				transformIndexHtml() {
					build({
						minify: true,
						bundle: true,
						entryPoints: [path.resolve('src', 'service-worker', 'sw.ts')],
						outdir: path.resolve('dist'),
						plugins: [cacheVersioner(pkgVersion)],
					});
				},
			},
		],
		define: {
			__BUILD_DATE__: Date.now(),
			__DEFAULT_TEXT__,
			__VERSION__: `"${pkgVersion}"`,
			__SW_SCOPE__: `"${base}"`,
			'process.env': JSON.stringify(env),
		},
		// resolve: {
		// 	alias: {
		// 		'@api': isClientServerMode ? './api' : 'taraskevizer',
		// 	},
		// },
		build: {
			minify: isProd,
			modulePreload: false,
			rollupOptions: {
				output: {
					entryFileNames: '[name].js',
					chunkFileNames: '[name].js',
					assetFileNames: '[name].[ext]',
				},
			},
		},
	};
});
