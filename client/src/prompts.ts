const list = [
	'<tarL class="demo">Гэтыя часьціны</tarL> можна зьмяняць, націскаючы на іх',
	`Апошняе абнаўленьне: ${new Date(
		__BUILD_TIME__
	).toLocaleString()}. Вэрсія тарашкевізатара: ${__VERSION__}`,
] as const;

let i = 0;

export const getNextPrompt = (): string => {
	const result = list[i];
	i = (i + 1) % list.length;
	return result;
};
