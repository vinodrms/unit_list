import {HotelDetailsDO} from '../data-objects/HotelDetailsDO';
import {HotelAmenitiesDO} from '../../settings/data-objects/HotelAmenitiesDO';
import {HotelPaymentMethodsDO} from '../../settings/data-objects/HotelPaymentMethodsDO';
import {CurrencyDO} from '../../common/data-objects/currency/CurrencyDO';

export class HotelAggregatedInfo {
	private _hotelDetails: HotelDetailsDO;
	private _hotelAmenities: HotelAmenitiesDO;
	private _paymentMethods: HotelPaymentMethodsDO;
	private _allowedPaymentMethods: HotelPaymentMethodsDO;
	private _ccy: CurrencyDO;

	public get hotelDetails(): HotelDetailsDO {
		return this._hotelDetails;
	}
	public set hotelDetails(hotelDetails: HotelDetailsDO) {
		this._hotelDetails = hotelDetails;
	}
	public get hotelAmenities(): HotelAmenitiesDO {
		return this._hotelAmenities;
	}
	public set hotelAmenities(hotelAmenities: HotelAmenitiesDO) {
		this._hotelAmenities = hotelAmenities;
	}
	public get paymentMethods(): HotelPaymentMethodsDO {
		return this._paymentMethods;
	}
	public set paymentMethods(paymentMethods: HotelPaymentMethodsDO) {
		this._paymentMethods = paymentMethods;
	}
	public get allowedPaymentMethods(): HotelPaymentMethodsDO {
		return this._allowedPaymentMethods;
	}
	public set allowedPaymentMethods(allowedPaymentMethods: HotelPaymentMethodsDO) {
		this._allowedPaymentMethods = allowedPaymentMethods;
	}
	public get ccy(): CurrencyDO {
		return this._ccy;
	}
	public set ccy(ccy: CurrencyDO) {
		this._ccy = ccy;
	}
}