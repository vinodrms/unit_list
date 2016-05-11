import {BaseDO} from '../../../../../../common/base/BaseDO';
import {ISOWeekDay} from '../../../common/data-objects/th-dates/ISOWeekDay';

export class AllotmentAvailabilityForDayDO extends BaseDO {
	isoWeekDay: ISOWeekDay;
	availableCount: number;

	protected getPrimitivePropertyKeys(): string[] {
		return ["isoWeekDay", "availableCount"];
	}
}