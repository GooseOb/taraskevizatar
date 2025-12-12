import { dicts, htmlConfigOptions, pipelines, TaraskConfig } from 'taraskevizer';
import { localStorageWritable, localStorageWritableString } from './localStorage';
import { alphabets, getOutputPlaceholder } from './alphabets';
import { derived, writable } from 'svelte/store';
import { ofFiles } from './numeral-helpers';

type SerializableConfig = Pick<TaraskConfig, 'j' | 'doEscapeCapitalized' | 'g'> & {
	abc: number;
};

export const taraskConfig = localStorageWritable<TaraskConfig>(
	'tarask_settings',
	() =>
		new TaraskConfig({
			...htmlConfigOptions,
			abc: dicts.alphabets.cyrillic,
			j: 'never',
			doEscapeCapitalized: true,
			g: false,
		}),
	(value) => {
		const parsed: SerializableConfig = JSON.parse(value);

		return new TaraskConfig({
			...htmlConfigOptions,
			abc: alphabets[parsed.abc],
			j: parsed.j,
			doEscapeCapitalized: parsed.doEscapeCapitalized,
			g: parsed.g,
		});
	},
	(value) =>
		JSON.stringify({
			j: value.j,
			doEscapeCapitalized: value.doEscapeCapitalized,
			g: value.g,
			abc: alphabets.indexOf(value.abc),
		} satisfies SerializableConfig)
);

export const taraskPlainTextConfig = derived(
	taraskConfig,
	({ abc, j, g, doEscapeCapitalized }) =>
		new TaraskConfig({
			abc,
			j,
			g,
			doEscapeCapitalized,
			wrappers: null,
		})
);

export const taraskText = localStorageWritableString('tarask_text', () => __DEFAULT_TEXT__, 400);

export const outputText = derived([taraskText, taraskConfig], ([$taraskText, $taraskConfig]) => {
	if (!$taraskText.trim()) {
		return getOutputPlaceholder($taraskConfig.abc);
	}
	try {
		return pipelines.tarask($taraskText, $taraskConfig);
	} catch (e) {
		return (
			(e as Error).toString() +
			'<br><br>Калі ласка, дашліце памылку на адзін з кантактаў "Для памылак і прапановаў"'
		);
	}
});

export const theme = localStorageWritableString<'0' | '1' | '2'>('theme', () => '0', 10);

theme.subscribe((value) => {
	document.documentElement.className =
		value === '0'
			? 'light'
			: value === '2'
				? 'dark'
				: window.matchMedia?.('(prefers-color-scheme: dark)').matches
					? 'dark'
					: 'light';
});

export const status = writable<string>('');

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
		status.set(`Абнаўленне файлаў... [0/${data.length}]`);
		for (let i = 0; i < data.length; i++) {
			const file = data[i];
			if (file.raw) {
				file.value = pipelines.tarask(file.raw!, cfg);
			}
			status.set(`Абнаўленне файлаў... [${i + 1}/${data.length}]`);
		}
		status.set(`${ofFiles(data.length)} абноўлена.`);
		return data;
	});
});

export const previousPathname = writable<string>('/taraskevizatar');
