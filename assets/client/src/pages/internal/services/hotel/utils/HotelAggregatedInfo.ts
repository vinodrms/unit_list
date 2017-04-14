import { HotelDetailsDO } from '../data-objects/HotelDetailsDO';
import { HotelAmenitiesDO } from '../../settings/data-objects/HotelAmenitiesDO';
import { HotelPaymentMethodsDO } from '../../settings/data-objects/HotelPaymentMethodsDO';
import { CurrencyDO } from '../../common/data-objects/currency/CurrencyDO';
import { HotelAggregatedPaymentMethodsDO } from "../../settings/data-objects/HotelAggregatedPaymentMethodsDO";

export class HotelAggregatedInfo {
	private _hotelDetails: HotelDetailsDO;
	private _hotelAmenities: HotelAmenitiesDO;
	private _allAvailablePaymentMethods: HotelPaymentMethodsDO;
	private _allowedPaymentMethods: HotelAggregatedPaymentMethodsDO;
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
	public get allAvailablePaymentMethods(): HotelPaymentMethodsDO {
		return this._allAvailablePaymentMethods;
	}
	public set allAvailablePaymentMethods(paymentMethods: HotelPaymentMethodsDO) {
		this._allAvailablePaymentMethods = paymentMethods;
	}
	public get allowedPaymentMethods(): HotelAggregatedPaymentMethodsDO {
		return this._allowedPaymentMethods;
	}
	public set allowedPaymentMethods(allowedPaymentMethods: HotelAggregatedPaymentMethodsDO) {
		this._allowedPaymentMethods = allowedPaymentMethods;
	}
	public get ccy(): CurrencyDO {
		return this._ccy;
	}
	public set ccy(ccy: CurrencyDO) {
		this._ccy = ccy;
	}
}