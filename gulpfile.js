/*jslint node: true */
'use strict';

// browserify
var browserify = require('browserify');
var uglifyify = require('uglifyify');
var source = require('vinyl-source-stream');

// gulp
var gulp = require('gulp');
var jshint = require('gulp-jshint');
var rename = require('gulp-rename');
var myth = require('gulp-myth');
var csso = require('gulp-csso');
var serve = require('gulp-serve');
var mocha = require('gulp-mocha');
var nightwatch = require('gulp-nightwatch-headless');
var exec = require('child_process').exec;

// others
var merge = require('merge-stream');
var del = require('del');

// development
// 
gulp.task('jshint', function() {
    return gulp.src('./app/scripts/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'));
});

gulp.task('scripts', function() {
    var scripts = browserify('./app/scripts/app.js', {
            debug: true
        })
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

// test
// 
gulp.task('test', ['jshint'], function() {
    require('./test/init');
    return gulp.src('./test/**/*-test.js')
        .pipe(mocha());
});

// use test config
gulp.task('config.test', ['build'], function() {
    return gulp.src('./app/config/config.test.js')
        .pipe(rename('config.js'))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('e2e', ['config.test'], function() {
    return gulp.src('')
        .pipe(nightwatch({
            nightwatch: {
                tempDir: '.tmp',
                config: 'e2e/nightwatch.json'
            },
            httpserver: {
                port: 2043,
                path: 'dist'
            }
        }));
});

// production
//
gulp.task('build', ['clean', 'test', 'jshint'], function() {
    var pages = gulp.src('./app/*.html')
        .pipe(gulp.dest('./dist/'));

    var scripts = browserify('./app/scripts/app.js')
        .transform(uglifyify)
        .bundle()
        .pipe(source('app.js'))
        .pipe(gulp.dest('./dist/scripts/'));

    var styles = gulp.src('./app/styles/app.css')
        .pipe(myth())
        .pipe(csso())
        .pipe(gulp.dest('./dist/styles/'));

    var config = gulp.src('./app/config/config.prod.js')
        .pipe(rename('config.js'))
        .pipe(gulp.dest('dist/'));

    var docker = gulp.src('./Dockerfile')
        .pipe(gulp.dest('dist/'));

    return merge(pages, scripts, config, styles, docker);
});

gulp.task('docker', ['build'], function() {
    exec('docker build -t avipost.web dist/', function(err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

gulp.task('clean', del.bind(null, ['.tmp', 'dist']));
