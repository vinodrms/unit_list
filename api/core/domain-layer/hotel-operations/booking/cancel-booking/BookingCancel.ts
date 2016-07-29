import {ThLogger, ThLogLevel} from '../../../../utils/logging/ThLogger';
import {ThError} from '../../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../../utils/th-responses/ThResponse';
import {AppContext} from '../../../../utils/AppContext';
import {SessionContext} from '../../../../utils/SessionContext';
import {ThTimestampDO} from '../../../../utils/th-dates/data-objects/ThTimestampDO';
import {HotelDO} from '../../../../data-layer/hotel/data-objects/HotelDO';
import {BookingDO, BookingConfirmationStatus} from '../../../../data-layer/bookings/data-objects/BookingDO';
import {BookingPriceType} from '../../../../data-layer/bookings/data-objects/price/BookingPriceDO';
import {BookingDOConstraints} from '../../../../data-layer/bookings/data-objects/BookingDOConstraints';
import {DocumentActionDO} from '../../../../data-layer/common/data-objects/document-history/DocumentActionDO';
import {BookingUtils} from '../../../bookings/utils/BookingUtils';
import {BookingCancelDO} from './BookingCancelDO';
import {ValidationResultParser} from '../../../common/ValidationResultParser';

import _ = require('underscore');

export class BookingCancel {
    private _bookingUtils: BookingUtils;

    private _cancelDO: BookingCancelDO;

    private _loadedHotel: HotelDO;
    private _loadedBooking: BookingDO;

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

                var bookingsRepo = this._appContext.getRepositoryFactory().getBookingRepository();
                return bookingsRepo.getBookingById({ hotelId: this._sessionContext.sessionDO.hotel.id }, this._cancelDO.groupBookingId, this._cancelDO.bookingId)
            }).then((booking: BookingDO) => {
                this._loadedBooking = booking;

                if (!this.bookingHasValidStatus()) {
                    var thError = new ThError(ThStatusCode.BookingCancelInvalidState, null);
                    ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "cancel booking: invalid booking state", this._cancelDO, thError);
                    throw thError;
                }
                this.updateBooking();

                var bookingsRepo = this._appContext.getRepositoryFactory().getBookingRepository();
                return bookingsRepo.updateBooking({ hotelId: this._sessionContext.sessionDO.hotel.id }, {
                    groupBookingId: this._loadedBooking.groupBookingId,
                    bookingId: this._loadedBooking.bookingId,
                    versionId: this._loadedBooking.versionId
                }, this._loadedBooking);
            }).then((updatedBooking: BookingDO) => {
                resolve(updatedBooking);
            }).catch((error: any) => {
                var thError = new ThError(ThStatusCode.BookingCancelError, error);
                if (thError.isNativeError()) {
                    ThLogger.getInstance().logError(ThLogLevel.Error, "error cancelling booking", this._cancelDO, thError);
                }
                reject(thError);
            });
    }
    private bookingHasValidStatus(): boolean {
        return _.contains(BookingDOConstraints.ConfirmationStatuses_CanCancel, this._loadedBooking.confirmationStatus);
    }

    private updateBooking() {
        this._loadedBooking.confirmationStatus = BookingConfirmationStatus.Cancelled;

        var logMessage = "The booking has been cancelled";
        if (this.hasPenalty()) {
            if (this._loadedBooking.price.priceType === BookingPriceType.BookingStay) {
                this._loadedBooking.price = this._loadedBooking.priceProductSnapshot.conditions.penalty.computePenaltyPrice(this._loadedBooking.price);
            }
            logMessage = "The booking has been cancelled. The booking has a penalty.";
            // TODO: generate invoice ?
        }

        this._loadedBooking.bookingHistory.logDocumentAction(DocumentActionDO.buildDocumentActionDO({
            actionParameterMap: {},
            actionString: logMessage,
            userId: this._sessionContext.sessionDO.user.id
        }));
    }
    private hasPenalty(): boolean {
        return this._bookingUtils.hasPenalty(this._loadedBooking, {
            cancellationHour: this._loadedHotel.operationHours.cancellationHour,
            currentHotelTimestamp: ThTimestampDO.buildThTimestampForTimezone(this._loadedHotel.timezone)
        });
    }
}