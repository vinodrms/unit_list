var gulp = require('gulp');
var ts = require('gulp-typescript');
var minify = require('gulp-minify');
var embedTemplates = require('gulp-angular-embed-templates');
var embedTemplatesOptions = {
    minimize: {
        quotes: true,
        dom: {
            xmlMode: true,
            lowerCaseAttributeNames: false,
            lowerCaseTags: false
        }
    },
    basePath : __dirname
};

gulp.task('pack-internal', function() {
    var tsProject = ts.createProject('client/tsconfig.json', {
        typescript: require('typescript'),
        rootDir: 'client',
        outFile: 'unitpal-internal.js'
    });
    
	var tsResult = gulp.src('client/src/pages/internal/**/*.ts')
                        .pipe(embedTemplates(embedTemplatesOptions))
                        .pipe(ts(tsProject)); 
	return tsResult.js  
                .pipe(minify({
                    exclude: ['tasks'],
                    ignoreFiles: ['-min.js']
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
                    ignoreFiles: ['-min.js']
                }))
				.pipe(gulp.dest('client/build'));
});

gulp.task('pack', ['pack-internal', 'pack-external']);