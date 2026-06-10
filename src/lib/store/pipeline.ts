import { plugins } from '$lib/plugins';
import { derived, type Readable } from 'svelte/store';
import type { Pipeline } from 'taraskevizer/dist/lib';
import { currentPipeline } from './pipelines';

export const pipeline: Readable<Pipeline> = derived(
	[plugins, currentPipeline],
	([$plugins, $currentPipeline]) =>
		$plugins.reduce(
			(acc, p) => (p.updateCurrentPipeline ? (p.updateCurrentPipeline(acc) as Pipeline) : acc),
			$currentPipeline
		)
);
