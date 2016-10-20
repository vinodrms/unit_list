import { ReportDepartureInfo } from './ReportDepartureInfo';
import { BookingDO } from '../../../../../data-layer/bookings/data-objects/BookingDO';
import { CustomersContainer } from '../../../../customers/validators/results/CustomersContainer';
import { DeparturelItemInfo } from '../../../../../../core/domain-layer/hotel-operations/dashboard/departures/utils/HotelOperationsDeparturesInfo';

import { BookingItemDO } from '../../../../../../core/domain-layer/bookings/add-bookings/AddBookingItemsDO';
import { RoomCategoryDO } from '../../../../../../core/data-layer/room-categories/data-objects/RoomCategoryDO';
import { RoomDO } from '../../../../../../core/data-layer/rooms/data-objects/RoomDO';

import _ = require('underscore');

export class ReportDepartureInfoBuilder {
	private _departureInfo: DeparturelItemInfo;
	private _room: RoomDO;
	private _booking: BookingDO;

	constructor() {
	}

	public setDepartureItemInfo(item: DeparturelItemInfo) {
		this._departureInfo = item;
	}

	public setRoom(room: RoomDO) {
		this._room = room;
	}

	public setBooking(booking: BookingDO) {
		this._booking = booking;
	}

	private defaults(value: any, defaultValue?: any) {
		return (value) ? value : (defaultValue) ? defaultValue : null;
	}

	build(): ReportDepartureInfo {
		var report: ReportDepartureInfo = {
			customerName: this._departureInfo.customerName,
			roomNumber: (this._room)? this._room.name : null,
			noAdults: (this._departureInfo.bookingCapacity) ? this._departureInfo.bookingCapacity.noAdults : null,
			noChildren: (this._departureInfo.bookingCapacity) ? this._departureInfo.bookingCapacity.noChildren : null,
			noBabies: (this._departureInfo.bookingCapacity) ? this._departureInfo.bookingCapacity.noBabies : null,
			totalPrice: (this._departureInfo.invoicePrice) ? this._departureInfo.invoicePrice : null,
			notes: (this._booking) ? this._booking.notes : null
		}
		return report;
	}
}