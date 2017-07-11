import {MongoUtils} from './MongoUtils';

import _ = require('underscore');
import mongodb = require('mongodb');
import Collection = mongodb.Collection;

export class MongoFindDocumentDistinctFieldValues {
	private _mongoUtils: MongoUtils;

	errorCallback: { (err: Error): void };
	successCallback: { (distinctValues: Array<Object>): void };

	constructor(private _sailsEntity: any) {
		this._mongoUtils = new MongoUtils();
	}
	public findDistinctDocumentFieldValues(fieldName: string, searchCriteria: Object) {
		this._mongoUtils.getNativeMongoCollection(this._sailsEntity).then((nativeCollection: any) => {
			this.findDistinctDocumentFieldValuesCore(nativeCollection, fieldName, searchCriteria);
		}).catch((error: any) => {
			this.errorCallback(error);
		});
	}
	private findDistinctDocumentFieldValuesCore(nativeCollection: Collection, fieldName: string, searchCriteria: Object) {
		var preprocessedFieldName = this.preprocessFieldName(fieldName);
		var preprocessedSearchCriteria = this._mongoUtils.preprocessSearchCriteria(searchCriteria);
		nativeCollection.distinct(fieldName, searchCriteria, (err: Error, distinctValues: Object[]) => {
			if (err) {
				this.errorCallback(err);
				return;
			}
			if (!distinctValues || !_.isArray(distinctValues)) {
				this.errorCallback(new Error("Invalid response for native mongo distinct query"));
				return;
			}
			this.successCallback(distinctValues);
		});
	}
	private preprocessFieldName(fieldName: string) {
		if (fieldName === 'id') {
			fieldName = '_id';
		}
		return fieldName;
	}
}