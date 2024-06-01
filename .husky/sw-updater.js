import { join } from 'node:path';
import readline from 'node:readline/promises';
import { writeFile, readFile } from 'node:fs/promises';
import { simpleGit } from 'simple-git';

const PREFIX = '\x1b[35m[sw-updater]\x1b[0m ';
const print = (msg) => {
	process.stdout.write(PREFIX + msg + '\n');
};
const question = (query) =>
	rl.question(PREFIX + query).then((answer) => answer.trim());
const updateNothingAndExit = () => {
	print('Nothing updated');
	process.exit(0);
};

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

if (
	!/^[Yy]$/.test(await question('Update service worker cache version? (y/n): '))
)
	updateNothingAndExit();

const PATH_ROOT = process.cwd();
const PATH_FILE = join(
	PATH_ROOT,
	'client',
	'src',
	'service-worker',
	'cache-versions.json'
);
const ALL_SUGGESTED_ID = 'x';

const git = simpleGit({ baseDir: PATH_ROOT });

const diffResult = await git.diffSummary(['--name-only', 'HEAD', 'client']);
const changedFiles = diffResult.files.map((obj) =>
	obj.file.replace(/^client./, '')
);
const patterns = [
	['js', /^src.(?!service-worker.*)(?=\S+\.[jt]s$)/],
	['css', /^src.style\.sass$/],
	['html', /^index\.html$/],
	['static', /^public.(fonts|icons)'/],
	['pwa', /^public.(manifest\.json|logo)/],
];
const suggestions = {};
outer: for (const [cacheName, filePattern] of patterns)
	for (const fileName of changedFiles)
		if (filePattern.test(fileName)) {
			suggestions[cacheName] = fileName;
			continue outer;
		}

const answer = await question(
	patterns.reduce((acc, [cacheName], i) => {
		const firstMatch = suggestions[cacheName];
		const item = firstMatch
			? `${i}) \x1b[32m${cacheName}\x1b[0m (first match: \x1b[32m${firstMatch}\x1b[0m)`
			: i + ') ' + cacheName;
		return acc + item + '\n';
	}, 'What cache version to update? Any separator can be used\n') +
		ALL_SUGGESTED_ID +
		`) \x1b[32mall suggested\x1b[0m\n\n> `
);

const chosenOptionIds = answer.match(
	new RegExp(`${ALL_SUGGESTED_ID}|\\d+`, 'g')
);

if (!chosenOptionIds) updateNothingAndExit();

const cacheNamesToUpdate = chosenOptionIds.includes(ALL_SUGGESTED_ID)
	? Object.keys(suggestions)
	: [];

for (const id of chosenOptionIds)
	if (patterns[id] && !cacheNamesToUpdate.includes(patterns[id][0]))
		cacheNamesToUpdate.push(patterns[id][0]);

if (!cacheNamesToUpdate.length) updateNothingAndExit();

const versions = JSON.parse(await readFile(PATH_FILE, 'utf8'));

for (const name of cacheNamesToUpdate)
	versions[name] = (+versions[name] + 1).toString();

await writeFile(PATH_FILE, JSON.stringify(versions, null, '\t') + '\n');

print('Cache versions have been updated: ' + cacheNamesToUpdate.join(' '));
process.exit(0);
