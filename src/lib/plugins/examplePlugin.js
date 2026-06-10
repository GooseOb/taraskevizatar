/** @type {import('.').Plugin} */
export default (taraskevizer, ui) => {
	const casePicker = ui.picker(
		'Case',
		[
			{ label: 'No Change', value: 'none' },
			{ label: 'Uppercase', value: 'upper' },
			{ label: 'Lowercase', value: 'lower' },
		],
		'none'
	);

	ui.textinput('Prefix', '');
	ui.textinput('Suffix', '!');

	return {
		name: 'change-case-plugin',
		description: 'Changes text case and adds prefix/suffix.',
		compat: { min: [10, 4, 0], max: [10] },
		updateCurrentPipeline: (pipeline) =>
			taraskevizer.lib.asyncPipe(
				pipeline.steps.concat(
					taraskevizer.lib.mutatingAsyncStep(async ({ text }) => {
						let result = text;
						switch (casePicker.getValue()) {
							case 'upper':
								result = result.toUpperCase();
								break;
							case 'lower':
								result = result.toLowerCase();
								break;
						}
						return result;
					})
				)
			),
	};
};
