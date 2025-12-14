export const avoidVirtualKeyboard = (node: HTMLElement) => {
	if (window.visualViewport) {
		const handler = () => {
			node.style.height = `calc(100% - ${Math.max(0, window.innerHeight - window.visualViewport!.height)}px)`;
		};

		window.visualViewport.addEventListener('resize', handler);

		$effect(() => () => {
			window.visualViewport!.removeEventListener('resize', handler);
		});
	}
};
