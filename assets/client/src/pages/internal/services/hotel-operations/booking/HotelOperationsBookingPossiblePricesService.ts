import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {AppContext, ThServerApi} from '../../../../../common/utils/AppContext';
import {BookingDO} from '../../bookings/data-objects/BookingDO';
import {BookingPossiblePriceItemsDO} from './data-objects/BookingPossiblePriceItemsDO';

@Injectable()
export class HotelOperationsBookingPossiblePricesService {
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
}