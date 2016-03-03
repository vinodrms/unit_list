import {ThLogger, ThLogLevel} from '../../../../utils/logging/ThLogger';
import {ThError} from '../../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../../utils/th-responses/ThResponse';
import {ISettingsRepository} from '../ISettingsRepository';
import {MongoRepository, MongoErrorCodes} from '../../../common/base/MongoRepository';
import {AmenitySettingDO} from '../../data-objects/amenity/AmenitySettingDO';
import {CountrySettingDO} from '../../data-objects/country/CountrySettingDO';
import {CurrencySettingDO} from '../../data-objects/currency/CurrencySettingDO';
import {PaymentMethodSettingDO} from '../../data-objects/payment-method/PaymentMethodSettingDO';
import {RoomAttributeSettingDO} from '../../data-objects/room-attribute/RoomAttributeSettingDO';
import {SettingType} from '../../data-objects/common/SettingMetadataDO';
import {BaseDO} from '../../../common/base/BaseDO';
import {AmenityDO} from '../../../common/data-objects/amenity/AmenityDO';
import {BedTemplateDO} from '../../../common/data-objects/bed-template/BedTemplateDO';
import {CountryDO} from '../../../common/data-objects/country/CountryDO';
import {CurrencyDO} from '../../../common/data-objects/currency/CurrencyDO';
import {RoomAttributeDO} from '../../../common/data-objects/room-attribute/RoomAttributeDO';
import {RoomTypeDO} from '../../../common/data-objects/room-type/RoomTypeDO';
import {RoomSalesCategoryDO} from '../../../common/data-objects/room-sales-category/RoomSalesCategoryDO';
import {PaymentMethodDO} from '../../../common/data-objects/payment-method/PaymentMethodDO';
import {AddOnProductCategorySettingDO} from '../../data-objects/add-on-product/AddOnProductCategorySettingDO';
import {AddOnProductCategoryDO} from '../../../common/data-objects/add-on-product/AddOnProductCategoryDO';

import _ = require('underscore');

export class MongoSettingsRepository extends MongoRepository implements ISettingsRepository {
    constructor() {
        super(sails.models.settingsentity);
    }

    public addSettings(setting: Object): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.addSettingsCore(resolve, reject, setting);
        });
    }
    private addSettingsCore(resolve: { (result: boolean): void }, reject: { (err: ThError): void }, setting: Object) {
		this.createDocument(setting,
			(err: Error) => {
				var errorCode = this.getMongoErrorCode(err);
				if (errorCode == MongoErrorCodes.DuplicateKeyError) {
					var thError = new ThError(ThStatusCode.SettingsRepositoryAddDuplicateKeyError, err);
					ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "Setting already exists", setting, thError);
					reject(thError);
				}
				else {
					var thError = new ThError(ThStatusCode.SettingsRepositoryAddError, err);
					ThLogger.getInstance().logError(ThLogLevel.Error, "Error adding setting", setting, thError);
					reject(thError);
				}
			},
			(createdSetting: Object) => {
				resolve(true);
			}
		);
    }

    public getRoomAmenities(valueCriteria?: Object): Promise<AmenityDO[]> {
        return this.getSetting(SettingType.RoomAmenities, valueCriteria);
    }
    
    public getRoomAttributes(valueCriteria?: Object): Promise<RoomAttributeDO[]> {
        return this.getSetting(SettingType.RoomAttributes, valueCriteria);
    }
    
    public getRoomTypes(valueCriteria?: Object): Promise<RoomTypeDO[]> {
        return this.getSetting(SettingType.RoomTypes, valueCriteria);
    }
    
    public getRoomSalesCategories(valueCriteria?: Object): Promise<RoomSalesCategoryDO[]> {
        return this.getSetting(SettingType.RoomSalesCategories, valueCriteria);
    }
    
    public getHotelAmenities(valueCriteria?: Object): Promise<AmenityDO[]> {
        return this.getSetting(SettingType.HotelAmenities, valueCriteria);
    }

    public getBedTemplates(valueCriteria?: Object): Promise<BedTemplateDO[]> {
        return this.getSetting(SettingType.BedTemplates, valueCriteria);
    }

	public getCurrencies(valueCriteria?: Object): Promise<CurrencyDO[]> {
        return this.getSetting(SettingType.CurrencyCodes, valueCriteria);
    }

	public getCountries(valueCriteria?: Object): Promise<CountryDO[]> {
        return this.getSetting(SettingType.Countries, valueCriteria);
    }

    public getPaymentMethods(valueCriteria?: Object): Promise<PaymentMethodDO[]> {
        return this.getSetting(SettingType.PaymentMethods, valueCriteria);
    }

	public getAddOnProductCategories(valueCriteria?: Object): Promise<AddOnProductCategoryDO[]> {
		return this.getSetting(SettingType.AddOnProductCategory, valueCriteria);
	}

    private getSetting(settingType: SettingType, criteria?: Object): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.getSettingCore(settingType, criteria, resolve, reject);
        });
    }

    private getSettingCore(settingType: SettingType, criteria: Object, resolve: { (result: any): void }, reject: { (err: ThError): void }) {
		this.findOneDocument({ "metadata.type": settingType },
			() => {
				var thError = new ThError(ThStatusCode.SettingsRepositoryNotFound, null);
				ThLogger.getInstance().logBusiness(ThLogLevel.Error, "Setting not found", { settingType: settingType, criteria: criteria }, thError);
				reject(thError);
			},
			(err: Error) => {
				var thError = new ThError(ThStatusCode.SettingsMongoRepositoryReadError, err);
				ThLogger.getInstance().logError(ThLogLevel.Error, "Error retrieving setting.", { settingType: settingType, criteria: criteria }, thError);
				reject(thError);
			},
			(settingRead: Object) => {
				var resultDO = this.getSettingQueryResultDO(settingType, settingRead);
				if (criteria) {
					resultDO = _.where(resultDO, criteria);
				}
				resolve(resultDO);
			}
		);
    }

    private getSettingQueryResultDO(settingType: SettingType, queryResult: Object): BaseDO[] {
        var getSettingsResponseDO: BaseDO;
        switch (settingType) {
            case SettingType.RoomAmenities: getSettingsResponseDO = new AmenitySettingDO(); break;
            case SettingType.RoomAttributes: getSettingsResponseDO = new RoomAttributeSettingDO(); break;
            case SettingType.HotelAmenities: getSettingsResponseDO = new AmenitySettingDO(); break;
            case SettingType.Countries: getSettingsResponseDO = new CountrySettingDO(); break;
            case SettingType.CurrencyCodes: getSettingsResponseDO = new CurrencySettingDO(); break;
            case SettingType.PaymentMethods: getSettingsResponseDO = new PaymentMethodSettingDO(); break;
			case SettingType.AddOnProductCategory: getSettingsResponseDO = new AddOnProductCategorySettingDO(); break;
            default: getSettingsResponseDO = new AmenitySettingDO();
        }
        getSettingsResponseDO.buildFromObject(queryResult);
        return getSettingsResponseDO["value"];
    }
}