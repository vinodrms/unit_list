import { BaseDO } from '../../../../../../common/base/BaseDO';
import { RoomCategoryStatsDO } from '../../../room-categories/data-objects/RoomCategoryStatsDO';

export enum PriceProductPriceType {
	SinglePrice,
	PricePerPerson
}

export interface IPriceProductPrice extends BaseDO {
	getPriceBriefValue(): number;
	getRoomCategoryId(): string;
	prototypeForStats(roomCategoryStats: RoomCategoryStatsDO): IPriceProductPrice;
	isValid(): boolean;
	copyPricesFrom(otherPrice: IPriceProductPrice);
}