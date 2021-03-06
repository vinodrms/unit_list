import {AddOnProductCategoryDO, AddOnProductCategoryType} from '../../../core/data-layer/common/data-objects/add-on-product/AddOnProductCategoryDO';
import {TestContext} from '../../helpers/TestContext';
import {AddOnProductDO, AddOnProductStatus} from '../../../core/data-layer/add-on-products/data-objects/AddOnProductDO';
import {TaxResponseRepoDO} from '../../../core/data-layer/taxes/repositories/ITaxRepository';
import {ThError} from '../../../core/utils/th-responses/ThError';

import _ = require("underscore");

export interface IAddOnProductDataSource {
	getAddOnProductList(addOnProductCategoryList: AddOnProductCategoryDO[], taxes: TaxResponseRepoDO): AddOnProductDO[];
}

export class DefaultAddOnProductBuilder implements IAddOnProductDataSource {
	constructor(private _testContext: TestContext) {
	}

	public getAddOnProductList(addOnProductCategoryList: AddOnProductCategoryDO[], taxes: TaxResponseRepoDO): AddOnProductDO[] {
		var breakfastCategId = _.find(addOnProductCategoryList, (addOnProductCategory: AddOnProductCategoryDO) => {
			return addOnProductCategory.type == AddOnProductCategoryType.Breakfast;
		}).id;
		var otherCategId = _.find(addOnProductCategoryList, (addOnProductCategory: AddOnProductCategoryDO) => {
			return addOnProductCategory.type != AddOnProductCategoryType.Breakfast;
		}).id;
		var defaultTaxId = taxes.vatList[0].id;
		var aopList = [
			DefaultAddOnProductBuilder.buildAddOnProductDO(this._testContext, breakfastCategId, "Continental Breakfast", 25.0, defaultTaxId),
			DefaultAddOnProductBuilder.buildAddOnProductDO(this._testContext, breakfastCategId, "English Breakfast", 20.0, defaultTaxId),
			DefaultAddOnProductBuilder.buildAddOnProductDO(this._testContext, otherCategId, "Bus Ticket", 29.53, defaultTaxId)
		];
		return aopList;
	}

	public static buildAddOnProductDO(testContext: TestContext, categoryId: string, name: string, price: number, taxId: string): AddOnProductDO {
		var aop = new AddOnProductDO();
		aop.hotelId = testContext.sessionContext.sessionDO.hotel.id;
		aop.status = AddOnProductStatus.Active;
		aop.versionId = 0;
		aop.categoryId = categoryId;
		aop.name = name;
		aop.price = price;
		aop.taxIdList = [taxId];
		aop.notes = "test";
		return aop;
	}

	public loadAddOnProducts(dataSource: IAddOnProductDataSource, addOnProductCategoryList: AddOnProductCategoryDO[], taxes: TaxResponseRepoDO): Promise<AddOnProductDO[]> {
		return new Promise<AddOnProductDO[]>((resolve: { (result: AddOnProductDO[]): void }, reject: { (err: ThError): void }) => {
			this.loadAddOnProductsCore(resolve, reject, dataSource, addOnProductCategoryList, taxes);
		});
	}
	private loadAddOnProductsCore(resolve: { (result: AddOnProductDO[]): void }, reject: { (err: ThError): void }, dataSource: IAddOnProductDataSource, addOnProductCategoryList: AddOnProductCategoryDO[], taxes: TaxResponseRepoDO) {
		var addOnProductList: AddOnProductDO[] = dataSource.getAddOnProductList(addOnProductCategoryList, taxes);
		var addOnProductRepository = this._testContext.appContext.getRepositoryFactory().getAddOnProductRepository();

		var aopPromiseList: Promise<AddOnProductDO>[] = [];
		addOnProductList.forEach((addOnProduct: AddOnProductDO) => {
			aopPromiseList.push(addOnProductRepository.addAddOnProduct({ hotelId: this._testContext.sessionContext.sessionDO.hotel.id }, addOnProduct));
		});
		Promise.all(aopPromiseList).then((addOnProductList: AddOnProductDO[]) => {
			resolve(addOnProductList);
		}).catch((error: any) => {
			reject(error);
		});
	}
}