import {BaseDO} from '../../../../../../../common/base/BaseDO';

export class PriceForFixedNumberOfPersonsDO extends BaseDO {
	noOfPersons: number;
	price: number;

	protected getPrimitivePropertyKeys(): string[] {
		return ["noOfPersons", "price"];
	}
}