
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

export class ReportArrivalsReader {
    constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
	}

	public read(): Promise<ReportArrivalItemInfo[]> {
		return new Promise<ReportArrivalItemInfo[]>((resolve: { (result: any): void }, reject: { (err: ThError): void }) => {
			this.readCore(resolve, reject);
		});
	}

	private readCore(resolve: { (result: any): void }, reject: { (err: ThError): void }) {
		var arrivalsInfoBuilder = new ReportArrivalsItemInfoBuilder();
		var arrivalsReader = new HotelOperationsArrivalsReader(this._appContext, this._sessionContext);
		var emptyDateRefParam: any = {};
		var meta = { hotelId: this._sessionContext.sessionDO.hotel.id };

		var arrivalInfo: ArrivalItemInfo = null;

		arrivalsReader.read(emptyDateRefParam)
			.then((result: HotelOperationsArrivalsInfo) => {
				let promiseList = [];
				result.arrivalInfoList.forEach(arrivalInfo => {
					let p = this.buildReportArrivalItem(arrivalInfo)
					promiseList.push(p);
				});
				Promise.all(promiseList).then((reportArrivalItems:ReportArrivalItemInfo[]) => {
					let sortedArrivalItems = reportArrivalItems.sort(this.sortComparator);
					resolve(sortedArrivalItems);
				});
			})
			.catch((error: any) => {
				var thError = new ThError(ThStatusCode.HotelOperationsArrivalsReaderError, error);
				if (thError.isNativeError()) {
					ThLogger.getInstance().logError(ThLogLevel.Error, "error getting hotel arrivals information", this._sessionContext, thError);
				}
				reject(thError);
			});
	}

	private sortComparator(a:ReportArrivalItemInfo, b:ReportArrivalItemInfo){
		return a.customerName.localeCompare(b.customerName);
	}

	private buildReportArrivalItem(arrivalInfo: ArrivalItemInfo): Promise<ReportArrivalItemInfo> {
		return new Promise<any>((resolve: { (result: any): void }, reject: { (err: ThError): void }) => {
			
			let arrivalsInfoBuilder = new ReportArrivalsItemInfoBuilder();
			let meta = { hotelId: this._sessionContext.sessionDO.hotel.id };

			let roomCategoryRepo = this._appContext.getRepositoryFactory().getRoomCategoryRepository();
			let roomRepo = this._appContext.getRepositoryFactory().getRoomRepository();
			let bookingRepo = this._appContext.getRepositoryFactory().getBookingRepository();

			arrivalsInfoBuilder.setArrivalsItemInfo(arrivalInfo);
			var promiseList = [];
			if (arrivalInfo.roomCategoryId){
				var pRoomCategory = roomCategoryRepo.getRoomCategoryById(meta, arrivalInfo.roomCategoryId).then((roomCategory : RoomCategoryDO)=>{
					arrivalsInfoBuilder.setRoomCategory(roomCategory);
				});
				promiseList.push(pRoomCategory);
			}

			if (arrivalInfo.reservedRoomId){
				var pRoom = roomRepo.getRoomById(meta, arrivalInfo.reservedRoomId).then((room:RoomDO) => {
					arrivalsInfoBuilder.setRoom(room);
				})
				promiseList.push(pRoom);
			}
			
			if (arrivalInfo.bookingId){
				var pBooking = bookingRepo.getBookingById(meta, arrivalInfo.groupBookingId, arrivalInfo.bookingId).then((booking: BookingDO) => {
					arrivalsInfoBuilder.setBooking(booking);
				})
				promiseList.push(pBooking);
			}
			
			Promise.all(promiseList).then(() => {
				let report = arrivalsInfoBuilder.build();
				resolve(report);
			}).catch((error: any) => {
				let thError = new ThError(ThStatusCode.HotelOperationsArrivalsReaderError, error);
				if (thError.isNativeError()) {
					ThLogger.getInstance().logError(ThLogLevel.Error, "error getting hotel arrival item information", this._sessionContext, thError);
				}
				reject(thError);
			});
		});

	}
}