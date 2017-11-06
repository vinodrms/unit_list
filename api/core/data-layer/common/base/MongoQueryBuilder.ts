import _ = require('underscore');
import { ThError } from '../../../utils/th-responses/ThError';
import { ThStatusCode } from '../../../utils/th-responses/ThResponse';
import { ThLogger, ThLogLevel } from '../../../utils/logging/ThLogger';
import { ThUtils } from '../../../utils/ThUtils';
import { MongoQueryUtils } from './mongo-utils/MongoQueryUtils';

export enum QueryComparisonOperator {
    GreaterThan,
    GreaterThanOrEqual,
    LessThan,
    LessThanOrEqual
}
var QueryComparisonOperatorSymbols: { [index: number]: string; } = {};
QueryComparisonOperatorSymbols[QueryComparisonOperator.GreaterThan] = "$gt";
QueryComparisonOperatorSymbols[QueryComparisonOperator.GreaterThanOrEqual] = "$gte";
QueryComparisonOperatorSymbols[QueryComparisonOperator.LessThan] = "$lt";
QueryComparisonOperatorSymbols[QueryComparisonOperator.LessThanOrEqual] = "$lte";

export type CustomQueryKey = "$or" | "$and";

export class MongoQueryBuilder {
    private _thUtils: ThUtils;
    private _mongoQueryUtils: MongoQueryUtils;
    private _processedQuery: Object;

    constructor() {
        this._thUtils = new ThUtils();
        this._mongoQueryUtils = new MongoQueryUtils();
        this._processedQuery = {};
    }

    public addMultipleSelectOption<T>(fieldName: string, option: T) {
        if (this._thUtils.isUndefinedOrNull(option)) {
            return;
        }
        try {
            var preprocessedQuery = this._mongoQueryUtils.preprocessQueryValue(fieldName, option);
            this._processedQuery[preprocessedQuery.fieldName] = { '$in': [preprocessedQuery.value] };
        } catch (e) { }
    }

    public addMultipleSelectOptionList<T>(fieldName: string, optionList: T[]) {
        if (this._thUtils.isUndefinedOrNull(optionList) || !_.isArray(optionList)) {
            return;
        }
        try {
            var preprocessedQuery = this._mongoQueryUtils.preprocessQueryValueList(fieldName, optionList);
            this._processedQuery[preprocessedQuery.fieldName] = { '$in': preprocessedQuery.valueList };
        } catch (error) { }
    }

    public addRegex(fieldName: string, text: string) {
        if (this._thUtils.isUndefinedOrNull(text) || !_.isString(text) || fieldName === "id") {
            return;
        }
        var regexValue = '/*' + text + '/*';
        this._processedQuery[fieldName] = { "$regex": regexValue, "$options": "i" };
    }

    public addExactMatch<T>(fieldName: string, value: T) {
        if (this._thUtils.isUndefinedOrNull(value)) {
            return;
        }
        try {
            var preprocessedQuery = this._mongoQueryUtils.preprocessQueryValue(fieldName, value);
            this._processedQuery[preprocessedQuery.fieldName] = preprocessedQuery.value;
        } catch (e) { }
    }
    public addNotEqualMatch<T>(fieldName: string, value: T) {
        if (this._thUtils.isUndefinedOrNull(value)) {
            return;
        }
        try {
            var preprocessedQuery = this._mongoQueryUtils.preprocessQueryValue(fieldName, value);
            this._processedQuery[preprocessedQuery.fieldName] = { $ne: preprocessedQuery.value };
        } catch (e) { }
    }

    public addComparison<T>(queryComparisonOperator: QueryComparisonOperator, fieldName: string, value: T) {
        if (this._thUtils.isUndefinedOrNull(value)) {
            return;
        }
        try {
            var preprocessedQuery = this._mongoQueryUtils.preprocessQueryValue(fieldName, value);
            var comparisonSymbol: string = QueryComparisonOperatorSymbols[queryComparisonOperator];
            var queryValue = {};
            queryValue[comparisonSymbol] = preprocessedQuery.value;
            this._processedQuery[preprocessedQuery.fieldName] = queryValue;
        } catch (error) { }
    }

    public addTextIndexSearch(text: string) {
        if (this._thUtils.isUndefinedOrNull(text) || !_.isString(text)) {
            return;
        }
        this._processedQuery["$text"] = { $search: "\"" + text + "\"" };
    }

    public addCustomQuery(queryKey: CustomQueryKey, queryValue: Object[]) {
        let andQuery: Object[] = [];
        if (!this._thUtils.isUndefinedOrNull(this._processedQuery["$and"])) {
            andQuery = this._processedQuery["$and"];
        }

        if (queryKey === "$or") {
            let customQuery = {
                "$or": queryValue
            };
            andQuery.push(customQuery);
        }
        else if (queryKey === "$and") {
            andQuery = andQuery.concat(queryValue);
        }

        this._processedQuery["$and"] = andQuery;
    }

    public get processedQuery() {
        return this._processedQuery;
    }
}
