import {ThLogger, ThLogLevel} from '../../../utils/logging/ThLogger';
import {ThError} from '../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../utils/th-responses/ThResponse';
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
	private getNativeSystemPatchesEntityCore(resolve: { (result: any): void }, reject: { (err: ThError): void }) {
		this._systemPatchesEntity.native((err, nativeSystemPatchesEntity) => {
			if (err || !nativeSystemPatchesEntity) {
				var thError = new ThError(ThStatusCode.ErrorBootstrappingApp, err);
				ThLogger.getInstance().logError(ThLogLevel.Error, "SailsMongoDBPatch - Error getting native system patches collection", { step: "Bootstrap" }, thError);
				reject(thError);
				return;
			}
			resolve(nativeSystemPatchesEntity);
		});
	}
}