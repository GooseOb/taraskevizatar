import { dicts, htmlConfigOptions, TaraskConfig } from 'taraskevizer';
import { derived } from 'svelte/store';
import { alphabets } from '$lib/alphabets';
import { localStorageWritable } from './localStorage';

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
