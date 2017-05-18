import { ThLogger, ThLogLevel } from '../../../../utils/logging/ThLogger';
import { ThError } from '../../../../utils/th-responses/ThError';
import { ThStatusCode } from '../../../../utils/th-responses/ThResponse';
import { AppContext } from '../../../../utils/AppContext';
import { SessionContext } from '../../../../utils/SessionContext';
import { CheckOutRoomDO } from './CheckOutRoomDO';
import { BookingDO, BookingConfirmationStatus } from '../../../../data-layer/bookings/data-objects/BookingDO';
import { ValidationResultParser } from '../../../common/ValidationResultParser';
import { RoomDO, RoomMaintenanceStatus } from '../../../../data-layer/rooms/data-objects/RoomDO';
import { DocumentActionDO } from '../../../../data-layer/common/data-objects/document-history/DocumentActionDO';
import { HotelDO } from "../../../../data-layer/hotel/data-objects/HotelDO";
import { ThTimestampDO } from "../../../../utils/th-dates/data-objects/ThTimestampDO";

export class CheckOutRoom {
    private _checkOutRoomDO: CheckOutRoomDO;

    private _loadedHotel: HotelDO;
    private _loadedBooking: BookingDO;
    private _loadedRoom: RoomDO;

    constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
    }

    public checkOut(checkOutRoomDO: CheckOutRoomDO): Promise<BookingDO> {
        this._checkOutRoomDO = checkOutRoomDO;
        return new Promise<BookingDO>((resolve: { (result: BookingDO): void }, reject: { (err: ThError): void }) => {
            this.checkOutCore(resolve, reject);
        });
    }
    private checkOutCore(resolve: { (result: BookingDO): void }, reject: { (err: ThError): void }) {
        var validationResult = CheckOutRoomDO.getValidationStructure().validateStructure(this._checkOutRoomDO);
        if (!validationResult.isValid()) {
            var parser = new ValidationResultParser(validationResult, this._checkOutRoomDO);
            parser.logAndReject("Error validating check out room fields", reject);
            return;
        }

        let hotelRepo = this._appContext.getRepositoryFactory().getHotelRepository();
        hotelRepo.getHotelById(this._sessionContext.sessionDO.hotel.id)
            .then((hotel: HotelDO) => {
                this._loadedHotel = hotel;
                var bookingsRepo = this._appContext.getRepositoryFactory().getBookingRepository();
                return bookingsRepo.getBookingById({ hotelId: this._sessionContext.sessionDO.hotel.id }, this._checkOutRoomDO.groupBookingId, this._checkOutRoomDO.bookingId);
            }).then((booking: BookingDO) => {
                this._loadedBooking = booking;
                if (this._loadedBooking.confirmationStatus !== BookingConfirmationStatus.CheckedIn) {
                    var thError = new ThError(ThStatusCode.CheckOutRoomBookingNotCheckedIn, null);
                    ThLogger.getInstance().logBusiness(ThLogLevel.Error, "booking not checked in", this._checkOutRoomDO, thError);
                    throw thError;
                }
                this.markLoadedBookingAsCheckedOut();

                var roomRepository = this._appContext.getRepositoryFactory().getRoomRepository();
                return roomRepository.getRoomById({ hotelId: this._sessionContext.sessionDO.hotel.id }, this._loadedBooking.roomId);
            }).then((room: RoomDO) => {
                this._loadedRoom = room;
                this.markLoadedRoomAsDirtyIfClean();

                var bookingsRepo = this._appContext.getRepositoryFactory().getBookingRepository();
                return bookingsRepo.updateBooking({ hotelId: this._sessionContext.sessionDO.hotel.id }, {
                    groupBookingId: this._loadedBooking.groupBookingId,
                    bookingId: this._loadedBooking.id,
                    versionId: this._loadedBooking.versionId
                }, this._loadedBooking);
            }).then((updatedBooking: BookingDO) => {
                this._loadedBooking = updatedBooking;

                var roomRepository = this._appContext.getRepositoryFactory().getRoomRepository();
                return roomRepository.updateRoom({ hotelId: this._sessionContext.sessionDO.hotel.id }, {
                    id: this._loadedRoom.id,
                    versionId: this._loadedRoom.versionId
                }, this._loadedRoom);
            }).then((updatedRoom: RoomDO) => {
                resolve(this._loadedBooking);
            }).catch((error: any) => {
                var thError = new ThError(ThStatusCode.CheckOutRoomError, error);
                if (thError.isNativeError()) {
                    ThLogger.getInstance().logError(ThLogLevel.Error, "error checking out", this._sessionContext, thError);
                }
                reject(thError);
            });
    }

    private markLoadedBookingAsCheckedOut() {
        this._loadedBooking.confirmationStatus = BookingConfirmationStatus.CheckedOut;
        let timestamp = ThTimestampDO​​.buildThTimestampForTimezone(this._loadedHotel.timezone);
        this._loadedBooking.checkOutUtcTimestamp = timestamp.getUtcTimestamp();
        this._loadedBooking.bookingHistory.logDocumentAction(DocumentActionDO.buildDocumentActionDO({
            actionParameterMap: {},
            actionString: "The room was checked out."
        }));
    }
    private markLoadedRoomAsDirtyIfClean() {
        if (this._loadedRoom.maintenanceStatus !== RoomMaintenanceStatus.Clean) {
            return;
        }
        this._loadedRoom.maintenanceStatus = RoomMaintenanceStatus.Dirty;
        this._loadedRoom.maintenanceMessage = "";

        var maintenanceAction = DocumentActionDO.buildDocumentActionDO({
            actionParameterMap: {},
            actionString: "The room was marked as Dirty (Checked Out)",
            userId: this._sessionContext.sessionDO.user.id
        });
        this._loadedRoom.logCurrentMaintenanceHistory(maintenanceAction);
    }
}