import {BaseDO} from '../../../../../../common/base/BaseDO';
import {AllotmentAvailabilityForDayDO} from './AllotmentAvailabilityForDayDO';
import {ISOWeekDay, ISOWeekDayUtils} from '../../../common/data-objects/th-dates/ISOWeekDay';

export class AllotmentAvailabilityDO extends BaseDO {
	availabilityForDayList: AllotmentAvailabilityForDayDO[];

	protected getPrimitivePropertyKeys(): string[] {
		return [];
	}
	public buildFromObject(object: Object) {
		super.buildFromObject(object);

		this.availabilityForDayList = [];
		this.forEachElementOf(this.getObjectPropertyEnsureUndefined(object, "availabilityForDayList"), (availabilityForDayObject: Object) => {
			var availabilityForDayDO = new AllotmentAvailabilityForDayDO();
			availabilityForDayDO.buildFromObject(availabilityForDayObject);
			this.availabilityForDayList.push(availabilityForDayDO);
		});
	}

	public getAllotmentAvailabilityForDayDO(isoWeekDay: ISOWeekDay): AllotmentAvailabilityForDayDO {
		return _.find(this.availabilityForDayList, (availabilityForDay: AllotmentAvailabilityForDayDO) => {
			return availabilityForDay.isoWeekDay === isoWeekDay;
		});
	}
}