import {HotelDetailsDO} from '../data-objects/HotelDetailsDO';
import {HotelAmenitiesDO} from '../../settings/data-objects/HotelAmenitiesDO';
import {HotelPaymentMethodsDO} from '../../settings/data-objects/HotelPaymentMethodsDO';

export class HotelAggregatedInfo {
	private _hotelDetails;
	private _hotelAmenities;
	private _paymentMethods;

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
}