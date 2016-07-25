import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {AppContext, ThServerApi} from '../../../../../common/utils/AppContext';
import {BookingPossiblePriceItemsDO} from './data-objects/BookingPossiblePriceItemsDO';
import {BookingDO} from '../../bookings/data-objects/BookingDO';

@Injectable()
export class HotelOperationsBookingService {

    constructor(private _appContext: AppContext) {
    }

    public getPossiblePrices(groupBookingId: string, bookingId: string): Observable<BookingPossiblePriceItemsDO> {
        return this._appContext.thHttp.post(ThServerApi.HotelOperationsBookingPossiblePrices, {
            bookingReference: {
                groupBookingId: groupBookingId,
                bookingId: bookingId
            }
        }).map((possiblePricesObject: Object) => {
            var possiblePrices = new BookingPossiblePriceItemsDO();
            possiblePrices.buildFromObject(possiblePricesObject);
            return possiblePrices;
        });
    }

    public changeDates(booking: BookingDO): Observable<BookingDO> {
        return this._appContext.thHttp.get(ThServerApi.HotelOperationsBookingChangeDates, {
            booking: booking
        }).map((bookingObject: Object) => {
            var bookingDO = new BookingDO();
            bookingDO.buildFromObject(bookingObject["booking"]);
            return bookingDO;
        });
    }
}