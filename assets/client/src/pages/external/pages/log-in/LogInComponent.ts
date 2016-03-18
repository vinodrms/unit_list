import {Component} from 'angular2/core';
import {FORM_PROVIDERS, NgClass, ControlGroup} from 'angular2/common';
import {BaseFormComponent} from '../../../../common/base/BaseFormComponent';
import {TranslationPipe} from '../../../../common/utils/localization/TranslationPipe';
import {LogInService} from './services/LogInService';

@Component({
	selector: 'log-in-component',
	templateUrl: '/client/src/pages/external/pages/log-in/template/log-in-component.html',
	directives: [NgClass],
	providers: [LogInService],
	pipes: [TranslationPipe]
})

export class LogInComponent extends BaseFormComponent {

	constructor(public _logInService: LogInService) {
		super();

	}

	protected getDefaultControlGroup(): ControlGroup {
		return this._logInService.loginForm;
	}

	public logIn() {
		this.didSubmitForm = true;
		//TODO: server req
	}
}