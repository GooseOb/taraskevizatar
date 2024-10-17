import { dicts, htmlConfigOptions, TaraskConfig } from 'taraskevizer';
import { jOptions } from './j-options';
import { alphabets } from './alphabets';

const getSettingsLS = (): TaraskConfig => {
	const parsed = JSON.parse(localStorage.tarask_settings);
	let result: TaraskConfig;
	if ('general' in parsed) {
		result = Object.assign(parsed.general, parsed.html, parsed.nonHtml);
		result.j = jOptions[parsed.j];
		result.variations = 'all';
	} else {
		result = parsed;
	}
	// @ts-ignore
	result.abc = alphabets[result.abc];
	return result;
};

export const taraskConfig = new TaraskConfig({
	...htmlConfigOptions,
	abc: dicts.alphabets.cyrillic,
	j: 'never',
	g: false,
	variations: 'all',
	...(localStorage.tarask_settings && getSettingsLS()),
	wrapperDict: htmlConfigOptions.wrapperDict,
});
