import { ThUtils } from '../../../../utils/ThUtils';
import { MongoUtils } from './MongoUtils';
import { ThError } from '../../../../utils/th-responses/ThError';
import { ThLogger, ThLogLevel } from '../../../../utils/logging/ThLogger';
import { ThStatusCode } from '../../../../utils/th-responses/ThResponse';

import mongodb = require('mongodb');
import Collection = mongodb.Collection;

interface MongoMultiUpdateResult {
	ok: number;
	nModified: number;
	n: number;
}

export class MongoUpdateMultipleDocuments {
	public static MultiUpdateSuccessCode = 1;

	private _mongoUtils: MongoUtils;
	private _thUtils: ThUtils;

	errorCallback: { (err: any): void };
	successCallback: { (numUpdated: number): void };

	constructor(private _sailsEntity: any) {
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

		nativeCollection.update(preprocessedSearchCriteria, preprocessedUpdate, { multi: true }, (err: any, nativeResult: any, status: any) => {
			if (err) {
				this.errorCallback(err);
				return;
			}
			let result: MongoMultiUpdateResult = nativeResult.result;
			if (result.ok !== MongoUpdateMultipleDocuments.MultiUpdateSuccessCode) {
				var thError = new ThError(ThStatusCode.MongoUpdateMultipleDocumentsInvalidStatus, err);
				ThLogger.getInstance().logError(ThLogLevel.Error, "Error updating multiple documents", { searchCriteria: preprocessedSearchCriteria, result: result }, thError);
				this.errorCallback(thError);
				return;
			}
			if (result.nModified !== result.n) {
				var thError = new ThError(ThStatusCode.MongoUpdateMultipleDocumentsErrorUpdatingAll, err);
				ThLogger.getInstance().logError(ThLogLevel.Error, "Error updating all matched documents", { searchCriteria: preprocessedSearchCriteria, result: result }, thError);
				this.errorCallback(thError);
				return;
			}
			this.successCallback(result.nModified);
		});
	}
}