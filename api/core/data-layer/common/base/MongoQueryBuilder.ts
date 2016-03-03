import {ThUtils} from '../../../utils/ThUtils';
import {MongoQueryUtils} from './mongo-utils/MongoQueryUtils';
import _ = require('underscore');

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
		var preprocessedQuery = this._mongoQueryUtils.preprocessQueryValue(fieldName, option);
		this._processedQuery[preprocessedQuery.fieldName] = { '$in': [preprocessedQuery.value] };
	}

	public addMultipleSelectOptionList<T>(fieldName: string, optionList: T[]) {
		if (this._thUtils.isUndefinedOrNull(optionList) || !_.isArray(optionList)) {
			return;
		}
		var preprocessedQuery = this._mongoQueryUtils.preprocessQueryValueList(fieldName, optionList);
		this._processedQuery[preprocessedQuery.fieldName] = { '$in': preprocessedQuery.valueList };
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
		var preprocessedQuery = this._mongoQueryUtils.preprocessQueryValue(fieldName, value);
		this._processedQuery[preprocessedQuery.fieldName] = preprocessedQuery.value;
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