export const setLight = () => {
	document.body.classList.remove('dark');
};
export const setDark = () => {
	document.body.classList.add('dark');
};
export const setAuto = () => {
	if (window.matchMedia?.('(prefers-color-scheme: light)').matches) {
		setLight();
	} else {
		setDark();
	}
};

export const themeSetters = [setLight, setAuto, setDark];
export const initialTheme = +(localStorage.theme || '1');

export const elements: { input: HTMLTextAreaElement | null } = $state({ input: null });

const input = $derived(elements.input);

export const fixInputHeight = () => {
	input!.style.height = '0';
	input!.style.height = input!.scrollHeight + 1 + 'px';
};
