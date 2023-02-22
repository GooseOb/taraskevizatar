const gulp = require('gulp');
const del = require('del');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const replace = require('gulp-replace');
const minCSS = require('gulp-clean-css');
const minSVG = require('gulp-svgmin');
const minHTML = require('gulp-htmlmin');
const {readdirSync, promises: {readFile, writeFile}} = require('fs');
const sass = require('gulp-sass')(require('sass'));

const isDev = process.argv.includes('--dev');
const isProd = !isDev;

const getPaths = (src, dest = '') => ({
	src: 'src/' + src,
	dest: 'docs/' + dest
});

const SCRIPTS = 'scripts';
const STYLES = 'styles';
const HTML = 'html';

const paths = {
	[HTML]: getPaths('index.html'),
	og: getPaths('og.jpg'),
	sw: getPaths('sw.js'),
	manifest: getPaths('manifest.json'),
	logo: getPaths('logo/**/*', 'logo'),
	[STYLES]: getPaths('styles/*.sass', 'styles'),
	fonts: getPaths('fonts/**/*', 'fonts'),
	icons: getPaths('icons/**/*.svg', 'icons'),
	[SCRIPTS]: {
		src: ['srcs', 'tarask', 'script'].map(file => `src/js/${file}.js`),
		dest: 'docs'
	},
	json: {
		src: 'src/js/srcs.js',
		dest: 'json'
	}
};

const src = fileType => gulp.src(paths[fileType].src);
const dest = fileType => gulp.dest(paths[fileType].dest);

const clean = () => del(['docs']);

const getDestFileNames = (type, regExp) =>
	readdirSync(paths[type].dest).filter(name => regExp.test(name));

const html = () => src(HTML)
	.pipe(replace('<styles/>', () => {
		const fileNames = getDestFileNames(STYLES, /\.css$/);
		const main = fileNames.find(name => /^style/.test(name));
		const dark = fileNames.find(name => /^dark/.test(name));
		const mainStyle = `<link rel='stylesheet' href='./styles/${main}'>`;
		const darkStyle = `<link rel='stylesheet' href='./styles/${dark}' id='dark-css' media='(prefers-color-scheme: dark)'>`;
		return mainStyle + darkStyle;
	}))
	.pipe(replace('<scripts/>', () => {
		const [fileName] = getDestFileNames(SCRIPTS, /\.js$/);
		return `<script defer src='./${fileName}'></script>`;
	}))
	.pipe(minHTML({
		collapseWhitespace: true,
		removeComments: true
	}))
	.pipe(dest(HTML));

const GULP_MACROS = {
	CURRENT_TIME: () => (new Date).toLocaleDateString('ru'),
	toOneLine(words) {
		if (typeof words === 'object') [words] = words;
		return '\'' + words
				.slice(1, words.length-1)
				.trim()
				.replace(/(?:[\n\r])+/g, '|')
			+ '\'';
	}
}

const scripts = () => {
	const $ = src(SCRIPTS)
		.pipe(concat('script.js'))
		.pipe(replace(/GULP_MACROS\.(\S+)`((?:.|\s)*?)`/g,
			($0, $1, $2) => GULP_MACROS[$1]($2)
		));
	if (isProd) $
		.pipe(uglify())
		.pipe(replace(/^/, '(()=>{'))
		.pipe(replace(/$/, '})()'))
	return $.pipe(dest(SCRIPTS));
};

const sw = () => {
	const $ = src('sw');
	if (isProd) $
		.pipe(uglify())
	return $.pipe(dest('sw'));
};

const styles = () => {
	const $ = src(STYLES)
		.pipe(sass());
	if (isProd) $
		.pipe(minCSS())
	return $.pipe(dest(STYLES));
};

const icons = () => {
	const $ = src('icons');
	if (isProd) $
		.pipe(minSVG({
			collapseWhitespace: true
		}));
	return $.pipe(dest('icons'));
};

const regexToStr = obj => {
	for (const key in obj) obj[key] = obj[key].source;
	return obj;
};
const json = () => readFile(paths.json.src, 'utf-8').then(data => {
	let wordlist, softers, gobj, latinLetters;
	eval(
		data.match(/\/\/ json-start([\S\s]+)\/\/ json-end/)[1]
	);
	return Promise.all([
		['wordlist', regexToStr(wordlist)],
		['softers', regexToStr(softers)],
		['latinLetters', latinLetters],
		['g', gobj]
	].map(([fileName, obj]) =>
		writeFile(`${paths.json.dest}/${fileName}.json`, JSON.stringify(obj))
	));
});

const getFileMover = type => {
	gulp.task(type, () => src(type).pipe(dest(type)));
	return gulp.task(type);
};

const fonts = getFileMover('fonts');
const og = getFileMover('og');
const logo = getFileMover('logo');
const manifest = getFileMover('manifest');

const updateFiles = (ext, fns) => gulp.series(
	() => del(['docs/**/*.' + ext]),
	...fns
);

const update = {
	[SCRIPTS]: updateFiles('js', [scripts, html]),
	[STYLES]: updateFiles('css', [styles, html]),
	[HTML]: updateFiles('html', [html]),
};

const watch = () => {
	[HTML, STYLES, SCRIPTS].forEach(item => {
		gulp.watch(paths[item].src, update[item]);
	});
};

const build = gulp.series(
	clean,
	gulp.parallel(styles, scripts, fonts, icons, og, logo, manifest, sw),
	gulp.parallel(html, json)
);

module.exports = {
	default: build,
	watch,
	clean,
	...update,
	json
};