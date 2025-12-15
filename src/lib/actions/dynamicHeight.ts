import type { Action } from 'svelte/action';
import type { Readable } from 'svelte/store';

export const dynamicHeight: Action<HTMLElement, Readable<unknown>> = (element, readable) => {
	const unsubscribe = readable.subscribe(() => {
		element.style.height = '0';
		requestAnimationFrame(() => {
			element.style.height = element.scrollHeight + 1 + 'px';
		});
	});

	return {
		destroy: unsubscribe,
	};
};
