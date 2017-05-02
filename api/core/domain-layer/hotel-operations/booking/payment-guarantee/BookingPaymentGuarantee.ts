import {ThLogger, ThLogLevel} from '../../../../utils/logging/ThLogger';
import {ThError} from '../../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../../utils/th-responses/ThResponse';
import {AppContext} from '../../../../utils/AppContext';
import {SessionContext} from '../../../../utils/SessionContext';
import {HotelDO} from '../../../../data-layer/hotel/data-objects/HotelDO';
import {CustomerIdValidator} from '../../../customers/validators/CustomerIdValidator';
import {CustomersContainer} from '../../../customers/validators/results/CustomersContainer';
import {BookingDO} from '../../../../data-layer/bookings/data-objects/BookingDO';
import {BookingDOConstraints} from '../../../../data-layer/bookings/data-objects/BookingDOConstraints';
import {InvoicePaymentMethodDO} from '../../../../data-layer/invoices/data-objects/payers/InvoicePaymentMethodDO';
import {DocumentActionDO} from '../../../../data-layer/common/data-objects/document-history/DocumentActionDO';
import {ValidationResultParser} from '../../../common/ValidationResultParser';
import {BookingWithDependenciesLoader} from '../utils/BookingWithDependenciesLoader';
import {BookingWithDependencies} from '../utils/BookingWithDependencies';
import {BookingPaymentGuaranteeDO} from './BookingPaymentGuaranteeDO';
import {BusinessValidationRuleContainer} from '../../../common/validation-rules/BusinessValidationRuleContainer';
import {BookingBillingDetailsValidationRule} from '../../../bookings/validators/validation-rules/booking/BookingBillingDetailsValidationRule';

import _ = require('underscore');

export class BookingPaymentGuarantee {
    private _bookingPaymentGuaranteeDO: BookingPaymentGuaranteeDO;

    private _loadedHotel: HotelDO;
    private _loadedCustomersContainer: CustomersContainer;
    private _bookingWithDependencies: BookingWithDependencies;

    constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
    }

    public addPaymentGuarantee(bookingPaymentGuaranteeDO: BookingPaymentGuaranteeDO): Promise<BookingDO> {
        this._bookingPaymentGuaranteeDO = bookingPaymentGuaranteeDO;
        return new Promise<BookingDO>((resolve: { (result: BookingDO): void }, reject: { (err: ThError): void }) => {
            this.addPaymentGuaranteeCore(resolve, reject);
        });
    }
    private addPaymentGuaranteeCore(resolve: { (result: BookingDO): void }, reject: { (err: ThError): void }) {
        var validationResult = BookingPaymentGuaranteeDO.getValidationStructure().validateStructure(this._bookingPaymentGuaranteeDO);
        if (!validationResult.isValid()) {
            var parser = new ValidationResultParser(validationResult, this._bookingPaymentGuaranteeDO);
            parser.logAndReject("Error validating add booking payment guarantee fields", reject);
            return;
        }
        this._appContext.getRepositoryFactory().getHotelRepository().getHotelById(this._sessionContext.sessionDO.hotel.id)
            .then((loadedHotel: HotelDO) => {
                this._loadedHotel = loadedHotel;
                var bookingLoader = new BookingWithDependenciesLoader(this._appContext, this._sessionContext);
                return bookingLoader.load(this._bookingPaymentGuaranteeDO.groupBookingId, this._bookingPaymentGuaranteeDO.bookingId)
            }).then((bookingWithDependencies: BookingWithDependencies) => {
                this._bookingWithDependencies = bookingWithDependencies;

                var customerValidator = new CustomerIdValidator(this._appContext, this._sessionContext);
                var customerIdListToValidate = this._bookingWithDependencies.bookingDO.customerIdList;
                return customerValidator.validateCustomerIdList(customerIdListToValidate);
            }).then((loadedCustomersContainer: CustomersContainer) => {
                this._loadedCustomersContainer = loadedCustomersContainer;

                if (!this.bookingHasValidStatus()) {
                    var thError = new ThError(ThStatusCode.BookingPaymentGuaranteeInvalidState, null);
                    ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "add payment guarantee: invalid booking state", this._bookingPaymentGuaranteeDO, thError);
                    throw thError;
                }
                this.updateBooking();

                var bookingValidationRule = new BusinessValidationRuleContainer([
                    new BookingBillingDetailsValidationRule(this._loadedHotel, this._bookingWithDependencies.priceProductsContainer, this._loadedCustomersContainer)
                ]);
                return bookingValidationRule.isValidOn(this._bookingWithDependencies.bookingDO);
            }).then((validatedBooking: BookingDO) => {
                var bookingsRepo = this._appContext.getRepositoryFactory().getBookingRepository();
                return bookingsRepo.updateBooking({ hotelId: this._sessionContext.sessionDO.hotel.id }, {
                    groupBookingId: this._bookingWithDependencies.bookingDO.groupBookingId,
                    bookingId: this._bookingWithDependencies.bookingDO.id,
                    versionId: this._bookingWithDependencies.bookingDO.versionId
                }, this._bookingWithDependencies.bookingDO);
            }).then((updatedBooking: BookingDO) => {
                resolve(updatedBooking);
            }).catch((error: any) => {
                var thError = new ThError(ThStatusCode.BookingPaymentGuaranteeError, error);
                if (thError.isNativeError()) {
                    ThLogger.getInstance().logError(ThLogLevel.Error, "error adding payment guarantee on booking", this._bookingPaymentGuaranteeDO, thError);
                }
                reject(thError);
            });
    }
    private bookingHasValidStatus(): boolean {
        return _.contains(BookingDOConstraints.ConfirmationStatuses_CanAddPaymentGuarantee, this._bookingWithDependencies.bookingDO.confirmationStatus);
    }
    private updateBooking() {
        this._bookingWithDependencies.bookingDO.defaultBillingDetails.paymentGuarantee = true;
        this._bookingWithDependencies.bookingDO.defaultBillingDetails.paymentMethod = new InvoicePaymentMethodDO();
        this._bookingWithDependencies.bookingDO.defaultBillingDetails.paymentMethod.buildFromObject(this._bookingPaymentGuaranteeDO.paymentMethod);

        this._bookingWithDependencies.bookingDO.bookingHistory.logDocumentAction(DocumentActionDO.buildDocumentActionDO({
            actionParameterMap: {},
            actionString: "A payment guarantee has been added.",
            userId: this._sessionContext.sessionDO.user.id
        }));
    }
}