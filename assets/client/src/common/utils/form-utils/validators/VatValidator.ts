import {AThValidator} from './AThValidator';

export class VatValidator extends AThValidator {
	constructor() {
		super("invalidVat");
	}

	protected isValidCore(value: any): boolean {
		var vatRegex = /^[0-9\-]*$/;
		return vatRegex.test(value);
	}
}