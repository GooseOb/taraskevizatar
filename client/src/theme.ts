export type ThemeId = 0 | 1 | 2;
export const LIGHT: ThemeId = 0;
export const AUTO: ThemeId = 1;
export const DARK: ThemeId = 2;

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
