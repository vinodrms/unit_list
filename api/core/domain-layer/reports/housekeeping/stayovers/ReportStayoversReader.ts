import { AppContext } from "../../../../utils/AppContext";
import { SessionContext } from "../../../../utils/SessionContext";
import { ThError } from "../../../../utils/th-responses/ThError";
import { HotelOperationsRoomInfoReader } from "../../../hotel-operations/dashboard/room-info/HotelOperationsRoomInfoReader";
import { RoomItemInfo, HotelOperationsRoomInfo } from "../../../hotel-operations/dashboard/room-info/utils/HotelOperationsRoomInfo";
import { ThStatusCode } from "../../../../utils/th-responses/ThResponse";
import { ThLogger, ThLogLevel } from "../../../../utils/logging/ThLogger";
import { RoomDO } from "../../../../data-layer/rooms/data-objects/RoomDO";
import { BookingDO } from "../../../../data-layer/bookings/data-objects/BookingDO";
import { ReportStayoverInfo } from "./utils/ReportStayoverInfo";
import { ReportStayoverInfoBuilder } from "./utils/ReportStayoverInfoBuilder";
import { BookingUtils } from "../../../bookings/utils/BookingUtils";
import { HotelDO } from "../../../../data-layer/hotel/data-objects/HotelDO";
import { RoomCategoryStatsAggregator } from "../../../room-categories/aggregators/RoomCategoryStatsAggregator";
import { RoomCategoryStatsDO } from "../../../../data-layer/room-categories/data-objects/RoomCategoryStatsDO";
import { BookingCustomers } from "../common/BookingCustomers";

import _ = require("underscore");

export class ReportStayoversReader {
    private _bookingUtils: BookingUtils;
	private _hotelDO: HotelDO;

	constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
		this._bookingUtils = new BookingUtils();
	}

	public read(): Promise<ReportStayoverInfo[]> {
		return new Promise<ReportStayoverInfo[]>((resolve: { (result: any): void }, reject: { (err: ThError): void }) => {
			this.readCore(resolve, reject);
		});
	}

	private readCore(resolve: { (result: any): void }, reject: { (err: ThError): void }) {
		var inHouseInfoBuilder = new ReportStayoverInfoBuilder();
		var inHouseReader = new HotelOperationsRoomInfoReader(this._appContext, this._sessionContext);

		var meta = { hotelId: this._sessionContext.sessionDO.hotel.id };

		this._appContext.getRepositoryFactory().getHotelRepository().getHotelById(this._sessionContext.sessionDO.hotel.id)
			.then((hotel: HotelDO) => {
				this._hotelDO = hotel;
				return inHouseReader.read();
			}).then((result: HotelOperationsRoomInfo) => {
				let promiseList = [];
				result.roomInfoList.forEach(roomInfo => {
					var today = this._bookingUtils.getCurrentThDateForHotel(this._hotelDO);
					if(roomInfo.bookingInterval.start.isSame(today) || roomInfo.bookingInterval.end.isSame(today)) {
						return;
					}

					let p = this.buildReportInHouseItem(roomInfo)
					promiseList.push(p);
				});
				return Promise.all(promiseList);
			}).then((reportInHouseItems:ReportStayoverInfo[]) => {
				let sortedRoomItems = reportInHouseItems.sort(this.sortComparator);
				resolve(sortedRoomItems);
			}).catch((error: any) => {
				var thError = new ThError(ThStatusCode.HotelOperationsRoomInfoReaderError, error);
				if (thError.isNativeError()) {
					ThLogger.getInstance().logError(ThLogLevel.Error, "error getting hotel room information", this._sessionContext, thError);
				}
				reject(thError);
			});
	}

	private sortComparator(a:ReportStayoverInfo, b:ReportStayoverInfo){
		if(a.floorNumber != b.floorNumber) {
			return a.floorNumber - b.floorNumber;
		}

		return a.roomNumber.localeCompare(b.roomNumber);
	}

	private buildReportInHouseItem(roomInfo: RoomItemInfo): Promise<ReportStayoverInfo> {
		return new Promise<any>((resolve: { (result: any): void }, reject: { (err: ThError): void }) => {
			let stayoversInfoBuilder = new ReportStayoverInfoBuilder();
			stayoversInfoBuilder.setRoomItemInfo(roomInfo);

			let roomStatsAggregator = new RoomCategoryStatsAggregator(this._appContext, this._sessionContext);
			let roomRepo = this._appContext.getRepositoryFactory().getRoomRepository();
			let bookingRepo = this._appContext.getRepositoryFactory().getBookingRepository();
			let bookingCustomers = new BookingCustomers(this._appContext, this._sessionContext);

			let meta = { hotelId: this._sessionContext.sessionDO.hotel.id };

			let bookingDO = null;
			roomRepo.getRoomById(meta, roomInfo.roomId).then((room: RoomDO) => {
				stayoversInfoBuilder.setRoom(room);

				return bookingRepo.getBookingById(meta, roomInfo.bookingId);
			}).then((booking: BookingDO) => {
				bookingDO = booking;
				stayoversInfoBuilder.setBooking(bookingDO);

				return roomStatsAggregator.getRoomCategoryStatsList([booking.roomCategoryId]);
			}).then((roomStats: RoomCategoryStatsDO[]) => {
				if(roomStats.length > 0) {
					stayoversInfoBuilder.setRoomCategoryStats(roomStats[0]);
				}
				return bookingCustomers.getCompanyOrTAForGuest(bookingDO);
			}).then((companyOrTA) => {
            	if (!_.isUndefined(companyOrTA)) {
					stayoversInfoBuilder.setCompanyOrTA(companyOrTA);
            	}

				resolve(stayoversInfoBuilder.build());
			}).catch((error: any) => {
				let thError = new ThError(ThStatusCode.HotelOperationsRoomInfoReaderError, error);
				if (thError.isNativeError()) {
					ThLogger.getInstance().logError(ThLogLevel.Error, "error getting hotel room item information", this._sessionContext, thError);
				}
				reject(thError);
			});
		});

	}
}
