import { debounce } from './utils';

export const syncScroll = <TElem extends HTMLElement>(els: TElem[]) => {
	let currScroll: null | HTMLElement = null;

	const stopScroll = debounce(() => {
		currScroll = null;
	}, 200);

	for (const scrollEl of els)
		scrollEl.addEventListener('scroll', function (this: TElem) {
			currScroll ||= this;
			if (currScroll === this)
				for (const synchronizedEl of els)
					if (synchronizedEl !== this)
						synchronizedEl.scrollTop =
							this.scrollTop *
							(synchronizedEl.scrollHeight / this.scrollHeight);
			stopScroll();
		});
};
