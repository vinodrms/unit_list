import {ThUtils} from '../../../utils/ThUtils';
import {MongoQueryUtils} from './mongo-utils/MongoQueryUtils';
import _ = require('underscore');

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

	public get processedQuery() {
		return this._processedQuery;
	}
}