import { derived, writable } from 'svelte/store';
import { pipelines } from 'taraskevizer';
import type { Pipeline } from 'taraskevizer/dist/lib';
import { taraskConfig } from './config';
import { getAlphabetLabel } from '$lib/alphabets';

interface PipelineValue {
	label: string;
	value: Pipeline;
	inputTitle: string;
	outputTitle: string;
}

const taraskPipelineItem: PipelineValue = {
	label: 'Тарашкевізацыя',
	value: pipelines.tarask,
	inputTitle: 'Афіцыйны',
	outputTitle: 'Клясычны',
};

export const pipelinesList = writable<PipelineValue[]>([
	taraskPipelineItem,
	{
		label: 'Толькі альфабэт',
		value: pipelines.alphabetic,
		inputTitle: 'Кірылічны',
		// TODO
		outputTitle: 'Кірылічны',
	},
]);

taraskConfig.subscribe(({ abc }) => {
	pipelinesList.update((list) => {
		const abcPipeline = list.find((item) => item.value === pipelines.alphabetic);
		abcPipeline!.outputTitle = getAlphabetLabel(abc);
		return list;
	});
});

export const currentPipeline = writable<Pipeline>(pipelines.tarask);

export const currentPipelineItem = derived(
	[pipelinesList, currentPipeline],
	([$pipelinesList, $currentPipeline]) =>
		$pipelinesList.find((item) => item.value === $currentPipeline) || taraskPipelineItem
);
