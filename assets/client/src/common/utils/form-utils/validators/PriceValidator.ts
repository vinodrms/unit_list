import {AThValidator} from './AThValidator';

export class PriceValidator extends AThValidator {
	constructor(isNullable?: boolean) {
		super("invalidPrice", isNullable);
	}

	protected isValidCore(value: any): boolean {
		if (!_.isNumber(value)) {
			return false;
		}
		return value >= 0.0;
	}
}