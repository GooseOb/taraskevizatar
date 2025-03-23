import { dicts } from 'taraskevizer';
import type { Alphabet } from 'taraskevizer/dist/dict/alphabets';

export const alphabets = [
	dicts.alphabets.cyrillic,
	dicts.alphabets.latin,
	dicts.alphabets.arabic,
	dicts.alphabets.latinJi,
];

export const isArabic = (alphabet: Alphabet) =>
	alphabet === dicts.alphabets.arabic;

export const OUTPUT_PLACEHOLDER = [
	// force wrap
	'Тэкст',
	'Tekst',
	'طَقْصْطْ',
	'Tekst',
] as const;
