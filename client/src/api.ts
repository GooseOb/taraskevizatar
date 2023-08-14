import { TaraskAsync } from 'taraskevizer';

export const tarask: TaraskAsync = async (text, options) => {
	const res = await fetch(import.meta.env.API_URL, {
		method: 'POST',
		mode: 'cors',
		body: JSON.stringify({
			text,
			alphabet: options!.abc,
			alwaysJ: options!.j,
			htmlOptions: options!.html,
		}),
		headers: {
			'Content-type': 'application/json; charset=UTF-8',
		},
	});
	if (res.ok) return res.text();
	throw new Error(res.statusText);
};
