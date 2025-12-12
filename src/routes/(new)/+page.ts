import { resolve } from '$app/paths';
import { redirect } from '@sveltejs/kit';

export const load = () => {
	if (localStorage.getItem('tarask_text') !== null && !localStorage.getItem('tarask_redirected')) {
		localStorage.setItem('tarask_redirected', 'true');
		redirect(307, resolve('/old'));
	}
};
