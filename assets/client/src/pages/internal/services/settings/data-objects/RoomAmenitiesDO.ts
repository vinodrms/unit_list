import {BaseDO} from '../../../../../common/base/BaseDO';
import {AmenityDO} from '../../common/data-objects/amenity/AmenityDO';

export class RoomAmenitiesDO extends BaseDO {
	roomAmenityList: AmenityDO[];

	protected getPrimitivePropertyKeys(): string[] {
		return [];
	}
	public buildFromObject(object: Object) {
		super.buildFromObject(object);

		this.roomAmenityList = [];
		this.forEachElementOf(this.getObjectPropertyEnsureUndefined(object, "roomAmenityList"), (amenityObject: Object) => {
			var amenityDO = new AmenityDO();
			amenityDO.buildFromObject(amenityObject);
			this.roomAmenityList.push(amenityDO);
		});
	}
}