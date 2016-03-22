import {Component, AfterViewInit} from 'angular2/core';
import {ControlGroup} from 'angular2/common';
import {RouteParams, Location, RouterLink} from 'angular2/router';
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
	directives: [RouterLink, ExternalFooterComponent, LoadingButtonComponent],
	pipes: [TranslationPipe]
})

export class LogInComponent extends BaseFormComponent implements AfterViewInit {
	public isLoading: boolean = false;
	private _statusCodeParser: LogInStatusCodeParser;

	constructor(
		private _appContext: AppContext,
		private _logInService: LogInService,
		private _location: Location,
		routeParams: RouteParams) {

		super();
		this._statusCodeParser = new LogInStatusCodeParser();
		this._statusCodeParser.updateStatusCode(routeParams.get("loginStatusCode"));
	}

	ngAfterViewInit() {
		this.removeAllQueryParams();
		this.displayStatusAlertIfNecessary();
	}
	private removeAllQueryParams() {
		this._location.replaceState("/");
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

	protected getDefaultControlGroup(): ControlGroup {
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
		this._logInService.logIn().subscribe((result: Object) => {
			// TODO: navigate to corresponding page after log in

			this.isLoading = false;
		}, (error: ThError) => {
			this.isLoading = false;
			this._appContext.toaster.error(error.message);
		});
	}
}