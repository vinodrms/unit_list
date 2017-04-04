import { ArrivalItemInfo } from "../../../../hotel-operations/dashboard/arrivals/utils/HotelOperationsArrivalsInfo";
import { RoomCategoryDO } from "../../../../../data-layer/room-categories/data-objects/RoomCategoryDO";
import { RoomDO } from "../../../../../data-layer/rooms/data-objects/RoomDO";
import { BookingDO } from "../../../../../data-layer/bookings/data-objects/BookingDO";
import { ReportArrivalItemInfo } from "./ReportArrivalsInfo";

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
			floorNumber: this._room ? this._room.floor : null,
			roomNumber: this._room ? this._room.name : null,
			roomCategory: this._room ? this._roomCategory.displayName : null,		// room[roomId].displayName -> make test to create bookings with reserver Room number
			customerName: this._arrivalInfo.customerName,
			noAdults: this._arrivalInfo.bookingCapacity ? this._arrivalInfo.bookingCapacity.noAdults : null,
			noChildren: this._arrivalInfo.bookingCapacity ? this._arrivalInfo.bookingCapacity.noChildren : null,
			noBabies: this._arrivalInfo.bookingCapacity ? this._arrivalInfo.bookingCapacity.noBabies : null,
			noBabyBeds: this._arrivalInfo.bookingCapacity ? this._arrivalInfo.bookingCapacity.noBabyBeds : null,
			noBabyRollawayBeds: this._arrivalInfo.bookingCapacity ? this._arrivalInfo.bookingCapacity.noBabyBeds : null,
			noOtherRollawayBeds: this._arrivalInfo.bookingCapacity ? -1 : null,
			notes: this._booking ? this._booking.notes : null
		}
		return report;
	}
}
