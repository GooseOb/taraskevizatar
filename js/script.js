const darkTheme = document.querySelector('link[href="./styles/dark.css"]');
const checkTheme = document.querySelectorAll('#theme input');
const themeStates = ['not all', '(prefers-color-scheme: dark)', 'all'];
if (localStorage.theme) {
	const {theme} = localStorage;
	darkTheme.media = themeStates[theme];
	checkTheme[theme].checked = true;
};

document.querySelector('#theme > fieldset').addEventListener('click', ({target: el}) => {
	if (el.tagName === 'INPUT')
		darkTheme.media = themeStates[localStorage.theme = el.className.at(-1)-1];
});

let changeList = [], currAbc = 0, fontSize = 1.25;
const textInput = document.getElementById('input');
const textOutput = document.getElementById('output');
const body = document.body;
const selectJ = body.querySelectorAll('#itoj input');
const copy = body.querySelectorAll('.copy');
const fontSizes = body.querySelectorAll('#font-size > b');
const copyText = ({target: el}) => {
	navigator.clipboard.writeText(el === copy[0] ? textInput.value : textOutput.innerText);
	el.style.setProperty('--opacity', '1');
	el.innerText = 'Скапіявана';
	setTimeout(() => {
		el.style.setProperty('--opacity', '.8');
		el.innerText = 'Капіяваць';
	}, 500);
}
copy[0].addEventListener('click', copyText);
copy[1].addEventListener('click', copyText);
const count = {
	S: body.querySelectorAll('.symbol-count'),
	W: body.querySelector('.word-count'),
	F: body.querySelector('.fix-count'),
	P: body.querySelector('.punct-count')
};

if (!/Android|Mobile|Phone|webOS|iP[ao]d|BlackBerry|BB|PlayBook|Kindle|Silk|Opera Mini/i.test(navigator.userAgent))
body.querySelector('footer').innerHTML += `<br>
<p>
	<a href="https://github.com/GooseOb/taraskevizatar/archive/refs/heads/main.zip">
		Спампаваць ${location.host ? '' : 'актуальную'} афлайн вэрсію
	</a>
</p>`;

const lsText = (text = false) => text
	? localStorage.text = JSON.stringify(text)
	: JSON.parse(localStorage.text);
const lsTextStr = () => JSON.parse(localStorage.text)?.join(' ').replace(/<br>/g, '\n');
const fixFont = () => textOutput.className = 'textfield' + (currAbc===2 ? ' arab' : '');
const fixFontSize = num => body.style.setProperty('--fontSize', (fontSize += num) + 'rem');

textInput.addEventListener('input', function() {
	if (this.value.trim() !== lsTextStr())
		convert();
});
body.querySelector('#convert').addEventListener('click', convert);
for (let i = 0; i < selectJ.length; i++) selectJ[i].addEventListener('click', () => {
	if (localStorage.j == i) return;
	localStorage.j = i;
	if (!/ [іи] /.test(textInput.value)) return;
	lsText([]);
	convert();
});

fontSizes[0].addEventListener('click', () => fontSize !== 0.0625 && fixFontSize(-0.0625));
fontSizes[1].addEventListener('click', () => fixFontSize(0.0625));

body.querySelector('#edit').addEventListener('click', function() {
	textOutput.contentEditable = !this.classList.toggle('disable')
});

const modals = body.querySelectorAll('.modal');
const closeModal = i => modals[i].className = 'modal hidden';
body.querySelector('#info').addEventListener('click', () => modals[0].className = 'modal');
body.querySelector('#select-abc').addEventListener('click', () => modals[1].className = 'modal');
for (let i = 0; i < modals.length; i++)
	modals[i].addEventListener('click', function() {
		if (this.className === 'modal' || this.className === 'close') closeModal(i);
	});
const gobj = {
'г':'ґ',
'ґ':'г',
'Г':'Ґ',
'Ґ':'Г',
'h':'g',
'g':'h',
'H':'G',
'G':'H',
};
textOutput.addEventListener('click', ({target: el}) => {
	switch(el.tagName) {
		case 'TARL':
			let data = el.dataset.l;
			if (data.indexOf(',') !== -1) {
				data = data.split(',');
				data[data.length] = el.textContent;
				el.textContent = data.shift();
				el.dataset.l = data;
				return;
			};
			el.dataset.l = el.textContent;
			el.textContent = data;
			return;
		case 'TARG':
			el.textContent = currAbc === 2
				? el.textContent === 'غ' ? 'ه' : 'غ'
				: gobj[el.textContent]
	};
});

const abcBtns = modals[1].querySelectorAll('button');
const currentAbc = body.querySelector('#current-abc');
if (localStorage.length > 3) {
	if (localStorage.text[0] !== '[')
		lsText(
			/<!<sep>!>/.test(localStorage.text)
			? localStorage.text.split('<!<sep>!>')
			: localStorage.text ? [localStorage.text] : []
		);
	textInput.value = lsTextStr();
	currAbc = +localStorage.abc;
	currentAbc.textContent = abcBtns[currAbc].innerHTML;
	fixFont();
	abcBtns[currAbc].className = 'active';
	selectJ[localStorage.j].checked = true;
	convert();
} else {
	lsText([]);
	localStorage.j = 1;
	localStorage.abc = 0;
	localStorage.theme = 0;
};

for (let i = 0; i < abcBtns.length; i++) abcBtns[i].addEventListener('click', () => {
	if (currAbc === i) return;
	abcBtns[currAbc].className = '';
	currentAbc.textContent = abcBtns[i].textContent;
	localStorage.abc = currAbc = i;
	lsText([]);
	closeModal(1);
	fixFont();
	convert();
	abcBtns[i].className = 'active';
});

function convert() {
	let text = textInput.value.trim();
	if (!text) {
		textOutput.innerHTML = '<span>' + ['Тэкст', 'Tekst', 'طَقْصْطْ'][currAbc] + '</span>';
		count.S[0].textContent =
		count.W.textContent =
		count.P.textContent =
		count.S[1].textContent =
		count.F.textContent = 0;
		lsText([]);
		return;
	};
	text = text.replace(/\n/g, '<br>').match(/[^\s]+/g);
	const result = [];
	while (text.length) {
		let wordI = text.length < 99 ? text.length-1 : 98;
		let word = text[wordI].toLowerCase();
		if (wordI > 99 && wordI !== text.length-1)
			while ((word === 'не' || word === 'са' || word[word.length-1] === 'з') && wordI > 0)
				word = text[wordI--].toLowerCase();
		result[result.length] = text.splice(0, wordI+1).join(' ');
	};
	const resultlen = result.length;
	if (textOutput.textContent.length < 10) {
		let str = '';
		for (let i = 0; i < resultlen; i++)
			str += '<span>' + result[i].toTaraskConvert(currAbc, +localStorage.j) + ' </span>';
		textOutput.innerHTML = str;
	} else {
		let outps = textOutput.querySelectorAll('span');
		if (outps.length !== resultlen) {
			if (outps.length < resultlen) {
				textOutput.innerHTML += '<span></span>'.repeat(resultlen - outps.length);
			} else {
				outps = Array.from(outps);
				while (outps.length > resultlen) outps.pop().remove();
			};
			outps = textOutput.querySelectorAll('span');
		};
		const storageText = lsText();
		for (let i = 0; i < resultlen; i++)
			if (result[i] !== storageText[i]) {
				const j = +localStorage.j;
				while (i < resultlen)
					outps[i].innerHTML = result[i++].toTaraskConvert(currAbc, j) + ' ';
				break;
			};
	};
	lsText(result);
	const inputText = textInput.value;
	count.S[0].textContent = inputText.length;
	count.W.textContent = inputText.match(/[^\s]+/g).length;
	count.P.textContent = inputText.match(/\p{P}/gu)?.length ||0;
	count.S[1].textContent = textOutput.textContent.trim().length;
	count.F.textContent = textOutput.querySelectorAll('tarF').length;
	const spans = textOutput.querySelectorAll('tarG, tarL');
	while (changeList.length < spans.length) changeList[changeList.length] = false;
	while (changeList.length > spans.length) changeList.pop();
	for (let i = 0; i < changeList.length; i++) {
		if (changeList[i]) spans[i].click();
		spans[i].addEventListener('click', () => changeList[i] = !changeList[i]);
	};
}

// let resize = false
// let height = textOutput.offsetHeight;
// textOutput.onmousedown = function(e) {
// 	resize = true;
// 	pos = e.pageY;
// 	body.onmouseup = () => {
// 		resize = false;
// 		height = +this.style.height.slice(0, -2);
// 	};
// 	body.onmousemove = function(e) {
// 		if (!resize) return;
// 		let res = height + e.pageY-pos;
// 		this.style.height = res+"px";
// 	};
// }