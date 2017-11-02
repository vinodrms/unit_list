import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs/Subscription';

import { BaseFormComponent } from '../../../../common/base/BaseFormComponent';
import { LogInService } from './services/LogInService';
import { LogInStatusCodeParser, LoginStatusAction } from './utils/LogInStatusCodeParser';
import { ThError } from '../../../../common/utils/responses/ThError';
import { AppContext } from '../../../../common/utils/AppContext';
import { HotelService } from "../../../internal/services/hotel/HotelService";
import { HotelDetailsDO } from "../../../internal/services/hotel/data-objects/HotelDetailsDO";
import { TokenService } from '../../../../common/utils/oauth-token/TokenService';

@Component({
    selector: 'log-in-component',
    templateUrl: '/client/src/pages/external/pages/log-in/template/log-in-component.html',
    providers: [LogInService, TokenService, HotelService]
})
export class LogInComponent extends BaseFormComponent implements OnInit, OnDestroy {
    public isLoading: boolean = false;
    private _statusCodeParser: LogInStatusCodeParser;
    private _statusCodeSubscription: Subscription;

    constructor(
        private _appContext: AppContext,
        private _logInService: LogInService,
        private _tokenService: TokenService,
        private _hotelService: HotelService,
        private _location: Location,
        private _activatedRoute: ActivatedRoute) {
        super();
    }
    ngOnInit() {
        this._statusCodeSubscription = this._activatedRoute.params.subscribe(params => {
            this._statusCodeParser = new LogInStatusCodeParser();
            this._statusCodeParser.updateStatusCode(params['loginStatusCode']);
            this.displayStatusAlertIfNecessary();
            this._location.replaceState("");
        });

        let accessToken = this._tokenService.accessToken;
        if (!this._appContext.thUtils.isUndefinedOrNull(accessToken)) {
            this._logInService.isAuthenticated().subscribe((loginResult: Object) => {
                this._hotelService.getHotelDetailsDO().subscribe((result: HotelDetailsDO) => {
                    this.isLoading = false;
                    this.goToMainPage(result);
                });
            });
        }
    }
    ngOnDestroy() {
        this._statusCodeSubscription.unsubscribe();
    }

    private displayStatusAlertIfNecessary() {
        var loginStatus = this._statusCodeParser.getLoginStatusResponse();
        switch (loginStatus.action) {
            case LoginStatusAction.SuccessAlert:
                var successMessage = this._appContext.thTranslation.translate(loginStatus.message);
                this._appContext.toaster.success(successMessage);
                break;
            case LoginStatusAction.ErrorAlert:
                var errorMessage = this._appContext.thTranslation.translate(loginStatus.message);
                this._appContext.toaster.error(errorMessage);
                break;
            default:
                break;
        }
    }

    protected getDefaultFormGroup(): FormGroup {
        return this._logInService.loginForm;
    }

    public logIn() {
        this.didSubmitForm = true;
        if (!this._logInService.isValid()) {
            var errorMessage = this._appContext.thTranslation.translate("Please complete all the required fields");
            this._appContext.toaster.error(errorMessage);
            return;
        }

        this.isLoading = true;

        let onError = (error: ThError) => {
            this.isLoading = false;
            this._appContext.toaster.error(this._appContext.thTranslation.translate("Invalid username or password"));
        };

        this._logInService.logIn().subscribe((loginResult: Object) => {
            this._hotelService.getHotelDetailsDO().subscribe((result: HotelDetailsDO) => {
                this.isLoading = false;
                this.goToMainPage(result);
            }, onError);
        }, onError);
    }
    private goToMainPage(result: HotelDetailsDO) {
        if (!this._appContext.thUtils.isUndefinedOrNull(result.hotel.configurationCompleted)) {
            if (result.hotel.configurationCompleted === false) {
                this._appContext.browserLocation.goToWizardPage();
                return;
            }
        }
        this._appContext.browserLocation.goToHomePage();
    }
}
