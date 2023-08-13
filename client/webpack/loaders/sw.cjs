const path = require('path');
const paths = require('../paths.cjs');
const versions = require('../../scripts/serviceWorker/cacheVersions.json');

const logAndContinue = (arg) => {
	console.log(arg);
	return arg;
};

module.exports = (source) =>
	source.replace(/import (\S+) from ['"](\S+\.json)['"]/, ($0, $1, $2) => {
		const json = require(path.resolve(
			paths.context,
			'scripts',
			'serviceWorker',
			$2
		));
		const newJson = {};
		for (const key in json) {
			let newKey = key + '-v' + versions[key];
			if (key === 'js')
				newKey +=
					'+' +
					require('../../../node_modules/taraskevizer/package.json').version;
			newJson[newKey] = json[key];
		}
		return `const ${$1} = ${JSON.stringify(newJson)}`;
	});
