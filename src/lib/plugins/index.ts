import { writable } from 'svelte/store';
import type { AsyncPipeline, Pipeline } from 'taraskevizer/dist/lib';
import { status } from '../store/status';

type UIElement<T = any> = {
	type: 'picker';
	title: string;
	options: readonly { label: string; value: T }[];
	getValue: () => T;
	setValue: (value: T) => void;
};

export interface PluginValue {
	name: string;
	compat?: { min?: number[]; max?: number[] };
	description: string;
	ui: UIElement[];
	updateCurrentPipeline: (pipeline: Pipeline) => Pipeline | AsyncPipeline;
	unload?: () => void;
}

interface PluginUI {
	picker: <T>(
		title: string,
		options: readonly { label: string; value: T }[],
		defaultValue: T
	) => UIElement<T>;
}

export type Plugin = (taraskevizer: typeof import('taraskevizer'), ui: PluginUI) => PluginValue;

const taraskevizer = await import('taraskevizer');

const ids: number[] = [];
export const plugins = writable<PluginValue[]>([]);

const ui: PluginUI = {
	picker: (title, options, defaultValue) => ({
		type: 'picker',
		title,
		options,
		getValue: () => defaultValue,
		setValue: (value) => {
			defaultValue = value;
			plugins.update((plugins) => plugins);
		},
	}),
};

const taraskVersion = taraskevizer.version.split('.').map(Number);

export const registerPlugin = (id: number, plugin: Plugin) => {
	const val = plugin(taraskevizer, ui);

	if (!val.name || !val.description || !val.updateCurrentPipeline || !val.ui) {
		status.set(`Памылка: плагін ${val.name} не мае неабходных уласьцівасьцяў.`);
		return null;
	}

	if (val.compat) {
		const { min = [], max = [] } = val.compat;
		if (taraskVersion.some((num, i) => (min[i] ?? 0) > num || (max[i] ?? Infinity) < num)) {
			status.set(
				`Памылка: плагін "${val.name}" не падтрымлівае вэрсію тарашкевізатара ${taraskevizer.version}`
			);
			return null;
		}
	}

	val.unload = () => {
		plugins.update((plugins) => {
			const index = plugins.indexOf(val);
			if (index !== -1) {
				plugins.splice(index, 1);
				ids.splice(index, 1);
			}
			return plugins;
		});
	};

	plugins.update((plugins) => {
		if (ids.includes(id)) {
			const i = ids.indexOf(id);
			plugins[i] = val;
		} else {
			plugins.push(val);
			ids.push(id);
		}
		return plugins;
	});

	return val;
};
