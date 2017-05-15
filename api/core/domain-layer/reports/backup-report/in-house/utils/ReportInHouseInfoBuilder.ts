import { ReportInHouseItemInfo } from './ReportInHouseInfo';
import { BookingDO } from '../../../../../data-layer/bookings/data-objects/BookingDO';
import { CustomersContainer } from '../../../../customers/validators/results/CustomersContainer';
import { RoomItemInfo } from '../../../../../../core/domain-layer/hotel-operations/dashboard/room-info/utils/HotelOperationsRoomInfo';

import { BookingItemDO } from '../../../../../../core/domain-layer/bookings/add-bookings/AddBookingItemsDO';
import { RoomCategoryDO } from '../../../../../../core/data-layer/room-categories/data-objects/RoomCategoryDO';
import { RoomDO } from '../../../../../../core/data-layer/rooms/data-objects/RoomDO';

import _ = require('underscore');

export class ReportInHouseItemInfoBuilder {
	private _roomInfo: RoomItemInfo;
	private _room: RoomDO;
	private _booking: BookingDO;

	constructor() {
	}

	public setRoomItemInfo(item: RoomItemInfo) {
		this._roomInfo = item;
	}

	public setRoom(room: RoomDO) {
		this._room = room;
	}

	public setBooking(booking: BookingDO) {
		this._booking = booking;
	}

	build(): ReportInHouseItemInfo{
		var report: ReportInHouseItemInfo = {
			customerName: this._roomInfo.customerName,
			roomNumber: this._room ? this._room.name : null,		// room[roomId].displayName -> make test to create bookings with reserver Room number
			interval: this._roomInfo.bookingInterval ? this._roomInfo.bookingInterval.toString() : null,
			noNights: this._roomInfo.bookingInterval ? this._roomInfo.bookingInterval.getNumberOfDays() : null,
			noAdults: this._roomInfo.bookingCapacity ? this._roomInfo.bookingCapacity.noAdults: null,
			noChildren: this._roomInfo.bookingCapacity ? this._roomInfo.bookingCapacity.noChildren: null,
			noBabies: this._roomInfo.bookingCapacity ? this._roomInfo.bookingCapacity.noBabies: null,
			noBabyBeds: this._roomInfo.bookingCapacity ? this._roomInfo.bookingCapacity.noBabyBeds: null,
			notes: this._booking ? this._booking.notes : null
		}
		return report;
	}
}