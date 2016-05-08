import {Component, OnInit, Input} from 'angular2/core';
import {ControlGroup} from 'angular2/common';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';
import {BaseComponent} from '../../../../../../../common/base/BaseComponent';
import {ThError, AppContext} from '../../../../../../../common/utils/AppContext';
import {TranslationPipe} from '../../../../../../../common/utils/localization/TranslationPipe';
import {LoadingComponent} from '../../../../../../../common/utils/components/LoadingComponent';
import {CurrenciesService} from '../../../../../services/settings/CurrenciesService';
import {CurrenciesDO} from '../../../../../services/settings/data-objects/CurrenciesDO';
import {HotelAggregatorService} from '../../../../../services/hotel/HotelAggregatorService';
import {HotelAggregatedInfo} from '../../../../../services/hotel/utils/HotelAggregatedInfo';
import {HotelDO} from '../../../../../services/hotel/data-objects/hotel/HotelDO';
import {BasicInfoPaymentsAndPoliciesEditService} from './services/BasicInfoPaymentsAndPoliciesEditService';
import {PaymentMethodVMContainer, PaymentMethodVM} from './services/utils/PaymentMethodVMContainer';
import {TaxService} from '../../../../../services/taxes/TaxService';
import {TaxType} from '../../../../../services/taxes/data-objects/TaxDO';
import {TaxContainerDO} from '../../../../../services/taxes/data-objects/TaxContainerDO';
import {BasicInfoTaxListComponent} from '../pages/tax-list/BasicInfoTaxListComponent';
import {CustomScroll} from '../../../../../../../common/utils/directives/CustomScroll';

@Component({
	selector: 'basic-info-payments-policies-edit',
	templateUrl: '/client/src/pages/internal/containers/common/basic-info/payments-policies/main/template/basic-info-payments-policies-edit.html',
	directives: [LoadingComponent, CustomScroll, BasicInfoTaxListComponent],
	providers: [],
	pipes: [TranslationPipe]
})

export class BasicInfoPaymentsAndPoliciesEditComponent extends BaseComponent implements OnInit {
	@Input() canAutoSave: boolean = false;
	isSaving: boolean = false;

	vatTaxType = TaxType.Vat;
	otherTaxType = TaxType.OtherTax;

	isLoading: boolean = true;
	currencies: CurrenciesDO;
	paymentMethods: PaymentMethodVMContainer;
	hotel: HotelDO;

	constructor(private _appContext: AppContext,
		private _currenciesService: CurrenciesService,
		private _hotelAggregator: HotelAggregatorService,
		private _paymPoliciesEditService: BasicInfoPaymentsAndPoliciesEditService,
		private _taxService: TaxService) {
		super();
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
    protected get didSubmitForm(): boolean {
		return this._paymPoliciesEditService.didSubmitForm;
	}
	protected didSelectPaymentMethod() {
		return this._paymPoliciesEditService.didSelectPaymentMethod();
	}

	savePaymentsAndPolicies() {
		this.isSaving = true;
		this._paymPoliciesEditService.savePaymentsAndPolicies().subscribe((result: any) => {
			this.isSaving = false;
			this._appContext.toaster.success(this._appContext.thTranslation.translate("Information Saved Succesfully"));
		}, (error: any) => {
			this.isSaving = false;
		});
	}
}