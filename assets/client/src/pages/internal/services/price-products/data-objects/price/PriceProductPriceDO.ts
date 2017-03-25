import { BaseDO } from '../../../../../../common/base/BaseDO';
import { PriceProductPriceType, IPriceProductPrice } from './IPriceProductPrice';
import { SinglePriceDO } from './single-price/SinglePriceDO';
import { PricePerPersonDO } from './price-per-person/PricePerPersonDO';
import { PriceExceptionDO } from './price-exceptions/PriceExceptionDO';
import { DynamicPriceDO } from "./DynamicPriceDO";
import { PricePerDayDO } from "../../../bookings/data-objects/price/PricePerDayDO";
import { ThDateDO } from "../../../common/data-objects/th-dates/ThDateDO";

export class PriceProductPriceDO extends BaseDO {
	type: PriceProductPriceType;
	dynamicPriceList: DynamicPriceDO[];

	/*
		`index` : the UTC timestamp of the date
		`value` : the id of the dynamic price
		if a dynamic price id does not exist => the first one is used
	*/
	enabledDynamicPriceIdByDate: { [index: number]: string; };

	protected getPrimitivePropertyKeys(): string[] {
		return ["type", "enabledDynamicPriceIdByDate"];
	}

	public buildFromObject(object: Object) {
		super.buildFromObject(object);

		this.dynamicPriceList = [];
		this.forEachElementOf(this.getObjectPropertyEnsureUndefined(object, "dynamicPriceList"), (dynamicPriceObject: Object) => {
			var dynamicPrice = new DynamicPriceDO(this.type);
			dynamicPrice.buildFromObject(dynamicPriceObject);
			this.dynamicPriceList.push(dynamicPrice);
		});
	}

	private getDefaultDynamicPrice(): DynamicPriceDO {
		return this.dynamicPriceList[0];
	}

	public getDynamicPriceById(dynamicPriceId: string): DynamicPriceDO {
		return _.find(this.dynamicPriceList, dynamicPrice => {
			return dynamicPrice.id === dynamicPriceId;
		});
	}

	public getRoomCategoryIdList(): string[] {
		// all the dynamic rates have prices defined for the same room category ids
		return this.dynamicPriceList[0].getRoomCategoryIdList();
	}

	public getPriceBriefValueForRoomCategoryId(roomCategoryId: string) {
		var price: IPriceProductPrice = _.find(this.dynamicPriceList[0].priceList, (price: IPriceProductPrice) => { return price.getRoomCategoryId() === roomCategoryId });
		if (!price) {
			return 0.0;
		}
		return price.getPriceBriefValue();
	}

	public static buildPriceInstance(type: PriceProductPriceType): IPriceProductPrice {
		if (type === PriceProductPriceType.SinglePrice) {
			return new SinglePriceDO();
		}
		return new PricePerPersonDO();
	}
}