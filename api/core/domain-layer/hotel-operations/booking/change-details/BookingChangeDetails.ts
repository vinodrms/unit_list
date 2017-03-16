import { ThLogger, ThLogLevel } from '../../../../utils/logging/ThLogger';
import { ThError } from '../../../../utils/th-responses/ThError';
import { ThStatusCode } from '../../../../utils/th-responses/ThResponse';
import { AppContext } from '../../../../utils/AppContext';
import { SessionContext } from '../../../../utils/SessionContext';
import { BookingChangeDetailsDO } from './BookingChangeDetailsDO';
import { BookingDO } from '../../../../data-layer/bookings/data-objects/BookingDO';
import { BookingDOConstraints } from '../../../../data-layer/bookings/data-objects/BookingDOConstraints';
import { ValidationResultParser } from '../../../common/ValidationResultParser';
import { DocumentActionDO } from '../../../../data-layer/common/data-objects/document-history/DocumentActionDO';
import { BookingInvoiceUtils } from "../../../bookings/utils/BookingInvoiceUtils";
import { InvoiceGroupDO } from "../../../../data-layer/invoices/data-objects/InvoiceGroupDO";
import { BookingWithDependencies } from "../utils/BookingWithDependencies";
import { BookingWithDependenciesLoader } from "../utils/BookingWithDependenciesLoader";

import _ = require('underscore');

export class BookingChangeDetails {
    private _bookingInvoiceUtils: BookingInvoiceUtils;
    private _changeDetailsDO: BookingChangeDetailsDO;

    private _updatedBooking: BookingDO;
    private _bookingWithDependencies: BookingWithDependencies;
    
    constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
        this._bookingInvoiceUtils = new BookingInvoiceUtils(this._appContext, this._sessionContext);
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
        
        var bookingLoader = new BookingWithDependenciesLoader(this._appContext, this._sessionContext);
        bookingLoader.load(this._changeDetailsDO.groupBookingId, this._changeDetailsDO.bookingId)
            .then((bookingWithDependencies: BookingWithDependencies) => {
                this._bookingWithDependencies = bookingWithDependencies;

                if (!this.bookingHasValidStatusForBookingNotesAndAttachmentsUpdate()) {
                    var thError = new ThError(ThStatusCode.BookingChangeDetailsInvalidState, null);
                    ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "change details: invalid booking state", this._changeDetailsDO, thError);
                    throw thError;
                }
                if (!this.bookingHasValidStatusForInvoiceNotesUpdate()) {
                    var thError = new ThError(ThStatusCode.BookingChangeInvoiceNotesInvalidState, null);
                    ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "change details: invoice already paid - cannot change invoice notes", this._changeDetailsDO, thError);
                    throw thError;
                }
                this.updateDetailsOnLoadedBooking();

                var bookingsRepo = this._appContext.getRepositoryFactory().getBookingRepository();
                return bookingsRepo.updateBooking({ hotelId: this._sessionContext.sessionDO.hotel.id }, {
                    groupBookingId: this._bookingWithDependencies.bookingDO.groupBookingId,
                    bookingId: this._bookingWithDependencies.bookingDO.bookingId,
                    versionId: this._bookingWithDependencies.bookingDO.versionId
                }, this._bookingWithDependencies.bookingDO);
            }).then((updatedBooking: BookingDO) => {
                this._updatedBooking = updatedBooking;
                return this._bookingInvoiceUtils.syncInvoiceWithBooking(updatedBooking);
            }).then((updatedGroup: InvoiceGroupDO) => {
                resolve(this._updatedBooking);
            }).catch((error: any) => {
                var thError = new ThError(ThStatusCode.BookingChangeDetailsError, error);
                if (thError.isNativeError()) {
                    ThLogger.getInstance().logError(ThLogLevel.Error, "error changing details for booking", this._changeDetailsDO, thError);
                }
                reject(thError);
            });
    }
    private bookingHasValidStatusForBookingNotesAndAttachmentsUpdate(): boolean {
        return _.contains(BookingDOConstraints.ConfirmationStatuses_CanChangeDetails, this._bookingWithDependencies.bookingDO.confirmationStatus);
    }
    private bookingHasValidStatusForInvoiceNotesUpdate(): boolean {
        return !this._bookingWithDependencies.hasClosedInvoice();
    }

    private updateDetailsOnLoadedBooking() {
        this._bookingWithDependencies.bookingDO.notes = this._changeDetailsDO.notes;
        this._bookingWithDependencies.bookingDO.invoiceNotes = this._changeDetailsDO.invoiceNotes;
        this._bookingWithDependencies.bookingDO.fileAttachmentList = this._changeDetailsDO.fileAttachmentList;
        this._bookingWithDependencies.bookingDO.bookingHistory.logDocumentAction(DocumentActionDO.buildDocumentActionDO({
            actionParameterMap: {},
            actionString: "The details of the booking have been changed",
            userId: this._sessionContext.sessionDO.user.id
        }));
    }
}