import { Component, OnInit, Input } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';
import { BaseFormComponent } from '../../../../../../../common/base/BaseFormComponent';
import { ThError, AppContext } from '../../../../../../../common/utils/AppContext';
import { CurrenciesService } from '../../../../../services/settings/CurrenciesService';
import { CurrenciesDO } from '../../../../../services/settings/data-objects/CurrenciesDO';
import { HotelAggregatorService } from '../../../../../services/hotel/HotelAggregatorService';
import { HotelAggregatedInfo } from '../../../../../services/hotel/utils/HotelAggregatedInfo';
import { HotelDO } from '../../../../../services/hotel/data-objects/hotel/HotelDO';
import { BasicInfoPaymentsAndPoliciesEditService } from './services/BasicInfoPaymentsAndPoliciesEditService';
import { PaymentMethodVMContainer, PaymentMethodVM } from './services/utils/PaymentMethodVMContainer';
import { TaxService } from '../../../../../services/taxes/TaxService';
import { TaxType } from '../../../../../services/taxes/data-objects/TaxDO';
import { TaxContainerDO } from '../../../../../services/taxes/data-objects/TaxContainerDO';

@Component({
	selector: 'basic-info-payments-policies-edit',
	templateUrl: '/client/src/pages/internal/containers/common/basic-info/payments-policies/main/template/basic-info-payments-policies-edit.html'
})
export class BasicInfoPaymentsAndPoliciesEditComponent extends BaseFormComponent implements OnInit {
	@Input() canAutoSave: boolean = false;
	isSaving: boolean = false;

	vatTaxType = TaxType.Vat;
	otherTaxType = TaxType.OtherTax;

	isLoading: boolean = true;
	currencies: CurrenciesDO;
	paymentMethods: PaymentMethodVMContainer;
	hotel: HotelDO;

	private _additionalInvoiceDetailsControl: FormControl;
	private _formGroup: FormGroup;

	constructor(private _formBuilder: FormBuilder,
		private _appContext: AppContext,
		private _currenciesService: CurrenciesService,
		private _hotelAggregator: HotelAggregatorService,
		private _paymPoliciesEditService: BasicInfoPaymentsAndPoliciesEditService,
		private _taxService: TaxService) {
		super();
		this._additionalInvoiceDetailsControl = new FormControl(null, Validators.compose([Validators.maxLength(2000)]));
		this._formGroup = this._formBuilder.group({
			"additionalInvoiceDetails": this._additionalInvoiceDetailsControl
		});
	}

	public ngOnInit() {
		this.isLoading = true;

		Observable.combineLatest(
			this._currenciesService.getCurrenciesDO(),
			this._hotelAggregator.getHotelAggregatedInfo()
		).subscribe((result: [CurrenciesDO, HotelAggregatedInfo]) => {
			this.currencies = result[0];
			var hotelAggregatedInfo = result[1];

			this.hotel = hotelAggregatedInfo.hotelDetails.hotel;
			this.paymentMethods = new PaymentMethodVMContainer(hotelAggregatedInfo.paymentMethods, this.hotel.paymentMethodIdList);
			this._paymPoliciesEditService.bootstrap(this.paymentMethods, this.hotel);
			this._additionalInvoiceDetailsControl.setValue(this.hotel.additionalInvoiceDetails);
			this.isLoading = false;
		}, (error: ThError) => {
			this.isLoading = false;
			this._appContext.toaster.error(this._appContext.thTranslation.translate(error.message));
		});
		this._taxService.getTaxContainerDO().subscribe((taxContainer: TaxContainerDO) => {
			this._paymPoliciesEditService.bootstrapTaxContainer(taxContainer);
		});
	}
	public didChangeCurrencyCode(ccyCode: string) {
		this._paymPoliciesEditService.didUpdateCcyCode(ccyCode);
	}
	protected get didSubmitPage(): boolean {
		return this._paymPoliciesEditService.didSubmitForm;
	}
	protected didSelectPaymentMethod() {
		return this._paymPoliciesEditService.didSelectPaymentMethod();
	}
	public getDefaultFormGroup(): FormGroup {
		return this._formGroup;
	}

	savePaymentsAndPolicies() {
		if (this.isSaving) { return; }
		this._paymPoliciesEditService.updateAdditionalInvoiceDetails(this._additionalInvoiceDetailsControl.value);
		this.isSaving = true;
		this.didSubmitForm = true;

		this._paymPoliciesEditService.savePaymentsAndPolicies().subscribe((result: any) => {
			this.isSaving = false;
			this._appContext.toaster.success(this._appContext.thTranslation.translate("Information Saved Succesfully"));
		}, (error: any) => {
			this.isSaving = false;
		});
	}
}