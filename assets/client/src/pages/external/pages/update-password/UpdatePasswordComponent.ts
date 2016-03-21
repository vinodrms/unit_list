import {Component} from 'angular2/core';
import {ControlGroup} from 'angular2/common';
import {RouterLink, Router, RouteParams} from 'angular2/router';
import {AppContext} from '../../../../common/utils/AppContext';
import {ThError} from '../../../../common/utils/responses/ThError';
import {BaseFormComponent} from '../../../../common/base/BaseFormComponent';
import {ExternalFooterComponent} from '../common/footer/ExternalFooterComponent';
import {UpdatePasswordService} from './services/UpdatePasswordService';
import {TranslationPipe} from '../../../../common/utils/localization/TranslationPipe';
import {UpdatePasswordDO} from './data-objects/UpdatePasswordDO';
import {LoginStatusCode} from '../../../../common/utils/responses/LoginStatusCode';

@Component({
	selector: 'update-password-component',
	templateUrl: '/client/src/pages/external/pages/update-password/template/update-password-component.html',
	directives: [RouterLink, ExternalFooterComponent],
	providers: [UpdatePasswordService],
	pipes: [TranslationPipe]
})

export class UpdatePasswordComponent extends BaseFormComponent {
	constructor(
		routeParams: RouteParams,
		private _appContext: AppContext,
		private _updatePasswdService: UpdatePasswordService
	) {
		super();
		this._updatePasswdService.activationCode = routeParams.get("activationCode");
		this._updatePasswdService.email = routeParams.get("email");
	}

	protected getDefaultControlGroup(): ControlGroup {
		return this._updatePasswdService.updatePasswdForm;
	}

	public controlIsInvalid(controlName: string, controlGroup?: ControlGroup): boolean {
		if (controlName === 'passwordConfirmation') {
			var isInvalid = super.controlIsInvalid(controlName, controlGroup);
			if (isInvalid) {
				return true;
			}
			var updatePassDO = this._updatePasswdService.getUpdatePasswordDO();
			return !this._updatePasswdService.passwordsMatch() && updatePassDO.password.length > 0;
		}
		return super.controlIsInvalid(controlName, controlGroup);
	}

	public updatePassword() {
		if (!this._updatePasswdService.isValid()) {
			return;
		}
		this._updatePasswdService.updatePassword().subscribe((result: Object) => {
			this._appContext.routerNavigator.navigateTo("LogInComponent", { loginStatusCode: LoginStatusCode.UpdatePasswordOk });
		}, (error: ThError) => {
			this._appContext.toaster.error(error.message);
		})
	}
}