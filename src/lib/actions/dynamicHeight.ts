const getHelper = (element: HTMLElement) => () => {
	element.style.height = '0';
	requestAnimationFrame(() => {
		element.style.height = element.scrollHeight + 1 + 'px';
	});
};

export const dynamicHeight = (element: HTMLElement) => {
	const helper = getHelper(element);
	helper();
	element.addEventListener('input', helper);
};
