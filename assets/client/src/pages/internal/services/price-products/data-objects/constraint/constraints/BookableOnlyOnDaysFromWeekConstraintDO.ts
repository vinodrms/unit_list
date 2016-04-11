import {BaseDO} from '../../../../../../../common/base/BaseDO';
import {ISOWeekDay} from '../../../../common/data-objects/th-dates/ISOWeekDay';
import {IPriceProductConstraint} from '../IPriceProductConstraint';

export class BookableOnlyOnDaysFromWeekConstraintDO extends BaseDO implements IPriceProductConstraint {
	daysFromWeek: ISOWeekDay[];

	protected getPrimitivePropertyKeys(): string[] {
		return ["daysFromWeek"];
	}
}