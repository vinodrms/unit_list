import {BaseDO} from '../../../common/base/BaseDO';
import {PriceProductType} from '../../../price-products/data-objects/PriceProductDO';

export class CustomerPriceProductDetailsDO extends BaseDO {
	constructor() {
		super();
	}
	priceProductType: PriceProductType;
	priceProductIdList: string[];
	bookingCode: string;

	protected getPrimitivePropertyKeys(): string[] {
		return ["priceProductType", "priceProductIdList", "bookingCode"];
	}
}