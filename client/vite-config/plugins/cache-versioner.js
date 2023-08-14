import { readFile } from 'node:fs/promises';
import path from 'path';

const fileRegex = /serviceWorker.sw\.ts$/;
const getJson = (filePath) =>
	readFile(path.resolve(filePath), 'utf-8').then(JSON.parse);
const getSWJson = (name) => getJson(`src/serviceWorker/${name}.json`);

export default function () {
	return {
		name: 'cache-versioner',
		async transform(src, id) {
			const { version: pkgVersion } = await getJson(
				'./node_modules/taraskevizer/package.json'
			);
			const json = await getSWJson('cachePaths');
			const versions = await getSWJson('cacheVersions');

			const newJson = {
				[`js-v${versions.js}+${pkgVersion}`]: json.js,
			};
			delete json.js;

			for (const key in json) newJson[key + '-v' + versions[key]] = json[key];
			if (fileRegex.test(id))
				return {
					code: src.replace(
						/import (cachePaths) from ['"]\.\/cachePaths.json['"]/,
						($0, $1) => `const ${$1} = ${JSON.stringify(newJson)}`
					),
				};
		},
	};
}
