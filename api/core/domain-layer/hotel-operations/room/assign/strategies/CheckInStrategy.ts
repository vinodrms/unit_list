import {ThLogger, ThLogLevel} from '../../../../../utils/logging/ThLogger';
import {ThError} from '../../../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../../../utils/th-responses/ThResponse';
import {AppContext} from '../../../../../utils/AppContext';
import {SessionContext} from '../../../../../utils/SessionContext';
import {IAssignRoomStrategy, AssignRoomValidationDO} from './IAssignRoomStrategy';
import {BookingDO, BookingConfirmationStatus} from '../../../../../data-layer/bookings/data-objects/BookingDO';
import {AAssignRoomStrategy} from './AAssignRoomStrategy';
import {GenerateBookingInvoice} from '../../../../invoices/generate-booking-invoice/GenerateBookingInvoice';
import {InvoiceGroupDO} from '../../../../../data-layer/invoices/data-objects/InvoiceGroupDO';

export class CheckInStrategy extends AAssignRoomStrategy {
    constructor(private _appContext: AppContext, sessionContext: SessionContext) {
        super(sessionContext);
    }

    protected updateAdditionalFieldsCore(resolve: { (result: BookingDO): void }, reject: { (err: ThError): void }, validationDO: AssignRoomValidationDO) {
        var bookingDO = validationDO.booking;
        if (bookingDO.confirmationStatus !== BookingConfirmationStatus.Confirmed && bookingDO.confirmationStatus !== BookingConfirmationStatus.Guaranteed) {
            var thError = new ThError(ThStatusCode.CheckInStrategyOnlyConfirmedOrGuaranteed, null);
            ThLogger.getInstance().logBusiness(ThLogLevel.Error, "Tried to check in a booking with status != {Confirmed,Guaranteed}", { sessionContext: this._sessionContext, bookingId: bookingDO.bookingId }, thError);
            reject(thError);
            return;
        }
        if (!bookingDO.defaultBillingDetails.paymentGuarantee) {
            var thError = new ThError(ThStatusCode.CheckInStrategyNoPaymentGuarantee, null);
            ThLogger.getInstance().logBusiness(ThLogLevel.Error, "Tried to check in a booking without payment guarantee", { sessionContext: this._sessionContext, bookingId: bookingDO.bookingId }, thError);
            reject(thError);
            return;
        }
        if (bookingDO.interval.start.isAfter(validationDO.currentHotelTimestamp.thDateDO)) {
            var thError = new ThError(ThStatusCode.CheckInStrategyStartDateInFuture, null);
            ThLogger.getInstance().logBusiness(ThLogLevel.Error, "Tried to check in a booking that starts in the future", { sessionContext: this._sessionContext, bookingId: bookingDO.bookingId }, thError);
            reject(thError);
            return;
        }
        if (bookingDO.interval.end.isBefore(validationDO.currentHotelTimestamp.thDateDO)) {
            var thError = new ThError(ThStatusCode.CheckInStrategyEndDateInPast, null);
            ThLogger.getInstance().logBusiness(ThLogLevel.Error, "Tried to check in a booking that has end date in the past", { sessionContext: this._sessionContext, bookingId: bookingDO.bookingId }, thError);
            reject(thError);
            return;
        }
        bookingDO.confirmationStatus = BookingConfirmationStatus.CheckedIn;
        this.logRoomChangedOnBooking(bookingDO, "The customers were checked in room %roomName%", validationDO.roomList);
        resolve(bookingDO);
    }
    public validateAlreadyCheckedInBooking(): boolean {
        return true;
    }
    protected generateInvoiceIfNecessaryCore(resolve: { (result: BookingDO): void }, reject: { (err: ThError): void }, booking: BookingDO) {
        var generateBookingInvoice = new GenerateBookingInvoice(this._appContext, this._sessionContext);
        generateBookingInvoice.generate({
            groupBookingId: booking.groupBookingId,
            bookingId: booking.bookingId
        }).then((invoiceGroup: InvoiceGroupDO) => {
            resolve(booking);
        }).catch((error: ThError) => {
            reject(error);
        });
    }
}