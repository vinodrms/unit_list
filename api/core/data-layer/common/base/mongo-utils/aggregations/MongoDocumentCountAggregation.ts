import {MongoSearchCriteria, MongoAggregationOptions} from '../../MongoRepository';
import {LazyLoadRepoDO, LazyLoadMetaResponseRepoDO} from '../../../repo-data-objects/LazyLoadRepoDO';
import {AMongoAggregation} from './AMongoAggregation';

import _ = require('underscore');

export class MongoDocumentCountAggregation extends AMongoAggregation<LazyLoadMetaResponseRepoDO> {

    protected customApplyPipelineParams(pipeline: Object[], searchCriteria: MongoSearchCriteria, aggregateOptions: MongoAggregationOptions): Object[] {
        pipeline.push({
            $group: { _id: null, count: { $sum: 1 } }
        });
        return pipeline;
    }

    protected processAggregationResultAndRunCallback(aggregationResult: any) {
        if (!_.isArray(aggregationResult)) {
            this.errorCallback(new Error("did not receive an array"));
            return;
        }
        var aggregationResultArray: Object[] = aggregationResult;
        if (aggregationResultArray.length == 0) {
            this.errorCallback(new Error("did receive an empty array"));
            return;
        }
        var aggregationObject = aggregationResultArray[0];
        if (!_.isObject(aggregationObject) || !_.isNumber(aggregationObject["count"])) {
            this.errorCallback(new Error("count function did not return a number"));
            return;
        }
        this.successCallback({ numOfItems: aggregationObject["count"] });
    }
}