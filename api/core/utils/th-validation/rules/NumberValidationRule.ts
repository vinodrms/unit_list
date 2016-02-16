import {AValidationRule} from './core/AValidationRule';
import {InvalidConstraintType} from './core/ValidationResult';

export class NumberValidationRule extends AValidationRule {
	private _minValue: number = Number.NEGATIVE_INFINITY;
	private _maxValue: number = Number.POSITIVE_INFINITY;

	constructor() {
		super(InvalidConstraintType.Number);
	}
	public set minValue(minValue: number) {
		this._minValue = minValue;
	}
	public get minValue(): number {
		return this._minValue;
	}
	public set maxValue(maxValue: number) {
		this._maxValue = maxValue;
	}
	public get maxValue(): number {
		return this._maxValue;
	}

	protected validateCore(object: any): boolean {
		if (!_.isNumber(object)) {
			return false;
		}
		var num: number = object;
		if (num >= this._minValue && num <= this._maxValue) {
			return true;
		}
		return false;
	}
	public static buildNullable(): NumberValidationRule {
		var rule = new NumberValidationRule();
		rule.isNullable = true;
		return rule;
	}
	public static buildPercentageNumberRule(): NumberValidationRule {
		var rule = new NumberValidationRule();
		rule.minValue = 0.0;
		rule.maxValue = 1.0;
		return rule;
	}
	public static buildPriceNumberRule(): NumberValidationRule {
		var rule = new NumberValidationRule();
		rule.minValue = 0.0;
		return rule;
	}
}