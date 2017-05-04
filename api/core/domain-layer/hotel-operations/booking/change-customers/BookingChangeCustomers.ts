import {ThLogger, ThLogLevel} from '../../../../utils/logging/ThLogger';
import {ThError} from '../../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../../utils/th-responses/ThResponse';
import {AppContext} from '../../../../utils/AppContext';
import {SessionContext} from '../../../../utils/SessionContext';
import {BookingDO} from '../../../../data-layer/bookings/data-objects/BookingDO';
import {BookingDOConstraints} from '../../../../data-layer/bookings/data-objects/BookingDOConstraints';
import {DocumentActionDO} from '../../../../data-layer/common/data-objects/document-history/DocumentActionDO';
import {ValidationResultParser} from '../../../common/ValidationResultParser';
import {CustomerIdValidator} from '../../../customers/validators/CustomerIdValidator';
import {CustomersContainer} from '../../../customers/validators/results/CustomersContainer';
import {BookingChangeCustomersDO} from './BookingChangeCustomersDO';
import {BookingUtils} from '../../../bookings/utils/BookingUtils';
import {BookingWithDependenciesLoader} from '../utils/BookingWithDependenciesLoader';
import {BookingWithDependencies} from '../utils/BookingWithDependencies';
import {BusinessValidationRuleContainer} from '../../../common/validation-rules/BusinessValidationRuleContainer';
import {BookingCustomersValidationRule} from '../../../bookings/validators/validation-rules/booking/BookingCustomersValidationRule';
import {BookingAllotmentValidationRule, BookingAllotmentValidationParams} from '../../../bookings/validators/validation-rules/booking/BookingAllotmentValidationRule';

import _ = require('underscore');

export class BookingChangeCustomers {
    private _bookingUtils: BookingUtils;

    private _bookingChangeCustomersDO: BookingChangeCustomersDO;

    private _loadedCustomersContainer: CustomersContainer;
    private _loadedBooking: BookingDO;
    private _bookingWithDependencies: BookingWithDependencies;

    constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
        this._bookingUtils = new BookingUtils();
    }

    public changeCustomers(bookingChangeCustomersDO: BookingChangeCustomersDO): Promise<BookingDO> {
        this._bookingChangeCustomersDO = bookingChangeCustomersDO;
        return new Promise<BookingDO>((resolve: { (result: BookingDO): void }, reject: { (err: ThError): void }) => {
            this.changeCustomersCore(resolve, reject);
        });
    }
    private changeCustomersCore(resolve: { (result: BookingDO): void }, reject: { (err: ThError): void }) {
        var validationResult = BookingChangeCustomersDO.getValidationStructure().validateStructure(this._bookingChangeCustomersDO);
        if (!validationResult.isValid()) {
            var parser = new ValidationResultParser(validationResult, this._bookingChangeCustomersDO);
            parser.logAndReject("Error validating change booking customers fields", reject);
            return;
        }
        this._bookingChangeCustomersDO.customerIdList = _.uniq(this._bookingChangeCustomersDO.customerIdList);

        var customerValidator = new CustomerIdValidator(this._appContext, this._sessionContext);
        var customerIdListToValidate = this._bookingChangeCustomersDO.customerIdList
        customerValidator.validateCustomerIdList(customerIdListToValidate).then((customersContainer: CustomersContainer) => {
            this._loadedCustomersContainer = customersContainer;

            var bookingLoader = new BookingWithDependenciesLoader(this._appContext, this._sessionContext);
            return bookingLoader.load(this._bookingChangeCustomersDO.groupBookingId, this._bookingChangeCustomersDO.bookingId);
        }).then((bookingWithDependencies: BookingWithDependencies) => {
            this._bookingWithDependencies = bookingWithDependencies;
            this._loadedBooking = bookingWithDependencies.bookingDO;

            if (!this.bookingHasValidStatus()) {
                var thError = new ThError(ThStatusCode.BookingChangeCustomersInvalidState, null);
                ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "change customers: invalid booking state", this._bookingChangeCustomersDO, thError);
                throw thError;
            }

            this.updateBooking();

            var bookingValidationRule = new BusinessValidationRuleContainer([
                new BookingCustomersValidationRule(this._loadedCustomersContainer),
                new BookingAllotmentValidationRule(this._appContext, this._sessionContext, this.getBookingAllotmentValidationParams())
            ]);
            return bookingValidationRule.isValidOn(this._loadedBooking);
        }).then((validatedBooking: BookingDO) => {
            var bookingsRepo = this._appContext.getRepositoryFactory().getBookingRepository();
            return bookingsRepo.updateBooking({ hotelId: this._sessionContext.sessionDO.hotel.id }, {
                groupBookingId: this._loadedBooking.groupBookingId,
                bookingId: this._loadedBooking.bookingId,
                versionId: this._loadedBooking.versionId
            }, this._loadedBooking);
        }).then((updatedBooking: BookingDO) => {
            resolve(updatedBooking);
        }).catch((error: any) => {
            var thError = new ThError(ThStatusCode.BookingChangeCustomersError, error);
            if (thError.isNativeError()) {
                ThLogger.getInstance().logError(ThLogLevel.Error, "error changing booking customers", this._bookingChangeCustomersDO, thError);
            }
            reject(thError);
        });
    }
    private bookingHasValidStatus(): boolean {
        return _.contains(BookingDOConstraints.ConfirmationStatuses_CanChangeCustomers, this._loadedBooking.confirmationStatus);
    }
    private updateBooking() {
        this._loadedBooking.customerIdList = this._bookingChangeCustomersDO.customerIdList;
        this._bookingUtils.updateIndexedSearchTerms(this._loadedBooking, this._loadedCustomersContainer);
        this._bookingUtils.updateDisplayCustomerId(this._loadedBooking, this._loadedCustomersContainer);
        this._bookingUtils.updateCorporateDisplayCustomerId(this._loadedBooking, this._loadedCustomersContainer);
        this._loadedBooking.bookingHistory.logDocumentAction(DocumentActionDO.buildDocumentActionDO({
            actionParameterMap: {},
            actionString: "The customers from the booking have been changed",
            userId: this._sessionContext.sessionDO.user.id
        }));
    }
    private getBookingAllotmentValidationParams(): BookingAllotmentValidationParams {
        return {
            allotmentsContainer: this._bookingWithDependencies.allotmentsContainer,
            allotmentConstraintsParam: {
                bookingInterval: this._bookingWithDependencies.bookingDO.interval,
                bookingCreationDate: this._bookingWithDependencies.bookingDO.creationDate
            },
            transientBookingList: [],
            roomList: this._bookingWithDependencies.roomList
        };
    }
}