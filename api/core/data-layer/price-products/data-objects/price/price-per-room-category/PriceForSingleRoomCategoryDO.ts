import {BaseDO} from '../../../../common/base/BaseDO';

export class PriceForSingleRoomCategoryDO extends BaseDO {
	roomCategoryId: string;
	price: number;

	protected getPrimitivePropertyKeys(): string[] {
		return ["roomCategoryId", "price"];
	}
}