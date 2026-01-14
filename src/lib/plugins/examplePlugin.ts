import { delay } from '$lib/utils/delay';
import type { Plugin } from '.';

type StrFn = (s: string) => string;

export const examplePlugin: Plugin = (taraskevizer, ui) => {
	const defaultValue: StrFn = (s) => s;

	const casePicker = ui.picker<StrFn>(
		'Case',
		[
			{ label: 'No Change', value: defaultValue },
			{ label: 'Uppercase', value: (s) => s.toUpperCase() },
			{ label: 'Lowercase', value: (s) => s.toLowerCase() },
		],
		defaultValue
	);

	return {
		name: 'change-case-plugin',
		description: 'A plugin to change text case asynchronously.',
		compat: { min: [10, 4, 0], max: [10] },
		ui: [casePicker],
		updateCurrentPipeline: (pipeline) =>
			taraskevizer.lib.asyncPipe(
				pipeline.steps.concat(
					taraskevizer.lib.mutatingAsyncStep(async ({ text }) => {
						// Simulate an asynchronous operation
						await delay(1000);
						return casePicker.getValue()(text);
					})
				)
			),
	};
};
