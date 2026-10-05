import { BUILD_INFO } from './buildInfo';

const list = [
	'<tarL class="demo">Гэтыя часьціны</tarL> можна зьмяняць, націскаючы на іх',
	BUILD_INFO,
] as const;

let i = 0;

export const getNextPrompt = (): string => {
	const result = list[i];
	i = (i + 1) % list.length;
	return result;
};
