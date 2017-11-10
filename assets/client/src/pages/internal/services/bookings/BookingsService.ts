import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/combineLatest';
import { AppContext, ThServerApi } from '../../../../common/utils/AppContext';
import { ALazyLoadRequestService } from '../common/ALazyLoadRequestService';
import { ThDateIntervalDO } from '../common/data-objects/th-dates/ThDateIntervalDO';
import { ThDateUtils } from '../common/data-objects/th-dates/ThDateUtils';
import { BookingDO } from './data-objects/BookingDO';
import { BookingsDO } from './data-objects/BookingsDO';
import { BookingVM } from './view-models/BookingVM';
import { EagerCustomersService } from '../customers/EagerCustomersService';
import { CustomersDO } from '../customers/data-objects/CustomersDO';
import { HotelAggregatorService } from '../hotel/HotelAggregatorService';
import { HotelAggregatedInfo } from '../hotel/utils/HotelAggregatedInfo';
import { RoomCategoriesService } from '../room-categories/RoomCategoriesService';
import { RoomCategoryDO } from '../room-categories/data-objects/RoomCategoryDO';
import { BookingMetaFactory } from './data-objects/BookingMetaFactory';
import { BookingsServiceUtils } from "./utils/BookingsServiceUtils";

@Injectable()
export class BookingsService extends ALazyLoadRequestService<BookingVM> {
    public static DefaultDayOffset = 3650;
    private _bookingMetaFactory: BookingMetaFactory;

    private _interval: ThDateIntervalDO;

    constructor(appContext: AppContext,
        private _eagerCustomersService: EagerCustomersService,
        private _hotelAggregatorService: HotelAggregatorService,
        private _roomCategoriesService: RoomCategoriesService) {
        super(appContext, ThServerApi.BookingsCount, ThServerApi.Bookings);
        this._bookingMetaFactory = new BookingMetaFactory();
        this.buildDefaultSearchInterval();
        this.defaultSearchCriteria = { interval: this._interval };
    }
    private buildDefaultSearchInterval() {
        var dateUtils = new ThDateUtils(); 
        this._interval = dateUtils.getTodayToTomorrowInterval();
        this._interval.end = dateUtils.addDaysToThDateDO(this._interval.end, BookingsService.DefaultDayOffset);
    }
    public setCustomerIdFilter(customerId: string) {
        this.defaultSearchCriteria = { customerId: customerId, descendentSortOrder: true };
    }

    protected parsePageDataCore(pageDataObject: Object): Observable<BookingVM[]> {
        var bookings = new BookingsDO();
        bookings.buildFromObject(pageDataObject);

        let bookingsServiceUtils = new BookingsServiceUtils(this._appContext, this._eagerCustomersService, 
            this._hotelAggregatorService, this._roomCategoriesService);
        
        return bookingsServiceUtils.buildBookingVMListFromBookingList(bookings);
    }

    public searchByText(text: string) {
        this.updateSearchCriteria({
            searchTerm: text
        });
    }

    public get interval(): ThDateIntervalDO {
        return this._interval;
    }
    public set interval(interval: ThDateIntervalDO) {
        this._interval = interval;
        this.defaultSearchCriteria = { interval: this._interval };
        this.refreshData();
    }
}