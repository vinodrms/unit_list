var gulp = require('gulp');
var install = require("gulp-install");
var env = require('gulp-env');
var shell = require('gulp-shell');
var mocha = require('gulp-mocha');
var clean = require('gulp-clean');
var istanbul = require('gulp-istanbul');

gulp.task('install-client-deps', function () {
    gulp.src([__dirname + '/assets/bower.json', __dirname + '/assets/package.json'])
		.pipe(install());
});


gulp.task('set-unit-test-env', function () {
	env({
		vars: {
			NODE_ENV: "test"
		}
	})
});
gulp.task('pre-server-tests', function () {
	return gulp.src(['api/core/**/*.js'])
		.pipe(istanbul({ includeUntested: true }))
		.pipe(istanbul.hookRequire());
});
gulp.task('run-server-tests', ['set-unit-test-env', 'pre-server-tests'], function () {
	return gulp.src('api/test/root/**/*.js', { read: false })
		.pipe(mocha({ timeout: 10000 }))
		.pipe(istanbul.writeReports({ reporters: ['lcov', 'text-summary'] }))
		.once('error', function () {
			process.exit(1);
		})
		.once('end', function () {
			process.exit();
		});
});

gulp.task('set-test-env', function () {
	env({
		vars: {
			NODE_ENV: "test"
		}
	})
});
gulp.task('run-test', ['set-test-env'], shell.task([
	'node app.js'
]));

gulp.task('set-prod-env', function () {
	env({
		vars: {
			NODE_ENV: "production"
		}
	})
});
gulp.task('run-prod', ['set-prod-env'], shell.task([
	'node app.js'
]));

gulp.task('clean-server-core', function () {
	return gulp.src('api/core/**/*.js', { read: false })
		.pipe(clean());
});
gulp.task('clean-server-controllers', function () {
	return gulp.src('api/controllers/**/*.js', { read: false })
		.pipe(clean());
});
gulp.task('clean-server-test', function () {
	return gulp.src('api/test/**/*.js', { read: false })
		.pipe(clean());
});
gulp.task('clean-server-models', function () {
	return gulp.src('api/models/**/*.js', { read: false })
		.pipe(clean());
});
gulp.task('clean-server', ['clean-server-core', 'clean-server-controllers', 'clean-server-test', 'clean-server-models']);

gulp.task('clean-client-src', function () {
	return gulp.src('assets/client/src/**/*.js', { read: false })
		.pipe(clean());
});
gulp.task('clean-client-e2etest', function () {
	return gulp.src('assets/client/test/e2e/**/*.js', { read: false })
		.pipe(clean());
});
gulp.task('clean-client', ['clean-client-src', 'clean-client-e2etest']);