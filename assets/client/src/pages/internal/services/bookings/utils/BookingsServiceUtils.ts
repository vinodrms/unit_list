import { EagerCustomersService } from "../../customers/EagerCustomersService";
import { HotelAggregatorService } from "../../hotel/HotelAggregatorService";
import { RoomCategoriesService } from "../../room-categories/RoomCategoriesService";
import { BookingsDO } from "../data-objects/BookingsDO";
import { Observable } from "rxjs/Observable";
import { CustomersDO } from "../../customers/data-objects/CustomersDO";
import { HotelAggregatedInfo } from "../../hotel/utils/HotelAggregatedInfo";
import { RoomCategoryDO } from "../../room-categories/data-objects/RoomCategoryDO";
import { BookingVM } from "../view-models/BookingVM";
import { BookingDO } from "../data-objects/BookingDO";
import { AppContext } from "../../../../../common/utils/AppContext";
import { BookingMetaFactory } from "../data-objects/BookingMetaFactory";

import * as _ from "underscore";

export class BookingsServiceUtils {
    private _bookingMetaFactory: BookingMetaFactory;
    
    constructor(private _appContext: AppContext, private _eagerCustomersService: EagerCustomersService,
        private _hotelAggregatorService: HotelAggregatorService,
        private _roomCategoriesService: RoomCategoriesService) {
        
        this._bookingMetaFactory = new BookingMetaFactory();
    }

    public buildBookingVMListFromBookingList(bookings: BookingsDO): Observable<BookingVM[]> {
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
                bookingVM.totalPriceString = booking.price.totalBookingPrice + bookingVM.ccy.nativeSymbol;
                bookingVM.conditionsString = booking.priceProductSnapshot.conditions.getCancellationConditionsString(this._appContext.thTranslation);
                bookingVM.constraintsString = booking.priceProductSnapshot.constraints.getBriefValueDisplayString(this._appContext.thTranslation);
                bookingVM.customerNameString = customers.getCustomerById(booking.displayCustomerId).customerName;

                bookingVMList.push(bookingVM);
            });
            return bookingVMList;
        });
    }
}