import { isArabic } from '$lib/alphabets';
import { taraskConfig } from '$lib/store/config';
import { sessionStorageWritable } from '$lib/store/localStorage';
import { outputText, outputTextLength } from '$lib/store/text';
import type { Action } from 'svelte/action';
import { get } from 'svelte/store';
import { createInteractiveTags } from 'taraskevizer';

const changeList = sessionStorageWritable<number[]>(
	'tarask_changeList',
	() => [],
	JSON.parse,
	JSON.stringify,
	200
);

const interactiveTags = createInteractiveTags({
	// Note that the `changeList` is mutated during the interaction,
	// so the `changeList` store is updated but not reactive.
	changeList: get(changeList),
});

interactiveTags.subscribe((list) => {
	changeList.set(list);
});

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
