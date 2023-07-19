const { resolve } = require('path');

const paths = module.exports = {
	root: resolve('..'),
};
paths.context = resolve(paths.root, 'client');
paths.output = resolve(paths.context, 'build');