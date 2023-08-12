import { execSync } from 'node:child_process';
import updateCache from './scripts/serviceWorker/updater.js';

const log = (...msgs) => console.log('[deploy]', ...msgs);

const buildProject = () => {
	log('project compilation start');
	execSync('npm run build');
	log("project's been compiled");
};

buildProject();

await updateCache();
