export const snackbar = $state({ value: '', visible: false });

let timeoutId: number | null = null;
let durationValue = 0;

export const cancelHiding = () => {
	if (timeoutId) {
		clearTimeout(timeoutId);
	}
};

export const hideWithTimeout = () => {
	timeoutId = window.setTimeout(() => {
		snackbar.visible = false;
	}, durationValue);
};

export const setSnackbar = (message: string, duration = 3000) => {
	snackbar.value = message;
	snackbar.visible = true;
	durationValue = duration;

	cancelHiding();

	hideWithTimeout();
};
