import {WinstonLogger} from './WinstonLogger';

export interface ILogger {
	logBusiness(message: string, context: any, error?: Error);
	logError(message: string, context: any, error: Error);
}

export class Logger {
	private static _logger: ILogger = new WinstonLogger();
	public static getInstance(): ILogger {
		return this._logger;
	}
}