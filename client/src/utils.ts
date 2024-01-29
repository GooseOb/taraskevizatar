export const debounce = <TArgs extends any[]>(
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

export const $ = <T extends HTMLElement = HTMLElement>(id: string) =>
	document.getElementById(id) as T;
