import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import {AppContext, ThServerApi} from '../../../../../../../../../common/utils/AppContext';
import {BookingSearchResultDO} from './data-objects/BookingSearchResultDO';
import {BookingSearchParams} from '../data-objects/BookingSearchParams';

@Injectable()
export class EagerBookingSearch {
    constructor(private _appContext: AppContext) {
    }

    public searchBookings(searchParams: BookingSearchParams): Observable<BookingSearchResultDO> {
        return this._appContext.thHttp.post(ThServerApi.BookingsSearch, { searchParams: searchParams }).map((resultObject: Object) => {
            var searchResult = new BookingSearchResultDO();
            searchResult.buildFromObject(resultObject["searchResult"]);
            return searchResult;
        });
    }
}