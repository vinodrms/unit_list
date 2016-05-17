import {AllotmentConstraintType, IAllotmentConstraint, AllotmentConstraintMeta} from './IAllotmentConstraint';
import {AllotmentConstraintDO} from './AllotmentConstraintDO';
import {ReleaseTimeInDaysConstraintDO} from './constraints/ReleaseTimeInDaysConstraintDO';
import {DaysFromWeekConstraintDO} from '../../../price-products/data-objects/constraint/constraints/DaysFromWeekConstraintDO';

export class AllotmentConstraintFactory {
	public getConstraintDOByType(constraintType: AllotmentConstraintType): AllotmentConstraintDO {
		var constraintDO: AllotmentConstraintDO = new AllotmentConstraintDO();
		constraintDO.type = constraintType;
		constraintDO.constraint = this.getConstraintByType(constraintType);
		return constraintDO;
	}

	public getConstraintByType(constraintType: AllotmentConstraintType): IAllotmentConstraint {
		switch (constraintType) {
			case AllotmentConstraintType.ReleaseTimeInDays:
				return new ReleaseTimeInDaysConstraintDO();
			default:
				return new DaysFromWeekConstraintDO();
		}
	}

	public getAllotmentConstraintMetaList(): AllotmentConstraintMeta[] {
		return [
			{
				constraintType: AllotmentConstraintType.ReleaseTimeInDays,
				title: "Release time in days",
				description: "The number of days before the allotment is released"
			},
			{
				constraintType: AllotmentConstraintType.BookableOnlyOnDaysFromWeek,
				title: "Bookable only on days from week",
				description: "Bookings can only be made on specific days from week (e.g. It you select Monday, the allotment will apply only to bookings made from Monday to Tuesday.)"
			},
			{
				constraintType: AllotmentConstraintType.IncludeDaysFromWeek,
				title: "Include days from week",
				description: "Bookings must include the days selected. (e.g. If you select Saturday, the booking must include a Saturday)"
			}
		]
	}

	public getDefaultConstraintDO(): AllotmentConstraintDO {
		return this.getConstraintDOByType(AllotmentConstraintType.ReleaseTimeInDays);
	}
}