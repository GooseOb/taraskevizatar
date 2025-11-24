export const debounce = <TArgs extends unknown[]>(
	callback: (...args: TArgs) => void,
	delay: number
) => {
	let timeout: number;
	return (...args: TArgs) => {
		clearTimeout(timeout);
		timeout = window.setTimeout(() => {
			callback(...args);
		}, delay);
	};
};
