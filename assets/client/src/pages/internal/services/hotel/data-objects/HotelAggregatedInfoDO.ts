import {BaseDO} from '../../../../../common/base/BaseDO';
import {HotelDetailsDO} from './HotelDetailsDO';
import {HotelAmenitiesDO} from '../../settings/data-objects/HotelAmenitiesDO';
import {HotelPaymentMethodsDO} from '../../settings/data-objects/HotelPaymentMethodsDO';

export class HotelAggregatedInfoDO extends BaseDO {
	hotelDetails: HotelDetailsDO;
	hotelAmenities: HotelAmenitiesDO;
	paymentMethods: HotelPaymentMethodsDO;

	protected getPrimitivePropertyKeys(): string[] {
		return [];
	}
	public buildFromObject(object: Object) {
		super.buildFromObject(object);
		this.hotelDetails = new HotelDetailsDO();
		this.hotelDetails.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "hotelDetails"));

		this.hotelAmenities = new HotelAmenitiesDO();
		this.hotelAmenities.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "hotelAmenities"));
		
		this.paymentMethods = new HotelPaymentMethodsDO();
		this.paymentMethods.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "paymentMethods"));
	}
}