import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {AppContext, ThServerApi} from '../../../../../common/utils/AppContext';
import {BookingDO} from '../../bookings/data-objects/BookingDO';

@Injectable()
export class HotelOperationsBookingService {

    constructor(private _appContext: AppContext) {
    }

    public getBooking(groupBookingId: string, bookingId: string): Observable<BookingDO> {
        return this._appContext.thHttp.get(ThServerApi.BookingsItem, {
            groupBookingId: groupBookingId,
            bookingId: bookingId
        }).map((bookingObject: Object) => {
            var bookingDO = new BookingDO();
            bookingDO.buildFromObject(bookingObject["booking"]);
            return bookingDO;
        });
    }
}