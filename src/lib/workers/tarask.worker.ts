/// <reference lib="webworker" />
// Dedicated worker: runs the taraskevizer WASM pipeline off the main thread.
//
// Each worker owns its own WASM instance (WASM memory can't be shared),
// so a pool of these gives true parallel conversion.
// NOTE: imports `taraskevizer` directly — NOT `$lib/taraskevizer`, whose
// `ensureInit` takes the Node/SSR branch when `window` is undefined
// (which is also true inside a Web Worker) and would try `node:fs`.
import { init, tarask, type TaraskConfig } from 'taraskevizer';

declare const self: DedicatedWorkerGlobalScope;

export interface TaraskWorkerRequest {
	id: number;
	text: string;
	config: TaraskConfig;
}

export interface TaraskWorkerResponse {
	id: number;
	ok: boolean;
	value?: string;
	error?: string;
}

let ready: Promise<unknown> | null = null;

self.onmessage = async (e: MessageEvent<TaraskWorkerRequest>) => {
	const { id, text, config } = e.data;
	try {
		ready ||= init();
		await ready;
		const value = tarask(text, config);
		self.postMessage({ id, ok: true, value } satisfies TaraskWorkerResponse);
	} catch (err) {
		self.postMessage({
			id,
			ok: false,
			error: err instanceof Error ? err.message : String(err),
		} satisfies TaraskWorkerResponse);
	}
};
