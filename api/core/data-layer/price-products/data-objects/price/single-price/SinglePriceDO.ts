import {BaseDO} from '../../../../common/base/BaseDO';
import {IPriceProductPrice} from '../IPriceProductPrice';

export class SinglePriceDO extends BaseDO implements IPriceProductPrice {
	price: number;

	protected getPrimitivePropertyKeys(): string[] {
		return ["price"];
	}

	public getPriceFor(noOfAdults: number, noOfChildren: number): number {
		return this.price;
	}
}