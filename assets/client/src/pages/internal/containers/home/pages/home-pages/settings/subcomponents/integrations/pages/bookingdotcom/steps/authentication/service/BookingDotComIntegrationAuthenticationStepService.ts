import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import {FormBuilder, FormGroup, Validators, AbstractControl, FormControl} from '@angular/forms';
import { AppContext, ThServerApi } from '../../../../../../../../../../../../../../common/utils/AppContext';
import {BookingDotComAuthenticationDO} from "../utils/BookingDotComIntegrationAuthenticationDO";

@Injectable()
export class BookingDotComIntegrationAuthenticationStepService {
	public didSubmitForm: boolean = false;
	private _form: FormGroup;

	private accountName: FormControl;
	private accountId: FormControl;
	private accountPassword: FormControl;

	constructor(private formBuilder: FormBuilder,
		private appContext: AppContext) {
        this.initForm();
	}
	private initForm() {
		this.accountName = new FormControl("", Validators.compose([Validators.required, Validators.maxLength(100)]));
		this.accountId = new FormControl("", Validators.compose([Validators.required, Validators.maxLength(100)]));
		this.accountPassword = new FormControl("", Validators.compose([Validators.required, Validators.maxLength(100)]));

		this._form = this.formBuilder.group({
			"accountName": this.accountName,
			"accountId": this.accountId,
			"accountPassword": this.accountPassword
		})
	}

	public updateFormValues(authenticationDO: BookingDotComAuthenticationDO) {
		this.accountName.setValue(authenticationDO.accountName);
		this.accountId.setValue(authenticationDO.accountId);
		this.accountPassword.setValue(authenticationDO.accountPassword);
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

		return this.appContext.thHttp.post({
			serverApi: ThServerApi.BookingDotComIntegrationConfigureAuthentication,
			body: JSON.stringify({
				accountName: this.accountName.value,
				accountId: this.accountId.value,
				accountPassword: this.accountPassword.value
			})
		}).map((authenticationObject: Object) => {
			var authenticationDO: BookingDotComAuthenticationDO = new BookingDotComAuthenticationDO();
			authenticationDO.buildFromObject(authenticationObject);
			this.updateFormValues(authenticationDO);
			return authenticationDO;
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