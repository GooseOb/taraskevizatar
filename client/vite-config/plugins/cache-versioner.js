import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'path';

export default (pkgVersion) => ({
	name: 'cache-versioner',
	setup(build) {
		build.onStart(async () => {
			const swDir = join(process.cwd(), 'src', 'service-worker');

			const [paths, versions] = await Promise.all(
				['cache-paths', 'cache-versions'].map((name) =>
					readFile(join(swDir, name + '.json'), 'utf-8').then(JSON.parse)
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
