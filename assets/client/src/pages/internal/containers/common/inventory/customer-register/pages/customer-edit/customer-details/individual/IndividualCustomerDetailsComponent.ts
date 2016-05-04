import {Component, Input} from '@angular/core';
import {ControlGroup} from '@angular/common';
import {BaseFormComponent} from '../../../../../../../../../../common/base/BaseFormComponent';
import {TranslationPipe} from '../../../../../../../../../../common/utils/localization/TranslationPipe';
import {ThDatePickerComponent} from '../../../../../../../../../../common/utils/components/ThDatePickerComponent';
import {IndividualDetailsDO} from '../../../../../../../../services/customers/data-objects/customer-details/IndividualDetailsDO';
import {ThDateDO} from '../../../../../../../../services/common/data-objects/th-dates/ThDateDO';
import {CountriesDO} from '../../../../../../../../services/settings/data-objects/CountriesDO';
import {CountryDO} from '../../../../../../../../services/common/data-objects/country/CountryDO';
import {IndividualDetailsFormBuilderService} from './services/IndividualDetailsFormBuilderService';

@Component({
	selector: 'individual-customer-details',
	templateUrl: '/client/src/pages/internal/containers/common/inventory/customer-register/pages/customer-edit/customer-details/individual/template/individual-customer-details.html',
	providers: [IndividualDetailsFormBuilderService],
	directives: [ThDatePickerComponent],
	pipes: [TranslationPipe]
})

export class IndividualCustomerDetailsComponent extends BaseFormComponent {
	didInit: boolean = false;
	private _countriesDO: CountriesDO;
	invalidCountryCode = "-1";
	countryCode: string;

	@Input() didSubmit: boolean;

	private _individualDetails: IndividualDetailsDO;
	public get individualDetails(): IndividualDetailsDO {
		return this._individualDetails;
	}
	@Input()
	public set individualDetails(individualDetails: IndividualDetailsDO) {
		if (!individualDetails) {
			return;
		}
		this._individualDetails = individualDetails;
		this.initPage();
	}

	constructor(private _formBuilder: IndividualDetailsFormBuilderService) {
		super();
	}
	
	private initPage() {
		this.countryCode = this._individualDetails.address.country.code;
		if (!this.countryCode) {
			this.countryCode = this.invalidCountryCode;
		}
		this._formBuilder.updateControlValuesFrom(this._individualDetails);
		this.didInit = true;
	}

	protected didSelectBirthday(birthday: ThDateDO) {
		this._individualDetails.birthday = birthday;
	}

	public get countriesDO(): CountriesDO {
		return this._countriesDO;
	}
	public set countriesDO(countriesDO: CountriesDO) {
		this._countriesDO = countriesDO;
	}

	protected get countryList(): CountryDO[] {
		if (!this._countriesDO) {
			return [];
		}
		this._countriesDO.countryList[0].code
		return this._countriesDO.countryList;
	}

	protected didChangeCountryCode(countryCode: string) {
		this._individualDetails.address.country = this._countriesDO.getCountryByCode(countryCode);
	}
	protected get didSubmitForm(): boolean {
		return this.didSubmit;
	}

	protected getDefaultControlGroup(): ControlGroup {
		return this._formBuilder.individualFormGroup;
	}

	public isValid(): boolean {
		return this._formBuilder.individualFormGroup.valid;
	}
	public getCustomerDetails(): IndividualDetailsDO {
		this._formBuilder.updateControlValuesOn(this._individualDetails);
		return this._individualDetails;
	}
}