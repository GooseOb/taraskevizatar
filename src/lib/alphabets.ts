import { dicts } from 'taraskevizer';

export const alphabets = [
	dicts.alphabets.cyrillic,
	dicts.alphabets.latin,
	dicts.alphabets.arabic,
	dicts.alphabets.latinJi
] as const;

export const isArabic = (alphabet: dicts.alphabets.Alphabet) => alphabet === dicts.alphabets.arabic;

const alphabetToPlaceholder = new Map(
	(
		[
			// force wrap
			'Тэкст',
			'Tekst',
			'طَقْصْطْ',
			'Tekst'
		] as const
	).map((placeholder, index) => [alphabets[index], placeholder])
);

export const getOutputPlaceholder = (alphabet: dicts.alphabets.Alphabet) =>
	alphabetToPlaceholder.get(alphabet) ?? 'Text';
