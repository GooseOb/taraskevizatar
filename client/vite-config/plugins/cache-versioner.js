import { readFile } from 'node:fs/promises';
import path from 'path';

const FILE_REGEX = /serviceWorker.sw\.ts$/;

export default function (pkgVersion) {
	return {
		name: 'cache-versioner',
		async transform(src, id) {
			const [json, versions] = await Promise.all(
				['cachePaths', 'cacheVersions'].map((name) =>
					readFile(
						path.resolve(`src/serviceWorker/${name}.json`),
						'utf-8'
					).then(JSON.parse)
				)
			);

			const newJson = {
				[`js-v${versions.js}+${pkgVersion}`]: json.js,
			};
			delete json.js;

			for (const key in json) newJson[key + '-v' + versions[key]] = json[key];
			if (FILE_REGEX.test(id))
				return {
					code: src.replace(
						/import (cachePaths) from ['"]\.\/cachePaths.json['"]/,
						($0, $1) => `const ${$1} = ${JSON.stringify(newJson)}`
					),
				};
		},
	};
}
