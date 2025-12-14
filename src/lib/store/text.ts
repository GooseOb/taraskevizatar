import { derived } from 'svelte/store';
import { taraskConfig } from './config';
import { getOutputPlaceholder } from '$lib/alphabets';
import { pipelines } from 'taraskevizer';
import { localStorageWritableString } from './localStorage';

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

export const outputText = derived([taraskText, taraskConfig], ([$taraskText, $taraskConfig]) => {
	if (!$taraskText.trim()) {
		return getOutputPlaceholder($taraskConfig.abc);
	}
	try {
		return pipelines.tarask($taraskText, $taraskConfig);
	} catch (e) {
		return (
			(e as Error).toString() +
			'<br><br>Калі ласка, дашліце памылку на адзін з кантактаў "Для памылак і прапановаў"'
		);
	}
});
