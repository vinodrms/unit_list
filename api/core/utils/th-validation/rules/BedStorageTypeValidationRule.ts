import {AValidationRule} from './core/AValidationRule';
import {InvalidConstraintType} from './core/ValidationResult';
import {NumberValidationRule} from './NumberValidationRule';
import {BedStorageType} from '../../../data-layer/common/data-objects/bed/BedDO';

export class BedStorageTypeValidationRule extends AValidationRule {
    
	private _numberValidationRule: NumberValidationRule;
	constructor() {
		super(InvalidConstraintType.BedStorageType);
		this._numberValidationRule = new NumberValidationRule();
	}
	protected validateCore(object: any): boolean {
		var numberValidationResult = this._numberValidationRule.validate(object);
		if (!numberValidationResult.isValid()) {
			return false;
		}
		return this.validateBedStorageValue(object);
	}
    private validateBedStorageValue(object: any) {
        return object === BedStorageType.Rollaway || object === BedStorageType.Stationary;    
    }
}