import {BaseDO} from '../../../../../common/base/BaseDO';
import {TimezoneDO} from './TimezoneDO';

export class TimezoneResponseDO extends BaseDO {
	timezoneList: TimezoneDO[];

	protected getPrimitivePropertyKeys(): string[] {
		return [];
	}
	public buildFromObject(object: Object) {
		super.buildFromObject(object);

		this.timezoneList = this.getTimezoneDOListFrom(object, "timezoneList");
		
	}
	private getTimezoneDOListFrom(object: Object, key: string): TimezoneDO[] {
		var timezoneList: TimezoneDO[] = [];
		this.forEachElementOf(this.getObjectPropertyEnsureUndefined(object, key), (taxObject: Object) => {
			var timezoneDO = new TimezoneDO();
			timezoneDO.buildFromObject(taxObject);
			timezoneList.push(timezoneDO);
		});
		return timezoneList;
	}
}