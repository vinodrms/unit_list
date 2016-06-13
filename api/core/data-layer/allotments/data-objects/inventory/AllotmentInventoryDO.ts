import {BaseDO} from '../../../common/base/BaseDO';
import {AllotmentInventoryForDateDO} from './AllotmentInventoryForDateDO';

export class AllotmentInventoryDO extends BaseDO {
	inventoryForDateList: AllotmentInventoryForDateDO[];

	protected getPrimitivePropertyKeys(): string[] {
		return [];
	}
	public buildFromObject(object: Object) {
		super.buildFromObject(object);

		this.inventoryForDateList = [];
		this.forEachElementOf(this.getObjectPropertyEnsureUndefined(object, "inventoryForDateList"), (inventoryForDateObject: Object) => {
			var inventoryForDateDO = new AllotmentInventoryForDateDO();
			inventoryForDateDO.buildFromObject(inventoryForDateObject);
			this.inventoryForDateList.push(inventoryForDateDO);
		});
	}
}