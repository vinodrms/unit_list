import { ThLogger, ThLogLevel } from '../../../../utils/logging/ThLogger';
import { ThError } from '../../../../utils/th-responses/ThError';
import { ThStatusCode } from '../../../../utils/th-responses/ThResponse';
import { AppContext } from '../../../../utils/AppContext';
import { SessionContext } from '../../../../utils/SessionContext';
import { ThTimestampDO } from '../../../../utils/th-dates/data-objects/ThTimestampDO';
import { HotelDO } from '../../../../data-layer/hotel/data-objects/HotelDO';
import { BookingDO, BookingConfirmationStatus } from '../../../../data-layer/bookings/data-objects/BookingDO';
import { BookingPriceType } from '../../../../data-layer/bookings/data-objects/price/BookingPriceDO';
import { BookingDOConstraints } from '../../../../data-layer/bookings/data-objects/BookingDOConstraints';
import { DocumentActionDO } from '../../../../data-layer/common/data-objects/document-history/DocumentActionDO';
import { BookingUtils } from '../../../bookings/utils/BookingUtils';
import { BookingCancelDO } from './BookingCancelDO';
import { ValidationResultParser } from '../../../common/ValidationResultParser';
import { GenerateBookingInvoice } from '../../../invoices/generate-booking-invoice/GenerateBookingInvoice';
import { InvoiceGroupDO } from '../../../../data-layer/invoices/data-objects/InvoiceGroupDO';
import { BookingInvoiceSync } from "../../../bookings/invoice-sync/BookingInvoiceSync";
import { BookingWithDependencies } from "../utils/BookingWithDependencies";
import { BookingWithDependenciesLoader } from "../utils/BookingWithDependenciesLoader";

import _ = require('underscore');

export interface BookingCancelUpdateResult {
    hasPenalty: boolean;
}

export class BookingCancel {
    private _bookingUtils: BookingUtils;

    private _cancelDO: BookingCancelDO;
    private _cancelResult: BookingCancelUpdateResult;

    private _loadedHotel: HotelDO;
    private _bookingWithDeps: BookingWithDependencies;

    constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
        this._bookingUtils = new BookingUtils();
    }

    public cancel(cancelDO: BookingCancelDO): Promise<BookingDO> {
        this._cancelDO = cancelDO;
        return new Promise<BookingDO>((resolve: { (result: BookingDO): void }, reject: { (err: ThError): void }) => {
            this.cancelCore(resolve, reject);
        });
    }
    private cancelCore(resolve: { (result: BookingDO): void }, reject: { (err: ThError): void }) {
        var validationResult = BookingCancelDO.getValidationStructure().validateStructure(this._cancelDO);
        if (!validationResult.isValid()) {
            var parser = new ValidationResultParser(validationResult, this._cancelDO);
            parser.logAndReject("Error validating cancel fields", reject);
            return;
        }
        this._appContext.getRepositoryFactory().getHotelRepository().getHotelById(this._sessionContext.sessionDO.hotel.id)
            .then((loadedHotel: HotelDO) => {
                this._loadedHotel = loadedHotel;

                let loader = new BookingWithDependenciesLoader(this._appContext, this._sessionContext);
                return loader.load(this._cancelDO.groupBookingId, this._cancelDO.bookingId);
            }).then((bookingWithDeps: BookingWithDependencies) => {
                this._bookingWithDeps = bookingWithDeps;

                if (!this.bookingHasValidStatus()) {
                    var thError = new ThError(ThStatusCode.BookingCancelInvalidState, null);
                    ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "cancel booking: invalid booking state", this._cancelDO, thError);
                    throw thError;
                }
                this._cancelResult = this.updateBooking();

                var bookingsRepo = this._appContext.getRepositoryFactory().getBookingRepository();
                return bookingsRepo.updateBooking({ hotelId: this._sessionContext.sessionDO.hotel.id }, {
                    groupBookingId: this._bookingWithDeps.bookingDO.groupBookingId,
                    bookingId: this._bookingWithDeps.bookingDO.bookingId,
                    versionId: this._bookingWithDeps.bookingDO.versionId
                }, this._bookingWithDeps.bookingDO);
            }).then((updatedBooking: BookingDO) => {
                this._bookingWithDeps.bookingDO = updatedBooking;

                return this.generateInvoiceIfNecessary(this._cancelResult);
            }).then((invoiceGenerationResult: boolean) => {

                let bookingInvoiceSync = new BookingInvoiceSync(this._appContext, this._sessionContext);
                return bookingInvoiceSync.syncInvoiceWithBookingPrice(this._bookingWithDeps.bookingDO);
            }).then((updatedGroup: InvoiceGroupDO) => {
                resolve(this._bookingWithDeps.bookingDO);
            }).catch((error: any) => {
                var thError = new ThError(ThStatusCode.BookingCancelError, error);
                if (thError.isNativeError()) {
                    ThLogger.getInstance().logError(ThLogLevel.Error, "error cancelling booking", this._cancelDO, thError);
                }
                reject(thError);
            });
    }
    private bookingHasValidStatus(): boolean {
        return _.contains(BookingDOConstraints.ConfirmationStatuses_CanCancel, this._bookingWithDeps.bookingDO.confirmationStatus);
    }

    private updateBooking(): BookingCancelUpdateResult {
        var updateResult: BookingCancelUpdateResult = {
            hasPenalty: false
        }
        this._bookingWithDeps.bookingDO.confirmationStatus = BookingConfirmationStatus.Cancelled;
        var logMessage = "The booking has been cancelled";

        if (this.hasPenalty()) {
            // only update the penalty if the booking's invoice is not paid
            if (!this._bookingWithDeps.hasClosedInvoice()) {
                if (this._bookingWithDeps.bookingDO.price.priceType === BookingPriceType.BookingStay) {
                    this._bookingWithDeps.bookingDO.price = this._bookingWithDeps.bookingDO.priceProductSnapshot.conditions.penalty.computePenaltyPrice(this._bookingWithDeps.bookingDO.price);
                }
                logMessage = "The booking has been cancelled. The booking has a penalty.";
                updateResult.hasPenalty = true;
            }
            else {
                // if the booking already has a paid invoice just log an according message
                logMessage = "The booking has been cancelled. The penalty could not be generated because the invoice is already closed.";
            }
        }

        this._bookingWithDeps.bookingDO.bookingHistory.logDocumentAction(DocumentActionDO.buildDocumentActionDO({
            actionParameterMap: {},
            actionString: logMessage,
            userId: this._sessionContext.sessionDO.user.id
        }));
        return updateResult;
    }
    private hasPenalty(): boolean {
        return this._bookingUtils.hasPenalty(this._bookingWithDeps.bookingDO, {
            cancellationHour: this._loadedHotel.operationHours.cancellationHour,
            currentHotelTimestamp: ThTimestampDO.buildThTimestampForTimezone(this._loadedHotel.timezone)
        });
    }

    private generateInvoiceIfNecessary(bookingUpdateResult: BookingCancelUpdateResult): Promise<boolean> {
        return new Promise<boolean>((resolve: { (result: boolean): void }, reject: { (err: ThError): void }) => {
            this.generateInvoiceIfNecessaryCore(resolve, reject, bookingUpdateResult);
        });
    }
    private generateInvoiceIfNecessaryCore(resolve: { (result: boolean): void }, reject: { (err: ThError): void }, bookingUpdateResult: BookingCancelUpdateResult) {
        if (!bookingUpdateResult.hasPenalty) {
            resolve(true);
            return;
        }
        var generateBookingInvoice = new GenerateBookingInvoice(this._appContext, this._sessionContext);
        generateBookingInvoice.generate({
            groupBookingId: this._cancelDO.groupBookingId,
            bookingId: this._cancelDO.bookingId
        }).then((invoiceGroup: InvoiceGroupDO) => {
            resolve(true);
        }).catch((error: ThError) => {
            reject(error);
        });
    }
}