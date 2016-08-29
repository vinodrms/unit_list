import {BaseDO} from '../../../common/base/BaseDO';
import {IndexedBookingInterval} from '../../../price-products/utils/IndexedBookingInterval';
import {ThDateDO} from '../../../../utils/th-dates/data-objects/ThDateDO';
import {ThTranslation} from '../../../../utils/localization/ThTranslation';

export enum AllotmentConstraintType {
	BookableOnlyOnDaysFromWeek,
	IncludeDaysFromWeek,
	ReleaseTimeInDays
}

export interface AllotmentConstraintDataDO {
	indexedBookingInterval: IndexedBookingInterval;
	bookingCreationDate: ThDateDO;
}

export interface IAllotmentConstraint extends BaseDO {
	appliesOn(data: AllotmentConstraintDataDO): boolean;
	getValueDisplayString(thTranslation: ThTranslation): string;
}