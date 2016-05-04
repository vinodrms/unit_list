import {Injectable, Inject} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {AppContext, ThServerApi} from '../../../../../common/utils/AppContext';
import {FormBuilder, ControlGroup, Validators} from '@angular/common';
import {ThValidators} from '../../../../../common/utils/form-utils/ThFormUtils';
import {ResetPasswordDO} from '../data-objects/ResetPasswordDO';

@Injectable()
export class ResetPasswordService {
	private _resetPasswdForm;

	constructor(private _appContext: AppContext, private _formBuilder: FormBuilder) {
		this.initResetPasswordForm();
	}
	private initResetPasswordForm() {
		this._resetPasswdForm = this._formBuilder.group({
			"email": ["", Validators.compose([Validators.required, ThValidators.emailValidator])]
		})
	}
	public isValid(): boolean {
		return this._resetPasswdForm.valid;
	}

	public resetPassword(): Observable<any> {
		var resetPasswd = new ResetPasswordDO();
		resetPasswd.buildFromObject(this._resetPasswdForm.value);
		return this._appContext.thHttp.post(ThServerApi.AccountRequestResetPassword, { requestData: resetPasswd });
	}

	public get resetPasswdForm(): ControlGroup {
		return this._resetPasswdForm
	}
	public set resetPasswdForm(resetPasswdForm: ControlGroup) {
		this._resetPasswdForm = resetPasswdForm;
	}
}