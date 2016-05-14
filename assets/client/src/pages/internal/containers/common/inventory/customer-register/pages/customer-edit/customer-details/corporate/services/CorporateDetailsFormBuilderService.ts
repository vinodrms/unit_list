import {Injectable} from '@angular/core';
import {FormBuilder, ControlGroup, Validators, AbstractControl, Control} from '@angular/common';
import {ThValidators, ThFieldLengths} from '../../../../../../../../../../../common/utils/form-utils/ThFormUtils';
import {CorporateDetailsDO, CommissionType} from '../../../../../../../../../services/customers/data-objects/customer-details/CorporateDetailsDO';

@Injectable()
export class CorporateDetailsFormBuilderService {
	private _corporateFormGroup: ControlGroup;

	private _governmentCodeControl: Control;
	private _nameControl: Control;
	private _streetAddressControl: Control;
	private _cityControl: Control;
	private _postalCodeControl: Control;
	private _websiteUrlControl: Control;
	private _contactNameControl: Control;
	private _phoneControl: Control;
	private _faxControl: Control;
	private _emailControl: Control;
	private _invoiceFeeControl: Control;
	private _accountNoControl: Control;
	private _commissionControl: Control;

	private _payInvoiceByAgreement: boolean;
	private _isFixedCommission: boolean;

	constructor(private _formBuilder: FormBuilder) {
		this.initFormControls();
		this.initFormGroup();
	}
	private initFormControls() {
		this._governmentCodeControl = new Control(null, Validators.compose([Validators.maxLength(200)]));
		this._nameControl = new Control(null, Validators.compose([Validators.required, Validators.maxLength(ThFieldLengths.MaxNameLength)]));
		this._streetAddressControl = new Control(null, Validators.compose([Validators.maxLength(ThFieldLengths.MaxStreetAddressLength)]));
		this._cityControl = new Control(null, Validators.compose([Validators.maxLength(ThFieldLengths.MaxCityLength)]));
		this._postalCodeControl = new Control(null, Validators.compose([Validators.maxLength(50)]));
		this._websiteUrlControl = new Control(null, Validators.compose([Validators.maxLength(ThFieldLengths.MaxUrlLength), ThValidators.nullableUrlValidator]));
		this._contactNameControl = new Control(null, Validators.compose([Validators.maxLength(ThFieldLengths.MaxNameLength)]));
		this._phoneControl = new Control(null, Validators.compose([ThValidators.nullablePhoneValidator]));
		this._faxControl = new Control(null, Validators.compose([ThValidators.nullablePhoneValidator]));
		this._emailControl = new Control(null, Validators.compose([ThValidators.nullableEmailValidator]));
		this._invoiceFeeControl = new Control(null);
		this._accountNoControl = new Control(null, Validators.compose([Validators.maxLength(200)]));
		this._commissionControl = new Control();
	}

	private initFormGroup() {
		this._corporateFormGroup = this._formBuilder.group({
			"governmentCode": this._governmentCodeControl,
			"name": this._nameControl,
			"streetAddress": this._streetAddressControl,
			"city": this._cityControl,
			"postalCode": this._postalCodeControl,
			"websiteUrl": this._websiteUrlControl,
			"contactName": this._contactNameControl,
			"phone": this._phoneControl,
			"fax": this._faxControl,
			"email": this._emailControl,
			"invoiceFee": this._invoiceFeeControl,
			"accountNo": this._accountNoControl,
			"commission": this._commissionControl
		});
	}

	public updateControlValuesFrom(corporateDetails: CorporateDetailsDO) {
		this._governmentCodeControl.updateValue(corporateDetails.governmentCode);
		this._nameControl.updateValue(corporateDetails.name);
		this._streetAddressControl.updateValue(corporateDetails.address.streetAddress);
		this._cityControl.updateValue(corporateDetails.address.city);
		this._postalCodeControl.updateValue(corporateDetails.address.postalCode);
		this._websiteUrlControl.updateValue(corporateDetails.websiteUrl);
		this._contactNameControl.updateValue(corporateDetails.contactName);
		this._phoneControl.updateValue(corporateDetails.phone);
		this._faxControl.updateValue(corporateDetails.fax);
		this._emailControl.updateValue(corporateDetails.email);
		this._accountNoControl.updateValue(corporateDetails.accountNo);

		this.payInvoiceByAgreement = corporateDetails.payInvoiceByAgreement;
		this._invoiceFeeControl.updateValue(corporateDetails.invoiceFee);
		
		var isFixedCommission = corporateDetails.commissionType === CommissionType.Fixed;
		if (!corporateDetails.commission || isFixedCommission) {
			this._commissionControl.updateValue(corporateDetails.commission);
		}
		else {
			this._commissionControl.updateValue(Math.round(corporateDetails.commission * 100));
		}
		this.isFixedCommission = isFixedCommission;
	}
	public updateControlValuesOn(corporateDetails: CorporateDetailsDO) {
		corporateDetails.governmentCode = this._governmentCodeControl.value;
		corporateDetails.name = this._nameControl.value;
		corporateDetails.address.streetAddress = this._streetAddressControl.value;
		corporateDetails.address.city = this._cityControl.value;
		corporateDetails.address.postalCode = this._postalCodeControl.value;
		corporateDetails.websiteUrl = this._websiteUrlControl.value;
		corporateDetails.contactName = this._contactNameControl.value;
		corporateDetails.phone = this._phoneControl.value;
		corporateDetails.fax = this._faxControl.value;
		corporateDetails.email = this._emailControl.value;
		corporateDetails.invoiceFee = this._invoiceFeeControl.value;
		corporateDetails.accountNo = this._accountNoControl.value;
		corporateDetails.payInvoiceByAgreement = this._payInvoiceByAgreement;
		corporateDetails.commissionType = this._isFixedCommission ? CommissionType.Fixed: CommissionType.Percentage;
		
		var commissionValue = this._commissionControl.value;
		if(!this._isFixedCommission && commissionValue != null) {
			commissionValue = commissionValue / 100;
		}
		corporateDetails.commission = commissionValue;
	}

	public get individualFormGroup(): ControlGroup {
		return this._corporateFormGroup;
	}
	public set individualFormGroup(individualFormGroup: ControlGroup) {
		this._corporateFormGroup = individualFormGroup;
	}

	public get payInvoiceByAgreement(): boolean {
		return this._payInvoiceByAgreement;
	}
	public set payInvoiceByAgreement(payInvoiceByAgreement: boolean) {
		this._payInvoiceByAgreement = payInvoiceByAgreement;
		if(payInvoiceByAgreement) {
			this._invoiceFeeControl.validator = ThValidators.priceValidator;
		}
		else {
			this._invoiceFeeControl.validator = ThValidators.nullablePriceValidator;
		}
		this._invoiceFeeControl.updateValueAndValidity();
	}
	public get isFixedCommission(): boolean {
		return this._isFixedCommission;
	}
	public set isFixedCommission(isFixedCommission: boolean) {
		this._isFixedCommission = isFixedCommission;
		if(isFixedCommission) {
			this._commissionControl.validator = ThValidators.nullablePriceValidator;
		}
		else {
			this._commissionControl.validator = ThValidators.nullablePercentageValidator;
		}
		this._commissionControl.updateValueAndValidity();
	}
	public updateCompanyNameAndAddress(companyName: string, streetAddress: string) {
		this._nameControl.updateValue(companyName);
		this._streetAddressControl.updateValue(streetAddress);
	}
}