import {BaseDO} from '../../../../../common/base/BaseDO';
import {AmenityDO} from '../../common/data-objects/amenity/AmenityDO';

export class HotelAmenitiesDO extends BaseDO {
	hotelAmenityList: AmenityDO[];

	protected getPrimitivePropertyKeys(): string[] {
		return [];
	}
	public buildFromObject(object: Object) {
		super.buildFromObject(object);

		this.hotelAmenityList = [];
		this.forEachElementOf(this.getObjectPropertyEnsureUndefined(object, "hotelAmenityList"), (amenityObject: Object) => {
			var amenityDO = new AmenityDO();
			amenityDO.buildFromObject(amenityObject);
			this.hotelAmenityList.push(amenityDO);
		});
	}
}