import {RoomsService} from '../../rooms/RoomsService';
import {HotelOperationsDashboardArrivalsService} from './arrivals/HotelOperationsDashboardArrivalsService';
import {HotelOperationsDashboardDeparturesService} from './departures/HotelOperationsDashboardDeparturesService';
import {HotelOperationsDashboardRoomsService} from './rooms/HotelOperationsDashboardRoomsService';
import {HotelOperationsDashboardService} from './HotelOperationsDashboardService';

export const HOTEL_OPERATIONS_DASHBOARD_PROVIDERS: any[] = [
    RoomsService,
    HotelOperationsDashboardArrivalsService,
    HotelOperationsDashboardDeparturesService,
    HotelOperationsDashboardRoomsService,
    HotelOperationsDashboardService
];