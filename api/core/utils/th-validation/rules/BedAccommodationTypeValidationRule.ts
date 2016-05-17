import {AValidationRule} from './core/AValidationRule';
import {InvalidConstraintType} from './core/ValidationResult';
import {NumberValidationRule} from './NumberValidationRule';
import {BedAccommodationType} from '../../../data-layer/common/data-objects/bed/BedDO';

export class BedAccommodationTypeValidationRule extends AValidationRule {
    
	private _numberValidationRule: NumberValidationRule;
	constructor() {
		super(InvalidConstraintType.BedAccommodationType);
		this._numberValidationRule = new NumberValidationRule();
	}
	protected validateCore(object: any): boolean {
		var numberValidationResult = this._numberValidationRule.validate(object);
		if (!numberValidationResult.isValid()) {
			return false;
		}
		return this.validateBedAccommodationValue(object);
	}
    private validateBedAccommodationValue(object: any) {
        return object === BedAccommodationType.AdultsAndChildren || object === BedAccommodationType.Babies;    
    }
}