import {IValidationRule} from './IValidationRule';
import {ValidationResult, InvalidConstraintType} from './ValidationResult';
import {ThUtils} from '../../../../utils/ThUtils';

export class IntermediateValidationResult {
	key: string;
	value: any;
	valid: boolean;
	constraintType: InvalidConstraintType;
	
	constructor(key: string, value: any, valid: boolean, constraintType: InvalidConstraintType) {
		this.constraintType = constraintType;
		this.valid = valid;
		this.key = key;
		this.value = value;
	}
}

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
	public validate(object: any, key: string): ValidationResult {
		if (this._thUtils.isUndefinedOrNull(object) && this.isNullable) {
			return this.returnSuccesfulValidationResult();
		}
		let result: IntermediateValidationResult = this.validateCore(object, key);
		if (result.valid) {
			return this.returnSuccesfulValidationResult();
		}
		return this.returnInsuccesfulValidationResult(result);
	}
	public buildIntermediateValidationResult(key: string, value: any, valid: boolean): IntermediateValidationResult {
		return new IntermediateValidationResult(key, value, valid, this._invalidConstraint);
	}
	private returnSuccesfulValidationResult(): ValidationResult {
		return new ValidationResult();
	}
	private returnInsuccesfulValidationResult(result: IntermediateValidationResult): ValidationResult {
		return new ValidationResult(result);
	}
	
	protected abstract validateCore(field: any, key: string): IntermediateValidationResult;
}