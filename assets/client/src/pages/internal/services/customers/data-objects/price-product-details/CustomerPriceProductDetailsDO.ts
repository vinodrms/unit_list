import {BaseDO} from '../../../../../../common/base/BaseDO';
import {PriceProductAvailability} from '../../../price-products/data-objects/PriceProductDO';

export class CustomerPriceProductDetailsDO extends BaseDO {
	constructor() {
		super();
	}
	allowPublicPriceProducts: boolean;
	priceProductIdList: string[];
	bookingCode: string;

	protected getPrimitivePropertyKeys(): string[] {
		return ["allowPublicPriceProducts", "priceProductIdList", "bookingCode"];
	}
}