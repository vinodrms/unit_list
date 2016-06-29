import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import {AppContext, ThServerApi, ThError} from '../../../../../../../../../common/utils/AppContext';
import {ASinglePageRequestService} from '../../../../../../../services/common/ASinglePageRequestService';
import {BookingSearchResultDO} from './data-objects/BookingSearchResultDO';
import {BookingSearchParams} from '../data-objects/BookingSearchParams';
import {BookingResultVM} from './view-models/BookingResultVM';
import {BookingViewModelConverter} from './utils/BookingViewModelConverter';

@Injectable()
export class BookingSearchService extends ASinglePageRequestService<BookingResultVM> {
    private _bookingViewModelConverter: BookingViewModelConverter;

    private _searchParams: BookingSearchParams;
    private _bookingResultVMList: BookingResultVM[];

    constructor(private _appContext: AppContext) {
        super();
        this._bookingViewModelConverter = new BookingViewModelConverter(_appContext.thTranslation);
    }

    protected getPageItemList(): Observable<BookingResultVM[]> {
        if (!this._searchParams) {
            return this.returnEmptyResult();
        }
        return this.returnObservableWith(this._bookingResultVMList);
    }
    private returnEmptyResult(): Observable<BookingResultVM[]> {
        return this.returnObservableWith([]);
    }
    private returnObservableWith(bookingResultVMList: BookingResultVM[]): Observable<BookingResultVM[]> {
        return new Observable<BookingResultVM[]>((serviceObserver: Observer<BookingResultVM[]>) => {
            serviceObserver.next(bookingResultVMList);
        });
    }

    public searchBookings(searchParams: BookingSearchParams) {
        this._searchParams = searchParams;

        this._appContext.thHttp.post(ThServerApi.BookingsSearch, { searchParams: searchParams })
            .map((resultObject: Object) => {
                var searchResult = new BookingSearchResultDO();
                searchResult.buildFromObject(resultObject["searchResult"]);
                return searchResult;
            })
            .map((bookingSearchResult: BookingSearchResultDO) => {
                return this._bookingViewModelConverter.convertSearchResultToVMList(bookingSearchResult, this._searchParams);
            })
            .subscribe((bookingResultVMList: BookingResultVM[]) => {
                this.bookingResultVMList = bookingResultVMList;
            }, (error: ThError) => {
                this._appContext.toaster.error(error.message);
            });
    }

    public get bookingResultVMList(): BookingResultVM[] {
        return this._bookingResultVMList;
    }
    public set bookingResultVMList(bookingResultVMList: BookingResultVM[]) {
        this._bookingResultVMList = bookingResultVMList;
        this.refreshData();
    }
}