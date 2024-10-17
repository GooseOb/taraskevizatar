import { tarask, pipelines, dicts, wrappers } from 'taraskevizer';
import { $, debounce } from './utils';
import { prompts } from './prompts';
import { syncScroll } from './sync-scroll';
import { type ChangeableElement, tags } from './tags';
import { taraskConfig } from './default-config';
import { jOptions } from './j-options';
import { alphabets, OUTPUT_PLACEHOLDER } from './alphabets';
import * as register from './registars';
import * as ls from './localStorage';
import { setDark, Theme } from './theme';

window.addEventListener('load', () => {
	register
		.serviceWorker()
		.then((sw) => {
			$('update-app').addEventListener('click', () => {
				if (navigator.onLine) {
					sw.update().then(() => {
						showSnackbar('Абноўлена. Перазагрузка старонкі');
						location.reload();
					});
				} else {
					showSnackbar('Нельга абнавіцца пакуль вы афлайн');
				}
			});
			sw.onupdatefound = () => {
				showSnackbar(
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

const lightEl = $<HTMLInputElement>('theme-light');
const darkEl = $<HTMLInputElement>('theme-dark');

switch (+ls.getThemeId()) {
	case Theme.dark:
		{
			setDark();
			darkEl.checked = true;
		}
		break;
	case Theme.light: {
		lightEl.checked = true;
	}
}

register.themeCheckbox(lightEl, Theme.light, darkEl);
register.themeCheckbox(darkEl, Theme.dark, lightEl);

ls.setConfig(taraskConfig);

const input = $<HTMLTextAreaElement>('input');
const settingsElement = $<HTMLDivElement>('settings');
const output = $<HTMLDivElement>('output');
const outputContainer = output.parentElement as HTMLDivElement;
const getCounter = (id: string): HTMLDivElement =>
	$(id).querySelector('.num-counter')!;
type CounterKeys = 'input' | 'output';
const counters = {
	input: getCounter('official'),
	output: getCounter('classic'),
	set(nums) {
		for (const key in nums)
			this[key as CounterKeys].textContent =
				nums[key as CounterKeys].toString();
	},
} satisfies Record<CounterKeys, HTMLElement> & {
	set(nums: Record<CounterKeys, string | number>): void;
};

{
	const value = ls.getText();
	if (value) {
		input.value = value;
	} else {
		input.value = __DEFAULT_TEXT__;
		input.onclick = () => {
			input.onclick = null;
			input.value = '';
			output.textContent = '';
			fixInputHeight();
			convert('');
		};
	}
}
const fixInputHeight = () => {
	input.style.height = '0';
	input.style.height = input.scrollHeight + 1 + 'px';
};

const showSnackbar = register.snackbar($('snackbar'));

input.addEventListener('input', function () {
	const text = this.value.trim();
	(text.length > 10_000 ? debouncedConvert : convert)(text);
	ls.setText(text);
});
window.addEventListener('keyup', (e) => {
	if (e.ctrlKey && e.code === 'KeyA') input.select();
});

const actions = {
	clear: () => {
		input.value = '';
		fixInputHeight();
		input.focus();
		forceConversion();
	},
	info: () => {
		showSnackbar(prompts.getNext(), 2500);
	},
	showSettings: () => {
		settingsElement.classList.toggle('hidden');
	},
	edit: () => {
		const isContentEditable = !output.isContentEditable;
		output.contentEditable = isContentEditable.toString();
		if (isContentEditable) {
			showSnackbar('Рэдагаваньне уключана');
			output.focus();
		} else {
			showSnackbar('Рэдагаваньне выключана');
		}
	},
} satisfies Record<string, () => void>;

type Action = keyof typeof actions;

const registerActionBar = (btnBar: HTMLElement, getText: () => string) => {
	btnBar.addEventListener('click', (e) => {
		const el = e.target as HTMLElement;
		if (el !== btnBar) {
			if (el.classList.contains('copy')) {
				navigator.clipboard.writeText(getText());
				showSnackbar('Скапіявана');
			} else {
				actions[el.id as Action]();
			}
		}
	});
};

registerActionBar($('input-btns'), () => input.value);
registerActionBar($('output-btns'), () => output.textContent!);

const convert = async (text: string) => {
	if (text) {
		let result: string;
		try {
			result = tarask(text, pipelines.tar, taraskConfig);
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

		tags.apply(output.querySelectorAll('tarH, tarL'));
	} else {
		output.innerHTML = OUTPUT_PLACEHOLDER[alphabets.indexOf(taraskConfig.abc)];
		counters.set({ input: 0, output: 0 });
		ls.setText('');
	}
};
const debouncedConvert = debounce(convert, 200);

const forceConversion = () => convert(input.value);
forceConversion();

output.addEventListener('click', (e) => {
	tags.alternate(e.target as ChangeableElement);
});

const getRegisterSettingsSelect =
	(updateView: () => void): register.Select =>
	(select, initialOption, setValue) =>
		register.select(select, initialOption, (value) => {
			setValue(value);
			ls.setConfig(taraskConfig);
			updateView();
		});
const registerSettingsSelect = getRegisterSettingsSelect(forceConversion);

registerSettingsSelect(
	$('abc'),
	alphabets.indexOf(taraskConfig.abc),
	(value) => {
		taraskConfig.abc = alphabets[value];
	}
);
registerSettingsSelect($('j'), jOptions.indexOf(taraskConfig.j), (value) => {
	taraskConfig.j = jOptions[value];
});
registerSettingsSelect(
	$('esc-caps'),
	+taraskConfig.doEscapeCapitalized,
	(value) => {
		taraskConfig.doEscapeCapitalized = !!value;
	}
);

getRegisterSettingsSelect(() => {
	output.innerHTML = output.innerHTML.replace(/.(?=<\/tarh>)/g, ($0) =>
		wrappers.html.letterH(dicts.gobj[$0 as keyof typeof dicts.gobj])
	);
})($('g'), +taraskConfig.g, (value) => {
	taraskConfig.g = !!value;
});

fixInputHeight();
input.addEventListener('input', fixInputHeight);

syncScroll([input, outputContainer]);

const uploadLabel = $<HTMLLabelElement>('upload-label');
register.fileConverter($('upload'), $('download'), (text) =>
	tarask(text.replace(/\r/g, ''), pipelines.tar, {
		...taraskConfig,
		wrapperDict: null,
	})
).onConverted = () => {
	uploadLabel.title = uploadLabel.dataset.title!;
	showSnackbar('Файл сканвэртаваны, можна спампоўваць', 1500);
};

document.body.onload = () => {
	input.focus();
};

$('delete-all-data').addEventListener('click', async () => {
	ls.clear();
	const cacheNames = await caches.keys();
	if (cacheNames.length) {
		await Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)));
		showSnackbar('Кэш, тэкст і налады выдалены');
	} else {
		showSnackbar('Кэш ужо пусты', 2500);
	}
});
