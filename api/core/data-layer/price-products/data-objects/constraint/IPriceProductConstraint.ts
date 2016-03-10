import {BaseDO} from '../../../common/base/BaseDO';

export enum PriceProductConstraintType {
	BookableOnlyOnDaysFromWeek,
	MinimumLengthOfStay,
	MinimumLeadDays,
	MaximumLeadDays,
	IncludeDaysFromWeek,
	MinimumNumberOfRooms
}

export interface PriceProductConstraintDataDO {
	// TODO: add necessary data to compute rules
}

export interface IPriceProductConstraint extends BaseDO {
	appliesOn(data: PriceProductConstraintDataDO): boolean;
}