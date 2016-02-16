import {SettingType} from '../data-objects/common/SettingMetadataDO';
import {AmenityDO} from '../../common/data-objects/amenity/AmenityDO';
import {CountryDO} from '../../common/data-objects/country/CountryDO';
import {CurrencyDO} from '../../common/data-objects/currency/CurrencyDO';
import {PaymentMethodDO} from '../../common/data-objects/payment-method/PaymentMethodDO';

export interface AmenitySearchCriteriaDO {
    id?: string;
}

export interface CountrySearchCriteriaDO {
    code?: string;
}

export interface CurrencySearchCriteriaDO {
    code?: string;
}

export interface PaymentMethodSearchCriteriaDO {
    id?: string;
}

export interface ISettingsRepository {

    getAmenities(valueCriteria?: AmenitySearchCriteriaDO): Promise<AmenityDO[]>;

    getCountriesAsync(finishQueryCallback: { (err: any, country?: CountryDO[]): void; }, valueCriteria?: Object);
	getCountries(valueCriteria?: CountrySearchCriteriaDO): Promise<CountryDO[]>;

	getCurrenciesAsync(getCurrenciesCallback: { (err: any, currencyList?: CurrencyDO[]): void; }, valueCriteria?: CurrencySearchCriteriaDO);
    getCurrencies(valueCriteria?: CurrencySearchCriteriaDO): Promise<CurrencyDO[]>;

    getPaymentMethodsAsync(getPaymentMethodsCallback: { (err: any, paymentMethods?: PaymentMethodDO[]): void; }, valueCriteria?: PaymentMethodSearchCriteriaDO);
	getPaymentMethods(valueCriteria?: PaymentMethodSearchCriteriaDO): Promise<PaymentMethodDO[]>;
}