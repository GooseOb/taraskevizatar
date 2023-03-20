import {wordlist, softers, arabLetters, latinLetters, latinLettersUpCase, gobj} from './dict';

const isUpCase = (str: string): boolean =>
	str === str.toUpperCase();

const NOFIX_CHAR = ' \uffff ';
const NOFIX_REGEX = new RegExp(NOFIX_CHAR, 'g');

const enum Abc {cyrillic, latin, arabic}
const enum J {never, random, always}

interface options {abc: Abc, j: J}

export function toTaraskConvert(
	text: string,
	isHtml: boolean,
	{abc = 0, j = 0}: options
) {
	const noFix: string[] = [];

	text = ` ${text.trim()}  `
		.replace(/<[,.]?((?:.|\s)*?)>/g, ($0, $1) => {
			if ($0[1] === ',') return `<${$1}>`;
			noFix[noFix.length] = $0[1] === '.' ? $1 : $0;
			return NOFIX_CHAR;
		})
		.replace(/г'/g, 'ґ')
		.replace(/(\n|\t)/g, ' $1 ')
		.replace(/ - /g, ' — ')
		.replace(/(\p{P}|\p{S}|\d)/gu, ' $1 ')
		.replace(/ ['`’] (?=\S)/g, '’')
		.replace(/\(/g, '&#40');
	let splittedOrig: string[], splitted: string[];
	switch (abc) {
		case Abc.cyrillic:
			splittedOrig = text.split(' ');
		break;case Abc.latin:
			splittedOrig = toLatin(text).split(' ');
		break;case Abc.arabic:
			splittedOrig = toArab(text.toLowerCase()).split(' ');
	}
	text = toTarask(text.toLowerCase());
	if (j) text = toJ(text, j === J.always);
	switch (abc) {
		case Abc.latin:
			text = toLatin(text, false);
		break;case Abc.arabic:
			text = toArab(text);
	}
	splitted = text.split(' ');
	if (abc !== Abc.arabic) splitted = restoreRegister(splitted, splittedOrig);
	if (isHtml) splitted = toHtmlTags(splitted, splittedOrig, abc);
	text = splitted
		.join(' ')
		.replace(/&#160;/g, ' ')
		.replace(/ (\p{P}|\p{S}|\d|&#40) /gu, '$1');
	if (isHtml) {
		switch (abc) {
			case Abc.cyrillic:
				text = text
					.replace(/ґ/g, '<tarH>г</tarH>')
					.replace(/Ґ/g, '<tarH>Г</tarH>');
			break;case Abc.latin:
				text = text
					.replace(/([AEIOUY])(?:<tarF>)?Ŭ(?:<\/tarF>)?/g, '$1U')
					.replace(/([Gg][Ee]?)/g, '<tarH>$1</tarH>');
			break;case Abc.arabic:
				text = text.replace(/غ/g, '<tarH>ه</tarH>');
		}
	}
	if (noFix.length) text = text.replace(NOFIX_REGEX, () => noFix.shift());
	const regExp = /\(.*?\)/g;
	text = isHtml
		? text
			.replace(regExp, $0 => {
				const options = $0.slice(1, -1).split('|');
				const main = options.shift();
				return `<tarL data-l='${options}'>${main}</tarL>`;
			})
			.replace(/ \n /g, '<br>')
		: text
			.replace(regExp, $0 => $0.slice(1, -1).split('|')[0])
			.replace(/&#40/g, '(');

	return text.trim();
}

function restoreRegister(text: string[], orig: string[]): string[] {
	for (let i = 0; i < text.length; i++) {
		const  word = text[i];
		const oWord = orig[i];
		if (word === oWord) continue;
		if (word === oWord.toLowerCase()) {
			text[i] = oWord;
			continue;
		};
		if (
			!oWord[0] ||
			!isUpCase(oWord[0])
		) continue;
		if (word === 'зь') text[i] = isUpCase(orig[i + 1]) ? 'ЗЬ' : 'Зь'
		else if (isUpCase(oWord[oWord.length - 1])) text[i] = word.toUpperCase()
		else text[i] = word[0] === '('
			? word.replace(/[\(\|]./g, $0 => $0.toUpperCase())
			: word[0].toUpperCase() + word.slice(1);
	}

	return text;
}

function toHtmlTags(text: string[], orig: string[], abc: Abc): string[] {
	for (let i = 0; i < text.length; i++) {
		const  word = text[i];
		const oWord = orig[i];
		if (
			word === oWord ||
			/\(/.test(word) ||
			(abc === Abc.latin && oWord === word.replace(/[Gg][Ee]?/, $0 => gobj[$0]))
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
		if (abc === Abc.cyrillic) {
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

		let fromStart = 0;
		let fromWordEnd = word.length - 1;
		const fromOWordEnd_START_VALUE = oWord.length - 1;
		let fromOWordEnd = fromOWordEnd_START_VALUE;

		while (word[fromStart] === oWord[fromStart])
			fromStart++;
		while (word[fromWordEnd] === oWord[fromOWordEnd])
			fromWordEnd--, fromOWordEnd--;

		if (oWord.length > word.length) {
			if (fromStart === 0) {
				if (fromOWordEnd === fromOWordEnd_START_VALUE) {
					text[i] = `<tarF>${word}</tarF>`;
					continue;
				}
			} else fromStart--, fromWordEnd++;
			if (fromWordEnd < 0) fromWordEnd = 0;
		}

		text[i] = word.slice(0, fromStart) +
			'<tarF>' + word.slice(fromStart, fromWordEnd + 1) + '</tarF>'
			+ word.slice(fromWordEnd + 1);
	}

	return text;
}

function toTarask(text: string): string {
	for (const key in wordlist) text = text.replace(wordlist[key], key);
	loop: do {
		for (const key in softers)
			text = text.replace(softers[key], key);
		for (const key in softers)
			if (key !== '$1дзьдз$2' && (softers[key] as RegExp).test(text))
				continue loop;
		break;
	} while (true);

	return text
		.replace(/ сьнід /, ' снід ')
		.replace(/ сьмі /, ' смі ')
		.replace(/ без(ь? \S+)/g, ($0, $1) => $1.match(/[аеёіоуыэюя]/g)?.length === 1 ? ' бяз' + $1 : $0)
		.replace(/ не (\S+)/g, ($0, $1) => $1.match(/[аеёіоуыэюя]/g)?.length === 1 ? ' ня ' + $1 : $0)
		.replace(/( (?:б[ея]|пра|цера)?з) і(\S*)/g, ($0, $1, $2) => /([ая]ў|ну)$/.test($2) ? $1 + 'ь і' + $2 : $0);
}

function toLatin(text: string, upCase = true): string {
	for (const key in latinLetters)
		text = text.replace(latinLetters[key], key);
	if (upCase) {
		for (const key in latinLettersUpCase)
			text = text.replace(latinLettersUpCase[key], key);
		text = text
			.replace(/ CH(?=\p{Ll})/gu, ' Ch')
			.replace(/ J[AEOU][\p{Ll} ]/gu, $0 => ' J' + $0[2].toLowerCase() + $0[3]);
	}
	return text;
}

function toArab(text: string): string {
	for (const key in arabLetters)
		text = text.replace(arabLetters[key], key);

	return text;
}

const subtoJ = ($1: string, $2: string): string =>
	$1 + 'й ' + ($2 ? 'у' : '');
function toJ(text: string, alwaysJ = false): string {
	return text.replace(/([аеёіоуыэюя] )і (ў?)/g, alwaysJ
		? ($0, $1, $2) => subtoJ($1, $2)
		: ($0, $1, $2) =>
			Math.random() >= 0.5 ? subtoJ($1, $2) : $0
	);
}