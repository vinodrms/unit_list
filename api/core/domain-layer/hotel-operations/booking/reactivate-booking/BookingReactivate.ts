import { ThLogger, ThLogLevel } from '../../../../utils/logging/ThLogger';
import { ThError } from '../../../../utils/th-responses/ThError';
import { ThStatusCode } from '../../../../utils/th-responses/ThResponse';
import { AppContext } from '../../../../utils/AppContext';
import { SessionContext } from '../../../../utils/SessionContext';
import { ThTimestampDO } from '../../../../utils/th-dates/data-objects/ThTimestampDO';
import { ThHourDO } from '../../../../utils/th-dates/data-objects/ThHourDO';
import { HotelDO } from '../../../../data-layer/hotel/data-objects/HotelDO';
import { BookingDO, BookingConfirmationStatus } from '../../../../data-layer/bookings/data-objects/BookingDO';
import { BookingDOConstraints } from '../../../../data-layer/bookings/data-objects/BookingDOConstraints';
import { InvoiceGroupDO } from '../../../../data-layer/invoices/data-objects/InvoiceGroupDO';
import { BookingStateChangeTriggerTimeDO, BookingStateChangeTriggerType } from '../../../../data-layer/bookings/data-objects/state-change-time/BookingStateChangeTriggerTimeDO';
import { CustomerIdValidator } from '../../../customers/validators/CustomerIdValidator';
import { CustomersContainer } from '../../../customers/validators/results/CustomersContainer';
import { DocumentActionDO } from '../../../../data-layer/common/data-objects/document-history/DocumentActionDO';
import { BookingWithDependenciesLoader } from '../utils/BookingWithDependenciesLoader';
import { BookingWithDependencies } from '../utils/BookingWithDependencies';
import { BookingReactivateDO } from './BookingReactivateDO';
import { ValidationResultParser } from '../../../common/ValidationResultParser';
import { BookingUtils } from '../../../bookings/utils/BookingUtils';
import { BookingInvoiceSync } from '../../../bookings/invoice-sync/BookingInvoiceSync';
import { ThDateUtils } from '../../../../utils/th-dates/ThDateUtils';
import { NewBookingsValidationRules } from '../../../bookings/add-bookings/utils/NewBookingsValidationRules';

import _ = require('underscore');

export class BookingReactivate {
    private _bookingUtils: BookingUtils;
    private _bookingInvoiceSync: BookingInvoiceSync;
    private _thDateUtils: ThDateUtils;

    private _reactivateDO: BookingReactivateDO;

    private _loadedHotel: HotelDO;
    private _currentHotelTimestamp: ThTimestampDO;
    private _bookingWithDependencies: BookingWithDependencies;
    private _loadedCustomersContainer: CustomersContainer;

    constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
        this._bookingUtils = new BookingUtils();
        this._bookingInvoiceSync = new BookingInvoiceSync(this._appContext, this._sessionContext);
        this._thDateUtils = new ThDateUtils();
    }

    public reactivate(reactivateDO: BookingReactivateDO): Promise<BookingDO> {
        this._reactivateDO = reactivateDO;
        return new Promise<BookingDO>((resolve: { (result: BookingDO): void }, reject: { (err: ThError): void }) => {
            this.reactivateCore(resolve, reject);
        });
    }
    private reactivateCore(resolve: { (result: BookingDO): void }, reject: { (err: ThError): void }) {
        var validationResult = BookingReactivateDO.getValidationStructure().validateStructure(this._reactivateDO);
        if (!validationResult.isValid()) {
            var parser = new ValidationResultParser(validationResult, this._reactivateDO);
            parser.logAndReject("Error validating reactivate fields", reject);
            return;
        }

        this._appContext.getRepositoryFactory().getHotelRepository().getHotelById(this._sessionContext.sessionDO.hotel.id)
            .then((loadedHotel: HotelDO) => {
                this._loadedHotel = loadedHotel;
                this._currentHotelTimestamp = ThTimestampDO.buildThTimestampForTimezone(this._loadedHotel.timezone);

                var bookingLoader = new BookingWithDependenciesLoader(this._appContext, this._sessionContext);
                return bookingLoader.load(this._reactivateDO.groupBookingId, this._reactivateDO.bookingId)
            })
            .then((bookingWithDependencies: BookingWithDependencies) => {
                this._bookingWithDependencies = bookingWithDependencies;

                if (!this.bookingHasValidStatus()) {
                    var thError = new ThError(ThStatusCode.BookingReactivateInvalidState, null);
                    ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "reactivate: invalid booking state", this._reactivateDO, thError);
                    throw thError;
                }
                if (this._bookingWithDependencies.bookingDO.interval.end.isBefore(this._currentHotelTimestamp.thDateDO)) {
                    var thError = new ThError(ThStatusCode.BookingReactivateEndDateInThePast, null);
                    ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "reactivate: end date in the past", this._reactivateDO, thError);
                    throw thError;
                }
                if (this._bookingWithDependencies.hasClosedInvoice()) {
                    var thError = new ThError(ThStatusCode.BookingReactivatePaidInvoice, null);
                    ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "reactivate: paid invoice", this._reactivateDO, thError);
                    throw thError;
                }

                this.updateBooking();

                var customerValidator = new CustomerIdValidator(this._appContext, this._sessionContext);
                var customerIdListToValidate = this._bookingWithDependencies.bookingDO.customerIdList;
                return customerValidator.validateCustomerIdList(customerIdListToValidate);
            }).then((customersContainer: CustomersContainer) => {
                this._loadedCustomersContainer = customersContainer;

                var newBookingValidationRules = new NewBookingsValidationRules(this._appContext, this._sessionContext, {
                    hotel: this._loadedHotel,
                    priceProductsContainer: this._bookingWithDependencies.priceProductsContainer,
                    customersContainer: this._loadedCustomersContainer,
                    allotmentsContainer: this._bookingWithDependencies.allotmentsContainer,
                    roomList: this._bookingWithDependencies.roomList,
                    roomCategoryStatsList: this._bookingWithDependencies.roomCategoryStatsList
                });
                return newBookingValidationRules.validateBookingList([this._bookingWithDependencies.bookingDO]);
            }).then((validatedBookingList: BookingDO[]) => {
                var bookingsRepo = this._appContext.getRepositoryFactory().getBookingRepository();
                return bookingsRepo.updateBooking({ hotelId: this._sessionContext.sessionDO.hotel.id }, {
                    groupBookingId: this._bookingWithDependencies.bookingDO.groupBookingId,
                    bookingId: this._bookingWithDependencies.bookingDO.bookingId,
                    versionId: this._bookingWithDependencies.bookingDO.versionId
                }, this._bookingWithDependencies.bookingDO);
            }).then((updatedBooking: BookingDO) => {
                this._bookingWithDependencies.bookingDO = updatedBooking;
                return this._bookingInvoiceSync.syncInvoiceWithBookingPrice(updatedBooking);
            }).then((updatedGroup: InvoiceGroupDO) => {
                resolve(this._bookingWithDependencies.bookingDO);
            }).catch((error: any) => {
                var thError = new ThError(ThStatusCode.BookingReactivateError, error);
                if (thError.isNativeError()) {
                    ThLogger.getInstance().logError(ThLogLevel.Error, "error reactivating booking", this._reactivateDO, thError);
                }
                reject(thError);
            });
    }
    private bookingHasValidStatus(): boolean {
        return _.contains(BookingDOConstraints.ConfirmationStatuses_CanReactivate, this._bookingWithDependencies.bookingDO.confirmationStatus);
    }
    private updateBooking() {
        if (this.hasPenalty()) {
            this._bookingWithDependencies.bookingDO.confirmationStatus = BookingConfirmationStatus.Guaranteed;
        }
        else {
            this._bookingWithDependencies.bookingDO.confirmationStatus = BookingConfirmationStatus.Confirmed;
        }
        this._bookingUtils.updateBookingPriceUsingRoomCategoryAndSavePPSnapshot(this._bookingWithDependencies.bookingDO,
            this._bookingWithDependencies.roomCategoryStatsList, this._bookingWithDependencies.priceProductDO,
            this._bookingWithDependencies.billingCustomer);

        this._bookingWithDependencies.bookingDO.noShowTime = new BookingStateChangeTriggerTimeDO();
        this._bookingWithDependencies.bookingDO.noShowTime.type = BookingStateChangeTriggerType.ExactTimestamp;
        var noShowTimestamp = this.getNewNoShowTimestamp();
        this._bookingWithDependencies.bookingDO.noShowTime.thTimestamp = noShowTimestamp;
        this._bookingWithDependencies.bookingDO.noShowTime.utcTimestamp = noShowTimestamp.getUtcTimestamp();

        this._bookingWithDependencies.bookingDO.bookingHistory.logDocumentAction(DocumentActionDO.buildDocumentActionDO({
            actionParameterMap: {},
            actionString: "The booking has been reactivated.",
            userId: this._sessionContext.sessionDO.user.id
        }));
    }
    private hasPenalty(): boolean {
        return this._bookingUtils.hasPenalty(this._bookingWithDependencies.bookingDO, {
            cancellationHour: this._loadedHotel.operationHours.cancellationHour,
            currentHotelTimestamp: ThTimestampDO.buildThTimestampForTimezone(this._loadedHotel.timezone)
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