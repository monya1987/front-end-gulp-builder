'use strict';

var gulp = require('gulp'),
    prefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    babel = require('gulp-babel'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    rigger = require('gulp-rigger'),
    cssmin = require('gulp-clean-css'),
    imagemin = require('gulp-imagemin'),
    rimraf = require('rimraf'),
    browserSync = require("browser-sync").create(),
    reload = browserSync.reload;

var path = {
    build: {
        html: 'build/',
        js: 'build/js/',
        css: 'build/css/',
        img: 'build/img/',
        fonts: 'build/fonts/'
    },
    src: {
        html: 'src/*.html',
        js: 'src/js/*.js',
        style: 'src/style/*.scss',
        img: 'src/img/**/*.*', 
        fonts: 'src/fonts/**/*.*'
    },
    watch: { 
        html: 'src/**/*.html',
        js: 'src/js/**/*.js',
        style: 'src/style/**/*.scss',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },
    clean: './build'
};

gulp.task('font-awesome', function () {
    gulp.src(['bower_components/font-awesome/scss/**/*'])
    .pipe(gulp.dest('src/style/font-awesome'));
    gulp.src(['bower_components/font-awesome/fonts/**/*'])
    .pipe(gulp.dest('src/fonts')); // Copy font awesome to SRC
});

gulp.task('foundation-vendor', function () {
    gulp.src(['bower_components/foundation-sites/_vendor/**/*'])
    .pipe(gulp.dest('src/style/_vendor'));
});
gulp.task('foundation-core', function () {
    gulp.src(['bower_components/foundation-sites/scss/**/*'])
    .pipe(gulp.dest('src/style/foundation'));
});

gulp.task('foundation-settings', function () {
    gulp.src([
        'bower_components/foundation-sites/scss/settings/*'])
    .pipe(gulp.dest('src/style/foundation'));
});
gulp.task('foundation', ['foundation-vendor', 'foundation-core', 'foundation-settings', 'font-awesome']);

var config = { 
    server: {
        baseDir: "./build"
    },
    // tunnel: false,
    // host: 'localhost',
    // port: 9009,
    // logPrefix: "Local server:"
};

gulp.task('html:build', function () {
    gulp.src(path.src.html) 
        .pipe(rigger()) 
        .pipe(gulp.dest(path.build.html)) 
        .pipe(reload({stream: true})); 
});

gulp.task('js:build', function () {
    gulp.src(path.src.js)
        .pipe(rigger())
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.js))
        .pipe(reload({stream: true}));
});

gulp.task('style:build', function () {
    gulp.src(path.src.style)
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(prefixer())
        .pipe(cssmin())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({stream: true}));
});

gulp.task('image:build', function () {
    gulp.src(path.src.img)
        .pipe(imagemin([
            imagemin.gifsicle({interlaced: true}),
            imagemin.jpegtran({progressive: true}),
            imagemin.optipng({optimizationLevel: 5}),
            imagemin.svgo({plugins: [{removeViewBox: true}]})
        ]))
        .pipe(gulp.dest(path.build.img))
        .pipe(reload({stream: true}));
});

gulp.task('fonts:build', function() {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
});

gulp.task('build', [
                    'html:build',
                    'js:build',
                    'style:build',
                    'fonts:build',
                    'image:build'
                ]);

gulp.task('watch', function() {
    gulp.watch(path.watch.html, ['html:build']);
    gulp.watch(path.watch.style, ['style:build']);
    gulp.watch(path.watch.js, ['js:build']);
    gulp.watch(path.watch.img, ['image:build']);
    gulp.watch(path.watch.fonts, ['fonts:build']);
});

gulp.task('webserver', function () {
    browserSync.init(config);
});

gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});


gulp.task('default', ['build', 'webserver', 'watch']);