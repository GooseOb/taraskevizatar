Object.assign(String.prototype, {
	toTaraskConvert(arg1, arg2) {return toTaraskConvert(this, arg1, arg2)},
	// toBel() {return toBel(this)},
	toTarask() {return toTarask(this)},
	toArab() {return toArab(this)},
	toLatin(arg) {return toLatin(this, arg)},
	toJ(arg) {return toJ(this, arg)}
});
Object.assign(Array.prototype, {
	restoreRegister(value1) {return restoreRegister(this, value1)},
	addColor(value) {return addColor(this, value)}
});
const isUpCase = str => str === str.toUpperCase();

function toTaraskConvert(text, isColored, {abc = 0, j = 0}) {
	const isArab = abc === 2;
	const noFix = Array(text.match(/ !>/g)?.length || 0);
	while (noFix.length > text.match(/<! /g)?.length) noFix.pop();
	if (noFix.length) {
		text = text.replace(/౦/g, '');
		for (let i = 0; i < noFix.length; i++) {
			text = text.replace(/<! /, '<!' + i).replace(/ !>/, i + '!>');
			noFix[i] = text.match(/<!\d+(.+)\d+!>/)[1];
			text = text.replace(/<!\d+.+\d+!>/, '౦');
		};
	};
	text = ` ${text.trim()}  `
		.replace(/г'/g, 'ґ')
		.replace(/(\n|\t)/g, ' $1 ')
		.replace(/ - /g, ' — ')
		.replace(/(\p{P}|\p{S}|\d)/gu, ' $1 ')
		.replace(/ ['`’] (?=\S)/g, '’');
	let textSplit;
	switch (abc) {
		case 0: textSplit = text.split(' '); break;
		case 1: textSplit = text.toLatin().split(' '); break;
		default: textSplit = text.toLowerCase().toArab().split(' ');
	};
	text = text
		.toLowerCase()
		// .toBel()
		.toTarask()
	if (j) text = text.toJ(j === 2);
	switch (abc) {
		case 1: text = text.toLatin(false); break;
		case 2: text = text.toArab();
	};
	text = text.split(' ');
	if (!isArab) text = text.restoreRegister(textSplit);
	if (isColored) text = text.addColor(textSplit);
	text = text
		.join(' ')
		.replace(/&#160;/g, ' ')
		.replace(/ (\p{P}|\p{S}|\d) /gu, '$1');
	if (isColored) {
		switch (abc) {
			case 0:
				text = text
					.replace(/ґ/g, '<tarG>г</tarG>')
					.replace(/Ґ/g, '<tarG>Г</tarG>');
				break;
			case 1:
				text = text
					.replace(/([AEIOUY])(?:<tarF>)?Ŭ(?:<\/tarF>)?/g, '$1U')
					.replace(/g/g, '<tarG>g</tarG>')
					.replace(/>G/g, '><tarG>G</tarG>');
				break;
			default: text = text.replace(/غ/g, '<tarG>ه</tarG>');
		};
	};
	if (noFix.length) text = text.replace(/౦/g, () => noFix.shift());
	const regExp = isArab
		? /(?:\([\p{L}’\- \u0600-\u06FF\u08AF]+\)){2,}/gu
		: /(?:\([\p{L}’\- ]+\)){2,}/gu;
	text = isColored
		? text
			.replace(regExp, $0 => {
				$0 = $0.slice(1, -1).split(')(');
				const main = $0.shift();
				return `<tarL data-l='${$0}'>${main}</tarL>`;
			})
			.replace(/ \n /g, '<br>')
		: text
			.replace(regExp, $0 => $0.slice(1, -1).split(')(')[0]);

	return text.trim();
}

function restoreRegister(text, orig) {
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
			? word.replace(/\(./g, $0 => $0.toUpperCase())
			: word[0].toUpperCase() + word.slice(1);
	};

	return text;
}

function addColor(text, orig) {
	for (let i = 0; i < text.length; i++) {
		const  word = text[i];
		const oWord = orig[i];
		if (word === oWord || /\(/.test(word)) continue;
		if (word.length === oWord.length) {
			const LettersText = word.split('');
			for (let x = 0; x < LettersText.length; x++) {
				if (LettersText[x] !== oWord[x])
					LettersText[x] = `<tarF>${LettersText[x]}</tarF>`;
			};
			text[i] = LettersText.join('');
			continue;
		};
		const word1 = word.replace(/ь/g, '');
		switch (oWord) {
			case word1:
				text[i] = word.replace(/ь/g, '<tarF>ь</tarF>');
				continue;
			case word1 + 'ь':
				text[i] = word.slice(0, -1).replace(/ь/g, '<tarF>ь</tarF>') + 'ь';
				continue;
			case word.replace(/[ую]/, 'ір$&'):
				text[i] = word.replace(/[ую]/, '<tarF>$&</tarF>');
				continue;
		};
		if (oWord.length !== word.replace(/\((\p{L}+)\)\(\p{L}+\)/gu, '$1').length) {
			let fromStart = 0;
			let fromWordEnd = word.length - 1;
			const fromOWordEnd_StartValue = oWord.length - 1;
			let fromOWordEnd = fromOWordEnd_StartValue;

			while (word[fromStart] === oWord[fromStart])
				fromStart++;
			while (word[fromWordEnd] === oWord[fromOWordEnd])
				fromWordEnd--, fromOWordEnd--;

			if (fromWordEnd < fromOWordEnd && fromStart !== fromWordEnd) { // калі ў зыходным слове больш літар
				if (fromStart === 0 && fromOWordEnd === fromOWordEnd_StartValue) {
					text[i] = '<tarF>' + word + '</tarF>';
					continue;
				};
				fromStart--, fromWordEnd++;
			};

			text[i] = word.slice(0, fromStart) +
				'<tarF>' + word.slice(fromStart, fromWordEnd + 1) + '</tarF>'
				+ word.slice(fromWordEnd + 1);
		};
	};

	return text;
}

function toTarask(text) {
	for (const key in wordlist) text = text.replace(wordlist[key], key);
	loop: do {
		for (const key in softers)
			text = text.replace(softers[key], key);
		for (const key in softers)
			if (key !== '$1дзьдз$2' && softers[key].test(text))
				continue loop;
		break;
	} while (true);

	return text
		.replace(/ без(ь? \S+)/g, ($0, $1) => $1.match(/[аеёіоуыэюя]/g)?.length === 1 ? ' бяз' + $1 : $0)
		.replace(/ не (\S+)/g, ($0, $1) => $1.match(/[аеёіоуыэюя]/g)?.length === 1 ? ' ня ' + $1 : $0)
		.replace(/( (?:б[ея]|пра|цера)?з) і(\S*)/g, ($0, $1, $2) => /([ая]ў|ну)$/.test($2) ? $1 + 'ь і' + $2 : $0);
}

// function toBel(text) {
// 	return text
// 		.replace(/и/g, 'і')
// 		.replace(/([аеёіоуыэюя] ?)у/g, '$1ў')
// 		.replace(/ўм /g, 'ум ')
// 		.replace(/ўс /g, 'ус ')
// 		.replace(/ іўд(ай?|ав[аы]|у|зе) /g, ' іуд$1 ')
// 		.replace(/ ілеўс/g, ' ілеус')
// 		.replace(/щ/g, 'ў')
// 		.replace(/ъ/g, '’');
// }

function toLatin(text, upCase = true) {
	for (const key in latinLetters)
		text = text.replace(latinLetters[key], key);
	if (upCase) {
		for (const key in latinLettersUpCase)
			text = text.replace(latinLettersUpCase[key], key.toUpperCase());
		text = text
			.replace(/ CH(?=\p{Ll})/gu, ' Ch')
			.replace(/ J[AEOU][\p{Ll} ]/gu, $0 => ' J' + $0[2].toLowerCase() + $0[3]);
	};

	return text;
}

function toArab(text) {
	for (const key in arabLetters)
		text = text.replace(arabLetters[key], key);

	return text;
}

function toJ(text, alwaysJ = false) {
	return text.replace(/([аеёіоуыэюя] )і /g, '$1' + (alwaysJ
		? 'й '
		: $0 => Math.random() >= 0.5 ? 'й ' : $0
	));
}