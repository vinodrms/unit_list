import {IThLogger, ThLogLevel} from './ThLogger';
import {ThUtils} from '../ThUtils';
import {ThError} from '../th-responses/ThError';
import {ThResponse, ThStatusCode} from '../th-responses/ThResponse';
import {Locales} from '../localization/Translation';

import _ = require('underscore');
import winston = require('winston');

export class WinstonLogger implements IThLogger {
	private _thUtils: ThUtils;
	private _logLevels: { [index: number]: string; } = {};

	constructor() {
		this._thUtils = new ThUtils();
		this._logLevels[ThLogLevel.Debug] = "debug";
		this._logLevels[ThLogLevel.Info] = "info";
		this._logLevels[ThLogLevel.Warning] = "warn";
		this._logLevels[ThLogLevel.Error] = "error";
	}
	public logBusiness(logLevel: ThLogLevel, message: string, context: any, thError: ThError) {
		this.log(this._logLevels[logLevel], "Business", message, context, thError);
	}
	public logError(logLevel: ThLogLevel, message: string, context: any, thError: ThError) {
		if (this._thUtils.isUndefinedOrNull(thError, "_nativeError.stack")) {
			thError._nativeError = new Error();
		}
		this.log(this._logLevels[logLevel], "Error", message, context, thError);
	}
	private log(logLevel: string, errorType: string, message: string, context: any, thError: ThError) {
		var nativeError: any = {};
		if (!this._thUtils.isUndefinedOrNull(thError, "_nativeError.stack")) {
			nativeError.stack = thError._nativeError.stack
		}
		if (!this._thUtils.isUndefinedOrNull(thError, "_nativeError.message")) {
			nativeError.message = thError._nativeError.message
		}
		if (!this._thUtils.isUndefinedOrNull(thError, "_nativeError.name")) {
			nativeError.name = thError._nativeError.name
		}

		var errorStack: string = "";
		if (!this._thUtils.isUndefinedOrNull(thError, "_nativeError.stack")) {
			errorStack = thError._nativeError.stack
		}
		var thResponse: ThResponse = new ThResponse(thError._thStatusCode);
		var thResponseJson = _.extend(thResponse.buildJson(Locales.English), { statusCodeKey: ThStatusCode[thError._thStatusCode] });
		delete thResponseJson.data;
		winston.log(logLevel, message, {
			type: errorType,
			context: context,
			thResponse: thResponseJson,
			nativeError: nativeError
		});
	}
}