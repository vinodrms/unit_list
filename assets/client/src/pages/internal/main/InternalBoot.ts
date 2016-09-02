/// <reference path="../../../../typings/tsd.d.ts" />

import {NgModule, provide}      from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

import {APP_BASE_HREF} from '@angular/common';
import {MainLayoutInternalComponent} from './MainLayoutInternalComponent';
import {InternalRouting, InternalRouterModules} from './InternalRouterConfig';
import {HTTP_PROVIDERS} from '@angular/http';
import {IThCookie} from '../../../common/utils/cookies/IThCookie';
import {ThCookie} from '../../../common/utils/cookies/ThCookie';
import {IThHttp} from '../../../common/utils/http/IThHttp';
import {ThHttp} from '../../../common/utils/http/ThHttp';
import {IBrowserLocation} from '../../../common/utils/browser-location/IBrowserLocation';
import {BrowserLocation} from '../../../common/utils/browser-location/BrowserLocation';
import {IRouterNavigator} from '../../../common/utils/navigator/IRouterNavigator';
import {RouterNavigator} from '../../../common/utils/navigator/RouterNavigator';
import {IToaster} from '../../../common/utils/toaster/IToaster';
import {Toaster} from '../../../common/utils/toaster/Toaster';
import {IModalService} from '../../../common/utils/modals/IModalService';
import {ModalService} from '../../../common/utils/modals/ModalService';
import {ThTranslation} from '../../../common/utils/localization/ThTranslation';
import {GoogleAnalytics} from '../../../common/utils/analytics/GoogleAnalytics';
import {IAnalytics} from '../../../common/utils/analytics/IAnalytics';
import {AppContext} from '../../../common/utils/AppContext';

@NgModule({
    imports: [BrowserModule, InternalRouting, FormsModule, ReactiveFormsModule],
    declarations: [MainLayoutInternalComponent, InternalRouterModules],
    bootstrap: [MainLayoutInternalComponent],
	providers: [
		provide(APP_BASE_HREF, { useValue: '/home' }),
		provide(IThCookie, { useClass: ThCookie }),
		provide(IBrowserLocation, { useClass: BrowserLocation }),
		provide(IRouterNavigator, { useClass: RouterNavigator }),
		ThTranslation,
		HTTP_PROVIDERS,
		provide(IThHttp, { useClass: ThHttp }),
		provide(IToaster, { useClass: Toaster }),
		provide(IModalService, { useClass: ModalService }),
		provide(IAnalytics, { useClass: GoogleAnalytics }),
		AppContext
	]
})
export class InternalModule { }

platformBrowserDynamic().bootstrapModule(InternalModule);