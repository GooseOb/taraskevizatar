import { delay } from '$lib/utils/delay';
import type { Plugin } from '.';

export const examplePlugin: Plugin = (_taraskevizer, ui) => {
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
		ui: [casePicker],
		updateCurrentPipeline: (pipeline) => async (text, config) => {
			const converted = await pipeline(text, config);
			// Simulate an asynchronous operation
			await delay(1000);
			return casePicker.getValue()(converted);
		},
	};
};
