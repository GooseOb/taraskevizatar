export const enum Theme {
	light,
	auto,
	dark,
}

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
