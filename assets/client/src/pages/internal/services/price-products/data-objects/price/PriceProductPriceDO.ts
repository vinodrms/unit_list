import {BaseDO} from '../../../../../../common/base/BaseDO';
import {PriceProductPriceType, IPriceProductPrice, PriceProductPriceConfigurationState} from './IPriceProductPrice';
import {SinglePriceDO} from './single-price/SinglePriceDO';
import {PricePerPersonDO} from './price-per-person/PricePerPersonDO';

export class PriceProductPriceDO extends BaseDO implements IPriceProductPrice {
	type: PriceProductPriceType;
	priceConfigurationState: PriceProductPriceConfigurationState;
	priceList: IPriceProductPrice[];

	protected getPrimitivePropertyKeys(): string[] {
		return ["type", "priceConfigurationState"];
	}

	public buildFromObject(object: Object) {
		super.buildFromObject(object);

		this.priceList = [];
		this.forEachElementOf(this.getObjectPropertyEnsureUndefined(object, "priceList"), (priceObject: Object) => {
			var price: IPriceProductPrice;
			switch (this.type) {
				case PriceProductPriceType.SinglePrice:
					price = new SinglePriceDO();
					break;
				case PriceProductPriceType.PricePerPerson:
					price = new PricePerPersonDO();
					break;
			}
			price.buildFromObject(priceObject);
			this.priceList.push(price);
		});
	}
}