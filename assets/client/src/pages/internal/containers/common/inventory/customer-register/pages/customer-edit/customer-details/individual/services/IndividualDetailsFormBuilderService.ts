import {Injectable} from '@angular/core';
import {FormBuilder, FormGroup, Validators, AbstractControl, FormControl} from '@angular/forms';
import {ThValidators, ThFieldLengths} from '../../../../../../../../../../../common/utils/form-utils/ThFormUtils';
import {IndividualDetailsDO} from '../../../../../../../../../services/customers/data-objects/customer-details/IndividualDetailsDO';
import {ContactDetailsDO} from '../../../../../../../../../services/customers/data-objects/customer-details/ContactDetailsDO';

@Injectable()
export class IndividualDetailsFormBuilderService {
	private _individualFormGroup: FormGroup;

	private _firstNameControl: FormControl;
	private _lastNameControl: FormControl;
	private _passportNoControl: FormControl;
	private _cityControl: FormControl;
	private _streetAddressControl: FormControl;
	private _postalCodeControl: FormControl;
	private _emailControl: FormControl;
	private _phoneControl: FormControl;

	constructor(private _formBuilder: FormBuilder) {
		this.initFormControls();
		this.initFormGroup();
	}
	private initFormControls() {
		this._firstNameControl = new FormControl(null, Validators.compose([Validators.required, Validators.maxLength(ThFieldLengths.MaxNameLength)]));
		this._lastNameControl = new FormControl(null, Validators.compose([Validators.required, Validators.maxLength(ThFieldLengths.MaxNameLength)]));
		this._passportNoControl = new FormControl(null, Validators.compose([Validators.maxLength(100)]));
		this._cityControl = new FormControl(null, Validators.compose([Validators.maxLength(ThFieldLengths.MaxCityLength)]));
		this._streetAddressControl = new FormControl(null, Validators.compose([Validators.maxLength(ThFieldLengths.MaxStreetAddressLength)]));
		this._postalCodeControl = new FormControl(null, Validators.compose([Validators.maxLength(50)]));
		this._emailControl = new FormControl(null, Validators.compose([ThValidators.nullableEmailValidator]));
		this._phoneControl = new FormControl(null, Validators.compose([ThValidators.nullablePhoneValidator]));
	}

	private initFormGroup() {
		this._individualFormGroup = this._formBuilder.group({
			"firstName": this._firstNameControl,
			"lastName": this._lastNameControl,
			"passportNo": this._passportNoControl,
			"city": this._cityControl,
			"streetAddress": this._streetAddressControl,
			"postalCode": this._postalCodeControl,
			"email": this._emailControl,
			"phone": this._phoneControl
		});
	}

	public updateControlValuesFrom(individualDetails: IndividualDetailsDO) {
		this._firstNameControl.setValue(individualDetails.firstName);
		this._lastNameControl.setValue(individualDetails.lastName);
		this._passportNoControl.setValue(individualDetails.passportNo);
		this._cityControl.setValue(individualDetails.address.city);
		this._streetAddressControl.setValue(individualDetails.address.streetAddress);
		this._postalCodeControl.setValue(individualDetails.address.postalCode);
		(individualDetails.getContactDetailsList() && individualDetails.getContactDetailsList().length > 0) ?
			this._emailControl.setValue(individualDetails.getContactDetailsList()[0].email) : "";
		(individualDetails.getContactDetailsList() && individualDetails.getContactDetailsList().length > 0) ?
			this._phoneControl.setValue(individualDetails.getContactDetailsList()[0].phone) : "";
	}
	public updateControlValuesOn(individualDetails: IndividualDetailsDO) {
		individualDetails.firstName = this._firstNameControl.value;
		individualDetails.lastName = this._lastNameControl.value;
		individualDetails.passportNo = this._passportNoControl.value;
		individualDetails.address.city = this._cityControl.value;
		individualDetails.address.streetAddress = this._streetAddressControl.value;
		individualDetails.address.postalCode = this._postalCodeControl.value;
		var contactDetails = new ContactDetailsDO();
		contactDetails.email = this._emailControl.value;
		contactDetails.phone = this._phoneControl.value;
		individualDetails.contactDetailsList = [contactDetails];
	}

	public get individualFormGroup(): FormGroup {
		return this._individualFormGroup;
	}
	public set individualFormGroup(individualFormGroup: FormGroup) {
		this._individualFormGroup = individualFormGroup;
	}
}