export const debounce = <TCallback extends (...args: any[]) => void>(
	callback: TCallback,
	cooldown: number
) => {
	let timeout: number;
	return (...args: Parameters<TCallback>) => {
		clearTimeout(timeout);
		timeout = window.setTimeout(() => {
			callback(...args);
		}, cooldown);
	};
};

export const $ = <T extends HTMLElement = HTMLElement>(id: string) =>
	document.getElementById(id) as T;
