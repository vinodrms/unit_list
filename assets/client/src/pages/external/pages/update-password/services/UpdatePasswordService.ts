import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { AppContext, ThServerApi } from '../../../../../common/utils/AppContext';
import { ThValidators } from '../../../../../common/utils/form-utils/ThFormUtils';
import { UpdatePasswordDO } from '../data-objects/UpdatePasswordDO';

@Injectable()
export class UpdatePasswordService {
	private _activationCode;
	private _email;
	private _updatePasswdForm: FormGroup;

	constructor(private _appContext: AppContext, private _formBuilder: FormBuilder) {
		this.initResetPasswordForm();
	}
	private initResetPasswordForm() {
		this._updatePasswdForm = this._formBuilder.group({
			"password": ["", Validators.compose([Validators.required, ThValidators.passwordValidator])],
			"passwordConfirmation": ["", Validators.compose([Validators.required, ThValidators.passwordValidator])]
		})
	}
	public isValid(): boolean {
		return this._updatePasswdForm.valid && this.passwordsMatch();
	}

	public getUpdatePasswordDO(): UpdatePasswordDO {
		var updPassDO = new UpdatePasswordDO();
		updPassDO.buildFromObject(this._updatePasswdForm.value);
		updPassDO.activationCode = this._activationCode;
		updPassDO.email = this._email;
		return updPassDO;
	}
	public passwordsMatch(): boolean {
		var updatePassDO = this.getUpdatePasswordDO();
		return updatePassDO.password === updatePassDO.passwordConfirmation;
	}
	public updatePassword(): Observable<any> {
		var updPassDO = this.getUpdatePasswordDO();
		return this._appContext.thHttp.post({
			serverApi: ThServerApi.AccountResetPassword,
			parameters: {
				requestData: updPassDO
			}
		});
	}

	public get activationCode(): string {
		return this._activationCode;
	}
	public set activationCode(activationCode: string) {
		this._activationCode = decodeURIComponent(activationCode);
	}
	public get email(): string {
		return this._email;
	}
	public set email(email: string) {
		this._email = decodeURIComponent(email);
	}
	public get updatePasswdForm(): FormGroup {
		return this._updatePasswdForm;
	}
	public set updatePasswdForm(updatePasswdForm: FormGroup) {
		this._updatePasswdForm = updatePasswdForm;
	}
}