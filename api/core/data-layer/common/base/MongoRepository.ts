import {ThUtils} from '../../../utils/ThUtils';
import {ThLogger, ThLogLevel} from '../../../utils/logging/ThLogger';
import {ThError} from '../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../utils/th-responses/ThResponse';

import mongodb = require('mongodb');
import ObjectID = mongodb.ObjectID;

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
                    reject(err);
                    return;
                }
                resolve(nativeEntity);
            });
        });
    }
	protected findAndModify(query: Object, updates: Object): Promise<Object> {
		return new Promise<any>((resolve: { (data: any): void; }, reject: { (err: Error): void; }) => {
			this.getNativeMongoCollection().then((nativeCollection: any) => {
				this.findAndModifyCore(resolve, reject, nativeCollection, query, updates);
			}).catch((error: any) => {
				reject(error);
			});
        });
	}
	private findAndModifyCore(resolve: { (data: any): void; }, reject: { (err: Error): void; }, nativeCollection: any, query: any, updates: Object) {
		if (this._thUtils.isUndefinedOrNull(nativeCollection) || this._thUtils.isUndefinedOrNull(query) || this._thUtils.isUndefinedOrNull(updates)) {
			reject(new Error("Null or empty parameters sent to findAndModify"));
			return;
		}
		try {
			query = this.preprocessQuery(query);
			updates["updatedAt"] = this.getISODate();
		} catch (e) {
			reject(e);
			return;
		}
		nativeCollection.findAndModify(query, [['_id', 'asc']], { $set: updates }, {}, (err: any, record: Object) => {
			if (err) {
				reject(err);
				return;
			}
			var processedResult = this.processResult(record);
			resolve(processedResult);
		});
	}
	private preprocessQuery(query: any): Object {
		if (!this._thUtils.isUndefinedOrNull(query.id)) {
			query._id = new ObjectID(query.id);
			delete query["id"];
		}
		return query;
	}
	private getISODate(): Date {
		return new Date((new Date()).toISOString());
	}
	private processResult(record: any): Object {
		if (!record || !record.value) {
			return null;
		}
		var object = record.value;
		if (!this._thUtils.isUndefinedOrNull(object._id)) {
			var objId: ObjectID = object._id;
			object.id = objId.toHexString();
			delete object._id;
		}
		return object;
	}
}