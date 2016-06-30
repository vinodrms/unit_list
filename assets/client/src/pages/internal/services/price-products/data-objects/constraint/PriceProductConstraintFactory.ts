import {PriceProductConstraintType, IPriceProductConstraint, PriceProductConstraintMeta} from './IPriceProductConstraint';
import {PriceProductConstraintDO} from './PriceProductConstraintDO';
import {DaysFromWeekConstraintDO} from './constraints/DaysFromWeekConstraintDO';
import {LeadDaysConstraintDO} from './constraints/LeadDaysConstraintDO';
import {LengthOfStayConstraintDO} from './constraints/LengthOfStayConstraintDO';
import {NumberOfRoomsConstraintDO} from './constraints/NumberOfRoomsConstraintDO';
import {NumberOfAdultsConstraintDO} from './constraints/NumberOfAdultsConstraintDO';

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
			case PriceProductConstraintType.MinimumNumberOfRooms:
				return new NumberOfRoomsConstraintDO();
			case PriceProductConstraintType.MustArriveOnDaysFromWeek:
				return new DaysFromWeekConstraintDO();
			default:
				return new NumberOfAdultsConstraintDO();
		}
	}

	public getPriceProductConstraintMetaList(): PriceProductConstraintMeta[] {
		return [
			{
				constraintType: PriceProductConstraintType.BookableOnlyOnDaysFromWeek,
				title: "Bookable only on days from week",
				description: "Bookings can only be made on specific days from week (e.g. It you select Monday, the price product will apply only to bookings made from Monday to Tuesday.)",
				brief: "Bookable on"
			},
			{
				constraintType: PriceProductConstraintType.IncludeDaysFromWeek,
				title: "Include days from week",
				description: "Bookings must include the days selected. (e.g. If you select Saturday, the booking must include a Saturday)",
				brief: "Must include"
			},
			{
				constraintType: PriceProductConstraintType.MustArriveOnDaysFromWeek,
				title: "Must arrive on days from week",
				description: "Bookings must always start with a day from the ones selected. (e.g. If you select Monday, the booking must start on a Monday)",
				brief: "Arrive on"
			},
			{
				constraintType: PriceProductConstraintType.MaximumLeadDays,
				title: "Maximum lead days",
				description: "The maximum number of days between the time of the booking and arrival date. (e.g. If selected 1 day and want to book today, the booking must start either today or tomorrow.)",
				brief: "Max Lead"
			},
			{
				constraintType: PriceProductConstraintType.MinimumLeadDays,
				title: "Minimum lead days",
				description: "The minimum number of days between the time of the booking and arrival date. (e.g. If selected 40 days, the price product will be available only for minimum 40 days between the booking and arrival)",
				brief: "Min lead"
			},
			{
				constraintType: PriceProductConstraintType.MinimumLengthOfStay,
				title: "Minimum length of stay",
				description: "The minimum number of days for the booking",
				brief: "Min"
			},
			{
				constraintType: PriceProductConstraintType.MinimumNumberOfRooms,
				title: "Minimum number of rooms",
				description: "The minimum number of rooms from the booking",
				brief: "Min"
			},
			{
				constraintType: PriceProductConstraintType.MinimumNumberOfAdults,
				title: "Minimum number of adults",
				description: "The minimum number of adults from the booking",
				brief: "Min"
			}
		]
	}

	public getDefaultConstraintDO(): PriceProductConstraintDO {
		return this.getConstraintDOByType(PriceProductConstraintType.BookableOnlyOnDaysFromWeek);
	}

	public getPriceProductConstraintMetaByType(constraintType: PriceProductConstraintType): PriceProductConstraintMeta {
		var constraintMetaList = this.getPriceProductConstraintMetaList();
		return _.find(constraintMetaList, (constraintMeta: PriceProductConstraintMeta) => { return constraintMeta.constraintType === constraintType }); 
	}
}