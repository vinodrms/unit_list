import { UnitPalConfig } from '../utils/environment/UnitPalConfig';
import { DBPatchesFactory } from './db-patches/DBPatchesFactory';
import { IDBPatch } from './db-patches/IDBPatch';
import { LogInitializerFactory } from './logs/LogInitializerFactory';
import { ILogInitializer } from './logs/ILogInitializer';
import { ThLogger, ThLogLevel } from '../utils/logging/ThLogger';
import { ThError } from '../utils/th-responses/ThError';
import { ThStatusCode } from '../utils/th-responses/ThResponse';
import { CronJobInitializer } from '../cron-jobs/CronJobInitializer';
import { SocketsInitializer } from './sockets/SocketsInitializer';
import { OAuthServerInitializer } from "./oauth/OAuthServerInitializer";
import { RepositoryFactory } from "../data-layer/RepositoryFactory";

declare var sails: any;

export class UnitPalBootstrap {
	private _unitPalConfig: UnitPalConfig;
	
	constructor() {
		this._unitPalConfig = new UnitPalConfig();
	}
	bootstrap(endCallback: { (): void; }) {
		this.initializeLogger();
		this.initializeSockets();
		this.initializeDatabase(endCallback);
		this.initializeCronJobs();
		this.initializeOauthServer();
		this.logDefaultClientSessionIfNecessary();
	}
	private initializeLogger() {
		try {
			var logsInitFactory: LogInitializerFactory = new LogInitializerFactory(this._unitPalConfig);
			var logInitializer: ILogInitializer = logsInitFactory.getLogInitializer();
			logInitializer.initLogger();
		} catch (e) {
			var thError = new ThError(ThStatusCode.ErrorBootstrappingApp, e);
			if (thError.isNativeError()) {
				ThLogger.getInstance().logError(ThLogLevel.Error, "Error bootstrapping logging", { step: "Bootstrap" }, thError);
			}
		}
	}
	
	private initializeDatabase(endCallback: { (): void; }) {
		var dbPatchesFactory = new DBPatchesFactory(this._unitPalConfig);
		var dbPatch: IDBPatch = dbPatchesFactory.getDBPatch();
		dbPatch.applyPatches().then((result: any) => {
			endCallback();
		}).catch((error: any) => {
			var thError = new ThError(ThStatusCode.ErrorBootstrappingApp, error);
			if (thError.isNativeError()) {
				ThLogger.getInstance().logError(ThLogLevel.Error, "Error bootstrapping database", { step: "Bootstrap" }, thError);
			}
			endCallback();
		});
	}
	private initializeCronJobs() {
		var cronInitializer = new CronJobInitializer();
		cronInitializer.schedule();
	}
	private initializeSockets() {
		var socketsInitializer = new SocketsInitializer();
		socketsInitializer.register();
	}
	private initializeOauthServer() {
		
		
		let oauthServerInitializer = new OAuthServerInitializer(this._unitPalConfig);
		oauthServerInitializer.register();
	}
	private logDefaultClientSessionIfNecessary() {
		if (this._unitPalConfig.defaultClientSessionIsEnabled()) {
			sails.log.warn("!!!! THE DEFAULT CLIENT SESSION IS ENABLED !!!! Each client request without a session will be attached to the default hotel & user from the database.");
		}
	}
}