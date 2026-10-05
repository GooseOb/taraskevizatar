import { get, writable } from 'svelte/store';
import { taraskPlainTextConfig } from './config';
import { taraskParallel } from '$lib/workers/taraskPool';
import { ofFiles } from '$lib/plurals';
import { status } from './status';

export class FileData {
	id: number = Math.random() * 1e17;
	name: string;
	raw: string | null = null;
	value: string | null = null;

	constructor(name: string) {
		this.name = name;
	}
}

export interface FileDataProcessed extends FileData {
	raw: string;
	value: string;
}

export const files = writable<FileData[]>([]);

taraskPlainTextConfig.subscribe((cfg) => {
	const data = get(files);
	if (data.length === 0) {
		return;
	}
	void (async () => {
		// Convert every file concurrently; big files are additionally
		// split into chunks inside taraskParallel.
		await Promise.all(
			data.map(async (file) => {
				if (file.raw) {
					file.value = await taraskParallel(file.raw, cfg);
				}
			})
		);
		files.update((data) => data);
		status.set(`Абноўлена: ${ofFiles(data.length)}`);
	})();
});
