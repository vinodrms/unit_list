import {Component} from 'angular2/core';
import {ControlGroup} from 'angular2/common';
import {BaseFormComponent} from '../../../../common/base/BaseFormComponent';
import {TranslationPipe} from '../../../../common/utils/localization/TranslationPipe';
import {LogInService} from './services/LogInService';
import {ThError} from '../../../../common/utils/responses/ThError';
import {TranslationService} from '../../../../common/utils/localization/TranslationService';

@Component({
	selector: 'log-in-component',
	templateUrl: '/client/src/pages/external/pages/log-in/template/log-in-component.html',
	providers: [LogInService],
	pipes: [TranslationPipe]
})

export class LogInComponent extends BaseFormComponent {
	constructor(public _logInService: LogInService, private _translationService: TranslationService) {
		super();
	}

	protected getDefaultControlGroup(): ControlGroup {
		return this._logInService.loginForm;
	}

	public logIn() {
		this.didSubmitForm = true;
		if (!this._logInService.isValid()) {
			alert(this._translationService.getTranslation("Please complete all the required fields"));
			return;
		}

		// TODO: implement login logic
		this._logInService.logIn().subscribe((result: Object) => {

		}, (error: ThError) => {
			alert(error.message);
			// TODO: remove - lang testing purposes
			this._translationService.locale = 1 - this._translationService.locale;
		})
	}
}