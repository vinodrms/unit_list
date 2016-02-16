import {AValidationRule} from './core/AValidationRule';
import {InvalidConstraintType} from './core/ValidationResult';

import _ = require("underscore");

export class StringValidationRule extends AValidationRule {
	public static MaxCityLength = 100;
	public static MaxCountryCodeLength = 2;
	public static MaxCountryLength = 100;
	public static MaxStreetAddressLength = 95;
	public static MaxUrlLength = 2083;
	public static MaxPhoneLength = 50;
	public static MaxNameLength = 50;
	public static MaxHotelNameLength = 300;
	public static MaxVatCodeNameLength = 30;

	private _minLength: number = 0;
	private _maxLength: number = Number.POSITIVE_INFINITY;

	constructor(maxLength?: number) {
		super(InvalidConstraintType.String);
		if (!this._thUtils.isUndefinedOrNull(maxLength)) {
			this.maxLength = maxLength;
		}
	}

	public set minLength(minLength: number) {
		if (minLength >= 0) {
			this._minLength = minLength;
		}
	}
	public get minLength(): number {
		return this._minLength;
	}
	public set maxLength(maxLength: number) {
		if (maxLength > 0) {
			this._maxLength = maxLength;
		}
	}
	public get maxLength(): number {
		return this._maxLength;
	}

	protected validateCore(object: any): boolean {
		if (!_.isString(object)) {
			return false;
		}
		var str: string = object;
		if (str.length >= this._minLength && str.length <= this._maxLength) {
			return true;
		}
		return false;
	}
	public static buildNullable(maxLenght: number): StringValidationRule {
		var rule = new StringValidationRule(maxLenght);
		rule.isNullable = true;
		return rule;
	}
}