import { debounce } from '$lib/debounce';
import { getShifts } from '../utils';

export type Select = <T extends number>(
	elem: HTMLElement,
	initialOption: T,
	callback: (value: T) => void
) => void;

export const select: Select = (select, initialOption, callback) => {
	const options = Array.from(select.querySelectorAll('button'));
	const animationElement = document.createElement('div');
	animationElement.className = 'animation';
	select.appendChild(animationElement);
	let currActive = options[initialOption];
	currActive.classList.add('active');
	let optionShifts = getShifts(select, options);
	const updateAnimationPosition = () => {
		Object.assign(animationElement.style, optionShifts[+currActive.value]);
	};
	updateAnimationPosition();
	window.addEventListener(
		'resize',
		debounce(() => {
			optionShifts = getShifts(select, options);
			updateAnimationPosition();
		}, 100)
	);
	select.addEventListener('click', (e) => {
		const el = e.target as HTMLButtonElement;
		currActive.classList.remove('active');
		el.classList.add('active');
		currActive = el;
		updateAnimationPosition();
		callback(+el.value as typeof initialOption);
	});
};
