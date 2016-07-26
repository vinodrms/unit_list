import {ThLogger, ThLogLevel} from '../../../../utils/logging/ThLogger';
import {ThError} from '../../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../../utils/th-responses/ThResponse';
import {AppContext} from '../../../../utils/AppContext';
import {SessionContext} from '../../../../utils/SessionContext';
import {BookingChangeNoShowTimeDO} from './BookingChangeNoShowTimeDO';
import {BookingDO, BookingConfirmationStatus} from '../../../../data-layer/bookings/data-objects/BookingDO';
import {BookingStateChangeTriggerTimeDO, BookingStateChangeTriggerType} from '../../../../data-layer/bookings/data-objects/state-change-time/BookingStateChangeTriggerTimeDO';
import {BookingDOConstraints} from '../../../../data-layer/bookings/data-objects/BookingDOConstraints';
import {ValidationResultParser} from '../../../common/ValidationResultParser';
import {ThTimestampDO} from '../../../../utils/th-dates/data-objects/ThTimestampDO';
import {DocumentActionDO} from '../../../../data-layer/common/data-objects/document-history/DocumentActionDO';

import _ = require('underscore');

export class BookingChangeNoShowTime {
    private _changeNoShowTimeDO: BookingChangeNoShowTimeDO;

    private _loadedBooking: BookingDO;

    constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
    }

    public changeNoShowTime(changeNoShowTimeDO: BookingChangeNoShowTimeDO): Promise<BookingDO> {
        this._changeNoShowTimeDO = changeNoShowTimeDO;
        return new Promise<BookingDO>((resolve: { (result: BookingDO): void }, reject: { (err: ThError): void }) => {
            this.changeNoShowTimeCore(resolve, reject);
        });
    }
    private changeNoShowTimeCore(resolve: { (result: BookingDO): void }, reject: { (err: ThError): void }) {
        var validationResult = BookingChangeNoShowTimeDO.getValidationStructure().validateStructure(this._changeNoShowTimeDO);
        if (!validationResult.isValid()) {
            var parser = new ValidationResultParser(validationResult, this._changeNoShowTimeDO);
            parser.logAndReject("Error validating change no show time fields", reject);
            return;
        }
        this._changeNoShowTimeDO.noShowTimestamp = this.getParsedThTimestamp();

        var bookingsRepo = this._appContext.getRepositoryFactory().getBookingRepository();
        bookingsRepo.getBookingById({ hotelId: this._sessionContext.sessionDO.hotel.id }, this._changeNoShowTimeDO.groupBookingId, this._changeNoShowTimeDO.bookingId)
            .then((booking: BookingDO) => {
                this._loadedBooking = booking;

                if (!this.bookingHasValidStatus()) {
                    var thError = new ThError(ThStatusCode.BookingChangeNoShowTimeInvalidState, null);
                    ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "change no show time: invalid booking state", this._changeNoShowTimeDO, thError);
                    throw thError;
                }
                if (!this.noShowTimestampIsValid()) {
                    var thError = new ThError(ThStatusCode.BookingChangeNoShowTimeInvalidTime, null);
                    ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "change no show time: invalid timestamp", this._changeNoShowTimeDO, thError);
                    throw thError;
                }
                this.updateNoShowTimeOnLoadedBooking();

                var bookingsRepo = this._appContext.getRepositoryFactory().getBookingRepository();
                return bookingsRepo.updateBooking({ hotelId: this._sessionContext.sessionDO.hotel.id }, {
                    groupBookingId: this._loadedBooking.groupBookingId,
                    bookingId: this._loadedBooking.bookingId,
                    versionId: this._loadedBooking.versionId
                }, this._loadedBooking);
            }).then((updatedBooking: BookingDO) => {
                resolve(updatedBooking);
            }).catch((error: any) => {
                var thError = new ThError(ThStatusCode.BookingChangeNoShowTimeError, error);
                if (thError.isNativeError()) {
                    ThLogger.getInstance().logError(ThLogLevel.Error, "error changing no show time for booking", this._changeNoShowTimeDO, thError);
                }
                reject(thError);
            });
    }

    private getParsedThTimestamp(): ThTimestampDO {
        var timestamp = new ThTimestampDO();
        timestamp.buildFromObject(this._changeNoShowTimeDO.noShowTimestamp);
        return timestamp;
    }
    private bookingHasValidStatus(): boolean {
        return _.contains(BookingDOConstraints.ConfirmationStatuses_CanChangeNoShowTime, this._loadedBooking.confirmationStatus);
    }
    private noShowTimestampIsValid(): boolean {
        if (!this._changeNoShowTimeDO.noShowTimestamp.isValid()) { return false; }
        if (this._changeNoShowTimeDO.noShowTimestamp.thDateDO.isBefore(this._loadedBooking.interval.start)) { return false; }
        if (this._changeNoShowTimeDO.noShowTimestamp.thDateDO.isAfter(this._loadedBooking.interval.end)) { return false; }
        return true;
    }
    private updateNoShowTimeOnLoadedBooking() {
        var noShowTriggerTime = new BookingStateChangeTriggerTimeDO();
        noShowTriggerTime.type = BookingStateChangeTriggerType.ExactTimestamp;
        noShowTriggerTime.thTimestamp = this._changeNoShowTimeDO.noShowTimestamp;
        noShowTriggerTime.utcTimestamp = this._changeNoShowTimeDO.noShowTimestamp.getUtcTimestamp();
        this._loadedBooking.noShowTime = noShowTriggerTime;
        this._loadedBooking.bookingHistory.logDocumentAction(DocumentActionDO.buildDocumentActionDO({
            actionParameterMap: { noShowTime: noShowTriggerTime.thTimestamp.toString() },
            actionString: "The booking was marked as a late arrival and will be marked as no show at %noShowTime%.",
            userId: this._sessionContext.sessionDO.user.id
        }));
    }
}