import {WinstonLogger} from './WinstonLogger';

export interface ILogger {
	logBusiness(logLevel: LogLevel, message: string, context: any, error?: Error);
	logError(logLevel: LogLevel, message: string, context: any, error: Error);
}

export enum LogLevel {
	Debug,
	Info,
	Warning,
	Error
}

export class Logger {
	private static _logger: ILogger = new WinstonLogger();
	public static getInstance(): ILogger {
		return this._logger;
	}
}