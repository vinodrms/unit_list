var gulp = require('gulp');
var ts = require('gulp-typescript');
var minify = require('gulp-minify');
var embedTemplates = require('gulp-angular-embed-templates');
var clean = require('gulp-clean');

var embedTemplatesOptions = {
    minimize: {
        quotes: true,
        dom: {
            xmlMode: true,
            lowerCaseAttributeNames: false,
            lowerCaseTags: false
        }
    },
    basePath: __dirname
};

gulp.task('pack-internal', function() {
    var tsProject = ts.createProject('client/tsconfig.json', {
        typescript: require('typescript'),
        rootDir: 'client',
        outFile: 'unitpal-internal.js'
    });

	var tsResult = gulp.src(['client/src/common/**/*.ts', 'client/src/pages/internal/**/*.ts'])
		.pipe(embedTemplates(embedTemplatesOptions))
		.pipe(ts(tsProject));
	return tsResult.js
		.pipe(minify({
			exclude: ['tasks'],
			ignoreFiles: ['-min.js'],
			mangle: false
		}))
		.pipe(gulp.dest('client/build'));
});

gulp.task('pack-external', function() {
    var tsProject = ts.createProject('client/tsconfig.json', {
        typescript: require('typescript'),
        rootDir: 'client',
        outFile: 'unitpal-external.js'
    });

	var tsResult = gulp.src('client/src/pages/external/**/*.ts')
		.pipe(embedTemplates(embedTemplatesOptions))
		.pipe(ts(tsProject));
	return tsResult.js
		.pipe(minify({
			ignoreFiles: ['-min.js'],
			mangle: false
		}))
		.pipe(gulp.dest('client/build'));
});

gulp.task('clean-dist', function() {
	return gulp.src('dist', { read: false })
		.pipe(clean());
});

gulp.task('copy-dist', ['pack-internal', 'pack-external', 'clean-dist'], function() {
	var scripts = [
		'client/build/**/*.js',
		'client/static-assets/**/*',
		
		'node_modules/bootstrap/dist/**/*',
		'node_modules/font-awesome/**/*',
		'node_modules/animate.css/**/*',
		'node_modules/bootstrap-daterangepicker/**/*',
		'node_modules/toastr/build/**/*',
		'node_modules/jquery.1/**/*',
		'node_modules/moment/min/**/*',
		'node_modules/pace-progress**/*',
		'node_modules/underscore/**/*',
		'node_modules/floathead/**/*',
		
		'node_modules/angular2/bundles/**/*',
		'node_modules/angular2/es6/**/*',
		'node_modules/es6-shim/**/*',
		'node_modules/systemjs/dist/**/*',
		'node_modules/rxjs/bundles/**/*',
		'js/**/*',
		'styles/**/*',
		'images/**/*',
		'robots.txt',
		'*.ico'
	];
	gulp.src(scripts, { base: '.' })
		.pipe(gulp.dest('dist'));
});

gulp.task('pack', ['pack-internal', 'pack-external', 'copy-dist']);