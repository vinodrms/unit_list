import { ReportArrivalItemInfo } from './ReportArrivalsInfo';
import { BookingDO } from '../../../../../data-layer/bookings/data-objects/BookingDO';
import { CustomersContainer } from '../../../../customers/validators/results/CustomersContainer';
import { ArrivalItemInfo } from '../../../../../../core/domain-layer/hotel-operations/dashboard/arrivals/utils/HotelOperationsArrivalsInfo';

import { BookingItemDO } from '../../../../../../core/domain-layer/bookings/add-bookings/AddBookingItemsDO';
import { RoomCategoryDO } from '../../../../../../core/data-layer/room-categories/data-objects/RoomCategoryDO';
import { RoomDO } from '../../../../../../core/data-layer/rooms/data-objects/RoomDO';


import _ = require('underscore');

export class ReportArrivalsItemInfoBuilder {
	private _arrivalInfo: ArrivalItemInfo;
	private _roomCategory: RoomCategoryDO;
	private _room: RoomDO;
	private _booking: BookingDO;

	constructor() {
	}

	public setArrivalsItemInfo(item: ArrivalItemInfo) {
		this._arrivalInfo = item;
	}

	public setRoomCategory(roomCategory: RoomCategoryDO) {
		this._roomCategory = roomCategory;
	}

	public setRoom(room: RoomDO) {
		this._room = room;
	}

	public setBooking(booking: BookingDO) {
		this._booking = booking;
	}

	build(): ReportArrivalItemInfo {
		var report: ReportArrivalItemInfo = {
			customerName: this._arrivalInfo.customerName,
			roomCategory: this._roomCategory ? this._roomCategory.displayName : null,
			roomNumber: this._room ? this._room.name : null,		// room[roomId].displayName -> make test to create bookings with reserver Room number
			noAdults: this._arrivalInfo.bookingCapacity ? this._arrivalInfo.bookingCapacity.noAdults : null,
			noChildren: this._arrivalInfo.bookingCapacity ? this._arrivalInfo.bookingCapacity.noChildren : null,
			noBabies: this._arrivalInfo.bookingCapacity ? this._arrivalInfo.bookingCapacity.noBabies : null,
			bookingStatus: this._arrivalInfo.bookingStatusDisplayString,
			totalPrice: this._arrivalInfo.totalBookingPrice,
			cancelationHours: this._arrivalInfo.showCancellationTimestamp ? this._arrivalInfo.cancellationTimestampDisplayString : "",
			notes: this._booking ? this._booking.notes : null
		}
		return report;
	}
}