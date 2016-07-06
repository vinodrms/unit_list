import {AThValidator} from './AThValidator';
import {ThDataValidators} from '../utils/ThDataValidators';

export class EmailValidator extends AThValidator {
	constructor(isNullable?: boolean) {
		super("invalidEmail", isNullable);
	}

	protected isValidCore(value: any): boolean {
		return ThDataValidators.isValidEmail(value);
	}
}