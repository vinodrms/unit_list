import {BaseDO} from '../../../../../../../common/base/BaseDO';
import {ThDataValidators} from '../../../../../../../common/utils/form-utils/utils/ThDataValidators';

export class PriceForFixedNumberOfPersonsDO extends BaseDO {
	noOfPersons: number;
	price: number;
	
	constructor(noOfPersons?: number) {
		super();
		this.noOfPersons = noOfPersons;
	}

	protected getPrimitivePropertyKeys(): string[] {
		return ["noOfPersons", "price"];
	}
	
	public isValid(): boolean {
		return ThDataValidators.isValidPrice(this.price);
	}
	
}