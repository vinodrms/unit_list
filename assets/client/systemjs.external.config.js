var config = {
	paths: {
		'npm:': 'node_modules/'
    },
	map: {
		'external': 'client/src',
		'underscore': 'node_modules/underscore/underscore.js',
		'moment': 'node_modules/moment/moment.js',
		'rxjs': 'node_modules/rxjs',
		'@angular/core': 'npm:@angular/core/bundles/core.umd.js',
		'@angular/common': 'npm:@angular/common/bundles/common.umd.js',
		'@angular/compiler': 'npm:@angular/compiler/bundles/compiler.umd.js',
		'@angular/platform-browser': 'npm:@angular/platform-browser/bundles/platform-browser.umd.js',
		'@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
		'@angular/http': 'npm:@angular/http/bundles/http.umd.js',
		'@angular/router': 'npm:@angular/router/bundles/router.umd.js',
		'@angular/forms': 'npm:@angular/forms/bundles/forms.umd.js'
	},
	packages: {
		'external': {
			main: 'pages/external/main/ExternalBoot.js',
			defaultExtension: 'js'
		},
		'rxjs': {
			defaultExtension: 'js'
		}
	}
};
System.config(config);