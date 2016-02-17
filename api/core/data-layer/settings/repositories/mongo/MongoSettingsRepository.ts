import {ThLogger, ThLogLevel} from '../../../../utils/logging/ThLogger';
import {ThError} from '../../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../../utils/th-responses/ThResponse';
import {ISettingsRepository} from '../ISettingsRepository';
import {MongoRepository, MongoErrorCodes} from '../../../common/base/MongoRepository';
import {AmenitySettingDO} from '../../data-objects/amenity/AmenitySettingDO';
import {CountrySettingDO} from '../../data-objects/country/CountrySettingDO';
import {CurrencySettingDO} from '../../data-objects/currency/CurrencySettingDO';
import {PaymentMethodSettingDO} from '../../data-objects/payment-method/PaymentMethodSettingDO';
import {SettingType} from '../../data-objects/common/SettingMetadataDO';
import {BaseDO} from '../../../common/base/BaseDO';
import {AmenityDO} from '../../../common/data-objects/amenity/AmenityDO';
import {CountryDO} from '../../../common/data-objects/country/CountryDO';
import {CurrencyDO} from '../../../common/data-objects/currency/CurrencyDO';
import {PaymentMethodDO} from '../../../common/data-objects/payment-method/PaymentMethodDO';

import _ = require('underscore');

export class MongoSettingsRepository extends MongoRepository implements ISettingsRepository {
    private _settingsEntity: Sails.Model;

    constructor() {
        var settingsEntity = sails.models.settingsentity;
        super(settingsEntity);
        this._settingsEntity = settingsEntity;
    }

    public addSettings(setting: Object): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.addSettingsCore(resolve, reject, setting);
        });
    }
    private addSettingsCore(resolve: { (result: boolean): void }, reject: { (err: ThError): void }, setting: Object) {
        this._settingsEntity.create(setting).then((createdSetting: Sails.QueryResult) => {
            resolve(true);
        }).catch((err: Error) => {
            var errorCode = this.getMongoErrorCode(err);
            if (errorCode == MongoErrorCodes.DuplicateKeyError) {
                var thError = new ThError(ThStatusCode.SettingsMongoRepositoryAddDuplicateKeyError, err);
                ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "Setting already exists", setting, thError);
                reject(thError);
            }
            else {
                var thError = new ThError(ThStatusCode.SettingsMongoRepositoryAddError, err);
                ThLogger.getInstance().logError(ThLogLevel.Error, "Error adding setting", setting, thError);
                reject(thError);
            }
        });
    }

    public getRoomAmenities(valueCriteria?: Object): Promise<AmenityDO[]> {
        return this.getSetting(SettingType.RoomAmenities, valueCriteria);
    }
    
    public getHotelAmenities(valueCriteria?: Object): Promise<AmenityDO[]> {
        return this.getSetting(SettingType.HotelAmenities, valueCriteria);
    }
    
    public getCountries(valueCriteria?: Object): Promise<CountryDO[]> {
        return this.getSetting(SettingType.Countries, valueCriteria);
    }
    
    public getCountriesAsync(finishQueryCallback: { (err: any, country?: CountryDO[]): void; }, valueCriteria?: Object) {
		this.getCountries(valueCriteria).then((retrievedCountries: CountryDO[]) => {
			finishQueryCallback(null, retrievedCountries);
		}).catch((error: any) => {
			finishQueryCallback(error);
		});
	}
    
    public getCurrencies(valueCriteria?: Object): Promise<CurrencyDO[]> {
        return this.getSetting(SettingType.CurrencyCodes, valueCriteria);
    }

    public getPaymentMethods(valueCriteria?: Object): Promise<PaymentMethodDO[]> {
        return this.getSetting(SettingType.PaymentMethods, valueCriteria);
    }

    private getSetting(settingType: SettingType, criteria?: Object): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.getSettingCore(settingType, criteria, resolve, reject);
        });
    }

    private getSettingCore(settingType: SettingType, criteria: Object, resolve: { (result: any): void }, reject: { (err: ThError): void }) {
        this._settingsEntity.findOne({ "metadata.type": settingType }).then((settingRead: Sails.QueryResult) => {
            var resultDO = this.getSettingQueryResultDO(settingType, settingRead);
            if (criteria) {
                resultDO = _.where(resultDO, criteria);
            }
            resolve(resultDO);
        }).catch((err: Error) => {
            var errorCode = this.getMongoErrorCode(err);
            var thError = new ThError(ThStatusCode.HotelRepositoryErrorAddingHotel, err);
            ThLogger.getInstance().logError(ThLogLevel.Error, "Error retrieving setting.", { settingType: settingType, criteria: criteria }, thError);
            reject(thError);
        });
    }

    private getSettingQueryResultDO(settingType: SettingType, queryResult: Sails.QueryResult): BaseDO[] {
        var getSettingsResponseDO: BaseDO;
        switch (settingType) {
            case SettingType.RoomAmenities: getSettingsResponseDO = new AmenitySettingDO(); break;
            case SettingType.HotelAmenities: getSettingsResponseDO = new AmenitySettingDO(); break;
            case SettingType.Countries: getSettingsResponseDO = new CountrySettingDO(); break;
            case SettingType.CurrencyCodes: getSettingsResponseDO = new CurrencySettingDO(); break;
            case SettingType.PaymentMethods: getSettingsResponseDO = new PaymentMethodSettingDO(); break;
            default: getSettingsResponseDO = new AmenitySettingDO();
        }
        getSettingsResponseDO.buildFromObject(queryResult);
        return getSettingsResponseDO["value"];
    }
}