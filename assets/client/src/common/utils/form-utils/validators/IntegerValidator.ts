import {AThValidator} from './AThValidator';
import {ThDataValidators} from '../utils/ThDataValidators';

export class IntegerValidator extends AThValidator {
	constructor(private _minValue?: number) {
		super("invalidInteger", false);
	}

	protected isValidCore(value: any): boolean {
		if (!_.isNumber(value)) {
			return false;
		}
		if (_.isNumber(this._minValue) && this._minValue > value) {
			return false;
		}
		return ThDataValidators.isValidInteger(value);
	}
}