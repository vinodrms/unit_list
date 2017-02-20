import { DefaultDataBuilder } from '../../../../../db-initializers/DefaultDataBuilder';
import { ThDateIntervalDO } from '../../../../../../core/utils/th-dates/data-objects/ThDateIntervalDO';
import { ThTimestampDO } from '../../../../../../core/utils/th-dates/data-objects/ThTimestampDO';
import { ThDateUtils } from '../../../../../../core/utils/th-dates/ThDateUtils';
import { HotelOperationsQueryDO } from '../../../../../../core/domain-layer/hotel-operations/dashboard/utils/HotelOperationsQueryDO';
import { AssignRoomDO } from '../../../../../../core/domain-layer/hotel-operations/room/assign/AssignRoomDO';
import { BookingDO } from '../../../../../../core/data-layer/bookings/data-objects/BookingDO';
import { RoomDO } from '../../../../../../core/data-layer/rooms/data-objects/RoomDO';

import _ = require('underscore');

export class HotelDashboardOperationsTestHelper {
    private _thDateUtils: ThDateUtils;

    constructor() {
        this._thDateUtils = new ThDateUtils();
    }

    public getTodayToTomorrowInterval(testDataBuilder: DefaultDataBuilder): ThDateIntervalDO {
        var thTimestamp = this.getTimestampForTimezone(testDataBuilder.hotelDO.timezone);
        var startDate = thTimestamp.thDateDO;
        var endDate = this._thDateUtils.addDaysToThDateDO(startDate.buildPrototype(), 1);
        return ThDateIntervalDO.buildThDateIntervalDO(startDate, endDate);
    }
    public getFromTodayTwoDaysInterval(testDataBuilder: DefaultDataBuilder): ThDateIntervalDO {
        var interval = this.getTodayToTomorrowInterval(testDataBuilder);
        interval.start = this._thDateUtils.addDaysToThDateDO(interval.start, 0);
        interval.end = this._thDateUtils.addDaysToThDateDO(interval.end, 1);
        return interval;
    }
    public getQueryForToday(testDataBuilder: DefaultDataBuilder): HotelOperationsQueryDO {
        var query = new HotelOperationsQueryDO();
        query.referenceDate = this.getTimestampForTimezone(testDataBuilder.hotelDO.timezone).thDateDO;
        return query;
    }
    public getQueryForTomorrow(testDataBuilder: DefaultDataBuilder): HotelOperationsQueryDO {
        var query = new HotelOperationsQueryDO();
        query.referenceDate = this._thDateUtils.addDaysToThDateDO(this.getTimestampForTimezone(testDataBuilder.hotelDO.timezone).thDateDO, 1);
        return query;
    }
    private getTimestampForTimezone(timezone: string): ThTimestampDO {
        return ThTimestampDO.buildThTimestampForTimezone(timezone);
    }

    public getRoomForSameRoomCategoryFromBooking(testDataBuilder: DefaultDataBuilder, booking: BookingDO): RoomDO {
        return _.find(testDataBuilder.roomList, (room: RoomDO) => { return room.categoryId === booking.roomCategoryId });
    }
}