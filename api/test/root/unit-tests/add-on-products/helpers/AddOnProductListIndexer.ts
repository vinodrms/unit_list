import {AddOnProductDO} from '../../../../../core/data-layer/add-on-products/data-objects/AddOnProductDO';
import {TestUtils} from '../../../../helpers/TestUtils';

import _ = require("underscore");

export class AddOnProductListIndexer {
	public static SecondPageCount = 10;

	private _testUtils: TestUtils;
	private _addOnProductList: AddOnProductDO[];

	constructor() {
		this._testUtils = new TestUtils();
		this._addOnProductList = [];
	}

	public insertAddOnProductList(list: AddOnProductDO[]) {
		this._addOnProductList = this._addOnProductList.concat(list);
	}

	public get categoryIdList(): string[] {
		var categIdList: string[] = _.map(this._addOnProductList, (aop: AddOnProductDO) => { return aop.categoryId });
		return _.uniq(categIdList);
	}

	public get addAllAddOnProductIdList(): string[] {
		var aopIdList: string[] = _.map(this._addOnProductList, (aop: AddOnProductDO) => { return aop.id });
		return _.uniq(aopIdList);
	}

	public get randomAddOnProductNameSubstring(): string {
		var randomAop = this._testUtils.getRandomListElement(this._addOnProductList);
		var randomName = randomAop.name;
		return randomName.substr(0, this._testUtils.getRandomIntBetween(0, randomName.length - 1)).toLowerCase();
	}

	public get randomAddOnProductCategoryId(): string {
		var randomAop = this._testUtils.getRandomListElement(this._addOnProductList);
		return randomAop.categoryId;
	}

	public filterAddOnProductsByName(name: string): AddOnProductDO[] {
		return _.filter(this._addOnProductList, (aop: AddOnProductDO) => { return aop.name.toLowerCase().indexOf(name) != -1 });
	}
	public filterAddOnProductsByCategoryId(categoryId: string): AddOnProductDO[] {
		return _.filter(this._addOnProductList, (aop: AddOnProductDO) => { return aop.categoryId === categoryId });
	}

	public get lazyLoadingPageSize(): number {
		return this._addOnProductList.length - AddOnProductListIndexer.SecondPageCount;
	}
}