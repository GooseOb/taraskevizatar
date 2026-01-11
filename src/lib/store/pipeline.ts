import { plugins } from '$lib/plugins';
import { derived, type Readable } from 'svelte/store';
import { pipelines } from 'taraskevizer';
import type { Pipeline } from 'taraskevizer/dist/lib';

export const pipeline: Readable<Pipeline> = derived(plugins, ($plugins) =>
	$plugins.reduce((acc, { updateCurrentPipeline }) => updateCurrentPipeline(acc), pipelines.tarask)
);
