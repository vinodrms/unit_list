import {BaseDO} from '../../../common/base/BaseDO';
import {AllotmentAvailabilityForDayDO} from './AllotmentAvailabilityForDayDO';
import {ISOWeekDay, ISOWeekDayUtils} from '../../../../utils/th-dates/data-objects/ISOWeekDay';

import _ = require('underscore');

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

	public isValid(): boolean {
		var isoWeekDayList = _.map(this.availabilityForDayList, (availabilityForDay: AllotmentAvailabilityForDayDO) => {
			return availabilityForDay.isoWeekDay;
		});
		var weekDayUtils = new ISOWeekDayUtils();
		var noOfWeekDays = weekDayUtils.getISOWeekDayList().length;
		return _.uniq(isoWeekDayList).length === noOfWeekDays;
	}
	public getAllotmentAvailabilityForDay(isoWeekDay: ISOWeekDay): AllotmentAvailabilityForDayDO {
		return _.find(this.availabilityForDayList, (availabilityForDay: AllotmentAvailabilityForDayDO) => {
			return availabilityForDay.isoWeekDay === isoWeekDay;
		});
	}
}