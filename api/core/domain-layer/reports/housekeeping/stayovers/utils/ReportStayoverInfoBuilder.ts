import { RoomItemInfo } from "../../../../hotel-operations/dashboard/room-info/utils/HotelOperationsRoomInfo";
import { RoomDO } from "../../../../../data-layer/rooms/data-objects/RoomDO";
import { BookingDO } from "../../../../../data-layer/bookings/data-objects/BookingDO";
import { ReportStayoverInfo } from "./ReportStayoverInfo";
import { RoomCategoryStatsDO } from "../../../../../data-layer/room-categories/data-objects/RoomCategoryStatsDO";
import { CustomerDO } from "../../../../../data-layer/customers/data-objects/CustomerDO";

export class ReportStayoverInfoBuilder {
	private _roomInfo: RoomItemInfo;
	private _room: RoomDO;
	private _booking: BookingDO;
	private _roomCategoryStats: RoomCategoryStatsDO;
	private _companyOrTravelAgency: CustomerDO;
	
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

	public setRoomCategoryStats(roomCategoryStats: RoomCategoryStatsDO) {
		this._roomCategoryStats = roomCategoryStats;
	}
	
	public setCompanyOrTA(companyOrTA: CustomerDO) {
		this._companyOrTravelAgency = companyOrTA;
	}

	build(): ReportStayoverInfo {
		var report: ReportStayoverInfo = {
			floorNumber: this._room ? this._room.floor : null,
			roomNumber: this._room ? this._room.name : null,
			customerName: this._roomInfo.customerName,
			companyOrTA: this._companyOrTravelAgency ? this._companyOrTravelAgency.customerDetails.getName() : null,
			interval: (this._booking && this._booking.interval) ? this._booking.interval.toString() : null,
			noNights: (this._booking && this._booking.interval) ? this._booking.interval.getNumberOfDays() : null,
			noAdults: this._roomInfo.bookingCapacity ? this._roomInfo.bookingCapacity.noAdults: null,
			noChildren: this._roomInfo.bookingCapacity ? this._roomInfo.bookingCapacity.noChildren: null,
			noBabies: this._roomInfo.bookingCapacity ? this._roomInfo.bookingCapacity.noBabies: null,
			noBabiesSleepingInBabyBeds: this._roomInfo.bookingCapacity ? this._roomInfo.bookingCapacity.noBabyBeds: null,
			stationaryBeds: this._roomCategoryStats? this._roomCategoryStats.getStationaryBedCount(): null,
			rollawayBeds: this._roomCategoryStats? this._roomCategoryStats.getRollawayBedCount(): null,
			notes: this._booking ? this._booking.notes : null
		}
		return report;
	}
}
