import { dictRegex, resolveLoader, tsRegex } from './default.js';

export const addDictLoaders = (rules, loaderNames) => {
	rules.find((obj) => obj.test === tsRegex).exclude = dictRegex;

	const use = loaderNames.map(resolveLoader);
	use.push('ts-loader');

	rules.push({ test: dictRegex, use });
};
