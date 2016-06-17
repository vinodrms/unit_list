import {BaseDO} from '../../../common/base/BaseDO';
import {IndexedBookingInterval} from '../../../price-products/utils/IndexedBookingInterval';
import {ThDateDO} from '../../../../utils/th-dates/data-objects/ThDateDO';

export enum AllotmentConstraintType {
	BookableOnlyOnDaysFromWeek,
	IncludeDaysFromWeek,
	ReleaseTimeInDays
}

export interface AllotmentConstraintDataDO {
	indexedBookingInterval: IndexedBookingInterval;
	currentHotelThDate: ThDateDO;
}

export interface IAllotmentConstraint extends BaseDO {
	appliesOn(data: AllotmentConstraintDataDO): boolean;
}