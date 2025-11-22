import { redirect } from '@sveltejs/kit';

export const load = () => {
	if (localStorage.getItem('tarask_text') !== null && !localStorage.getItem('tarask_redirected')) {
		redirect(307, '/old');
	}
};
