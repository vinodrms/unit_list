import {Component} from 'angular2/core';
import {ControlGroup} from 'angular2/common';
import {RouterLink} from 'angular2/router';
import {BaseFormComponent} from '../../../../common/base/BaseFormComponent';
import {ExternalFooterComponent} from '../common/footer/ExternalFooterComponent';
import {TranslationPipe} from '../../../../common/utils/localization/TranslationPipe';
import {AppContext} from '../../../../common/utils/AppContext';
import {ThError} from '../../../../common/utils/responses/ThError';
import {ResetPasswordService} from './services/ResetPasswordService';
import {LoginStatusCode} from '../../../../common/utils/responses/LoginStatusCode';

@Component({
	selector: 'reset-password-component',
	templateUrl: '/client/src/pages/external/pages/reset-password/template/reset-password-component.html',
	directives: [RouterLink, ExternalFooterComponent],
	pipes: [TranslationPipe],
	providers: [ResetPasswordService]
})

export class ResetPasswordComponent extends BaseFormComponent {
	constructor(
		private _appContext: AppContext,
		private _resetPasswdService: ResetPasswordService) {

		super();
	}
	protected getDefaultControlGroup(): ControlGroup {
		return this._resetPasswdService.resetPasswdForm;
	}

	public resetPassword() {
		if (!this._resetPasswdService.isValid()) {
			return;
		}
		this._resetPasswdService.resetPassword().subscribe((result: Object) => {
			this._appContext.routerNavigator.navigateTo("LogInComponent", { loginStatusCode: LoginStatusCode.RequestResetPasswordOk });
		}, (error: ThError) => {
			this._appContext.toaster.error(error.message);
		})
	}
}