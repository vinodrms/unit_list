import _ = require('underscore');
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
import { BookingInvoiceSync } from "../../../bookings/invoice-sync/BookingInvoiceSync";
import { BookingWithDependencies } from "../utils/BookingWithDependencies";
import { BookingWithDependenciesLoader } from "../utils/BookingWithDependenciesLoader";
import { InvoiceDO } from "../../../../data-layer/invoices/data-objects/InvoiceDO";

export class BookingChangeDetails {
    private bookingInvoiceSync: BookingInvoiceSync;
    private changeDetailsDO: BookingChangeDetailsDO;

    private bookingWithDependencies: BookingWithDependencies;
    private updatedBooking: BookingDO;

    constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
        this.bookingInvoiceSync = new BookingInvoiceSync(this._appContext, this._sessionContext);
    }

    public changeDetails(changeDetailsDO: BookingChangeDetailsDO): Promise<BookingDO> {
        this.changeDetailsDO = changeDetailsDO;
        return new Promise<BookingDO>((resolve: { (result: BookingDO): void }, reject: { (err: ThError): void }) => {
            this.changeDetailsCore(resolve, reject);
        });
    }
    private changeDetailsCore(resolve: { (result: BookingDO): void }, reject: { (err: ThError): void }) {
        var validationResult = BookingChangeDetailsDO.getValidationStructure().validateStructure(this.changeDetailsDO);
        if (!validationResult.isValid()) {
            var parser = new ValidationResultParser(validationResult, this.changeDetailsDO);
            parser.logAndReject("Error validating change details fields", reject);
            return;
        }
        var bookingLoader = new BookingWithDependenciesLoader(this._appContext, this._sessionContext);
        bookingLoader.load(this.changeDetailsDO.groupBookingId, this.changeDetailsDO.id)
            .then((bookingWithDependencies: BookingWithDependencies) => {
                this.bookingWithDependencies = bookingWithDependencies;

                if (!this.bookingHasValidStatusForBookingNotesAndAttachmentsUpdate()) {
                    var thError = new ThError(ThStatusCode.BookingChangeDetailsInvalidState, null);
                    ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "change details: invalid booking state", this.changeDetailsDO, thError);
                    throw thError;
                }

                this.updateDetailsOnLoadedBooking();

                var bookingsRepo = this._appContext.getRepositoryFactory().getBookingRepository();
                return bookingsRepo.updateBooking({ hotelId: this._sessionContext.sessionDO.hotel.id }, {
                    groupBookingId: this.bookingWithDependencies.bookingDO.groupBookingId,
                    bookingId: this.bookingWithDependencies.bookingDO.id,
                    versionId: this.bookingWithDependencies.bookingDO.versionId
                }, this.bookingWithDependencies.bookingDO);
            }).then((updatedBooking: BookingDO) => {
                this.updatedBooking = updatedBooking;
                resolve(this.updatedBooking);
            }).catch((error: any) => {
                var thError = new ThError(ThStatusCode.BookingChangeDetailsError, error);
                if (thError.isNativeError()) {
                    ThLogger.getInstance().logError(ThLogLevel.Error, "error changing details for booking", this.changeDetailsDO, thError);
                }
                reject(thError);
            });
    }
    private bookingHasValidStatusForBookingNotesAndAttachmentsUpdate(): boolean {
        return _.contains(BookingDOConstraints.ConfirmationStatuses_CanChangeDetails, this.bookingWithDependencies.bookingDO.confirmationStatus);
    }

    private updateDetailsOnLoadedBooking() {
        this.bookingWithDependencies.bookingDO.externalBookingReference = this.changeDetailsDO.externalBookingReference;
        this.bookingWithDependencies.bookingDO.notes = this.changeDetailsDO.notes;
        if (!this.bookingWithDependencies.hasClosedInvoice()) {
            this.bookingWithDependencies.bookingDO.invoiceNotes = this.changeDetailsDO.invoiceNotes;
        }
        this.bookingWithDependencies.bookingDO.fileAttachmentList = this.changeDetailsDO.fileAttachmentList;
        this.bookingWithDependencies.bookingDO.travelActivityType = this.changeDetailsDO.travelActivityType;
        this.bookingWithDependencies.bookingDO.travelType = this.changeDetailsDO.travelType;
        this.bookingWithDependencies.bookingDO.bookingHistory.logDocumentAction(DocumentActionDO.buildDocumentActionDO({
            actionParameterMap: {},
            actionString: "The details of the booking have been changed",
            userId: this._sessionContext.sessionDO.user.id
        }));
    }
}
