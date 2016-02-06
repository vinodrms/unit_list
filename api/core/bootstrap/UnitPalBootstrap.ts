import {UnitPalConfig} from '../utils/environment/UnitPalConfig';
import {DBPatchesFactory} from './db-patches/DBPatchesFactory';
import {IDBPatch} from './db-patches/IDBPatch';
import {LogInitializerFactory} from './logs/LogInitializerFactory';
import {ILogInitializer} from './logs/ILogInitializer';
import {Logger} from '../utils/logging/Logger';

export class UnitPalBootstrap {
	private _unitPalConfig: UnitPalConfig;
	constructor() {
		this._unitPalConfig = new UnitPalConfig();
	}
	bootstrap(callback: { (): void; }) {
		this.initializeLogger();

		var dbPatchesFactory = new DBPatchesFactory(this._unitPalConfig);
		var dbPatch: IDBPatch = dbPatchesFactory.getDBPatch();
		dbPatch.applyPatches().then((result: any) => {
			callback();
		}).catch((error: any) => {
			Logger.getInstance().logError("Error bootstrapping database", {step: "Bootstrap"}, error);
			callback();
		});
	}
	private initializeLogger() {
		try {
			var logsInitFactory: LogInitializerFactory = new LogInitializerFactory(this._unitPalConfig);
			var logInitializer: ILogInitializer = logsInitFactory.getLogInitializer();
			logInitializer.initLogger();
		} catch (e) {
			Logger.getInstance().logError("Error bootstrapping logging", {step: "Bootstrap"}, e);
		}
	}
}