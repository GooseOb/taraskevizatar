import cfg, { finalize } from './default.js';
import webpack from 'webpack';
import path from 'path';
import RemovePlugin from 'remove-files-webpack-plugin';
import paths from '../paths.cjs';

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

export default finalize({
	mode: 'production',
});
