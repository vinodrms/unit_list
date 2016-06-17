import {BaseDO} from '../../../../common/base/BaseDO';
import {ISOWeekDay} from '../../../../../utils/th-dates/data-objects/ISOWeekDay';
import {IAllotmentConstraint, AllotmentConstraintDataDO} from '../IAllotmentConstraint';
import {ThUtils} from '../../../../../utils/ThUtils';

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
}