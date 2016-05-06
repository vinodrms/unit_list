import {BaseDO} from '../../../common/base/BaseDO';
import {AllotmentAvailabilityForDayDO} from './AllotmentAvailabilityForDayDO';

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
}