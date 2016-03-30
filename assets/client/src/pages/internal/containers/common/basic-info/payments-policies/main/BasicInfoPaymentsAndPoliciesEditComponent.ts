import {Component, OnInit} from 'angular2/core';
import {ControlGroup} from 'angular2/common';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/zip';
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

@Component({
	selector: 'basic-info-payments-policies-edit',
	templateUrl: '/client/src/pages/internal/containers/common/basic-info/payments-policies/main/template/basic-info-payments-policies-edit.html',
	directives: [LoadingComponent],
	providers: [],
	pipes: [TranslationPipe]
})

export class BasicInfoPaymentsAndPoliciesEditComponent extends BaseComponent implements OnInit {
	isLoading: boolean = true;
	currencies: CurrenciesDO;
	paymentMethods: PaymentMethodVMContainer;
	hotel: HotelDO;

	constructor(private _appContext: AppContext,
		private _currenciesService: CurrenciesService,
		private _hotelAggregator: HotelAggregatorService,
		private _paymPoliciesEditService: BasicInfoPaymentsAndPoliciesEditService) {
		super();
	}

	public ngOnInit() {
		this.isLoading = true;
		Observable.zip(
			this._currenciesService.getCurrenciesDO(),
			this._hotelAggregator.getHotelAggregatedInfo()
		).subscribe((result: [CurrenciesDO, HotelAggregatedInfo]) => {
			this.currencies = result[0];
			var hotelAggregatedInfo = result[1];
			
			this.hotel = hotelAggregatedInfo.hotelDetails.hotel;
			this.paymentMethods = new PaymentMethodVMContainer(hotelAggregatedInfo.paymentMethods, this.hotel.paymentMethodIdList);
			this.initDefaults();
			this.isLoading = false;
		}, (error: ThError) => {
			this.isLoading = false;
			this._appContext.toaster.error(this._appContext.thTranslation.translate(error.message));
		});
	}
	private initDefaults() {
		this._paymPoliciesEditService.bootstrap(this.paymentMethods, this.hotel);
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
}