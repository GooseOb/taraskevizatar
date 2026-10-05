import { derived } from 'svelte/store';
import { alphabets } from '$lib/alphabets';
import {
	htmlConfigOptions,
	type TaraskAlphabet,
	type TaraskJ,
	type TaraskConfig,
} from 'taraskevizer';
import { localStorageWritable } from './localStorage';

type SerializableConfig = Pick<TaraskConfig, 'j' | 'doEscapeCapitalized' | 'g' | 'abc'>;

export const taraskConfig = localStorageWritable<TaraskConfig>(
	'tarask_settings',
	(): TaraskConfig => ({
		...htmlConfigOptions(),
		abc: 'cyrillic',
		j: 'never',
		doEscapeCapitalized: true,
		g: false,
	}),
	(value) => {
		const { abc, j, doEscapeCapitalized, g }: SerializableConfig = JSON.parse(value);

		return {
			...htmlConfigOptions(),
			abc: typeof abc === 'string' ? abc : (alphabets[abc] ?? 'cyrillic'),
			j,
			doEscapeCapitalized,
			g,
		};
	},
	({ j, doEscapeCapitalized, g, abc }) =>
		JSON.stringify({
			j,
			doEscapeCapitalized,
			g,
			abc,
		} satisfies SerializableConfig)
);

export const taraskPlainTextConfig = derived(taraskConfig, (config): TaraskConfig => ({
	...config,
	wrappers: 'none',
}));
