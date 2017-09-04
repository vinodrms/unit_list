import { MongoUtils } from "./MongoUtils";

export class MongoDeleteMultipleDocuments {
    errorCallback: { (err: Error): void };
	successCallback: { (deletedCount: number): void };

	constructor(private _sailsEntity: any) {
	}

	public deleteMultipleDocuments(filter: Object) {
		var mongoUtils = new MongoUtils();
		
		mongoUtils.getNativeMongoCollection(this._sailsEntity).then((collection: any) => {
			return collection.deleteMany(filter);
		}).then((result: any) => {
			if(result.deletedCount < 1) {
				this.errorCallback(new Error("Documents could not be removed"));
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