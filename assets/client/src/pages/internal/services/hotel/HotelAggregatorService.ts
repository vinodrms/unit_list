import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/operator/map';
import {BaseDO} from '../../../../common/base/BaseDO';
import {ThError} from '../../../../common/utils/AppContext';
import {ARequestService} from '../common/ARequestService';
import {HotelAmenitiesService} from '../settings/HotelAmenitiesService';
import {HotelAmenitiesDO} from '../settings/data-objects/HotelAmenitiesDO';
import {HotelService} from './HotelService';
import {HotelDetailsDO} from './data-objects/HotelDetailsDO';
import {HotelPaymentMethodsService} from '../settings/HotelPaymentMethodsService';
import {HotelPaymentMethodsDO} from '../settings/data-objects/HotelPaymentMethodsDO';
import {PaymentMethodDO} from '../common/data-objects/payment-method/PaymentMethodDO';
import {CurrenciesService} from '../settings/CurrenciesService';
import {CurrenciesDO} from '../settings/data-objects/CurrenciesDO';
import {HotelAggregatedInfo} from './utils/HotelAggregatedInfo';

@Injectable()
export class HotelAggregatorService extends ARequestService<HotelAggregatedInfo> {
	constructor(
		private _hotelAmenitiesService: HotelAmenitiesService,
		private _paymentMethodsService: HotelPaymentMethodsService,
		private _currenciesService: CurrenciesService,
		private _hotelService: HotelService) {
		super();
	}

	protected sendRequest(): Observable<Object> {
		return Observable.combineLatest(
			this._hotelAmenitiesService.getHotelAmenitiesDO(),
			this._paymentMethodsService.getPaymentMethodsDO(),
			this._currenciesService.getCurrenciesDO(),
			this._hotelService.getHotelDetailsDO()
		).map((result: [HotelAmenitiesDO, HotelPaymentMethodsDO, CurrenciesDO, HotelDetailsDO]) => {
			var aggregatedInfo: HotelAggregatedInfo = new HotelAggregatedInfo();
			aggregatedInfo.hotelAmenities = result[0];
			aggregatedInfo.paymentMethods = result[1];
			aggregatedInfo.hotelDetails = result[3];
			aggregatedInfo.ccy = result[2].getCurrencyByCode(aggregatedInfo.hotelDetails.hotel.ccyCode);
			aggregatedInfo.allowedPaymentMethods = this.getAllowedPaymentMethods(aggregatedInfo);
			return aggregatedInfo;
		});
	}
	private getAllowedPaymentMethods(aggregatedInfo: HotelAggregatedInfo): HotelPaymentMethodsDO {
		var allowedPaymentMethods = new HotelPaymentMethodsDO();
		allowedPaymentMethods.paymentMethodList = _.filter(aggregatedInfo.paymentMethods.paymentMethodList, (paymentMethod: PaymentMethodDO) => {
			return _.contains(aggregatedInfo.hotelDetails.hotel.paymentMethodIdList, paymentMethod.id);
		});
		return allowedPaymentMethods;
	}

	protected parseResult(result: HotelAggregatedInfo): HotelAggregatedInfo {
		return result;
	}
	public getHotelAggregatedInfo(): Observable<HotelAggregatedInfo> {
		return this.getServiceObservable();
	}
}