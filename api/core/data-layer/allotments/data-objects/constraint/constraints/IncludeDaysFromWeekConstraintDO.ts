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
		var thUtils = new ThUtils();
		return thUtils.firstArrayIncludedInSecond(this.daysFromWeek, uniqueDaysFromWeekFromBooking);
	}
	public getValueDisplayString(thTranslation: ThTranslation): string {
		var constraintUtils = new ConstraintUtils(thTranslation);
		return thTranslation.translate("Must Include %daysFromWeek%", { daysFromWeek: constraintUtils.getDaysFromWeekDisplayString(this.daysFromWeek) });
	}
}