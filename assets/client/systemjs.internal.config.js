var config = {
	map: {
		'rxjs': 'node_modules/rxjs',
		'@angular': 'node_modules/@angular',
		'internal': 'client/src',
	},
	packages: {
		'internal': {
			main: 'pages/internal/main/InternalBoot.js',
			defaultExtension: 'js'
		},
		'rxjs': {
			defaultExtension: 'js'
		}
	}
};
var packageNames = [
    '@angular/common',
    '@angular/compiler',
    '@angular/core',
	'@angular/forms',
    '@angular/http',
    '@angular/platform-browser',
    '@angular/platform-browser-dynamic',
    '@angular/router',
    '@angular/testing',
    '@angular/upgrade',
];
packageNames.forEach(function (pkgName) {
	config.packages[pkgName] = { main: 'index.js', defaultExtension: 'js' };
});
System.config(config);