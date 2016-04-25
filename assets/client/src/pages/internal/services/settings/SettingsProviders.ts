import {CountriesService} from './CountriesService';
import {CurrenciesService} from './CurrenciesService';
import {HotelAmenitiesService} from './HotelAmenitiesService';
import {HotelPaymentMethodsService} from './HotelPaymentMethodsService';
import {BedTemplatesService} from './BedTemplatesService';
import {AddOnProductCategoriesService} from './AddOnProductCategoriesService';
import {RoomAmenitiesService} from './RoomAmenitiesService';
import {RoomAttributesService} from './RoomAttributesService';

export const SETTINGS_PROVIDERS: any[] = [
	CountriesService,
	CurrenciesService,
	HotelAmenitiesService,
	HotelPaymentMethodsService,
	AddOnProductCategoriesService,
    BedTemplatesService,
    RoomAmenitiesService,
    RoomAttributesService
];