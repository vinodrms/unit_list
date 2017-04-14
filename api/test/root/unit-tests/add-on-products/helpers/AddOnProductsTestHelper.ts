import { SaveAddOnProductItemDO } from '../../../../../core/domain-layer/add-on-products/SaveAddOnProductItemDO';
import { DefaultDataBuilder } from '../../../../db-initializers/DefaultDataBuilder';
import { TestContext } from '../../../../helpers/TestContext';
import { AddOnProductDO } from '../../../../../core/data-layer/add-on-products/data-objects/AddOnProductDO';
import { AddOnProductCategoryType } from "../../../../../core/data-layer/common/data-objects/add-on-product/AddOnProductCategoryDO";

export class AddOnProductsTestHelper {
	constructor(private _dataBuilder: DefaultDataBuilder, private _testContext: TestContext) {
	}

	public getValidSaveAddOnProductItemDO(): SaveAddOnProductItemDO {
		return {
			categoryId: this.getAddOnProductCategoryIdByType(AddOnProductCategoryType.AddOnProduct),
			notes: "test test test",
			name: "My First Addon Product",
			price: 100.0,
			internalCost: 20.0,
			taxIdList: [this.getFirstValidVatTaxId()],
			fileUrlList: []
		};
	}
	private getAddOnProductCategoryIdByType(type: AddOnProductCategoryType): string {
		return _.find(this._dataBuilder.addOnProductCategoryList, aopCateg => { return aopCateg.type === type; }).id;
	}
	private getFirstValidVatTaxId(): string {
		if (this._dataBuilder.taxes.vatList.length > 0) {
			return this._dataBuilder.taxes.vatList[0].id;
		}
		return "";
	}

	public getSaveAddOnProductItemDOFrom(product: AddOnProductDO) {
		var aopDO: SaveAddOnProductItemDO = {
			categoryId: product.categoryId || this.getAddOnProductCategoryIdByType(AddOnProductCategoryType.AddOnProduct),
			notes: "test test test !!!",
			name: "My First Addon Product [Updated]",
			price: 120.0,
			internalCost: 0,
			taxIdList: [this.getFirstValidVatTaxId()],
			fileUrlList: []
		};
		aopDO['id'] = product.id;
		return aopDO;
	}

	public getSaveAddOnProductItemWithUpdatedPriceFrom(product: AddOnProductDO) {
		var aopDO = this.getSaveAddOnProductItemDOFrom(product);
		aopDO.price = aopDO.price + 100;
		return aopDO;
	}
}