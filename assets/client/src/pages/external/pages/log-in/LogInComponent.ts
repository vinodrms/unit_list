import {Component, AfterViewInit} from 'angular2/core';
import {ControlGroup} from 'angular2/common';
import {RouteParams, Location} from 'angular2/router';
import {BaseFormComponent} from '../../../../common/base/BaseFormComponent';
import {TranslationPipe} from '../../../../common/utils/localization/TranslationPipe';
import {LogInService} from './services/LogInService';
import {LogInStatusCodeParser} from './utils/LogInStatusCodeParser';
import {ThError} from '../../../../common/utils/responses/ThError';
import {AppContext} from '../../../../common/utils/AppContext';

@Component({
	selector: 'log-in-component',
	templateUrl: '/client/src/pages/external/pages/log-in/template/log-in-component.html',
	providers: [LogInService],
	pipes: [TranslationPipe]
})

export class LogInComponent extends BaseFormComponent implements AfterViewInit {
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
		// TODO: alert accordingly
		if (loginStatus.displaySuccess) {
			alert('SUCCES: ' + this._appContext.thTranslation.translate(loginStatus.message));
		}
		else if (loginStatus.displayError) {
			alert('ERROR: ' + this._appContext.thTranslation.translate(loginStatus.message));
		}
	}

	protected getDefaultControlGroup(): ControlGroup {
		return this._logInService.loginForm;
	}

	public logIn() {
		this.didSubmitForm = true;
		if (!this._logInService.isValid()) {
			alert(this._appContext.thTranslation.translate("Please complete all the required fields"));
			return;
		}

		// TODO: implement login logic
		this._logInService.logIn().subscribe((result: Object) => {

		}, (error: ThError) => {
			alert(error.message);
			// TODO: remove - lang testing purposes
			this._appContext.thTranslation.locale = 1 - this._appContext.thTranslation.locale;
		})
	}
}