import { dicts } from 'taraskevizer';

export const alphabets = [
	dicts.alphabets.cyrillic,
	dicts.alphabets.latin,
	dicts.alphabets.arabic,
	dicts.alphabets.latinJi,
];
export const OUTPUT_PLACEHOLDER = [
	// force wrap
	'Тэкст',
	'Tekst',
	'طَقْصْطْ',
	'Tekst',
] as const;
