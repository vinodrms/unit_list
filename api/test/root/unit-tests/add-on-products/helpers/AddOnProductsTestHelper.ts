import {SaveAddOnProductItemDO} from '../../../../../core/domain-layer/add-on-products/SaveAddOnProductItemDO';
import {DefaultDataBuilder} from '../../../../db-initializers/DefaultDataBuilder';
import {TestContext} from '../../../../helpers/TestContext';
import {AddOnProductDO} from '../../../../../core/data-layer/add-on-products/data-objects/AddOnProductDO';

export class AddOnProductsTestHelper {
	constructor(private _dataBuilder: DefaultDataBuilder, private _testContext: TestContext) {
	}

	public getValidSaveAddOnProductItemDO(): SaveAddOnProductItemDO {
		return {
			categoryId: this.getFirstValidCategoryId(),
			notes: "test test test",
			name: "My First Addon Product",
			price: 100.0,
			taxIdList: [this.getFirstValidVatTaxId()]
		};
	}
	private getFirstValidCategoryId(): string {
		if (this._dataBuilder.addOnProductCategoryList.length > 0) {
			return this._dataBuilder.addOnProductCategoryList[0].id;
		}
		return "";
	}
	private getFirstValidVatTaxId(): string {
		if (this._dataBuilder.taxes.vatList.length > 0) {
			return this._dataBuilder.taxes.vatList[0].id;
		}
		return "";
	}

	public getSaveAddOnProductItemDOFrom(product: AddOnProductDO) {
		var aopDO: SaveAddOnProductItemDO = {
			categoryId: this.getFirstValidCategoryId(),
			notes: "test test test !!!",
			name: "My First Addon Product [Updated]",
			price: 120.0,
			taxIdList: [this.getFirstValidVatTaxId()]
		};
		aopDO['id'] = product.id;
		return aopDO;
	}
}