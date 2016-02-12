import {ThLogger, ThLogLevel} from '../../../utils/logging/ThLogger';
import {ThError} from '../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../utils/th-responses/ThResponse';
import {AMongoDBPatch} from './AMongoDBPatch';
import {MongoRepository} from '../../../data-layer/common/base/MongoRepository';

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
		var mongoRepo = new MongoRepository(this._systemPatchesEntity);
        mongoRepo.getNativeMongoCollection().then((nativeSystemPatchesEntity: any) => {
            resolve(nativeSystemPatchesEntity);
        }).catch((error: any) => {
            var thError = new ThError(ThStatusCode.ErrorBootstrappingApp, error);
            ThLogger.getInstance().logError(ThLogLevel.Error, "SailsMongoDBPatch - Error getting native system patches collection", { step: "Bootstrap" }, thError);
            reject(thError);
        });
    }
}