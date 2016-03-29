export class MongoFindSingleDocument {
	notFoundCallback: { (): void };
	errorCallback: { (err: Error): void };
	successCallback: { (foundDocument: Object): void };

	constructor(private _sailsEntity: Sails.Model) {
	}
	public findOneDocument(searchCriteria: Object) {
		this._sailsEntity.findOne(searchCriteria).then((foundDocument: Sails.QueryResult) => {
			if (!foundDocument) {
				this.notFoundCallback();
				return;
			}
			this.successCallback(foundDocument);
		}).catch((err: Error) => {
			this.errorCallback(err);
		});
	}
}