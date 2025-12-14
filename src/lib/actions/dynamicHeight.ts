import type { Action } from 'svelte/action';

const getHelper = (element: HTMLElement) => () => {
	element.style.height = '0';
	requestAnimationFrame(() => {
		element.style.height = element.scrollHeight + 1 + 'px';
	});
};

export const dynamicHeight: Action = (element) => {
	const helper = getHelper(element);
	helper();
	element.addEventListener('input', helper);
};
