export class MongoCreateDocument {
	errorCallback: { (err: Error): void };
	successCallback: { (createdDocument: Object): void };

	constructor(private _sailsEntity: Sails.Model) {
	}

	public createDocument(documentToCreate: Object) {
		this._sailsEntity.create(documentToCreate).then((createdDocument: Sails.QueryResult) => {
			if (!createdDocument) {
				this.errorCallback(new Error("Empty document created"));
				return;
			}
			this.successCallback(createdDocument);
		}).catch((err: Error) => {
			this.errorCallback(err);
		});
	}
}