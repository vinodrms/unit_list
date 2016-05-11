import {BaseDO} from '../../../../../common/base/BaseDO';
import {AllotmentDO} from './AllotmentDO';

export class AllotmentsDO extends BaseDO {
	allotmentList: AllotmentDO[];

	protected getPrimitivePropertyKeys(): string[] {
		return [];
	}
	public buildFromObject(object: Object) {
		super.buildFromObject(object);

		this.allotmentList = [];
		this.forEachElementOf(this.getObjectPropertyEnsureUndefined(object, "allotmentList"), (allotmentObject: Object) => {
			var allotmentDO = new AllotmentDO();
			allotmentDO.buildFromObject(allotmentObject);
			this.allotmentList.push(allotmentDO);
		});
	}
}