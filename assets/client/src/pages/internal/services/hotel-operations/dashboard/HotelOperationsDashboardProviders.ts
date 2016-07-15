import {HotelOperationsDashboardArrivalsService} from './arrivals/HotelOperationsDashboardArrivalsService';
import {HotelOperationsDashboardDeparturesService} from './departures/HotelOperationsDashboardDeparturesService';
import {HotelOperationsDashboardRoomsService} from './rooms/HotelOperationsDashboardRoomsService';
import {HotelOperationsDashboardService} from './HotelOperationsDashboardService';

export const HOTEL_OPERATIONS_PROVIDERS: any[] = [
    HotelOperationsDashboardArrivalsService,
    HotelOperationsDashboardDeparturesService,
    HotelOperationsDashboardRoomsService,
    HotelOperationsDashboardService
];