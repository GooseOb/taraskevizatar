import path from 'path';
import readline from 'readline';
import { writeFile } from 'fs/promises';
import { fileURLToPath as utp } from 'url';
import cachePaths from './cachePaths.json' assert { type: 'json' };
import { simpleGit } from 'simple-git';

const PATH_SW = path.dirname(utp(import.meta.url));
const PATH_ROOT = path.resolve(PATH_SW, '..', '..', '..');
const PATH_BUILD = path.resolve(PATH_ROOT, 'client', 'build');
const PATH_FILE = path.resolve(PATH_SW, 'cachePaths.json');
const ALL_UNCOMMITTED_ID = 'x';

const git = simpleGit({
	baseDir: PATH_ROOT,
});

const notEmpty = (arr) => {
	for (const el of arr) if (el) return true;
	return false;
};
const notUpdated = (...msgs) => {
	console.log(...msgs);
	return false;
};

export default async () => {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});
	const question = (query) =>
		new Promise((res) => {
			rl.question(query, (answer) => {
				res(answer.trim());
			});
		});

	const doUpdate = /[Yy]/.test(
		await question('Update service worker cache? (y/n): ')
	);
	if (!doUpdate) {
		rl.close();
		return notUpdated('No cache updated');
	}

	const diffFile = (filePath) =>
		git.diff(['--no-index', path.resolve(PATH_BUILD, filePath), filePath]);

	const updateSuggestions = [];

	const toCheck = {
		js: ['index.js'],
		css: ['styles'],
		html: ['index.html'],
		static: ['fonts', 'icons'],
		pwa: ['manifest.json', 'logo'],
	};

	await git.stash();
	await git.checkout('gh-pages');
	await git.pull();
	const safecrlfValue = (await git.getConfig('core.safecrlf')).value;
	await git.addConfig('core.safecrlf', 'false');

	try {
		for (const key in toCheck) {
			const changes = await Promise.all(toCheck[key].map(diffFile));
			if (notEmpty(changes)) updateSuggestions.push(key);
		}
	} catch (e) {
		console.error(e);
	}

	await git.addConfig('core.safecrlf', safecrlfValue);
	await git.checkout('main');
	await git.stash(['apply']);

	const cacheNames = Object.keys(cachePaths);
	const gitDiffCacheNames = cacheNames.filter((name) =>
		updateSuggestions.includes(name)
	);
	const getSuggestion = (name) =>
		gitDiffCacheNames.includes(name) ? '<- uncommitted changes' : '';
	let options = cacheNames.map(
		(name, i) => `${i}. ${name} ${getSuggestion(name)}`
	);
	if (gitDiffCacheNames.length)
		options.push(ALL_UNCOMMITTED_ID + '. all uncommitted');
	const optionIdsToUpdate = (
		await question(
			`Choose caches to update (any separator)\n${options.join('\n')}\n> `
		)
	).match(new RegExp(`${ALL_UNCOMMITTED_ID}|\\d+`, 'g'));
	rl.close();
	if (!optionIdsToUpdate) return notUpdated('No option chosen');
	const cacheNamesToUpdate = optionIdsToUpdate.includes(ALL_UNCOMMITTED_ID)
		? gitDiffCacheNames
		: [];
	for (const cacheName of optionIdsToUpdate.map((id) => cacheNames[id]))
		if (cacheName && !cacheNamesToUpdate.includes(cacheName))
			cacheNamesToUpdate.push(cacheName);
	if (!cacheNamesToUpdate.length) notUpdated('Nothing to update');
	for (const cacheName of cacheNamesToUpdate) {
		const cache = cachePaths[cacheName];
		cache.v = String(+cache.v + 1);
	}
	await writeFile(PATH_FILE, JSON.stringify(cachePaths, null, 2));
	console.log('Updated successfully: ' + cacheNamesToUpdate.join(', '));
	return true;
};
