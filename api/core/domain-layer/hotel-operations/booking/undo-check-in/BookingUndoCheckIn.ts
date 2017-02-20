import { ThLogger, ThLogLevel } from '../../../../utils/logging/ThLogger';
import { ThError } from '../../../../utils/th-responses/ThError';
import { ThStatusCode } from '../../../../utils/th-responses/ThResponse';
import { AppContext } from '../../../../utils/AppContext';
import { SessionContext } from '../../../../utils/SessionContext';
import { ValidationResultParser } from '../../../common/ValidationResultParser';
import { ThTimestampDO } from '../../../../utils/th-dates/data-objects/ThTimestampDO';
import { ThHourDO } from '../../../../utils/th-dates/data-objects/ThHourDO';
import { HotelDO } from '../../../../data-layer/hotel/data-objects/HotelDO';
import { BookingDO, BookingConfirmationStatus } from '../../../../data-layer/bookings/data-objects/BookingDO';
import { BookingDOConstraints } from '../../../../data-layer/bookings/data-objects/BookingDOConstraints';
import { BookingStateChangeTriggerTimeDO, BookingStateChangeTriggerType } from '../../../../data-layer/bookings/data-objects/state-change-time/BookingStateChangeTriggerTimeDO';
import { DocumentActionDO } from '../../../../data-layer/common/data-objects/document-history/DocumentActionDO';
import { BookingUtils } from '../../../bookings/utils/BookingUtils';
import { ThDateUtils } from '../../../../utils/th-dates/ThDateUtils';
import { BookingWithDependenciesLoader } from '../utils/BookingWithDependenciesLoader';
import { BookingWithDependencies } from '../utils/BookingWithDependencies';
import { BookingUndoCheckInDO } from './BookingUndoCheckInDO';

export class BookingUndoCheckIn {
    private _bookingUtils: BookingUtils;
    private _thDateUtils: ThDateUtils;
    private _bookingUndoCheckInDO: BookingUndoCheckInDO;

    private _loadedHotel: HotelDO;
    private _currentHotelTimestamp: ThTimestampDO;
    private _bookingWithDependencies: BookingWithDependencies;

    constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
        this._bookingUtils = new BookingUtils();
        this._thDateUtils = new ThDateUtils();
    }

    public undo(bookingUndoCheckInDO: BookingUndoCheckInDO): Promise<BookingDO> {
        this._bookingUndoCheckInDO = bookingUndoCheckInDO;
        return new Promise<BookingDO>((resolve: { (result: BookingDO): void }, reject: { (err: ThError): void }) => {
            this.undoCore(resolve, reject);
        });
    }

    private undoCore(resolve: { (result: BookingDO): void }, reject: { (err: ThError): void }) {
        var validationResult = BookingUndoCheckInDO.getValidationStructure().validateStructure(this._bookingUndoCheckInDO);
        if (!validationResult.isValid()) {
            var parser = new ValidationResultParser(validationResult, this._bookingUndoCheckInDO);
            parser.logAndReject("Error validating undo checkin fields", reject);
            return;
        }

        let hotelRepository = this._appContext.getRepositoryFactory().getHotelRepository();
        hotelRepository.getHotelById(this._sessionContext.sessionDO.hotel.id)
            .then((loadedHotel: HotelDO) => {
                this._loadedHotel = loadedHotel;
                this._currentHotelTimestamp = ThTimestampDO.buildThTimestampForTimezone(this._loadedHotel.timezone);

                var bookingLoader = new BookingWithDependenciesLoader(this._appContext, this._sessionContext);
                return bookingLoader.load(this._bookingUndoCheckInDO.groupBookingId, this._bookingUndoCheckInDO.bookingId);
            }).then((bookingWithDependencies: BookingWithDependencies) => {
                this._bookingWithDependencies = bookingWithDependencies;

                if (!this.bookingHasValidStatus()) {
                    var thError = new ThError(ThStatusCode.BookingUndoCheckInInvalidState, null);
                    ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "undo checkin: invalid booking state", this._bookingUndoCheckInDO, thError);
                    throw thError;
                }
                if (this._bookingWithDependencies.hasClosedInvoice()) {
                    var thError = new ThError(ThStatusCode.BookingUndoCheckInPaidInvoice, null);
                    ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "undo checkin: paid invoice", this._bookingUndoCheckInDO, thError);
                    throw thError;
                }
                if (!this._currentHotelTimestamp.thDateDO.isSame(this._bookingWithDependencies.bookingDO.interval.start)) {
                    var thError = new ThError(ThStatusCode.BookingUndoCheckInStartDateMustMatchHotelDate, null);
                    ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "undo checkin: start date must match property's current date", this._bookingUndoCheckInDO, thError);
                    throw thError;
                }

                this.updateBooking();

                var bookingsRepo = this._appContext.getRepositoryFactory().getBookingRepository();
                return bookingsRepo.updateBooking({ hotelId: this._sessionContext.sessionDO.hotel.id }, {
                    groupBookingId: this._bookingWithDependencies.bookingDO.groupBookingId,
                    bookingId: this._bookingWithDependencies.bookingDO.bookingId,
                    versionId: this._bookingWithDependencies.bookingDO.versionId
                }, this._bookingWithDependencies.bookingDO);
            }).then((updatedBooking: BookingDO) => {
                resolve(updatedBooking);
            }).catch((error: any) => {
                var thError = new ThError(ThStatusCode.BookingUndoCheckInError, error);
                if (thError.isNativeError()) {
                    ThLogger.getInstance().logError(ThLogLevel.Error, "error undoing check in", this._bookingUndoCheckInDO, thError);
                }
                reject(thError);
            });
    }
    private bookingHasValidStatus(): boolean {
        return _.contains(BookingDOConstraints.ConfirmationStatuses_CanUndoCheckIn, this._bookingWithDependencies.bookingDO.confirmationStatus);
    }

    private updateBooking() {
        if (this.hasPenalty()) {
            this._bookingWithDependencies.bookingDO.confirmationStatus = BookingConfirmationStatus.Guaranteed;
        }
        else {
            this._bookingWithDependencies.bookingDO.confirmationStatus = BookingConfirmationStatus.Confirmed;
        }
        this._bookingWithDependencies.bookingDO.noShowTime = new BookingStateChangeTriggerTimeDO();
        this._bookingWithDependencies.bookingDO.noShowTime.type = BookingStateChangeTriggerType.ExactTimestamp;
        var noShowTimestamp = this.getNewNoShowTimestamp();
        this._bookingWithDependencies.bookingDO.noShowTime.thTimestamp = noShowTimestamp;
        this._bookingWithDependencies.bookingDO.noShowTime.utcTimestamp = noShowTimestamp.getUtcTimestamp();
        this._bookingWithDependencies.bookingDO.roomId = null;

        this._bookingWithDependencies.bookingDO.bookingHistory.logDocumentAction(DocumentActionDO.buildDocumentActionDO({
            actionParameterMap: {},
            actionString: "The check in has been undone.",
            userId: this._sessionContext.sessionDO.user.id
        }));
    }
    private hasPenalty(): boolean {
        return this._bookingUtils.hasPenalty(this._bookingWithDependencies.bookingDO, {
            cancellationHour: this._loadedHotel.operationHours.cancellationHour,
            currentHotelTimestamp: this._currentHotelTimestamp
        });
    }
    private getNewNoShowTimestamp(): ThTimestampDO {
        var noShowTimestamp = ThTimestampDO.buildThTimestampDO(this._currentHotelTimestamp.thDateDO, ThHourDO.buildThHourDO(this._currentHotelTimestamp.thHourDO.hour, 0));
        noShowTimestamp = this._thDateUtils.addThirtyMinutesToThTimestampDO(noShowTimestamp);
        noShowTimestamp = this._thDateUtils.addThirtyMinutesToThTimestampDO(noShowTimestamp);
        noShowTimestamp = this._thDateUtils.addThirtyMinutesToThTimestampDO(noShowTimestamp);
        noShowTimestamp = this._thDateUtils.addThirtyMinutesToThTimestampDO(noShowTimestamp);
        return noShowTimestamp;
    }
}