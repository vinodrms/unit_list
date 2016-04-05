import {AddOnProductDO} from '../data-objects/AddOnProductDO';
import {TaxDO, TaxType} from '../../taxes/data-objects/TaxDO';
import {AddOnProductCategoryDO} from '../../common/data-objects/add-on-product/AddOnProductCategoryDO';
import {CurrencyDO} from '../../common/data-objects/currency/CurrencyDO';

export class AddOnProductVM {
	private _addOnProduct: AddOnProductDO;
	private _taxList: TaxDO[];
	private _category: AddOnProductCategoryDO;
	private _vatTax: TaxDO;
	private _ccy: CurrencyDO;

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
		this._vatTax = _.find(this._taxList, (tax: TaxDO) => {
			return tax.type === TaxType.Vat;
		});
	}

	public get category(): AddOnProductCategoryDO {
		return this._category;
	}
	public set category(category: AddOnProductCategoryDO) {
		this._category = category;
	}
	public get vatTax(): TaxDO {
		return this._vatTax;
	}
	public set vatTax(vatTax: TaxDO) {
		this._vatTax = vatTax;
	}
	public get ccy(): CurrencyDO {
		return this._ccy;
	}
	public set ccy(ccy: CurrencyDO) {
		this._ccy = ccy;
	}
}