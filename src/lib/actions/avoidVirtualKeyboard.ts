import type { Action } from 'svelte/action';

export const avoidVirtualKeyboard: Action = (node) => {
	if (window.visualViewport) {
		const handler = () => {
			node.style.height = `calc(100% - ${Math.max(0, window.innerHeight - window.visualViewport!.height)}px)`;
		};

		window.visualViewport.addEventListener('resize', handler);

		return {
			destroy: () => {
				window.visualViewport!.removeEventListener('resize', handler);
			},
		};
	}
};
