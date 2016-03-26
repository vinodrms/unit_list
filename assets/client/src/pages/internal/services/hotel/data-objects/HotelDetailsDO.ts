import {BaseDO} from '../../../../../common/base/BaseDO';
import {UserDO} from './user/UserDO';
import {HotelDO} from './hotel/HotelDO';

export class HotelDetailsDO extends BaseDO {
	user: UserDO;
	hotel: HotelDO;

	protected getPrimitivePropertyKeys(): string[] {
		return [];
	}
	public buildFromObject(object: Object) {
		super.buildFromObject(object);
		this.user = new UserDO();
		this.user.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "user"));
		this.hotel = new HotelDO();
		this.hotel.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "hotel"));
	}
}