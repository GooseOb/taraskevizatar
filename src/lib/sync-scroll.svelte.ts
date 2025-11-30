let ratio = $state(0);

export const syncScroll = (el: HTMLElement) => {
	$effect(() => {
		el.scrollTop = ratio * (el.scrollHeight - el.clientHeight);
	});

	el.addEventListener('scroll', () => {
		const heightDiff = el.scrollHeight - el.clientHeight;

		ratio = heightDiff === 0 ? 0 : el.scrollTop / heightDiff;
	});
};
