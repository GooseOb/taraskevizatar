/**@type {import('.').Plugin} */
export default (taraskevizer) => {
	const addStressStep = taraskevizer.lib.mutatingAsyncStep(({ text }) =>
		fetch('https://bnkorpus.info/other/rest/conv/naciski', {
			method: 'POST',
			headers: {
				'Content-Type': 'text/plain; charset=UTF-8',
			},
			body: text,
		}).then((res) => res.text())
	);

	return {
		name: 'Фанэтызатар',
		description: 'Плагін для фанэтызацыі тэксту.',
		compat: { min: [10] },
		pipelines: [
			{
				name: 'Фанэтычны',
				value: taraskevizer.lib.asyncPipe([
					addStressStep,
					...taraskevizer.pipelines.phonetic.steps,
				]),
			},
		],
	};
};
