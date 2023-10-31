import {
	gobj,
	TaraskOptions,
	HtmlOptions,
	taraskToHtml,
	VARIATION,
} from 'taraskevizer';
import { tarask } from '@api';
import { $, debounce } from './utils';
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
const themeCheckboxes = $('theme').querySelectorAll(
	'.checkbox'
) as NodeListOf<HTMLInputElement>;
const themeSetters = [
	() => {
		document.body.classList.remove('dark');
	},
	() => {
		if (window.matchMedia) {
			const { classList } = document.body;
			if (window.matchMedia('(prefers-color-scheme: light)').matches) {
				classList.remove('dark');
			} else {
				classList.add('dark');
			}
		}
	},
	() => {
		document.body.classList.add('dark');
	},
];

const checkboxesByThemeId: {
	[key in Exclude<Theme, Theme.auto>]: HTMLInputElement;
} = {
	[Theme.light]: themeCheckboxes[0],
	[Theme.dark]: themeCheckboxes[1],
};

if (localStorage.theme) {
	const themeId: `${Theme}` = localStorage.theme;
	themeSetters[themeId]();
	if (themeId !== (`${Theme.auto}` as `${Theme.auto}`))
		checkboxesByThemeId[themeId].checked = true;
}

const setTheme = (themeId: Theme) => {
	localStorage.theme = themeId;
	themeSetters[themeId]();
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

const OUTPUT_PLACEHOLDER = ['Тэкст', 'Tekst', 'طَقْصْطْ', 'Τεκστ'] as const;

// const settings = {
// 	abc: 0,
// 	j: 0,
// 	html: { g: false },
// 	nonHtml: false,
// 	...(localStorage.settings && JSON.parse(localStorage.settings)),
// };
const settings: { general: TaraskOptions; html: HtmlOptions } = {
	general: {
		abc: 0,
		j: 0,
	},
	html: { g: false },
	...(localStorage.tarask_settings && JSON.parse(localStorage.tarask_settings)),
};

if (localStorage.settings) {
	const legacy = JSON.parse(localStorage.settings);
	if (legacy.j) settings.general.j = legacy.j;
	if (legacy.abc) settings.general.abc = legacy.abc;
	if (legacy.html) settings.html = legacy.html;
	delete localStorage.settings;
}
if (localStorage.text) {
	localStorage.tarask_text = localStorage.text;
	delete localStorage.text;
}

const saveSettings = () => {
	localStorage.tarask_settings = JSON.stringify(settings);
};

saveSettings();

type AppInputElement = HTMLTextAreaElement & { fixHeight: () => void };
type AppOutputContainer = HTMLDivElement;

const input = $<AppInputElement>('input');
const settingsElement = $<HTMLDivElement>('settings');
const output = $<HTMLDivElement>('output');
const outputContainer = output.parentElement as AppOutputContainer;
const download = $<HTMLAnchorElement>('download');
const upload = $<HTMLInputElement>('upload');
const uploadLabel = $<HTMLLabelElement>('upload-label');
const getCounter = (id: string): HTMLDivElement =>
	$(id).querySelector('.num-counter')!;
type CounterKeys = 'input' | 'output';
const counters = {
	input: getCounter(CARD.INPUT),
	output: getCounter(CARD.OUTPUT),
	set(nums) {
		for (const key in nums)
			this[key as CounterKeys].textContent =
				nums[key as CounterKeys].toString();
	},
} satisfies Record<CounterKeys, HTMLElement> & {
	set(nums: Record<CounterKeys, string | number>): void;
};

let changeList: boolean[] = [];

Object.assign(
	input,
	{
		fixHeight(this: AppInputElement) {
			this.style.height = '0';
			const newHeight = this.scrollHeight + 1;
			this.style.height = newHeight + 'px';
		},
	},
	localStorage.tarask_text
		? {
				value: localStorage.tarask_text,
		  }
		: {
				value: __DEFAULT_TEXT__,
				onclick(this: AppInputElement) {
					this.onclick = null;
					this.value = '';
					output.textContent = '';
					this.fixHeight();
					convert('');
				},
		  }
);

const forceConversion = () => convert(input.value);

const snackbar = {
	element: $<HTMLDivElement>('snackbar'),
	_timeout: 0,
	_visibilityTime: 1000,
	show(msg: string, visibilityTime = 1000) {
		this._visibilityTime = visibilityTime;
		this.element.innerHTML = msg;
		this.element.classList.remove('hidden');
		this.hideWithTimeout();
	},
	hideWithTimeout() {
		this._timeout = window.setTimeout(() => {
			this.element.classList.add('hidden');
		}, this._visibilityTime);
	},
	cancelHiding() {
		clearTimeout(this._timeout);
	},
};
snackbar.element.addEventListener('mouseover', () => {
	snackbar.cancelHiding();
});
snackbar.element.addEventListener('mouseleave', () => {
	snackbar.hideWithTimeout();
});

forceConversion();

const debouncedConvert = debounce(convert, 200);

input.addEventListener('input', function () {
	const text = this.value.trim();
	if (text.length > 10_000) {
		debouncedConvert(text);
	} else {
		convert(text);
	}
	localStorage.tarask_text = text;
});
window.addEventListener('keyup', (e) => {
	if (e.ctrlKey && e.code === 'KeyA') input.select();
});

const prompts = {
	list: [
		'<tarL class="demo">Гэтыя часьціны</tarL> можна зьмяняць, націскаючы на іх',
		'Апошняе абнаўленьне: ' + new Date(__BUILD_DATE__).toLocaleDateString(),
	] as const,
	_i: 0,
	getNext(): string {
		const result = this.list[this._i];
		this._i = (this._i + 1) % this.list.length;
		return result;
	},
};

type Action = 'clear' | 'info' | 'showSettings' | 'edit';

const actions: Record<Action, () => void> = {
	clear() {
		input.value = '';
		input.fixHeight();
		input.focus();
		forceConversion();
	},
	info() {
		snackbar.show(prompts.getNext(), 2500);
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
	const textfield = $<HTMLTextAreaElement | HTMLDivElement>(
		btnBar.dataset.for!
	);
	const valueProp = valueProps.pop();

	btnBar.addEventListener('click', (e) => {
		const el = e.target as HTMLElement;
		if (el === btnBar) return;
		if (el.classList.contains('copy')) {
			navigator.clipboard.writeText(
				//@ts-ignore
				textfield[valueProp]
			);
			snackbar.show('Скапіявана');
			return;
		}
		actions[el.id as Action]();
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
			let data = el.dataset.l!;
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
			el.textContent = gobj[el.textContent as keyof typeof gobj];
	}
});

const getShifts = (parent: HTMLElement, children: HTMLElement[]) => {
	const { left, top } = parent.getBoundingClientRect();
	return children.map((item) => {
		const itemRect = item.getBoundingClientRect();
		return {
			top: itemRect.top - top + 'px',
			left: itemRect.left - left + 'px',
			width: itemRect.width + 'px',
			height: itemRect.height + 'px',
		} satisfies { [key in keyof HTMLElement['style']]?: string };
	});
};

type SelectId = 'abc' | 'j' | 'g';
type Select = <T extends number>(
	id: SelectId,
	initialOption: T,
	callback: (value: T) => void
) => void;
const newSelect: Select = (id, initialOption, callback) => {
	const select = $(id);
	const options = Array.from(select.querySelectorAll('button'));
	const animationElement = document.createElement('div');
	animationElement.className = 'animation';
	select.append(animationElement);
	let currActive = options[initialOption];
	currActive.classList.add('active');
	let optionShifts = getShifts(select, options);
	const updateAnimationPosition = () => {
		Object.assign(animationElement.style, optionShifts[+currActive.value]);
	};
	updateAnimationPosition();
	window.addEventListener(
		'resize',
		debounce(() => {
			optionShifts = getShifts(select, options);
			updateAnimationPosition();
		}, 100)
	);
	select.addEventListener('click', (e) => {
		const el = e.target as HTMLButtonElement;
		currActive.classList.remove('active');
		el.classList.add('active');
		currActive = el;
		updateAnimationPosition();
		callback(+el.value as typeof initialOption);
	});
};

const newSettingsSelect: Select = (id, initialOption, setValue) =>
	newSelect(id, initialOption, (value) => {
		setValue(value);
		saveSettings();
		forceConversion();
	});
newSettingsSelect('abc', settings.general.abc, (value) => {
	settings.general.abc = value;
});
newSettingsSelect('j', settings.general.j, (value) => {
	settings.general.j = value;
});
newSettingsSelect('g', +settings.html.g, (value) => {
	settings.html.g = !!value;
});

async function convert(text: string) {
	if (!text) {
		output.innerHTML = OUTPUT_PLACEHOLDER[settings.general.abc];
		counters.set({ input: 0, output: 0 });
		localStorage.tarask_text = '';
		return;
	}

	let result: string;
	try {
		result = await taraskToHtml(text, settings.general, settings.html);
	} catch (e: any) {
		result =
			e.toString() +
			'<br><br>Калі ласка, дашліце памылку на адзін з кантактаў "Для памылак і прапановаў"';
	}

	output.innerHTML = result;
	counters.set({
		input: text.length,
		output: output.textContent!.length,
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

let currScroll: null | AppInputElement | AppOutputContainer;
const stopScroll = debounce(() => {
	currScroll = null;
}, 200);

const syncScroll = <TElem extends AppInputElement | AppOutputContainer>(
	el: TElem
) =>
	function (this: TElem) {
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
	const text = (target!.result as string).replace(/\r/g, '');
	const taraskText = await tarask(text, settings.general, {
		nodeColors: false,
		variations: VARIATION.ALL,
	});
	Object.assign(download, {
		href: createTextFile(taraskText.replace(/\s([\n\t])\s/g, '$1')),
		download: 'tarask-' + fileName,
	});
	download.parentElement!.classList.add('active');
	activateUpload();
	snackbar.show('Файл сканвэртаваны, можна спампоўваць', 1500);
});

upload.addEventListener('change', function () {
	const [file] = this.files!;
	fileName = file.name;
	reader.readAsText(file);
	this.value = '';
});

const createTextFile = (text: string) => {
	if (textFileURL) URL.revokeObjectURL(textFileURL);
	return (textFileURL = URL.createObjectURL(
		new Blob([text], { type: 'text/plain' })
	));
};

let isUploadActive = false;
let activateUpload = () => {
	if (isUploadActive) return;
	uploadLabel.title = uploadLabel.dataset.title!;
	isUploadActive = true;
};

document.body.onload = () => {
	input.focus();
};
