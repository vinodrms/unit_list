import {BaseDO} from '../../../../../common/base/BaseDO';
import {UserDO} from './user/UserDO';
import {HotelDO} from './hotel/HotelDO';
import {ThTimestampDO} from '../../common/data-objects/th-dates/ThTimestampDO';

export class HotelDetailsDO extends BaseDO {
	user: UserDO;
	hotel: HotelDO;
	currentThTimestamp: ThTimestampDO;

	protected getPrimitivePropertyKeys(): string[] {
		return [];
	}
	
	public buildFromObject(object: Object) {
		super.buildFromObject(object);

		this.user = new UserDO();
		this.user.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "user"));

		this.hotel = new HotelDO();
		this.hotel.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "hotel"));

		this.currentThTimestamp = new ThTimestampDO();
		this.currentThTimestamp.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "currentThTimestamp"));
	}
}