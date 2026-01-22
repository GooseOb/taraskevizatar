import { registerPlugin, type PluginValue } from '$lib/plugins';
import { localStorageWritable } from './localStorage';

export const pluginData = localStorageWritable<
	{
		id: number;
		url: string;
		code: string;
		requested?: boolean;
		imported?: boolean;
		paused?: boolean;
		value?: PluginValue | null;
	}[]
>(
	'tarask_plugins',
	() => [],
	(raw) => {
		const data = JSON.parse(raw);

		for (const item of data) {
			item.requested = false;
			item.imported = false;
			item.value = null;
			item.id = Math.random();
		}

		return data;
	},
	(value) => JSON.stringify(value.map(({ url, code }) => ({ url, code })))
);

pluginData.subscribe((data) => {
	const requests = data
		.filter((item) => !item.requested && item.url)
		.map((item) => {
			item.requested = true;
			item.code = '// Загрузка плагіна...';
			return fetch(item.url)
				.then((res) => res.text())
				.then((code) => {
					item.code = code;
				})
				.catch(() => {
					item.code = '// Памылка загрузкі плагіна';
				});
		});

	const imports = data
		.filter((item) => (item.requested || !item.url) && !item.imported && item.code)
		.map((item) => {
			item.imported = true;
			const blob = new Blob([item.code], { type: 'text/javascript' });
			const moduleUrl = URL.createObjectURL(blob);
			return import(/* @vite-ignore */ moduleUrl).then((mod) => {
				URL.revokeObjectURL(moduleUrl);
				const module = mod.default;
				item.value = module ? registerPlugin(item.id, module) : null;
			});
		});

	if (requests.length) {
		pluginData.update((d) => d);
		Promise.all(requests).then(() => {
			pluginData.update((d) => d);
		});
	}

	if (imports.length) {
		Promise.all(imports).then(() => {
			pluginData.update((d) => d);
		});
	}
});
