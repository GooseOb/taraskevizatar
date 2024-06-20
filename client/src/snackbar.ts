export const registerSnackBar = (element: HTMLElement) => {
	let timeoutId = 0;
	let _visibilityTime = 1000;

	const cancelHiding = () => {
		clearTimeout(timeoutId);
	};
	const hideWithTimeout = () => {
		timeoutId = window.setTimeout(() => {
			element.classList.add('hidden');
		}, _visibilityTime);
	};

	element.addEventListener('mouseover', cancelHiding);
	element.addEventListener('mouseleave', hideWithTimeout);

	return (msg: string, visibilityTime?: number) => {
		element.innerHTML = msg;
		element.classList.remove('hidden');
		if (visibilityTime) {
			_visibilityTime = visibilityTime;
		}
		cancelHiding();
		hideWithTimeout();
	};
};
