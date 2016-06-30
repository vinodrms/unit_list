import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import 'rxjs/add/observable/combineLatest';
import {AppContext, ThServerApi} from '../../../../../../../../../common/utils/AppContext';
import {SortOptions} from '../../../../../../../services/common/ILazyLoadRequestService';
import {ASinglePageRequestService} from '../../../../../../../services/common/ASinglePageRequestService';
import {HotelAggregatorService} from '../../../../../../../services/hotel/HotelAggregatorService';
import {HotelAggregatedInfo} from '../../../../../../../services/hotel/utils/HotelAggregatedInfo';
import {BookingSearchResultDO} from './data-objects/BookingSearchResultDO';
import {BookingSearchParams} from '../data-objects/BookingSearchParams';
import {BookingResultVM} from './view-models/BookingResultVM';
import {BookingViewModelConverter} from './utils/BookingViewModelConverter';
import {BookingViewModelSorter} from './utils/BookingViewModelSorter';

@Injectable()
export class BookingSearchService extends ASinglePageRequestService<BookingResultVM> {
    private _bookingViewModelConverter: BookingViewModelConverter;
    private _bookingViewModelSorter: BookingViewModelSorter;

    private _searchParams: BookingSearchParams;
    private _bookingResultVMList: BookingResultVM[];
    private _sortOptions: SortOptions;

    constructor(private _appContext: AppContext, private _hotelAggregatorService: HotelAggregatorService) {
        super();
        this._bookingViewModelConverter = new BookingViewModelConverter(_appContext.thTranslation);
        this._bookingViewModelSorter = new BookingViewModelSorter();
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

    public searchBookings(searchParams: BookingSearchParams): Observable<BookingResultVM[]> {
        this._searchParams = searchParams;
        this._sortOptions = null;

        return Observable.combineLatest(
            this._hotelAggregatorService.getHotelAggregatedInfo(),
            this.searchBookingsCore(searchParams)
        ).map((result: [HotelAggregatedInfo, BookingSearchResultDO]) => {
            var hotelAggregatedInfo: HotelAggregatedInfo = result[0];
            var bookingSearchResult: BookingSearchResultDO = result[1];

            this.bookingResultVMList = this._bookingViewModelConverter.convertSearchResultToVMList(bookingSearchResult, this._searchParams, hotelAggregatedInfo.ccy);
            return this.bookingResultVMList;
        });
    }
    private searchBookingsCore(searchParams: BookingSearchParams): Observable<BookingSearchResultDO> {
        return this._appContext.thHttp.post(ThServerApi.BookingsSearch, { searchParams: searchParams })
            .map((resultObject: Object) => {
                var searchResult = new BookingSearchResultDO();
                searchResult.buildFromObject(resultObject["searchResult"]);
                return searchResult;
            });
    }

    public get bookingResultVMList(): BookingResultVM[] {
        return this._bookingResultVMList;
    }
    public set bookingResultVMList(bookingResultVMList: BookingResultVM[]) {
        this._bookingResultVMList = bookingResultVMList;
        this.refreshData();
    }

    public sort(sortOptions: SortOptions) {
        this._sortOptions = sortOptions;
        this.bookingResultVMList = this._bookingViewModelSorter.sortBookingSearchResultsBy(this._bookingResultVMList, sortOptions);
    }
    public getSortedOptions(): SortOptions {
        return this._sortOptions;
    }
}