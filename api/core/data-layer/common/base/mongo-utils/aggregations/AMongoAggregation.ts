import {ThUtils} from '../../../../../utils/ThUtils';
import {MongoUtils} from '../MongoUtils';
import {MongoSearchCriteria, MongoAggregationOptions} from '../../MongoRepository';

import _ = require('underscore');
import mongodb = require('mongodb');
import Collection = mongodb.Collection;

export abstract class AMongoAggregation<T> {
    protected _thUtils: ThUtils;
    protected _mongoUtils: MongoUtils;

    errorCallback: { (err: Error): void };
    successCallback: { (foundDocument: T): void };

    constructor(private _sailsEntity: Sails.Model) {
        this._thUtils = new ThUtils();
        this._mongoUtils = new MongoUtils();
    }
    public aggregateDocuments(searchCriteria: MongoSearchCriteria, aggregateOptions: MongoAggregationOptions) {
        this._mongoUtils.getNativeMongoCollection(this._sailsEntity).then((nativeMongoCollection: Collection) => {
            this.aggregateDocumentsCore(nativeMongoCollection, searchCriteria, aggregateOptions);
        }).catch((error: any) => {
            this.errorCallback(error);
        });
    }
    private aggregateDocumentsCore(nativeMongoCollection: Collection, searchCriteria: MongoSearchCriteria, aggregateOptions: MongoAggregationOptions) {
        var preprocessedSearchCriteria = this._mongoUtils.preprocessSearchCriteria(searchCriteria.criteria);

        var pipeline: Object[] = [{ $match: preprocessedSearchCriteria }];
        pipeline = this.applyUnwindParams(pipeline, aggregateOptions, preprocessedSearchCriteria);
        pipeline = this.applySortCriteria(pipeline, searchCriteria);
        pipeline = this.customApplyPipelineParams(pipeline, searchCriteria, aggregateOptions);

        nativeMongoCollection.aggregate(pipeline, {}, (err: Error, aggregationResult: any) => {
            if (err) {
                this.errorCallback(err);
                return;
            }
            this.processAggregationResultAndRunCallback(aggregationResult);
        });
    }

    private applyUnwindParams(pipeline: Object[], aggregateOptions: MongoAggregationOptions, preprocessedSearchCriteria: Object): Object[] {
        if (aggregateOptions.unwind) {
            pipeline.push({ $unwind: aggregateOptions.unwindParam });
            pipeline.push({ $match: preprocessedSearchCriteria });
        }
        return pipeline;
    }
    private applySortCriteria(pipeline: Object[], searchCriteria: MongoSearchCriteria) {
        if (!this._thUtils.isUndefinedOrNull(searchCriteria.sortCriteria) && _.isObject(searchCriteria.sortCriteria)) {
            pipeline.push({ $sort: searchCriteria.sortCriteria });
        }
        return pipeline;
    }

    protected abstract customApplyPipelineParams(pipeline: Object[], searchCriteria: MongoSearchCriteria, aggregateOptions: MongoAggregationOptions): Object[];
    protected abstract processAggregationResultAndRunCallback(aggregationResult: any);
}