const gulp = require('gulp');
const del = require('del');
const rename = require('gulp-rename');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const replace = require('gulp-replace');
const hash = require('gulp-hash-filename');
const minCSS = require('gulp-clean-css');
const minSVG = require('gulp-svgmin');
const minHTML = require('gulp-htmlmin');
const {readdirSync} = require('fs');

const getPathes = (src, dest = '') => ({
	src: 'src/' + src,
	dest: 'docs/' + dest
});

const pathes = {
	html: getPathes('index.html'),
	og: getPathes('og.jpg'),
	styles: getPathes('styles/*.css', 'styles'),
	fonts: getPathes('fonts/**/*', 'fonts'),
	icons: getPathes('icons/**/*.svg', 'icons'),
	scripts: {
		src: ['srcs', 'tarask', 'script'].map(file => `src/js/${file}.js`),
		dest: 'docs'
	},
};

const hashParams = {format: '{name}.{hash}{ext}'};

const inDest = type => readdirSync(pathes[type].dest);
const toFilesHash = file => {
	const [name, /*min*/, hash, ext] = file.split('.');
	filesHash[ext][name] = hash;
};
const filesHash = {
	css: {},
	js: {},
	save: done => done(
		inDest('styles')
			.forEach(toFilesHash),
		inDest('scripts')
			.filter(fileName => /.js$/.test(fileName))
			.forEach(toFilesHash)
	)
};

const clean = () => del(['docs']);

const src = fileType => gulp.src(pathes[fileType].src);
const dest = fileType => gulp.dest(pathes[fileType].dest);

const hashNamesCSS = (_, a) => a + '.min.' + filesHash.css[a] + '.css';

const html = () => src('html')
	.pipe(replace(/(\w+)\.css/g, hashNamesCSS))
	.pipe(replace(/<script.*\/script>/g, '<script>'))
	.pipe(replace(/<script>/, () => `<script defer src='./script.min.${filesHash.js.script}.js'></script>`))
	.pipe(replace(/<script>/g, ''))
	.pipe(minHTML({
		collapseWhitespace: true,
		removeComments: true
	}))
	.pipe(dest('html'));

const scripts = () => src('scripts')
	.pipe(replace(/(\w+)\.css/g, hashNamesCSS))
	.pipe(uglify())
	.pipe(concat('script.min.js'))
	.pipe(replace(/^/, '(()=>{'))
	.pipe(replace(/$/, '})()'))
	.pipe(hash(hashParams))
	.pipe(dest('scripts'));

const styles = () => src('styles')
	.pipe(rename({suffix: '.min'}))
	.pipe(minCSS())
	.pipe(hash(hashParams))
	.pipe(dest('styles'));

const icons = () => src('icons')
	.pipe(minSVG({
		collapseWhitespace: true
	}))
	.pipe(dest('icons'));

const fonts = () => src('fonts')
	.pipe(dest('fonts'));

const og = () => src('og')
	.pipe(dest('og'));

const watch = () => {
	gulp.watch(pathes.html.src, html);
	gulp.watch(pathes.styles.src, styles);
	gulp.watch(pathes.scripts.src, scripts);
};

const build = gulp.series(
	clean,
	gulp.parallel(styles, scripts, fonts, icons, og),
	filesHash.save,
	html
);

const updateFiles = (ext, fn) => gulp.series(
	() => del(['docs/**/*.' + ext]),
	...(fn === html
		? [filesHash.save, fn]
		: [fn, filesHash.save, html]
	)
);
module.exports = {
	default: build,
	build,
	watch,
	clean,
	scripts: updateFiles('js', scripts),
	styles: updateFiles('css', styles),
	html: updateFiles('html', html)
};