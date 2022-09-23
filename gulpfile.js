const gulp = require('gulp');
const del = require('del');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const replace = require('gulp-replace');
const hash = require('gulp-hash-filename');
const minCSS = require('gulp-clean-css');
const minSVG = require('gulp-svgmin');
const minHTML = require('gulp-htmlmin');
const {readdirSync} = require('fs');
const sass = require('gulp-sass')(require('sass'));

const isDev = process.argv.includes('--dev');
const isProd = !isDev;

const getPathes = (src, dest = '') => ({
	src: 'src/' + src,
	dest: 'docs/' + dest
});

const pathes = {
	html: getPathes('index.html'),
	logo: getPathes('logo.png'),
	og: getPathes('og.jpg'),
	styles: getPathes('styles/*.sass', 'styles'),
	fonts: getPathes('fonts/**/*', 'fonts'),
	icons: getPathes('icons/**/*.svg', 'icons'),
	scripts: {
		src: ['srcs', 'tarask', 'script'].map(file => `src/js/${file}.js`),
		dest: 'docs'
	},
};

const hashParams = {format: '{name}.{hash}{ext}'};

const src = fileType => gulp.src(pathes[fileType].src);
const dest = fileType => gulp.dest(pathes[fileType].dest);

const clean = () => del(['docs']);

const getDestFileNames = (type, regExp) => {
	return readdirSync(pathes[type].dest)
		.filter(name => regExp.test(name));
};

const SCRIPTS = 'scripts';
const STYLES = 'styles';
const HTML = 'html';

const html = () => src(HTML)
	.pipe(replace(/<styles>/g, () => {
		const fileNames = getDestFileNames(STYLES, /\.css$/);
		const [main] = fileNames.filter(name => /^style/.test(name));
		const [dark] = fileNames.filter(name => /^dark/.test(name));
		const mainStyle = `<link rel='stylesheet' href='./styles/${main}'>`;
		const darkStyle = `<link rel='stylesheet' href='./styles/${dark}' id='dark-css' media='(prefers-color-scheme: dark)'>`;
		return mainStyle + darkStyle;
	}))
	.pipe(replace(/<scripts>/g, () => {
		const [fileName] = getDestFileNames(SCRIPTS, /\.js$/);
		return `<script defer src='./${fileName}'></script>`;
	}))
	.pipe(minHTML({
		collapseWhitespace: true,
		removeComments: true
	}))
	.pipe(dest(HTML));

const scripts = () => {
	const $ = src(SCRIPTS)
		.pipe(concat('script.js'));
	if (isProd) $
		.pipe(uglify())
		.pipe(replace(/^/, '(()=>{'))
		.pipe(replace(/$/, '})()'))
		.pipe(hash(hashParams));
	return $.pipe(dest(SCRIPTS));
};

const styles = () => {
	const $ = src(STYLES)
		.pipe(sass());
	if (isProd) $
		.pipe(minCSS())
		.pipe(hash(hashParams));
	return $.pipe(dest(STYLES));
};

const icons = () => {
	const $ = src('icons');
	if (isProd) $
		.pipe(minSVG({
			collapseWhitespace: true
		}));
	return $.pipe(dest('icons'));
}

const getFileMover = type => () => src(type).pipe(dest(type));

const fonts = getFileMover('fonts');
const og = getFileMover('og');
const logo = getFileMover('logo');

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
		gulp.watch(pathes[item].src, update[item]);
	});
};

const build = gulp.series(
	clean,
	gulp.parallel(styles, scripts, fonts, icons, og, logo),
	html
);

module.exports = {
	default: build,
	build,
	watch,
	clean,
	icons,
	...update
};