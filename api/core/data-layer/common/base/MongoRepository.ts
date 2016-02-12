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

export class MongoRepository {
    protected _thUtils: ThUtils;

	constructor(private _sailsEntity: Sails.Model) {
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
    public getNativeMongoCollection(): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this._sailsEntity.native((err, nativeEntity: any) => {
                if (err || !nativeEntity) {
                    var thError = new ThError(ThStatusCode.BaseMongoRepositoryGetNetiveEntityError, err);
                    ThLogger.getInstance().logError(ThLogLevel.Error, "Error getting native entity for sails collection", this._sailsEntity.attributes, thError);
                    reject(thError);
                    return;
                }
                resolve(nativeEntity);
            });
        });
    }
	protected findAndModify(query: Object, setClause: Object, options?: Object): Promise<any> {
		return new Promise<any>((resolve: { (data: any): void; }, reject: { (err: ThError): void; }) => {
			this.findAndModifyCore(resolve, reject);
        });
	}
	private findAndModifyCore(resolve: { (data: any): void; }, reject: { (err: ThError): void; }) {
		// TODO: partial work
	}
}