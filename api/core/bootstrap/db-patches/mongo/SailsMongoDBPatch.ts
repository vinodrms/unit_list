import {AMongoDBPatch} from './AMongoDBPatch';

export class SailsMongoDBPatch extends AMongoDBPatch {
	private _systemPatchesEntity: Sails.Model;
	constructor() {
		super();
		this._systemPatchesEntity = sails.models.systempatchesentity;
	}
	protected getNativeSystemPatchesEntity(): Promise<any> {
		return new Promise<Object>((resolve, reject) => {
			this.getNativeSystemPatchesEntityCore(resolve, reject);
		});
	}
	private getNativeSystemPatchesEntityCore(resolve, reject) {
		this._systemPatchesEntity.native((err, nativeSystemPatchesEntity) => {
			if (err || !nativeSystemPatchesEntity) {
				reject(err);
				return;
			}
			resolve(nativeSystemPatchesEntity);
		});
	}
}