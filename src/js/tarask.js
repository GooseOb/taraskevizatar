Object.assign(String.prototype, {
	toTaraskConvert: function(value1, value2) {return toTaraskConvert(this, value1, value2)},
	// toBel: function() {return toBel(this)},
	toTarask: function() {return toTarask(this)},
	toArab: function() {return toArab(this)},
	toLatin: function(value) {return toLatin(this, value)},
	toJ: function(value) {return toJ(this, value)}
});
Object.assign(Array.prototype, {
	restoreRegister: function(value1) {return restoreRegister(this, value1)},
	addColor: function(value) {return addColor(this, value)}
});
const isUpCase = str => str === str.toUpperCase();

function toTaraskConvert(text, abc = 0, checkJ = 2) {
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
		.replace(/(\n|	)/g, ' $1 ')
		.replace(/ - /g, ' — ')
		.replace(/(\p{P}|\p{S}|\d)/gu, ' $1 ')
		.replace(/ ['`’] (\S)/gu, '’$1');
	switch (abc) {
		case 0: textSplit = text.split(' '); break;
		case 1: textSplit = text.toLatin().split(' '); break;
		default: textSplit = text.toLowerCase().toArab().split(' ');
	};
	text = text
		.toLowerCase()
		// .toBel()
		.toTarask();
	if (checkJ) text = text.toJ(checkJ === 2);
	switch (abc) {
		case 1: text = text.toLatin(false); break;
		case 2: text = text.toArab();
	};
	text = text.split(' ');
	if (!isArab) text = text.restoreRegister(textSplit);
	text = text
		.addColor(textSplit)
		.join(' ')
		.replace(/&#160;/g, ' ')
		.replace(/ (\p{P}|\p{S}|\d) /gu, '$1');
	switch (abc) {
		case 0:
			text = text
				.replace(/ґ/g, '<tarG>г</tarG>')
				.replace(/Ґ/g, '<tarG>Г</tarG>');
			break;
		case 1:
			text = text
				.replace(/([AEIOUY])(?:<tarF>)?Ŭ(?:<\/tarF>)?/g, '$1U')
				.replace(/g/g, '<tarG>h</tarG>')
				.replace(/>G/g, '><tarG>H</tarG>');
			break;
		default: text = text.replace(/غ/g, '<tarG>ه</tarG>');
	};
	if (noFix.length) text = text.replace(/౦/g, () => noFix.shift());
	const regExp = isArab
		? /(?:\([\p{L}’\- \u0600-\u06FF\u08AF]+\)){2,}/gu
		: /(?:\([\p{L}’\- ]+\)){2,}/gu;
	return text
		.replace(regExp, a => {
			a = a.slice(1, -1).split(')(');
			const b = a.shift();
			return `<tarL data-l='${a}'>${b}</tarL>`;
		})
		.replace(/ \n /g, '<br>')
		.trim();
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
			? word.replace(/\(./g, a => a.toUpperCase())
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
			case word1+'ь':
				text[i] = word.slice(0, -1).replace(/ь/g, '<tarF>ь</tarF>')+'ь';
				continue;
			case word.replace(/(у|ю)/g, 'ір$1'):
				text[i] = word.replace(/(у|ю)/g, '<tarF>$1</tarF>');
				continue;
		};
		if (oWord.length !== word.replace(/\((\p{L}+)\)\(\p{L}+\)/gu, '$1').length) {
			let x1 = 0; // word start -> fix start
			let x2 = word.length-1; // word end -> fix end
			let o = oWord.length-1; // oWord end
			while (word[x1] === oWord[x1]) x1++;
			while (word[x2] === oWord[o]) x2--, o--;
			if (x2 < o && x1 !== x2) x1--, x2++; // калі ў зыходным слове больш літар
			text[i] = word.slice(0, x1) + '<tarF>' + word.slice(x1, x2+1) + '</tarF>' + word.slice(x2+1);
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
		.replace(/ без(ь? \S+)/g, (a, b) => b.match(/[аеёіоуыэюя]/g)?.length === 1 ? ' бяз' + b : a)
		.replace(/ не (\S+)/g, (a, b) => b.match(/[аеёіоуыэюя]/g)?.length === 1 ? ' ня ' + b : a)
		.replace(/( (?:б[ея]|пра|цера)?з) і(\S*)/g, (a, b, c) => /([ая]ў|ну)$/.test(c) ? b + 'ь і' + c : a);
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
			.replace(/ CH(\p{Ll})/gu, ' Ch$1')
			.replace(/ J[AEOU]\p{Ll}/gu, a => ' J' + a[2].toLowerCase() + a[3]);
	};

	return text;
}
function toArab(text) {
	for (const key in arabLetters)
		text = text.replace(arabLetters[key], key);

	return text;
}
function toJ(text, alwaysJ = false) {
	return alwaysJ
		? text.replace(/([аеёіоуыэюя] )і /g, '$1й ')
		: text.replace(/[аеёіоуыэюя] і /g, a => Math.random() >= 0.5 ? a[0] + ' й ' : a);
}