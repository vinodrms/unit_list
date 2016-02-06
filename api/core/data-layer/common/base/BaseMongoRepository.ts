import _ = require("underscore");

export enum MongoErrorCodes {
	GenericError,
	DuplicateKeyError
}
var NativeMongoErrorCodes: { [index: number]: number; } = {};
NativeMongoErrorCodes[MongoErrorCodes.DuplicateKeyError] = 11000;

export class BaseMongoRepository {
	protected getMongoErrorCode(err: any): MongoErrorCodes {
		if (!_.isUndefined(err) && !_.isUndefined(err.originalError) && !_.isUndefined(err.originalError.code)) {
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