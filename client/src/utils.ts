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

export const getShifts = (parent: HTMLElement, children: HTMLElement[]) => {
	const { left, top } = parent.getBoundingClientRect();
	return children.map((item) => {
		const itemRect = item.getBoundingClientRect();
		return {
			top: itemRect.top - top + 'px',
			left: itemRect.left - left + 'px',
			width: itemRect.width + 'px',
			height: itemRect.height + 'px',
		} satisfies { [key in keyof HTMLElement['style']]?: string };
	});
};
