import { AValidationRule } from './core/AValidationRule';
import { InvalidConstraintType } from './core/ValidationResult';

import _ = require("underscore");

export class NumberValidationRule extends AValidationRule {
	private _minValue: number = Number.NEGATIVE_INFINITY;
	private _maxValue: number = Number.POSITIVE_INFINITY;
	private _isInteger: boolean = false;

	constructor() {
		super(InvalidConstraintType.Number);
	}
	public set minValue(minValue: number) {
		if (_.isNumber(minValue)) {
			this._minValue = minValue;
		}
	}
	public get minValue(): number {
		return this._minValue;
	}
	public set maxValue(maxValue: number) {
		if (_.isNumber(maxValue)) {
			this._maxValue = maxValue;
		}
	}
	public get maxValue(): number {
		return this._maxValue;
	}
	public set isInteger(isInteger: boolean) {
		this._isInteger = isInteger;
	}
	public get isInteger(): boolean {
		return this._isInteger;
	}

	protected validateCore(object: any): boolean {
		if (!_.isNumber(object)) {
			return false;
		}
		var num: number = object;
		if (num >= this._minValue && num <= this._maxValue) {
			if (this._isInteger) {
				if (this.isValidInteger(num)) {
					return true;
				}
				return false;
			}
			return true;
		}
		return false;
	}
	private isValidInteger(n: number): boolean {
		return Number(n) === n && n % 1 === 0;
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
	public static buildNullablePercentageNumberRule(): NumberValidationRule {
		var rule = NumberValidationRule.buildPercentageNumberRule();
		rule.isNullable = true;
		return rule;
	}
	public static buildPriceNumberRule(): NumberValidationRule {
		var rule = new NumberValidationRule();
		rule.minValue = 0.0;
		return rule;
	}
	public static buildNullablePriceNumberRule(): NumberValidationRule {
		var rule = NumberValidationRule.buildPriceNumberRule();
		rule.isNullable = true;
		return rule;
	}
	public static buildIntegerNumberRule(minValue?: number): NumberValidationRule {
		var rule = new NumberValidationRule();
		rule.isInteger = true;
		rule.minValue = minValue;
		return rule;
	}
	public static buildNullableIntegerNumberRule(minValue?: number): NumberValidationRule {
		var rule = NumberValidationRule.buildIntegerNumberRule(minValue);
		rule.isNullable = true;
		return rule;
	}
}