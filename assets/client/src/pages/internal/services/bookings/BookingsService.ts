import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/combineLatest';
import {AppContext, ThServerApi} from '../../../../common/utils/AppContext';
import {ALazyLoadRequestService} from '../common/ALazyLoadRequestService';
import {ThDateIntervalDO} from '../common/data-objects/th-dates/ThDateIntervalDO';
import {ThDateUtils} from '../common/data-objects/th-dates/ThDateUtils';
import {BookingDO} from './data-objects/BookingDO';
import {BookingsDO} from './data-objects/BookingsDO';
import {BookingVM} from './view-models/BookingVM';
import {EagerCustomersService} from '../customers/EagerCustomersService';
import {CustomersDO} from '../customers/data-objects/CustomersDO';
import {HotelAggregatorService} from '../hotel/HotelAggregatorService';
import {HotelAggregatedInfo} from '../hotel/utils/HotelAggregatedInfo';
import {RoomCategoriesService} from '../room-categories/RoomCategoriesService';
import {RoomCategoryDO} from '../room-categories/data-objects/RoomCategoryDO';
import {BookingMetaFactory} from './data-objects/BookingMetaFactory';

@Injectable()
export class BookingsService extends ALazyLoadRequestService<BookingVM> {
    public static DefaultDayOffset = 60;
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

    protected parsePageDataCore(pageDataObject: Object): Observable<BookingVM[]> {
        var bookings = new BookingsDO();
        bookings.buildFromObject(pageDataObject);
        var customerIdList: string[] = bookings.getUniqueCustomerIdList();

        return Observable.combineLatest(
            this._eagerCustomersService.getCustomersById(customerIdList),
            this._hotelAggregatorService.getHotelAggregatedInfo(),
            this._roomCategoriesService.getRoomCategoryList()
        ).map((result: [CustomersDO, HotelAggregatedInfo, RoomCategoryDO[]]) => {
            var customers: CustomersDO = result[0];
            var hotelInfo: HotelAggregatedInfo = result[1];
            var roomCategoryList: RoomCategoryDO[] = result[2];

            var bookingVMList: BookingVM[] = [];
            _.forEach(bookings.bookingList, (booking: BookingDO) => {
                var bookingVM = new BookingVM(this._appContext.thTranslation);
                bookingVM.booking = booking;
                bookingVM.customerList = [];
                _.forEach(booking.customerIdList, (customerId: string) => {
                    bookingVM.customerList.push(customers.getCustomerById(customerId));
                });
                bookingVM.ccy = hotelInfo.ccy;
                bookingVM.roomCategory = _.find(roomCategoryList, (roomCategory: RoomCategoryDO) => {
                    return roomCategory.id === booking.roomCategoryId;
                });
                bookingVM.bookingMeta = this._bookingMetaFactory.getBookingMetaByStatus(booking.confirmationStatus);
                bookingVM.totalPriceString = booking.price.totalPrice + bookingVM.ccy.nativeSymbol;
                bookingVM.conditionsString = booking.priceProductSnapshot.conditions.getCancellationConditionsString(this._appContext.thTranslation);
                bookingVM.constraintsString = booking.priceProductSnapshot.constraints.getBriefValueDisplayString(this._appContext.thTranslation);
                bookingVM.customerNameString = customers.getCustomerById(booking.defaultBillingDetails.customerId).customerName;

                bookingVMList.push(bookingVM);
            });
            return bookingVMList;
        });
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