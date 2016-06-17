import {BaseDO} from '../../../common/base/BaseDO';
import {AllotmentConstraintType, IAllotmentConstraint, AllotmentConstraintDataDO} from './IAllotmentConstraint';
import {BookableOnlyOnDaysFromWeekConstraintDO} from './constraints/BookableOnlyOnDaysFromWeekConstraintDO';
import {IncludeDaysFromWeekConstraintDO} from './constraints/IncludeDaysFromWeekConstraintDO';
import {ReleaseTimeInDaysConstraintDO} from './constraints/ReleaseTimeInDaysConstraintDO';

export class AllotmentConstraintDO extends BaseDO implements IAllotmentConstraint {
	type: AllotmentConstraintType;
	constraint: IAllotmentConstraint;

	protected getPrimitivePropertyKeys(): string[] {
		return ["type"];
	}

	public buildFromObject(object: Object) {
		super.buildFromObject(object);

		switch (this.type) {
			case AllotmentConstraintType.BookableOnlyOnDaysFromWeek:
				this.constraint = new BookableOnlyOnDaysFromWeekConstraintDO();
				break;
			case AllotmentConstraintType.IncludeDaysFromWeek:
				this.constraint = new IncludeDaysFromWeekConstraintDO();
				break;
			case AllotmentConstraintType.ReleaseTimeInDays:
				this.constraint = new ReleaseTimeInDaysConstraintDO();
				break;
		}
		this.constraint.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "constraint"));
	}
	public appliesOn(data: AllotmentConstraintDataDO): boolean {
		return this.constraint.appliesOn(data);
	}
}