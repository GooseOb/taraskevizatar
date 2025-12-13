export const snackbar = $state({ value: '', visible: false });

let timeout: ReturnType<typeof setTimeout>;
let durationValue = 0;

export const cancelHiding = () => {
	clearTimeout(timeout);
};

export const hideWithTimeout = () => {
	timeout = setTimeout(() => {
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
