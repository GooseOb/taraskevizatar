import { loadEnv, defineConfig } from 'vite';
import { readFile } from 'node:fs/promises';
import path from 'path';
import cacheVersioner from './plugins/cache-versioner';
import { createHtmlPlugin } from 'vite-plugin-html';

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
			'process.env': JSON.stringify(env),
		},
		resolve: {
			alias: {
				'@api': isClientServerMode ? './api' : 'taraskevizer',
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
			minify: isProd,
			modulePreload: false,
		},
	};
});
