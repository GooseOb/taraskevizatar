const darkTheme = document.getElementById('dark-css');
const themeButtons = document.getElementById('theme').querySelectorAll('.checkbox');
const themeStates = ['not all', '(prefers-color-scheme: dark)', 'all'];

if (localStorage.theme) {
	const {theme} = localStorage;
	darkTheme.media = themeStates[theme];
	switch (+theme) {
		case 0: themeButtons[0].checked = true; break;
		case 2: themeButtons[1].checked = true;
	}
};

const setTheme = themeId => {
	localStorage.theme = themeId;
	darkTheme.media = themeStates[themeId];
};

const DEFAULT_TEXT =
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
12. Гаага, ганак, Эбінггаўз, Вашынгтон, Глазга.`;

INPUT_CARD = 'official';
OUTPUT_CARD = 'classic';

const OUTPUT_PLACEHOLDER = ['Тэкст', 'Tekst', 'طَقْصْطْ'];

const stgs = {
	abc: 0,
	j: 0,
};

if (localStorage.settings) {
	Object.assign(stgs, JSON.parse(localStorage.settings));
} else {
	['abc', 'j'].forEach(item => {
		if (localStorage[item]) {
			stgs[item] = localStorage[item];
			delete localStorage[item];
		};
	});
	localStorage.settings = JSON.stringify(stgs);
};

const settings = new Proxy(stgs, {
	set(target, name, value) {
		target[name] = value;
		localStorage.settings = JSON.stringify(target);
	}
});

const {body} = document;
const input = document.getElementById('input');
const output = document.getElementById('output');
const outputContainer = output.parentElement;
const settingsButton = document.getElementById('settings-btn');
const settingsElement = document.getElementById('settings');
const edit = document.getElementById('edit');
const info = document.getElementById('info');
const copyButtons = document.querySelectorAll('.copy');
const getCounter = id => document.getElementById(id).querySelector('.num-counter');
const counters = {
	input: getCounter(INPUT_CARD),
	output: getCounter(OUTPUT_CARD),
	set(nums) {
		for (const key in nums) {
			this[key].textContent = nums[key];
		};
	}
};

const debounce = (callback, cooldown) => {
	let timeout;
	return e => {
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			callback(e);
		}, cooldown);
	};
};

let changeList = [];

const inputHandler = debounce(({target}) => {
	const text = target.value.trim();
	convert(text);
	localStorage.text = text;
}, 200);

input.fixHeight = function() {
	this.style.height = 0;
	const newHeight = this.scrollHeight + 1;
	this.style.height = newHeight + 'px';
};
Object.assign(input, localStorage.text ? {
	value: localStorage.text
} : {
	value: DEFAULT_TEXT,
	onclick() {
		this.onclick = null;
		this.value = '';
		output.textContent = '';
		this.fixHeight();
		convert('');
	}
});

const fixConvert = () => convert(input.value);

const snackbarTimeouts = {};
const snackbar = (id, msg = null, visiblityTime = 1000) => {
	const el = document.getElementById('sb-' + id);
	if (msg) el.innerHTML = msg;
	el.classList.remove('hidden');
	const timeout = setTimeout(() => {
		el.classList.add('hidden');
	}, visiblityTime);
	const prevTimeout = snackbarTimeouts[id];
	if (prevTimeout) clearTimeout(prevTimeout);
	snackbarTimeouts[id] = timeout;
};

fixConvert();

input.addEventListener('input', inputHandler);

copyButtons.forEach(el => {
	const textfield = document
		.getElementById(el.title)
		.querySelector('.textfield');
	const getText = textfield.tagName === 'TEXTAREA'
		? () => textfield.value
		: () => textfield.innerText;
	el.addEventListener('click', () => {
		navigator.clipboard.writeText(getText());
		snackbar('copy');
	});
});

themeButtons.forEach((el, i) => {
	const themeId = +el.value;
	const oppositeButton = i === 0
		? themeButtons[1]
		: themeButtons[0];
	el.addEventListener('click', () => {
		if (el.checked) {
			oppositeButton.checked = false;
			setTheme(themeId);
		} else {
			setTheme(1);
		};
	});
});

const promptGenerator = (function*() {
	while(true) {
		yield '<tarL class="demo">Гэтыя часьціны</tarL> можна зьмяняць, націскаючы на іх';
		yield 'Літары <tarG class="demo">г/ґ</tarG> таксама можна зьмяняць націскам';
		yield 'Тэкст, які ня трэба канвэртаваць, вылучайце: <span class="demo" style="color:red">&lt! тэкст !></span>';
	};
})();

info.addEventListener('click', () => {
	const prompt = promptGenerator.next().value;
	snackbar('info', prompt, 2500);
});

const EDIT_ENABLE = 'Рэдагаваньне уключана';
const EDIT_DISABLE = 'Рэдагаваньне выключана';
edit.addEventListener('click', () => {
	const isContentEditable = !output.isContentEditable;
	output.contentEditable = isContentEditable;
	snackbar('edit', isContentEditable
		? EDIT_ENABLE
		: EDIT_DISABLE
	);
});

const arabH = 'غ';
const arabG = 'ه';
output.addEventListener('click', ({target: el}) => {
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
			el.textContent = settings.abc === 2
				? el.textContent === arabH ? arabG : arabH
				: gobj[el.textContent]
	};
});

const newSelect = (id, initialOption, callback) => {
	const select = document.getElementById(id);
	const options = select.querySelectorAll('li');
	const activateOption = option => {
		options.forEach(el => {
			el.classList.remove('active');
		});
		option.classList.add('active');
	};
	select.addEventListener('click', ({target}) => {
		activateOption(target);
		callback(target.value);
	});
	activateOption(options[initialOption]);
};

newSelect('abc', settings.abc, value => {
	settings.abc = value;
	fixConvert();
});
newSelect('i-to-j', settings.j, value => {
	settings.j = value;
	fixConvert();
});

settingsButton.addEventListener('click', () => {
	settingsElement.classList.toggle('hidden');
});

function convert(text) {
	if (!text) {
		output.innerHTML = OUTPUT_PLACEHOLDER[settings.abc];
		counters.set({input: 0, output: 0});
		localStorage.text = '';
		return;
	};

	const taraskText = text.toTaraskConvert(true, settings);

	output.innerHTML = taraskText;
	counters.set({
		input: text.length,
		output: output.textContent.length
	});

	const spans = output.querySelectorAll('tarG, tarL');
	while (changeList.length < spans.length) changeList[changeList.length] = false;
	while (changeList.length > spans.length) changeList.pop();
	for (let i = 0; i < changeList.length; i++) {
		if (changeList[i]) spans[i].click();
		spans[i].num = i;
	};
}

input.fixHeight();
input.addEventListener('input', input.fixHeight, false);

let currScroll;
const stopScroll = debounce(() => {
	currScroll = null;
}, 200);

const syncScroll = el => function() {
	currScroll ||= this;
	if (currScroll === this) el.scrollTop = this.scrollTop * (el.scrollHeight / this.scrollHeight);
	stopScroll();
};

input.addEventListener('scroll', syncScroll(outputContainer));
outputContainer.addEventListener('scroll', syncScroll(input));

const upload = document.getElementById('upload');
const download = document.getElementById('download');

const reader = new FileReader();
let fileName;
reader.addEventListener('load', ({target}) => {
	const text = target.result;
	const taraskText = text
		.toTaraskConvert(false, settings)
		.replace(/\s*\n\s*/g, '\n');
	Object.assign(download, {
		href: createTextFile(taraskText),
		download: 'tarask-' + fileName
	});
	download.parentElement.classList.add('active');
	snackbar('file-convert', null, 1500);
});

upload.addEventListener('change', function() {
	const [file] = this.files;
	fileName = file.name;
	reader.readAsText(file);
});

let textFile = null;
function createTextFile(text) {
	const data = new Blob([text], {type: 'text/plain'});
	if (textFile !== null)
		window.URL.revokeObjectURL(textFile);
	return textFile = window.URL.createObjectURL(data);
};