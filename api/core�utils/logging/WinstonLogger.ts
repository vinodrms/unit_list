import {ILogger, LogLevel} from './Logger';
import {AppUtils} from '../AppUtils';
import winston = require('winston');

export class WinstonLogger implements ILogger {
	private _appUtils: AppUtils;
	private _logLevels: { [index: number]: string; } = {};

	constructor() {
		this._appUtils = new AppUtils();
		this._logLevels[LogLevel.Debug] = "debug";
		this._logLevels[LogLevel.Info] = "info";
		this._logLevels[LogLevel.Warning] = "warn";
		this._logLevels[LogLevel.Error] = "error";
	}
	public logBusiness(logLevel: LogLevel, message: string, context: any, error?: Error) {
		this.log(this._logLevels[logLevel], "Business", message, context, error);
	}
	public logError(logLevel: LogLevel, message: string, context: any, error: Error) {
		if (this._appUtils.isUndefined(error, "stack")) {
			error = new Error();
		}
		this.log(this._logLevels[logLevel], "Error", message, context, error);
	}
	private log(logLevel: string, errorType: string, message: string, context: any, error: Error) {
		var errorStack = {};
		if (!this._appUtils.isUndefined(error, "stack")) {
			errorStack = error.stack
		}
		winston.log(logLevel, message, {
			type: errorType,
			context: context,
			stack: errorStack
		});
	}
}