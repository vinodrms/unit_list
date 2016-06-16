import {BaseDO} from '../../../../common/base/BaseDO';
import {PriceProductConstraintType, PriceProductConstraintDataDO, IPriceProductConstraint} from '../IPriceProductConstraint';
import {ThUtils} from '../../../../../utils/ThUtils';

export class MinimumNumberOfRoomsConstraintDO extends BaseDO implements IPriceProductConstraint {
	noOfRooms: number;

	protected getPrimitivePropertyKeys(): string[] {
		return ["noOfRooms"];
	}

	public appliesOn(data: PriceProductConstraintDataDO): boolean {
		var thUtils = new ThUtils();
		if (thUtils.isUndefinedOrNull(data.indexedNumberOfRoomCategories) || thUtils.isUndefinedOrNull(data.roomCategoryIdListFromPriceProduct)) {
			return true;
		}
		return this.noOfRooms <= data.indexedNumberOfRoomCategories.getNoOfRoomsForCategoriIdList(data.roomCategoryIdListFromPriceProduct);
	}
}