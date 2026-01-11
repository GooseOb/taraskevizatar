import { delay } from '$lib/utils/delay';
import type { Plugin } from '.';

export const examplePlugin: Plugin = (taraskevizer, ui) => {
	const defaultValue = (s: string) => s;

	const casePicker = ui.picker(
		'Case',
		[
			{ label: 'No Change', value: defaultValue },
			{ label: 'Uppercase', value: (s: string) => s.toUpperCase() },
			{ label: 'Lowercase', value: (s: string) => s.toLowerCase() },
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
