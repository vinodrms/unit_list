/// <reference path="../../../../typings/tsd.d.ts" />

import {bootstrap} from 'angular2/platform/browser';
import {bind, provide, enableProdMode} from 'angular2/core';
import {APP_BASE_HREF, ROUTER_BINDINGS} from 'angular2/router';
import {MainLayoutExternalComponent} from './MainLayoutExternalComponent';
import {HTTP_PROVIDERS} from 'angular2/http';
import {IThCookie} from '../../../common/utils/cookies/IThCookie';
import {ThCookie} from '../../../common/utils/cookies/ThCookie';
import {IThHttp} from '../../../common/utils/http/IThHttp';
import {ThHttp} from '../../../common/utils/http/ThHttp';
import {IBrowserLocation} from '../../../common/utils/browser-location/IBrowserLocation';
import {BrowserLocation} from '../../../common/utils/browser-location/BrowserLocation';
import {ThTranslation} from '../../../common/utils/localization/ThTranslation';
import {AppContext} from '../../../common/utils/AppContext';

bootstrap(MainLayoutExternalComponent,
    [
		ROUTER_BINDINGS,
        bind(APP_BASE_HREF).toValue(""),

		provide(IThCookie, { useClass: ThCookie }),
		provide(IBrowserLocation, { useClass: BrowserLocation }),
		ThTranslation,
		HTTP_PROVIDERS,
		provide(IThHttp, { useClass: ThHttp }),
		AppContext
    ]
);