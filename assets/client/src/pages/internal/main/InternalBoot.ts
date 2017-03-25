/// <reference path="../../../../typings/tsd.d.ts" />
import { NgModule, Compiler, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from "@angular/http";
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { APP_BASE_HREF } from '@angular/common';
import { MainLayoutInternalComponent } from './MainLayoutInternalComponent';
import { InternalRouting } from './InternalRouterConfig';
import { IThCookie } from '../../../common/utils/cookies/IThCookie';
import { ThCookie } from '../../../common/utils/cookies/ThCookie';
import { IThHttp } from '../../../common/utils/http/IThHttp';
import { ThHttp } from '../../../common/utils/http/ThHttp';
import { IBrowserLocation } from '../../../common/utils/browser-location/IBrowserLocation';
import { BrowserLocation } from '../../../common/utils/browser-location/BrowserLocation';
import { IRouterNavigator } from '../../../common/utils/navigator/IRouterNavigator';
import { RouterNavigator } from '../../../common/utils/navigator/RouterNavigator';
import { IToaster } from '../../../common/utils/toaster/IToaster';
import { Toaster } from '../../../common/utils/toaster/Toaster';
import { IModalService } from '../../../common/utils/modals/IModalService';
import { ModalService } from '../../../common/utils/modals/ModalService';
import { ThTranslation } from '../../../common/utils/localization/ThTranslation';
import { GoogleAnalytics } from '../../../common/utils/analytics/GoogleAnalytics';
import { IAnalytics } from '../../../common/utils/analytics/IAnalytics';
import { AppContext } from '../../../common/utils/AppContext';
import { ModuleLoaderService } from '../../../common/utils/module-loader/ModuleLoaderService';
import { HomeModule } from '../containers/home/HomeModule';

@NgModule({
	imports: [BrowserModule, HttpModule, InternalRouting, HomeModule],
	declarations: [MainLayoutInternalComponent],
	bootstrap: [MainLayoutInternalComponent],
	providers: [
		{ provide: APP_BASE_HREF, useValue: '/home' },
		{ provide: IThCookie, useClass: ThCookie },
		{ provide: IBrowserLocation, useClass: BrowserLocation },
		{ provide: IRouterNavigator, useClass: RouterNavigator },
		ThTranslation,
		{ provide: IThHttp, useClass: ThHttp },
		{ provide: IToaster, useClass: Toaster },
		{ provide: IModalService, useClass: ModalService },
		{ provide: IAnalytics, useClass: GoogleAnalytics },
		AppContext,
		Compiler, ModuleLoaderService
	]
})
export class InternalModule { }

if ((<any>window).enableAngularProdMode === true) {
	enableProdMode();
}
platformBrowserDynamic().bootstrapModule(InternalModule);