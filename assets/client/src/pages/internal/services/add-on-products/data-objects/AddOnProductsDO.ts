import {BaseDO} from '../../../../../common/base/BaseDO';
import {AddOnProductDO} from './AddOnProductDO';

export class AddOnProductsDO extends BaseDO {
	addOnProductList: AddOnProductDO[];

	protected getPrimitivePropertyKeys(): string[] {
		return [];
	}
	public buildFromObject(object: Object) {
		super.buildFromObject(object);

		this.addOnProductList = [];
		this.forEachElementOf(this.getObjectPropertyEnsureUndefined(object, "addOnProductList"), (aopObject: Object) => {
			var aopDO = new AddOnProductDO();
			aopDO.buildFromObject(aopObject);
			this.addOnProductList.push(aopDO);
		});
	}

	public addAddOnProduct(addOnProductDO: AddOnProductDO) {
		this.addOnProductList.push(addOnProductDO);
	}
	public getAddOnProductById(addOnProductId: string): AddOnProductDO {
		return _.find(this.addOnProductList, (addOnProduct: AddOnProductDO) => { return addOnProduct.id === addOnProductId });
	}
}