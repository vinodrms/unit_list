import {UnitPalConfig, DatabaseType} from '../utils/environment/UnitPalConfig';
import {IHotelRepository} from './hotel/repositories/IHotelRepository';
import {MongoHotelRepository} from './hotel/repositories/mongo/MongoHotelRepository';
import {IRepositoryCleaner} from './common/base/IRepositoryCleaner';

export class RepositoryFactory {
	private _databaseType: DatabaseType;
	constructor(private _unitPalConfig: UnitPalConfig) {
		this._databaseType = _unitPalConfig.getDatabaseType();
	}

	getRepositoryCleaners(): IRepositoryCleaner[] {
		switch (this._databaseType) {
			default:
				return [new MongoHotelRepository()];
		}
	}

	getHotelRepository(): IHotelRepository {
		switch (this._databaseType) {
			default:
				return new MongoHotelRepository();
		}
	}
}