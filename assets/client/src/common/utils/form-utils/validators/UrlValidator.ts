import {AThValidator} from './AThValidator';

export class UrlValidator extends AThValidator {
	constructor(isNullable?: boolean) {
		super("invalidUrl", isNullable);
	}

	protected isValidCore(value: any): boolean {
		var urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
		return urlRegex.test(value);
	}
}