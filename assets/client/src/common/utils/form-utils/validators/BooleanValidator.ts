import { AThValidator } from './AThValidator';

import * as _ from "underscore";

export class BooleanValidator extends AThValidator {
	constructor() {
		super("invalidBoolean");
	}

	protected isValidCore(value: any): boolean {
		return _.isBoolean(value);
	}
}