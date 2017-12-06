import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import {FormBuilder, FormGroup, Validators, AbstractControl, FormControl} from '@angular/forms';
import { AppContext } from '../../../../../../../../../../../../../../common/utils/AppContext';

@Injectable()
export class BookingDotComIntegrationAuthenticationStepService {
	public didSubmitForm: boolean = false;
	private _form: FormGroup;

	private _accountName: FormControl;
	private _accountId: FormControl;
	private _accountPassword: FormControl;

	constructor(private formBuilder: FormBuilder,
		private appContext: AppContext) {
        this.initForm();
        this.updateFormValues();
	}
	private initForm() {
		this._accountName = new FormControl("", Validators.compose([Validators.required, Validators.maxLength(100)]));
		this._accountId = new FormControl("", Validators.compose([Validators.required, Validators.maxLength(100)]));
		this._accountPassword = new FormControl("", Validators.compose([Validators.required, Validators.maxLength(100)]));

		this._form = this.formBuilder.group({
			"accountName": this._accountName,
			"accountId": this._accountId,
			"accountPassword": this._accountPassword
		})
	}

	public updateFormValues() {
		this._accountName.setValue("account name test");
		this._accountId.setValue("account id test");
		this._accountPassword.setValue("account password test");
    }
    
	private isValid(): boolean {
		return this._form.valid;
	}

	public saveForm(): Observable<any> {
		this.didSubmitForm = true;
		if (!this.isValid()) {
			var errorMessage = this.appContext.thTranslation.translate("Please complete all the required fields");
			this.appContext.toaster.error(errorMessage);
			return this.reject();
		}

		return new Observable<any>((observer: Observer<any>) => {
				observer.complete();
		});
	}

	private reject(): Observable<any> {
		return new Observable((serviceObserver: Observer<any>) => {
			serviceObserver.error(true);
			serviceObserver.complete();
		});
	}

	public get form(): FormGroup {
		return this._form;
	}
	public set form(form: FormGroup) {
		this._form = form;
	}
}