import { isArabic } from '$lib/alphabets';
import { taraskConfig } from '$lib/store/config';
import { outputText, outputTextLength } from '$lib/store/text';
import type { Action } from 'svelte/action';
import { createInteractiveTags } from 'taraskevizer';

const interactiveTags = createInteractiveTags();

export const output: Action = (node) => {
	const unsubText = outputText.subscribe((text) => {
		node.innerHTML = text;
		interactiveTags.update(node);
		outputTextLength.set(node.innerText.length);
	});

	const unsubConfig = taraskConfig.subscribe(({ abc }) => {
		node.style.fontFamily = isArabic(abc) ? 'NotoSansArabic' : 'inherit';
	});

	node.addEventListener('click', (e) => {
		interactiveTags.tryAlternate(e.target as Element);
		outputTextLength.set(node.innerText.length);
	});

	return {
		destroy: () => {
			unsubText();
			unsubConfig();
		},
	};
};
