/*
	Cкрыпт тарашкевізатара

	Аўтар: Гусак Звычайны
	vk: vk.com/gooseob
	tg: t.me/gooseob

*/

String.prototype.toTaraskConvert = function(value1, value2, value3) {return toTaraskConvert(this, value1, value2, value3)};
String.prototype.toBel = function() {return toBel(this)};
String.prototype.toTarask = function() {return toTarask(this)}
String.prototype.toArab = function() {return toArab(this)};
String.prototype.toLatin = function(value) {return toLatin(this, value)};
String.prototype.toJ = function(value) {return toJ(this, value)};
Array.prototype.restoreRegister = function(value1, value2) {return restoreRegister(this, value1, value2)};
Array.prototype.addColor = function(value) {return addColor(this, value)};

for (const key in wordlist) wordlist[key] = RegExp(wordlist[key], 'g');
for (const key in softers) softers[key] = RegExp(softers[key], 'g');
const latinLettersUpCase = {};
for (const key in latinLetters) latinLettersUpCase[key] = RegExp(latinLetters[key].toUpperCase(), 'g');
for (const key in latinLetters) latinLetters[key] = RegExp(latinLetters[key], 'g');
for (const key in arabLetters) arabLetters[key] = RegExp(arabLetters[key], 'g');
for (let i=0; i < shortwords.length; i++) {
	let word = shortwords[i];
	const lLetter = word[word.length-1];
	wordlist[' ' + word.slice(0, -1) + (lLetter==='ў' ? 'ваў ' : /[ьй]/.test(lLetter) ? 'яў ' : lLetter + 'аў ')] =
	RegExp(` ${word} `, 'g');
};
for (let i=0; i < gwords.length; i++) wordlist[gwords[i]] = RegExp(gwords[i].replace(/ґ/g, 'г'), 'g');

els1 = els2 = els3 = iwords = gwords = shortwords = soft = presoft = undefined;

function toTaraskConvert(text, abc = 0, checkJ = 2, cache = false) {
	const noFix = Array(text.match(/ !>/g)?.length || 0);
	while (noFix.length > text.match(/<! /g)) noFix.pop();
	if (noFix.length) {
		text = text.replace(/౦/g, '');
		for (let i = 0; i < noFix.length; i++) {
			text = text.replace(/<! /, '<!' + i).replace(/ !>/, i + '!>');
			noFix[i] = text.match(/<!\d+(.+)\d+!>/)[1];
			text = text.replace(/<!\d+.+\d+!>/, '౦');
		};
	};
	if (cache && cache[1].length > 1000) {
		let [cText, cHtml] = cache;
		cHtml = cHtml.replace(/<tarl /g, '<tarl').split(' ');
		cText = cText.split(' ');
		text = text.split(' ');
		const forlen = Math.min(text.length, cText.length);
		let wordI = forlen;
		for (let i = 0; i < forlen; i++) {
			if (text[i] === cText[i]) continue;
			wordI = i-1;
			if (/б[ея]з|н[ея]|зь$/.test(text[wordI-1])) wordI--;
			break;
		};
		noFix.unshift((cHtml.slice(0, wordI).join(' ')).replace(/<tarld/g, '<tarl d'));
		text = '౦ ' + text.slice(wordI).join(' ');
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
		.toBel()
		.toTarask();
	if (checkJ) text = text.toJ(checkJ === 2);
	switch (abc) {
		case 1: text = text.toLatin(false); break;
		case 2: text = text.toArab();
	};
	text = text.split(' ');
	if (abc !== 2) text = text.restoreRegister(textSplit);
	text = text
		.addColor(textSplit)
		.join(' ')
		.replace(/ (\p{P}|\p{S}|\d|&#6[02];) /gu, '$1');
	switch (abc) {
		case 0:
			text = text
				.replace(/([АЕЁІОУЫЭЮЯ])(?:<tarF>)?Ў(?:<\/tarF>)?/g, '$1У')
				.replace(/ґ/g, `<tarG>г</tarG>`)
				.replace(/Ґ/g, `<tarG>Г</tarG>`);
			break;
		case 1:
			text = text
				.replace(/([AEIOUY])(?:<tarF>)?Ŭ(?:<\/tarF>)?/g, '$1U')
				.replace(/g/g, `<tarG>h</tarG>`)
				.replace(/>G/g, `><tarG>H</tarG>`);
			break;
		default: text = text.replace(/غ/g, `<tarG>ه</tarG>`);
	};
	if (noFix.length) text = text.replace(/౦/g, () => noFix.shift());
	return text
		// .replace(/\((\S+)\)\((\S+)\)\((\S+)\)/g, `<tarL data-l='$2,$3'>$1</tarL>`)
		.replace(/\(([\p{L}’ \u0600-\u06FF\-]+)\)\(([\p{L}’ \u0600-\u06FF\-]+)\)/gu, `<tarL data-l='$2'>$1</tarL>`)
		// .replace(/\((\S+)\)\((\S+)\)/g, `<tarL data-l='$2'>$1</tarL>`)
		.replace(/ \n /g, '<br>')
		.trim();
}
function restoreRegister(text, orig) {
	for (let i = 0; i < text.length; i++) {
		const origWord = orig[i];
		const word = text[i];
		if (word === origWord) continue;
		if (word === origWord.toLowerCase()) {
			text[i] = origWord;
			continue;
		};
		if (
			!origWord[0] ||
			origWord[0] === origWord[0].toLowerCase()
		) continue;
		if (word === 'зь') {
			const nextWord = orig[i + 1];
			text[i] = nextWord[1] === nextWord[1].toUpperCase() ? 'ЗЬ' : 'Зь';
			continue;
		};
		const lastLetter = origWord[origWord.length - 1];
		if (word[0] === '(') {
			if (origWord[0] === origWord[0].toUpperCase()) {
				text[i] = word.replace(/\(./g, a => a.toUpperCase());
				if (lastLetter === lastLetter.toUpperCase()) text[i] = word.toUpperCase();
			};
			continue;
		};
		if (lastLetter === lastLetter.toUpperCase()) text[i] = word.toUpperCase()
		else text[i] = word[0].toUpperCase() + word.slice(1);
	};

	return text;
}
function addColor(text, orig) {
	for (let i = 0; i < text.length; i++) {
		switch (text[i]) {
			case '<': text[i] = '&#60;'; continue;
			case '>': text[i] = '&#62;'; continue;
			case orig[i]: continue;
		};
		if (text[i].length === orig[i].length) {
			const LettersText = text[i].split('');
			const LettersOrig = orig[i].split('');
			for (x = 0; x < LettersText.length; x++) {
				if (LettersText[x] !== LettersOrig[x])
					LettersText[x] = `<tarF>${LettersText[x]}</tarF>`;
			};
			text[i] = LettersText.join('');
			continue;
		};
		switch (orig[i]) {
			case text[i].replace(/ь/g, ''):
				text[i] = text[i].replace(/ь/g, `<tarF>ь</tarF>`);
				continue;
			case text[i].replace(/ь/g, '')+'ь':
				text[i] = text[i].slice(0, -1).replace(/ь/g, `<tarF>ь</tarF>`)+'ь';
				continue;
			case text[i].replace(/(у|ю)/g, 'ір$1'):
				text[i] = text[i].replace(/([уюо])/g, `<tarF>$1</tarF>`);
				continue;
		};
		if (orig[i].length !== text[i].replace(/\((.+)\)\(.+\)/, '$1').length)
			text[i] = `<tarF>${text[i]}</tarF>`;
	};

	return text;
}
function toTarask(text) {
	for (const key in wordlist) text = text.replace(wordlist[key], key);
	while (true) {
		for (const key in softers) {
			text = text.replace(softers[key], key);
		};
		let stop = true;
		for (const key in softers) {
			if (key !== '$1дзьдз$2' && softers[key].test(text)) {
				stop = false;
				break;
			};
		};
		if (stop) break;
	};
	// while (/ае( \S+)ай /g.test(text))
	// 	text = text.replace(/ае( \S+)ай /g, 'ае$1ае ');

	return text
		.replace(/ не (\S+)/g, (a, b) => {
			if (!/[аеёіоуыэюя]/.test(b) ||
				b.length < 2 ||
				/\p{P}|ір[ауо]/u.test(b) ||
				b[0] === 'і' ||
				/^(ві|да|з?бы|маг|мя|налі|раў|ўзя)л[аі]|магу/.test(b))
				return a;
			if (/(вы)?к(ла|і)да\S/.test(b))
				return /мі?$/.test(b) ? ' ня ' + b : a;
			const vowNum = b.match(/[аеёіоуыэюя]/g).length;
			if (vowNum === 1)
				return ' ня ' + b;
			const wordstart = b[0] + b[1] === 'вы';
			const wordend = /(ў|[еуы]|а[мх]|л[аі]|не|дзе|уць)$/.test(b);
			switch (vowNum) {
				case 2:
					if (wordstart || wordend)
						return ' ня ' + b;
					return a;
				case 3:
					if (wordstart && wordend)
						return ' ня ' + b;
					return a;
				case 4:
					const blen = b.length;
					if (wordstart && b[blen - 1] + b[blen - 2] + b[blen - 3] === 'амі')
						return ' ня ' + b;
					return a;
			};
			return a;
		})
		.replace(/ без(ь? )(\S+)/g, (a, b, c) => {
			if (!/[аеёіоуыэюя]/.test(c) ||
				c.length < 2 ||
				c[0] === 'і' ||
				/\p{P}|ір[ауо]/u.test(c))
				return a;
			const vowNum = c.match(/[аеёіоуыэюя]/g).length;
			if (vowNum === 1)
				return ' бяз' + b + c;
			const wordstart = /^вы/.test(c);
			const wordend = /([ая]ў|у)$/.test(c);
			switch (vowNum) {
				case 2:
					if (wordstart || wordend)
						return ' бяз' + b + c;
					return a;
				case 3:
					if (wordstart && wordend)
						return ' бяз' + b + c;
					return a;
			};
			return a;
		})
		.replace(/( (?:б[ея]|пра|цера)?з) і(\S*)/g, (a, b, c) => /([ая]ў|ну)$/.test(c) ? b + 'ь і' + c : a);
}
function toBel(text) {
	return text
		.replace(/[иi]/g, 'і')
		.replace(/([аеёіоуыэюя] ?)у/g, '$1ў')
		.replace(/ўм /g, 'ум ')
		.replace(/ іўд(ай?|ав[аы]|у|зе) /g, ' іуд$1 ')
		.replace(/ ілеўс/g, ' ілеус')
		.replace(/щ/g, 'ў')
		.replace(/ъ/g, '’');
}
function toLatin(text, upCase = true) {
	for (const key in latinLetters)
		text = text.replace(latinLetters[key], key);
	if (upCase)
		for (const key in latinLettersUpCase)
			text = text.replace(latinLettersUpCase[key], key.toUpperCase());

	return text;
}
function toArab(text) {
	for (const key in arabLetters)
		text = text.replace(arabLetters[key], key);

	return text;
}
function toJ(text, alwaysJ = false) {
	if (alwaysJ)
		return text.replace(/([аеёіоуыюя] )і /g, '$1й ');

	return text.replace(/[аеёіоуыюя] і /g, a => Math.random() >= 0.5 ? a[0] + ' й ' : a);
}