import {wordlist, softers, arabLetters, latinLetters, latinLettersUpperCase, gobj, Dict} from './dict';
import {Alphabet, J, Tarask, TaraskPromise} from './taraskTypes';

const isUpperCase = (str: string): boolean =>
	str === str.toUpperCase();

const NOFIX_CHAR = ' \uffff ';
const NOFIX_REGEX = new RegExp(NOFIX_CHAR, 'g');

type AlphabetDependent<T> = {[key in Alphabet]?: T};
type Letters = AlphabetDependent<Dict>;
const letters: Letters = {
	[Alphabet.latin]: latinLetters,
	[Alphabet.arabic]: arabLetters
};
const lettersUpperCase: Letters = {
	[Alphabet.latin]: latinLettersUpperCase
};
const gReplacements: AlphabetDependent<[string, RegExp][]> = {
	[Alphabet.cyrillic]: [
		['<tarH>г</tarH>', /ґ/g],
		['<tarH>Г</tarH>', /Ґ/g]
	],
	[Alphabet.latin]: [
		['$1U', /([AEIOUY])(?:<tarF>)?Ŭ(?:<\/tarF>)?/g],
		['<tarH>$1</tarH>', /([Gg][Ee]?)/g]
	],
	[Alphabet.arabic]: [
		['<tarH>ه</tarH>', /غ/g]
	]
};

export const taraskSync: Tarask = (
	text,
	isHtml,
	{abc = 0, j = 0}
) => {
	const noFix: string[] = [];

	const LEFT_ANGLE_BRACKET = isHtml ? '&lt;' : '<';

	text = ` ${text.trim()}  `
		.replace(/<([,.]?)((?:.|\s)*?)>/g, ($0, $1, $2) => {
			if ($1 === ',') return LEFT_ANGLE_BRACKET + $2 + '>';
			noFix[noFix.length] = $1 === '.' ? $2 : $0;
			return NOFIX_CHAR;
		})
		.replace(/г'/g, 'ґ')
		.replace(/(\n|\t)/g, ' $1 ')
		.replace(/ - /g, ' — ')
		.replace(/(\p{P}|\p{S}|\d)/gu, ' $1 ')
		.replace(/ ['`’] (?=\S)/g, 'ʼ')
		.replace(/\(/g, '&#40');

	let splittedOrig: string[], splitted: string[];
	splittedOrig = replaceWithDict(replaceWithDict(text, letters[abc]), lettersUpperCase[abc])
		.split(' ');

	text = toTarask(text.toLowerCase());
	if (j) text = replaceIbyJ(text, j === J.always);
	text = replaceWithDict(text, letters[abc]);

	splitted = text.split(' ');
	if (abc !== Alphabet.arabic) splitted = restoreCase(splitted, splittedOrig);
	if (isHtml) splitted = toHtmlTags(splitted, splittedOrig, abc);

	text = splitted
		.join(' ')
		.replace(/&#160;/g, ' ')
		.replace(/ (\p{P}|\p{S}|\d|&#40) /gu, '$1');

	if (isHtml) for (const [result, pattern] of gReplacements[abc])
		text = text.replace(pattern, result);

	if (noFix.length) text = text.replace(NOFIX_REGEX, () => noFix.shift());
	const optionalWordsRegExp = /\(.*?\)/g;

	return (isHtml
		? text
			.replace(optionalWordsRegExp, $0 => {
				const options = $0.slice(1, -1).split('|');
				const main = options.shift();
				return `<tarL data-l='${options}'>${main}</tarL>`;
			})
			.replace(/ \n /g, '<br>')
		: text
			.replace(optionalWordsRegExp, $0 => $0.slice(1, -1).split('|')[0])
			.replace(/&#40/g, '(')
	).trim();
}

export const tarask: TaraskPromise = (...args) =>
	new Promise(res => res(taraskSync(...args)));

function restoreCase(text: string[], orig: string[]): string[] {
	for (let i = 0; i < text.length; i++) {
		const  word = text[i];
		const oWord = orig[i];
		if (word === oWord) continue;
		if (word === oWord.toLowerCase()) {
			text[i] = oWord;
			continue;
		}
		if (
			!oWord[0] ||
			!isUpperCase(oWord[0])
		) continue;
		if (word === 'зь') text[i] = isUpperCase(orig[i + 1]) ? 'ЗЬ' : 'Зь'
		else if (isUpperCase(oWord[oWord.length - 1])) text[i] = word.toUpperCase()
		else text[i] = word[0] === '('
			? word.replace(/[(|]./g, $0 => $0.toUpperCase())
			: word[0].toUpperCase() + word.slice(1);
	}

	return text;
}

function toHtmlTags(text: string[], orig: string[], abc: Alphabet): string[] {
	for (let i = 0; i < text.length; i++) {
		const  word = text[i];
		const oWord = orig[i];
		if (
			word === oWord ||
			/\(/.test(word) ||
			(abc === Alphabet.latin && oWord === word.replace(/[Gg][Ee]?/, $0 => gobj[$0]))
		) continue;
		if (word.length === oWord.length) {
			const LettersText = word.split('');
			for (let x = 0; x < LettersText.length; x++) {
				if (LettersText[x] !== oWord[x])
					LettersText[x] = `<tarF>${LettersText[x]}</tarF>`;
			}
			text[i] = LettersText.join('');
			continue;
		}
		if (abc === Alphabet.cyrillic) {
			const word1 = word.replace(/ь/g, '');
			switch (oWord) {
				case word1:
					text[i] = word.replace(/ь/g, '<tarF>ь</tarF>');
					continue;
				case word1 + 'ь':
					text[i] = word.slice(0, -1).replace(/ь/g, '<tarF>ь</tarF>') + 'ь';
					continue;
				case word.replace(/[аую]/, 'ір$&'):
					text[i] = word.replace(/.[аую]/, '<tarF>$&</tarF>');
					continue;
			}
		}

		const oWordEnd = oWord.length - 1;
		let fromStart = 0;
		let fromWordEnd = word.length - 1;
		let fromOWordEnd = oWordEnd;

		while (word[fromStart] === oWord[fromStart])
			++fromStart;
		while (word[fromWordEnd] === oWord[fromOWordEnd])
			--fromWordEnd, --fromOWordEnd;

		if (oWord.length > word.length) {
			if (fromStart === 0) {
				if (fromOWordEnd === oWordEnd) {
					text[i] = `<tarF>${word}</tarF>`;
					continue;
				}
			} else ++fromStart, ++fromWordEnd;
			if (fromWordEnd < 0) fromWordEnd = 0;
		}

		text[i] = word.slice(0, fromStart) +
			'<tarF>' + word.slice(fromStart, fromWordEnd + 1) + '</tarF>'
			+ word.slice(fromWordEnd + 1);
	}

	return text;
}

function toTarask(text: string): string {
	text = replaceWithDict(text, wordlist);
	loop: do {
		text = replaceWithDict(text, softers);
		for (const key in softers)
			if (key !== '$1дзьдз' && softers[key].test(text))
				continue loop;
		break;
	} while (true);

	return text
		.replace(/ сь(?=нід |мі)/g, ' с')
		.replace(/ без(ь? \S+)/g, ($0, $1) =>
			$1.match(/[аеёіоуыэюя]/g)?.length === 1 ? ' бяз' + $1 : $0
		).replace(/ не (\S+)/g, ($0, $1) =>
			$1.match(/[аеёіоуыэюя]/g)?.length === 1 ? ' ня ' + $1 : $0
		).replace(/( (?:б[ея]|пра|цера)?з) і(\S*)/g, ($0, $1, $2) =>
			/([ая]ў|ну)$/.test($2) ? $1 + 'ь і' + $2 : $0
		);
}

function replaceWithDict(text: string, dict: Dict = null): string {
	for (const key in dict)
		text = text.replace(dict[key], key);

	return text;
}

const toJ = ($1: string, $2: string): string =>
	$1 + 'й ' + ($2 ? 'у' : '');
function replaceIbyJ(text: string, always = false): string {
	return text.replace(/([аеёіоуыэюя] )і (ў?)/g, always
		? ($0, $1, $2) => toJ($1, $2)
		: ($0, $1, $2) =>
			Math.random() >= 0.5 ? toJ($1, $2) : $0
	);
}
