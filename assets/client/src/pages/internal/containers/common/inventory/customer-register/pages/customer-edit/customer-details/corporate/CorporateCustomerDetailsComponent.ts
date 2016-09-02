import {Component, Input} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {BaseFormComponent} from '../../../../../../../../../../common/base/BaseFormComponent';
import {TranslationPipe} from '../../../../../../../../../../common/utils/localization/TranslationPipe';
import {CorporateDetailsDO} from '../../../../../../../../services/customers/data-objects/customer-details/CorporateDetailsDO';
import {VATComponent, VatDetails, VatResponse} from '../../../../../../../../../../common/utils/components/VATComponent';
import {CountriesDO} from '../../../../../../../../services/settings/data-objects/CountriesDO';
import {CorporateDetailsFormBuilderService} from './services/CorporateDetailsFormBuilderService';
import {CurrencyDO} from '../../../../../../../../services/common/data-objects/currency/CurrencyDO';

@Component({
	selector: 'corporate-customer-details',
	templateUrl: '/client/src/pages/internal/containers/common/inventory/customer-register/pages/customer-edit/customer-details/corporate/template/corporate-customer-details.html',
	directives: [VATComponent],
	providers: [CorporateDetailsFormBuilderService],
	pipes: [TranslationPipe]
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

	constructor(private _formBuilder: CorporateDetailsFormBuilderService) {
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
		return this._formBuilder.individualFormGroup.valid && this._corporateDetails.address.country != null && this._corporateDetails.vatCode != null;
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
}