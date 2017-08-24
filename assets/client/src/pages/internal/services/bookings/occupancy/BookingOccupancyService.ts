import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { BookingOccupancyDO } from './data-objects/BookingOccupancyDO';
import { AppContext, ThServerApi } from '../../../../../common/utils/AppContext';
import { ThDateIntervalDO } from '../../common/data-objects/th-dates/ThDateIntervalDO';

@Injectable()
export class BookingOccupancyService {

    constructor(private _appContext: AppContext) { }

    public getBookingOccupancyFor(interval: ThDateIntervalDO, bookingIdToOmit?: string): Observable<BookingOccupancyDO> {
        return this._appContext.thHttp.post({
            serverApi: ThServerApi.BookingsOccupancy,
            parameters: {
                filters: {
                    interval: interval,
                    bookingIdToOmit: bookingIdToOmit
                }
            }
        }).map((occupancyObject: Object) => {
            var bookingOccupancyDO = new BookingOccupancyDO();
            bookingOccupancyDO.buildFromObject(occupancyObject["bookingOccupancy"]);
            return bookingOccupancyDO;
        });
    }
}