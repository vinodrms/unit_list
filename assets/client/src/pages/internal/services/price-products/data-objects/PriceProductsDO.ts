import {BaseDO} from '../../../../../common/base/BaseDO';
import {PriceProductDO} from './PriceProductDO';

export class PriceProductsDO extends BaseDO {
	priceProductList: PriceProductDO[];

	protected getPrimitivePropertyKeys(): string[] {
		return [];
	}
	public buildFromObject(object: Object) {
		super.buildFromObject(object);

		this.priceProductList = [];
		this.forEachElementOf(this.getObjectPropertyEnsureUndefined(object, "priceProductList"), (ppObject: Object) => {
			var ppDO = new PriceProductDO();
			ppDO.buildFromObject(ppObject);
			this.priceProductList.push(ppDO);
		});
	}
}