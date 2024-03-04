import type { HtmlOptions, NonHtmlOptions } from 'taraskevizer';
// TODO: make it working again

type TaraskAsync<TOption extends object> = Tarask<TOption> extends (
	...args: infer TParams
) => infer TReturn
	? (...args: TParams) => Promise<TReturn>
	: never;

export const taraskToHtml: TaraskAsync<HtmlOptions> = (
	text,
	taraskOptions,
	htmlOptions
) =>
	fetch(process.env.API_URL, {
		method: 'POST',
		mode: 'cors',
		body: JSON.stringify({
			text,
			alphabet: taraskOptions.abc,
			alwaysJ: taraskOptions.j,
			htmlOptions,
		}),
		headers: {
			'Content-type': 'application/json; charset=UTF-8',
		},
	}).then((res) => {
		if (res.ok) return res.text();
		throw new Error(res.statusText);
	});

export const tarask: TaraskAsync<NonHtmlOptions> = (
	text,
	taraskOptions,
	nonHtmlOptions
) =>
	fetch(process.env.API_URL, {
		method: 'POST',
		mode: 'cors',
		body: JSON.stringify({
			text,
			alphabet: taraskOptions!.abc,
			alwaysJ: taraskOptions!.j,
		}),
		headers: {
			'Content-type': 'application/json; charset=UTF-8',
		},
	}).then((res) => {
		if (res.ok) return res.text();
		throw new Error(res.statusText);
	});
