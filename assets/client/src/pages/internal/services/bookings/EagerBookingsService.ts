import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { AppContext, ThServerApi } from '../../../../common/utils/AppContext';
import { BookingDO } from './data-objects/BookingDO';
import { BookingDOConstraints } from './data-objects/BookingDOConstraints';
import { BookingsDO } from './data-objects/BookingsDO';
import { RoomCategoriesService } from "../room-categories/RoomCategoriesService";
import { HotelAggregatorService } from "../hotel/HotelAggregatorService";
import { EagerCustomersService } from "../customers/EagerCustomersService";
import { BookingsServiceUtils } from "./utils/BookingsServiceUtils";
import { Observable } from "rxjs/Observable";
import { BookingVM } from "./view-models/BookingVM";

@Injectable()
export class EagerBookingsService {

    constructor(private _appContext: AppContext, private _eagerCustomersService: EagerCustomersService,
        private _hotelAggregatorService: HotelAggregatorService, private _roomCategoriesService: RoomCategoriesService) {
    }

    public getBooking(groupBookingId: string, bookingId: string): Observable<BookingDO> {
        return this._appContext.thHttp.get({
            serverApi: ThServerApi.BookingsItem,
            queryParameters: {
                groupBookingId: groupBookingId,
                bookingId: bookingId
            }
        }).map((bookingObject: Object) => {
            var bookingDO = new BookingDO();
            bookingDO.buildFromObject(bookingObject["booking"]);
            return bookingDO;
        });
    }

    public getCheckedInBookings(): Observable<BookingsDO> {
        return this._appContext.thHttp.post({
            serverApi: ThServerApi.Bookings,
            body: JSON.stringify({
                searchCriteria: {
                    confirmationStatusList: BookingDOConstraints.ConfirmationStatuses_CheckedId
                }
            })
        }).map((bookingsObject: Object) => {
            var bookings = new BookingsDO();
            bookings.buildFromObject(bookingsObject);
            return bookings;
        });
    }

    public getBookingsByGroupBookingId(groupBookingId: string): Observable<BookingsDO> {
        return this._appContext.thHttp.post({
            serverApi: ThServerApi.Bookings,
            body: JSON.stringify({
                searchCriteria: {
                    groupBookingId: groupBookingId
                }
            })
        }).map((bookingsObject: Object) => {
            var bookings = new BookingsDO();
            bookings.buildFromObject(bookingsObject);
            return bookings;
        });
    }

    public getBookingVMListByGroupBookingId(groupBookingId: string): Observable<BookingVM[]> {
        return this.getBookingsByGroupBookingId(groupBookingId).flatMap((bookings: BookingsDO) => {
            let bookingsServiceUtils = new BookingsServiceUtils(this._appContext, this._eagerCustomersService,
                this._hotelAggregatorService, this._roomCategoriesService);

            return bookingsServiceUtils.buildBookingVMListFromBookingList(bookings);
        }).map((bookingVMList: BookingVM[]) => {
            return bookingVMList;
        });
    }
}