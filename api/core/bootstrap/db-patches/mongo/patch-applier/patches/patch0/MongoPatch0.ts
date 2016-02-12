import {MongoPatcheType, ATransactionalMongoPatch} from '../../utils/ATransactionalMongoPatch';
import {ThLogger, ThLogLevel} from '../../../../../../utils/logging/ThLogger';
import {ThError} from '../../../../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../../../../utils/th-responses/ThResponse';
import {BaseMongoRepository} from '../../../../../../data-layer/common/base/BaseMongoRepository';

export class MongoPatch0 extends ATransactionalMongoPatch {
    private _hotelsEntity: Sails.Model;

    constructor() {
        super();
        this._hotelsEntity = sails.models.hotelsentity;
    }
    public getPatchType(): MongoPatcheType {
        return MongoPatcheType.CreateUniqueIndexOnHotel;
    }
    public apply(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.applyCore(resolve, reject);
        });
    }

    private applyCore(resolve: { (result: boolean): void }, reject: { (err: ThError): void }) {
        BaseMongoRepository.getNativeMongoCollectionForSailsEntity(this._hotelsEntity).then((nativeHotelsCollection: any) => {
            nativeHotelsCollection.ensureIndex("users.email", { unique: true }, ((err, indexName) => {
                if (err || !indexName) {
                    var thError = new ThError(ThStatusCode.ErrorBootstrappingApp, err);
                    ThLogger.getInstance().logError(ThLogLevel.Error, "Patch0 - Error ensuring unique email for users index", { step: "Bootstrap" }, thError);
                    reject(thError);
                    return;
                }
                resolve(true);
            }));
        }).catch((error: any) => {
            var thError = new ThError(ThStatusCode.ErrorBootstrappingApp, error);
            ThLogger.getInstance().logError(ThLogLevel.Error, "Patch0 - Error getting native hotels collection", { step: "Bootstrap" }, thError);
            reject(thError);
        });
    }
}