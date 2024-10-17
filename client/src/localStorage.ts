import type { TaraskConfig } from 'taraskevizer';
import { alphabets } from './alphabets';
import { jOptions } from './j-options';
import type { Theme } from './theme';

export const getThemeId = (): `${Theme}` => localStorage.theme;
export const setThemeId = (themeId: number) => {
	localStorage.theme = themeId;
};

export const getConfig = (): TaraskConfig => {
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
export const setConfig = (taraskConfig: TaraskConfig) => {
	localStorage.tarask_settings = JSON.stringify({
		...taraskConfig,
		abc: alphabets.indexOf(taraskConfig.abc) as any,
		wrapperDict: null,
	});
};

export const getText = () => localStorage.tarask_text;
export const setText = (text: string) => {
	localStorage.tarask_text = text;
};

export const clear = () => {
	delete localStorage.tarask_text;
	delete localStorage.tarask_settings;
	delete localStorage.theme;
};
