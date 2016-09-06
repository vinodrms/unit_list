import {Injectable, Inject} from '@angular/core';
import {AppContext, ThServerApi} from '../../../../../common/utils/AppContext';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ThValidators} from '../../../../../common/utils/form-utils/ThFormUtils';
import {CredentialsDO} from '../data-objects/CredentialsDO';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class LogInService {
	private _loginForm: FormGroup;

	constructor(private _appContext: AppContext, private _formBuilder: FormBuilder) {
		this.initLoginForm();
	}
	private initLoginForm() {
		this._loginForm = this._formBuilder.group({
			"email": ["", Validators.required],
			"password": ["", Validators.required]
		})
	}

	public isValid(): boolean {
		return this.loginForm.valid;
	}

	public logIn(): Observable<any> {
		var credentials = new CredentialsDO();
		credentials.buildFromObject(this._loginForm.value);
		return this._appContext.thHttp.post(ThServerApi.AccountLogIn, credentials);
	}

	public get loginForm(): FormGroup {
		return this._loginForm;
	}
	public set loginForm(loginForm: FormGroup) {
		this._loginForm = loginForm;
	}
}