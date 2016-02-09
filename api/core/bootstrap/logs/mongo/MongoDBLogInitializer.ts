import {ILogInitializer} from '../ILogInitializer';
import {Logger, LogLevel} from '../../../utils/logging/Logger';

import winston = require('winston');
require('winston-mongodb').MongoDB;

export class MongoDBLogInitializer implements ILogInitializer {
	private _databaseConfig: any;

	constructor() {
		this.initDatabaseConfig();
	}
	private initDatabaseConfig() {
		var logsEntity = sails.models.systemlogsentity;
		var entityConnections = logsEntity.connections;
		if (!entityConnections) {
			return;
		}
		var connectionsKeys = Object.keys(entityConnections);
		if (!connectionsKeys || connectionsKeys.length == 0) {
			return;
		}
		this._databaseConfig = entityConnections[connectionsKeys[0]].config;
	}

	public initLogger() {
		if (!this._databaseConfig) {
			Logger.getInstance().logError(LogLevel.Error, "Error reading database configuration from SystemLogsEntity", { step: "Bootstrap" }, new Error());
			return;
		}
		try {
			var winstonOptions = {
				collection: "SystemLogs",
				db: "mongodb://" + this._databaseConfig.host + ":" + this._databaseConfig.port + "/" + this._databaseConfig.database,
				username: this._databaseConfig.user,
				password: this._databaseConfig.password,
				level: "info"
			};
			var winstonTransports: any = winston.transports;
			winston.add(winstonTransports.MongoDB, winstonOptions);
		} catch (e) {
			Logger.getInstance().logError(LogLevel.Error, "Error initializing winston with the database configuration", { dbConfig: this._databaseConfig, step: "Bootstrap" }, new Error());
		}

		winston.remove(winston.transports.Console);
		var fileOptions = {
			filename: 'unitPal.log',
			colorize: true,
			maxsize: 1000 * 1000 * 100,
			level: "debug"
		};
		winston.add(winston.transports.File, fileOptions);
	}
}