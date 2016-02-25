import {ThUtils} from '../../../utils/ThUtils';
import {ThLogger, ThLogLevel} from '../../../utils/logging/ThLogger';
import {ThError} from '../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../utils/th-responses/ThResponse';
import {IRepositoryCleaner} from './IRepositoryCleaner';

import _ = require('underscore');
import mongodb = require('mongodb');
import ObjectID = mongodb.ObjectID;
import NativeMongoCollection = mongodb.Collection;

export enum MongoErrorCodes {
    GenericError,
    DuplicateKeyError
}
var NativeMongoErrorCodes: { [index: number]: number; } = {};
NativeMongoErrorCodes[MongoErrorCodes.DuplicateKeyError] = 11000;

export class MongoRepository implements IRepositoryCleaner {
    protected _thUtils: ThUtils;

	constructor(private _sailsEntity: Sails.Model) {
        this._thUtils = new ThUtils();
    }

	public cleanRepository(): Promise<Object> {
		return this._sailsEntity.destroy({});
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
	protected findAndModifyDocument(searchCriteria: Object, updates: Object, notFoundCallback: { (): void }, errorCallback: { (err: Error): void }, successCallback: { (updatedDocument: Object): void }) {
		this.getNativeMongoCollection().then((nativeCollection: any) => {
			this.findAndModifyDocumentCore(nativeCollection, searchCriteria, updates, notFoundCallback, errorCallback, successCallback);
		}).catch((error: any) => {
			errorCallback(error);
		});
	}
	private findAndModifyDocumentCore(nativeCollection: any, searchCriteria: any, updates: Object, notFoundCallback: { (): void }, errorCallback: { (err: Error): void }, successCallback: { (updatedDocument: Object): void }) {
		if (this._thUtils.isUndefinedOrNull(nativeCollection) || this._thUtils.isUndefinedOrNull(searchCriteria) || this._thUtils.isUndefinedOrNull(updates)) {
			errorCallback(new Error("Null or empty parameters sent to findAndModify"));
			return;
		}
		try {
			var preprocessedSearchCriteria = this.preprocessSearchCriteria(searchCriteria);
			var preprocessedUpdate = this.preprocessUpdateQuery(updates);
		} catch (e) {
			errorCallback(e);
			return;
		}
		nativeCollection.findAndModify(preprocessedSearchCriteria, [], preprocessedUpdate, { new: true }, (err: any, record: Object) => {
			if (err) {
				errorCallback(err);
				return;
			}
			if (!record || !record['value']) {
				notFoundCallback();
				return;
			}
			var processedResult = this.processResult(record);
			successCallback(processedResult);
		});
	}
	private preprocessSearchCriteria(searchCriteria: any): Object {
		if (!this._thUtils.isUndefinedOrNull(searchCriteria.id)) {
			searchCriteria._id = new ObjectID(searchCriteria.id);
			delete searchCriteria["id"];
		}
		else if (!this._thUtils.isUndefinedOrNull(searchCriteria['$and']) && _.isArray(searchCriteria['$and'])) {
			_.map(searchCriteria['$and'], (queryEntry: any) => {
				if (!this._thUtils.isUndefinedOrNull(queryEntry.id)) {
					queryEntry._id = new ObjectID(queryEntry.id);
					delete queryEntry.id;
				}
				return queryEntry;
			});
		}
		return searchCriteria;
	}
	private getISODate(): Date {
		return new Date((new Date()).toISOString());
	}
	private preprocessUpdateQuery(updates: Object): Object {
		updates["updatedAt"] = this.getISODate();

		var processedUpdates: any = {};
		// these are placed individually on the update query
		var reservedWordList = ["$inc", "$push", "$pop", "$addToSet", "$pull", "$pullAll"];
		reservedWordList.forEach((reservedWord: string) => {
			var reservedWordValue = updates[reservedWord];
			if (!this._thUtils.isUndefinedOrNull(reservedWordValue)) {
				delete updates[reservedWord];
				processedUpdates[reservedWord] = reservedWordValue;
			}
		});
		// the rest of the updates are automatically given to the set attributte
		processedUpdates["$set"] = updates;
		return processedUpdates;
	}
	private processResult(record: any): Object {
		var object = record.value;
		if (!this._thUtils.isUndefinedOrNull(object._id)) {
			var objId: ObjectID = object._id;
			object.id = objId.toHexString();
			delete object._id;
		}
		return object;
	}

	protected findDistinctDocumentFieldValues(fieldName: string, searchCriteria: Object, errorCallback: { (err: Error): void }, successCallback: { (distinctValues: Array<Object>): void }) {
		this.getNativeMongoCollection().then((nativeCollection: any) => {
			this.findDistinctDocumentFieldValuesCore(nativeCollection, fieldName, searchCriteria, errorCallback, successCallback);
		}).catch((error: any) => {
			errorCallback(error);
		});
	}
	private findDistinctDocumentFieldValuesCore(nativeCollection: NativeMongoCollection, fieldName: string, searchCriteria: Object, errorCallback: { (err: Error): void }, successCallback: { (distinctValues: Object[]): void }) {
		if (fieldName === 'id') {
			fieldName = '_id';
		}
		var preprocessedSearchCriteria = this.preprocessSearchCriteria(searchCriteria);
		nativeCollection.distinct(fieldName, searchCriteria, (err: Error, distinctValues: Object[]) => {
			if (err) {
				errorCallback(err);
				return;
			}
			if (!distinctValues || !_.isArray(distinctValues)) {
				errorCallback(new Error("Invalid response for native mongo distinct query"));
				return;
			}
			successCallback(distinctValues);
		});
	}

	protected findOneDocument(searchCriteria: Object, notFoundCallback: { (): void }, errorCallback: { (err: Error): void }, successCallback: { (foundDocument: Object): void }) {
		this._sailsEntity.findOne(searchCriteria).then((foundDocument: Sails.QueryResult) => {
			if (!foundDocument) {
				notFoundCallback();
				return;
			}
			successCallback(foundDocument);
		}).catch((err: Error) => {
			errorCallback(err);
		});
	}
	protected findMultipleDocuments(searchCriteria: Object, emptyResultCallback: { (): void }, errorCallback: { (err: Error): void }, successCallback: { (foundDocumentList: Array<Object>): void }) {
		this._sailsEntity.find(searchCriteria).then((foundDocumentList: Array<Sails.QueryResult>) => {
			if ((!foundDocumentList || !_.isArray(foundDocumentList))) {
				emptyResultCallback();
				return;
			}
			successCallback(foundDocumentList);
		}).catch((err: Error) => {
			errorCallback(err);
		});
	}
	protected createDocument(documentToCreate: Object, errorCallback: { (err: Error): void }, successCallback: { (createdDocument: Object): void }) {
		this._sailsEntity.create(documentToCreate).then((createdDocument: Sails.QueryResult) => {
			if (!createdDocument) {
				errorCallback(new Error("Empty document created"));
				return;
			}
			successCallback(createdDocument);
		}).catch((err: Error) => {
			errorCallback(err);
		});
	}

	protected destroyAllDocuments
}