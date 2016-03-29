import {BaseDO} from '../../../common/base/BaseDO';
import {RoomCategoryStatsDO} from '../../../room-categories/data-objects/RoomCategoryStatsDO';

export enum PriceProductPriceType {
	PricePerRoomCategory,
	PricePerPerson
}

export interface PriceProductPriceQueryDO {
	roomCategoryId: string;
	noOfAdults: number;
	noOfChildren: number;
}

export interface IPriceProductPrice extends BaseDO {
	getPriceFor(query: PriceProductPriceQueryDO): number;
	priceConfigurationIsValidFor(roomCategoryStatList: RoomCategoryStatsDO[]): boolean;
}