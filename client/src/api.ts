import { Tarask } from 'taraskevizer';

type TaraskAsync = Tarask extends (...args: infer TParams) => infer TReturn
	? (...args: TParams) => Promise<TReturn>
	: never;

export const tarask: TaraskAsync = (text, options) =>
	fetch(process.env.API_URL, {
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
	}).then((res) => {
		if (res.ok) return res.text();
		throw new Error(res.statusText);
	});
