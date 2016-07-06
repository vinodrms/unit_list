import {BaseDO} from '../../../common/base/BaseDO';
import {IndexedBookingInterval} from '../../utils/IndexedBookingInterval';
import {ThDateDO} from '../../../../utils/th-dates/data-objects/ThDateDO';
import {ConfigCapacityDO} from '../../../common/data-objects/bed-config/ConfigCapacityDO';
import {StringOccurenciesIndexer} from '../../../../utils/indexers/StringOccurenciesIndexer';
import {ThTranslation} from '../../../../utils/localization/ThTranslation';

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

	indexedNumberOfRoomCategories?: StringOccurenciesIndexer;
	roomCategoryIdListFromPriceProduct?: string[];
}

export interface IPriceProductConstraint extends BaseDO {
	appliesOn(data: PriceProductConstraintDataDO): boolean;
	getValueDisplayString(thTranslation: ThTranslation): string;
}