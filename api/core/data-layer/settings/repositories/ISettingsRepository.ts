import {SettingType} from '../data-objects/common/SettingMetadataDO';
import {AmenityDO} from '../../common/data-objects/amenity/AmenityDO';
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
    getRoomAmenities(valueCriteria?: AmenitySearchCriteriaRepoDO): Promise<AmenityDO[]>;

    getHotelAmenitiesAsync(getAmenityListCallback: { (err: any, amenityList?: AmenityDO[]): void; }, valueCriteria?: AmenitySearchCriteriaRepoDO);
	getHotelAmenities(valueCriteria?: AmenitySearchCriteriaRepoDO): Promise<AmenityDO[]>;

	getCountriesAsync(finishQueryCallback: { (err: any, country?: CountryDO[]): void; }, valueCriteria?: Object);
    getCountries(valueCriteria?: CountrySearchCriteriaRepoDO): Promise<CountryDO[]>;

    getCurrencies(valueCriteria?: CurrencySearchCriteriaRepoDO): Promise<CurrencyDO[]>;

    getPaymentMethods(valueCriteria?: PaymentMethodSearchCriteriaRepoDO): Promise<PaymentMethodDO[]>;

    getCountriesAsync(finishQueryCallback: { (err: any, country?: CountryDO[]): void; }, valueCriteria?: Object);
	getCountries(valueCriteria?: CountrySearchCriteriaRepoDO): Promise<CountryDO[]>;

	getCurrenciesAsync(getCurrenciesCallback: { (err: any, currencyList?: CurrencyDO[]): void; }, valueCriteria?: CountrySearchCriteriaRepoDO);
    getCurrencies(valueCriteria?: CountrySearchCriteriaRepoDO): Promise<CurrencyDO[]>;

    getPaymentMethodsAsync(getPaymentMethodsCallback: { (err: any, paymentMethods?: PaymentMethodDO[]): void; }, valueCriteria?: PaymentMethodSearchCriteriaRepoDO);
	getPaymentMethods(valueCriteria?: CountrySearchCriteriaRepoDO): Promise<PaymentMethodDO[]>;
}