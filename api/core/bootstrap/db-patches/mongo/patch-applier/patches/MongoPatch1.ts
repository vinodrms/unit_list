import {IMongoPatchApplier} from '../IMongoPatchApplier';

export class MongoPatch1 implements IMongoPatchApplier {
	private _hotelsEntity: Sails.Model;

	constructor() {
		this._hotelsEntity = sails.models.hotelsentity;
	}
	public getPatchName(): string {
		return "MongoPatch1";
	}
	public apply(): Promise<any> {
		return new Promise<Object>((resolve, reject) => {
			this.applyCore(resolve, reject);
		});
	}

	private applyCore(resolve, reject) {
		this._hotelsEntity.native((err, nativeHotelsEntity: any) => {
			if (err || !nativeHotelsEntity) {
				reject("Error getting native hotels collection");
				return;
			}
			nativeHotelsEntity.ensureIndex("users.email", { unique: true }, ((err, indexName) => {
				if (err || !indexName) {
					reject("Error ensuring unique email for users index");
					return;
				}
				resolve(true);
			}));
		});
	}
}