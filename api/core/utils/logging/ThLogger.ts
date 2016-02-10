import {WinstonLogger} from './WinstonLogger';
import {ThError} from '../th-responses/ThError';

export interface IThLogger {
	logBusiness(logLevel: ThLogLevel, message: string, context: any, thError: ThError);
	logError(logLevel: ThLogLevel, message: string, context: any, thError: ThError);
}

export enum ThLogLevel {
	Debug,
	Info,
	Warning,
	Error
}

export class ThLogger {
	private static _logger: IThLogger = new WinstonLogger();
	public static getInstance(): IThLogger {
		return this._logger;
	}
}