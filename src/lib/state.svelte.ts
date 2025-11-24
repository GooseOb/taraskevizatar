import { dicts, htmlConfigOptions, TaraskConfig } from 'taraskevizer';
import { localStorageWritable, localStorageWritableString } from './localStorage';
import { alphabets } from './alphabets';

type SerializableConfig = Pick<TaraskConfig, 'j' | 'doEscapeCapitalized' | 'g'> & {
	abc: number;
};

export const taraskConfig = localStorageWritable<TaraskConfig>(
	'tarask_settings',
	() =>
		new TaraskConfig({
			abc: dicts.alphabets.cyrillic,
			j: 'never',
			doEscapeCapitalized: true,
			g: false
		}),
	(value) => {
		const parsed: SerializableConfig = JSON.parse(value);

		return new TaraskConfig({
			...htmlConfigOptions,
			abc: alphabets[parsed.abc],
			j: parsed.j,
			doEscapeCapitalized: parsed.doEscapeCapitalized,
			g: parsed.g
		});
	},
	(value) =>
		JSON.stringify({
			j: value.j,
			doEscapeCapitalized: value.doEscapeCapitalized,
			g: value.g,
			abc: alphabets.indexOf(value.abc)
		} satisfies SerializableConfig)
);

export const taraskText = localStorageWritableString('tarask_text', () => __DEFAULT_TEXT__, 400);

let status = $state('');

export const setStatus = (value: string) => {
	status = value;
};

export const getStatus = () => status;
