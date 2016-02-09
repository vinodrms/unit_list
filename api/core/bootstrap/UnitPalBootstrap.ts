import {UnitPalConfig} from '../utils/environment/UnitPalConfig';
import {ServiceBootstrapFactory} from '../services/ServiceBootstrapFactory';
import {DBPatchesFactory} from './db-patches/DBPatchesFactory';
import {IDBPatch} from './db-patches/IDBPatch';
import {LogInitializerFactory} from './logs/LogInitializerFactory';
import {ILogInitializer} from './logs/ILogInitializer';
import {Logger, LogLevel} from '../utils/logging/Logger';

export class UnitPalBootstrap {
	private _unitPalConfig: UnitPalConfig;
	private _serviceBootstrapFactory: ServiceBootstrapFactory;
	constructor() {
		this._unitPalConfig = new UnitPalConfig();
		this._serviceBootstrapFactory = new ServiceBootstrapFactory(this._unitPalConfig);
	}
	bootstrap(endCallback: { (): void; }) {
		this.initializeLogger();
		this.initializeLoginService();
		this.initializeDatabase(endCallback);
	}
	private initializeLogger() {
		try {
			var logsInitFactory: LogInitializerFactory = new LogInitializerFactory(this._unitPalConfig);
			var logInitializer: ILogInitializer = logsInitFactory.getLogInitializer();
			logInitializer.initLogger();
		} catch (e) {
			Logger.getInstance().logError(LogLevel.Error, "Error bootstrapping logging", { step: "Bootstrap" }, e);
		}
	}
	private initializeLoginService() {
		try {
			this._serviceBootstrapFactory.getLoginServiceInitializer().init();
		} catch (e) {
			Logger.getInstance().logError(LogLevel.Error, "Error bootstrapping login service", { step: "Bootstrap" }, e);
		}
	}
	private initializeDatabase(endCallback: { (): void; }) {
		var dbPatchesFactory = new DBPatchesFactory(this._unitPalConfig);
		var dbPatch: IDBPatch = dbPatchesFactory.getDBPatch();
		dbPatch.applyPatches().then((result: any) => {
			endCallback();
		}).catch((error: any) => {
			Logger.getInstance().logError(LogLevel.Error, "Error bootstrapping database", { step: "Bootstrap" }, error);
			endCallback();
		});
	}
}