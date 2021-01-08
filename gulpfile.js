"use strict";

//base variables
var projectName = __dirname.substring(__dirname.lastIndexOf("\\") + 1);;
var outputDir = './app/';


// Load plugins
const gulp = require("gulp");
const data = require('gulp-data');
const autoprefixer = require("autoprefixer");
const sass = require("gulp-sass");
const cssnano = require("cssnano");
const imagemin = require("gulp-imagemin");
const newer = require("gulp-newer");
const postcss = require("gulp-postcss");
const rename = require("gulp-rename");
/* const eslint = require("gulp-eslint"); */
const uglify = require('gulp-uglify');
const plumber = require("gulp-plumber");
const nunjucksRender = require('gulp-nunjucks-render');
const htmlreplace = require('gulp-html-replace');
const htmlclean = require('gulp-htmlclean');
const purgecss = require('@fullhuman/postcss-purgecss')
const del = require('del');
const browsersync = require("browser-sync").create();
const htmlValidator = require('gulp-w3c-html-validator');
const notify = require("gulp-notify");
// const webp = require('gulp-webp');
const sourcemaps = require('gulp-sourcemaps');
const browserify = require("browserify");
const source = require('vinyl-source-stream');
/* const watchify = require('watchify'); */
const buffer = require('vinyl-buffer')
const reload = browsersync.reload;


gulp.task('styles', done => {
    var plugins = [
        autoprefixer(),
    ];
    gulp.src('./src/assets/scss/**/*.scss')
        .pipe(newer(outputDir + 'assets/css/'))
        .pipe(plumber({
            errorHandler: notify.onError("Error: <%= error.message %>")
        }))
        .pipe(sass({
            "sourcemap=none": true,
            noCache: true,
            compass: true,
            outpitStyle: 'compressed',
            lineNumbers: false
        }))
        .pipe(postcss(plugins))
        .pipe(rename({
            basename: projectName,
            suffix: ".min"
        }))
        .pipe(gulp.dest(outputDir + 'assets/css/'))

    done();
});

gulp.task('styles_prod', done => {
    var plugins = [
        autoprefixer(),
        purgecss({
            content: ['./src/*.html', './src/templates/*.njk', './app/*.html', './src/*.js', './app/*.js'],
            fontFace: true,
            keyframes: true,
            variables: true,
            whitelistPatternsChildren: [/--active/, /--expanded/, /slick/, /control/, /backdrop/],
        }),
        cssnano({
            preset: ['default', {
                discardComments: {
                    removeAll: true,
                },
            }]
        }),
    ];
    gulp.src('./src/assets/scss/**/*.scss')
        .pipe(newer(outputDir + 'assets/css/'))
        .pipe(plumber({
            errorHandler: notify.onError("Error: <%= error.message %>")
        }))
        .pipe(sourcemaps.init())
        .pipe(sass({
            noCache: true,
            compass: true,
            outputStyle: 'compressed',
            lineNumbers: false,
        }))
        .pipe(postcss(plugins))
        .pipe(rename({
            basename: projectName,
            suffix: ".min"
        }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(outputDir + 'assets/css/'))
    done();
});

gulp.task('images', done => {
    gulp.src('./src/assets/img/**/*')
        .pipe(newer(outputDir + 'assets/img/'))
        .pipe(plumber({
            errorHandler: notify.onError("Error: <%= error.message %>")
        }))
        .pipe(imagemin([
            imagemin.gifsicle({
                interlaced: true
            }),
            imagemin.jpegtran({
                progressive: true
            }),
            imagemin.optipng({
                optimizationLevel: 5
            }),
            imagemin.svgo({
                plugins: [{
                    removeViewBox: false,
                    collapseGroups: true
                }]
            })
        ]))
        // .pipe(webp())
        .pipe(gulp.dest(outputDir + 'assets/img/'))
    done();
});

gulp.task('fonts', done => {
    gulp.src('./src/assets/fonts/*')
        .pipe(newer(outputDir + 'assets/fonts/'))
        .pipe(plumber({
            errorHandler: notify.onError("Error: <%= error.message %>")
        }))
        .pipe(gulp.dest(outputDir + 'assets/fonts/'))
    done();
});

gulp.task('scripts', function () {
    return browserify('./src/assets/js/index.js', {
            debug: true,
            shim: {
                jQuery: {
                    "jquery": "global:$"
                }
            }
        })
        .transform({global: true}, 'browserify-shim')
        .ignore('jquery')
        .bundle()
        .pipe(source('scripts.min.js'))
        .pipe(buffer())
        .pipe(plumber({
            errorHandler: notify.onError("Error: <%= error.message %>")
        }))
        .pipe(gulp.dest(outputDir + 'assets/js/'));
});

gulp.task('scripts_prod', function () {
    return browserify({
            entries: './src/assets/js/index.js',
            debug: true
        })
        .ignore('jquery')
        .bundle()
        .pipe(plumber({
            errorHandler: notify.onError("Error: <%= error.message %>")
        }))
        .pipe(source('scripts.min.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({
            loadMaps: true
        }))
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(outputDir + 'assets/js/'));
});

/* gulp.task('scripts_prod', done => {
    gulp.src('./src/assets/js/*.js')
        .pipe(newer(outputDir + 'assets/js/'))
        .pipe(plumber({
            errorHandler: notify.onError("Error: <%= error.message %>")
        }))
        .pipe(sourcemaps.init())
        .pipe(eslint({
            rules: {
                "camelcase": 1,
                "comma-dangle": 2,
                "quotes": 0
            },
            globals: [
                'jQuery',
                '$'
            ],
            envs: [
                'browser'
            ]
        }))
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError())
        .pipe(concat('scripts.min.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(outputDir + 'assets/js/'))
    done();
}); */


/* 


gulp.task('scripts', done => {
    gulp.src('./src/assets/js/*.js')
        .pipe(newer(outputDir + 'assets/js/'))
        .pipe(plumber({
            errorHandler: notify.onError("Error: <%= error.message %>")
        }))
        .pipe(eslint({
            rules: {
                "camelcase": 1,
                "comma-dangle": 2,
                "quotes": 0
            },
            globals: [
                'jQuery',
                '$'
            ],
            envs: [
                'browser'
            ]
        }))
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError())
        .pipe(concat('scripts.min.js'))
        .pipe(gulp.dest(outputDir + 'assets/js/'))
    done();
}); */

/* gulp.task('scripts_prod', done => {
    gulp.src('./src/assets/js/*.js')
        .pipe(newer(outputDir + 'assets/js/'))
        .pipe(plumber({
            errorHandler: notify.onError("Error: <%= error.message %>")
        }))
        .pipe(sourcemaps.init())
        .pipe(eslint({
            rules: {
                "camelcase": 1,
                "comma-dangle": 2,
                "quotes": 0
            },
            globals: [
                'jQuery',
                '$'
            ],
            envs: [
                'browser'
            ]
        }))
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError())
        .pipe(concat('scripts.min.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(outputDir + 'assets/js/'))
    done();
}); */

gulp.task('html', done => {
    gulp.src('./src/*.html')
        .pipe(plumber({
            errorHandler: notify.onError("Error: <%= error.message %>")
        }))
        .pipe(data(function () {
            return require('./src/data.json')
        }))
        .pipe(nunjucksRender({
            path: './src/templates'
        }))
        .pipe(htmlreplace({
            'css': 'assets/css/' + projectName + '.min.css',
            'js': 'assets/js/scripts.min.js',
            'slickjs': '//cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.9.0/slick.js',
            'slickcss': '//cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.9.0/slick.min.css',
        }))
        /* .pipe(htmlclean()) */
        .pipe(gulp.dest(outputDir))
    done();
});

gulp.task('validateHtml', done => {
    gulp.src('./app/*.html')
        .pipe(plumber({
            errorHandler: notify.onError("Error: <%= error.message %>")
        }))
        .pipe(htmlValidator())
    done();
});


gulp.task('clean', function () {
    return del([
        outputDir + '/**/*',
    ]);
});

gulp.task('browsersync', function () {
    browsersync.init({
        server: {
            baseDir: outputDir
        }
    });
});









gulp.task('watch', function () {
    gulp.watch('./src/assets/js/*.js', js).on("change", reload);
    gulp.watch('./src/assets/scss/**/*.scss', css).on("change", reload);
    gulp.watch('./src/*.html', html).on("change", reload);
    gulp.watch('./src/templates/*.njk', html).on("change", reload);
    gulp.watch('./src/assets/img/**/*', images).on("change", reload);
    gulp.watch('./src/assets/fonts/*', fonts).on("change", reload);
});

// define complex tasks
const js = gulp.series('scripts');
const css = gulp.series('styles');
const html = gulp.series('html');
const images = gulp.series('images');
const fonts = gulp.series('fonts');
const clean = gulp.series('clean');
const build = gulp.parallel('styles', 'fonts', 'images', 'scripts', 'html', 'validateHtml', 'browsersync', 'watch');
const production = gulp.series('clean', 'styles_prod', 'fonts', 'images', 'scripts_prod', 'html', 'validateHtml', 'browsersync', 'watch');

exports.default = build;
exports.prod = production;