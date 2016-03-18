import {AThValidator} from './AThValidator';

export class BooleanValidator extends AThValidator {
	constructor() {
		super("invalidBoolean");
	}

	protected isValidCore(value: any): boolean {
		return _.isBoolean(value);
	}
}