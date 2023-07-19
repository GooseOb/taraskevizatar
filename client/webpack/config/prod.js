import cfg, { finalize } from './default.js';
import webpack from 'webpack';
import path from 'path';
import RemovePlugin from 'remove-files-webpack-plugin';
import { addDictLoaders } from './utils.js';

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

addDictLoaders(cfg.module.rules, ['jsonGenerator', 'buildTimeFunctions']);

export default finalize({
	mode: 'production',
});
