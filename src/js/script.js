const darkTheme = document.getElementById('dark-css');
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

let changeList = [], currAbc = 0, currFontSize = 1.25;
const textInput = document.getElementById('input');
const textOutput = document.getElementById('output');
const body = document.body;
const html = document.querySelector('html');
const selectJ = body.querySelectorAll('#itoj input');

const FONT_UNIT = 0.0625;
const TYPING_TIME = 200;
const TEXT_PART_LENGTH = 99;

body.querySelectorAll('.copy').forEach((el, i) => {
	const getText = i === 0
		? () => textInput.value
		: () => textOutput.innerText;
	el.addEventListener('click', () => {
		navigator.clipboard.writeText(getText());
		el.style.setProperty('--opacity', '1');
		el.innerText = 'Скапіявана';
		setTimeout(() => {
			el.style.setProperty('--opacity', '.8');
			el.innerText = 'Капіяваць';
		}, 500);
	});
});

document.getElementById('clean').addEventListener('click', () => {
	convert(textInput.value = '')
});

const counts = new Proxy(
	{
		S0: body.querySelectorAll('.symbol-count')[0],
		S1: body.querySelectorAll('.symbol-count')[1],
		W: body.querySelector('.word-count'),
		F: body.querySelector('.fix-count'),
		P: body.querySelector('.punct-count')
	}, {
		get: (target, name) => target[name].textContent,
		set: (target, name, num) => (target[name].textContent = num) || true
	}
);

const lsText = (text = false) => text
	? localStorage.text = JSON.stringify(text)
	: JSON.parse(localStorage.text);
const fixFont = () => textOutput.className = 'textfield' + (currAbc===2 ? ' arab' : '');
const fixFontSize = num => body.style.setProperty('--fontSize', (currFontSize += num) + 'rem');

let lastTimeout;
textInput.addEventListener('input', () => {
	const text = textInput.value.trim();
	if (text === sessionStorage.inputText) return;
	if (text.length > 60000) {
		const currTimeout = lastTimeout = setTimeout(() => {
			if (currTimeout === lastTimeout) convert(text);
		}, TYPING_TIME);
	} else convert(text);
});

body.querySelector('#convert').addEventListener('click', () => convert());
for (let i = 0; i < selectJ.length; i++) selectJ[i].addEventListener('click', () => {
	if (localStorage.j == i) return;
	localStorage.j = i;
	if (!/ [іи] /.test(textInput.value)) return;
	lsText([]);
	convert();
});

body.querySelectorAll('#font-size > b').forEach((el, i) => {
	const listener = i === 0
		? () => currFontSize > FONT_UNIT && fixFontSize(-FONT_UNIT)
		: () => fixFontSize(FONT_UNIT);
	el.addEventListener('click', listener);
});

body.querySelector('#edit').addEventListener('click', function() {
	textOutput.contentEditable = !this.classList.toggle('disable')
});

const modals = body.querySelectorAll('.modal');
const closeModal = i => modals[i].className = 'modal hidden';
const openModal = i => modals[i].className = 'modal';
body.querySelector('#info').addEventListener('click', () => openModal(0));
body.querySelector('#select-abc').addEventListener('click', () => openModal(1));
for (let i = 0; i < modals.length; i++)
	modals[i].addEventListener('click', ({target: {classList}}) => {
		if (classList.contains('modal') || classList.contains('close')) closeModal(i);
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
	if ('num' in el) changeList[el.num] = !changeList[el.num];
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

const setStandardText = () => {
	textInput.value =
	`1. Без волі, без цукру, не буду, не прыйдзеш.
	2. Абедзве, свята, праз лес.
	З. Цераз ямы, з'ява, з іншымі.
	4. Калоссе, насенне.
	5. Тэатр, метр, кадр.
	6. у акне, у адзін вагон, у аранжавым святле.
	7. Ва Уроцлаў, да Уладзі
	8. Белавежскі, казахскі, узбекскі, пясчаны, езджу, смяешся.
	9. План, калона, філасофія,
	10. Перыяд, праспект, сінонім, Бразілія.
	11. Базіраваць, кадзіраваць, індуцыраваць, каменціраваць.
	12. Гаага, ганак, Эбінггаўз, Вашынгтон, Глазга.`
	.replace(/\u0009/g, '');
	const listener = () => {
		textInput.removeEventListener('click', listener);
		textInput.value = '';
		convert();
	};
	textInput.addEventListener('click', listener);
	convert();
	lsText([]);
};
if (localStorage.length > 3) {
	const textFromLS = localStorage.text;
	if (textFromLS[0] !== '[')
		lsText(
			textFromLS
			? /<!<sep>!>/.test(textFromLS)
				? textFromLS.split('<!<sep>!>') : [textFromLS]
			: []
		);
	currAbc = +localStorage.abc;
	currentAbc.textContent = abcBtns[currAbc].innerHTML;
	fixFont();
	abcBtns[currAbc].className = 'active';
	selectJ[localStorage.j].checked = true;
	const textLS = lsText();
	if (!textLS.length) setStandardText()
	else convert(
		textInput.value = textLS.join(' ').replace(/<br>/g, '\n')
	);
} else {
	Object.assign(localStorage, {
		j: 1,
		abc: 0,
		theme: 1
	});
	setStandardText();
};

for (let i = 0; i < abcBtns.length; i++) {
	const outputDefault = '<span>' + ['Тэкст', 'Tekst', 'طَقْصْطْ'][i] + '</span>';
	const textOutputSetDefault = function() {
		this.innerHTML = outputDefault;
	};
	if (i === currAbc) textOutput.setDefault = textOutputSetDefault;
	abcBtnName = abcBtns[i].textContent;
	abcBtns[i].addEventListener('click', () => {
		if (currAbc === i) return;
		abcBtns[currAbc].className = '';
		currentAbc.textContent = abcBtnName;
		localStorage.abc = currAbc = i;
		textOutput.setDefault = textOutputSetDefault;
		lsText([]);
		closeModal(1);
		fixFont();
		convert();
		abcBtns[i].className = 'active';
	});
};

function convert(text = textInput.value.trim()) {
	sessionStorage.inputText = text;
	if (!text) {
		textOutput.setDefault();
		Object.assign(counts, {S0: 0, W: 0, P: 0, S1: 0, F: 0});
		lsText([]);
		return;
	};
	text = text.replace(/\n/g, '<br>').match(/[^\s]+/g);
	const result = [];
	while (text.length) {
		let wordI = text.length < TEXT_PART_LENGTH ? text.length-1 : TEXT_PART_LENGTH-1;
		let word = text[wordI].toLowerCase();
		if (wordI > TEXT_PART_LENGTH && wordI !== text.length-1)
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
		let spans = textOutput.querySelectorAll('span');
		if (spans.length !== resultlen) {
			if (spans.length < resultlen) {
				textOutput.innerHTML += '<span></span>'.repeat(resultlen - spans.length);
			} else {
				spans = Array.from(spans);
				while (spans.length > resultlen) spans.pop().remove();
			};
			spans = textOutput.querySelectorAll('span');
		};
		const storageText = lsText();
		for (let i = 0; i < resultlen; i++) {
			if (result[i] === storageText[i]) continue;
			const j = +localStorage.j;
			while (i < resultlen)
				spans[i].innerHTML = result[i++].toTaraskConvert(currAbc, j) + ' ';
			break;
		}
	};
	lsText(result);
	const inputText = textInput.value;
	Object.assign(counts, {
		S0: inputText.length,
		W: inputText.match(/[^\s]+/g).length,
		P: inputText.match(/\p{P}/gu)?.length ||0,
		S1: textOutput.textContent.trim().length,
		F: textOutput.querySelectorAll('tarF').length
	})
	const spans = textOutput.querySelectorAll('tarG, tarL');
	while (changeList.length < spans.length) changeList[changeList.length] = false;
	while (changeList.length > spans.length) changeList.pop();
	for (let i = 0; i < changeList.length; i++) {
		if (changeList[i]) spans[i].click();
		spans[i].num = i;
	};
}

const resizer = {
	scope: {
		set: ({targetEl, startY}) =>
			Object.assign(resizer.scope, {
				targetEl, startY,
				height: targetEl.offsetHeight,
			}),
		clean: () => {
			const {set, clean} = resizer.scope;
			resizer.scope = {set, clean};
		}
	},
	fixHeight: ({currY}) => {
		const {height, startY, targetEl} = resizer.scope;
		targetEl.style.height = (height + currY - startY) + 'px'
	}
};
const isMobile = /Android|Mobile|Phone|webOS|iP[ao]d|BlackBerry|BB|PlayBook|Kindle|Silk|Opera Mini/i
	.test(navigator.userAgent);
if (isMobile) {
	const listeners = [
		['touchmove', e => {
			e.preventDefault();
			resizer.fixHeight({
				currY: e.targetTouches[0].screenY
			});
		}, {passive: false}],
		['touchend', () => {
			resizer.scope.clean();
			listeners.forEach(item => body.removeEventListener(...item));
		}]
	];

	resizer.connect = (btn, targetEl) => {
		btn.addEventListener('touchstart', e => {
			resizer.scope.set({
				targetEl,
				startY: e.targetTouches[0].screenY
			});

			listeners.forEach(item => body.addEventListener(...item));
		});
	};
} else {
	const mousemove = ['mousemove', e => {
		if (e.which === 0) {
			resizer.scope.clean();
			body.removeEventListener(...mousemove);
		} else resizer.fixHeight({
			currY: e.pageY
		});
	}];

	resizer.connect = (btn, targetEl) => {
		btn.addEventListener('mousedown', e => {
			resizer.scope.set({
				targetEl,
				startY: e.pageY
			});

			body.addEventListener(...mousemove);
		});
	};
};

resizer.btns = document.querySelectorAll('button.resize');

resizer.connect(resizer.btns[0], textInput);
resizer.connect(resizer.btns[1], textOutput);