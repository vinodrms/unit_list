import {ThUtils} from '../../../../utils/ThUtils';
import {MongoUtils} from './MongoUtils';

import mongodb = require('mongodb');
import Collection = mongodb.Collection;

export class MongoUpdateMultipleDocuments {
	private _mongoUtils: MongoUtils;
	private _thUtils: ThUtils;

	errorCallback: { (err: Error): void };
	successCallback: { (numUpdated: number): void };

	constructor(private _sailsEntity: Sails.Model) {
		this._thUtils = new ThUtils();
		this._mongoUtils = new MongoUtils();
	}

	public updateMultipleDocuments(searchCriteria: Object, updates: Object) {
		this._mongoUtils.getNativeMongoCollection(this._sailsEntity).then((nativeCollection: any) => {
			this.updateMultipleDocumentsCore(nativeCollection, searchCriteria, updates);
		}).catch((error: any) => {
			this.errorCallback(error);
		});
	}
	private updateMultipleDocumentsCore(nativeCollection: any, searchCriteria: any, updates: Object) {
		if (this._thUtils.isUndefinedOrNull(nativeCollection) || this._thUtils.isUndefinedOrNull(searchCriteria) || this._thUtils.isUndefinedOrNull(updates)) {
			this.errorCallback(new Error("Null or empty parameters sent to updateMultipleDocuments"));
			return;
		}

		var preprocessedSearchCriteria = this._mongoUtils.preprocessSearchCriteria(searchCriteria);
		var preprocessedUpdate = this._mongoUtils.preprocessUpdateQuery(updates);

		nativeCollection.update(preprocessedSearchCriteria, preprocessedUpdate, { multi: true }, (err: any, numUpdated: number, status: any) => {
			if (err) {
				this.errorCallback(err);
				return;
			}
			this.successCallback(numUpdated);
		});
	}
}