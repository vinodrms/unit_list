import {AThValidator} from './AThValidator';

export class EmailValidator extends AThValidator {
	constructor() {
		super("invalidEmail");
	}

	protected isValidCore(value: any): boolean {
		var emailRegex = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
		return emailRegex.test(value);
	}
}