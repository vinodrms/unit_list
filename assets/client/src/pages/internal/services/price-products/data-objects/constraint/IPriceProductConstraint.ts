import {BaseDO} from '../../../../../../common/base/BaseDO';
import {ThTranslation} from '../../../../../../common/utils/localization/ThTranslation';

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

export interface IPriceProductConstraint extends BaseDO {
	isValid(): boolean;
	getValueDisplayString(thTranslation: ThTranslation): string;
	getBriefValueDisplayString(thTranslation: ThTranslation): string;
}

export interface PriceProductConstraintMeta {
	title: string;
	description: string;
	brief: string;
	constraintType: PriceProductConstraintType;
}