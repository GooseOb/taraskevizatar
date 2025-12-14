import { isArabic } from '$lib/alphabets';
import { taraskConfig } from '$lib/store/config';
import { outputText, outputTextLength } from '$lib/store/text';
import { createInteractiveTags } from 'taraskevizer';

const interactiveTags = createInteractiveTags();

export const output = (node: HTMLElement) => {
	outputText.subscribe((text) => {
		node.innerHTML = text;
		interactiveTags.update(node);
		outputTextLength.set(node.innerText.length);
	});

	taraskConfig.subscribe(({ abc }) => {
		node.style.fontFamily = isArabic(abc) ? 'NotoSansArabic' : 'inherit';
	});

	node.addEventListener('click', (e) => {
		interactiveTags.tryAlternate(e.target as Element);
		outputTextLength.set(node.innerText.length);
	});
};
