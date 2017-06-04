import { AppContext } from "../../../../utils/AppContext";
import { SessionContext } from "../../../../utils/SessionContext";
import { BookingChangeBilledCustomerDO } from "./BookingChangeBilledCustomerDO";
import { BookingDO } from "../../../../data-layer/bookings/data-objects/BookingDO";
import { ThError } from "../../../../utils/th-responses/ThError";
import { ValidationResultParser } from "../../../common/ValidationResultParser";
import { BookingWithDependenciesLoader } from "../utils/BookingWithDependenciesLoader";
import { BookingWithDependencies } from "../utils/BookingWithDependencies";
import { CustomerIdValidator } from "../../../customers/validators/CustomerIdValidator";
import { CustomersContainer } from "../../../customers/validators/results/CustomersContainer";
import { ThStatusCode } from "../../../../utils/th-responses/ThResponse";
import { ThLogger, ThLogLevel } from "../../../../utils/logging/ThLogger";
import { HotelDO } from "../../../../data-layer/hotel/data-objects/HotelDO";
import { BookingDOConstraints } from "../../../../data-layer/bookings/data-objects/BookingDOConstraints";
import { InvoicePaymentMethodDO } from "../../../../data-layer/invoices/data-objects/payers/InvoicePaymentMethodDO";
import { DocumentActionDO } from "../../../../data-layer/common/data-objects/document-history/DocumentActionDO";
import { BusinessValidationRuleContainer } from "../../../common/validation-rules/BusinessValidationRuleContainer";
import { BookingBillingDetailsValidationRule } from "../../../bookings/validators/validation-rules/booking/BookingBillingDetailsValidationRule";

import _ = require('underscore');

export class BookingChangeBilledCustomer {
    private _changeBilledCustomerDO: BookingChangeBilledCustomerDO;

    private _loadedHotel: HotelDO;
    private _loadedCustomersContainer: CustomersContainer;
    private _bookingWithDependencies: BookingWithDependencies;

    constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
    }

    public changeBilledCustomer(changeBilledCustomerDO: BookingChangeBilledCustomerDO): Promise<BookingDO> {
        this._changeBilledCustomerDO = changeBilledCustomerDO;
        return new Promise<BookingDO>((resolve: { (result: BookingDO): void }, reject: { (err: ThError): void }) => {
            this.changeBilledCustomerCore(resolve, reject);
        });
    }

    private changeBilledCustomerCore(resolve: { (result: BookingDO): void }, reject: { (err: ThError): void }) {
        var validationResult = BookingChangeBilledCustomerDO.getValidationStructure().validateStructure(this._changeBilledCustomerDO);
        if (!validationResult.isValid()) {
            var parser = new ValidationResultParser(validationResult, this._changeBilledCustomerDO);
            parser.logAndReject("Error validating change billed customer fields", reject);
            return;
        }

        this._appContext.getRepositoryFactory().getHotelRepository().getHotelById(this._sessionContext.sessionDO.hotel.id)
            .then((loadedHotel: HotelDO) => {
                this._loadedHotel = loadedHotel;

                var bookingLoader = new BookingWithDependenciesLoader(this._appContext, this._sessionContext);
                return bookingLoader.load(this._changeBilledCustomerDO.groupBookingId, this._changeBilledCustomerDO.id);
            }).then((bookingWithDependencies: BookingWithDependencies) => {
                this._bookingWithDependencies = bookingWithDependencies;

                var customerValidator = new CustomerIdValidator(this._appContext, this._sessionContext);
                var customerIdListToValidate = this._bookingWithDependencies.bookingDO.customerIdList;
                return customerValidator.validateCustomerIdList(customerIdListToValidate);
            }).then((loadedCustomersContainer: CustomersContainer) => {
                this._loadedCustomersContainer = loadedCustomersContainer;

                if (!this.bookingHasValidConfirmationStatus()) {
                    var thError = new ThError(ThStatusCode.BookingChangeBilledCustomerInvalidState, null);
                    ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "change billed customer: invalid booking state", this._changeBilledCustomerDO, thError);
                    throw thError;
                }
                this.updateBooking();

                var bookingValidationRule = new BusinessValidationRuleContainer([
                    new BookingBillingDetailsValidationRule(this._loadedHotel, this._bookingWithDependencies.priceProductsContainer, this._loadedCustomersContainer)
                ]);
                return bookingValidationRule.isValidOn(this._bookingWithDependencies.bookingDO);
            }).then((validatedBooking: BookingDO) => {
                
                var bookingsRepo = this._appContext.getRepositoryFactory().getBookingRepository();
                
            }).catch((error: any) => {
                var thError = new ThError(ThStatusCode.BookingChangeBilledCustomerError, error);
                if (thError.isNativeError()) {
                    ThLogger.getInstance().logError(ThLogLevel.Error, "error changing the booking's billed customer", this._changeBilledCustomerDO, thError);
                }
                reject(thError);
            });
    }

    private bookingHasValidConfirmationStatus(): boolean {
        return _.contains(BookingDOConstraints.ConfirmationStatuses_CanChangeBilledCustomer, this._bookingWithDependencies.bookingDO.confirmationStatus);
    }
    private updateBooking() {
        this._bookingWithDependencies.bookingDO.defaultBillingDetails.paymentGuarantee = false;
        this._bookingWithDependencies.bookingDO.defaultBillingDetails.paymentMethod = null;
        
        this._bookingWithDependencies.bookingDO.defaultBillingDetails.customerId = this._changeBilledCustomerDO.customerId;

        this._bookingWithDependencies.bookingDO.bookingHistory.logDocumentAction(DocumentActionDO.buildDocumentActionDO({
            actionParameterMap: {},
            actionString: "The billed customer has been changed.",
            userId: this._sessionContext.sessionDO.user.id
        }));
    }
}