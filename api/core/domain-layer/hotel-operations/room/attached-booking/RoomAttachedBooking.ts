import {ThLogger, ThLogLevel} from '../../../../utils/logging/ThLogger';
import {ThError} from '../../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../../utils/th-responses/ThResponse';
import {AppContext} from '../../../../utils/AppContext';
import {SessionContext} from '../../../../utils/SessionContext';
import {ThTimestampDO} from '../../../../utils/th-dates/data-objects/ThTimestampDO';
import {RoomAttachedBookingResult, RoomAttachedBookingResultType} from './utils/RoomAttachedBookingResult';
import {RoomAttachedBookingDO} from './RoomAttachedBookingDO';
import {BookingDO} from '../../../../data-layer/bookings/data-objects/BookingDO';
import {BookingDOConstraints} from '../../../../data-layer/bookings/data-objects/BookingDOConstraints';
import {BookingSearchResultRepoDO} from '../../../../data-layer/bookings/repositories/IBookingRepository';
import {ValidationResultParser} from '../../../common/ValidationResultParser';
import {HotelTime} from '../../common/hotel-time/HotelTime';

export class RoomAttachedBooking {
    private _roomAttachedBookingDO: RoomAttachedBookingDO;

    private _currentHotelTimestamp: ThTimestampDO;

    constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
    }

    public getBooking(roomAttachedBookingDO: RoomAttachedBookingDO): Promise<RoomAttachedBookingResult> {
        this._roomAttachedBookingDO = roomAttachedBookingDO;
        return new Promise<RoomAttachedBookingResult>((resolve: { (result: RoomAttachedBookingResult): void }, reject: { (err: ThError): void }) => {
            this.getBookingCore(resolve, reject);
        });
    }
    private getBookingCore(resolve: { (result: RoomAttachedBookingResult): void }, reject: { (err: ThError): void }) {
        var validationResult = RoomAttachedBookingDO.getValidationStructure().validateStructure(this._roomAttachedBookingDO);
        if (!validationResult.isValid()) {
            var parser = new ValidationResultParser(validationResult, this._roomAttachedBookingDO);
            parser.logAndReject("Error validating room attached booking fields", reject);
            return;
        }
        var bookingRepository = this._appContext.getRepositoryFactory().getBookingRepository();
        bookingRepository.getBookingList({ hotelId: this._sessionContext.sessionDO.hotel.id }, {
            confirmationStatusList: BookingDOConstraints.ConfirmationStatuses_CheckedId,
            roomId: this._roomAttachedBookingDO.roomId
        }).then((searchResult: BookingSearchResultRepoDO) => {
            if (searchResult.bookingList.length > 0) {
                resolve(new RoomAttachedBookingResult(RoomAttachedBookingResultType.CheckedInBooking, searchResult.bookingList[0]));
                return;
            }
            this.getReservedBookingForToday(resolve, reject);
        }).catch((error: any) => {
            var thError = new ThError(ThStatusCode.RoomAttachedBookingError, error);
            if (thError.isNativeError()) {
                ThLogger.getInstance().logError(ThLogLevel.Error, "error getting attached booking", this._sessionContext, thError);
            }
            reject(thError);
        });
    }

    private getReservedBookingForToday(resolve: { (result: RoomAttachedBookingResult): void }, reject: { (err: ThError): void }) {
        var hotelTime = new HotelTime(this._appContext, this._sessionContext);
        hotelTime.getTimestamp().then((timestamp: ThTimestampDO) => {
            this._currentHotelTimestamp = timestamp;

            var bookingRepository = this._appContext.getRepositoryFactory().getBookingRepository();
            return bookingRepository.getBookingList({ hotelId: this._sessionContext.sessionDO.hotel.id }, {
                confirmationStatusList: BookingDOConstraints.ConfirmationStatuses_CanBeCheckedIn,
                startDateEq: this._currentHotelTimestamp.thDateDO,
                roomId: this._roomAttachedBookingDO.roomId
            });
        }).then((searchResult: BookingSearchResultRepoDO) => {
            if (searchResult.bookingList.length > 0) {
                resolve(new RoomAttachedBookingResult(RoomAttachedBookingResultType.ReservedBooking, searchResult.bookingList[0]));
                return;
            }
            resolve(new RoomAttachedBookingResult(RoomAttachedBookingResultType.NoBooking));
        }).catch((error: any) => {
            var thError = new ThError(ThStatusCode.RoomAttachedBookingError, error);
            if (thError.isNativeError()) {
                ThLogger.getInstance().logError(ThLogLevel.Error, "error getting attached booking", this._sessionContext, thError);
            }
            reject(thError);
        });
    }
}