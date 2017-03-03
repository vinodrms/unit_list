import { BaseDO } from '../../../../../../../common/base/BaseDO';
import { IPriceProductPrice } from '../IPriceProductPrice';
import { RoomCategoryStatsDO } from '../../../../room-categories/data-objects/RoomCategoryStatsDO';
import { ThDataValidators } from '../../../../../../../common/utils/form-utils/utils/ThDataValidators';

export class SinglePriceDO extends BaseDO implements IPriceProductPrice {
	roomCategoryId: string;
	price: number;

	protected getPrimitivePropertyKeys(): string[] {
		return ["roomCategoryId", "price"];
	}

	public prototypeForStats(roomCategoryStats: RoomCategoryStatsDO): SinglePriceDO {
		var singlePrice: SinglePriceDO = new SinglePriceDO();
		singlePrice.roomCategoryId = roomCategoryStats.roomCategory.id;
		singlePrice.price = this.price;
		return singlePrice;
	}
	public isValid(): boolean {
		return ThDataValidators.isValidPrice(this.price);
	}

	public getPriceBriefValue(): number {
		return this.price;
	}
	public getPriceBriefLineString(): string {
		return this.price + "";
	}
	public getRoomCategoryId(): string {
		return this.roomCategoryId;
	}
	public copyPricesFrom(otherPrice: SinglePriceDO) {
		this.price = otherPrice.price;
	}
}