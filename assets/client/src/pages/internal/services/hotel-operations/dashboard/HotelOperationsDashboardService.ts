import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {ThDateDO} from '../../common/data-objects/th-dates/ThDateDO';
import {HotelOperationsDashboardArrivalsService} from './arrivals/HotelOperationsDashboardArrivalsService';
import {ArrivalItemInfoVM} from './arrivals/view-models/ArrivalItemInfoVM';
import {HotelOperationsDashboardDeparturesService} from './departures/HotelOperationsDashboardDeparturesService';
import {DepartureItemInfoVM} from './departures/view-models/DepartureItemInfoVM';
import {HotelOperationsDashboardRoomsService} from './rooms/HotelOperationsDashboardRoomsService';
import {RoomsService} from '../../rooms/RoomsService';
import {RoomItemInfoVM} from './rooms/view-models/RoomItemInfoVM';

@Injectable()
export class HotelOperationsDashboardService {

    constructor(private _dashboardArrivalsService: HotelOperationsDashboardArrivalsService,
        private _dashboardDeparturesService: HotelOperationsDashboardDeparturesService,
        private _dashboardRoomsService: HotelOperationsDashboardRoomsService,
        private _roomsService: RoomsService) {
    }

    public getArrivalItems(referenceDate?: ThDateDO): Observable<ArrivalItemInfoVM[]> {
        if (!referenceDate) {
        }
        referenceDate = new ThDateDO();
        referenceDate.day = 18;
        referenceDate.month = 6;
        referenceDate.year = 2016;
        return this._dashboardArrivalsService.getArrivalItems(referenceDate);
    }
    public refreshArrivals() {
        this._dashboardArrivalsService.refresh();
    }

    public getDepartureItems(referenceDate?: ThDateDO): Observable<DepartureItemInfoVM[]> {
        referenceDate = new ThDateDO();
        referenceDate.day = 23;
        referenceDate.month = 6;
        referenceDate.year = 2016;
        return this._dashboardDeparturesService.getDepartureItems(referenceDate);
    }

    public refreshDepartures() {
        this._dashboardDeparturesService.refresh();
    }

    public getRoomItems(): Observable<RoomItemInfoVM[]> {
        return this._dashboardRoomsService.getRoomItems();
    }
    public refreshRooms() {
        this._roomsService.refresh();
        this._dashboardRoomsService.refresh();
    }
}