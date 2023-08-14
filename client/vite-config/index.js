import { loadEnv, defineConfig } from 'vite';
import { readFile } from 'node:fs/promises';
import path from 'path';
import cacheVersioner from './plugins/cache-versioner';
import { createHtmlPlugin } from 'vite-plugin-html';

export const getDefaultText = () => readFile('default-text.txt', 'utf-8');

const __DEFAULT_TEXT__ = `\`${await getDefaultText()}\``;

export default defineConfig(({ command, mode }) => {
	console.log('using vite-config');
	const env = loadEnv(mode, path.resolve('..'), '');
	const isProd = command === 'build';
	const base = isProd ? '/taraskevizatar/' : '/';
	return {
		base,
		plugins: [
			cacheVersioner(),
			isProd &&
				createHtmlPlugin({
					minify: true,
				}),
		],
		define: {
			__BUILD_DATE__: Date.now(),
			__DEFAULT_TEXT__,
			__SW_SCOPE__: `"${base}"`,
		},
		resolve: {
			alias: {
				'@api': env.API ? './api' : 'taraskevizer',
			},
		},
		build: {
			lib: {
				entry: [
					path.resolve('index.html'),
					path.resolve('src/serviceWorker/sw.ts'),
				],
				name: 'name',
				formats: ['es'],
			},
		},
	};
});
