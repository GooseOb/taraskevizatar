export const debounce = <TArgs extends unknown[]>(
	callback: (...args: TArgs) => void,
	delay: number
) => {
	let timeout: ReturnType<typeof setTimeout>;
	return (...args: TArgs) => {
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			callback(...args);
		}, delay);
	};
};
