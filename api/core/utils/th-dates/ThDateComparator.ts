import {ThDateDO} from './data-objects/ThDateDO';
import {IThComparator} from '../th-comparator/IThComparator';
import {ThDateUtils} from './ThDateUtils';

export class ThDateComparator implements IThComparator<ThDateDO> {
	private _thDateUtils: ThDateUtils;

	constructor() {
		this._thDateUtils = new ThDateUtils();
	}

	public compare(firstItem: ThDateDO, secondItem: ThDateDO): number {
		if (firstItem.isBefore(secondItem)) {
			return -1;
		}
		if (firstItem.isAfter(secondItem)) {
			return 1;
		}
		return 0;
	}
}