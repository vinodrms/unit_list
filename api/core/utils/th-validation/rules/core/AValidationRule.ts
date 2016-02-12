import {IValidationRule} from './IValidationRule';
import {ValidationResult, InvalidConstraintType} from './ValidationResult';
import {ThUtils} from '../../../../utils/ThUtils';

export abstract class AValidationRule implements IValidationRule {
	protected _thUtils: ThUtils;
	private _isNullable: boolean;

	constructor(protected _invalidConstraint: InvalidConstraintType) {
		this._thUtils = new ThUtils();
		this._isNullable = false;
	}
	public get isNullable(): boolean {
		return this._isNullable;
	}
	public set isNullable(isNullable: boolean) {
		this._isNullable = isNullable;
	}
	public validate(object: any): ValidationResult {
		if (this._thUtils.isUndefinedOrNull(object) && this.isNullable) {
			return this.returnSuccesfulValidationResult();
		}
		if (this.validateCore(object)) {
			return this.returnSuccesfulValidationResult();
		}
		return this.returnInsuccesfulValidationResult();
	}
	private returnSuccesfulValidationResult(): ValidationResult {
		return new ValidationResult();
	}
	private returnInsuccesfulValidationResult(): ValidationResult {
		return new ValidationResult(this._invalidConstraint);
	}

	protected abstract validateCore(field: any): boolean;
}