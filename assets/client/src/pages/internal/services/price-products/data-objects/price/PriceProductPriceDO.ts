import { BaseDO } from '../../../../../../common/base/BaseDO';
import { PriceProductPriceType, IPriceProductPrice } from './IPriceProductPrice';
import { SinglePriceDO } from './single-price/SinglePriceDO';
import { PricePerPersonDO } from './price-per-person/PricePerPersonDO';
import { PriceExceptionDO } from './price-exceptions/PriceExceptionDO';

export class PriceProductPriceDO extends BaseDO {
	type: PriceProductPriceType;
	priceList: IPriceProductPrice[];
	priceExceptionList: PriceExceptionDO[];

	protected getPrimitivePropertyKeys(): string[] {
		return ["type"];
	}

	public buildFromObject(object: Object) {
		super.buildFromObject(object);

		this.priceList = [];
		this.forEachElementOf(this.getObjectPropertyEnsureUndefined(object, "priceList"), (priceObject: Object) => {
			var price: IPriceProductPrice = this.buildPriceInstance(this.type);
			price.buildFromObject(priceObject);
			this.priceList.push(price);
		});

		this.priceExceptionList = [];
		this.forEachElementOf(this.getObjectPropertyEnsureUndefined(object, "priceExceptionList"), (priceExceptionObject: Object) => {
			let priceException = new PriceExceptionDO();
			priceException.buildFromObject(priceExceptionObject);
			priceException.price = this.buildPriceInstance(this.type);
			priceException.price.buildFromObject(this.getObjectPropertyEnsureUndefined(priceExceptionObject, "price"));
			this.priceExceptionList.push(priceException);
		});
	}
	private buildPriceInstance(type: PriceProductPriceType): IPriceProductPrice {
		if (type === PriceProductPriceType.SinglePrice) {
			return new SinglePriceDO();
		}
		return new PricePerPersonDO();
	}

	public getPriceBriefValueForRoomCategoryId(roomCategoryId: string): number {
		var price: IPriceProductPrice = _.find(this.priceList, (price: IPriceProductPrice) => { return price.getRoomCategoryId() === roomCategoryId });
		if (!price) {
			return 0.0;
		}
		return price.getPriceBriefValue();
	}
}