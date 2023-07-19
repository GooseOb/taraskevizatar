const { readFileSync } = require('fs');
const path = require('path');

module.exports = (source) =>
	source.replace(
		/import (\S+) from ['"](\S+\.json)['"]/,
		($0, $1, $2) =>
			`const ${$1} = ${readFileSync(
				path.resolve(paths.context, 'scripts', 'serviceWorker', $2)
			)}`
	);
