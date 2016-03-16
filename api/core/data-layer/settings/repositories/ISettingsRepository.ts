import {SettingType} from '../data-objects/common/SettingMetadataDO';
import {AmenityDO} from '../../common/data-objects/amenity/AmenityDO';
import {RoomAttributeDO} from '../../common/data-objects/room-attribute/RoomAttributeDO';
import {BedTemplateDO} from '../../common/data-objects/bed-template/BedTemplateDO';
import {CountryDO} from '../../common/data-objects/country/CountryDO';
import {CurrencyDO} from '../../common/data-objects/currency/CurrencyDO';
import {PaymentMethodDO} from '../../common/data-objects/payment-method/PaymentMethodDO';
import {AddOnProductCategoryDO} from '../../common/data-objects/add-on-product/AddOnProductCategoryDO';
import {YieldManagerFilterDO} from '../../common/data-objects/yield-manager-filter/YieldManagerFilterDO';

export interface AmenitySearchCriteriaRepoDO {
    id?: string;
}

export interface RoomAttributeSearchCriteriaRepoDO {
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

export interface AddOnProductCategoryCriteriaRepoDO {
    id?: string;
}

export interface ISettingsRepository {

    getBedTemplates(valueCriteria?: Object): Promise<BedTemplateDO[]>;

    getRoomAmenities(valueCriteria?: AmenitySearchCriteriaRepoDO): Promise<AmenityDO[]>;
    getRoomAttributes(valueCriteria?: RoomAttributeSearchCriteriaRepoDO): Promise<RoomAttributeDO[]>;
	getHotelAmenities(valueCriteria?: AmenitySearchCriteriaRepoDO): Promise<AmenityDO[]>;

    getCountries(valueCriteria?: CountrySearchCriteriaRepoDO): Promise<CountryDO[]>;
    getCurrencies(valueCriteria?: CurrencySearchCriteriaRepoDO): Promise<CurrencyDO[]>;
    getPaymentMethods(valueCriteria?: PaymentMethodSearchCriteriaRepoDO): Promise<PaymentMethodDO[]>;

	getAddOnProductCategories(valueCriteria?: AddOnProductCategoryCriteriaRepoDO): Promise<AddOnProductCategoryDO[]>;
    getDefaultYieldManagerFilters(): Promise<YieldManagerFilterDO[]>;
}