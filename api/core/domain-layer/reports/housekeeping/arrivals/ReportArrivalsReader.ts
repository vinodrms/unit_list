import { AppContext } from "../../../../utils/AppContext";
import { SessionContext } from "../../../../utils/SessionContext";
import { ReportArrivalItemInfo } from "./utils/ReportArrivalsInfo";
import { ThError } from "../../../../utils/th-responses/ThError";
import { ReportArrivalsItemInfoBuilder } from "./utils/ReportArrivalsInfoBuilder";
import { HotelOperationsArrivalsReader } from "../../../hotel-operations/dashboard/arrivals/HotelOperationsArrivalsReader";
import { ArrivalItemInfo, HotelOperationsArrivalsInfo } from "../../../hotel-operations/dashboard/arrivals/utils/HotelOperationsArrivalsInfo";
import { ThStatusCode } from "../../../../utils/th-responses/ThResponse";
import { ThLogLevel, ThLogger } from "../../../../utils/logging/ThLogger";
import { RoomCategoryDO } from "../../../../data-layer/room-categories/data-objects/RoomCategoryDO";
import { RoomDO } from "../../../../data-layer/rooms/data-objects/RoomDO";
import { BookingDO } from "../../../../data-layer/bookings/data-objects/BookingDO";
import { RoomCategoryStatsAggregator } from "../../../room-categories/aggregators/RoomCategoryStatsAggregator";
import { RoomCategoryStatsDO } from "../../../../data-layer/room-categories/data-objects/RoomCategoryStatsDO";
import { CustomerDO } from "../../../../data-layer/customers/data-objects/CustomerDO";
import { BookingCustomers } from "../common/BookingCustomers";

import _ = require("underscore");

export class ReportArrivalsReader {
	private _meta;

    constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
		this._meta = { hotelId: this._sessionContext.sessionDO.hotel.id };
	}

	public read(): Promise<ReportArrivalItemInfo[]> {
		return new Promise<ReportArrivalItemInfo[]>((resolve: { (result: any): void }, reject: { (err: ThError): void }) => {
			this.readCore(resolve, reject);
		});
	}

	private readCore(resolve: { (result: any): void }, reject: { (err: ThError): void }) {
		let emptyDateRefParam: any = {};
		let arrivalsReader = new HotelOperationsArrivalsReader(this._appContext, this._sessionContext);
		
		arrivalsReader.read(emptyDateRefParam)
			.then((result: HotelOperationsArrivalsInfo) => {
				let promiseList = [];
				result.arrivalInfoList.forEach(arrivalInfo => {
					let p = this.buildReportArrivalItem(arrivalInfo)
					promiseList.push(p);
				});
				return Promise.all(promiseList);
			}).then((reportArrivalItems:ReportArrivalItemInfo[]) => {
				let sortedArrivalItems = reportArrivalItems.sort(this.sortComparator);
				resolve(sortedArrivalItems);
			}).catch((error: any) => {
				let thError = new ThError(ThStatusCode.HotelOperationsArrivalsReaderError, error);
				if (thError.isNativeError()) {
					ThLogger.getInstance().logError(ThLogLevel.Error, "error getting hotel arrivals information", this._sessionContext, thError);
				}
				reject(thError);
			});
	}

	private sortComparator(a:ReportArrivalItemInfo, b:ReportArrivalItemInfo) {
		let aHasRoomNo = _.isString(a.roomNumber);
		let bHasRoomNo = _.isString(b.roomNumber);

		if (aHasRoomNo && !bHasRoomNo) {
			return 1;
		}
		if (!aHasRoomNo && bHasRoomNo) {
			return -1;
		}
		if (aHasRoomNo && bHasRoomNo) {
			return a.roomNumber.localeCompare(b.roomNumber);
		}

		return a.roomCategory.localeCompare(b.roomCategory);
	}

	private buildReportArrivalItem(arrivalInfo: ArrivalItemInfo): Promise<ReportArrivalItemInfo> {
		return new Promise<any>((resolve: { (result: any): void }, reject: { (err: ThError): void }) => {
			let roomRepo = this._appContext.getRepositoryFactory().getRoomRepository();

			if (arrivalInfo.reservedRoomId){
				roomRepo.getRoomById(this._meta, arrivalInfo.reservedRoomId).then((room:RoomDO) => {
					this.buildReportArrivalItemCore(resolve, reject, arrivalInfo, room);
				});
			}
			else {
				this.buildReportArrivalItemCore(resolve, reject, arrivalInfo);
			}
		});

	}

	private buildReportArrivalItemCore(resolve: { (result: any): void }, reject: { (err: ThError): void }, arrivalInfo: ArrivalItemInfo, room?: RoomDO) {
		let roomCategoryRepo = this._appContext.getRepositoryFactory().getRoomCategoryRepository();
		let bookingRepo = this._appContext.getRepositoryFactory().getBookingRepository();
		let roomStatsAggregator = new RoomCategoryStatsAggregator(this._appContext, this._sessionContext);
		let bookingCustomers = new BookingCustomers(this._appContext, this._sessionContext);

		let arrivalsInfoBuilder = new ReportArrivalsItemInfoBuilder();
		arrivalsInfoBuilder.setArrivalsItemInfo(arrivalInfo);
		arrivalsInfoBuilder.setRoom(room);
		
		let bookingDO = null;
		roomCategoryRepo.getRoomCategoryById(this._meta, arrivalInfo.roomCategoryId).then((roomCategory : RoomCategoryDO)=>{
			arrivalsInfoBuilder.setRoomCategory(roomCategory);

			return bookingRepo.getBookingById(this._meta, arrivalInfo.groupBookingId, arrivalInfo.bookingId);
		}).then((booking: BookingDO) => {
			bookingDO = booking;
			arrivalsInfoBuilder.setBooking(bookingDO);

			return roomStatsAggregator.getRoomCategoryStatsList([bookingDO.roomCategoryId]);
		}).then((roomStats: RoomCategoryStatsDO[]) => {	
			if (roomStats.length > 0) {
				arrivalsInfoBuilder.setRoomCategoryStats(roomStats[0]);
			}
			return bookingCustomers.getCompanyOrTAForGuest(bookingDO);
		}).then((companyOrTA: CustomerDO) => {
			if(!_.isUndefined(companyOrTA)) {
				arrivalsInfoBuilder.setCompanyOrTA(companyOrTA);
			}
			
			resolve(arrivalsInfoBuilder.build());
		}).catch((error: any) => {
			let thError = new ThError(ThStatusCode.HotelOperationsArrivalsReaderError, error);
			if (thError.isNativeError()) {
				ThLogger.getInstance().logError(ThLogLevel.Error, "error getting hotel arrival item information", this._sessionContext, thError);
			}
			reject(thError);
		});
	}
}