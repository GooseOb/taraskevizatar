import { loadEnv, defineConfig } from 'vite';
import { readFile } from 'node:fs/promises';
import path from 'path';
import cacheVersioner from './plugins/cache-versioner';
import { createHtmlPlugin } from 'vite-plugin-html';
import { version as pkgVersion } from '../node_modules/taraskevizer/package.json';
import { build, transform } from 'esbuild';

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
			createHtmlPlugin({
				minify: isProd,
				entry: 'src/main.ts',
			}),
			{
				apply: 'build',
				enforce: 'post',
				transformIndexHtml(html) {
					build({
						minify: true,
						bundle: true,
						entryPoints: [path.resolve('src', 'service-worker', 'sw.ts')],
						outdir: path.resolve('dist'),
						plugins: [cacheVersioner(pkgVersion)],
					});
					const scriptPattern = /<script>[\s\S]+?<\/script>/g;
					return Promise.all(
						html.match(scriptPattern).map((code) =>
							transform(code.slice(22, -9), {
								minify: true,
								loader: 'js',
							})
						)
					).then((arr) => {
						arr.reverse();
						return html.replace(
							scriptPattern,
							() => `<script>${arr.pop().code}</script>`
						);
					});
				},
			},
		],
		define: {
			__BUILD_TIME__: Date.now(),
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
