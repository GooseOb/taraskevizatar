import { plugins } from '$lib/plugins';
import { derived, writable } from 'svelte/store';
import { pipelines } from 'taraskevizer';

export const pipeline = derived(plugins, ($plugins) =>
	$plugins.reduce((acc, { updateCurrentPipeline }) => updateCurrentPipeline(acc), pipelines.tarask)
);
