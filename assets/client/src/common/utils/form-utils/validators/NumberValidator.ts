import {AThValidator} from './AThValidator';

export class NumberValidator extends AThValidator {
	constructor(isNullable?: boolean) {
		super("invalidNumber", isNullable);
	}

	protected isValidCore(value: any): boolean {
		if (!_.isNumber(value)) {
			return false;
		}
		return value >= 0;
	}
}