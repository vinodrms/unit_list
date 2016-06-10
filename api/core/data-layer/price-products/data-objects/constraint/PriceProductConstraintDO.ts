import {BaseDO} from '../../../common/base/BaseDO';
import {PriceProductConstraintType, PriceProductConstraintDataDO, IPriceProductConstraint} from './IPriceProductConstraint';
import {BookableOnlyOnDaysFromWeekConstraintDO} from './constraints/BookableOnlyOnDaysFromWeekConstraintDO';
import {IncludeDaysFromWeekConstraintDO} from './constraints/IncludeDaysFromWeekConstraintDO';
import {MaximumLeadDaysConstraintDO} from './constraints/MaximumLeadDaysConstraintDO';
import {MinimumLeadDaysConstraintDO} from './constraints/MinimumLeadDaysConstraintDO';
import {MinimumLengthOfStayConstraintDO} from './constraints/MinimumLengthOfStayConstraintDO';
import {MinimumNumberOfRoomsConstraintDO} from './constraints/MinimumNumberOfRoomsConstraintDO';
import {MustArriveOnDaysFromWeekConstraintDO} from './constraints/MustArriveOnDaysFromWeekConstraintDO';
import {MinimumNumberOfAdultsConstraintDO} from './constraints/MinimumNumberOfAdultsConstraintDO';

export class PriceProductConstraintDO extends BaseDO implements IPriceProductConstraint {
	type: PriceProductConstraintType;
	constraint: IPriceProductConstraint;

	protected getPrimitivePropertyKeys(): string[] {
		return ["type"];
	}

	public buildFromObject(object: Object) {
		super.buildFromObject(object);

		switch (this.type) {
			case PriceProductConstraintType.BookableOnlyOnDaysFromWeek:
				this.constraint = new BookableOnlyOnDaysFromWeekConstraintDO();
				break;
			case PriceProductConstraintType.IncludeDaysFromWeek:
				this.constraint = new IncludeDaysFromWeekConstraintDO();
				break;
			case PriceProductConstraintType.MaximumLeadDays:
				this.constraint = new MaximumLeadDaysConstraintDO();
				break;
			case PriceProductConstraintType.MinimumLeadDays:
				this.constraint = new MinimumLeadDaysConstraintDO();
				break;
			case PriceProductConstraintType.MinimumLengthOfStay:
				this.constraint = new MinimumLengthOfStayConstraintDO();
				break;
			case PriceProductConstraintType.MinimumNumberOfRooms:
				this.constraint = new MinimumNumberOfRoomsConstraintDO();
				break;
			case PriceProductConstraintType.MustArriveOnDaysFromWeek:
				this.constraint = new MustArriveOnDaysFromWeekConstraintDO();
				break;
			case PriceProductConstraintType.MinimumNumberOfAdults:
				this.constraint = new MinimumNumberOfAdultsConstraintDO();
				break;
		}
		this.constraint.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "constraint"));
	}

	public appliesOn(data: PriceProductConstraintDataDO): boolean {
		return this.constraint.appliesOn(data);
	}
}