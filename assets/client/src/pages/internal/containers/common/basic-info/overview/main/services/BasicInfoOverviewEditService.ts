import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import {FormBuilder, ControlGroup, Validators, AbstractControl, Control} from 'angular2/common';
import {AppContext, ThServerApi, ThError} from '../../../../../../../../common/utils/AppContext';
import {ThValidators, ThFieldLengths} from '../../../../../../../../common/utils/form-utils/ThFormUtils';
import {CountriesDO} from '../../../../../../services/settings/data-objects/CountriesDO';
import {HotelAggregatedInfo} from '../../../../../../services/hotel/utils/HotelAggregatedInfo';
import {HotelDO} from '../../../../../../services/hotel/data-objects/hotel/HotelDO';
import {HotelDetailsDO} from '../../../../../../services/hotel/data-objects/HotelDetailsDO';
import {VatDetails, VatResponse} from '../../../../../../../../common/utils/components/VATComponent';
import {HotelService} from '../../../../../../services/hotel/HotelService';

@Injectable()
export class BasicInfoOverviewEditService {
	public didSubmitForm: boolean = false;
	private _overviewForm: ControlGroup;

	private _nameControl: Control;
	private _companyNameControl: Control;
	private _streetAddressControl: Control;
	private _cityControl: Control;
	private _postalCodeControl: Control;
	private _phoneControl: Control;
	private _faxControl: Control;
	private _contactNameControl: Control;
	private _websiteUrlControl: Control;
	private _emailControl: Control;
	private _facebookUrlControl: Control;
	private _linkedinUrlControl: Control;
	private _twitterUrlControl: Control;

	private _countries: CountriesDO;
	private _hotel: HotelDO;

	constructor(private _formBuilder: FormBuilder,
		private _appContext: AppContext,
		private _hotelService: HotelService) {
		this.initForm();
	}
	private initForm() {
		this._nameControl = new Control("", Validators.compose([Validators.required, Validators.maxLength(ThFieldLengths.MaxHotelNameLength)]));
		this._companyNameControl = new Control("", Validators.compose([Validators.required, Validators.maxLength(ThFieldLengths.MaxHotelNameLength)]));
		this._streetAddressControl = new Control("", Validators.compose([Validators.required, Validators.maxLength(ThFieldLengths.MaxStreetAddressLength)]));
		this._cityControl = new Control("", Validators.compose([Validators.required, Validators.maxLength(ThFieldLengths.MaxCityLength)]));
		this._postalCodeControl = new Control("", Validators.compose([Validators.required]));
		this._phoneControl = new Control("", Validators.compose([Validators.required, ThValidators.phoneValidator]));
		this._faxControl = new Control("", Validators.compose([Validators.maxLength(ThFieldLengths.MaxPhoneLength), ThValidators.nullablePhoneValidator]));
		this._contactNameControl = new Control("", Validators.compose([Validators.required, Validators.maxLength(ThFieldLengths.MaxNameLength)]));
		this._websiteUrlControl = new Control("", Validators.compose([Validators.maxLength(ThFieldLengths.MaxUrlLength), ThValidators.nullableUrlValidator]));
		this._emailControl = new Control("", Validators.compose([ThValidators.emailValidator, Validators.maxLength(ThFieldLengths.MaxUrlLength)]));
		this._facebookUrlControl = new Control("", Validators.compose([Validators.maxLength(ThFieldLengths.MaxUrlLength), ThValidators.nullableUrlValidator]));
		this._linkedinUrlControl = new Control("", Validators.compose([Validators.maxLength(ThFieldLengths.MaxUrlLength), ThValidators.nullableUrlValidator]));
		this._twitterUrlControl = new Control("", Validators.compose([Validators.maxLength(ThFieldLengths.MaxUrlLength), ThValidators.nullableUrlValidator]));

		this._overviewForm = this._formBuilder.group({
			"name": this._nameControl,
			"companyName": this._companyNameControl,
			"streetAddress": this._streetAddressControl,
			"city": this._cityControl,
			"postalCode": this._postalCodeControl,
			"phone": this._phoneControl,
			"fax": this._faxControl,
			"contactName": this._contactNameControl,
			"websiteUrl": this._websiteUrlControl,
			"email": this._emailControl,
			"facebookUrl": this._facebookUrlControl,
			"linkedinUrl": this._linkedinUrlControl,
			"twitterUrl": this._twitterUrlControl
		})
	}

	public updateFormValues(countries: CountriesDO, hotelInfo: HotelAggregatedInfo) {
		this._countries = countries;
		this._hotel = hotelInfo.hotelDetails.hotel;

		this._nameControl.updateValue(this._hotel.contactDetails.name);
		this._companyNameControl.updateValue(this._hotel.contactDetails.companyName);
		this._streetAddressControl.updateValue(this._hotel.contactDetails.address.streetAddress);
		this._cityControl.updateValue(this._hotel.contactDetails.address.city);
		this._postalCodeControl.updateValue(this._hotel.contactDetails.address.postalCode);
		this._phoneControl.updateValue(this._hotel.contactDetails.phone);
		this._faxControl.updateValue(this._hotel.contactDetails.fax);
		this._contactNameControl.updateValue(this._hotel.contactDetails.contactName);
		this._websiteUrlControl.updateValue(this._hotel.contactDetails.websiteUrl);
		this._emailControl.updateValue(this._hotel.contactDetails.email);
		this._facebookUrlControl.updateValue(this._hotel.contactDetails.socialLinks.facebookUrl);
		this._linkedinUrlControl.updateValue(this._hotel.contactDetails.socialLinks.linkedinUrl);
		this._twitterUrlControl.updateValue(this._hotel.contactDetails.socialLinks.twitterUrl);
	}
	public didChangeVatDetails(vatDetails: VatDetails) {
		this._hotel.contactDetails.address.country = this._countries.getCountryByCode(vatDetails.countryCode);
		this._hotel.contactDetails.vatCode = vatDetails.fullVat;
	}
	public didGetVatResponse(vatResponse: VatResponse) {
		this._companyNameControl.updateValue(vatResponse.companyName);
		this._streetAddressControl.updateValue(vatResponse.companyAddress);
		this._hotel.contactDetails.vatCode = vatResponse.fullVatNumber;
	}
	public didUpdateLogoUrl(logoUrl: string) {
		this._hotel.logoUrl = logoUrl;
	}
	private isValid(): boolean {
		return this._overviewForm.valid && this.validVat();
	}
	private validVat(): boolean {
		return this._hotel.contactDetails.vatCode != null && this._hotel.contactDetails.vatCode.length > 0;
	}

	public saveOverview(): Observable<any> {
		this.didSubmitForm = true;
		if (!this.isValid()) {
			var errorMessage = this._appContext.thTranslation.translate("Please complete all the required fields");
			this._appContext.toaster.error(errorMessage);
			return this.reject();
		}
		this.updateHotelFromForm();

		return new Observable<any>((observer: Observer<any>) => {
			this._hotelService.updateOverviewInfo(this._hotel).subscribe((hotel: HotelDetailsDO) => {
				observer.next(hotel);
				observer.complete();
			}, (error: ThError) => {
				this._appContext.toaster.error(error.message);
				observer.error(error);
				observer.complete();
			});
		});
	}
	private updateHotelFromForm() {
		this._hotel.contactDetails.companyName = this.overviewForm.value["companyName"];
		this._hotel.contactDetails.name = this.overviewForm.value["name"];
		this._hotel.contactDetails.address.streetAddress = this.overviewForm.value["streetAddress"];
		this._hotel.contactDetails.address.postalCode = this.overviewForm.value["postalCode"];
		this._hotel.contactDetails.address.city = this.overviewForm.value["city"];
		this._hotel.contactDetails.phone = this.overviewForm.value["phone"];
		this._hotel.contactDetails.fax = this.overviewForm.value["fax"];
		this._hotel.contactDetails.contactName = this.overviewForm.value["contactName"];
		this._hotel.contactDetails.websiteUrl = this.overviewForm.value["websiteUrl"];
		this._hotel.contactDetails.email = this.overviewForm.value["email"];
		this._hotel.contactDetails.socialLinks.facebookUrl = this.overviewForm.value["facebookUrl"];
		this._hotel.contactDetails.socialLinks.twitterUrl = this.overviewForm.value["twitterUrl"];
		this._hotel.contactDetails.socialLinks.linkedinUrl = this.overviewForm.value["linkedinUrl"];
	}
	private reject(): Observable<any> {
		return new Observable((serviceObserver: Observer<any>) => {
			serviceObserver.error(true);
			serviceObserver.complete();
		});
	}

	public get overviewForm(): ControlGroup {
		return this._overviewForm;
	}
	public set overviewForm(overviewForm: ControlGroup) {
		this._overviewForm = overviewForm;
	}
}