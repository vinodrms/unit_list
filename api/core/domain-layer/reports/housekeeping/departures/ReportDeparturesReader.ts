import { AppContext } from "../../../../utils/AppContext";
import { SessionContext } from "../../../../utils/SessionContext";
import { ReportDepartureItemInfo } from "./utils/ReportDepartureItemInfo";
import { ThError } from "../../../../utils/th-responses/ThError";
import { ReportDepartureInfoBuilder } from "./utils/ReportDeparturesInfoBuilder";
import { HotelOperationsDeparturesReader } from "../../../hotel-operations/dashboard/departures/HotelOperationsDeparturesReader";
import { DeparturelItemInfo, HotelOperationsDeparturesInfo } from "../../../hotel-operations/dashboard/departures/utils/HotelOperationsDeparturesInfo";
import { ThStatusCode } from "../../../../utils/th-responses/ThResponse";
import { ThLogger, ThLogLevel } from "../../../../utils/logging/ThLogger";
import { RoomDO } from "../../../../data-layer/rooms/data-objects/RoomDO";
import { BookingDO } from "../../../../data-layer/bookings/data-objects/BookingDO";
import { ThUtils } from "../../../../utils/ThUtils";
import { RoomCategoryStatsAggregator } from "../../../room-categories/aggregators/RoomCategoryStatsAggregator";
import { RoomCategoryStatsDO } from "../../../../data-layer/room-categories/data-objects/RoomCategoryStatsDO";

export class ReportDeparturesReader {
	private _thUtils: ThUtils;

	constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
		this._thUtils = new ThUtils();
	}

	public read(): Promise<ReportDepartureItemInfo[]> {
		return new Promise<ReportDepartureItemInfo[]>((resolve: { (result: any): void }, reject: { (err: ThError): void }) => {
			this.readCore(resolve, reject);
		});
	}

	private readCore(resolve: { (result: any): void }, reject: { (err: ThError): void }) {
		var departureInfoBuilder = new ReportDepartureInfoBuilder();
		var departureReader = new HotelOperationsDeparturesReader(this._appContext, this._sessionContext);
		var emptyDateRefParam: any = {};
		var meta = { hotelId: this._sessionContext.sessionDO.hotel.id };

		var departureInfo: DeparturelItemInfo = null;

		departureReader.read(emptyDateRefParam)
			.then((result: HotelOperationsDeparturesInfo) => {
				let promiseList = [];
				result.departureInfoList.forEach((departureInfo: DeparturelItemInfo) => {
					if(this._thUtils.isUndefinedOrNull(departureInfo.roomId)) {
						return;
					}

					let p = this.buildReportDepartureItem(departureInfo)
					promiseList.push(p);
				});

				return Promise.all(promiseList);
			}).then((reportDepartureItems: ReportDepartureItemInfo[]) => {
				let sortedRoomItems = reportDepartureItems.sort(this.sortComparator);

				resolve(sortedRoomItems);
			}).catch((error: any) => {
				var thError = new ThError(ThStatusCode.HotelOperationsDeparturesReaderError, error);
				if (thError.isNativeError()) {
					ThLogger.getInstance().logError(ThLogLevel.Error, "error getting hotel departure information", this._sessionContext, thError);
				}
				reject(thError);
			});
	}

	private sortComparator(a: ReportDepartureItemInfo, b: ReportDepartureItemInfo) {
		if(a.floorNumber != b.floorNumber) {
			return a.floorNumber - b.floorNumber;
		}

		return a.roomNumber.localeCompare(b.roomNumber);
	}

	private buildReportDepartureItem(departureInfo: DeparturelItemInfo): Promise<ReportDepartureItemInfo> {
		return new Promise<any>((resolve: { (result: any): void }, reject: { (err: ThError): void }) => {
			let departureInfoBuilder = new ReportDepartureInfoBuilder();
			departureInfoBuilder.setDepartureItemInfo(departureInfo);

			let meta = { hotelId: this._sessionContext.sessionDO.hotel.id };

			let roomStatsAggregator = new RoomCategoryStatsAggregator(this._appContext, this._sessionContext);
			let roomRepo = this._appContext.getRepositoryFactory().getRoomRepository();
			let bookingRepo = this._appContext.getRepositoryFactory().getBookingRepository();
			
			roomRepo.getRoomById(meta, departureInfo.roomId).then((room: RoomDO) =>{
				departureInfoBuilder.setRoom(room);
				return bookingRepo.getBookingById(meta, departureInfo.groupBookingId, departureInfo.bookingId);
			}).then((booking: BookingDO) => {
				departureInfoBuilder.setBooking(booking);

				return roomStatsAggregator.getRoomCategoryStatsList([booking.roomCategoryId]);
			}).then((roomStats: RoomCategoryStatsDO[]) => {
				if(roomStats.length > 0) {
					departureInfoBuilder.setRoomCategoryStats(roomStats[0]);
				}
				resolve(departureInfoBuilder.build());
			}).catch((error: any) => {
				let thError = new ThError(ThStatusCode.HotelOperationsRoomInfoReaderError, error);
				if (thError.isNativeError()) {
					ThLogger.getInstance().logError(ThLogLevel.Error, "error getting hotel room item information", this._sessionContext, thError);
				}
				reject(thError);
			});
		})
	}
}