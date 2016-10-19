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
import { ReportInHouseItemInfo } from './utils/ReportInHouseInfo';
import { ReportInHouseItemInfoBuilder } from './utils/ReportInHouseInfoBuilder';
import { BookingDO, GroupBookingInputChannel, BookingConfirmationStatus } from '../../../../../core/data-layer/bookings/data-objects/BookingDO';
import { BookingItemDO } from '../../../../../core/domain-layer/bookings/add-bookings/AddBookingItemsDO';
//TODO:
import { HotelOperationsRoomInfoReader } from '../../../../../core/domain-layer/hotel-operations/dashboard/room-info/HotelOperationsRoomInfoReader';
import { HotelOperationsRoomInfo, RoomItemInfo } from '../../../../../core/domain-layer/hotel-operations/dashboard/room-info/utils/HotelOperationsRoomInfo';
import { RoomCategoryDO } from '../../../../../core/data-layer/room-categories/data-objects/RoomCategoryDO';
import { RoomDO } from '../../../../../core/data-layer/rooms/data-objects/RoomDO';


export class ReportInHouseReader {
	constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
	}

	public read(): Promise<ReportInHouseItemInfo[]> {
		return new Promise<ReportInHouseItemInfo[]>((resolve: { (result: any): void }, reject: { (err: ThError): void }) => {
			this.readCore(resolve, reject);
		});
	}

	private readCore(resolve: { (result: any): void }, reject: { (err: ThError): void }) {
		var inHouseInfoBuilder = new ReportInHouseItemInfoBuilder();
		var inHouseReader = new HotelOperationsRoomInfoReader(this._appContext, this._sessionContext);
		var meta = { hotelId: this._sessionContext.sessionDO.hotel.id };

		var inHouseInfo: RoomItemInfo = null;

		inHouseReader.read()
			.then((result: HotelOperationsRoomInfo) => {
				let promiseList = [];
				result.roomInfoList.forEach(roomInfo => {
					let p = this.buildReportInHouseItem(roomInfo)
					promiseList.push(p);
				});
				Promise.all(promiseList).then((reportInHouseItems:ReportInHouseItemInfo[]) => {
					let sortedRoomItems = reportInHouseItems.sort(this.sortComparator);
					resolve(sortedRoomItems);
				});
			})
			.catch((error: any) => {
				var thError = new ThError(ThStatusCode.HotelOperationsRoomInfoReaderError, error);
				if (thError.isNativeError()) {
					ThLogger.getInstance().logError(ThLogLevel.Error, "error getting hotel room information", this._sessionContext, thError);
				}
				reject(thError);
			});
	}

	private sortComparator(a:ReportInHouseItemInfo, b:ReportInHouseItemInfo){
		return a.customerName.localeCompare(b.customerName);
	}

	private buildReportInHouseItem(roomInfo: RoomItemInfo): Promise<ReportInHouseItemInfo> {
		return new Promise<any>((resolve: { (result: any): void }, reject: { (err: ThError): void }) => {
			let inHouseInfoBuilder = new ReportInHouseItemInfoBuilder();
			let meta = { hotelId: this._sessionContext.sessionDO.hotel.id };

			let roomCategoryRepo = this._appContext.getRepositoryFactory().getRoomCategoryRepository();
			let roomRepo = this._appContext.getRepositoryFactory().getRoomRepository();
			let bookingRepo = this._appContext.getRepositoryFactory().getBookingRepository();

			inHouseInfoBuilder.setRoomItemInfo(roomInfo);

			roomRepo.getRoomById(meta, roomInfo.roomId)
				.then((room: RoomDO) => {
					inHouseInfoBuilder.setRoom(room);
					return bookingRepo.getBookingById(meta, roomInfo.groupBookingId, roomInfo.bookingId);
				})
				.then((booking: BookingDO) => {
					inHouseInfoBuilder.setBooking(booking);
					let report = inHouseInfoBuilder.build();
					resolve(report);
				})
				.catch((error: any) => {
					let thError = new ThError(ThStatusCode.HotelOperationsRoomInfoReaderError, error);
					if (thError.isNativeError()) {
						ThLogger.getInstance().logError(ThLogLevel.Error, "error getting hotel room item information", this._sessionContext, thError);
					}
					reject(thError);
				});
		});

	}
}