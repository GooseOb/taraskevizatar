import path from 'path';
import dotenv from 'dotenv';
import { readFile } from 'fs/promises';
import paths from '../paths.cjs';

export const resolveLoader = (name) =>
	path.resolve(paths.context, 'webpack', 'loaders', name + '.cjs');

export const styleCacheGroups = (groups) =>
	groups.reduce(
		(acc, name) =>
			Object.assign(acc, {
				[name]: {
					name,
					test: RegExp(name + '\\.sass'),
					chunks: 'all',
					enforce: true,
				},
			}),
		{}
	);

export const getAliasFromTsConfig = (tsCfg) => {
	const tsPaths = tsCfg.compilerOptions.paths;
	const alias = {};
	for (const key in tsPaths)
		alias[key] = path.resolve(paths.context, tsPaths[key][0]);
	return alias;
};

export const getDotEnv = () => {
	const dotEnv = dotenv.config({
		path: path.resolve(paths.root, '.env'),
	}).parsed;
	const definedEnv = {};
	for (const key in dotEnv)
		definedEnv['process.env.' + key] = `'${dotEnv[key]}'`;
	return definedEnv;
};

export const getDefaultText = () => readFile('default-text.txt', 'utf-8');

export const getClientApiPath = () =>
	path.resolve(paths.context, 'scripts', 'api.ts');
