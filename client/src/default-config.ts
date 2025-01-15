import { dicts, htmlConfigOptions, TaraskConfig } from 'taraskevizer';
import { getConfig } from './localStorage';

export const taraskConfig = new TaraskConfig({
	...htmlConfigOptions,
	abc: dicts.alphabets.cyrillic,
	j: 'never',
	variations: 'all',
	...getConfig(),
});
