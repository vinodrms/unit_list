import {UnitPalConfig, DatabaseType} from '../utils/environment/UnitPalConfig';
import {IHotelRepository} from './hotel/repositories/IHotelRepository';
import {MongoHotelRepository} from './hotel/repositories/mongo/MongoHotelRepository';
import {ISettingsRepository} from './settings/repositories/ISettingsRepository';
import {MongoSettingsRepository} from './settings/repositories/mongo/MongoSettingsRepository';
import {IBedConfigurationRepository} from './bed-configuration/repositories/IBedConfigurationRepository';
import {MongoBedConfigurationRepository} from './bed-configuration/repositories/mongo/MongoBedConfigurationRepository';
import {IRepositoryCleaner} from './common/base/IRepositoryCleaner';

export class RepositoryFactory {
	private _databaseType: DatabaseType;
	constructor(private _unitPalConfig: UnitPalConfig) {
		this._databaseType = _unitPalConfig.getDatabaseType();
	}

	getRepositoryCleaners(): IRepositoryCleaner[] {
		switch (this._databaseType) {
			default:
				return [new MongoHotelRepository(), new MongoBedConfigurationRepository()];
		}
	}

	getHotelRepository(): IHotelRepository {
		switch (this._databaseType) {
			default:
				return new MongoHotelRepository();
		}
	}
    
    getSettingsRepository(): ISettingsRepository {
		switch (this._databaseType) {
			default:
				return new MongoSettingsRepository();
		}
	}
    
    getBedConfigurationRepository(): IBedConfigurationRepository {
        switch (this._databaseType) {
            default:
                return new MongoBedConfigurationRepository();
        }
    }
}