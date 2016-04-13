export class ThDataValidators {
	public static isValidPrice(value: any): boolean {
		if (!_.isNumber(value)) {
			return false;
		}
		return value >= 0;
	}
}