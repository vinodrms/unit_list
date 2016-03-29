import {Component} from 'angular2/core';
import {ControlGroup} from 'angular2/common';
import {RouterLink, Router, RouteParams} from 'angular2/router';
import {AppContext} from '../../../../common/utils/AppContext';
import {ThError} from '../../../../common/utils/responses/ThError';
import {BaseFormComponent} from '../../../../common/base/BaseFormComponent';
import {ExternalFooterComponent} from '../common/footer/ExternalFooterComponent';
import {UpdatePasswordService} from './services/UpdatePasswordService';
import {TranslationPipe} from '../../../../common/utils/localization/TranslationPipe';
import {LoginStatusCode} from '../../../../common/utils/responses/LoginStatusCode';
import {LoadingButtonComponent} from '../../../../common/utils/components/LoadingButtonComponent';

@Component({
	selector: 'update-password-component',
	templateUrl: '/client/src/pages/external/pages/update-password/template/update-password-component.html',
	directives: [RouterLink, ExternalFooterComponent, LoadingButtonComponent],
	providers: [UpdatePasswordService],
	pipes: [TranslationPipe]
})

export class UpdatePasswordComponent extends BaseFormComponent {
	public isLoading: boolean = false;
	
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


	public updatePassword() {
		this.didSubmitForm = true;
		if (!this._updatePasswdService.isValid()) {
			var errorMessage = this._appContext.thTranslation.translate("Please complete all the required fields");
			this._appContext.toaster.error(errorMessage);
			return;
		}
		this.isLoading = true;
		this._updatePasswdService.updatePassword().subscribe((result: Object) => {
			this.isLoading = false;
			this._appContext.routerNavigator.navigateTo("LogInComponent", { loginStatusCode: LoginStatusCode.UpdatePasswordOk });
		}, (error: ThError) => {
			this.isLoading = false;
			this._appContext.toaster.error(error.message);
		})
	}
}