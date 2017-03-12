import { BaseDO } from '../../../../common/base/BaseDO';
import { PriceProductConstraintType, PriceProductConstraintDataDO, IPriceProductConstraint } from '../IPriceProductConstraint';
import { ThUtils } from '../../../../../utils/ThUtils';
import { ThTranslation } from '../../../../../utils/localization/ThTranslation';

export class MinimumNumberOfRoomsConstraintDO extends BaseDO implements IPriceProductConstraint {
	noOfRooms: number;

	protected getPrimitivePropertyKeys(): string[] {
		return ["noOfRooms"];
	}

	public appliesOn(data: PriceProductConstraintDataDO): boolean {
		var thUtils = new ThUtils();
		if (thUtils.isUndefinedOrNull(data.indexedNumberOfRoomCategoriesFromGroupBooking) || thUtils.isUndefinedOrNull(data.roomCategoryIdListFromPriceProduct)) {
			return true;
		}
		return this.noOfRooms <= data.indexedNumberOfRoomCategoriesFromGroupBooking.getNoOfOccurenciesForElementList(data.roomCategoryIdListFromPriceProduct);
	}

	public getValueDisplayString(thTranslation: ThTranslation): string {
		return thTranslation.translate("Minimum %noOfRooms% rooms", { noOfRooms: this.noOfRooms });
	}
}