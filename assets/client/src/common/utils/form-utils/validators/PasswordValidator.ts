import {AThValidator} from './AThValidator';

export class PasswordValidator extends AThValidator {
	constructor() {
		super("invalidPassword");
	}

	protected isValidCore(value: any): boolean {
		var passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{6,}$/;
		return passwordRegex.test(value);
	}
}