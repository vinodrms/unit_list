import {AddOnProductDO} from '../../../../data-objects/AddOnProductDO';

export class AddOnProductRepositoryHelper {
	public buildAddOnProductDOFrom(dbAddOnProduct: Object): AddOnProductDO {
		var aop: AddOnProductDO = new AddOnProductDO();
		aop.buildFromObject(dbAddOnProduct);
		return aop;
	}
	public buildAddOnProductListFrom(dbAddOnProductList: Array<Object>): AddOnProductDO[] {
		var list: AddOnProductDO[] = [];
		dbAddOnProductList.forEach((dbAddOnProduct: Object) => {
			list.push(this.buildAddOnProductDOFrom(dbAddOnProduct));
		});
		return list;
	}
}