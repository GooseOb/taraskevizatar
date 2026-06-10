/** @type {import('.').Plugin} */
export default (taraskevizer, ui) => {
	const mode = ui.picker(
		'Рэжым',
		[
			{ label: 'Выключыць', value: 'off' },
			{ label: 'Дадаць суфікс', value: 'suffix' },
			{ label: 'Замяніць словы', value: 'replace' },
		],
		'off'
	);

	const suffixText = ui.textinput('Суфікс', ' ★');
	const customDict = ui.textarea('Дадатковы слоўнік', 'Беларусь|арбуз\nМінск');

	return {
		name: 'Комплексны',
		description:
			'Комплексны плагін, які дэманструе ўсе магчымасьці API.\n\nДадае:\n• Рэжымы працы\n• Тэкставы ўвод\n• Шматзначны ўвод\n• Модыфікацыю існага пайплайна\n• Новы пайплайн',
		compat: { min: [10] },
		updateCurrentPipeline: (pipeline) => {
			const currentMode = mode.getValue();

			if (currentMode === 'off') {
				return pipeline;
			}

			return taraskevizer.lib.asyncPipe(
				pipeline.steps.concat(
					taraskevizer.lib.mutatingAsyncStep(async ({ text }) => {
						let result = text;

						if (currentMode === 'suffix') {
							result += suffixText.getValue();
						} else if (currentMode === 'replace') {
							const dict = customDict
								.getValue()
								.split('\n')
								.filter(Boolean)
								.map((line) => line.split('|'));
							for (const [from, to] of dict) {
								if (from && to) {
									result = result.split(from).join(to);
								}
							}
						}

						return result;
					})
				)
			);
		},
		pipelines: [
			{
				name: 'З дадатковым слоўнікам',
				value: taraskevizer.lib.asyncPipe([
					...taraskevizer.pipelines.tarask.steps,
					taraskevizer.lib.mutatingAsyncStep(async ({ text }) => {
						const dict = customDict
							.getValue()
							.split('\n')
							.filter(Boolean)
							.map((line) => line.split('|'));
						let result = text;
						for (const [from, to] of dict) {
							if (from && to) {
								result = result.split(from).join(to);
							}
						}
						return result;
					}),
				]),
				inputTitle: 'Звычайны',
				outputTitle: 'Са слоўнікам',
			},
		],
	};
};
