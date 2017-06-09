import _ = require('underscore');

import { ThLogger, ThLogLevel } from '../../../../utils/logging/ThLogger';
import { ThError } from '../../../../utils/th-responses/ThError';
import { ThStatusCode } from '../../../../utils/th-responses/ThResponse';
import { AppContext } from '../../../../utils/AppContext';
import { SessionContext } from '../../../../utils/SessionContext';
import { BookingDOConstraints } from '../../../../data-layer/bookings/data-objects/BookingDOConstraints';
import { BookingSearchResultRepoDO } from '../../../../data-layer/bookings/repositories/IBookingRepository';
import { CustomerIdValidator } from '../../../customers/validators/CustomerIdValidator';
import { CustomersContainer } from '../../../customers/validators/results/CustomersContainer';
import { ReportArrivalItemInfo } from './utils/ReportArrivalsInfo';
import { ReportArrivalsItemInfoBuilder } from './utils/ReportArrivalsInfoBuilder';
import { BookingDO, GroupBookingInputChannel, BookingConfirmationStatus } from '../../../../../core/data-layer/bookings/data-objects/BookingDO';
import { BookingItemDO } from '../../../../../core/domain-layer/bookings/add-bookings/AddBookingItemsDO';
import { HotelOperationsArrivalsReader } from '../../../../../core/domain-layer/hotel-operations/dashboard/arrivals/HotelOperationsArrivalsReader';
import { HotelOperationsArrivalsInfo, ArrivalItemInfo } from '../../../../../core/domain-layer/hotel-operations/dashboard/arrivals/utils/HotelOperationsArrivalsInfo';
import { RoomCategoryDO } from '../../../../../core/data-layer/room-categories/data-objects/RoomCategoryDO';
import { RoomDO } from '../../../../../core/data-layer/rooms/data-objects/RoomDO';
import { ThDateDO } from "../../../../utils/th-dates/data-objects/ThDateDO";
import { HotelOperationsQueryDO } from "../../../hotel-operations/dashboard/utils/HotelOperationsQueryDO";

export class ReportArrivalsReader {
	constructor(private _appContext: AppContext, private _sessionContext: SessionContext, private _date?: ThDateDO) {
	}

	public read(): Promise<ReportArrivalItemInfo[]> {
		return new Promise<ReportArrivalItemInfo[]>((resolve: { (result: any): void }, reject: { (err: ThError): void }) => {
			this.readCore(resolve, reject);
		});
	}

	private readCore(resolve: { (result: any): void }, reject: { (err: ThError): void }) {
		var arrivalsInfoBuilder = new ReportArrivalsItemInfoBuilder();
		var arrivalsReader = new HotelOperationsArrivalsReader(this._appContext, this._sessionContext);
		var meta = { hotelId: this._sessionContext.sessionDO.hotel.id };

		var arrivalInfo: ArrivalItemInfo = null;
		var hotelOperationsQueryDO = new HotelOperationsQueryDO();
		if (this._date) {
			hotelOperationsQueryDO.referenceDate = this._date;
		 }
		arrivalsReader.read(hotelOperationsQueryDO)
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
			})
			.catch((error: any) => {
				let thError = new ThError(ThStatusCode.HotelOperationsArrivalsReaderError, error);
				if (thError.isNativeError()) {
					ThLogger.getInstance().logError(ThLogLevel.Error, "error getting hotel arrival item information", this._sessionContext, thError);
				}
				reject(thError);
			});
		});

	}
}