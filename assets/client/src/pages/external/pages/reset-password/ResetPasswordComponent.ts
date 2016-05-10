import {Component} from '@angular/core';
import {ControlGroup} from '@angular/common';
import {RouterLink} from '@angular/router-deprecated';
import {BaseFormComponent} from '../../../../common/base/BaseFormComponent';
import {ExternalFooterComponent} from '../common/footer/ExternalFooterComponent';
import {TranslationPipe} from '../../../../common/utils/localization/TranslationPipe';
import {AppContext} from '../../../../common/utils/AppContext';
import {ThError} from '../../../../common/utils/responses/ThError';
import {ResetPasswordService} from './services/ResetPasswordService';
import {LoginStatusCode} from '../../../../common/utils/responses/LoginStatusCode';
import {LoadingButtonComponent} from '../../../../common/utils/components/LoadingButtonComponent';

@Component({
	selector: 'reset-password-component',
	templateUrl: '/client/src/pages/external/pages/reset-password/template/reset-password-component.html',
	directives: [RouterLink, ExternalFooterComponent, LoadingButtonComponent],
	pipes: [TranslationPipe],
	providers: [ResetPasswordService]
})

export class ResetPasswordComponent extends BaseFormComponent {
	public isLoading: boolean = false;
	
	constructor(
		private _appContext: AppContext,
		private _resetPasswdService: ResetPasswordService) {

		super();
	}
	protected getDefaultControlGroup(): ControlGroup {
		return this._resetPasswdService.resetPasswdForm;
	}

	public resetPassword() {
		this.didSubmitForm = true;
		if (!this._resetPasswdService.isValid()) {
			var errorMessage = this._appContext.thTranslation.translate("Please complete all the required fields");
			this._appContext.toaster.error(errorMessage);
			return;
		}
		this.isLoading = true;
		this._resetPasswdService.resetPassword().subscribe((result: Object) => {
			this.isLoading = false;
			this._appContext.routerNavigator.navigateTo("LogInComponent", { loginStatusCode: LoginStatusCode.RequestResetPasswordOk });
		}, (error: ThError) => {
			this.isLoading = false;
			this._appContext.toaster.error(error.message);
		})
	}
}