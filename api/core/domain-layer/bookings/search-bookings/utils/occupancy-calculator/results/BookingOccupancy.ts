import {ThUtils} from '../../../../../../utils/ThUtils';
import {RoomDO} from '../../../../../../data-layer/rooms/data-objects/RoomDO';
import {BookingDO} from '../../../../../../data-layer/bookings/data-objects/BookingDO';
import {IBookingOccupancy} from './IBookingOccupancy';
import {BookingOccupancyDO} from './BookingOccupancyDO';
import {BookingUtils} from '../utils/BookingUtils';

import _ = require('underscore');

export class BookingOccupancy implements IBookingOccupancy {
    private _thUtils: ThUtils;
    private _bookingUtils: BookingUtils;

    indexedRoomCategoryIdOccupancy: { [id: string]: number; };
    indexedRoomIdOccupancy: { [id: string]: number; };
    indexedAllotmentIdOccupancy: { [id: string]: number; };

    constructor(private _indexedRoomsById: { [id: string]: RoomDO; }) {
        this._thUtils = new ThUtils();
        this._bookingUtils = new BookingUtils();

        this.indexedRoomCategoryIdOccupancy = {};
        this.indexedRoomIdOccupancy = {};
        this.indexedAllotmentIdOccupancy = {};
    }

    public initializeFromBookings(bookingList: BookingDO[]) {
        this.indexedRoomCategoryIdOccupancy = _.countBy(bookingList, (booking: BookingDO) => {
            if (this._thUtils.isUndefinedOrNull(booking.roomId) || !_.isString(booking.roomId)) {
                return this._bookingUtils.transformToEmptyStringIfNull(booking.roomCategoryId);
            }
            var actualRoom: RoomDO = this._indexedRoomsById[booking.roomId];
            if (this._thUtils.isUndefinedOrNull(actualRoom)) {
                return this._bookingUtils.transformToEmptyStringIfNull(booking.roomCategoryId);
            }
            return actualRoom.categoryId;
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
    public getBookingOccupancyDO(): BookingOccupancyDO {
        var occupancyDO = new BookingOccupancyDO();
        occupancyDO.indexedAllotmentIdOccupancy = this.indexedAllotmentIdOccupancy;
        occupancyDO.indexedRoomCategoryIdOccupancy = this.indexedRoomCategoryIdOccupancy;
        occupancyDO.indexedRoomIdOccupancy = this.indexedRoomIdOccupancy;
        return occupancyDO;
    }
}