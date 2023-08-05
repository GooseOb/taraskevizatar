import { TaraskAsync } from 'taraskevizer';

export const tarask: TaraskAsync = async (
	text,
	{ abc: alphabet, j: alwaysJ, html: htmlOptions }
) => {
	const res = await fetch(process.env.API_URL, {
		method: 'POST',
		mode: 'cors',
		body: JSON.stringify({ text, alphabet, alwaysJ, htmlOptions }),
		headers: {
			'Content-type': 'application/json; charset=UTF-8',
		},
	});
	if (res.ok) return res.text();
	throw new Error(res.statusText);
};
