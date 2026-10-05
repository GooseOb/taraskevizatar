import type { TaraskAlphabet } from 'taraskevizer';

export const alphabets: readonly TaraskAlphabet[] = [
	'cyrillic',
	'latin',
	'arabic',
	'latinJi',
] as const;

export const isArabic = (alphabet: TaraskAlphabet) => alphabet === 'arabic';

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

export const getOutputPlaceholder = (alphabet: TaraskAlphabet) =>
	alphabetToPlaceholder.get(alphabet) ?? 'Text';
