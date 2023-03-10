import {wordlist, softers, arabLetters, latinLetters, latinLettersUpCase} from './srcs'

Object.assign(String.prototype, {
  toTaraskConvert(arg1, arg2) {return toTaraskConvert(this, arg1, arg2)},
  toTarask() {return toTarask(this)},
  toArab() {return toArab(this)},
  toLatin(arg) {return toLatin(this, arg)},
  toJ(arg) {return toJ(this, arg)}
});
Object.assign(Array.prototype, {
  restoreRegister(arg) {return restoreRegister(this, arg)}
});
const isUpCase = str => str === str.toUpperCase();

const NOFIX_CHAR = '\uffff';
const NOFIX_REGEX = new RegExp(NOFIX_CHAR, 'g');

export const toTaraskConvert = (text, abc = 0, j = 0) => {
  const isArab = abc === 2;
  const noFix = [];

  text = ` ${text.trim()}  `
    .replace(/<! ((?:.|\s)*?) !>/g, ($0, $1) => {
      noFix[noFix.length] = $1;
      return NOFIX_CHAR;
    })
    .replace(/г'/g, 'ґ')
    .replace(/(\n|\t)/g, ' $1 ')
    .replace(/ - /g, ' — ')
    .replace(/(\p{P}|\p{S}|\d)/gu, ' $1 ')
    .replace(/ ['`’] (?=\S)/g, '’')
    .replace(/\(/g, '&#40');
  let textSplit;
  switch (abc) {
    case 0: textSplit = text.split(' '); break;
    case 1: textSplit = text.toLatin().split(' '); break;
    default: textSplit = text.toLowerCase().toArab().split(' ');
  };
  text = text
    .toLowerCase()
    .toTarask();
  if (j) text = text.toJ(j === 2);
  switch (abc) {
    case 1: text = text.toLatin(false); break;
    case 2: text = text.toArab();
  };
  text = text.split(' ');
  if (!isArab) text = text.restoreRegister(textSplit);
  text = text
    .join(' ')
    .replace(/&#160;/g, ' ')
    .replace(/ (\p{P}|\p{S}|\d|&#40) /gu, '$1');
  if (noFix.length) text = text.replace(NOFIX_REGEX, () => noFix.shift());
  // const regExp = isArab
  // 	? /(?:\([\p{L}’\- \u0600-\u06FF\u08AF]+\)){2,}/gu
  // 	: /(?:\([\p{L}’\- ]+\)){2,}/gu;
  const regExp = /\(.*?\)/g;
  text = text
      .replace(regExp, $0 => $0.slice(1, -1).split('|')[0])
      .replace(/&#40/g, '(');

  return text.trim();
}

const restoreRegister = (text, orig) => {
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
  };

  return text;
}

const toTarask = (text) => {
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
    .replace(/ сьнід /, ' снід ')
    .replace(/ сьмі /, ' смі ')
    .replace(/ без(ь? \S+)/g, ($0, $1) => $1.match(/[аеёіоуыэюя]/g)?.length === 1 ? ' бяз' + $1 : $0)
    .replace(/ не (\S+)/g, ($0, $1) => $1.match(/[аеёіоуыэюя]/g)?.length === 1 ? ' ня ' + $1 : $0)
    .replace(/( (?:б[ея]|пра|цера)?з) і(\S*)/g, ($0, $1, $2) => /([ая]ў|ну)$/.test($2) ? $1 + 'ь і' + $2 : $0);
}

const toLatin = (text, upCase = true) => {
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

const toArab = (text) => {
  for (const key in arabLetters)
    text = text.replace(arabLetters[key], key);

  return text;
}

const subtoJ = ($1, $2) => $1 + 'й ' + ($2 ? 'у' : '');
const toJ = (text, alwaysJ = false) => {
  return text.replace(/([аеёіоуыэюя] )і (ў?)/g, alwaysJ
    ? ($0, $1, $2) => subtoJ($1, $2)
    : ($0, $1, $2) =>
      Math.random() >= 0.5 ? subtoJ($1, $2) : $0
  );
}