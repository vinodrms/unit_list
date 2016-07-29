import {BaseDO} from '../../../../../../common/base/BaseDO';
import {ThTranslation} from '../../../../../../common/utils/localization/ThTranslation';

export enum AllotmentConstraintType {
	BookableOnlyOnDaysFromWeek,
	IncludeDaysFromWeek,
	ReleaseTimeInDays
}

export interface IAllotmentConstraint extends BaseDO {
	isValid(): boolean;
	getValueDisplayString(thTranslation: ThTranslation): string;
	getBriefValueDisplayString(thTranslation: ThTranslation): string;
}

export interface AllotmentConstraintMeta {
	title: string;
	description: string;
	brief: string;
	constraintType: AllotmentConstraintType;
}