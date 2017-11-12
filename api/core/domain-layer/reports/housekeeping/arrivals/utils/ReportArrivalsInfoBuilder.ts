import { ArrivalItemInfo } from "../../../../hotel-operations/dashboard/arrivals/utils/HotelOperationsArrivalsInfo";
import { RoomCategoryDO } from "../../../../../data-layer/room-categories/data-objects/RoomCategoryDO";
import { RoomDO } from "../../../../../data-layer/rooms/data-objects/RoomDO";
import { BookingDO } from "../../../../../data-layer/bookings/data-objects/BookingDO";
import { ReportArrivalItemInfo } from "./ReportArrivalsInfo";
import { RoomCategoryStatsDO } from "../../../../../data-layer/room-categories/data-objects/RoomCategoryStatsDO";
import { CustomerDO } from "../../../../../data-layer/customers/data-objects/CustomerDO";

export class ReportArrivalsItemInfoBuilder {
	private _arrivalInfo: ArrivalItemInfo;
	private _roomCategory: RoomCategoryDO;
	private _room: RoomDO;
	private _booking: BookingDO;
	private _roomCategoryStats: RoomCategoryStatsDO;
	private _companyOrTravelAgency: CustomerDO;

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

	public setRoomCategoryStats(roomCategoryStats: RoomCategoryStatsDO) {
		this._roomCategoryStats = roomCategoryStats;
	}

	build(): ReportArrivalItemInfo {
		var report: ReportArrivalItemInfo = {
			floorNumber: this._room ? this._room.floor : null,
			roomNumber: this._room ? this._room.name : null,
			roomCategory: this._roomCategory ? this._roomCategory.displayName : null,
			customerName: this._arrivalInfo.customerName,
			interval: (this._booking && this._booking.interval) ? this._booking.interval.toString() : null,
			noNights: (this._booking && this._booking.interval) ? this._booking.interval.getNumberOfDays() : null,
			noAdults: this._arrivalInfo.bookingCapacity ? this._arrivalInfo.bookingCapacity.noAdults : null,
			noChildren: this._arrivalInfo.bookingCapacity ? this._arrivalInfo.bookingCapacity.noChildren : null,
			noBabies: this._arrivalInfo.bookingCapacity ? this._arrivalInfo.bookingCapacity.noBabies : null,
			noBabiesSleepingInBabyBeds: this._arrivalInfo.bookingCapacity ? this._arrivalInfo.bookingCapacity.noBabyBeds : null,
			stationaryBeds: this._roomCategoryStats? this._roomCategoryStats.getStationaryBedCount(): null,
			rollawayBeds: this._roomCategoryStats? this._roomCategoryStats.getRollawayBedCount(): null,
			notes: this._booking ? this._booking.notes : null
		}
		return report;
	}
}
