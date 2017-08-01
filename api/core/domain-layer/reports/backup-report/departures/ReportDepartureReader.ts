import { ThLogger, ThLogLevel } from '../../../../utils/logging/ThLogger';
import { ThError } from '../../../../utils/th-responses/ThError';
import { ThStatusCode } from '../../../../utils/th-responses/ThResponse';
import { AppContext } from '../../../../utils/AppContext';
import { SessionContext } from '../../../../utils/SessionContext';
import { BookingDOConstraints } from '../../../../data-layer/bookings/data-objects/BookingDOConstraints';
import { BookingSearchResultRepoDO } from '../../../../data-layer/bookings/repositories/IBookingRepository';
import { CustomerIdValidator } from '../../../customers/validators/CustomerIdValidator';
import { CustomersContainer } from '../../../customers/validators/results/CustomersContainer';
import { ReportDepartureInfo } from './utils/ReportDepartureInfo';
import { ReportDepartureInfoBuilder } from './utils/ReportDepartureInfoBuilder';
import { BookingDO, GroupBookingInputChannel, BookingConfirmationStatus } from '../../../../../core/data-layer/bookings/data-objects/BookingDO';
import { BookingItemDO } from '../../../../../core/domain-layer/bookings/add-bookings/AddBookingItemsDO';
//TODO:
import { HotelOperationsDeparturesReader } from '../../../../../core/domain-layer/hotel-operations/dashboard/departures/HotelOperationsDeparturesReader';
import { HotelOperationsDeparturesInfo, DeparturelItemInfo } from '../../../../../core/domain-layer/hotel-operations/dashboard/departures/utils/HotelOperationsDeparturesInfo';
import { RoomCategoryDO } from '../../../../../core/data-layer/room-categories/data-objects/RoomCategoryDO';
import { RoomDO } from '../../../../../core/data-layer/rooms/data-objects/RoomDO';
import { ThUtils } from "../../../../utils/ThUtils";
import { ThDateDO } from "../../../../utils/th-dates/data-objects/ThDateDO";
import { HotelOperationsQueryDO } from "../../../hotel-operations/dashboard/utils/HotelOperationsQueryDO";

import _ = require("underscore");

export class ReportDepartureReader {
		private _thUtils: ThUtils;

	constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
		this._thUtils = new ThUtils();
	}

	public read(): Promise<ReportDepartureInfo[]> {
		return new Promise<ReportDepartureInfo[]>((resolve: { (result: any): void }, reject: { (err: ThError): void }) => {
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
					if (this._thUtils.isUndefinedOrNull(departureInfo.bookingId) || this._thUtils.isUndefinedOrNull(departureInfo.groupBookingId)){
						return;
					}
					let p = this.buildReportDepartureItem(departureInfo)
					promiseList.push(p);
				});
				Promise.all(promiseList).then((reportDepartureItems: ReportDepartureInfo[]) => {
					let sortedRoomItems = reportDepartureItems.sort(this.sortComparator);
					resolve(sortedRoomItems);
				});
			})
			.catch((error: any) => {
				var thError = new ThError(ThStatusCode.HotelOperationsDeparturesReaderError, error);
				if (thError.isNativeError()) {
					ThLogger.getInstance().logError(ThLogLevel.Error, "error getting hotel departure information", this._sessionContext, thError);
				}
				reject(thError);
			});
	}

	private sortComparator(a: ReportDepartureInfo, b: ReportDepartureInfo) {
		return a.customerName.localeCompare(b.customerName);
	}

	private buildReportDepartureItem(departureInfo: DeparturelItemInfo): Promise<ReportDepartureInfo> {
		return new Promise<any>((resolve: { (result: any): void }, reject: { (err: ThError): void }) => {
			let departureInfoBuilder = new ReportDepartureInfoBuilder();
			let meta = { hotelId: this._sessionContext.sessionDO.hotel.id };

			let roomCategoryRepo = this._appContext.getRepositoryFactory().getRoomCategoryRepository();
			let roomRepo = this._appContext.getRepositoryFactory().getRoomRepository();
			let bookingRepo = this._appContext.getRepositoryFactory().getBookingRepository();

			departureInfoBuilder.setDepartureItemInfo(departureInfo);

			var pList = [];
			if (departureInfo.roomId){
				let pRoom = roomRepo.getRoomById(meta, departureInfo.roomId).then((room: RoomDO) =>{
					departureInfoBuilder.setRoom(room);
				})
				pList.push(pRoom);
			}
			if (departureInfo.groupBookingId && departureInfo.bookingId){
				let pBooking = bookingRepo.getBookingById(meta, departureInfo.groupBookingId, departureInfo.bookingId).then((booking: BookingDO) => {
					departureInfoBuilder.setBooking(booking);
				})
				pList.push(pBooking);
			}

			Promise.all(pList).then(()=>{
				let report = departureInfoBuilder.build();
				resolve(report);
			})
			.catch((error: any) => {
				let thError = new ThError(ThStatusCode.HotelOperationsRoomInfoReaderError, error);
				if (thError.isNativeError()) {
					ThLogger.getInstance().logError(ThLogLevel.Error, "error getting hotel room item information", this._sessionContext, thError);
				}
				reject(thError);
			});
		})
	}
}