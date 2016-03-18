/// <reference path="../../../../typings/tsd.d.ts" />

import {bootstrap} from 'angular2/platform/browser';
import {bind, provide, enableProdMode} from 'angular2/core';
import {APP_BASE_HREF, LocationStrategy, HashLocationStrategy, ROUTER_BINDINGS} from 'angular2/router';
import {MainLayoutExternalComponent} from './MainLayoutExternalComponent';
import {HTTP_PROVIDERS} from 'angular2/http';
import {IThHttp} from '../../../common/utils/http/IThHttp';
import {ThHttp} from '../../../common/utils/http/ThHttp';
import {TranslationService} from '../../../common/utils/localization/TranslationService';

bootstrap(MainLayoutExternalComponent,
    [
		ROUTER_BINDINGS,
        bind(APP_BASE_HREF).toValue(""),
        provide(LocationStrategy, { useClass: HashLocationStrategy }),

		TranslationService,
		HTTP_PROVIDERS,
		provide(IThHttp, { useClass: ThHttp })
    ]
);