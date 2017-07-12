import {PriceProductConstraintType, IPriceProductConstraint, PriceProductConstraintMeta} from './IPriceProductConstraint';
import {PriceProductConstraintDO} from './PriceProductConstraintDO';
import {DaysFromWeekConstraintDO} from './constraints/DaysFromWeekConstraintDO';
import {LeadDaysConstraintDO} from './constraints/LeadDaysConstraintDO';
import {LengthOfStayConstraintDO} from './constraints/LengthOfStayConstraintDO';
import {NumberOfRoomsConstraintDO} from './constraints/NumberOfRoomsConstraintDO';
import {NumberOfAdultsConstraintDO} from './constraints/NumberOfAdultsConstraintDO';
import {IPriceProductValidationRule} from './validation/IPriceProductValidationRule';
import {GenericPriceProductValidationRuleStrategy} from './validation/GenericPriceProductValidationRuleStrategy';
import {MinNoRoomsPriceProductValidationRuleStrategy} from './validation/MinNoRoomsPriceProductValidationRuleStrategy';

import * as _ from "underscore";

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
				title: "Available only on selected days of the week",
				description: "Bookings can only be made on specific days from week (e.g. It you select Monday, the price product will apply only to bookings made from Monday to Tuesday.)",
				brief: "Bookable on"
			},
			{
				constraintType: PriceProductConstraintType.IncludeDaysFromWeek,
				title: "Must include selected days of the week",
				description: "Bookings must include the days selected. (e.g. If you select Saturday, the booking must include a Saturday)",
				brief: "Must include"
			},
			{
				constraintType: PriceProductConstraintType.MustArriveOnDaysFromWeek,
				title: "Must arrive on selected day of the week",
				description: "Bookings must always start with a day from the ones selected. (e.g. If you select Monday, the booking must start on a Monday)",
				brief: "Arrive on"
			},
			{
				constraintType: PriceProductConstraintType.MaximumLeadDays,
				title: "Can be booked no more than selected days before arrival",
				description: "The Price Product can be booked after the selected number of days before arrival. (E.g. if 2 days is selected, the booking can only be made 2 days or less before arrival)",
				brief: "Max Lead"
			},
			{
				constraintType: PriceProductConstraintType.MinimumLeadDays,
				title: "Can only be booked at least selected days before arrival",
				description: "The Price Product can be booked until the selected number of days before arrival. (E.g. if 28 days is selected, the booking can only be made 28 days or more before arrival)",
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

	public getValidationRuleByType(constraintType: PriceProductConstraintType, constraint: IPriceProductConstraint): IPriceProductValidationRule {
		switch (constraintType) {
			case PriceProductConstraintType.MinimumNumberOfRooms:
				var minNoRoomsConstraint: NumberOfRoomsConstraintDO = <NumberOfRoomsConstraintDO>constraint;
				return new MinNoRoomsPriceProductValidationRuleStrategy(minNoRoomsConstraint.noOfRooms);
			default:
				return new GenericPriceProductValidationRuleStrategy();
		}
	}
}