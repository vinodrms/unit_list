import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {ThDateDO} from '../../common/data-objects/th-dates/ThDateDO';
import {HotelOperationsDashboardArrivalsService} from './arrivals/HotelOperationsDashboardArrivalsService';
import {ArrivalItemInfoVM} from './arrivals/view-models/ArrivalItemInfoVM';
import {HotelOperationsDashboardDeparturesService} from './departures/HotelOperationsDashboardDeparturesService';
import {DepartureItemInfoVM} from './departures/view-models/DepartureItemInfoVM';
import {HotelOperationsDashboardRoomsService} from './rooms/HotelOperationsDashboardRoomsService';
import {RoomItemInfoVM} from './rooms/view-models/RoomItemInfoVM';

@Injectable()
export class HotelOperationsDashboardService {

    constructor(private _arrivalsService: HotelOperationsDashboardArrivalsService,
        private _departuresService: HotelOperationsDashboardDeparturesService,
        private _roomsService: HotelOperationsDashboardRoomsService) {
    }

    public getArrivalItems(referenceDate?: ThDateDO): Observable<ArrivalItemInfoVM[]> {
        return this._arrivalsService.getArrivalItems(referenceDate);
    }
    public getDepartureItems(referenceDate?: ThDateDO): Observable<DepartureItemInfoVM[]> {
        return this._departuresService.getDepartureItems(referenceDate);
    }
    public getRoomItems(): Observable<RoomItemInfoVM[]> {
        return this._roomsService.getRoomItems();
    }
}