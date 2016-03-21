import {Injectable, Inject} from 'angular2/core';
import {AppContext} from '../../../../../common/utils/AppContext';
import {FormBuilder, ControlGroup, Validators} from 'angular2/common';
import {ThValidators} from '../../../../../common/utils/form-utils/ThFormUtils';
import {CredentialsDO} from '../data-objects/CredentialsDO';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class LogInService {
	private _loginForm: ControlGroup;

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
		return this._appContext.thHttp.post("account/logIn", credentials);
	}

	public get loginForm(): ControlGroup {
		return this._loginForm;
	}
	public set loginForm(loginForm: ControlGroup) {
		this._loginForm = loginForm;
	}
}