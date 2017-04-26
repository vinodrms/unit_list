import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormControl } from '@angular/forms';
import { ThValidators, ThFieldLengths } from '../../../../../../../../../../../common/utils/form-utils/ThFormUtils';
import { CorporateDetailsDO } from '../../../../../../../../../services/customers/data-objects/customer-details/CorporateDetailsDO';
import { CommissionType } from '../../../../../../../../../services/common/data-objects/commission/CommissionDO';
import { ContactDetailsDO } from '../../../../../../../../../services/customers/data-objects/customer-details/ContactDetailsDO';

@Injectable()
export class CorporateDetailsFormBuilderService {
	private _corporateFormGroup: FormGroup;

	private _governmentCodeControl: FormControl;
	private _nameControl: FormControl;
	private _streetAddressControl: FormControl;
	private _cityControl: FormControl;
	private _postalCodeControl: FormControl;
	private _websiteUrlControl: FormControl;
	private _contactNameControl: FormControl;
	private _phoneControl: FormControl;
	private _faxControl: FormControl;
	private _emailControl: FormControl;
	private _invoiceFeeControl: FormControl;
	private _accountNoControl: FormControl;
	private _commissionControl: FormControl;
	private _commissionDeductedControl: FormControl;

	private _payInvoiceByAgreement: boolean;
	private _isFixedCommission: boolean;
	private _receiveBookingConfirmations: boolean;

	constructor(private _formBuilder: FormBuilder) {
		this.initFormControls();
		this.initFormGroup();
	}
	private initFormControls() {
		this._governmentCodeControl = new FormControl(null, Validators.compose([Validators.maxLength(200)]));
		this._nameControl = new FormControl(null, Validators.compose([Validators.required, Validators.maxLength(ThFieldLengths.MaxNameLength)]));
		this._streetAddressControl = new FormControl(null, Validators.compose([Validators.maxLength(ThFieldLengths.MaxStreetAddressLength)]));
		this._cityControl = new FormControl(null, Validators.compose([Validators.maxLength(ThFieldLengths.MaxCityLength)]));
		this._postalCodeControl = new FormControl(null, Validators.compose([Validators.maxLength(50)]));
		this._websiteUrlControl = new FormControl(null, Validators.compose([Validators.maxLength(ThFieldLengths.MaxUrlLength), ThValidators.nullableUrlValidator]));
		this._contactNameControl = new FormControl(null, Validators.compose([Validators.maxLength(ThFieldLengths.MaxNameLength)]));
		this._phoneControl = new FormControl(null, Validators.compose([ThValidators.nullablePhoneValidator]));
		this._faxControl = new FormControl(null, Validators.compose([ThValidators.nullablePhoneValidator]));
		this._emailControl = new FormControl(null, Validators.compose([ThValidators.nullableEmailValidator]));
		this._invoiceFeeControl = new FormControl(null);
		this._accountNoControl = new FormControl(null, Validators.compose([Validators.maxLength(200)]));
		this._commissionControl = new FormControl();
		this._commissionDeductedControl = new FormControl(false);
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
			"commission": this._commissionControl,
			"commissionDeducted": this._commissionDeductedControl
		});
	}

	public updateControlValuesFrom(corporateDetails: CorporateDetailsDO) {
		this._governmentCodeControl.setValue(corporateDetails.governmentCode);
		this._nameControl.setValue(corporateDetails.name);
		this._streetAddressControl.setValue(corporateDetails.address.streetAddress);
		this._cityControl.setValue(corporateDetails.address.city);
		this._postalCodeControl.setValue(corporateDetails.address.postalCode);
		this._websiteUrlControl.setValue(corporateDetails.websiteUrl);
		this._accountNoControl.setValue(corporateDetails.accountNo);

		this.payInvoiceByAgreement = corporateDetails.payInvoiceByAgreement;
		this._invoiceFeeControl.setValue(corporateDetails.invoiceFee);

		var isFixedCommission = corporateDetails.commission.type === CommissionType.Fixed;
		if (!corporateDetails.commission || isFixedCommission) {
			this._commissionControl.setValue(corporateDetails.commission.amount);
		}
		else {
			this._commissionControl.setValue(Math.round(corporateDetails.commission.amount * 100));
		}
		this._commissionDeductedControl.setValue(corporateDetails.commission.deducted);
		this.isFixedCommission = isFixedCommission;
		this.receiveBookingConfirmations = corporateDetails.receiveBookingConfirmations;
	}
	public updateControlValuesOn(corporateDetails: CorporateDetailsDO) {
		corporateDetails.governmentCode = this._governmentCodeControl.value;
		corporateDetails.name = this._nameControl.value;
		corporateDetails.address.streetAddress = this._streetAddressControl.value;
		corporateDetails.address.city = this._cityControl.value;
		corporateDetails.address.postalCode = this._postalCodeControl.value;
		corporateDetails.websiteUrl = this._websiteUrlControl.value;
		corporateDetails.invoiceFee = this._invoiceFeeControl.value;
		corporateDetails.accountNo = this._accountNoControl.value;
		corporateDetails.payInvoiceByAgreement = this._payInvoiceByAgreement;
		corporateDetails.receiveBookingConfirmations = this._receiveBookingConfirmations;
		corporateDetails.commission.type = this._isFixedCommission ? CommissionType.Fixed : CommissionType.Percentage;

		var commissionValue = this._commissionControl.value;
		if (!this._isFixedCommission && commissionValue != null) {
			commissionValue = commissionValue / 100;
		}
		corporateDetails.commission.amount = commissionValue;
		corporateDetails.commission.deducted = this._commissionDeductedControl.value;
	}

	public get individualFormGroup(): FormGroup {
		return this._corporateFormGroup;
	}
	public set individualFormGroup(individualFormGroup: FormGroup) {
		this._corporateFormGroup = individualFormGroup;
	}

	public get payInvoiceByAgreement(): boolean {
		return this._payInvoiceByAgreement;
	}
	public set payInvoiceByAgreement(payInvoiceByAgreement: boolean) {
		this._payInvoiceByAgreement = payInvoiceByAgreement;
		if (payInvoiceByAgreement) {
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
		if (isFixedCommission) {
			this._commissionControl.validator = ThValidators.nullablePriceValidator;
		}
		else {
			this._commissionControl.validator = ThValidators.nullablePercentageValidator;
		}
		this._commissionControl.updateValueAndValidity();
	}
	public get receiveBookingConfirmations(): boolean {
		return this._receiveBookingConfirmations;
	}
	public set receiveBookingConfirmations(receiveBookingConfirmations: boolean) {
		this._receiveBookingConfirmations = receiveBookingConfirmations;
	}
	public updateCompanyNameAndAddress(companyName: string, streetAddress: string) {
		this._nameControl.setValue(companyName);
		this._streetAddressControl.setValue(streetAddress);
	}
	public updateCompanyContactDetailsFrom(contactDetails: ContactDetailsDO) {
		this._contactNameControl.setValue(contactDetails.contactName);
		this._emailControl.setValue(contactDetails.email);
		this._faxControl.setValue(contactDetails.fax);
		this._phoneControl.setValue(contactDetails.phone);
	}
	public updateContactDetailsValuesOn(contactDetails: ContactDetailsDO) {
		contactDetails.contactName = this._contactNameControl.value;
		contactDetails.email = this._emailControl.value;
		contactDetails.fax = this._faxControl.value;
		contactDetails.phone = this._phoneControl.value;

	}
}