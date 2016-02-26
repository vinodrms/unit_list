import {ThUtils} from '../../../utils/ThUtils';
import _ = require('underscore');

export class MongoQueryBuilder {
	private _thUtils: ThUtils;
	private _processedQuery: Object;

	constructor() {
		this._thUtils = new ThUtils();
		this._processedQuery = {};
	}

	public addMultipleSelectOptions(fieldName: string, options: Object[]) {
		if (this._thUtils.isUndefinedOrNull(options) || !_.isArray(options)) {
			return;
		}
		this._processedQuery[fieldName] = { '$in': options };
	}

	public addRegex(fieldName: string, text: string) {
		if (this._thUtils.isUndefinedOrNull(text) || !_.isString(text)) {
			return;
		}
		var regexValue = '/*' + text + '/*';
		this._processedQuery[fieldName] = { "$regex": regexValue, "$options": "i" };
	}

	public addExactMatch(fieldName: string, value: any) {
		if (this._thUtils.isUndefinedOrNull(value)) {
			return;
		}
		this._processedQuery[fieldName] = value;
	}

	public get processedQuery() {
		return this._processedQuery;
	}
}