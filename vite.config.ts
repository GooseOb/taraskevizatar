import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { version as pkgVersion } from '../taraskevizer/package.json';
import { readFile } from 'node:fs/promises';

const base = process.env.BASE_PATH || '/';

export default defineConfig({
	plugins: [sveltekit()],
	optimizeDeps: {
		// The WASM glue uses `new URL('*.wasm', import.meta.url)`,
		// which only resolves correctly when loaded unbundled.
		exclude: ['taraskevizer'],
	},
	define: {
		__DEFAULT_TEXT__: JSON.stringify(await readFile('./default-text.txt', 'utf-8')),
		__BUILD_TIME__: Date.now(),
		__VERSION__: `"${pkgVersion}"`,
		__SW_SCOPE__: `"${base}"`,
		__CURRENT_YEAR__: `${new Date().getFullYear()}`,
	},
});
