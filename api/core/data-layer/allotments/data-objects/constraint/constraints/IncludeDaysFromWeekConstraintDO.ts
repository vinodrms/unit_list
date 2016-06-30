import {BaseDO} from '../../../../common/base/BaseDO';
import {ThTranslation} from '../../../../../utils/localization/ThTranslation';
import {ISOWeekDay} from '../../../../../utils/th-dates/data-objects/ISOWeekDay';
import {IAllotmentConstraint, AllotmentConstraintDataDO} from '../IAllotmentConstraint';
import {ThUtils} from '../../../../../utils/ThUtils';
import {ConstraintUtils} from '../../../../price-products/data-objects/constraint/constraints/utils/ConstraintUtils';

export class IncludeDaysFromWeekConstraintDO extends BaseDO implements IAllotmentConstraint {
	daysFromWeek: ISOWeekDay[];

	protected getPrimitivePropertyKeys(): string[] {
		return ["daysFromWeek"];
	}

	public appliesOn(data: AllotmentConstraintDataDO): boolean {
		var uniqueDaysFromWeekFromBooking: ISOWeekDay[] = data.indexedBookingInterval.uniqueBookingISOWeekDayList;
		var isValid: boolean = true;
		_.forEach(uniqueDaysFromWeekFromBooking, (isoWeekDayFromBooking: ISOWeekDay) => {
			if (!this.containsDayFromWeek(isoWeekDayFromBooking)) {
				isValid = false;
			}
		});
		return isValid;
	}
	private containsDayFromWeek(isoWeekDay: ISOWeekDay): boolean {
		return _.contains(this.daysFromWeek, isoWeekDay);
	}

	public getValueDisplayString(thTranslation: ThTranslation): string {
		var constraintUtils = new ConstraintUtils(thTranslation);
		return thTranslation.translate("Must Include %daysFromWeek%", { daysFromWeek: constraintUtils.getDaysFromWeekDisplayString(this.daysFromWeek) });
	}
}