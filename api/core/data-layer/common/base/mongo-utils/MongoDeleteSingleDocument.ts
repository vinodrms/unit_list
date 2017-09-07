import { MongoUtils } from "./MongoUtils";

import mongodb = require('mongodb');
import Collection = mongodb.Collection;

export class MongoDeleteSingleDocument {
	errorCallback: { (err: Error): void };
	successCallback: { (deletedCount: number): void };

	constructor(private _sailsEntity: any) {
	}

	public deleteDocument(documentToRemove: Object) {
		var mongoUtils = new MongoUtils();
		mongoUtils.getNativeMongoCollection(this._sailsEntity).then((collection: any) => {
			return collection.deleteOne(documentToRemove);
		}).then((result: any) => {
			if(result.deletedCount !== 1) {
				this.errorCallback(new Error("Document could not be removed"));
				return;
			}
			else {
				this.successCallback(result.deletedCount);
			}
		}).catch((error: any) => {
			this.errorCallback(error);
		});
	}
}