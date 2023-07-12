import { execSync } from 'node:child_process';
import updateCache from './scripts/serviceWorker/updater.js';
import ghpages from 'gh-pages';

const log = (...msgs) => console.log('[deploy]', ...msgs);

const publish = () =>
	ghpages.publish('build', {}, (err) => {
		if (err) log(err);
	}).then(() => {
		log('published');
	});

if (process.argv.includes('--publishonly')) {
	await publish();
	process.exit(0);
}

const buildProject = () => {
	log('project compilation start');
	execSync('npm run build');
	log('project\'s been compiled');
};

buildProject();

const isCacheUpdated = await updateCache();

if (isCacheUpdated) buildProject();

publish();