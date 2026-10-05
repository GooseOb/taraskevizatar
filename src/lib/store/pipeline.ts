import { plugins } from '$lib/plugins';
import { derived, type Readable } from 'svelte/store';
import { tarask, type Pipeline } from '$lib/taraskevizer';

export const pipeline: Readable<Pipeline> = derived(plugins, ($plugins) =>
	$plugins.reduce((acc, { updateCurrentPipeline }) => updateCurrentPipeline(acc), tarask)
);
