import { AUTO } from '../theme';
import { setThemeId } from '../localStorage';

export const themeCheckbox = (
	el: HTMLInputElement,
	themeId: ThemeId,
	oppositeEl: HTMLInputElement
) => {
	el.addEventListener('click', () => {
		if (el.checked) {
			oppositeEl.checked = false;
			themeSetters[themeId]();
			setThemeId(themeId);
		} else {
			setAuto();
			setThemeId(AUTO);
		}
	});
};
