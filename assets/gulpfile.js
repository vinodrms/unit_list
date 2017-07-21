var gulp = require('gulp');
var ts = require('gulp-typescript');
var minify = require('gulp-minify');
var embedTemplates = require('gulp-angular-embed-templates');
var clean = require('gulp-clean');
var rev = require('gulp-rev');
var revReplace = require('gulp-rev-replace');

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

function compileAppFromDirectory(dirName) {
	var tsProject = ts.createProject('client/tsconfig.json', {
        typescript: require('typescript'),
        rootDir: 'client',
        outDir: 'src'
    });

	var tsResult = gulp.src(['client/src/common/**/*.ts', dirName])
		.pipe(embedTemplates(embedTemplatesOptions))
		.pipe(ts(tsProject));
	return tsResult.js.pipe(gulp.dest('client'));
}

function packCompiledFiles(configFileName, outFileName, appConfigName, endCallback) {
	var SystemBuilder = require('systemjs-builder');
	var builder = new SystemBuilder();
	builder.loadConfig('./client/' + configFileName)
		.then(function () {
			var outputFile = 'client/build/' + outFileName;
			return builder.buildStatic(appConfigName, outputFile, {
				minify: true,
				mangle: true
			});
		})
		.then(function () {
			endCallback();
		}).catch(function (e) {
			endCallback(e);
		});
}


gulp.task('compile-internal', function () {
	return compileAppFromDirectory('client/src/pages/internal/**/*.ts');
});
gulp.task('pack-internal', ['compile-internal'], function (endCallback) {
	packCompiledFiles('systemjs.internal.config.js', 'unitpal-internal.min.js', 'internal', endCallback);
});

gulp.task('compile-external', ['pack-internal'], function () {
	return compileAppFromDirectory('client/src/pages/external/**/*.ts');
});
gulp.task('pack-external', ['compile-external'], function (endCallback) {
	packCompiledFiles('systemjs.external.config.js', 'unitpal-external.min.js', 'external', endCallback);
});

gulp.task('clean-dist', function () {
	return gulp.src('dist', { read: false })
		.pipe(clean());
});

gulp.task('copy-dist', ['pack-internal', 'pack-external', 'clean-dist'], function () {
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
		'node_modules/pace-progress/**/*',
		'node_modules/underscore/**/*',
		'node_modules/perfect-scrollbar/**/*',
		'node_modules/echarts/**/*',

		'node_modules/es6-shim/**/*',
		'node_modules/core-js/**/*',
		'node_modules/systemjs/dist/**/*',
		'node_modules/zone.js/dist/**/*',
		'node_modules/reflect-metadata/**/*',
		'node_modules/select2/**/*',
		'node_modules/socket.io-client/**/*',
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


gulp.task('rev-css', ['clean-rev-replace'], function() {
	var file = 'client/static-assets/css/unitpal.css';
	var revvedFilesOutputFolder = 'revved-css-files/';
	
	return gulp.src(file)
		.pipe(rev())
		.pipe(gulp.dest(revvedFilesOutputFolder))
		.pipe(rev.manifest({merge: true}))
		.pipe(gulp.dest('.'));
});

gulp.task('rev-js', ['rev-css'], function() {
	var files = ['client/build/unitpal-external.min.js', 'client/build/unitpal-internal.min.js'];
	var revvedFilesOutputFolder = 'revved-js-files/';
	
	return gulp.src(files)
		.pipe(rev())
		.pipe(gulp.dest(revvedFilesOutputFolder))
		.pipe(rev.manifest({merge: true}))
		.pipe(gulp.dest('.'));
});

gulp.task('clean-rev-replace', function () {
        return gulp.src(['revved-css-files/', 'revved-js-files/', 'rev-replace-output/', 'rev-manifest.json'], { read: false })
                .pipe(clean());
});

gulp.task('rev-replace', ['rev-js'], function() {
    var manifest = gulp.src('rev-manifest.json');
    var source = ['../views/external.ejs', '../views/internal.ejs'];

    return gulp.src(source)
        .pipe(revReplace({manifest: manifest, replaceInExtensions: ['.ejs']}))
        .pipe(gulp.dest('rev-replace-output'));
});
