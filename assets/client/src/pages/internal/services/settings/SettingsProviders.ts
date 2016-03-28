import {CountriesService} from './CountriesService';
import {HotelAmenitiesService} from './HotelAmenitiesService';
import {HotelPaymentMethodsService} from './HotelPaymentMethodsService';

export const SETTINGS_PROVIDERS: any[] = [
	CountriesService,
	HotelAmenitiesService,
	HotelPaymentMethodsService
];