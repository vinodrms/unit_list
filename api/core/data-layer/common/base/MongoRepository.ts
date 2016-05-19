import {ThUtils} from '../../../utils/ThUtils';
import {ThLogger, ThLogLevel} from '../../../utils/logging/ThLogger';
import {ThError} from '../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../utils/th-responses/ThResponse';
import {IRepositoryCleaner} from './IRepositoryCleaner';
import {LazyLoadMetaResponseRepoDO, LazyLoadRepoDO} from '../repo-data-objects/LazyLoadRepoDO';
import {MongoUtils} from './mongo-utils/MongoUtils';
import {MongoFindSingleDocument} from './mongo-utils/MongoFindSingleDocument';
import {MongoCreateDocument} from './mongo-utils/MongoCreateDocument';
import {MongoFindAndModifyDocument} from './mongo-utils/MongoFindAndModifyDocument';
import {MongoFindDocumentDistinctFieldValues} from './mongo-utils/MongoFindDocumentDistinctFieldValues';
import {MongoFindMultipleDocuments} from './mongo-utils/MongoFindMultipleDocuments';
import {MongoDocumentCount} from './mongo-utils/MongoDocumentCount';
import {MongoUpdateMultipleDocuments} from './mongo-utils/MongoUpdateMultipleDocuments';

import _ = require('underscore');
import mongodb = require('mongodb');
import ObjectID = mongodb.ObjectID;
import Collection = mongodb.Collection;

export enum MongoErrorCodes {
    GenericError,
    DuplicateKeyError
}
var NativeMongoErrorCodes: { [index: number]: number; } = {};
NativeMongoErrorCodes[MongoErrorCodes.DuplicateKeyError] = 11000;

export interface MongoSearchCriteria {
	criteria: Object;
	sortCriteria?: Object;
	lazyLoad?: LazyLoadRepoDO;
}

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
	
    public getNativeMongoCollection(): Promise<Collection> {
		var mongoUtils = new MongoUtils();
        return mongoUtils.getNativeMongoCollection(this._sailsEntity);
    }

	protected createDocument(documentToCreate: Object, errorCallback: { (err: Error): void }, successCallback: { (createdDocument: Object): void }) {
		var mongoCreateDoc = new MongoCreateDocument(this._sailsEntity);
		mongoCreateDoc.errorCallback = errorCallback;
		mongoCreateDoc.successCallback = successCallback;
		return mongoCreateDoc.createDocument(documentToCreate);
	}

	protected findAndModifyDocument(searchCriteria: Object, updates: Object, notFoundCallback: { (): void }, errorCallback: { (err: Error): void }, successCallback: { (updatedDocument: Object): void }) {
		var findAndModifyDoc = new MongoFindAndModifyDocument(this._sailsEntity);
		findAndModifyDoc.notFoundCallback = notFoundCallback;
		findAndModifyDoc.errorCallback = errorCallback;
		findAndModifyDoc.successCallback = successCallback;
		return findAndModifyDoc.findAndModifyDocument(searchCriteria, updates);
	}

	protected findDistinctDocumentFieldValues(fieldName: string, searchCriteria: Object, errorCallback: { (err: Error): void }, successCallback: { (distinctValues: Array<Object>): void }) {
		var finder = new MongoFindDocumentDistinctFieldValues(this._sailsEntity);
		finder.errorCallback = errorCallback;
		finder.successCallback = successCallback;
		return finder.findDistinctDocumentFieldValues(fieldName, searchCriteria);
	}

	protected findOneDocument(searchCriteria: Object, notFoundCallback: { (): void }, errorCallback: { (err: Error): void }, successCallback: { (foundDocument: Object): void }) {
		var mongoFindDoc = new MongoFindSingleDocument(this._sailsEntity);
		mongoFindDoc.notFoundCallback = notFoundCallback;
		mongoFindDoc.errorCallback = errorCallback;
		mongoFindDoc.successCallback = successCallback;
		return mongoFindDoc.findOneDocument(searchCriteria);
	}

	protected findMultipleDocuments(searchCriteria: MongoSearchCriteria, errorCallback: { (err: Error): void }, successCallback: { (foundDocumentList: Array<Object>): void }) {
		var finder = new MongoFindMultipleDocuments(this._sailsEntity);
		finder.errorCallback = errorCallback;
		finder.successCallback = successCallback;
		return finder.findMultipleDocuments(searchCriteria);
	}

	protected updateMultipleDocuments(searchCriteria: Object, updates: Object, errorCallback: { (err: Error): void }, successCallback: { (numUpdated: number): void }) {
		var updater = new MongoUpdateMultipleDocuments(this._sailsEntity);
		updater.errorCallback = errorCallback;
		updater.successCallback = successCallback;
		return updater.updateMultipleDocuments(searchCriteria, updates);
	}

	protected getDocumentCount(searchCriteria: Object, errorCallback: { (err: Error): void }, successCallback: { (meta: LazyLoadMetaResponseRepoDO): void }) {
		var docCount = new MongoDocumentCount(this._sailsEntity);
		docCount.errorCallback = errorCallback;
		docCount.successCallback = successCallback;
		return docCount.getDocumentCount(searchCriteria);
	}
}