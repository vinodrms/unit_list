import * as _ from "underscore";

export class ThDataValidators {
	public static isValidPrice(value: any): boolean {
		if (!_.isNumber(value)) {
			return false;
		}
		return value >= 0;
	}
	public static isValidInteger(n: number): boolean {
		return Number(n) === n && n % 1 === 0;
	}
	public static isValidEmail(email: string): boolean {
		var emailRegex = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
		return _.isString(email) && emailRegex.test(email);
	}
	public static isValidPercentage(value: any, minValue: number = 0, maxValue: number = 100): boolean {
		return _.isNumber(value) && value >= minValue && value <= maxValue;
	}
}