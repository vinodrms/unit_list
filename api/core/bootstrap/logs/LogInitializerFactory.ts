import {UnitPalConfig, DatabaseType} from '../../utils/environment/UnitPalConfig';
import {ILogInitializer} from './ILogInitializer';
import {MongoDBLogInitializer} from './mongo/MongoDBLogInitializer';

export class LogInitializerFactory {
	private _databaseType: DatabaseType;
	constructor(private _unitPalConfig: UnitPalConfig) {
		this._databaseType = _unitPalConfig.getDatabaseType();
	}
	public getLogInitializer(): ILogInitializer {
		switch (this._databaseType) {
			default:
				return new MongoDBLogInitializer();
		}
	}
}