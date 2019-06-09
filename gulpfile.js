// Initialize modules
// Importing specific gulp API functions lets us write them below as series() instead of gulp.series()
const { src, dest, watch, parallel, series } = require('gulp');

// Importing all the Gulp-related packages we want to use
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const imagemin = require('gulp-imagemin');
const browsersync = require('browser-sync').create();

// File paths
const files = {
    scssPath: 'src/scss/**/*.scss',
    cssPath: 'assets/css',
    imgPath: 'src/img/**/*',
    imgMinPath: 'assets/img',
    htmlPath: './*.html',
    jsPath: 'src/js/**/*.js'
}

// Sass task: compiles the style.scss file into style.css
// sass default task
function sassDefault (){
    return src(files.scssPath)
        .pipe(sourcemaps.init()) // initialize sourcemaps first
        .pipe(sass().on('error', sass.logError)) // compile SCSS to CSS
        // .pipe(postcss([ autoprefixer(), cssnano() ])) // PostCSS plugins
        .pipe(sourcemaps.write('.')) // write sourcemaps file in current directory
        .pipe(dest(files.cssPath)
    ); // put final CSS in dist folder
}

// sass deploy task
function sassDeploy (){
    return src(files.scssPath)
        .pipe(sass().on('error', sass.logError)) // compile SCSS to CSS
        .pipe(postcss([ autoprefixer(), cssnano() ])) // PostCSS plugins
        .pipe(dest(files.cssPath)
    ); // put final CSS in dist folder
}

// Init BrowserSync
function bsInit() {
    browsersync.init({
        server: {
            baseDir: './'
        },
    });
};

// BrowserSync Reload
function bsReload(done) {
    browsersync.reload();
    done(); // need a callback
}

// Minify images
function imgMinify() {
    return src(files.imgPath)
        .pipe(imagemin({ verbose: true }))
        .pipe(dest(files.imgMinPath))
};

function watchFiles() {
    watch(files.scssPath, series(sassDefault, bsReload)); // sass
    watch(files.imgPath, series(imgMinify, bsReload)); // img
    watch(files.htmlPath, series(bsReload)); // html
}

// exports.build = build;
//exports.default = series(imgMinify, sassDeploy);

exports.watch = parallel(bsInit, watchFiles);