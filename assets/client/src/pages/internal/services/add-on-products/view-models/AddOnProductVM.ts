import {AddOnProductDO} from '../data-objects/AddOnProductDO';
import {TaxDO} from '../../taxes/data-objects/TaxDO';
import {AddOnProductCategoryDO} from '../../common/data-objects/add-on-product/AddOnProductCategoryDO';

export class AddOnProductVM {
	private _addOnProduct: AddOnProductDO;
	private _taxList: TaxDO[];
	private _category: AddOnProductCategoryDO;

	public get addOnProduct(): AddOnProductDO {
		return this._addOnProduct;
	}
	public set addOnProduct(addOnProduct: AddOnProductDO) {
		this._addOnProduct = addOnProduct;
	}

	public get taxList(): TaxDO[] {
		return this._taxList;
	}
	public set taxList(taxList: TaxDO[]) {
		this._taxList = taxList;
	}

	public get category(): AddOnProductCategoryDO {
		return this._category;
	}
	public set category(category: AddOnProductCategoryDO) {
		this._category = category;
	}
}