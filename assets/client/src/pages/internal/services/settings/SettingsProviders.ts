import {CountriesService} from './CountriesService';
import {CurrenciesService} from './CurrenciesService';
import {HotelAmenitiesService} from './HotelAmenitiesService';
import {HotelPaymentMethodsService} from './HotelPaymentMethodsService';
import {AddOnProductCategoriesService} from './AddOnProductCategoriesService';

export const SETTINGS_PROVIDERS: any[] = [
	CountriesService,
	CurrenciesService,
	HotelAmenitiesService,
	HotelPaymentMethodsService,
	AddOnProductCategoriesService
];