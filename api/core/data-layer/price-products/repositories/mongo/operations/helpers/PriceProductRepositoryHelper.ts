import {PriceProductDO} from '../../../../data-objects/PriceProductDO';

export class PriceProductRepositoryHelper {
	public buildPriceProductDOFrom(dbPriceProduct: Object): PriceProductDO {
		var priceProduct: PriceProductDO = new PriceProductDO();
		priceProduct.buildFromObject(dbPriceProduct);
		return priceProduct;
	}
	public buildPriceProductListFrom(dbPriceProductList: Array<Object>): PriceProductDO[] {
		var list: PriceProductDO[] = [];
		dbPriceProductList.forEach((dbPriceProduct: Object) => {
			list.push(this.buildPriceProductDOFrom(dbPriceProduct));
		});
		return list;
	}
}