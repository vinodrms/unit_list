import { Injectable, Inject } from '@angular/core';
import { IThCookie } from './cookies/IThCookie';
import { ThTranslation } from './localization/ThTranslation';
import { IBrowserLocation } from './browser-location/IBrowserLocation';
import { IThHttp } from './http/IThHttp';
import { ThUtils } from './ThUtils';
import { IRouterNavigator } from './navigator/IRouterNavigator';
import { RouterNavigator } from './navigator/RouterNavigator';
import { IToaster } from './toaster/IToaster';
import { IModalService } from './modals/IModalService';
import { ThServerApi } from './http/ThServerApi';
export { ThServerApi } from './http/ThServerApi';
import { ThError } from './responses/ThError';
export { ThError } from './responses/ThError';
import { CountryCodeVatConvertor } from './convertors/CountryCodeVatConvertor';
import { LoginStatusCode } from './responses/LoginStatusCode';
import { GoogleAnalytics } from './analytics/GoogleAnalytics';
import { IAnalytics } from './analytics/IAnalytics';
import { ITokenService } from "./oauth-token/ITokenService";

@Injectable()
export class AppContext {
    public thUtils: ThUtils;
    public countryCodeVatConvertor: CountryCodeVatConvertor;

    constructor(
        @Inject(IThCookie) public thCookie: IThCookie,
        @Inject(IBrowserLocation) public browserLocation: IBrowserLocation,
        @Inject(IRouterNavigator) public routerNavigator: IRouterNavigator,
        public thTranslation: ThTranslation,
        @Inject(ITokenService) public tokenService: ITokenService,
        @Inject(IThHttp) public thHttp: IThHttp,
        @Inject(IToaster) public toaster: IToaster,
        @Inject(IModalService) public modalService: IModalService,
        @Inject(IAnalytics) public analytics: IAnalytics
    ) {
        this.thUtils = new ThUtils();
        this.countryCodeVatConvertor = new CountryCodeVatConvertor();
    }

    public logOut() {
        let accessToken = this.tokenService.accessToken;
        if (!this.thUtils.isUndefinedOrNull(accessToken)) {
            this.thHttp.post({ serverApi: ThServerApi.AccountLogOut }).subscribe((result: any) => {
                this.onLogoutPerformed();
            }, (error: ThError) => {
                this.onLogoutPerformed();
            });
        }
        else {
            this.onLogoutPerformed();
        }
    }
    private onLogoutPerformed() {
        this.tokenService.clearTokenData();
        this.browserLocation.goToLoginPage(LoginStatusCode.Ok);
    }
}
