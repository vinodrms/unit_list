var gulp = require('gulp');
var install = require("gulp-install");
var env = require('gulp-env');
var shell = require('gulp-shell');

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
gulp.task('run-server-tests', ['set-unit-test-env'], shell.task([
	'node ./node_modules/sails-test-helper/node_modules/.bin/mocha --recursive -t 30000 -R spec api/test/unit/'
]));


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

