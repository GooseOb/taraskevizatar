import { gobj, Options } from '@core';
import { tarask } from '@api';
import { $, debounce } from './utils';
declare const __BUILD_DATE__: number;
declare const __DEFAULT_TEXT__: string;
declare const __SW_SCOPE__: string;
type ChangeableElement = HTMLSpanElement & { seqNum: number };

window.addEventListener('load', () => {
	navigator.serviceWorker
		?.register(__SW_SCOPE__ + 'sw.js', { scope: __SW_SCOPE__ })
		.catch((err) => {
			console.warn('Service worker register fail', err);
		});
});

const enum Theme {
	light,
	auto,
	dark,
}
const darkTheme = $<HTMLLinkElement>('dark-css');
const themeCheckboxes = $('theme').querySelectorAll(
	'.checkbox'
) as NodeListOf<HTMLInputElement>;
const darkThemeStates = ['not all', '(prefers-color-scheme: dark)', 'all'];

const checkboxesByThemeId: {
	[key in Exclude<Theme, Theme.auto>]: HTMLInputElement;
} = {
	[Theme.light]: themeCheckboxes[0],
	[Theme.dark]: themeCheckboxes[1],
};

if (localStorage.theme) {
	const themeId: `${Theme}` = localStorage.theme;
	darkTheme.media = darkThemeStates[themeId];
	if (themeId !== (`${Theme.auto}` as `${Theme.auto}`))
		checkboxesByThemeId[themeId].checked = true;
}

const setTheme = (themeId: Theme) => {
	localStorage.theme = themeId;
	darkTheme.media = darkThemeStates[themeId];
};

$('delete-cache').addEventListener('click', async () => {
	if (!navigator.onLine) {
		snackbar.show('Нельга выдаліць кэш пакуль вы афлайн');
		return;
	}
	try {
		const cacheNames = await caches.keys();
		if (!cacheNames.length) {
			snackbar.show('Кэш ужо пусты');
			return;
		}
		await Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)));
		snackbar.show('Кэш выдалены, абнаўленьне старонкі');
		location.reload();
	} catch (e) {
		snackbar.show('Памылка выдаленьня кэшу: ' + e);
	}
});

const enum CARD {
	INPUT = 'official',
	OUTPUT = 'classic',
}
const enum EDIT {
	ENABLE = 'Рэдагаваньне уключана',
	DISABLE = 'Рэдагаваньне выключана',
}

const OUTPUT_PLACEHOLDER = ['Тэкст', 'Tekst', 'طَقْصْطْ'] as const;

const settings: Options & { html: { g: boolean } } = {
	abc: 0,
	j: 0,
	html: { g: false },
};
const saveSettings = () => {
	localStorage.settings = JSON.stringify(settings);
};

if (localStorage.settings) {
	Object.assign(settings, JSON.parse(localStorage.settings));
} else {
	saveSettings();
}

const input = $<HTMLTextAreaElement & { fixHeight: () => void }>('input');
const settingsElement = $<HTMLDivElement>('settings');
const output = $<HTMLDivElement>('output');
const outputContainer = output.parentElement as HTMLDivElement;
const download = $<HTMLAnchorElement>('download');
const upload = $<HTMLInputElement>('upload');
const uploadLabel = $<HTMLLabelElement>('upload-label');
const getCounter = (id: string): HTMLDivElement =>
	$(id).querySelector('.num-counter');
type counterValues = {
	input: number | string;
	output: number | string;
};
const counters = {
	input: getCounter(CARD.INPUT),
	output: getCounter(CARD.OUTPUT),
	set(nums: counterValues) {
		for (const key in nums) this[key].textContent = nums[key];
	},
};

let changeList: boolean[] = [];

Object.assign(
	input,
	{
		fixHeight() {
			this.style.height = 0;
			const newHeight = this.scrollHeight + 1;
			this.style.height = newHeight + 'px';
		},
	},
	localStorage.text
		? {
				value: localStorage.text,
		  }
		: {
				value: __DEFAULT_TEXT__,
				onclick() {
					this.onclick = null;
					this.value = '';
					output.textContent = '';
					this.fixHeight();
					convert('');
				},
		  }
);

const forceConversion = () => convert(input.value);

const snackbar = Object.assign($<HTMLDivElement>('snackbar'), {
	_lastTimeout: 0,
	show(msg: string, visibilityTime = 1000) {
		this.innerHTML = msg;
		this.classList.remove('hidden');
		clearTimeout(this._lastTimeout);
		this._lastTimeout = setTimeout(() => {
			this.classList.add('hidden');
		}, visibilityTime);
	},
});

forceConversion();

input.addEventListener(
	'input',
	debounce(({ target }) => {
		const text = target.value.trim();
		convert(text);
		localStorage.text = text;
	}, 200)
);
window.addEventListener('keyup', (e) => {
	if (e.ctrlKey && e.code === 'KeyA') input.select();
});

const promptGenerator = (function* () {
	while (true) {
		yield '<tarL class="demo">Гэтыя часьціны</tarL> можна зьмяняць, націскаючы на іх';
		yield 'Апошняе абнаўленьне: ' +
			new Date(__BUILD_DATE__).toLocaleDateString();
	}
})();

const actions = {
	clear() {
		input.value = '';
		input.fixHeight();
		input.focus();
		forceConversion();
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
		snackbar.show(isContentEditable ? EDIT.ENABLE : EDIT.DISABLE);
		if (isContentEditable) output.focus();
	},
};

const valueProps = ['innerText', 'value'] satisfies [
	right: keyof HTMLDivElement,
	left: keyof HTMLTextAreaElement
];
for (const btnBar of document.querySelectorAll<HTMLDivElement>('.icon-btns')) {
	const textfield = $<HTMLTextAreaElement | HTMLDivElement>(btnBar.dataset.for);
	const valueProp = valueProps.pop();

	btnBar.addEventListener('click', (e) => {
		const el = e.target as HTMLElement;
		if (el === btnBar) return;
		if (el.classList.contains('copy')) {
			navigator.clipboard.writeText(textfield[valueProp]);
			snackbar.show('Скапіявана');
			return;
		}
		actions[el.id]();
	});
}

themeCheckboxes.forEach((el, i) => {
	const themeId = +el.value;
	const oppositeButton = themeCheckboxes[+!i];
	el.addEventListener('click', () => {
		if (el.checked) {
			oppositeButton.checked = false;
			setTheme(themeId);
		} else {
			setTheme(Theme.auto);
		}
	});
});

const isChangeableElement = (el: HTMLElement): el is ChangeableElement =>
	'seqNum' in el;

output.addEventListener('click', (e) => {
	const el = e.target as HTMLElement;
	if (isChangeableElement(el)) changeList[el.seqNum] = !changeList[el.seqNum];
	switch (el.tagName) {
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

type SelectId = 'abc' | 'j' | 'g';
type Select = (
	id: SelectId,
	initialOption: number,
	callback: (value: number) => void
) => void;
const getOptionActivator =
	<TElem extends HTMLElement = HTMLElement>(
		options: TElem[] | NodeListOf<TElem>
	) =>
	(option: TElem) => {
		for (const el of options) el.classList.remove('active');
		option.classList.add('active');
	};
const newSelect: Select = (id, initialOption, callback) => {
	const select = $(id);
	const options = select.querySelectorAll('button');
	const activateOption = getOptionActivator(options);
	select.addEventListener('click', (e) => {
		const el = e.target as HTMLButtonElement;
		activateOption(el);
		callback(+el.value);
	});
	activateOption(options[initialOption]);
};
const newSettingsSelect: Select = (id, initialOption, settingSetter) =>
	newSelect(id, initialOption, (value) => {
		settingSetter(value);
		saveSettings();
		forceConversion();
	});
newSettingsSelect('abc', settings.abc, (value) => {
	settings.abc = value;
});
newSettingsSelect('j', settings.j, (value) => {
	settings.j = value;
});
newSettingsSelect('g', +settings.html.g, (value) => {
	settings.html.g = !!value;
});

const describeConversionError = (err: string) => {
	if (/to(?:Upper|Lower)Case/.test(err))
		err +=
			'<br><br>Магчыма памылка з сымбалямі прабелу ў слоўніку. Калі ласка, дашліце памылку <a href="https://github.com/GooseOb/taraskevizatar/issues">сюды</a>';
	return err;
};

async function convert(text: string) {
	if (!text) {
		output.innerHTML = OUTPUT_PLACEHOLDER[settings.abc];
		counters.set({ input: 0, output: 0 });
		localStorage.text = '';
		return;
	}

	let result: string;
	try {
		result = await tarask(text, settings);
	} catch (e: unknown) {
		result = describeConversionError(e.toString());
	}

	output.innerHTML = result;
	counters.set({
		input: text.length,
		output: output.textContent.length,
	});

	const spans = output.querySelectorAll(
		'tarH, tarL'
	) as NodeListOf<ChangeableElement>;
	while (changeList.length < spans.length)
		changeList[changeList.length] = false;
	while (changeList.length > spans.length) changeList.pop();
	for (let i = 0; i < changeList.length; i++) {
		if (changeList[i]) spans[i].click();
		spans[i].seqNum = i;
	}
}

input.fixHeight();
input.addEventListener('input', input.fixHeight);

let currScroll: null | typeof input | typeof outputContainer;
const stopScroll = debounce(() => {
	currScroll = null;
}, 200);

const syncScroll = (el) =>
	function () {
		currScroll ||= this;
		if (currScroll === this)
			el.scrollTop = this.scrollTop * (el.scrollHeight / this.scrollHeight);
		stopScroll();
	};

input.addEventListener('scroll', syncScroll(outputContainer));
outputContainer.addEventListener('scroll', syncScroll(input));

const reader = new FileReader();
let textFileURL: string, fileName: string;
reader.addEventListener('load', async ({ target }) => {
	const text = (target.result as string).replace(/\r/g, '');
	const taraskText = await tarask(text, settings);
	Object.assign(download, {
		href: createTextFile(taraskText.replace(/\s(\n|\t)\s/g, '$1')),
		download: 'tarask-' + fileName,
	});
	download.parentElement.classList.add('active');
	activateUpload();
	snackbar.show('Файл сканвэртаваны, можна спампоўваць', 1500);
});

upload.addEventListener('change', function () {
	const [file] = this.files;
	fileName = file.name;
	reader.readAsText(file);
	this.value = null;
});

function createTextFile(text) {
	if (textFileURL) URL.revokeObjectURL(textFileURL);
	return (textFileURL = URL.createObjectURL(
		new Blob([text], { type: 'text/plain' })
	));
}

let activateUpload = () => {
	uploadLabel.title = uploadLabel.dataset.title;
	activateUpload = null;
};

document.body.onload = () => {
	input.focus();
};
