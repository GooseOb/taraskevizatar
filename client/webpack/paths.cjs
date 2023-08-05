const { resolve } = require('path');

const paths = {};
paths.root = resolve('..');
paths.context = resolve(paths.root, 'client');
paths.output = resolve(paths.context, 'build');

module.exports = paths;
