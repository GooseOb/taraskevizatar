import cfg, { addDictLoaders, finalize } from './default.js';
import webpack from 'webpack';
import path from 'path';
import RemovePlugin from 'remove-files-webpack-plugin';
import paths from '../paths.cjs';
import { resolveLoader } from './utils.js';

cfg.plugins.push(
	new RemovePlugin({
		after: {
			include: [path.resolve(paths.output, 'style.js')],
		},
	}),
	new webpack.DefinePlugin({
		__SW_SCOPE__: '"/taraskevizatar/"',
	})
);

addDictLoaders(['jsonGenerator', 'buildTimeFunctions']);

cfg.module.rules.push({
	test: /(?<=^|\.)debug(?=\.|$)/,
	use: {
		loader: resolveLoader('force-crash'),
		options: {
			message: 'debug files should not be used in production build',
		},
	},
});

export default finalize({
	mode: 'production',
});
