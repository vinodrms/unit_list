import {BaseDO} from '../../../common/base/BaseDO';
import {ThDateDO} from '../../../../utils/th-dates/data-objects/ThDateDO';

export class AllotmentInventoryForDateDO extends BaseDO {
	thDate: ThDateDO;
	availableCount: number;

	protected getPrimitivePropertyKeys(): string[] {
		return ["availableCount"];
	}
	public buildFromObject(object: Object) {
		super.buildFromObject(object);

		this.thDate = new ThDateDO();
		this.thDate.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "thDate"));
	}
}