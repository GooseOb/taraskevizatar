import { Theme, themeSetters } from '../theme';
import { setThemeId } from '../localStorage';

export const themeCheckbox = (
	el: HTMLInputElement,
	themeId: Theme,
	oppositeEl: HTMLInputElement
) => {
	el.addEventListener('click', () => {
		if (el.checked) {
			oppositeEl.checked = false;
			themeSetters[themeId]();
			setThemeId(themeId);
		} else {
			setThemeId(Theme.auto);
		}
	});
};
