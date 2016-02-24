import {UnitPalConfig, DatabaseType} from '../utils/environment/UnitPalConfig';
import {IHotelRepository} from './hotel/repositories/IHotelRepository';
import {MongoHotelRepository} from './hotel/repositories/mongo/MongoHotelRepository';
import {ISettingsRepository} from './settings/repositories/ISettingsRepository';
import {MongoSettingsRepository} from './settings/repositories/mongo/MongoSettingsRepository';
import {IBedRepository} from './beds/repositories/IBedRepository';
import {MongoBedRepository} from './beds/repositories/mongo/MongoBedRepository';
import {ITaxRepository} from './taxes/repositories/ITaxRepository';
import {MongoTaxRepository} from './taxes/repositories/mongo/MongoTaxRepository';
import {IRepositoryCleaner} from './common/base/IRepositoryCleaner';

export class RepositoryFactory {
	private _databaseType: DatabaseType;
	constructor(private _unitPalConfig: UnitPalConfig) {
		this._databaseType = _unitPalConfig.getDatabaseType();
	}

	getRepositoryCleaners(): IRepositoryCleaner[] {
		switch (this._databaseType) {
			default:
				return [new MongoHotelRepository(), new MongoBedRepository(), new MongoTaxRepository()];
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
    getBedRepository(): IBedRepository {
        switch (this._databaseType) {
            default:
                return new MongoBedRepository();
        }
    }

	getTaxRepository(): ITaxRepository {
		switch (this._databaseType) {
			default:
				return new MongoTaxRepository();
		}
	}
}