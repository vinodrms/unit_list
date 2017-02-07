import { ThLogger, ThLogLevel } from '../../../../utils/logging/ThLogger';
import { ThError } from '../../../../utils/th-responses/ThError';
import { ThStatusCode } from '../../../../utils/th-responses/ThResponse';
import { AppContext } from '../../../../utils/AppContext';
import { SessionContext } from '../../../../utils/SessionContext';
import { BookingChangeDatesDO } from './BookingChangeDatesDO';
import { BookingDO, BookingConfirmationStatus } from '../../../../data-layer/bookings/data-objects/BookingDO';
import { InvoiceGroupDO } from '../../../../data-layer/invoices/data-objects/InvoiceGroupDO';
import { BookingDOConstraints } from '../../../../data-layer/bookings/data-objects/BookingDOConstraints';
import { ValidationResultParser } from '../../../common/ValidationResultParser';
import { HotelDO } from '../../../../data-layer/hotel/data-objects/HotelDO';
import { BookingIntervalValidator } from '../../../bookings/validators/BookingIntervalValidator';
import { ThDateIntervalDO } from '../../../../utils/th-dates/data-objects/ThDateIntervalDO';
import { BookingWithDependenciesLoader } from '../utils/BookingWithDependenciesLoader';
import { BookingWithDependencies } from '../utils/BookingWithDependencies';
import { BookingUtils } from '../../../bookings/utils/BookingUtils';
import { BookingInvoiceUtils } from '../../../bookings/utils/BookingInvoiceUtils';
import { DocumentActionDO } from '../../../../data-layer/common/data-objects/document-history/DocumentActionDO';
import { BusinessValidationRuleContainer } from '../../../common/validation-rules/BusinessValidationRuleContainer';
import { BookingAllotmentValidationRule, BookingAllotmentValidationParams } from '../../../bookings/validators/validation-rules/booking/BookingAllotmentValidationRule';
import { PriceProductConstraintsValidationRule, PriceProductConstraintsParams } from '../../../bookings/validators/validation-rules/price-product/PriceProductConstraintsValidationRule';
import { PriceProductYieldIntervalsValidationRule } from '../../../bookings/validators/validation-rules/price-product/PriceProductYieldIntervalsValidationRule';
import { PriceProductDO } from '../../../../data-layer/price-products/data-objects/PriceProductDO';
import { IndexedBookingInterval } from '../../../../data-layer/price-products/utils/IndexedBookingInterval';

import _ = require('underscore');

export class BookingChangeDates {
    private _bookingUtils: BookingUtils;
    private _bookingInvoiceUtils: BookingInvoiceUtils;
    private _bookingChangeDatesDO: BookingChangeDatesDO;

    private _loadedHotel: HotelDO;
    private _newBookingInterval: ThDateIntervalDO;
    private _bookingWithDependencies: BookingWithDependencies;

    constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
        this._bookingUtils = new BookingUtils();
        this._bookingInvoiceUtils = new BookingInvoiceUtils(this._appContext, this._sessionContext);
    }

    public changeDates(bookingChangeDatesDO: BookingChangeDatesDO): Promise<BookingDO> {
        this._bookingChangeDatesDO = bookingChangeDatesDO;
        return new Promise<BookingDO>((resolve: { (result: BookingDO): void }, reject: { (err: ThError): void }) => {
            this.changeDatesCore(resolve, reject);
        });
    }
    private changeDatesCore(resolve: { (result: BookingDO): void }, reject: { (err: ThError): void }) {
        var validationResult = BookingChangeDatesDO.getValidationStructure().validateStructure(this._bookingChangeDatesDO);
        if (!validationResult.isValid()) {
            var parser = new ValidationResultParser(validationResult, this._bookingChangeDatesDO);
            parser.logAndReject("Error validating change booking dates fields", reject);
            return;
        }
        this._appContext.getRepositoryFactory().getHotelRepository().getHotelById(this._sessionContext.sessionDO.hotel.id)
            .then((loadedHotel: HotelDO) => {
                this._loadedHotel = loadedHotel;

                var intervalValidator = new BookingIntervalValidator(loadedHotel);
                return intervalValidator.validateBookingInterval({
                    bookingInterval: this._bookingChangeDatesDO.interval,
                    isNewBooking: false
                });
            }).then((validatedBookingInterval: ThDateIntervalDO) => {
                this._newBookingInterval = validatedBookingInterval;

                var bookingLoader = new BookingWithDependenciesLoader(this._appContext, this._sessionContext);
                return bookingLoader.load(this._bookingChangeDatesDO.groupBookingId, this._bookingChangeDatesDO.bookingId);
            }).then((bookingWithDependencies: BookingWithDependencies) => {
                this._bookingWithDependencies = bookingWithDependencies;

                if (!this.bookingHasValidStatus()) {
                    var thError = new ThError(ThStatusCode.BookingChangeDatesInvalidState, null);
                    ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "change dates: invalid booking state", this._bookingChangeDatesDO, thError);
                    throw thError;
                }
                if (this._bookingWithDependencies.hasClosedInvoice()) {
                    var thError = new ThError(ThStatusCode.BookingChangeDatesPaidInvoice, null);
                    ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "change dates: paid invoice", this._bookingChangeDatesDO, thError);
                    throw thError;
                }
                this.updateBooking();

                var bookingValidationRule = new BusinessValidationRuleContainer([
                    new BookingAllotmentValidationRule(this._appContext, this._sessionContext, this.getBookingAllotmentValidationParams())
                ]);
                return bookingValidationRule.isValidOn(this._bookingWithDependencies.bookingDO);
            }).then((validatedBooking: BookingDO) => {
                var priceProductValidationRule = new BusinessValidationRuleContainer([
                    new PriceProductConstraintsValidationRule(this.getPriceProductConstraintsParams())
                ]);
                if (!this._bookingWithDependencies.isMadeThroughActiveAllotment()) {
                    priceProductValidationRule.addBusinessValidationRule(new PriceProductYieldIntervalsValidationRule(this._bookingWithDependencies.bookingDO.interval));
                }

                return priceProductValidationRule.isValidOn(this._bookingWithDependencies.priceProductDO);
            }).then((priceProductDO: PriceProductDO) => {
                var bookingsRepo = this._appContext.getRepositoryFactory().getBookingRepository();
                return bookingsRepo.updateBooking({ hotelId: this._sessionContext.sessionDO.hotel.id }, {
                    groupBookingId: this._bookingWithDependencies.bookingDO.groupBookingId,
                    bookingId: this._bookingWithDependencies.bookingDO.bookingId,
                    versionId: this._bookingWithDependencies.bookingDO.versionId
                }, this._bookingWithDependencies.bookingDO);
            }).then((updatedBooking: BookingDO) => {
                this._bookingWithDependencies.bookingDO = updatedBooking;
                return this._bookingInvoiceUtils.updateInvoicePriceToPay(updatedBooking);
            }).then((updatedGroup: InvoiceGroupDO) => {
                resolve(this._bookingWithDependencies.bookingDO);
            }).catch((error: any) => {
                var thError = new ThError(ThStatusCode.BookingChangeDatesError, error);
                if (thError.isNativeError()) {
                    ThLogger.getInstance().logError(ThLogLevel.Error, "error changing booking dates", this._bookingChangeDatesDO, thError);
                }
                reject(thError);
            });
    }

    private bookingHasValidStatus(): boolean {
        return _.contains(BookingDOConstraints.ConfirmationStatuses_CanChangeDates, this._bookingWithDependencies.bookingDO.confirmationStatus);
    }
    private updateBooking() {
        var oldInterval: ThDateIntervalDO = this._bookingWithDependencies.bookingDO.interval.buildPrototype();
        var oldPrice: number = this._bookingWithDependencies.bookingDO.price.totalBookingPrice;

        this._bookingWithDependencies.bookingDO.interval.end = this._newBookingInterval.end;
        if (this._bookingWithDependencies.bookingDO.confirmationStatus !== BookingConfirmationStatus.CheckedIn) {
            this._bookingWithDependencies.bookingDO.interval.start = this._newBookingInterval.start;
        }
        this._bookingUtils.updateBookingPriceUsingRoomCategory(this._bookingWithDependencies.bookingDO, this._bookingWithDependencies.roomCategoryStatsList);

        var newInterval: ThDateIntervalDO = this._bookingWithDependencies.bookingDO.interval;
        var newPrice: number = this._bookingWithDependencies.bookingDO.price.totalBookingPrice;

        if (!newInterval.start.isSame(oldInterval.start)) {
            this._bookingUtils.updateBookingGuaranteedAndNoShowTimes(this._bookingWithDependencies.bookingDO, {
                priceProduct: this._bookingWithDependencies.priceProductDO,
                hotel: this._loadedHotel,
                currentHotelTimestamp: this._bookingUtils.getCurrentThTimestampForHotel(this._loadedHotel)
            });
        }
        var indexedBookingInterval = new IndexedBookingInterval(this._bookingWithDependencies.bookingDO.interval);
        this._bookingWithDependencies.bookingDO.startUtcTimestamp = indexedBookingInterval.getStartUtcTimestamp();
        this._bookingWithDependencies.bookingDO.endUtcTimestamp = indexedBookingInterval.getEndUtcTimestamp();

        this._bookingWithDependencies.bookingDO.bookingHistory.logDocumentAction(DocumentActionDO.buildDocumentActionDO({
            actionParameterMap: { oldInterval: oldInterval.toString(), newInterval: newInterval.toString(), oldPrice: oldPrice, newPrice: newPrice },
            actionString: "The booking interval was changed from %oldInterval% to %newInterval%. The old price %oldPrice% has become %newPrice%.",
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
    private getPriceProductConstraintsParams(): PriceProductConstraintsParams {
        return {
            bookingInterval: this._bookingWithDependencies.bookingDO.interval,
            bookingCreationDate: this._bookingWithDependencies.bookingDO.creationDate,
            configCapacity: this._bookingWithDependencies.bookingDO.configCapacity
        };
    }
}