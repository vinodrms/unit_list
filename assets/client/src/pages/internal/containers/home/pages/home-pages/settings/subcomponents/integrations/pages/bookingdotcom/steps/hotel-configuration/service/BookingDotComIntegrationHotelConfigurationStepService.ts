import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import {FormBuilder, FormGroup, Validators, AbstractControl, FormControl} from '@angular/forms';
import { AppContext, ThServerApi } from '../../../../../../../../../../../../../../common/utils/AppContext';
import {BookingDotComHotelConfigurationDO} from "../utils/BookingDotComIntegrationHotelConfigurationDO";

@Injectable()
export class BookingDotComIntegrationHotelConfigurationStepService {

	private static HOTEL_ID_MAX_LENGTH: number = 100;
	public didSubmitForm: boolean = false;
	private _form: FormGroup;

	private hotelId: FormControl;

	constructor(private formBuilder: FormBuilder,
		private appContext: AppContext) {
        this.initForm();
	}
	private initForm() {
		this.hotelId = new FormControl("", Validators.compose([Validators.required, Validators.maxLength(BookingDotComIntegrationHotelConfigurationStepService.HOTEL_ID_MAX_LENGTH)]));

		this._form = this.formBuilder.group({
			"hotelId": this.hotelId
		})
	}

	public updateFormValues(hotelConfiguration: BookingDotComHotelConfigurationDO) {
		this.hotelId.setValue(hotelConfiguration.hotelId);
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
			serverApi: ThServerApi.BookingDotComIntegrationConfigureHotel,
			body: JSON.stringify({
				hotelId: this.hotelId.value
			})
		}).map((hotelConfiguration: Object) => {
			var hotelConfigurationDO: BookingDotComHotelConfigurationDO = new BookingDotComHotelConfigurationDO();
			hotelConfigurationDO.buildFromObject(hotelConfiguration);
			this.updateFormValues(hotelConfigurationDO);
			return hotelConfigurationDO;
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