import {AddOnProductCategoryDO} from '../../../../../core/data-layer/common/data-objects/add-on-product/AddOnProductCategoryDO';
import {TaxResponseRepoDO} from '../../../../../core/data-layer/taxes/repositories/ITaxRepository';
import {AddOnProductDO} from '../../../../../core/data-layer/add-on-products/data-objects/AddOnProductDO';
import {DefaultAddOnProductBuilder, IAddOnProductDataSource} from '../../../../db-initializers/builders/DefaultAddOnProductBuilder';
import {TestContext} from '../../../../helpers/TestContext';
import {TestUtils} from '../../../../helpers/TestUtils';

export class AddOnProductDataSource implements IAddOnProductDataSource {
	public static NumAddOnProducts = 100;

	private _testUtils: TestUtils;

	constructor(private _testContext: TestContext) {
		this._testUtils = new TestUtils();
	}

	public getAddOnProductList(addOnProductCategoryList: AddOnProductCategoryDO[], taxes: TaxResponseRepoDO): AddOnProductDO[] {
		var defaultTaxId = taxes.vatList[0].id;
		var aopList = [];

		for (var addOnProductIndex = 0; addOnProductIndex < AddOnProductDataSource.NumAddOnProducts; addOnProductIndex++) {
			var categId = this.getRandomCategoryIdFrom(addOnProductCategoryList);
			var name = "Bulk AddOn Product " + addOnProductIndex;
			var price = this._testUtils.getRandomFloatBetween(-100, 10000);
			aopList.push(DefaultAddOnProductBuilder.buildAddOnProductDO(this._testContext, categId, name, price, defaultTaxId));
		}
		return aopList;
	}
	private getRandomCategoryIdFrom(addOnProductCategoryList: AddOnProductCategoryDO[]): string {
		var randomId = this._testUtils.getRandomIntBetween(0, addOnProductCategoryList.length - 1);
		return addOnProductCategoryList[randomId].id;
	}
}