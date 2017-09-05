import _ = require('underscore');
import uuid = require('node-uuid');
import shortid = require('shortid');

export interface INumber {
	getValue(): number;
}

export class ThUtils {
	private static ShortIdCharacters = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@";

	constructor() {
		shortid.characters(ThUtils.ShortIdCharacters);
	}
	public isUndefinedOrNull(object: Object, parameterStack?: string): boolean {
		if (_.isUndefined(object) || _.isNull(object)) {
			return true;
		}
		if (!_.isUndefined(parameterStack) && !_.isNull(parameterStack)) {
			var currentObject = object;
			var parameterStackArray: string[] = parameterStack.split(".");
			for (var i = 0; i < parameterStackArray.length; i++) {
				var param = parameterStackArray[i];
				currentObject = currentObject[param];
				if (_.isUndefined(currentObject) || _.isNull(currentObject)) {
					return true;
				}
			}
		}
		return false;
	}
	public generateUniqueID(): string {
		return uuid.v1();
	}
	public generateShortId(): string {
		return shortid.generate();
	}
	public firstArrayIncludedInSecond<T>(firstArray: T[], secondArray: T[]): boolean {
		var diffArray: T[] = _.difference(firstArray, secondArray);
		return diffArray.length == 0;
	}
	public roundNumberToTwoDecimals(inputNumber: number): number {
		if (this.isUndefinedOrNull(inputNumber) || !_.isNumber(inputNumber)) {
			return inputNumber;
		}
		return Math.round(inputNumber * 100) / 100;
	}
	public roundNumberToNearestInteger(inputNumber: number): number {
		return Math.round(inputNumber);
	}
	public formatNumberToTwoDecimals(value: number): any {
		if (!value) {
			return value;
		}
		return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
	}
	public getArrayAverage(array: INumber[]): number {
		if (!_.isArray(array) || array.length == 0) {
			return 0.0;
		}
		return this.getArraySum(array) / array.length;
	}
	public getArraySum(array: INumber[]): number {
		var sum = 0.0;
		_.forEach(array, (value: INumber) => { sum += value.getValue(); })
		return sum;
	}

	public getUTCTimestampFromDate(date: Date): number {
		return Math.floor(date.getTime() / 1000);
	}
	public getDateFromUTCTimestamp(timestamp: number): Date {
		let date = new Date(timestamp * 1000); 
		return date;
	}
}