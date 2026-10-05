import { writable } from 'svelte/store';
import type { Pipeline } from '$lib/taraskevizer';
import * as taraskevizer from '$lib/taraskevizer';

type UIElement<T = unknown> = {
	type: 'picker';
	title: string;
	options: readonly { label: string; value: T }[];
	getValue: () => T;
	setValue: (value: T) => void;
};

interface PluginValue {
	name: string;
	description: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	ui: UIElement<any>[];
	updateCurrentPipeline: (pipeline: Pipeline) => Pipeline;
}

interface PluginUI {
	picker: <T>(
		title: string,
		options: readonly { label: string; value: T }[],
		defaultValue: T
	) => UIElement<T>;
}

export type Plugin = (
	taraskevizer: typeof import('$lib/taraskevizer'),
	ui: PluginUI
) => PluginValue;

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

export const registerPlugin = (plugin: Plugin) => {
	const val = plugin(taraskevizer, ui);

	plugins.update((plugins) => {
		plugins.push(val);
		return plugins;
	});

	return () => {
		plugins.update((plugins) => {
			const index = plugins.indexOf(val);
			if (index !== -1) {
				plugins.splice(index, 1);
			}
			return plugins;
		});
	};
};
