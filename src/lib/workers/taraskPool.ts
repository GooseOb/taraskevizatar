import { splitIntoChunks, type TaraskConfig } from 'taraskevizer';
import { ensureInit, tarask as taraskOnMainThread } from '$lib/taraskevizer';
import type { TaraskWorkerRequest, TaraskWorkerResponse } from './tarask.worker';

/**
 * Texts longer than this (in UTF-16 code units) are split into chunks with
 * `splitIntoChunks` (same safe boundaries the native CLI feeds to rayon:
 * never inside `<…>` tags or after apostrophe-likes) and converted
 * concurrently. Below it a single worker handles the whole text, keeping
 * the main thread free.
 */
export const PARALLEL_CHUNK_THRESHOLD = 100_000;

const MAX_WORKERS = 8;

export const getWorkerCount = (): number => {
	const concurrency =
		typeof navigator !== 'undefined' && navigator.hardwareConcurrency
			? navigator.hardwareConcurrency
			: 4;
	return Math.min(MAX_WORKERS, Math.max(1, concurrency));
};

export const canUseWorkers = (): boolean =>
	typeof window !== 'undefined' && typeof Worker !== 'undefined';

interface PendingTask {
	resolve: (value: string) => void;
	reject: (err: Error) => void;
}

class TaraskWorkerPool {
	private workers: Worker[] = [];
	private idle: Worker[] = [];
	private waiters: Array<() => void> = [];
	private pending = new Map<Worker, PendingTask>();
	private nextId = 1;
	private maxWorkers = getWorkerCount();

	private createWorker(): Worker | null {
		try {
			const worker = new Worker(new URL('./tarask.worker.ts', import.meta.url), {
				type: 'module',
			});
			worker.onmessage = (e: MessageEvent<TaraskWorkerResponse>) => {
				const task = this.pending.get(worker);
				if (!task) return;
				this.pending.delete(worker);
				if (e.data.ok) {
					task.resolve(e.data.value ?? '');
				} else {
					task.reject(new Error(e.data.error ?? 'Worker conversion failed'));
				}
				this.release(worker);
			};
			worker.onerror = () => {
				const task = this.pending.get(worker);
				if (task) {
					this.pending.delete(worker);
					task.reject(new Error('Worker error'));
				}
				this.release(worker);
			};
			this.workers.push(worker);
			return worker;
		} catch {
			return null;
		}
	}

	private acquire(): Promise<Worker | null> {
		if (!canUseWorkers()) {
			return Promise.resolve(null);
		}
		const free = this.idle.pop();
		if (free) {
			return Promise.resolve(free);
		}
		if (this.workers.length < this.maxWorkers) {
			const worker = this.createWorker();
			if (worker) {
				return Promise.resolve(worker);
			}
			return Promise.resolve(null);
		}
		return new Promise<Worker | null>((resolve) => {
			this.waiters.push(() => {
				const next = this.idle.pop();
				if (next) {
					resolve(next);
					return;
				}
				if (this.workers.length < this.maxWorkers) {
					resolve(this.createWorker());
					return;
				}
				resolve(null);
			});
		});
	}

	private release(worker: Worker): void {
		const waiter = this.waiters.shift();
		if (waiter) {
			this.idle.push(worker);
			waiter();
			return;
		}
		this.idle.push(worker);
	}

	/** Convert one unit of text on a single pooled worker (main-thread fallback). */
	run(text: string, config: TaraskConfig): Promise<string> {
		const workerPromise = this.acquire();
		return workerPromise.then((worker) => {
			if (!worker) {
				return taraskOnMainThread(text, config);
			}
			return new Promise<string>((resolve, reject) => {
				const id = this.nextId++;
				this.pending.set(worker, {
					resolve,
					reject: (err) => {
						// If the worker itself is broken, fall back to the main
						// thread so one bad worker never fails a conversion.
						taraskOnMainThread(text, config).then(resolve, () => reject(err));
					},
				});
				try {
					const msg: TaraskWorkerRequest = { id, text, config };
					worker.postMessage(msg);
				} catch (err) {
					this.pending.delete(worker);
					this.release(worker);
					return taraskOnMainThread(text, config).then(resolve, () =>
						reject(err instanceof Error ? err : new Error(String(err)))
					);
				}
			});
		});
	}
}

let pool: TaraskWorkerPool | null = null;

const getPool = (): TaraskWorkerPool => (pool ??= new TaraskWorkerPool());

/** Convert a single chunk-sized unit via the pool (or main thread as fallback). */
export const taraskInWorker = (text: string, config: TaraskConfig): Promise<string> =>
	getPool().run(text, config);

/**
 * Convert text, splitting big inputs into `splitIntoChunks` pieces processed
 * concurrently across the pool. Small inputs go through a single worker so
 * the UI thread never blocks on conversion.
 *
 * Falls back to main-thread conversion where Web Workers are unavailable
 * (SSR, old browsers) or when the pool can't spawn a worker.
 */
export const taraskParallel = async (text: string, config: TaraskConfig): Promise<string> => {
	if (!canUseWorkers()) {
		return taraskOnMainThread(text, config);
	}
	if (text.length < PARALLEL_CHUNK_THRESHOLD) {
		return taraskInWorker(text, config);
	}
	await ensureInit();
	let chunks: string[];
	try {
		chunks = splitIntoChunks(text, getWorkerCount());
	} catch {
		return taraskInWorker(text, config);
	}
	if (!chunks || chunks.length <= 1) {
		return taraskInWorker(text, config);
	}
	const converted = await Promise.all(chunks.map((chunk) => taraskInWorker(chunk, config)));
	return converted.join('');
};
