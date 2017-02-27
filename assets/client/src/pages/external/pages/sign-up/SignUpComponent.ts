import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AppContext } from '../../../../common/utils/AppContext';
import { ThError } from '../../../../common/utils/responses/ThError';
import { BaseFormComponent } from '../../../../common/base/BaseFormComponent';
import { SignUpService } from './services/SignUpService';
import { LoginStatusCode } from '../../../../common/utils/responses/LoginStatusCode';
import { LoadingButtonComponent } from '../../../../common/utils/components/LoadingButtonComponent';

@Component({
	selector: 'sign-up-component',
	templateUrl: '/client/src/pages/external/pages/sign-up/template/sign-up-component.html',
	providers: [SignUpService]
})

export class SignUpComponent extends BaseFormComponent {
	public isLoading: boolean = false;

	constructor(private _appContext: AppContext, private _signUpService: SignUpService) {
		super();
	}

	protected getDefaultFormGroup(): FormGroup {
		return this._signUpService.signUpForm;
	}

	public signUp() {
		this.didSubmitForm = true;
		if (!this._signUpService.isValid()) {
			var errorMessage = this._appContext.thTranslation.translate("Please complete all the required fields");
			this._appContext.toaster.error(errorMessage);
			return;
		}
		this.isLoading = true;
		this._signUpService.signUp().subscribe((result: Object) => {
			this.isLoading = false;
			this._appContext.routerNavigator.navigateTo("/signed-up");
		}, (error: ThError) => {
			this.isLoading = false;
			this._appContext.toaster.error(error.message);
		})
	}
}