import { ThLogger, ThLogLevel } from '../../../../utils/logging/ThLogger';
import { ThError } from '../../../../utils/th-responses/ThError';
import { ThStatusCode } from '../../../../utils/th-responses/ThResponse';
import { AppContext } from '../../../../utils/AppContext';
import { SessionContext } from '../../../../utils/SessionContext';
import { PriceProductDO } from '../../../../data-layer/price-products/data-objects/PriceProductDO';
import { ConfigCapacityDO } from '../../../../data-layer/common/data-objects/bed-config/ConfigCapacityDO';
import { BookingDO, BookingConfirmationStatus } from '../../../../data-layer/bookings/data-objects/BookingDO';
import { InvoiceGroupDO } from '../../../../data-layer/invoices/data-objects/InvoiceGroupDO';
import { BookingDOConstraints } from '../../../../data-layer/bookings/data-objects/BookingDOConstraints';
import { DocumentActionDO } from '../../../../data-layer/common/data-objects/document-history/DocumentActionDO';
import { BookingUtils } from '../../../bookings/utils/BookingUtils';
import { BookingInvoiceSync } from '../../../bookings/invoice-sync/BookingInvoiceSync';
import { ValidationResultParser } from '../../../common/ValidationResultParser';
import { BookingWithDependenciesLoader } from '../utils/BookingWithDependenciesLoader';
import { BookingWithDependencies } from '../utils/BookingWithDependencies';
import { BookingChangeCapacityDO } from './BookingChangeCapacityDO';
import { BusinessValidationRuleContainer } from '../../../common/validation-rules/BusinessValidationRuleContainer';
import { BookingRoomCategoryValidationRule } from '../../../bookings/validators/validation-rules/booking/BookingRoomCategoryValidationRule';
import { PriceProductConstraintsValidationRule, PriceProductConstraintsParams } from '../../../bookings/validators/validation-rules/price-product/PriceProductConstraintsValidationRule';

import _ = require('underscore');

export class BookingChangeCapacity {
    private _bookingUtils: BookingUtils;
    private _bookingInvoiceSync: BookingInvoiceSync;
    private _bookingChangeCapacityDO: BookingChangeCapacityDO;

    private _bookingWithDependencies: BookingWithDependencies;

    constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
        this._bookingUtils = new BookingUtils();
        this._bookingInvoiceSync = new BookingInvoiceSync(this._appContext, this._sessionContext);
    }

    public changeCapacity(bookingChangeCapacityDO: BookingChangeCapacityDO): Promise<BookingDO> {
        this._bookingChangeCapacityDO = bookingChangeCapacityDO;
        return new Promise<BookingDO>((resolve: { (result: BookingDO): void }, reject: { (err: ThError): void }) => {
            this.changeCapacityCore(resolve, reject);
        });
    }
    private changeCapacityCore(resolve: { (result: BookingDO): void }, reject: { (err: ThError): void }) {
        var validationResult = BookingChangeCapacityDO.getValidationStructure().validateStructure(this._bookingChangeCapacityDO);
        if (!validationResult.isValid()) {
            var parser = new ValidationResultParser(validationResult, this._bookingChangeCapacityDO);
            parser.logAndReject("Error validating change booking capacity fields", reject);
            return;
        }
        var bookingLoader = new BookingWithDependenciesLoader(this._appContext, this._sessionContext);
        bookingLoader.load(this._bookingChangeCapacityDO.groupBookingId, this._bookingChangeCapacityDO.bookingId)
            .then((bookingWithDependencies: BookingWithDependencies) => {
                this._bookingWithDependencies = bookingWithDependencies;

                if (!this.bookingHasValidStatus()) {
                    var thError = new ThError(ThStatusCode.BookingChangeCapacityInvalidState, null);
                    ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "change capacity: invalid booking state", this._bookingChangeCapacityDO, thError);
                    throw thError;
                }
                if (this._bookingWithDependencies.hasClosedInvoice()) {
                    var thError = new ThError(ThStatusCode.BookingChangeCapacityPaidInvoice, null);
                    ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "change capacity: paid invoice", this._bookingChangeCapacityDO, thError);
                    throw thError;
                }
                this.updateBooking();

                var bookingValidationRule = new BusinessValidationRuleContainer([
                    new BookingRoomCategoryValidationRule({
                        priceProductsContainer: this._bookingWithDependencies.priceProductsContainer,
                        roomCategoryStatsList: this._bookingWithDependencies.roomCategoryStatsList,
                        roomList: this._bookingWithDependencies.roomList
                    })
                ]);
                return bookingValidationRule.isValidOn(this._bookingWithDependencies.bookingDO);
            }).then((validatedBooking: BookingDO) => {
                var priceProductValidationRule = new BusinessValidationRuleContainer([
                    new PriceProductConstraintsValidationRule(this.getPriceProductConstraintsParams())
                ]);

                return priceProductValidationRule.isValidOn(this._bookingWithDependencies.priceProductDO);
            }).then((priceProductDO: PriceProductDO) => {
                var bookingsRepo = this._appContext.getRepositoryFactory().getBookingRepository();
                return bookingsRepo.updateBooking({ hotelId: this._sessionContext.sessionDO.hotel.id }, {
                    groupBookingId: this._bookingWithDependencies.bookingDO.groupBookingId,
                    bookingId: this._bookingWithDependencies.bookingDO.id,
                    versionId: this._bookingWithDependencies.bookingDO.versionId
                }, this._bookingWithDependencies.bookingDO);
            }).then((updatedBooking: BookingDO) => {
                this._bookingWithDependencies.bookingDO = updatedBooking;
                return this._bookingInvoiceSync.syncInvoiceWithBookingPrice(updatedBooking);
            }).then((updatedGroup: InvoiceGroupDO) => {
                resolve(this._bookingWithDependencies.bookingDO);
            }).catch((error: any) => {
                var thError = new ThError(ThStatusCode.BookingChangeCapacityError, error);
                if (thError.isNativeError()) {
                    ThLogger.getInstance().logError(ThLogLevel.Error, "error changing booking capacity", this._bookingChangeCapacityDO, thError);
                }
                reject(thError);
            });
    }
    private bookingHasValidStatus(): boolean {
        return _.contains(BookingDOConstraints.ConfirmationStatuses_CanChangeCapacity, this._bookingWithDependencies.bookingDO.confirmationStatus);
    }
    private updateBooking() {
        var oldPrice: number = this._bookingWithDependencies.bookingDO.price.totalBookingPrice;
        var oldCapacity: ConfigCapacityDO = this._bookingWithDependencies.bookingDO.configCapacity.buildPrototype();

        var newCapacity = new ConfigCapacityDO();
        newCapacity.buildFromObject(this._bookingChangeCapacityDO.configCapacity);
        this._bookingWithDependencies.bookingDO.configCapacity = newCapacity;
        this._bookingUtils.updateBookingPriceUsingRoomCategoryAndSavePPSnapshot(this._bookingWithDependencies.bookingDO,
            this._bookingWithDependencies.roomCategoryStatsList, this._bookingWithDependencies.priceProductDO,
            this._bookingWithDependencies.billingCustomer);
        var newPrice: number = this._bookingWithDependencies.bookingDO.price.totalBookingPrice;
        this._bookingWithDependencies.bookingDO.bookingHistory.logDocumentAction(DocumentActionDO.buildDocumentActionDO({
            actionParameterMap: {
                oldAdults: oldCapacity.noAdults, oldChildren: oldCapacity.noChildren, oldBabies: oldCapacity.noBabies, oldBabyBeds: oldCapacity.noBabyBeds,
                newAdults: newCapacity.noAdults, newChildren: newCapacity.noChildren, newBabies: newCapacity.noBabies, newBabyBeds: newCapacity.noBabyBeds,
                oldPrice: oldPrice, newPrice: newPrice
            },
            actionString: "The booking capacity was changed from %oldAdults%, %oldChildren%, %oldBabies%, %oldBabyBeds% to %newAdults%, %newChildren%, %newBabies%, %newBabyBeds% (adults, children, babies, baby beds). The old price %oldPrice% has become %newPrice%.",
            userId: this._sessionContext.sessionDO.user.id
        }));
    }
    private getPriceProductConstraintsParams(): PriceProductConstraintsParams {
        return {
            bookingInterval: this._bookingWithDependencies.bookingDO.interval,
            bookingCreationDate: this._bookingWithDependencies.bookingDO.creationDate,
            configCapacity: this._bookingWithDependencies.bookingDO.configCapacity
        };
    }
}