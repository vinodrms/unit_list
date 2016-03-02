import {UnitPalConfig, DatabaseType} from '../utils/environment/UnitPalConfig';
import {IHotelRepository} from './hotel/repositories/IHotelRepository';
import {MongoHotelRepository} from './hotel/repositories/mongo/MongoHotelRepository';
import {ISettingsRepository} from './settings/repositories/ISettingsRepository';
import {MongoSettingsRepository} from './settings/repositories/mongo/MongoSettingsRepository';
import {IBedRepository} from './beds/repositories/IBedRepository';
import {MongoBedRepository} from './beds/repositories/mongo/MongoBedRepository';
import {MongoRoomRepository} from './rooms/repositories/mongo/MongoRoomRepository';
import {IRoomRepository} from './rooms/repositories/IRoomRepository';
import {MongoRoomCategoryRepository} from './room-categories/repositories/mongo/MongoRoomCategoryRepository';
import {IRoomCategoryRepository} from './room-categories/repositories/IRoomCategoryRepository';
import {ITaxRepository} from './taxes/repositories/ITaxRepository';
import {MongoTaxRepository} from './taxes/repositories/mongo/MongoTaxRepository';
import {IAddOnProductRepository} from './add-on-products/repositories/IAddOnProductRepository';
import {MongoAddOnProductRepository} from './add-on-products/repositories/mongo/MongoAddOnProductRepository';
import {IRepositoryCleaner} from './common/base/IRepositoryCleaner';
import {MongoCustomerRepository} from './customers/repositories/mongo/MongoCustomerRepository';
import {ICustomerRepository} from './customers/repositories/ICustomerRepository';

export class RepositoryFactory {
	private _databaseType: DatabaseType;
	constructor(private _unitPalConfig: UnitPalConfig) {
		this._databaseType = _unitPalConfig.getDatabaseType();
	}

	getRepositoryCleaners(): IRepositoryCleaner[] {
		switch (this._databaseType) {
			default:
				return [new MongoHotelRepository(), new MongoBedRepository(), new MongoTaxRepository(), new MongoAddOnProductRepository()];
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

	getAddOnProductRepository(): IAddOnProductRepository {
		switch (this._databaseType) {
			default:
				return new MongoAddOnProductRepository();
		}
	}
    
    getRoomCategoryRepository(): IRoomCategoryRepository {
		switch (this._databaseType) {
			default:
				return new MongoRoomCategoryRepository();
		}
	}
    
    getRoomRepository(): IRoomRepository {
		switch (this._databaseType) {
			default:
				return new MongoRoomRepository();
        }
    }
    
	getCustomerRepository(): ICustomerRepository {
		switch (this._databaseType) {
			default:
				return new MongoCustomerRepository();
		}
	}
}