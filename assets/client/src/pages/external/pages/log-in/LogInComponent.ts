import {Component, OnInit, OnDestroy} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {ROUTER_DIRECTIVES, ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import {Subscription} from 'rxjs/Subscription';

import {BaseFormComponent} from '../../../../common/base/BaseFormComponent';
import {TranslationPipe} from '../../../../common/utils/localization/TranslationPipe';
import {LogInService} from './services/LogInService';
import {LogInStatusCodeParser, LoginStatusAction} from './utils/LogInStatusCodeParser';
import {ThError} from '../../../../common/utils/responses/ThError';
import {AppContext} from '../../../../common/utils/AppContext';
import {ExternalFooterComponent} from '../common/footer/ExternalFooterComponent';
import {LoadingButtonComponent} from '../../../../common/utils/components/LoadingButtonComponent';

@Component({
	selector: 'log-in-component',
	templateUrl: '/client/src/pages/external/pages/log-in/template/log-in-component.html',
	providers: [LogInService],
	directives: [ROUTER_DIRECTIVES, ExternalFooterComponent, LoadingButtonComponent],
	pipes: [TranslationPipe]
})
export class LogInComponent extends BaseFormComponent implements OnInit, OnDestroy {
	public isLoading: boolean = false;
	private _statusCodeParser: LogInStatusCodeParser;
	private _statusCodeSubscription: Subscription;

	constructor(
		private _appContext: AppContext,
		private _logInService: LogInService,
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
		this._logInService.logIn().subscribe((loginResult: Object) => {
			this.isLoading = false;
			this.goToMainPage(loginResult);
		}, (error: ThError) => {
			this.isLoading = false;
			this._appContext.toaster.error(error.message);
		});
	}
	private goToMainPage(loginResult: Object) {
		if (!this._appContext.thUtils.isUndefinedOrNull(loginResult, "configurationCompleted")) {
			if (loginResult["configurationCompleted"] === false) {
				this._appContext.browserLocation.goToWizardPage();
				return;
			}
		}
		this._appContext.browserLocation.goToHomePage();
	}
}