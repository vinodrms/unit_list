import {AppUtils} from '../../../utils/AppUtils';

export enum MongoErrorCodes {
	GenericError,
	DuplicateKeyError
}
var NativeMongoErrorCodes: { [index: number]: number; } = {};
NativeMongoErrorCodes[MongoErrorCodes.DuplicateKeyError] = 11000;

export class BaseMongoRepository {
	protected _appUtils: AppUtils;
	constructor() {
		this._appUtils = new AppUtils();
	}

	protected getMongoErrorCode(err: any): MongoErrorCodes {
		if (!this._appUtils.isUndefined(err, "originalError.code")) {
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
}