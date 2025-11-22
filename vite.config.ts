import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { version as pkgVersion } from './node_modules/taraskevizer/package.json';
import { readFile } from 'fs/promises';

const base = process.env.BASE_PATH || '/';

export default defineConfig({
	plugins: [sveltekit()],
	define: {
		__DEFAULT_TEXT__: JSON.stringify(
			await readFile('../default-text.txt', 'utf-8')
		),
		__BUILD_TIME__: Date.now(),
		__VERSION__: `"${pkgVersion}"`,
		__SW_SCOPE__: `"${base}"`,
	},
});
