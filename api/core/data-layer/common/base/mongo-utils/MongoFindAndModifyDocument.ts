import {ThUtils} from '../../../../utils/ThUtils';
import {MongoUtils} from './MongoUtils';

import mongodb = require('mongodb');
import Collection = mongodb.Collection;

export class MongoFindAndModifyDocument {
	private _mongoUtils: MongoUtils;
	private _thUtils: ThUtils;

	notFoundCallback: { (): void };
	errorCallback: { (err: Error): void };
	successCallback: { (updatedDocument: Object): void };

	constructor(private _sailsEntity: any) {
		this._thUtils = new ThUtils;
		this._mongoUtils = new MongoUtils();
	}

	public findAndModifyDocument(searchCriteria: Object, updates: Object) {
		this._mongoUtils.getNativeMongoCollection(this._sailsEntity).then((nativeCollection: any) => {
			this.findAndModifyDocumentCore(nativeCollection, searchCriteria, updates);
		}).catch((error: any) => {
			this.errorCallback(error);
		});
	}
	private findAndModifyDocumentCore(nativeCollection: any, searchCriteria: any, updates: Object) {
		if (this._thUtils.isUndefinedOrNull(nativeCollection) || this._thUtils.isUndefinedOrNull(searchCriteria) || this._thUtils.isUndefinedOrNull(updates)) {
			this.errorCallback(new Error("Null or empty parameters sent to findAndModify"));
			return;
		}

		var preprocessedSearchCriteria = this._mongoUtils.preprocessSearchCriteria(searchCriteria);
		var preprocessedUpdate = this._mongoUtils.preprocessUpdateQuery(updates);

		nativeCollection.findAndModify(preprocessedSearchCriteria, [], preprocessedUpdate, { new: true }, (err: any, record: Object) => {
			if (err) {
				this.errorCallback(err);
				return;
			}
			if (!record || !record['value']) {
				this.notFoundCallback();
				return;
			}
			var processedResult = this._mongoUtils.processQueryResultItem(record['value']);
			this.successCallback(processedResult);
		});
	}
}