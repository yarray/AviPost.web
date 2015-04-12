/*jslint node: true */
'use strict';

// browserify
var browserify = require('browserify');
var uglifyify = require('uglifyify');
var source = require('vinyl-source-stream');

// gulp
var gulp = require('gulp');
var rename = require('gulp-rename');
var myth = require('gulp-myth');
var csso = require('gulp-csso');
var serve = require('gulp-serve');
var mocha = require('gulp-mocha');

// others
var merge = require('merge-stream');
var del = require('del');


gulp.task('scripts', function() {
    return browserify('./app/scripts/app.js', {
            debug: true
        })
        .require('./app/config/dev.js')
        .bundle()
        .on('error', function(err) {
            console.log(err.message);
            this.emit('end');
        })
        .pipe(source('app.js'))
        .pipe(gulp.dest('.tmp/scripts/'));
});

gulp.task('styles', function() {
    return gulp.src('./app/styles/app.css')
        .pipe(myth())
        .pipe(gulp.dest('.tmp/styles/'));
});

gulp.task('test', function() {
    require('./spec/init');
    return gulp.src('./spec/**/*-test.js')
        .pipe(mocha());
});

gulp.task('serve', ['watch'], serve(['.tmp', 'app']));

gulp.task('watch', ['scripts', 'styles'], function() {
    gulp.watch('./app/scripts/**/*.js', ['scripts']);
    gulp.watch('./app/config/*.js', ['scripts']);
    gulp.watch('./app/styles/**/*.css', ['styles']);
});

gulp.task('build', function() {
    var pages =
        gulp.src('./app/*.html')
        .pipe(gulp.dest('./dist/'));

    var scripts =
        browserify('./app/scripts/app.js')
        .transform(uglifyify)
        .bundle()
        .pipe(source('app.js'))
        .pipe(gulp.dest('./dist/scripts/'));

    var styles =
        gulp.src('./app/styles/app.css')
        .pipe(myth())
        .pipe(csso())
        .pipe(gulp.dest('./dist/styles/'));

    return merge(pages, scripts, styles);
});

gulp.task('clean', del.bind(null, ['.tmp', 'dist']));
