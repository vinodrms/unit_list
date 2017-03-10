import { PriceProductConstraintType, IPriceProductConstraint } from './IPriceProductConstraint';
import { PriceProductConstraintDO } from './PriceProductConstraintDO';
import { BookableOnlyOnDaysFromWeekConstraintDO } from './constraints/BookableOnlyOnDaysFromWeekConstraintDO';
import { IncludeDaysFromWeekConstraintDO } from './constraints/IncludeDaysFromWeekConstraintDO';
import { MaximumLeadDaysConstraintDO } from './constraints/MaximumLeadDaysConstraintDO';
import { MinimumLeadDaysConstraintDO } from './constraints/MinimumLeadDaysConstraintDO';
import { MinimumLengthOfStayConstraintDO } from './constraints/MinimumLengthOfStayConstraintDO';
import { MinimumNumberOfRoomsConstraintDO } from './constraints/MinimumNumberOfRoomsConstraintDO';
import { MustArriveOnDaysFromWeekConstraintDO } from './constraints/MustArriveOnDaysFromWeekConstraintDO';
import { MinimumNumberOfAdultsConstraintDO } from './constraints/MinimumNumberOfAdultsConstraintDO';

import _ = require('underscore');

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
				return new BookableOnlyOnDaysFromWeekConstraintDO();
			case PriceProductConstraintType.IncludeDaysFromWeek:
				return new IncludeDaysFromWeekConstraintDO();
			case PriceProductConstraintType.MaximumLeadDays:
				return new MaximumLeadDaysConstraintDO();
			case PriceProductConstraintType.MinimumLeadDays:
				return new MinimumLeadDaysConstraintDO();
			case PriceProductConstraintType.MinimumLengthOfStay:
				return new MinimumLengthOfStayConstraintDO();
			case PriceProductConstraintType.MinimumNumberOfRooms:
				return new MinimumNumberOfRoomsConstraintDO();
			case PriceProductConstraintType.MustArriveOnDaysFromWeek:
				return new MustArriveOnDaysFromWeekConstraintDO();
			case PriceProductConstraintType.MinimumNumberOfAdults:
				return new MinimumNumberOfAdultsConstraintDO();
		}
	}
}