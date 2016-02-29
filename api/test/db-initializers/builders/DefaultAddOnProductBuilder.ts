import {AddOnProductCategoryDO} from '../../../core/data-layer/common/data-objects/add-on-product/AddOnProductCategoryDO';
import {TestContext} from '../../helpers/TestContext';
import {AddOnProductDO, AddOnProductStatus} from '../../../core/data-layer/add-on-products/data-objects/AddOnProductDO';
import {TaxResponseRepoDO} from '../../../core/data-layer/taxes/repositories/ITaxRepository';
import {ThError} from '../../../core/utils/th-responses/ThError';

export interface IAddOnProductDataSource {
	getAddOnProductList(addOnProductCategoryList: AddOnProductCategoryDO[], taxes: TaxResponseRepoDO): AddOnProductDO[];
}

export class DefaultAddOnProductBuilder implements IAddOnProductDataSource {
	constructor(private _testContext: TestContext) {
	}

	public getAddOnProductList(addOnProductCategoryList: AddOnProductCategoryDO[], taxes: TaxResponseRepoDO): AddOnProductDO[] {
		var defaultCategId = addOnProductCategoryList[0].id;
		var defaultTaxId = taxes.vatList[0].id;
		var aopList = [];
		aopList.push(DefaultAddOnProductBuilder.buildAddOnProductDO(this._testContext, defaultCategId, "First AddOn Product", 100.0, defaultTaxId));
		aopList.push(DefaultAddOnProductBuilder.buildAddOnProductDO(this._testContext, defaultCategId, "Second AddOn Product", 200.0, defaultTaxId));
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