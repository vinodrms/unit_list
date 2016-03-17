/// <reference path="../../../../typings/tsd.d.ts" />
/// <reference path="../../../../../node_modules/angular2/typings/browser.d.ts" />

import {bootstrap} from 'angular2/platform/browser';
import {Component, bind, provide, enableProdMode} from 'angular2/core';
import {APP_BASE_HREF, LocationStrategy, HashLocationStrategy} from 'angular2/router';
import {MainLayoutExternalComponent} from './MainLayoutExternalComponent';
import {TranslationService} from '../../../common/utils/localization/TranslationService';

bootstrap(MainLayoutExternalComponent,
    [
        bind(APP_BASE_HREF).toValue(""),
        provide(LocationStrategy, { useClass: HashLocationStrategy }),
		TranslationService
    ]
);