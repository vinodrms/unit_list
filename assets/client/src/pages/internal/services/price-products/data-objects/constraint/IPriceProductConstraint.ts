import {BaseDO} from '../../../../../../common/base/BaseDO';

export enum PriceProductConstraintType {
	BookableOnlyOnDaysFromWeek,
	MinimumLengthOfStay,
	MinimumLeadDays,
	MaximumLeadDays,
	IncludeDaysFromWeek,
	MinimumNumberOfRooms
}

export interface IPriceProductConstraint extends BaseDO {
}