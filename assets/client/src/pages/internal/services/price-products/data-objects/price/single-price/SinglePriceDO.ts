import {BaseDO} from '../../../../../../../common/base/BaseDO';
import {IPriceProductPrice} from '../IPriceProductPrice';

export class SinglePriceDO extends BaseDO implements IPriceProductPrice {
	roomCategoryId: string;
	price: number;

	protected getPrimitivePropertyKeys(): string[] {
		return ["roomCategoryId", "price"];
	}
}