import {ThUtils} from '../../../utils/ThUtils';
import {ThLogger, ThLogLevel} from '../../../utils/logging/ThLogger';
import {ThError} from '../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../utils/th-responses/ThResponse';

export enum MongoErrorCodes {
    GenericError,
    DuplicateKeyError
}
var NativeMongoErrorCodes: { [index: number]: number; } = {};
NativeMongoErrorCodes[MongoErrorCodes.DuplicateKeyError] = 11000;

export class BaseMongoRepository {
    protected _thUtils: ThUtils;
    constructor() {
        this._thUtils = new ThUtils();
    }

    protected getMongoErrorCode(err: any): MongoErrorCodes {
        if (!this._thUtils.isUndefinedOrNull(err, "originalError.code")) {
            var nativeMongoErrorCode = err.originalError.code;
            return this.getMongoErrorCodeOfType(nativeMongoErrorCode);
        }
        return MongoErrorCodes.GenericError;
    }
    private getMongoErrorCodeOfType(nativeMongoErrorCode: number): MongoErrorCodes {
        var outErrorCode = MongoErrorCodes.GenericError;
        for (var mongoErrorCode in NativeMongoErrorCodes) {
            if (NativeMongoErrorCodes[mongoErrorCode] === nativeMongoErrorCode) {
                outErrorCode = parseInt(mongoErrorCode);
            }
        }
        return outErrorCode;
    }
    public static getNativeMongoCollectionForSailsEntity(entity: Sails.Model): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            entity.native((err, nativeEntity: any) => {
                if (err || !nativeEntity) {
                    var thError = new ThError(ThStatusCode.BaseMongoRepositoryGetNetiveEntityError, err);
                    ThLogger.getInstance().logError(ThLogLevel.Error, "Error getting native entity for sails collection", entity.attributes, thError);
                    reject(thError);
                    return;
                }
                resolve(nativeEntity);
            });
        });
    }
}