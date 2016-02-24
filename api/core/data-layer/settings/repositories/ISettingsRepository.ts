import {SettingType} from '../data-objects/common/SettingMetadataDO';
import {AmenityDO} from '../../common/data-objects/amenity/AmenityDO';
import {BedTemplateDO} from '../../common/data-objects/bed-template/BedTemplateDO';
import {CountryDO} from '../../common/data-objects/country/CountryDO';
import {CurrencyDO} from '../../common/data-objects/currency/CurrencyDO';
import {PaymentMethodDO} from '../../common/data-objects/payment-method/PaymentMethodDO';

export interface AmenitySearchCriteriaRepoDO {
    id?: string;
}

export interface CountrySearchCriteriaRepoDO {
    code?: string;
}

export interface CurrencySearchCriteriaRepoDO {
    code?: string;
}

export interface PaymentMethodSearchCriteriaRepoDO {
    id?: string;
}

export interface ISettingsRepository {
    
    getBedTemplates(valueCriteria?: Object): Promise<BedTemplateDO[]>;
    
    getRoomAmenities(valueCriteria?: AmenitySearchCriteriaRepoDO): Promise<AmenityDO[]>;
	getHotelAmenities(valueCriteria?: AmenitySearchCriteriaRepoDO): Promise<AmenityDO[]>;

    getCountries(valueCriteria?: CountrySearchCriteriaRepoDO): Promise<CountryDO[]>;
    getCurrencies(valueCriteria?: CurrencySearchCriteriaRepoDO): Promise<CurrencyDO[]>;
    getPaymentMethods(valueCriteria?: PaymentMethodSearchCriteriaRepoDO): Promise<PaymentMethodDO[]>;
}