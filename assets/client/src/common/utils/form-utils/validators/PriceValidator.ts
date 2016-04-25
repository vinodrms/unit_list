import {AThValidator} from './AThValidator';
import {ThDataValidators} from '../utils/ThDataValidators';

export class PriceValidator extends AThValidator {
	constructor(isNullable?: boolean) {
		super("invalidPrice", isNullable);
	}

	protected isValidCore(value: any): boolean {
		return ThDataValidators.isValidPrice(value);
	}
}