import { BaseDO } from '../../../common/base/BaseDO';
import { RoomCategoryStatsDO } from '../../../room-categories/data-objects/RoomCategoryStatsDO';
import { ConfigCapacityDO } from '../../../common/data-objects/bed-config/ConfigCapacityDO';
import { IndexedBookingInterval } from '../../utils/IndexedBookingInterval';

export enum PriceProductPriceType {
	SinglePrice,
	PricePerPerson
}

export interface PriceProductPriceQueryDO {
	roomCategoryId: string;
	configCapacity: ConfigCapacityDO;
	roomCategoryStatsList: RoomCategoryStatsDO[];
}

export interface IPriceProductPrice extends BaseDO {
	hasPriceConfiguredFor(query: PriceProductPriceQueryDO): boolean;
	getPricePerNightFor(query: PriceProductPriceQueryDO): number;
	priceConfigurationIsValidFor(roomCategoryStatList: RoomCategoryStatsDO[]): boolean;
	isConfiguredForRoomCategory(roomCategoryId: string): boolean;
	roundPricesToTwoDecimals();
}