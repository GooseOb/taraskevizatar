import { writable } from 'svelte/store';
import { taraskPlainTextConfig } from './config';
import { pipelines } from 'taraskevizer';
import { ofFiles } from '$lib/numeral-helpers';
import { status } from './status';

export interface FileData {
	name: string;
	raw: string | null;
	value: string | null;
}

export const files = writable<FileData[]>([]);

taraskPlainTextConfig.subscribe((cfg) => {
	files.update((data) => {
		if (data.length === 0) {
			return data;
		}
		status.set(`Абнаўленьне файлаў... [0/${data.length}]`);
		for (let i = 0; i < data.length; i++) {
			const file = data[i];
			if (file.raw) {
				file.value = pipelines.tarask(file.raw!, cfg);
			}
			status.set(`Абнаўленьне файлаў... [${i + 1}/${data.length}]`);
		}
		status.set(`${ofFiles(data.length)} абноўлена.`);
		return data;
	});
});
