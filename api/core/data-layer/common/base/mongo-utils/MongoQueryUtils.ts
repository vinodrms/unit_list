import mongodb = require('mongodb');
import ObjectID = mongodb.ObjectID;

import _ = require("underscore");

export class MongoQueryUtils {
	private convertToNativeObjectId(idStr: string): ObjectID {
		return new ObjectID(idStr);
	}
	public preprocessQueryValueList(fieldName: string, valueList: any[]): { fieldName: string, valueList: any[] } {
		var convertedFieldName = fieldName, convertedValueList = [];
		valueList.forEach((value: any) => {
			try {
				var preprocessedValue = this.preprocessQueryValue(fieldName, value);
				convertedFieldName = preprocessedValue.fieldName;
				convertedValueList.push(preprocessedValue.value);
			} catch (error) { }
		});
		return {
			fieldName: convertedFieldName,
			valueList: convertedValueList
		}
	}
	public preprocessQueryValue(fieldName: string, value: any): { fieldName: string, value: any } {
		if (fieldName === "id" && _.isString(value)) {
			return {
				fieldName: "_id",
				value: this.convertToNativeObjectId(value)
			}
		}
		return {
			fieldName: fieldName,
			value: value
		}
	}
}