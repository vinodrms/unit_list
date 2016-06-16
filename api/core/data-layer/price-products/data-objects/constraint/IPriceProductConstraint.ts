import {BaseDO} from '../../../common/base/BaseDO';
import {IndexedBookingInterval} from '../../utils/IndexedBookingInterval';
import {ThDateDO} from '../../../../utils/th-dates/data-objects/ThDateDO';
import {ConfigCapacityDO} from '../../../common/data-objects/bed-config/ConfigCapacityDO';
import {IndexedNumberOfRoomCategories} from '../../utils/IndexedNumberOfRoomCategories';

export enum PriceProductConstraintType {
	BookableOnlyOnDaysFromWeek,
	MinimumLengthOfStay,
	MinimumLeadDays,
	MaximumLeadDays,
	IncludeDaysFromWeek,
	MinimumNumberOfRooms,
	MustArriveOnDaysFromWeek,
	MinimumNumberOfAdults
}

export interface PriceProductConstraintDataDO {
	indexedBookingInterval: IndexedBookingInterval;
	currentHotelThDate: ThDateDO;
	configCapacity: ConfigCapacityDO;

	indexedNumberOfRoomCategories?: IndexedNumberOfRoomCategories;
	roomCategoryIdListFromPriceProduct?: string[];
}

export interface IPriceProductConstraint extends BaseDO {
	appliesOn(data: PriceProductConstraintDataDO): boolean;
}