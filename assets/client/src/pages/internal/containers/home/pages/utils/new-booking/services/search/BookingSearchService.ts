import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import 'rxjs/add/observable/combineLatest';
import {AppContext, ThServerApi} from '../../../../../../../../../common/utils/AppContext';
import {SortOptions} from '../../../../../../../services/common/ILazyLoadRequestService';
import {ABookingService} from './ABookingService';
import {CurrencyDO} from '../../../../../../../services/common/data-objects/currency/CurrencyDO';
import {RoomCategoriesService} from '../../../../../../../services/room-categories/RoomCategoriesService';
import {RoomCategoryDO} from '../../../../../../../services/room-categories/data-objects/RoomCategoryDO';
import {HotelAggregatorService} from '../../../../../../../services/hotel/HotelAggregatorService';
import {HotelAggregatedInfo} from '../../../../../../../services/hotel/utils/HotelAggregatedInfo';
import {BookingSearchResultDO} from './data-objects/BookingSearchResultDO';
import {BookingSearchParams} from '../data-objects/BookingSearchParams';
import {BookingItemVM} from './view-models/BookingItemVM';
import {BookingViewModelConverter} from './utils/BookingViewModelConverter';
import {BookingViewModelSorter} from './utils/BookingViewModelSorter';
import {TransientBookingItem} from '../data-objects/TransientBookingItem';

@Injectable()
export class BookingSearchService extends ABookingService {
    private _bookingViewModelConverter: BookingViewModelConverter;
    private _bookingViewModelSorter: BookingViewModelSorter;

    private _bookingSearchResult: BookingSearchResultDO;
    private _currency: CurrencyDO;

    private _searchParams: BookingSearchParams;
    private _sortOptions: SortOptions;

    constructor(private _appContext: AppContext, private _hotelAggregatorService: HotelAggregatorService, private _roomCategoriesService: RoomCategoriesService) {
        super();
        this._bookingViewModelConverter = new BookingViewModelConverter(_appContext.thTranslation);
        this._bookingViewModelSorter = new BookingViewModelSorter();
    }

    protected getPageItemList(): Observable<BookingItemVM[]> {
        if (!this._searchParams) {
            return this.returnEmptyResult();
        }
        return this.returnObservableWith(this._bookingItemVMList);
    }

    public searchBookings(searchParams: BookingSearchParams): Observable<{ roomCategoryList: RoomCategoryDO[], bookingItemList: BookingItemVM[] }> {
        this._searchParams = searchParams.buildPrototype();
        this._sortOptions = null;

        return Observable.combineLatest(
            this._hotelAggregatorService.getHotelAggregatedInfo(),
            this.searchBookingsCore(searchParams),
            this._roomCategoriesService.getRoomCategoryList()
        ).map((result: [HotelAggregatedInfo, BookingSearchResultDO, RoomCategoryDO[]]) => {
            this._currency = result[0].ccy;
            this._bookingSearchResult = result[1];
            var roomCategoryList: RoomCategoryDO[] = result[2];

            this.bookingItemVMList = this._bookingViewModelConverter.convertSearchResultToVMList(this._bookingSearchResult, this._searchParams, this._currency);

            return {
                roomCategoryList: roomCategoryList,
                bookingItemList: this.bookingItemVMList
            }
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

    public sort(sortOptions: SortOptions) {
        this._sortOptions = sortOptions;
        this.bookingItemVMList = this._bookingViewModelSorter.sortBookingSearchResultsBy(this._bookingItemVMList, sortOptions);
    }
    public getSortedOptions(): SortOptions {
        return this._sortOptions;
    }

    public decrementInventoryAvailability(transientBookingItem: TransientBookingItem) {
        if (!this._bookingSearchResult) {
            return;
        }
        this._bookingSearchResult.decrementAvailability(transientBookingItem.roomCategoryId, transientBookingItem.allotmentId);
        var newBookingVMList = this._bookingViewModelConverter.convertSearchResultToVMList(this._bookingSearchResult, this._searchParams, this._currency);
        if(this._sortOptions) {
            newBookingVMList = this._bookingViewModelSorter.sortBookingSearchResultsBy(newBookingVMList, this._sortOptions);
        }
        this.bookingItemVMList = newBookingVMList;
    }
}