import {BaseDO} from '../../../common/base/BaseDO';
import {ISOWeekDay} from '../../../../utils/th-dates/data-objects/ISOWeekDay';

export class AllotmentAvailabilityForDayDO extends BaseDO {
	isoWeekDay: ISOWeekDay;
	availableCount: number;

	protected getPrimitivePropertyKeys(): string[] {
		return ["isoWeekDay", "availableCount"];
	}
}