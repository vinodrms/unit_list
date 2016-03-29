import {AThValidator} from './AThValidator';

export class PhoneValidator extends AThValidator {
	constructor(isNullable?: boolean) {
		super("invalidPhone", isNullable);
	}

	protected isValidCore(value: any): boolean {
		var phoneRegex = /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g;
		return phoneRegex.test(value);
	}
}