import {ThLogger, ThLogLevel} from '../../../../utils/logging/ThLogger';
import {ThError} from '../../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../../utils/th-responses/ThResponse';
import {AppContext} from '../../../../utils/AppContext';
import {SessionContext} from '../../../../utils/SessionContext';
import {BookingChangeDetailsDO} from './BookingChangeDetailsDO';
import {BookingDO} from '../../../../data-layer/bookings/data-objects/BookingDO';
import {BookingDOConstraints} from '../../../../data-layer/bookings/data-objects/BookingDOConstraints';
import {ValidationResultParser} from '../../../common/ValidationResultParser';
import {DocumentActionDO} from '../../../../data-layer/common/data-objects/document-history/DocumentActionDO';

import _ = require('underscore');

export class BookingChangeDetails {
    private _changeDetailsDO: BookingChangeDetailsDO;

    private _loadedBooking: BookingDO;

    constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
    }

    public changeDetails(changeDetailsDO: BookingChangeDetailsDO): Promise<BookingDO> {
        this._changeDetailsDO = changeDetailsDO;
        return new Promise<BookingDO>((resolve: { (result: BookingDO): void }, reject: { (err: ThError): void }) => {
            this.changeDetailsCore(resolve, reject);
        });
    }
    private changeDetailsCore(resolve: { (result: BookingDO): void }, reject: { (err: ThError): void }) {
        var validationResult = BookingChangeDetailsDO.getValidationStructure().validateStructure(this._changeDetailsDO);
        if (!validationResult.isValid()) {
            var parser = new ValidationResultParser(validationResult, this._changeDetailsDO);
            parser.logAndReject("Error validating change details fields", reject);
            return;
        }

        var bookingsRepo = this._appContext.getRepositoryFactory().getBookingRepository();
        bookingsRepo.getBookingById({ hotelId: this._sessionContext.sessionDO.hotel.id }, this._changeDetailsDO.groupBookingId, this._changeDetailsDO.bookingId)
            .then((booking: BookingDO) => {
                this._loadedBooking = booking;

                if (!this.bookingHasValidStatus()) {
                    var thError = new ThError(ThStatusCode.BookingChangeDetailsInvalidState, null);
                    ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "change details: invalid booking state", this._changeDetailsDO, thError);
                    throw thError;
                }
                this.updateDetailsOnLoadedBooking();

                var bookingsRepo = this._appContext.getRepositoryFactory().getBookingRepository();
                return bookingsRepo.updateBooking({ hotelId: this._sessionContext.sessionDO.hotel.id }, {
                    groupBookingId: this._loadedBooking.groupBookingId,
                    bookingId: this._loadedBooking.bookingId,
                    versionId: this._loadedBooking.versionId
                }, this._loadedBooking);
            }).then((updatedBooking: BookingDO) => {
                resolve(updatedBooking);
            }).catch((error: any) => {
                var thError = new ThError(ThStatusCode.BookingChangeDetailsError, error);
                if (thError.isNativeError()) {
                    ThLogger.getInstance().logError(ThLogLevel.Error, "error changing details for booking", this._changeDetailsDO, thError);
                }
                reject(thError);
            });
    }
    private bookingHasValidStatus(): boolean {
        return _.contains(BookingDOConstraints.ConfirmationStatuses_CanChangeDetails, this._loadedBooking.confirmationStatus);
    }
    private updateDetailsOnLoadedBooking() {
        this._loadedBooking.notes = this._changeDetailsDO.notes;
        this._loadedBooking.fileAttachmentList = this._changeDetailsDO.fileAttachmentList;
        this._loadedBooking.bookingHistory.logDocumentAction(DocumentActionDO.buildDocumentActionDO({
            actionParameterMap: {},
            actionString: "The details of the booking have been changed",
            userId: this._sessionContext.sessionDO.user.id
        }));
    }
}