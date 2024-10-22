import type { TaraskConfig } from 'taraskevizer';
import { alphabets } from './alphabets';
import { jOptions } from './j-options';
import type { ThemeId } from './theme';

export const getThemeId = (): `${ThemeId}` => localStorage.theme;
export const setThemeId = (themeId: number) => {
	localStorage.theme = themeId;
};

type StoredConfig = Partial<
	Pick<TaraskConfig, 'abc' | 'j' | 'g' | 'variations' | 'doEscapeCapitalized'>
>;
type InternalConfigStructure = Omit<StoredConfig, 'abc'> & {
	abc?: number;
};

export const getConfig = () => {
	let result: StoredConfig;
	if (localStorage.tarask_settings) {
		const parsed = JSON.parse(localStorage.tarask_settings);
		if ('general' in parsed) {
			result = Object.assign(parsed.general, parsed.html, parsed.nonHtml);
			result.j = jOptions[parsed.j];
			result.variations = 'all';
		} else {
			result = parsed;
		}
		// @ts-ignore
		result.abc = alphabets[result.abc];
	} else {
		result = {};
	}
	return result;
};
export const setConfig = (cfg: StoredConfig) => {
	const obj: InternalConfigStructure = {};
	obj.j = cfg.j;
	obj.g = cfg.g;
	obj.variations = cfg.variations;
	obj.doEscapeCapitalized = cfg.doEscapeCapitalized;
	if (cfg.abc) obj.abc = alphabets.indexOf(cfg.abc);

	localStorage.tarask_settings = JSON.stringify(obj);
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
