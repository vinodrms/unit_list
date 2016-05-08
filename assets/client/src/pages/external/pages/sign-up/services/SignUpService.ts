import {Injectable} from '@angular/core';
import {FormBuilder, ControlGroup, Validators} from '@angular/common';
import {Observable} from 'rxjs/Observable';
import {AppContext, ThServerApi} from '../../../../../common/utils/AppContext';
import {ThValidators, ThFieldLengths} from '../../../../../common/utils/form-utils/ThFormUtils';
import {SignUpDO} from '../data-objects/SignUpDO';

@Injectable()
export class SignUpService {
	private _signUpForm;

	constructor(private _appContext: AppContext, private _formBuilder: FormBuilder) {
		this.initSignUpForm();
	}
	private initSignUpForm() {
		this._signUpForm = this._formBuilder.group({
			"hotelName": ["", Validators.compose([Validators.required, Validators.maxLength(ThFieldLengths.MaxHotelNameLength)])],
			"email": ["", Validators.compose([Validators.required, ThValidators.emailValidator])],
			"password": ["", Validators.compose([Validators.required, ThValidators.passwordValidator])],
			"passwordConfirmation": ["", Validators.compose([Validators.required, ThValidators.passwordValidator])],
			"firstName": ["", Validators.compose([Validators.required, Validators.maxLength(ThFieldLengths.MaxNameLength)])],
			"lastName": ["", Validators.compose([Validators.required, Validators.maxLength(ThFieldLengths.MaxNameLength)])]
		})
	}
	public isValid(): boolean {
		return this._signUpForm.valid && this.passwordsMatch();
	}
	private getSignUpDO(): SignUpDO {
		var signUpDO = new SignUpDO();
		signUpDO.buildFromObject(this._signUpForm.value);
		return signUpDO;
	}
	private passwordsMatch(): boolean {
		var signUpDO = this.getSignUpDO();
		return signUpDO.password === signUpDO.passwordConfirmation;
	}
	public signUp(): Observable<any> {
		var signUpDO = this.getSignUpDO();
		return this._appContext.thHttp.post(ThServerApi.AccountSignUp, { accountData: signUpDO });
	}

	public get signUpForm(): ControlGroup {
		return this._signUpForm;
	}
	public set signUpForm(signUpForm: ControlGroup) {
		this._signUpForm = signUpForm;
	}
}