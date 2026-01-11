import { derived, writable, type Readable } from 'svelte/store';
import { taraskConfig } from './config';
import { getOutputPlaceholder } from '$lib/alphabets';
import { pipelines } from 'taraskevizer';
import { localStorageWritableString } from './localStorage';
import { pipeline } from './pipeline';

export const clearDefaultText = (node: HTMLInputElement | HTMLTextAreaElement) => {
	node.addEventListener(
		'focus',
		() => {
			if (node.value === getDefaultText()) {
				taraskText.update(() => '');
			}
		},
		{ once: true }
	);
};

const getDefaultText = () => __DEFAULT_TEXT__;

export const taraskText = localStorageWritableString('tarask_text', getDefaultText, 300);

let lastText = '';
export const outputText: Readable<string> = derived(
	[taraskText, taraskConfig, pipeline],
	([$taraskText, $taraskConfig, $pipeline], set) => {
		if (!$taraskText.trim()) {
			set(getOutputPlaceholder($taraskConfig.abc));
		}

		lastText = $taraskText;

		Promise.resolve($pipeline($taraskText, $taraskConfig))
			.then((val) => {
				if (lastText === $taraskText) {
					set(val);
				}
			})
			.catch((e) => {
				set(
					(e as Error).toString() +
						'<br><br>Калі ласка, дашліце памылку на адзін з кантактаў "Для памылак і прапановаў"'
				);
			});
	}
);

export const outputTextLength = writable(0);
