import {AThValidator} from './AThValidator';

export class PasswordValidator extends AThValidator {
	private static MinLength = 6;
	private static PasswordRegexList: RegExp[] = [
		/^(?=.*[a-z]).+$/,
		/^(?=.*[A-Z]).+$/,
		/^(?=.*\d).+$/
	]

	constructor() {
		super("invalidPassword");
	}

	protected isValidCore(value: any): boolean {
		var valueStr: string = value;
		if (valueStr.length < PasswordValidator.MinLength) {
			return false;
		}
		for (var index = 0; index < PasswordValidator.PasswordRegexList.length; index++) {
			var regex = PasswordValidator.PasswordRegexList[index];
			if (!regex.test(valueStr)) {
				return false;
			}
		}
		return true;
	}
}