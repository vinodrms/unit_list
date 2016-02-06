import {ILogger} from './Logger';

import _ = require("underscore");
import winston = require('winston');

export class WinstonLogger implements ILogger {
	logBusiness(message: string, context: any, error?: Error) {
		var toLogObject = {
			type: "Business",
			context: context,
			stack: {}
		};
		if (!_.isUndefined(error) && !_.isUndefined(error.stack)) {
			toLogObject.stack = error.stack
		}
		winston.warn(message, toLogObject);
	}
	logError(message: string, context: any, error: Error) {
		if (_.isUndefined(error) || _.isUndefined(error.stack)) {
			error = new Error();
		}
		winston.error(message, {
			type: "Error",
			context: context,
			stack: error.stack
		});
	}
}