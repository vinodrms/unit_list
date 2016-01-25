exports.config = {
    baseUrl : 'http://localhost:8001/',
    specs   :  [
                    'client/test/e2e/login/login.spec.js',
                    'client/test/e2e/flows/**/*.spec.js'
                ],
    directConnect   : true,
    capabilities: {
        'browserName': 'chrome' //firefox
    },
    allScriptsTimeout   : 110000,
    getPageTimeout  : 100000,
    framework   : 'jasmine2',
    jasmineNodeOpts : {
        isVerbose: true,
        showColors: true,
        includeStackTrace: false,
        defaultTimeoutInterval: 400000
    },
    useAllAngular2AppRoots  : true
};