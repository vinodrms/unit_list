import {ThUtils} from '../../../../../utils/ThUtils';
import {BookingDO} from '../../../../../data-layer/bookings/data-objects/BookingDO';
import {HotelOperationsRoomInfo, RoomItemInfo, RoomItemStatus} from './HotelOperationsRoomInfo';
import {CustomersContainer} from '../../../../customers/validators/results/CustomersContainer';

import _ = require('underscore');

export class HotelOperationsRoomInfoBuilder {
    private _thUtils: ThUtils;
    private _roomInfo: HotelOperationsRoomInfo;

    constructor() {
        this._thUtils = new ThUtils();
        this._roomInfo = new HotelOperationsRoomInfo();
    }

    public appendCheckedInBookingList(bookingList: BookingDO[]) {
        this.appendBookingList(bookingList, RoomItemStatus.Occupied);
    }
    public appendCanBeCheckedInBookingList(bookingList: BookingDO[]) {
        this.appendBookingList(bookingList, RoomItemStatus.Reserved);
    }

    private appendBookingList(bookingList: BookingDO[], itemStatus: RoomItemStatus) {
        _.forEach(bookingList, (booking: BookingDO) => {
            this.appendInformationFromBooking(booking, itemStatus);
        });
    }
    private appendInformationFromBooking(booking: BookingDO, roomItemStatus: RoomItemStatus) {
        if (this._thUtils.isUndefinedOrNull(booking.roomId) || !_.isString(booking.roomId)) {
            return;
        }
        if (this.containsInformationForRoomId(booking.roomId)) {
            return;
        }
        var roomItemInfo = this.buildRoomItemInfoFor(booking, roomItemStatus);
        this._roomInfo.roomInfoList.push(roomItemInfo);
    }
    private containsInformationForRoomId(roomId: string): boolean {
        var foundRoomItemInfo = _.find(this._roomInfo.roomInfoList, (roomItem: RoomItemInfo) => {
            return roomItem.roomId === roomId;
        });
        return !this._thUtils.isUndefinedOrNull(foundRoomItemInfo);
    }
    private buildRoomItemInfoFor(booking: BookingDO, roomItemStatus: RoomItemStatus): RoomItemInfo {
        return {
            roomId: booking.roomId,
            roomStatus: roomItemStatus,
            customerId: booking.displayCustomerId,
            bookingId: booking.bookingId,
            groupBookingId: booking.groupBookingId,
            bookingInterval: booking.interval,
            bookingCapacity: booking.configCapacity,
            needsRollawayBeds: booking.needsRollawayBeds
        }
    }

    public getCustomerIdList(): string[] {
        var customerIdList = _.map(this._roomInfo.roomInfoList, (roomInfoItem: RoomItemInfo) => { return roomInfoItem.customerId });
        return _.uniq(customerIdList);
    }
    public appendCustomerInformation(customersContainer: CustomersContainer) {
        _.forEach(this._roomInfo.roomInfoList, (roomInfoItem: RoomItemInfo) => {
            var customer = customersContainer.getCustomerById(roomInfoItem.customerId);
            roomInfoItem.customerName = customer.customerDetails.getName();
        });
    }

    public getBuiltHotelOperationsRoomInfo(): HotelOperationsRoomInfo {
        return this._roomInfo;
    }
}