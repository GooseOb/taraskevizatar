export const preserveFocusAfterClick = (element: HTMLElement) => {
	element.addEventListener('click', () => {
		setTimeout(() => {
			element.focus();
		}, 100);
	});
};
