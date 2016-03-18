/// <reference path="../../../../typings/tsd.d.ts" />

import {bootstrap} from 'angular2/platform/browser';
import {Component, bind, provide, enableProdMode} from 'angular2/core';
import {APP_BASE_HREF, LocationStrategy, HashLocationStrategy} from 'angular2/router';
import {MainLayoutInternalComponent} from './MainLayoutInternalComponent';

bootstrap(MainLayoutInternalComponent,
    [
        bind(APP_BASE_HREF).toValue(""),
        provide(LocationStrategy, { useClass: HashLocationStrategy })
    ]
);