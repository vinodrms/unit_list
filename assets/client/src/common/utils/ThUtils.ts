import * as _ from "underscore";

export class ThUtils {
	constructor() {
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
	public getObjectValueByPropertyStack(object: Object, parameterStack: string): any {
		if (this.isUndefinedOrNull(object, parameterStack)) {
			return null;
		}
		var currentObject = object;
		var parameterStackArray: string[] = parameterStack.split(".");
		for (var i = 0; i < parameterStackArray.length; i++) {
			var param = parameterStackArray[i];
			currentObject = currentObject[param];
		}
		return currentObject;
	}

	public firstArrayIncludedInSecond<T>(firstArray: T[], secondArray: T[]): boolean {
        var diffArray: T[] = _.difference(firstArray, secondArray);
        return diffArray.length == 0;
    }

	public concatStringsWithComma(stringArray: string[]): string {
		if (!_.isArray(stringArray)) {
			return "";
		}
		var stringConcat: string = "";
		_.forEach(stringArray, (str: string) => {
			if (stringConcat.length > 0) {
				stringConcat += ", ";
			}
			stringConcat += str;
		});
		return stringConcat;
	}
	public printPage(pageTitle: string) {
		var previousTitle = document.title;
		document.title = pageTitle;
		window.print();
		document.title = previousTitle;
	}
	public roundNumberToTwoDecimals(inputNumber: number): number {
		if (this.isUndefinedOrNull(inputNumber) || !_.isNumber(inputNumber)) {
			return inputNumber;
		}
		return Math.round(inputNumber * 100) / 100;
	}
}