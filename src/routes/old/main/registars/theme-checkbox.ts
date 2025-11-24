import { setAuto, themeSetters } from '../../common.svelte';
import { setThemeId } from '../localStorage';
import { AUTO } from '../theme';

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
