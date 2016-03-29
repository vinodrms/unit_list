import {AddOnProductCategoryDO, AddOnProductCategoryType} from '../../../../../core/data-layer/common/data-objects/add-on-product/AddOnProductCategoryDO';
import {TaxResponseRepoDO} from '../../../../../core/data-layer/taxes/repositories/ITaxRepository';
import {AddOnProductDO} from '../../../../../core/data-layer/add-on-products/data-objects/AddOnProductDO';
import {DefaultAddOnProductBuilder, IAddOnProductDataSource} from '../../../../db-initializers/builders/DefaultAddOnProductBuilder';
import {TestContext} from '../../../../helpers/TestContext';
import {TestUtils} from '../../../../helpers/TestUtils';

import _ = require("underscore");

export class AddOnProductDataSource implements IAddOnProductDataSource {
	public static NumAddOnProducts = 100;

	private _testUtils: TestUtils;

	constructor(private _testContext: TestContext) {
		this._testUtils = new TestUtils();
	}

	public getBreakfastCategory(addOnProductCategoryList: AddOnProductCategoryDO[]): AddOnProductCategoryDO {
		return _.find(addOnProductCategoryList, (addOnProductCategory: AddOnProductCategoryDO) => { return addOnProductCategory.type === AddOnProductCategoryType.Breakfast });
	}

	public getAddOnProductList(addOnProductCategoryList: AddOnProductCategoryDO[], taxes: TaxResponseRepoDO): AddOnProductDO[] {
		var defaultTaxId = taxes.vatList[0].id;
		var aopList = [];

		var breakfastCategory = this.getBreakfastCategory(addOnProductCategoryList);
		aopList.push(DefaultAddOnProductBuilder.buildAddOnProductDO(this._testContext, breakfastCategory.id, "Continental Breakfast", 15.0, defaultTaxId));

		for (var addOnProductIndex = 0; addOnProductIndex < (AddOnProductDataSource.NumAddOnProducts - 1); addOnProductIndex++) {
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