import {BaseDO} from '../../../../../../common/base/BaseDO';
import {ISOWeekDay} from '../../../common/data-objects/th-dates/ISOWeekDay';
import {ThDataValidators} from '../../../../../../common/utils/form-utils/utils/ThDataValidators';

export class AllotmentAvailabilityForDayDO extends BaseDO {
	isoWeekDay: ISOWeekDay;
	availableCount: number;

	protected getPrimitivePropertyKeys(): string[] {
		return ["isoWeekDay", "availableCount"];
	}
	isValid(): boolean {
		return _.isNumber(this.availableCount) && this.availableCount >= 0 && ThDataValidators.isValidInteger(this.availableCount);
	}
}