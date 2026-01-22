/**@type {import('.').Plugin} */
export default (taraskevizer, ui) => {
	/**@param {string} s */
	const defaultValue = (s) => s;

	const casePicker = ui.picker(
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
						return casePicker.getValue()(text);
					})
				)
			),
	};
};
