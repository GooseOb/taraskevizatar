import {Dict} from './types';

export function replaceWithDict(text: string, dict: Dict = null, regex: RegExp): string {
	for (const key in dict) {
		text = text.replace(dict[key], key);
		if (regex.test(text)) throw `'${key}': /${dict[key]}/`;
	}

	return text;
}