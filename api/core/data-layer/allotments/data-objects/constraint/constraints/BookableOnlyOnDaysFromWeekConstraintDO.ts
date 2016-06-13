import {BaseDO} from '../../../../common/base/BaseDO';
import {ISOWeekDay} from '../../../../../utils/th-dates/data-objects/ISOWeekDay';
import {IAllotmentConstraint} from '../IAllotmentConstraint';

export class BookableOnlyOnDaysFromWeekConstraintDO extends BaseDO implements IAllotmentConstraint {
	daysFromWeek: ISOWeekDay[];

	protected getPrimitivePropertyKeys(): string[] {
		return ["daysFromWeek"];
	}
}