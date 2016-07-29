import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/combineLatest';
import {ThError, AppContext} from '../../../../../../../../../../../../common/utils/AppContext';
import {EagerBookingsService} from '../../../../../../../../../../services/bookings/EagerBookingsService';
import {BookingDO} from '../../../../../../../../../../services/bookings/data-objects/BookingDO';
import {HotelAggregatorService} from '../../../../../../../../../../services/hotel/HotelAggregatorService';
import {HotelAggregatedInfo} from '../../../../../../../../../../services/hotel/utils/HotelAggregatedInfo';
import {RoomCategoriesStatsService} from '../../../../../../../../../../services/room-categories/RoomCategoriesStatsService';
import {RoomCategoryStatsDO} from '../../../../../../../../../../services/room-categories/data-objects/RoomCategoryStatsDO';
import {RoomsService} from '../../../../../../../../../../services/rooms/RoomsService';
import {RoomVM} from '../../../../../../../../../../services/rooms/view-models/RoomVM';
import {EagerCustomersService} from '../../../../../../../../../../services/customers/EagerCustomersService';
import {EagerAllotmentsService} from '../../../../../../../../../../services/allotments/EagerAllotmentsService';
import {AllotmentDO} from '../../../../../../../../../../services/allotments/data-objects/AllotmentDO';
import {CustomersDO} from '../../../../../../../../../../services/customers/data-objects/CustomersDO';
import {BookingOperationsPageData} from './utils/BookingOperationsPageData';
import {HotelBookingOperationsPageParam} from '../utils/HotelBookingOperationsPageParam';

@Injectable()
export class BookingOperationsPageService {

    constructor(private _appContext: AppContext,
        private _eagerBookingsService: EagerBookingsService,
        private _hotelAggregatorService: HotelAggregatorService,
        private _roomCategoriesStatsService: RoomCategoriesStatsService,
        private _roomsService: RoomsService,
        private _eagerCustomersService: EagerCustomersService,
        private _eagerAllotmentsService: EagerAllotmentsService) {
    }


    public getPageData(pageParam: HotelBookingOperationsPageParam): Observable<BookingOperationsPageData> {
        return Observable.combineLatest(
            this._eagerBookingsService.getBooking(pageParam.groupBookingId, pageParam.bookingId),
            this._hotelAggregatorService.getHotelAggregatedInfo()
        ).flatMap((result: [BookingDO, HotelAggregatedInfo]) => {
            var pageData = new BookingOperationsPageData();
            pageData.bookingDO = result[0];
            pageData.ccy = result[1].ccy;
            pageData.allowedPaymentMethods = result[1].allowedPaymentMethods;
            pageData.allPaymentMethods = result[1].paymentMethods;
            pageData.operationHours = result[1].hotelDetails.hotel.operationHours;

            return Observable.combineLatest(
                Observable.from([pageData]),
                this._eagerCustomersService.getCustomersById(pageData.bookingDO.customerIdList),
                this.getAttachedRoom(pageData.bookingDO),
                this._roomCategoriesStatsService.getRoomCategoryStatsForRoomCategoryId(pageData.bookingDO.roomCategoryId),
                this.getAttachedAllotment(pageData.bookingDO)
            );
        }).map((result: [BookingOperationsPageData, CustomersDO, RoomVM, RoomCategoryStatsDO, AllotmentDO]) => {
            var pageData = result[0];
            pageData.customersContainer = result[1];
            pageData.roomVM = result[2];
            pageData.roomCategoryStats = result[3];
            pageData.allotmentDO = result[4];
            return pageData;
        });
    }

    private getAttachedRoom(bookingDO: BookingDO): Observable<RoomVM> {
        if (this._appContext.thUtils.isUndefinedOrNull(bookingDO.roomId) || !_.isString(bookingDO.roomId)) {
            return Observable.from([new RoomVM()]);
        }
        return this._roomsService.getRoomById(bookingDO.roomId);
    }
    private getAttachedAllotment(booking: BookingDO): Observable<AllotmentDO> {
        if (!booking.isMadeThroughAllotment()) {
            return Observable.from([new AllotmentDO()]);
        }
        return this._eagerAllotmentsService.getAllotmentById(booking.allotmentId);
    }
}