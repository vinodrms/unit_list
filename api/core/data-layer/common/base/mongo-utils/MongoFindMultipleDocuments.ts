import { ThUtils } from '../../../../utils/ThUtils';
import { MongoUtils } from './MongoUtils';
import { MongoSearchCriteria } from '../MongoRepository';
import { IValidationStructure } from '../../../../utils/th-validation/structure/core/IValidationStructure';
import { LazyLoadRepoDO } from '../../repo-data-objects/LazyLoadRepoDO';

import mongodb = require('mongodb');
import Collection = mongodb.Collection;
import Cursor = mongodb.Cursor;

import _ = require('underscore');

export class MongoFindMultipleDocuments {
    private _thUtils: ThUtils;
    private _mongoUtils: MongoUtils;

    errorCallback: { (err: Error): void };
    successCallback: { (foundDocumentList: Array<Object>): void };

    constructor(private _sailsEntity: any) {
        this._thUtils = new ThUtils();
        this._mongoUtils = new MongoUtils();
    }
    public findMultipleDocuments(searchCriteria: MongoSearchCriteria) {
        this._mongoUtils.getNativeMongoCollection(this._sailsEntity).then((nativeMongoCollection: Collection) => {
            this.findMultipleDocumentsCore(nativeMongoCollection, searchCriteria);
        }).catch((error: any) => {
            this.errorCallback(error);
        });
    }
    private findMultipleDocumentsCore(nativeMongoCollection: Collection, searchCriteria: MongoSearchCriteria) {
        var preprocessedSearchCriteria = this._mongoUtils.preprocessSearchCriteria(searchCriteria.criteria);
        var mongoCursor = nativeMongoCollection.find(preprocessedSearchCriteria);
        mongoCursor = this.updateCursorWithSortCriteria(mongoCursor, searchCriteria.sortCriteria);
        mongoCursor = this.updateCursorWithLazyLoadParam(mongoCursor, searchCriteria.lazyLoad);

        mongoCursor.toArray((err: Error, itemList: any[]) => {
            if (err) {
                this.errorCallback(err);
                return;
            }
            if (!_.isArray(itemList)) {
                this.errorCallback(new Error("did not receive an array"));
                return;
            }
            var processedItemList = _.map(itemList, (item: any) => {
                return this._mongoUtils.processQueryResultItem(item);
            });
            this.successCallback(processedItemList);
        });
    }
    private updateCursorWithSortCriteria(mongoCursor: Cursor, inputSortCriteria: Object): Cursor {
        var sortCriteria: Object = {};
        if (!this._thUtils.isUndefinedOrNull(inputSortCriteria) && _.isObject(inputSortCriteria)) {
            sortCriteria = _.clone(inputSortCriteria);
        }
        if (!_.isNumber(sortCriteria[MongoUtils.DefaultDocumentIdAttribute])) {
            sortCriteria[MongoUtils.DefaultDocumentIdAttribute] = -1;
        }
        return mongoCursor.sort(sortCriteria);
    }
    private updateCursorWithLazyLoadParam(mongoCursor: Cursor, lazyLoad: LazyLoadRepoDO): Cursor {
        var lazyLoadValidationStructure = LazyLoadRepoDO.getValidationStructure().validateStructure(lazyLoad);
        if (lazyLoadValidationStructure.isValid()) {
            var skipNo = lazyLoad.pageNumber * lazyLoad.pageSize;
            return mongoCursor.skip(skipNo).limit(lazyLoad.pageSize);
        }
        return mongoCursor;
    }
}
