import {MongoPatcheType, AMongoPatch} from '../utils/AMongoPatch';

export class MongoPatch0 extends AMongoPatch {
	private _hotelsEntity: Sails.Model;

	constructor() {
		super();
		this._hotelsEntity = sails.models.hotelsentity;
	}
	public getPatchType(): MongoPatcheType {
		return MongoPatcheType.CreateUniqueIndexOnHotel;
	}
	public apply(): Promise<any> {
		return new Promise<Object>((resolve, reject) => {
			this.applyCore(resolve, reject);
		});
	}

	private applyCore(resolve, reject) {
		this._hotelsEntity.native((err, nativeHotelsEntity: any) => {
			if (err || !nativeHotelsEntity) {
				reject(new Error("Error getting native hotels collection"));
				return;
			}
			nativeHotelsEntity.ensureIndex("users.email", { unique: true }, ((err, indexName) => {
				if (err || !indexName) {
					reject(new Error("Error ensuring unique email for users index"));
					return;
				}
				resolve(true);
			}));
		});
	}
}