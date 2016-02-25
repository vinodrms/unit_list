import {AddOnProductDO} from '../../../../data-objects/AddOnProductDO';

export class AddOnProductRepositoryHelper {
	buildAddOnProductDOFrom(dbAddOnProduct: Object): AddOnProductDO {
		var aop: AddOnProductDO = new AddOnProductDO();
		aop.buildFromObject(dbAddOnProduct);
		return aop;
	}
}