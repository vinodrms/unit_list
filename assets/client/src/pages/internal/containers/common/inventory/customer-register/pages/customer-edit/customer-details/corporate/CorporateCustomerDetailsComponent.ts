import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BaseFormComponent } from '../../../../../../../../../../common/base/BaseFormComponent';
import { CorporateDetailsDO } from '../../../../../../../../services/customers/data-objects/customer-details/CorporateDetailsDO';
import { VatDetails, VatResponse } from '../../../../../../../../../../common/utils/components/VATComponent';
import { CountriesDO } from '../../../../../../../../services/settings/data-objects/CountriesDO';
import { CorporateDetailsFormBuilderService } from './services/CorporateDetailsFormBuilderService';
import { CurrencyDO } from '../../../../../../../../services/common/data-objects/currency/CurrencyDO';
import { CommissionDO } from "../../../../../../../../services/common/data-objects/commission/CommissionDO";
import { ContactDetailsDO } from "../../../../../../../../services/customers/data-objects/customer-details/ContactDetailsDO";
import { AppContext } from "../../../../../../../../../../common/utils/AppContext";

import * as _ from "underscore";

@Component({
	selector: 'corporate-customer-details',
	templateUrl: '/client/src/pages/internal/containers/common/inventory/customer-register/pages/customer-edit/customer-details/corporate/template/corporate-customer-details.html',
	providers: [CorporateDetailsFormBuilderService]
})
export class CorporateCustomerDetailsComponent extends BaseFormComponent {
	@Input() didSubmit: boolean;

	private _corporateDetails: CorporateDetailsDO;
	public get corporateDetails(): CorporateDetailsDO {
		return this._corporateDetails;
	}
	@Input()
	public set corporateDetails(corporateDetails: CorporateDetailsDO) {
		if (!corporateDetails) {
			return;
		}
		this._corporateDetails = corporateDetails;
		this.initPage();
	}

	countriesDO: CountriesDO;
	currency: CurrencyDO;
	vatDetails: VatDetails;
	currentContactDetails: ContactDetailsDO;

	constructor(private _formBuilder: CorporateDetailsFormBuilderService, private _appContext: AppContext) {
		super();
	}

	private initPage() {
		this.vatDetails = {
			countryCode: this._corporateDetails.address.country.code,
			fullVat: this._corporateDetails.vatCode
		}
		this._formBuilder.updateControlValuesFrom(this._corporateDetails);
	}
	public didChangeVatDetails(vatDetails: VatDetails) {
		this._corporateDetails.address.country = this.countriesDO.getCountryByCode(vatDetails.countryCode);
		this._corporateDetails.vatCode = vatDetails.fullVat;
	}
	public didGetVatResponse(vatResponse: VatResponse) {
		this._formBuilder.updateCompanyNameAndAddress(vatResponse.companyName, vatResponse.companyAddress);
	}

	protected get didSubmitForm(): boolean {
		return this.didSubmit;
	}
	protected getDefaultFormGroup(): FormGroup {
		return this._formBuilder.individualFormGroup;
	}
	public get contactDetailsFormGroup(): FormGroup {
		return this._formBuilder.contactDetailsFormGroup;
	}

	public get payInvoiceByAgreement(): boolean {
		return this._formBuilder.payInvoiceByAgreement;
	}
	public set payInvoiceByAgreement(payInvoiceByAgreement: boolean) {
		this._formBuilder.payInvoiceByAgreement = payInvoiceByAgreement;
	}
	public get isFixedCommission(): boolean {
		return this._formBuilder.isFixedCommission;
	}
	public set isFixedCommission(isFixedCommission: boolean) {
		this._formBuilder.isFixedCommission = isFixedCommission;
	}
	public get receiveBookingConfirmations(): boolean {
		return this._formBuilder.receiveBookingConfirmations;
	}
	public set receiveBookingConfirmations(receiveBookingConfirmations: boolean) {
		this._formBuilder.receiveBookingConfirmations = receiveBookingConfirmations;
	}

	public isValid(): boolean {
		return this._formBuilder.individualFormGroup.valid && this._corporateDetails.address.country != null && _.isString(this._corporateDetails.address.country.code);
	}
	public getCustomerDetails(): CorporateDetailsDO {
		this._formBuilder.updateControlValuesOn(this._corporateDetails);
		return this._corporateDetails;
	}
	public get currencyNativeSymbol(): string {
		if (!this.currency) {
			return "";
		}
		return this.currency.nativeSymbol;
	}
	public selectContactDetails(contactDetails: ContactDetailsDO) {
		this.currentContactDetails = contactDetails;
		this._formBuilder.updateCompanyContactDetailsFrom(contactDetails);
	}
	public removeContactDetails(contactDetailsToRemove: ContactDetailsDO) {
		var index = this._corporateDetails.contactDetailsList.indexOf(contactDetailsToRemove);
		if (index >= 0) {
			this._corporateDetails.contactDetailsList.splice(index, 1);
		}
		this.currentContactDetails = null;
	}
	public addContactDetails() {
		this.currentContactDetails = new ContactDetailsDO();
		this._formBuilder.updateCompanyContactDetailsFrom(this.currentContactDetails);
	}
	public saveContactDetails() {
		this._formBuilder.updateContactDetailsValuesOn(this.currentContactDetails);
		if (!this._formBuilder.contactDetailsFormGroup.valid) {
			var errorMessage = this._appContext.thTranslation.translate("Please complete all the required fields");
			this._appContext.toaster.error(errorMessage);
			return;
		}
		var index = this._corporateDetails.contactDetailsList.indexOf(this.currentContactDetails);
		if (index >= 0) {
			this._corporateDetails.contactDetailsList[index] = this.currentContactDetails;
		} else {
			this._corporateDetails.contactDetailsList.push(this.currentContactDetails);
		}
		this.currentContactDetails = null;
	}
}