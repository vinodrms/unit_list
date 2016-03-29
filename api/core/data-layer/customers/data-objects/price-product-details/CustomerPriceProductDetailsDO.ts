import {BaseDO} from '../../../common/base/BaseDO';
import {PriceProductAvailability} from '../../../price-products/data-objects/PriceProductDO';

export class CustomerPriceProductDetailsDO extends BaseDO {
	constructor() {
		super();
	}
	priceProductAvailability: PriceProductAvailability;
	priceProductIdList: string[];
	bookingCode: string;

	protected getPrimitivePropertyKeys(): string[] {
		return ["priceProductAvailability", "priceProductIdList", "bookingCode"];
	}
}