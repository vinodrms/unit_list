import {BaseDO} from '../../../../../common/base/BaseDO';
import {CustomerDO} from './CustomerDO';

export class CustomersDO extends BaseDO {
	customerList: CustomerDO[];

	protected getPrimitivePropertyKeys(): string[] {
		return [];
	}
	public buildFromObject(object: Object) {
		super.buildFromObject(object);

		this.customerList = [];
		this.forEachElementOf(this.getObjectPropertyEnsureUndefined(object, "customerList"), (custObject: Object) => {
			var custDO = new CustomerDO();
			custDO.buildFromObject(custObject);
			this.customerList.push(custDO);
		});
	}
}