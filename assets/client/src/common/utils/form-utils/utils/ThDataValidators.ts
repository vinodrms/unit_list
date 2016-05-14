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
}