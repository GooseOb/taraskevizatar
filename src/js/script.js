window.addEventListener('load', async () => {
	if (!navigator.serviceWorker) return;
	const REPO_PATH = '/taraskevizatar/';
	try {
		await navigator.serviceWorker.register(REPO_PATH + 'sw.js', {scope: REPO_PATH});
	} catch (e) {
		console.warn('Service worker register fail', e);
	}
});

const $ = id => document.getElementById(id);

const darkTheme = $('dark-css');
const themeButtons = $('theme').querySelectorAll('.checkbox');
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

const INPUT_CARD = 'official';
const OUTPUT_CARD = 'classic';

const EDIT_ENABLE = 'Рэдагаваньне уключана';
const EDIT_DISABLE = 'Рэдагаваньне выключана';

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
			stgs[item] = +localStorage[item];
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

const input = $('input');
const output = $('output');
const outputContainer = output.parentElement;
const getCounter = id => $(id).querySelector('.num-counter');
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
	const el = $('sb-' + id);
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

const promptGenerator = (function*() {
	while(true) {
		yield '<tarL class="demo">Гэтыя часьціны</tarL> можна зьмяняць, націскаючы на іх';
		yield 'Літары <tarH class="demo">г/ґ</tarH> таксама можна зьмяняць націскам';
		yield 'Тэкст, які ня трэба канвэртаваць, вылучайце: <span class="demo" style="color:red">&lt! тэкст !></span>';
		yield 'Апошняе абнаўленьне: GULP_MACROS.CURRENT_TIME`hello guys`';
	};
})();

const settingsElement = $('settings');

const actions = {
	clear() {
		input.value = '';
		input.fixHeight();
		input.focus();
		fixConvert();
	},
	info() {
		const prompt = promptGenerator.next().value;
		snackbar('info', prompt, 2500);
	},
	showSettings() {
		settingsElement.classList.toggle('hidden');
	},
	edit() {
		const isContentEditable = !output.isContentEditable;
		output.contentEditable = isContentEditable;
		snackbar('edit', isContentEditable
			? EDIT_ENABLE
			: EDIT_DISABLE
		);
		if (isContentEditable) output.focus();
	}
};

Array.from(document.getElementsByClassName('icon-btns')).forEach((div, i) => {
	const textfield = $(div.dataset.for);
	const getText = i === 0
		? () => textfield.value
		: () => textfield.innerText;

	div.addEventListener('click', ({target: el}) => {
		if (el === div) return;
		if (el.classList.contains('copy')) {
			navigator.clipboard.writeText(getText());
			snackbar('copy');
			return;
		};
		actions[el.id]();
	});
});

themeButtons.forEach((el, i) => {
	const themeId = +el.value;
	const oppositeButton = themeButtons[+!i];
	el.addEventListener('click', () => {
		if (el.checked) {
			oppositeButton.checked = false;
			setTheme(themeId);
		} else {
			setTheme(1);
		};
	});
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
				data[data.length] = el.innerHTML;
				el.innerHTML = data.shift();
				el.dataset.l = data;
				return;
			};
			el.dataset.l = el.innerHTML;
			el.innerHTML = data;
			return;
		case 'TARH':
			el.textContent = settings.abc === 2
				? el.textContent === arabH ? arabG : arabH
				: gobj[el.textContent]
	};
});

const newSelect = (id, initialOption, callback) => {
	const select = $(id);
	const options = select.querySelectorAll('button');
	const activateOption = option => {
		options.forEach(el => {
			el.classList.remove('active');
		});
		option.classList.add('active');
	};
	select.addEventListener('click', ({target: el}) => {
		activateOption(el);
		callback(+el.value);
	});
	activateOption(options[initialOption]);
};

const settingSelectIds = ['abc', 'j'];
settingSelectIds.forEach(id => {
	newSelect(id, settings[id], value => {
		settings[id] = value;
		fixConvert();
	});
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

	const spans = output.querySelectorAll('tarH, tarL');
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

const upload = $('upload');
const download = $('download');

const reader = new FileReader();
let textFile, fileName;
reader.addEventListener('load', ({target}) => {
	const text = target.result;
	const taraskText = text
		.replace(/\r/g, '')
		.toTaraskConvert(false, settings)
		.replace(/\s(\n|\t)\s/g, '$1');
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
	activateUpload();
	reader.readAsText(file);
	this.value = null;
});

function createTextFile(text) {
	if (textFile) URL.revokeObjectURL(textFile);
	return textFile = URL.createObjectURL(
		new Blob([text], {type: 'text/plain'})
	);
};

function activateUpload() {
	const uploadLabel = $('upload-label');
	uploadLabel.title = uploadLabel.dataset.title;
	activateUpload = null;
}