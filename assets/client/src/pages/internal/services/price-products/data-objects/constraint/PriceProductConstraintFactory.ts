import {PriceProductConstraintType, IPriceProductConstraint, PriceProductConstraintMeta} from './IPriceProductConstraint';
import {PriceProductConstraintDO} from './PriceProductConstraintDO';
import {DaysFromWeekConstraintDO} from './constraints/DaysFromWeekConstraintDO';
import {LeadDaysConstraintDO} from './constraints/LeadDaysConstraintDO';
import {LengthOfStayConstraintDO} from './constraints/LengthOfStayConstraintDO';
import {NumberOfRoomsConstraintDO} from './constraints/NumberOfRoomsConstraintDO';

export class PriceProductConstraintFactory {
	public getConstraintDOByType(constraintType: PriceProductConstraintType): PriceProductConstraintDO {
		var constraintDO: PriceProductConstraintDO = new PriceProductConstraintDO();
		constraintDO.type = constraintType;
		constraintDO.constraint = this.getConstraintByType(constraintType);
		return constraintDO;
	}

	public getConstraintByType(constraintType: PriceProductConstraintType): IPriceProductConstraint {
		switch (constraintType) {
			case PriceProductConstraintType.BookableOnlyOnDaysFromWeek:
				return new DaysFromWeekConstraintDO();
			case PriceProductConstraintType.IncludeDaysFromWeek:
				return new DaysFromWeekConstraintDO();
			case PriceProductConstraintType.MaximumLeadDays:
				return new LeadDaysConstraintDO();
			case PriceProductConstraintType.MinimumLeadDays:
				return new LeadDaysConstraintDO();
			case PriceProductConstraintType.MinimumLengthOfStay:
				return new LengthOfStayConstraintDO();
			default:
				return new NumberOfRoomsConstraintDO();
		}
	}

	public getPriceProductConstraintMetaList(): PriceProductConstraintMeta[] {
		return [
			{
				constraintType: PriceProductConstraintType.BookableOnlyOnDaysFromWeek,
				title: "Bookable only on days from week",
				description: "Bookings can only be made on specific days from week (e.g. It you select Monday, the price product will apply only to bookings made from Monday to Tuesday.)"
			},
			{
				constraintType: PriceProductConstraintType.IncludeDaysFromWeek,
				title: "Include days from week",
				description: "Bookings must include the days selected. (e.g. If you select Saturday, the booking must include a Saturday)"
			},
			{
				constraintType: PriceProductConstraintType.MaximumLeadDays,
				title: "Maximum lead days",
				description: "The maximum number of days between the time of the booking and arrival date. (e.g. If selected 1 day and want to book today, the booking must start either today or tomorrow.)"
			},
			{
				constraintType: PriceProductConstraintType.MinimumLeadDays,
				title: "Minimum lead days",
				description: "The minimum number of days between the time of the booking and arrival date. (e.g. If selected 40 days, the price product will be available only for minimum 40 days between the booking and arrival)"
			},
			{
				constraintType: PriceProductConstraintType.MinimumLengthOfStay,
				title: "Minimum length of stay",
				description: "The minimum number of days for the booking"
			},
			{
				constraintType: PriceProductConstraintType.MinimumNumberOfRooms,
				title: "Minimum number of rooms",
				description: "The minimum number of rooms from the booking"
			}
		]
	}

	public getDefaultConstraintDO(): PriceProductConstraintDO {
		return this.getConstraintDOByType(PriceProductConstraintType.BookableOnlyOnDaysFromWeek);
	}
}