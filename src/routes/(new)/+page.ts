import { resolve } from '$app/paths';
import { redirect } from '@sveltejs/kit';

export const load = () => {
	if (!localStorage.getItem('tarask_redirected')) {
		localStorage.setItem('tarask_redirected', 'true');
		if (localStorage.getItem('tarask_text') !== null) {
			redirect(307, resolve('/old'));
		}
	}
};
