import {BaseDO} from '../../../common/base/BaseDO';

export enum AllotmentConstraintType {
	BookableOnlyOnDaysFromWeek,
	IncludeDaysFromWeek,
	ReleaseTimeInDays
}

export interface IAllotmentConstraint extends BaseDO {

}