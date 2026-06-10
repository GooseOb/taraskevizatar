import { derived, writable } from 'svelte/store';
import { pipelines } from 'taraskevizer';
import type { AsyncPipeline, Pipeline } from 'taraskevizer/dist/lib';
import { taraskConfig } from './config';
import { getAlphabetLabel } from '$lib/alphabets';
import { plugins } from '$lib/plugins';

interface PipelineValue {
	label: string;
	value: Pipeline | AsyncPipeline;
	inputTitle: string;
	outputTitle: string;
}

export const pipelinesList = derived([plugins, taraskConfig], ([$plugins, { abc }]) => {
	const list: PipelineValue[] = [
		{
			label: 'Тарашкевізацыя',
			value: pipelines.tarask,
			inputTitle: 'Афіцыйны',
			outputTitle: 'Клясычны',
		},
		{
			label: 'Толькі альфабэт',
			value: pipelines.alphabetic,
			inputTitle: 'Кірылічны',
			outputTitle: getAlphabetLabel(abc),
		},
	];

	for (const plugin of $plugins) {
		if (plugin.pipelines) {
			for (const { name, value, inputTitle = name, outputTitle = name } of plugin.pipelines) {
				list.push({
					label: name,
					value,
					inputTitle,
					outputTitle,
				});
			}
		}
	}

	return list;
});

export const currentPipeline = writable<Pipeline>(pipelines.tarask);

pipelinesList.subscribe(($list) => {
	currentPipeline.update(($pipe) =>
		$list.some((item) => item.value === $pipe) ? $pipe : pipelines.tarask
	);
});

export const currentPipelineItem = derived(
	[pipelinesList, currentPipeline],
	([$pipelinesList, $currentPipeline]) =>
		$pipelinesList.find((item) => item.value === $currentPipeline)!
);
