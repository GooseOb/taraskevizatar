import { init, tarask as taraskSync, type TaraskConfig } from 'taraskevizer';

let initPromise: Promise<unknown> | null = null;

export const ensureInit = () => {
	initPromise ||= (async () => {
		if (typeof window === 'undefined') {
			// SSR / prerender: initialise the WASM module from the sibling
			// checkout on disk (the `node` entry would do this itself when
			// loaded directly, but the SSR bundler may pick the browser entry).
			const { existsSync, readFileSync } = await import('node:fs');
			const wasmPath = process.cwd() + '/../taraskevizer/dist/wasm/taraskevizer_wasm_bg.wasm';
			if (existsSync(wasmPath)) {
				await init({ module_or_path: readFileSync(wasmPath) });
			}
			return;
		}
		await init();
	})();
	return initPromise;
};

if (typeof window !== 'undefined') {
	void ensureInit();
}

export type Pipeline = (text: string, config: TaraskConfig) => Promise<string>;

export const tarask = async (text: string, config: TaraskConfig): Promise<string> => {
	await ensureInit();
	return taraskSync(text, config);
};
