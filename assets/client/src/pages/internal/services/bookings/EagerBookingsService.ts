import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {AppContext, ThServerApi} from '../../../../common/utils/AppContext';
import {BookingDO} from './data-objects/BookingDO';
import {BookingDOConstraints} from './data-objects/BookingDOConstraints';
import {BookingsDO} from './data-objects/BookingsDO';

@Injectable()
export class EagerBookingsService {

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

    public getCheckedInBookings(): Observable<BookingsDO> {
        return this._appContext.thHttp.post(ThServerApi.Bookings, {
            searchCriteria: {
                confirmationStatusList: BookingDOConstraints.ConfirmationStatuses_CheckedId
            }
        }).map((bookingsObject: Object) => {
            var bookings = new BookingsDO();
            bookings.buildFromObject(bookingsObject);
            return bookings;
        });
    }
}