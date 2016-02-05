import {UnitPalConfig, DatabaseType} from '../utils/environment/UnitPalConfig';
import {AHotelRepository} from './hotel/repositories/AHotelRepository';
import {MongoHotelRepository} from './hotel/repositories/mongo/MongoHotelRepository';

export class RepositoryFactory {
	private _databaseType : DatabaseType;
	constructor(private _unitPalConfig: UnitPalConfig) {
		this._databaseType = _unitPalConfig.getDatabaseType();
	}
	
	getHotelRepository(): AHotelRepository {
		switch(this._databaseType) {
			default:
				return new MongoHotelRepository();
		}
	}
}