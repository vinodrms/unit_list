import {MongoSearchCriteria, MongoAggregationOptions} from '../../MongoRepository';
import {LazyLoadRepoDO} from '../../../repo-data-objects/LazyLoadRepoDO';
import {AMongoAggregation} from './AMongoAggregation';

import _ = require('underscore');

export class MongoDocumentListAggregation extends AMongoAggregation<Object[]> {

    protected customApplyPipelineParams(pipeline: Object[], searchCriteria: MongoSearchCriteria, aggregateOptions: MongoAggregationOptions): Object[] {
        pipeline = this.applyLazyLoadParams(pipeline, searchCriteria);
        return pipeline;
    }
    private applyLazyLoadParams(pipeline: Object[], searchCriteria: MongoSearchCriteria) {
        var lazyLoadValidationStructure = LazyLoadRepoDO.getValidationStructure().validateStructure(searchCriteria.lazyLoad);
        if (lazyLoadValidationStructure.isValid()) {
            var skipNo = searchCriteria.lazyLoad.pageNumber * searchCriteria.lazyLoad.pageSize;
            pipeline.push({ $skip: skipNo });
            pipeline.push({ $limit: searchCriteria.lazyLoad.pageSize });
        }
        return pipeline;
    }

    protected processAggregationResultAndRunCallback(aggregationResult: any) {
        if (!_.isArray(aggregationResult)) {
            this.errorCallback(new Error("did not receive an array"));
            return;
        }
        var aggregationResultArray: Object[] = aggregationResult;
        var processedItemList: Object[] = _.map(aggregationResultArray, (item: any) => {
            return this._mongoUtils.processQueryResultItem(item);
        });
        this.successCallback(processedItemList);
    }
}