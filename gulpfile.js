var gulp = require('gulp');
var install = require("gulp-install");
var env = require('gulp-env');
var shell = require('gulp-shell');
var mocha = require('gulp-mocha');

gulp.task('install-client-deps', function () {
    gulp.src([__dirname + '/assets/bower.json', __dirname + '/assets/package.json'])
		.pipe(install());
});


gulp.task('set-unit-test-env', function () {
	env({
		vars: {
			NODE_ENV: "test",
			PORT: 9999
		}
	})
});
gulp.task('run-server-tests', ['set-unit-test-env'], function () {
	return gulp.src('api/test/root/**/*.js', {read: false}) 
		.pipe(mocha({timeout: 10000}))
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

