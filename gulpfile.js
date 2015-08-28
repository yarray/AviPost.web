/*jslint node: true */
'use strict';

// browserify
var browserify = require('browserify');
var uglifyify = require('uglifyify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');

// gulp
var gulp = require('gulp');
var eslint = require('gulp-eslint');
var rename = require('gulp-rename');
var myth = require('gulp-myth');
var csso = require('gulp-csso');
var serve = require('gulp-serve');
var mocha = require('gulp-mocha');

// others
var merge = require('merge-stream');
var del = require('del');

// development
// 
gulp.task('lint', function() {
    return gulp.src('./app/scripts/**/*.js')
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failOnError());
});

gulp.task('scripts', function() {
    var scripts = browserify('./app/scripts/app.js', {
            debug: true
        })
        .transform(babelify)
        .bundle()
        .on('error', function(err) {
            console.log(err.message);
            this.emit('end');
        })
        .pipe(source('app.js'))
        .pipe(gulp.dest('./.tmp/scripts/'));

    var config = gulp.src('./app/config/config.dev.js')
        .pipe(rename('config.js'))
        .pipe(gulp.dest('./.tmp/'));

    return merge(scripts, config);
});

gulp.task('styles', function() {
    return gulp.src('./app/styles/app.css')
        .pipe(myth())
        .pipe(gulp.dest('./.tmp/styles/'));
});

gulp.task('serve', ['watch'], serve(['.tmp', 'app']));

gulp.task('watch', ['scripts', 'styles'], function() {
    gulp.watch('./app/scripts/**/*.js', ['scripts']);
    gulp.watch('./app/config/*.js', ['scripts']);
    gulp.watch('./app/styles/**/*.css', ['styles']);
});

gulp.task('test', function() {
    require('./test/init');
    var babel = require('babel/register');
    return gulp.src('./test/**/*-test.js')
        .pipe(mocha(
            { compiler: babel }
        ));
});


// integration
//
gulp.task('build', ['clean', 'lint', 'test'], function() {
    var pages = gulp.src('./app/*.html')
        .pipe(gulp.dest('./dist/'));

    var scripts = browserify('./app/scripts/app.js')
        .transform(babelify)
        .transform(uglifyify)
        .bundle()
        .on('error', function(err) {
            console.log(err.message);
            this.emit('end');
        })
        .pipe(source('app.js'))
        .pipe(gulp.dest('./dist/scripts/'));

    var styles = gulp.src('./app/styles/app.css')
        .pipe(myth())
        .pipe(csso())
        .pipe(gulp.dest('./dist/styles/'));

    var images = gulp.src('./app/images/*')
        .pipe(gulp.dest('./dist/images/'));

    var config = gulp.src('./app/config/config.prod.js')
        .pipe(rename('config.js'))
        .pipe(gulp.dest('dist/'));

    var docker = gulp.src('./Dockerfile')
        .pipe(gulp.dest('dist/'));

    return merge(pages, scripts, config, styles, docker);
});

// build test version
gulp.task('build.test', ['build'], function() {
    return gulp.src('./app/config/config.ci.js')
        .pipe(rename('config.js'))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('clean', del.bind(null, ['.tmp', 'dist']));
