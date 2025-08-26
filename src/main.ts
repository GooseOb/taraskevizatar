import { createInteractiveTags, dicts, pipelines } from 'taraskevizer';
import { alphabets, isArabic, OUTPUT_PLACEHOLDER } from './alphabets';
import { taraskConfig } from './default-config';
import { jOptions } from './j-options';
import * as ls from './localStorage';
import { getNextPrompt } from './prompts';
import * as register from './registars';
import { syncScroll } from './sync-scroll';
import * as theme from './theme';
import { $, debounce } from './utils';

const { tarask } = pipelines;

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

switch (initialTheme) {
	case theme.DARK:
		{
			darkEl.checked = true;
		}
		break;
	case theme.LIGHT: {
		lightEl.checked = true;
	}
}

register.themeCheckbox(lightEl, theme.LIGHT, darkEl);
register.themeCheckbox(darkEl, theme.DARK, lightEl);

ls.setConfig(taraskConfig);

const settingsElement = $<HTMLDivElement>('settings');
const output = $<HTMLDivElement>('output');
const outputContainer = output.parentElement as HTMLDivElement;
const getCounter = (id: string): HTMLDivElement =>
	$(id).querySelector('.num-counter')!;
const counters = {
	input: getCounter('official'),
	output: getCounter('classic'),
} as const;

if (isArabic(taraskConfig.abc)) {
	output.style.fontFamily = 'NotoSansArabic';
}

if (!ls.getText()) {
	const onClick = () => {
		input.onclick = null;
		input.value = '';
		output.textContent = '';
		fixInputHeight();
		convert('');
		input.removeEventListener('input', onInput);
	};
	const onInput = () => {
		input.removeEventListener('click', onClick);
	};
	input.addEventListener('click', onClick, { once: true });
	input.addEventListener('input', onInput, { once: true });
}

const showSnackbar = register.snackbar($('snackbar'));

input.addEventListener('input', () => {
	const text = input.value.trim();
	if (text.length > 10_000) {
		counters.input.textContent = text.length.toString();
		debouncedConvert(text);
	} else {
		convert(text);
	}
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
		showSnackbar(getNextPrompt(), 2500);
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
} satisfies Record<string, VoidFn>;

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
registerActionBar($('output-btns'), () => output.innerText!);

const interactiveTags = createInteractiveTags();

const convert = (text: string) => {
	if (text === '') {
		output.textContent =
			OUTPUT_PLACEHOLDER[alphabets.indexOf(taraskConfig.abc)];
		counters.input.textContent = '0';
		counters.output.textContent = '0';
	} else {
		counters.input.textContent = text.length.toString();

		let result: string;
		try {
			result = tarask(text, taraskConfig);
		} catch (e: any) {
			result =
				e.toString() +
				'<br><br>Калі ласка, дашліце памылку на адзін з кантактаў "Для памылак і прапановаў"';
		}

		output.remove();
		output.innerHTML = result;

		counters.output.textContent = output.textContent!.length.toString();

		interactiveTags.update(output);

		outputContainer.appendChild(output);
	}
	ls.setText(text);
};
const debouncedConvert = debounce(convert, 200);

const forceConversion = () => {
	convert(input.value);
};
forceConversion();

output.addEventListener('click', (e) => {
	interactiveTags.tryAlternate(e.target as HTMLElement);
});

const getRegisterSettingsSelect =
	(updateView: VoidFn): register.Select =>
	(select, initialOption, setValue) => {
		register.select(select, initialOption, (value) => {
			setValue(value);
			ls.setConfig(taraskConfig);
			updateView();
		});
	};
const registerSettingsSelect = getRegisterSettingsSelect(forceConversion);

registerSettingsSelect(
	$('abc'),
	alphabets.indexOf(taraskConfig.abc),
	(value) => {
		taraskConfig.abc = alphabets[value];
		if (output.style.fontFamily) {
			output.style.fontFamily = '';
		} else if (isArabic(taraskConfig.abc)) {
			output.style.fontFamily = 'NotoSansArabic';
		}
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
	for (const el of output.querySelectorAll('tarH')) {
		el.textContent = dicts.gobj[el.textContent as keyof typeof dicts.gobj];
	}
})($('g'), +taraskConfig.g, (value) => {
	taraskConfig.g = !!value;
});

input.addEventListener('input', fixInputHeight);

syncScroll([input, outputContainer]);

const uploadLabel = $<HTMLLabelElement>('upload-label');
register.fileConverter($('upload'), $('download'), (text) =>
	tarask(text.replace(/\r/g, ''), {
		...taraskConfig,
		wrappers: null,
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

actions.showSettings();
