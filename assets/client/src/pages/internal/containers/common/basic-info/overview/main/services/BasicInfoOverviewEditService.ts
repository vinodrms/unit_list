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
	private _companyNameControl: Control;
	private _streetAddressControl: Control;

	private _countries: CountriesDO;
	private _hotel: HotelDO;

	constructor(private _formBuilder: FormBuilder,
		private _appContext: AppContext,
		private _hotelService: HotelService) {
	}

	public initForm(countries: CountriesDO, hotelInfo: HotelAggregatedInfo) {
		this._countries = countries;
		this._hotel = hotelInfo.hotelDetails.hotel;

		this._companyNameControl = new Control(this._hotel.contactDetails.companyName, Validators.compose([Validators.required, Validators.maxLength(ThFieldLengths.MaxHotelNameLength)]));
		this._streetAddressControl = new Control(this._hotel.contactDetails.address.streetAddress, Validators.compose([Validators.required, Validators.maxLength(ThFieldLengths.MaxStreetAddressLength)]));
		this._overviewForm = this._formBuilder.group({
			"name": [this._hotel.contactDetails.name, Validators.compose([Validators.required, Validators.maxLength(ThFieldLengths.MaxHotelNameLength)])],
			"companyName": this._companyNameControl,
			"streetAddress": this._streetAddressControl,
			"city": [this._hotel.contactDetails.address.city, Validators.compose([Validators.required, Validators.maxLength(ThFieldLengths.MaxCityLength)])],
			"postalCode": [this._hotel.contactDetails.address.postalCode, Validators.compose([Validators.required])],
			"phone": [this._hotel.contactDetails.phone, Validators.compose([Validators.required, ThValidators.phoneValidator])],
			"fax": [this._hotel.contactDetails.fax, Validators.compose([Validators.maxLength(ThFieldLengths.MaxPhoneLength), ThValidators.nullablePhoneValidator])],
			"contactName": [this._hotel.contactDetails.contactName, Validators.compose([Validators.maxLength(ThFieldLengths.MaxNameLength)])],
			"websiteUrl": [this._hotel.contactDetails.websiteUrl, Validators.compose([Validators.maxLength(ThFieldLengths.MaxUrlLength), ThValidators.nullableUrlValidator])],
			"email": [this._hotel.contactDetails.email, Validators.compose([ThValidators.emailValidator, Validators.maxLength(ThFieldLengths.MaxUrlLength)])],
			"facebookUrl": [this._hotel.contactDetails.socialLinks.facebookUrl, Validators.compose([Validators.maxLength(ThFieldLengths.MaxUrlLength), ThValidators.nullableUrlValidator])],
			"linkedinUrl": [this._hotel.contactDetails.socialLinks.linkedinUrl, Validators.compose([Validators.maxLength(ThFieldLengths.MaxUrlLength), ThValidators.nullableUrlValidator])],
			"twitterUrl": [this._hotel.contactDetails.socialLinks.twitterUrl, Validators.compose([Validators.maxLength(ThFieldLengths.MaxUrlLength), ThValidators.nullableUrlValidator])]
		})
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