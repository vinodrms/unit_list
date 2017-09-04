import { NgModule, Compiler, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { HttpModule } from "@angular/http";

import { MainLayoutExternalComponent } from './MainLayoutExternalComponent';
import { ExternalRouting } from './ExternalRouterConfig';
import { IThCookie } from '../../../common/utils/cookies/IThCookie';
import { ThCookie } from '../../../common/utils/cookies/ThCookie';
import { IThHttp } from '../../../common/utils/http/IThHttp';
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

import { SharedDirectivesModule } from '../../../common/utils/directives/modules/SharedDirectivesModule';
import { SharedPipesModule } from '../../../common/utils/pipes/modules/SharedPipesModule';
import { ExternalPagesModule } from '../pages/ExternalPagesModule';
import { ITokenService } from "../../../common/utils/oauth-token/ITokenService";
import { TokenService } from "../../../common/utils/oauth-token/TokenService";
import { IThLocalStorage } from "../../../common/utils/local-storage/IThLocalStorage";
import { ThLocalStorage } from "../../../common/utils/local-storage/ThLocalStorage";
import { ThOAuthHttp } from "../../../common/utils/http/oauth/ThOAuthHttp";

@NgModule({
	imports: [BrowserModule, HttpModule, RouterModule, ExternalRouting,
		SharedDirectivesModule, SharedPipesModule, ExternalPagesModule],
	declarations: [MainLayoutExternalComponent],
	bootstrap: [MainLayoutExternalComponent],
	providers: [
		{ provide: IThCookie, useClass: ThCookie },
		{ provide: IThLocalStorage, useClass: ThLocalStorage },
		{ provide: IBrowserLocation, useClass: BrowserLocation },
		{ provide: IRouterNavigator, useClass: RouterNavigator },
		ThTranslation,
		{ provide: ITokenService, useClass: TokenService },
		{ provide: IThHttp, useClass: ThOAuthHttp },
		{ provide: IToaster, useClass: Toaster },
		{ provide: IModalService, useClass: ModalService },
		{ provide: IAnalytics, useClass: GoogleAnalytics },
		AppContext,
		Compiler, ModuleLoaderService
	]
})
export class ExternalModule { }

if ((<any>window).enableAngularProdMode === true) {
	enableProdMode();
}
platformBrowserDynamic().bootstrapModule(ExternalModule);