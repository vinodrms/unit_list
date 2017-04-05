import _ = require('underscore');
import { DeparturelItemInfo } from "../../../../hotel-operations/dashboard/departures/utils/HotelOperationsDeparturesInfo";
import { RoomDO } from "../../../../../data-layer/rooms/data-objects/RoomDO";
import { BookingDO } from "../../../../../data-layer/bookings/data-objects/BookingDO";
import { ReportDepartureItemInfo } from "./ReportDepartureItemInfo";
import { RoomCategoryStatsDO } from "../../../../../data-layer/room-categories/data-objects/RoomCategoryStatsDO";

export class ReportDepartureInfoBuilder {
	private _departureInfo: DeparturelItemInfo;
	private _room: RoomDO;
	private _booking: BookingDO;
	private _roomCategoryStats: RoomCategoryStatsDO;
	
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

	public setRoomCategoryStats(roomCategoryStats: RoomCategoryStatsDO) {
		this._roomCategoryStats = roomCategoryStats;
	}
	
	private defaults(value: any, defaultValue?: any) {
		return (value) ? value : (defaultValue) ? defaultValue : null;
	}

	build(): ReportDepartureItemInfo {
		var report: ReportDepartureItemInfo = {
			floorNumber: this._room ? this._room.floor : null,
			roomNumber: this._room ? this._room.name : null,
			customerName: this._departureInfo.customerName,
			noAdults: this._departureInfo.bookingCapacity ? this._departureInfo.bookingCapacity.noAdults: null,
			noChildren: this._departureInfo.bookingCapacity ? this._departureInfo.bookingCapacity.noChildren: null,
			noBabies: this._departureInfo.bookingCapacity ? this._departureInfo.bookingCapacity.noBabies: null,
			noBabiesSleepingInBabyBeds: this._departureInfo.bookingCapacity ? this._departureInfo.bookingCapacity.noBabyBeds: null,
			stationaryBeds: this._roomCategoryStats? this._roomCategoryStats.getStationaryBedCount(): null,
			rollawayBeds: this._roomCategoryStats? this._roomCategoryStats.getRollawayBedCount(): null,
			notes: this._booking ? this._booking.notes : null
		}
		return report;
	}
}