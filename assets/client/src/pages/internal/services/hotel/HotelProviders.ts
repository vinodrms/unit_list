import {HotelAmenitiesService} from '../settings/HotelAmenitiesService';
import {HotelPaymentMethodsService} from '../settings/HotelPaymentMethodsService';
import {HotelService} from './HotelService';
import {HotelAggregatorService} from './HotelAggregatorService';

export const HOTEL_AGGREGATOR_PROVIDERS: any[] = [
	HotelAmenitiesService,
	HotelPaymentMethodsService,
	HotelService,
	HotelAggregatorService
];