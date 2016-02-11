import {ThUtils} from '../../../utils/ThUtils';

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
}