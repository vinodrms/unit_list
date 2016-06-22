import {ThUtils} from '../../../../../../utils/ThUtils';
import {BookingDO} from '../../../../../../data-layer/bookings/data-objects/BookingDO';
import {IBookingOccupancy} from './IBookingOccupancy';
import {BookingUtils} from '../utils/BookingUtils';

import _ = require('underscore');

export class BookingOccupancy implements IBookingOccupancy {
    private _thUtils: ThUtils;
    private _bookingUtils: BookingUtils;

    indexedRoomCategoryIdOccupancy: { [id: string]: number; };
    indexedRoomIdOccupancy: { [id: string]: number; };
    indexedAllotmentIdOccupancy: { [id: string]: number; };

    constructor() {
        this._thUtils = new ThUtils();
        this._bookingUtils = new BookingUtils();

        this.indexedRoomCategoryIdOccupancy = {};
        this.indexedRoomIdOccupancy = {};
        this.indexedAllotmentIdOccupancy = {};
    }

    public initializeFromBookings(bookingList: BookingDO[]) {
        this.indexedRoomCategoryIdOccupancy = _.countBy(bookingList, (booking: BookingDO) => {
            return this._bookingUtils.transformToEmptyStringIfNull(booking.roomCategoryId);
        });
        this.indexedRoomIdOccupancy = _.countBy(bookingList, (booking: BookingDO) => {
            return this._bookingUtils.transformToEmptyStringIfNull(booking.roomId);
        });
        this.indexedAllotmentIdOccupancy = _.countBy(bookingList, (booking: BookingDO) => {
            return this._bookingUtils.transformToEmptyStringIfNull(booking.allotmentId);
        });
    }

    public combineWith(otherBookingOccupancy: BookingOccupancy) {
        this.indexedRoomCategoryIdOccupancy = this._bookingUtils.combineIndexedOccupancies(this.indexedRoomCategoryIdOccupancy, otherBookingOccupancy.indexedRoomCategoryIdOccupancy);
        this.indexedRoomIdOccupancy = this._bookingUtils.combineIndexedOccupancies(this.indexedRoomIdOccupancy, otherBookingOccupancy.indexedRoomIdOccupancy);
        this.indexedAllotmentIdOccupancy = this._bookingUtils.combineIndexedOccupancies(this.indexedAllotmentIdOccupancy, otherBookingOccupancy.indexedAllotmentIdOccupancy);
    }

    public getOccupancyForRoomCategoryId(roomCategoryId: string): number {
        return this._bookingUtils.getOccupancyForObjectKey(roomCategoryId, this.indexedRoomCategoryIdOccupancy);
    }
    public getOccupancyForRoomId(roomId: string): number {
        return this._bookingUtils.getOccupancyForObjectKey(roomId, this.indexedRoomIdOccupancy);
    }
    public getOccupancyForAllotmentId(allotmentId: string): number {
        return this._bookingUtils.getOccupancyForObjectKey(allotmentId, this.indexedAllotmentIdOccupancy);
    }
}