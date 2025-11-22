export const serviceWorker = () =>
	navigator.serviceWorker?.register(__SW_SCOPE__ + 'sw.js', {
		scope: __SW_SCOPE__,
	});
