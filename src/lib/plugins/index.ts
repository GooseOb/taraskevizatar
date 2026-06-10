import { writable } from 'svelte/store';
import type { AsyncPipeline, Pipeline } from 'taraskevizer/dist/lib';
import { status } from '../store/status';

export interface PickerUI<T = unknown> {
	type: 'picker';
	title: string;
	key: string;
	options: readonly { label: string; value: T }[];
	getValue: () => T;
	setValue: (value: T) => void;
	remove: () => void;
}

export interface TextInputUI {
	type: 'textinput';
	title: string;
	key: string;
	getValue: () => string;
	setValue: (value: string) => void;
	remove: () => void;
}

export interface TextareaUI {
	type: 'textarea';
	title: string;
	key: string;
	getValue: () => string;
	setValue: (value: string) => void;
	remove: () => void;
}

export type UIElement = PickerUI<any> | TextInputUI | TextareaUI;

export interface PipelineAddition {
	name: string;
	value: Pipeline | AsyncPipeline;
	inputTitle?: string;
	outputTitle?: string;
}

export interface PluginDefinition {
	name: string;
	compat?: { min?: number[]; max?: number[] };
	description: string;
	pipelines?: PipelineAddition[];
	updateCurrentPipeline?: (pipeline: Pipeline) => Pipeline | AsyncPipeline;
	unload?: () => void;
}

export interface PluginValue extends PluginDefinition {
	getUI: () => readonly UIElement[];
}

export interface PluginUI {
	picker: <T>(
		title: string,
		options: readonly { label: string; value: T }[],
		defaultValue: T
	) => PickerUI<T>;
	textinput: (title: string, defaultValue?: string) => TextInputUI;
	textarea: (title: string, defaultValue?: string) => TextareaUI;
	remove: (element: UIElement) => void;
	setStatus: (message: string) => void;
}

export type Plugin = (
	taraskevizer: typeof import('taraskevizer'),
	ui: PluginUI
) => PluginDefinition;

const taraskevizer = await import('taraskevizer');

const ids: number[] = [];
export const plugins = writable<PluginValue[]>([]);

const createUI = () => {
	let elements: UIElement[] = [];

	const sync = () => {
		plugins.update((p) => p);
	};

	const remove = (element: UIElement) => {
		const len = elements.length;
		elements = elements.filter((e) => e !== element);
		if (elements.length !== len) {
			sync();
		}
	};

	return {
		picker: <T>(
			title: string,
			options: readonly { label: string; value: T }[],
			defaultValue: T
		): PickerUI<T> => {
			let value = defaultValue;
			const el: PickerUI<T> = {
				type: 'picker',
				title,
				key: `picker:${title}`,
				options,
				getValue: () => value,
				setValue: (v: T) => {
					value = v;
					sync();
				},
				remove: () => remove(el),
			};
			elements.push(el);
			return el;
		},
		textinput: (title: string, defaultValue = ''): TextInputUI => {
			let value = defaultValue;
			const el: TextInputUI = {
				type: 'textinput',
				title,
				key: `textinput:${title}`,
				getValue: () => value,
				setValue: (v) => {
					value = v;
					sync();
				},
				remove: () => remove(el),
			};
			elements.push(el);
			return el;
		},
		textarea: (title: string, defaultValue = ''): TextareaUI => {
			let value = defaultValue;
			const el: TextareaUI = {
				type: 'textarea',
				title,
				key: `textarea:${title}`,
				getValue: () => value,
				setValue: (v) => {
					value = v;
					sync();
				},
				remove: () => remove(el),
			};
			elements.push(el);
			return el;
		},
		remove,
		setStatus: (message: string) => {
			status.set(message);
		},
		getUI: () => elements,
	};
};

const taraskVersion = taraskevizer.version.split('.').map(Number);

export const registerPlugin = (id: number, plugin: Plugin): PluginValue | null => {
	const ui = createUI();
	const val = plugin(taraskevizer, ui);

	if (!val.name || !val.description) {
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

	const originalUnload = val.unload;
	const pluginValue: PluginValue = Object.assign(val, {
		getUI: ui.getUI,
	});

	pluginValue.unload = () => {
		originalUnload?.();
		plugins.update((plugins) => {
			const index = plugins.indexOf(pluginValue);
			if (index !== -1) {
				plugins.splice(index, 1);
				ids.splice(index, 1);
				return plugins;
			}
			return plugins;
		});
	};

	plugins.update((plugins) => {
		const i = ids.indexOf(id);
		if (i === -1) {
			ids.push(id);
			plugins.push(pluginValue);
		} else {
			plugins[i] = pluginValue;
		}
		return plugins;
	});

	return pluginValue;
};
