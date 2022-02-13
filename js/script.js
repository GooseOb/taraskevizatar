const darkTheme = document.querySelector('link[href=\'dark.css\']');
const checkTheme = document.querySelectorAll('#theme input');
switch (+localStorage.theme) {
	case 1:
		darkTheme.media = 'not all';
		checkTheme[0].checked = true;
		break;
	case 2: 
		darkTheme.media = 'all';
		checkTheme[2].checked = true;
		break;
};

function changeTheme(media, value) {
	darkTheme.media = media;
	localStorage.theme = value;
}

checkTheme[0].addEventListener('click', () => changeTheme('not all', 1));
checkTheme[1].addEventListener('click', () => changeTheme('(prefers-color-scheme: dark)', 0));
checkTheme[2].addEventListener('click', () => changeTheme('all', 2));

let changeList = [], currAbc = 0, fontSize = 1.25;
const textInput = document.getElementById('input');
const textOutput = document.getElementById('output');
const selectJ = document.querySelectorAll('#itoj input');
const copy = document.querySelectorAll('.copy');
const body = document.body;
const fontSizes = document.querySelectorAll('#font-size > b');
copy[0].addEventListener('click', copyText);
copy[1].addEventListener('click', copyText);
function copyText() {
	navigator.clipboard.writeText(this === copy[0] ? textInput.value : textOutput.innerText);
	this.style.setProperty('--opacity', '1');
	this.innerText = 'Скапіявана';
	setTimeout(() => {
		this.style.setProperty('--opacity', '.8');
		this.innerText = 'Капіяваць';
	}, 500);
}
const count = {
	S: document.querySelectorAll('.symbol-count'),
	W: document.querySelector('.word-count'),
	F: document.querySelector('.fix-count'),
	P: document.querySelector('.punct-count')
};

if (!/Android|Mobile|Phone|webOS|iP[ao]d|BlackBerry|BB|PlayBook|Kindle|Silk|Opera Mini/i.test(navigator.userAgent))
document.querySelector('footer').innerHTML += `<br>
<p>
	<a href="https://github.com/GooseOb/taraskevizatar/archive/refs/heads/main.zip">
		Спампаваць ${location.host ? '' : 'актуальную'} афлайн вэрсію
	</a>
</p>`;

const fixFont = () => textOutput.className = 'textfield' + (currAbc===2 ? ' arab' : '');

textInput.addEventListener('input', convert);
document.querySelector('#convert').addEventListener('click', convert);
for (let i=0; i < selectJ.length; i++) selectJ[i].addEventListener('click', () => {
	if (localStorage.j == i) return;
	localStorage.j = i;
	localStorage.text = '[]';
	if (/ [іи] /.test(textInput.value)) convert();
});
fontSizes[0].addEventListener('click', () => {
	if (fontSize!==0.0625) body.style.setProperty('--fontSize', (fontSize -= 0.0625)+'rem')
});
fontSizes[1].addEventListener('click', () => body.style.setProperty('--fontSize', (fontSize += 0.0625)+'rem'));
const edit = document.querySelector('#edit');
edit.addEventListener('click', () => textOutput.contentEditable = !edit.classList.toggle('disable'));

const modals = document.querySelectorAll('.modal');
const closeModal = i => modals[i].className = 'modal hidden';
document.querySelector('#info').addEventListener('click', () => modals[0].className = 'modal');
document.querySelector('#select-abc').addEventListener('click', () => modals[1].className = 'modal');
const exit = document.querySelectorAll('.close');
for (let i=0; i < modals.length; i++) {
	exit[i].addEventListener('click', () => closeModal(i));
	modals[i].addEventListener('click', e => {if (e.target === modals[i]) closeModal(i)});
};
textOutput.addEventListener('click', e => {
	const item = e.target;
	switch(item.tagName) {
		case 'TARL':
			let data = item.dataset.l;
			if (data.indexOf(',') !== -1) {
				data = data.split(',');
				data[data.length] = item.textContent;
				item.textContent = data.shift();
				item.dataset.l = data;
				return;
			};
			item.dataset.l = item.textContent;
			item.textContent = data;
			return;
		case 'TARG':
			switch (currAbc) {
				case 0:
						switch (item.textContent) {
							case 'г': item.textContent = 'ґ'; break;
							case 'ґ': item.textContent = 'г'; break;
							case 'Г': item.textContent = 'Ґ'; break;
							default: item.textContent = 'Г';
					}; return;
				case 1:
						switch (item.textContent) {
							case 'h': item.textContent = 'g'; break;
							case 'g': item.textContent = 'h'; break;
							case 'H': item.textContent = 'G'; break;
							default: item.textContent = 'H';
					}; return;
				case 2:
					item.textContent = item.textContent === 'غ' ? 'ه' : 'غ';
					return;
			};
	};
});

const LSText = {
	get: () => localStorage.text ? JSON.parse(localStorage.text) : [],
	set: text => localStorage.text = JSON.stringify(text)
};

const abcBtns = modals[1].querySelectorAll('button');
const currentAbc = document.querySelector('#current-abc');
if (localStorage.j) {
	if (localStorage.text[0] !== '[')
		LSText.set(
			/<!<sep>!>/.test(localStorage.text)
			? localStorage.text.split('<!<sep>!>')
			: [localStorage.text]
		);
	textInput.value = LSText.get()?.join(' ').replace(/<br>/g, '\n');
	currAbc = +localStorage.abc;
	currentAbc.textContent = abcBtns[currAbc].innerHTML;
	fixFont();
	abcBtns[currAbc].className = 'active';
	selectJ[localStorage.j].checked = true;
	convert();
};

for (let i = 0; i < abcBtns.length; i++) abcBtns[i].addEventListener('click', () => {
	if (currAbc === i) return;
	abcBtns[currAbc].className = '';
	currentAbc.textContent = abcBtns[i].textContent;
	localStorage.abc = currAbc = i;
	localStorage.text = '[]';
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
		localStorage.text = '[]';
		return;
	};
	text = text.replace(/\n/g, '<br>').match(/[^\s]+/g);
	const result = [];
	while (text.length) {
		let wordI = text.length < 99 ? text.length-1 : 99;
		let word = text[wordI].toLowerCase();
		if (wordI !== text.length)
			while ((word === 'не' || word[word.length] === 'з') && wordI > 0)
				word = text[wordI--].toLowerCase();
		result[result.length] = text.splice(0, wordI+1).join(' ');
	};
	const textOutputEmpty = textOutput.textContent.length < 10;
	let outps = textOutput.querySelectorAll('span');
	while (outps.length !== result.length) {
		if (outps.length < result.length) textOutput.append(document.createElement('span'))
		else outps[outps.length-1].remove();
		outps = textOutput.querySelectorAll('span');
	};
	const storageText = LSText.get();
	for (let i=0; i < result.length; i++)
		if (result[i] !== storageText[i] || textOutputEmpty)
			outps[i].innerHTML = result[i].toTaraskConvert(currAbc, +localStorage.j) + ' ';
	LSText.set(result);
	const inputText = textInput.value;
	count.S[0].textContent = inputText.length;
	count.W.textContent = inputText.match(/[^\s]+/g).length;
	count.P.textContent = inputText.match(/\p{P}/gu)?.length ||0;
	count.S[1].textContent = textOutput.textContent.trim().length;
	count.F.textContent = textOutput.querySelectorAll('tarF').length;
	const spans = textOutput.querySelectorAll('tarG, tarL');
	for (let i=0; i < changeList.length; i++) {
		if (changeList[i]) spans[i].click();
	};
	while (changeList.length < spans.length) changeList[changeList.length] = 0;
	while (changeList.length > spans.length) changeList.pop();
	for (let i=0; i < changeList.length; i++) {
		spans[i].addEventListener('click', () => changeList[i] = !changeList[i]);
	};
}

// let resize = false
// let height = textOutput.offsetHeight;
// textOutput.onmousedown = function(e) {
// 	resize = true;
// 	pos = e.pageY;
// 	document.onmouseup = () => {
// 		resize = false;
// 		height = +this.style.height.slice(0, -2);
// 	};
// 	document.onmousemove = e => {
// 		if (!resize) return;
// 		let res = height + e.pageY-pos;
// 		this.style.height = res+"px";
// 	};
// }