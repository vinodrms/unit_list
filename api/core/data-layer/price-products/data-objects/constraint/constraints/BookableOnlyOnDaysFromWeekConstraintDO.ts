import {BaseDO} from '../../../../common/base/BaseDO';
import {ISOWeekDay} from '../../../../../utils/th-dates/data-objects/ISOWeekDay';
import {PriceProductConstraintType, PriceProductConstraintDataDO, IPriceProductConstraint} from '../IPriceProductConstraint';
import {ThUtils} from '../../../../../utils/ThUtils';

export class BookableOnlyOnDaysFromWeekConstraintDO extends BaseDO implements IPriceProductConstraint {
	daysFromWeek: ISOWeekDay[];

	protected getPrimitivePropertyKeys(): string[] {
		return ["daysFromWeek"];
	}

	public appliesOn(data: PriceProductConstraintDataDO): boolean {
		var uniqueDaysFromWeekFromBooking: ISOWeekDay[] = data.indexedBookingInterval.uniqueBookingISOWeekDayList;
		var thUtils = new ThUtils();
		return thUtils.firstArrayIncludedInSecond(uniqueDaysFromWeekFromBooking, this.daysFromWeek);
	}
}