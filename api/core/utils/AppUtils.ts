import _ = require('underscore');
import uuid = require('node-uuid');

export class AppUtils {
	constructor() {
	}
	public isUndefined(object: Object, parameterStack?: string): boolean {
		if (_.isUndefined(object)) {
			return true;
		}
		if (!_.isUndefined(parameterStack)) {
			var currentObject = object;
			var parameterStackArray: string[] = parameterStack.split(".");
			for (var i = 0; i < parameterStackArray.length; i++) {
				var param = parameterStackArray[i];
				currentObject = currentObject[param];
				if (_.isUndefined(currentObject)) {
					return true;
				}
			}
		}
		return false;
	}
	public generateUniqueID(): string {
		return uuid.v1();
	}
}