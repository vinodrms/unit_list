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
import {IPriceProductRepository} from './price-products/repositories/IPriceProductRepository';
import {MongoPriceProductRepository} from './price-products/repositories/mongo/MongoPriceProductRepository';
import {IYieldFilterConfigurationRepository} from './hotel-configurations/repositories/IYieldFilterConfigurationRepository';
import {MongoYieldFilterConfigurationRepository} from './hotel-configurations/repositories/mongo/MongoYieldFilterConfigurationRepository';
import {IAllotmentRepository} from './allotment/repositories/IAllotmentRepository';
import {MongoAllotmentRepository} from './allotment/repositories/mongo/MongoAllotmentRepository';
import {INotificationsRepository} from './notifications/repositories/INotificationsRepository';
import {MongoNotificationsRepository} from './notifications/repositories/mongo/MongoNotificationsRepository';
import {IInvoiceGroupsRepository} from './invoices/repositories/IInvoiceGroupsRepository';
import {MongoInvoiceGroupsRepository} from './invoices/repositories/mongo/MongoInvoiceGroupsRepository';

export class RepositoryFactory {
    private _databaseType: DatabaseType;
    constructor(private _unitPalConfig: UnitPalConfig) {
        this._databaseType = _unitPalConfig.getDatabaseType();
    }

    getRepositoryCleaners(): IRepositoryCleaner[] {
        switch (this._databaseType) {
            default:
                return [new MongoHotelRepository(), new MongoBedRepository(), new MongoTaxRepository(), new MongoAddOnProductRepository(),
                    new MongoRoomRepository(), new MongoRoomCategoryRepository(), new MongoCustomerRepository(), new MongoPriceProductRepository(),
                    new MongoYieldFilterConfigurationRepository(), new MongoAllotmentRepository(), new MongoNotificationsRepository()];
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

    getPriceProductRepository(): IPriceProductRepository {
        switch (this._databaseType) {
            default:
                return new MongoPriceProductRepository();
        }
    }

    getYieldFilterConfigurationsRepository(): IYieldFilterConfigurationRepository {
        switch (this._databaseType) {
            default:
                return new MongoYieldFilterConfigurationRepository();
        }
    }

    getAllotmentRepository(): IAllotmentRepository {
        switch (this._databaseType) {
            default:
                return new MongoAllotmentRepository();
        }
    }

    getNotificationsRepository(): INotificationsRepository {
        switch (this._databaseType) {
            default:
                return new MongoNotificationsRepository();
        }
    }

    getInvoiceGroupsRepository(): IInvoiceGroupsRepository {
        switch (this._databaseType) {
            default:
                return new MongoInvoiceGroupsRepository();
        }
    }
}