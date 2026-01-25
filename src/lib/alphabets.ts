import { dicts } from 'taraskevizer';
import type { PickerOption } from './types';

export const alphabets = [
	dicts.alphabets.cyrillic,
	dicts.alphabets.latin,
	dicts.alphabets.arabic,
	dicts.alphabets.latinJi,
] as const;

export const alphabetOptions = [
	{ label: 'Кірылічны', value: dicts.alphabets.cyrillic },
	{ label: 'Лацінскі', value: dicts.alphabets.latin },
	{
		label: 'Арабскі',
		value: dicts.alphabets.arabic,
		note: { label: '(не стандартызаваны)', small: true },
	},
	{
		label: 'Лацінскі',
		value: dicts.alphabets.latinJi,
		note: { label: '(зь ji)', include: true },
	},
] satisfies PickerOption<dicts.alphabets.Alphabet>[];

export const getAlphabetLabel = (alphabet: dicts.alphabets.Alphabet) => {
	const option = alphabetOptions.find((opt) => opt.value === alphabet);
	return option ? [option.label, option.note?.label || ''].join(' ') : 'Невядомы';
};

export const isArabic = (alphabet: dicts.alphabets.Alphabet) => alphabet === dicts.alphabets.arabic;

const alphabetToPlaceholder = new Map(
	(
		[
			// force wrap
			'Тэкст',
			'Tekst',
			'طَقْصْطْ',
			'Tekst',
		] as const
	).map((placeholder, index) => [alphabets[index], placeholder])
);

export const getOutputPlaceholder = (alphabet: dicts.alphabets.Alphabet) =>
	alphabetToPlaceholder.get(alphabet) ?? 'Text';
