import {tarask, gobj, Options} from '@scripts';
declare const __BUILD_DATE__: string;
type ChangeableElement = HTMLSpanElement & {seqNum: number};

window.addEventListener('load', async () => {
	if (!navigator.serviceWorker) return;
	const REPO_PATH = '/taraskevizatar/';
	try {
		await navigator.serviceWorker.register(REPO_PATH + 'sw.js', {scope: REPO_PATH});
	} catch (err) {
		console.warn('Service worker register fail', err);
	}
});

const $ = (id: string): HTMLElement => document.getElementById(id);

const enum Theme {light, auto, dark}
const darkTheme = $('dark-css') as HTMLLinkElement;
const themeButtons = $('theme').querySelectorAll('.checkbox') as NodeListOf<HTMLInputElement>;
const darkThemeStates = ['not all', '(prefers-color-scheme: dark)', 'all'];

const themeByIdButtons: {[key in Theme]?: HTMLInputElement} = {
	[Theme.light]: themeButtons[0],
	[Theme.dark]: themeButtons[1]
}

if (localStorage.theme) {
	const themeId = localStorage.theme;
	darkTheme.media = darkThemeStates[themeId];
	themeByIdButtons[themeId].checked = true;
}

const setTheme = (themeId: Theme) => {
	localStorage.theme = themeId;
	darkTheme.media = darkThemeStates[themeId];
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
12. Гаага, ганак, Эбінггаўз, Вашынгтон, Глазга.

Спецыяльныя канструкцыі:
<Планета>   <.Планета>   <,Планета>`;

const enum CARD {
	INPUT = 'official',
	OUTPUT = 'classic'
}
const enum EDIT {
	ENABLE = 'Рэдагаваньне уключана',
	DISABLE = 'Рэдагаваньне выключана'
}

const OUTPUT_PLACEHOLDER = ['Тэкст', 'Tekst', 'طَقْصْطْ'];

const stgs: Options = {abc: 0, j: 0};
const settingIds = ['abc', 'j'];

if (localStorage.settings) {
	Object.assign(stgs, JSON.parse(localStorage.settings));
} else {
	for (const id of settingIds)
		if (localStorage[id]) {
			stgs[id] = +localStorage[id];
			delete localStorage[id];
		}
	localStorage.settings = JSON.stringify(stgs);
}

const settings = new Proxy(stgs, {
	set(target, name, value: string) {
		target[name] = value;
		localStorage.settings = JSON.stringify(target);
		return true;
	}
});

const input = $('input') as HTMLTextAreaElement & {fixHeight: () => void};
const output = $('output') as HTMLDivElement;
const outputContainer = output.parentElement as HTMLDivElement;
const getCounter = (id: string): HTMLDivElement =>
	$(id).querySelector('.num-counter');
interface counterValues {
	input: number | string
	output: number | string
}
const counters = {
	input: getCounter(CARD.INPUT),
	output: getCounter(CARD.OUTPUT),
	set(nums: counterValues) {
		for (const key in nums)
			this[key].textContent = nums[key];
	}
};

const debounce = (callback: Function, cooldown: number) => {
	let timeout: number;
	return (e?) => {
		clearTimeout(timeout);
		timeout = window.setTimeout(() => {
			callback(e);
		}, cooldown);
	};
};

let changeList: boolean[] = [];

const inputHandler = debounce(({target}) => {
	const text = target.value.trim();
	convert(text);
	localStorage.text = text;
}, 200);

Object.assign(input, {
	fixHeight() {
		this.style.height = 0;
		const newHeight = this.scrollHeight + 1;
		this.style.height = newHeight + 'px';
	}
},localStorage.text ? {
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

const snackbar = Object.assign($('snackbar') as HTMLDivElement, {
	_lastTimeout: 0,
	show(msg: string, visibilityTime = 1000) {
		this.innerHTML = msg;
		this.classList.remove('hidden');
		clearTimeout(this._lastTimeout);
		this._lastTimeout = setTimeout(() => {
			this.classList.add('hidden');
		}, visibilityTime);
	}
});

fixConvert();

input.addEventListener('input', inputHandler);
window.addEventListener('keyup', e => {
	if (e.ctrlKey && e.code === 'KeyA') input.select();
});

const promptGenerator = (function*() {
	while(true) {
		yield '<tarL class="demo">Гэтыя часьціны</tarL> можна зьмяняць, націскаючы на іх';
		yield 'Літары <tarH class="demo">г/ґ</tarH> таксама можна зьмяняць націскам';
		yield 'Апошняе абнаўленьне: ' + __BUILD_DATE__;
	}
})();

const settingsElement = $('settings') as HTMLDivElement;

const actions = {
	clear() {
		input.value = '';
		input.fixHeight();
		input.focus();
		fixConvert();
	},
	info() {
		const prompt = promptGenerator.next().value;
		snackbar.show(prompt, 2500);
	},
	showSettings() {
		settingsElement.classList.toggle('hidden');
	},
	edit() {
		const isContentEditable = !output.isContentEditable;
		output.contentEditable = isContentEditable.toString();
		snackbar.show(isContentEditable
			? EDIT.ENABLE
			: EDIT.DISABLE
		);
		if (isContentEditable) output.focus();
	}
};

Array.from(document.getElementsByClassName('icon-btns')).forEach((div: HTMLDivElement, i) => {
	const textfield = $(div.dataset.for) as HTMLTextAreaElement | HTMLDivElement;
	const getText = i === 0
		? () => (textfield as HTMLTextAreaElement).value
		: () => (textfield as HTMLDivElement).innerText;

	div.addEventListener('click', e => {
		const el = e.target as HTMLElement;
		if (el === div) return;
		if (el.classList.contains('copy')) {
			navigator.clipboard.writeText(getText());
			snackbar.show('Скапіявана');
			return;
		}
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
			setTheme(Theme.auto);
		}
	});
});

const isChangeableElement = (el: HTMLElement): el is ChangeableElement => 'seqNum' in el;

output.addEventListener('click', e => {
	const el = e.target as HTMLElement;
	if (isChangeableElement(el)) changeList[el.seqNum] = !changeList[el.seqNum];
	switch(el.tagName) {
		case 'TARL':
			let data = el.dataset.l;
			if (/,/.test(data)) {
				const [first, ...dataArr] = data.split(',');
				dataArr[dataArr.length] = el.innerHTML;
				el.innerHTML = first;
				el.dataset.l = dataArr.toString();
				return;
			}
			el.dataset.l = el.innerHTML;
			el.innerHTML = data;
			return;
		case 'TARH':
			el.textContent = gobj[el.textContent];
	}
});

const newSelect = (id, initialOption, callback) => {
	const select = $(id);
	const options = select.querySelectorAll('button');
	const activateOption = option => {
		for (const el of options)
			el.classList.remove('active');
		option.classList.add('active');
	};
	select.addEventListener('click', e => {
		const el = e.target as HTMLSelectElement;
		activateOption(el);
		callback(+el.value);
	});
	activateOption(options[initialOption]);
};

for (const id of settingIds)
	newSelect(id, settings[id], value => {
		settings[id] = value;
		fixConvert();
	});

async function convert(text) {
	if (!text) {
		output.innerHTML = OUTPUT_PLACEHOLDER[settings.abc];
		counters.set({input: 0, output: 0});
		localStorage.text = '';
		return;
	}

	let result: string;
	try {
		result = await tarask(text, true, settings);
	} catch (e) {
		result = e;
	}

	output.innerHTML = result;
	counters.set({
		input: text.length,
		output: output.textContent.length
	});

	const spans = output.querySelectorAll('tarH, tarL') as NodeListOf<ChangeableElement>;
	while (changeList.length < spans.length) changeList[changeList.length] = false;
	while (changeList.length > spans.length) changeList.pop();
	for (let i = 0; i < changeList.length; i++) {
		if (changeList[i]) spans[i].click();
		spans[i].seqNum = i;
	}
}

input.fixHeight();
input.addEventListener('input', input.fixHeight, false);

let currScroll: null | typeof input | typeof outputContainer;
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

const upload = $('upload') as HTMLInputElement;
const download = $('download') as HTMLAnchorElement;

const reader = new FileReader();
let textFileURL: string, fileName: string;
reader.addEventListener('load', async ({target}) => {
	const text = (target.result as string).replace(/\r/g, '');
	const taraskText = await tarask(text, false, settings);
	Object.assign(download, {
		href: createTextFile(taraskText.replace(/\s(\n|\t)\s/g, '$1')),
		download: 'tarask-' + fileName
	});
	download.parentElement.classList.add('active');
	snackbar.show('Файл сканвэртаваны, можна спампоўваць', 1500);
});

upload.addEventListener('change', function() {
	const [file] = this.files;
	fileName = file.name;
	activateUpload();
	reader.readAsText(file);
	this.value = null;
});

function createTextFile(text) {
	if (textFileURL) URL.revokeObjectURL(textFileURL);
	return textFileURL = URL.createObjectURL(
		new Blob([text], {type: 'text/plain'})
	);
}

let activateUpload: Function | null = () => {
	const uploadLabel = $('upload-label');
	uploadLabel.title = uploadLabel.dataset.title;
	activateUpload = null;
}