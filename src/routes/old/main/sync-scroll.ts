import { debounce } from '$lib/debounce';

export const syncScroll = <TElem extends HTMLElement>(els: TElem[]) => {
	let currScroll: null | HTMLElement = null;

	const stopScroll = debounce(() => {
		currScroll = null;
	}, 200);

	for (const el of els) {
		el.addEventListener('scroll', () => {
			currScroll ||= el;
			if (currScroll === el)
				for (const synchronizedEl of els)
					if (synchronizedEl !== el)
						synchronizedEl.scrollTop =
							el.scrollTop * (synchronizedEl.scrollHeight / el.scrollHeight);
			stopScroll();
		});
	}
};
