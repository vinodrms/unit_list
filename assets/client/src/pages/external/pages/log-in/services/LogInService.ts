import {Injectable, Inject} from 'angular2/core';
import {IThHttp} from '../../../../../common/utils/http/IThHttp';
import {FormBuilder, ControlGroup, Validators} from 'angular2/common';
import {ThValidators} from '../../../../../common/utils/form-utils/ThFormUtils';

@Injectable()
export class LogInService {
	private _loginForm: ControlGroup;

	constructor( @Inject(IThHttp) private _thHttp: IThHttp, private _formBuilder: FormBuilder) {
		this.initLoginForm();
	}
	private initLoginForm() {
		this._loginForm = this._formBuilder.group({
			"email": ["", Validators.required],
			"password": ["", Validators.required]
		})
	}

	public get loginForm(): ControlGroup {
		return this._loginForm;
	}
	public set loginForm(loginForm: ControlGroup) {
		this._loginForm = loginForm;
	}

	public isValid(): boolean {
		return this.loginForm.valid;
	}
}