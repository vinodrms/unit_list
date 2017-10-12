import { BookingChangeGuestOnInvoiceDO } from "./BookingChangeGuestOnInvoiceDO";
import { BookingUtils } from "../../../bookings/utils/BookingUtils";
import { CustomersContainer } from "../../../customers/validators/results/CustomersContainer";
import { BookingDO } from "../../../../data-layer/bookings/data-objects/BookingDO";
import { BookingWithDependencies } from "../utils/BookingWithDependencies";
import { AppContext } from "../../../../utils/AppContext";
import { SessionContext } from "../../../../utils/SessionContext";
import { ThError } from "../../../../utils/th-responses/ThError";
import { ValidationResultParser } from "../../../common/ValidationResultParser";
import { CustomerIdValidator } from "../../../customers/validators/CustomerIdValidator";
import { BookingWithDependenciesLoader } from "../utils/BookingWithDependenciesLoader";
import { DocumentActionDO } from "../../../../data-layer/common/data-objects/document-history/DocumentActionDO";
import { BookingDOConstraints } from "../../../../data-layer/bookings/data-objects/BookingDOConstraints";
import { ThStatusCode } from "../../../../utils/th-responses/ThResponse";
import { ThLogLevel, ThLogger } from "../../../../utils/logging/ThLogger";

import _ = require("underscore");

export class BookingChangeGuestOnInvoice {
    private _bookingUtils: BookingUtils;

    private _bookingChangeGuestOnInvoiceDO: BookingChangeGuestOnInvoiceDO;

    private _loadedCustomersContainer: CustomersContainer;
    private _loadedBooking: BookingDO;
    private _bookingWithDependencies: BookingWithDependencies;

    constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
        this._bookingUtils = new BookingUtils();
    }

    public changeGuestDisplayedOnInvoice(bookingChangeGuestOnInvoiceDO: BookingChangeGuestOnInvoiceDO): Promise<BookingDO> {
        this._bookingChangeGuestOnInvoiceDO = bookingChangeGuestOnInvoiceDO;

        return new Promise<BookingDO>((resolve: { (result: BookingDO): void }, reject: { (err: ThError): void }) => {
            this.changeGuestDisplayedOnInvoiceCore(resolve, reject);
        });
    }
    private changeGuestDisplayedOnInvoiceCore(resolve: { (result: BookingDO): void }, reject: { (err: ThError): void }) {
        var validationResult = BookingChangeGuestOnInvoiceDO.getValidationStructure().validateStructure(this._bookingChangeGuestOnInvoiceDO);

        if (!validationResult.isValid()) {
            var parser = new ValidationResultParser(validationResult, this._bookingChangeGuestOnInvoiceDO);
            parser.logAndReject("Error validating change guest displayed on invoice", reject);
            return;
        }

        var customerValidator = new CustomerIdValidator(this._appContext, this._sessionContext);
        let customerIdList = [this._bookingChangeGuestOnInvoiceDO.customerIdDisplayedOnInvoice].concat(this._bookingChangeGuestOnInvoiceDO.customerIdList);
        customerIdList = _.uniq(customerIdList);
        customerValidator.validateCustomerIdList(customerIdList).then((customersContainer: CustomersContainer) => {
            this._loadedCustomersContainer = customersContainer;

            var bookingLoader = new BookingWithDependenciesLoader(this._appContext, this._sessionContext);
            return bookingLoader.load(this._bookingChangeGuestOnInvoiceDO.groupBookingId, this._bookingChangeGuestOnInvoiceDO.id);
        }).then((bookingWithDependencies: BookingWithDependencies) => {
            this._bookingWithDependencies = bookingWithDependencies;
            this._loadedBooking = bookingWithDependencies.bookingDO;

            if (!this.bookingHasValidStatus()) {
                var thError = new ThError(ThStatusCode.BookingChangeGuestOnInvoiceInvalidState, null);
                ThLogger.getInstance().logBusiness(ThLogLevel.Warning,
                    "change guest displayed on invoice: invalid booking state",
                    this._bookingChangeGuestOnInvoiceDO,
                    thError);
                throw thError;
            }

            if (!this.guestDisplayedOnInvoiceAlreadyOnBooking()) {
                var thError = new ThError(ThStatusCode.BookingChangeGuestOnInvoiceGuestNotOnBooking, null);
                ThLogger.getInstance().logBusiness(ThLogLevel.Warning,
                    "change guest displayed on invoice: the guest that should be displayed on the invoice is not on the booking",
                    this._bookingChangeGuestOnInvoiceDO,
                    thError);
                throw thError;
            }

            this.updateBooking();

            var bookingsRepo = this._appContext.getRepositoryFactory().getBookingRepository();
            return bookingsRepo.updateBooking({ hotelId: this._sessionContext.sessionDO.hotel.id }, {
                groupBookingId: this._loadedBooking.groupBookingId,
                bookingId: this._loadedBooking.id,
                versionId: this._loadedBooking.versionId
            }, this._loadedBooking);
        }).then((updatedBooking: BookingDO) => {
            resolve(updatedBooking);
        }).catch((error: any) => {
            var thError = new ThError(ThStatusCode.BookingChangeGuestOnInvoiceError, error);
            if (thError.isNativeError()) {
                ThLogger.getInstance().logError(ThLogLevel.Error, "error changing guest displayed on invoice", this._bookingChangeGuestOnInvoiceDO, thError);
            }
            reject(thError);
        });
    }

    private guestDisplayedOnInvoiceAlreadyOnBooking(): boolean {
        return _.contains(this._loadedBooking.customerIdList, this._bookingChangeGuestOnInvoiceDO.customerIdDisplayedOnInvoice);
    }

    private bookingHasValidStatus(): boolean {
        return _.contains(BookingDOConstraints.ConfirmationStatuses_CanChangeCustomerDisplayedOnInvoice, this._loadedBooking.confirmationStatus);
    }

    private updateBooking() {
        this._loadedBooking.defaultBillingDetails.customerIdDisplayedAsGuest =
            this._bookingChangeGuestOnInvoiceDO.customerIdDisplayedOnInvoice;
        this._bookingUtils.updateDisplayCustomerId(this._loadedBooking, this._loadedCustomersContainer);

        this._loadedBooking.bookingHistory.logDocumentAction(DocumentActionDO.buildDocumentActionDO({
            actionParameterMap: {},
            actionString: "The guest customer displayed on invoice has been changed",
            userId: this._sessionContext.sessionDO.user.id
        }));
    }
}
