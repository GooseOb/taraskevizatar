import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'path';

export default (pkgVersion) => ({
	name: 'cache-versioner',
	setup(build) {
		build.onStart(async () => {
			const swDir = join(build.initialOptions.entryPoints[0], '..');

			const [paths, versions] = await Promise.all(
				['cache-paths.json', 'cache-versions.json'].map((name) =>
					readFile(join(swDir, name), 'utf-8').then(JSON.parse)
				)
			);
			const newJson = {
				[`js-v${versions.js}+${pkgVersion}`]: paths.js,
			};
			delete paths.js;
			for (const key in paths) newJson[key + '-v' + versions[key]] = paths[key];

			await writeFile(
				join(swDir, 'cache-paths.bundle.json'),
				JSON.stringify(newJson)
			);
		});
	},
});
