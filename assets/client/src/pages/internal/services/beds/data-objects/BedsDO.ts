import {BaseDO} from '../../../../../common/base/BaseDO';
import {BedDO} from './BedDO';

export class BedsDO extends BaseDO {
    bedList: BedDO[];

	protected getPrimitivePropertyKeys(): string[] {
		return [];
	}
	public buildFromObject(object: Object) {
		super.buildFromObject(object);

		this.bedList = [];
		this.forEachElementOf(this.getObjectPropertyEnsureUndefined(object, "bedList"), (bedObject: Object) => {
			var bedDO = new BedDO();
			bedDO.buildFromObject(bedObject);
			this.bedList.push(bedDO);
		});
	}

}