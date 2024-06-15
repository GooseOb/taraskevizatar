import {
	tarask,
	pipelines,
	dicts,
	VARIATION,
	REPLACE_J,
	TaraskConfig,
} from 'taraskevizer';
import { $, debounce, getShifts } from './utils';
import { prompts } from './prompts';
type ChangeableElement = HTMLSpanElement & { seqNum: number };

window.addEventListener('load', () => {
	navigator.serviceWorker
		?.register(__SW_SCOPE__ + 'sw.js', { scope: __SW_SCOPE__ })
		.then((sw) => {
			$('update-app').addEventListener('click', () => {
				if (navigator.onLine) {
					sw.update().then(() => {
						snackbar.show('Абноўлена. Перазагрузка старонкі');
						location.reload();
					});
				} else {
					snackbar.show('Нельга абнавіцца пакуль вы афлайн');
				}
			});
			sw.onupdatefound = () => {
				snackbar.show(
					'Каб бачыць апошнюю вэрсію старонкі, перазагрузіце старонку',
					10_000
				);
			};
		})
		.catch((err) => {
			console.warn('Service worker register fail', err);
		});
});

$('current-year').textContent = new Date().getFullYear().toString();

const enum Theme {
	light,
	auto,
	dark,
}
const themeCheckboxes =
	$('theme').querySelectorAll<HTMLInputElement>('.checkbox');
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
	if (themeId !== `${Theme.auto}`) checkboxesByThemeId[themeId].checked = true;
}

const setTheme = (themeId: Theme) => {
	localStorage.theme = themeId;
	themeSetters[themeId]();
};

const enum CARD {
	INPUT = 'official',
	OUTPUT = 'classic',
}
const enum EDIT {
	ENABLE = 'Рэдагаваньне уключана',
	DISABLE = 'Рэдагаваньне выключана',
}

const alphabets = [
	dicts.alphabets.cyrillic,
	dicts.alphabets.latin,
	dicts.alphabets.arabic,
	dicts.alphabets.latinJi,
];
const OUTPUT_PLACEHOLDER = [
	// force wrap
	'Тэкст',
	'Tekst',
	'طَقْصْطْ',
	'Tekst',
] as const;

const getSettingsLS = (): TaraskConfig => {
	const result = JSON.parse(localStorage.tarask_settings);
	result.general.abc = alphabets[result.general.abc];
	return result;
};

const taraskConfig = new TaraskConfig({
	general: {
		abc: dicts.alphabets.cyrillic,
		j: REPLACE_J.NEVER,
	},
	html: { g: false },
	nonHtml: {
		ansiColors: false,
		variations: VARIATION.ALL,
	},
	...(localStorage.tarask_settings && getSettingsLS()),
});

if (localStorage.settings) {
	const legacy = JSON.parse(localStorage.settings);
	if (legacy.j) taraskConfig.general.j = legacy.j;
	if (legacy.abc) taraskConfig.general.abc = alphabets[legacy.abc];
	if (legacy.html) taraskConfig.html = legacy.html;
	delete localStorage.settings;
}
if (localStorage.text) {
	localStorage.tarask_text = localStorage.text;
	delete localStorage.text;
}

const saveSettings = () => {
	localStorage.tarask_settings = JSON.stringify({
		...taraskConfig,
		general: {
			...taraskConfig.general,
			abc: alphabets.indexOf(taraskConfig.general.abc) as any,
		},
	});
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

let changeList: number[] = [];

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
		this.cancelHiding();
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
	(text.length > 10_000 ? debouncedConvert : convert)(text);
	localStorage.tarask_text = text;
});
window.addEventListener('keyup', (e) => {
	if (e.ctrlKey && e.code === 'KeyA') input.select();
});

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
		if (isContentEditable) {
			snackbar.show(EDIT.ENABLE);
			output.focus();
		} else {
			snackbar.show(EDIT.DISABLE);
		}
	},
};

const newBtnBar = (btnBar: HTMLElement, getText: () => string) => {
	btnBar.addEventListener('click', (e) => {
		const el = e.target as HTMLElement;
		if (el === btnBar) return;
		if (el.classList.contains('copy')) {
			navigator.clipboard.writeText(getText());
			snackbar.show('Скапіявана');
			return;
		}
		actions[el.id as Action]();
	});
};

newBtnBar($('input-btns'), () => input.value);
newBtnBar($('output-btns'), () => output.textContent!);

for (const el of themeCheckboxes) {
	const themeId = +el.value as Theme;
	const oppositeButton =
		checkboxesByThemeId[themeId === Theme.dark ? Theme.light : Theme.dark];
	el.addEventListener('click', () => {
		if (el.checked) {
			oppositeButton.checked = false;
			setTheme(themeId);
		} else {
			setTheme(Theme.auto);
		}
	});
}

const applyG = (el: ChangeableElement) => {
	el.textContent = dicts.gobj[el.textContent as keyof typeof dicts.gobj];
};

output.addEventListener('click', (e) => {
	const el = e.target as ChangeableElement;
	switch (el.tagName) {
		case 'TARL': {
			let data = el.dataset.l!;
			if (data.includes(',')) {
				const dataArr = data.split(',');
				dataArr.push(el.innerHTML);
				data = dataArr.shift()!;
				changeList[el.seqNum] =
					(changeList[el.seqNum] + 1) % (dataArr.length + 1);
				el.dataset.l = dataArr.join(',');
			} else {
				changeList[el.seqNum] = changeList[el.seqNum] ? 0 : 1;
				el.dataset.l = el.innerHTML;
			}
			el.innerHTML = data;
			return;
		}
		case 'TARH': {
			changeList[el.seqNum] = changeList[el.seqNum] ? 0 : 1;
			applyG(el);
		}
	}
});

type SelectId = 'abc' | 'j' | 'g' | 'esc-caps';
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
newSettingsSelect(
	'abc',
	alphabets.indexOf(taraskConfig.general.abc),
	(value) => {
		taraskConfig.general.abc = alphabets[value];
	}
);
newSettingsSelect('j', taraskConfig.general.j, (value) => {
	taraskConfig.general.j = value;
});
newSettingsSelect(
	'esc-caps',
	+taraskConfig.general.doEscapeCapitalized,
	(value) => {
		taraskConfig.general.doEscapeCapitalized = !!value;
	}
);
newSelect('g', +taraskConfig.html.g, (value) => {
	taraskConfig.html.g = !!value;
	saveSettings();
	output.innerHTML = output.innerHTML.replace(
		/<tarh>(.)<\/tarh>/g,
		($0, $1: keyof typeof dicts.gobj) => `<tarh>${dicts.gobj[$1]}</tarh>`
	);
});

async function convert(text: string) {
	if (!text) {
		output.innerHTML =
			OUTPUT_PLACEHOLDER[alphabets.indexOf(taraskConfig.general.abc)];
		counters.set({ input: 0, output: 0 });
		localStorage.tarask_text = '';
		return;
	}

	let result: string;
	try {
		result = tarask(text, pipelines.html, taraskConfig);
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

	const spans = output.querySelectorAll<ChangeableElement>('tarH, tarL');
	if (changeList.length > spans.length) {
		changeList.length = spans.length;
	} else while (changeList.length < spans.length) changeList.push(0);
	for (let i = 0; i < changeList.length; i++) {
		const el = spans[i];
		el.seqNum = i;
		if (changeList[i])
			switch (el.tagName) {
				case 'TARH':
					applyG(el);
					continue;
				case 'TARL':
					let data = el.dataset.l!;
					if (data.includes(',')) {
						const dataArr = data.split(',');
						data = el.innerHTML;
						for (let j = 0; j < changeList[i]; ++j) {
							dataArr.push(data);
							data = dataArr.shift()!;
						}
						el.dataset.l = dataArr.join(',');
					} else {
						el.dataset.l = el.innerHTML;
					}
					el.innerHTML = data;
			}
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

let isUploadActive = false;
let activateUpload = () => {
	if (isUploadActive) return;
	uploadLabel.title = uploadLabel.dataset.title!;
	isUploadActive = true;
};

const reader = new FileReader();
let textFileURL: string, fileName: string;
reader.addEventListener('load', async ({ target }) => {
	const text = (target!.result as string).replace(/\r/g, '');
	const taraskText = tarask(text, pipelines.plainText, taraskConfig);
	Object.assign(download, {
		href: createTextFileURL(taraskText.replace(/\s([\n\t])\s/g, '$1')),
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

const createTextFileURL = (text: string) => {
	if (textFileURL) URL.revokeObjectURL(textFileURL);
	textFileURL = URL.createObjectURL(new Blob([text], { type: 'text/plain' }));
	return textFileURL;
};

document.body.onload = () => {
	input.focus();
};

$('delete-all-data').addEventListener('click', async () => {
	delete localStorage.tarask_text;
	delete localStorage.tarask_settings;
	delete localStorage.theme;
	const cacheNames = await caches.keys();
	if (cacheNames.length) {
		await Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)));
		snackbar.show('Кэш, тэкст і налады выдалены');
	} else {
		snackbar.show('Кэш ужо пусты', 2500);
	}
});
