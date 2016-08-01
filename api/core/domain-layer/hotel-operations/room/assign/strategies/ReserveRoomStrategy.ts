import {ThLogger, ThLogLevel} from '../../../../../utils/logging/ThLogger';
import {ThError} from '../../../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../../../utils/th-responses/ThResponse';
import {AppContext} from '../../../../../utils/AppContext';
import {SessionContext} from '../../../../../utils/SessionContext';
import {AssignRoomValidationDO} from './IAssignRoomStrategy';
import {BookingDO, BookingConfirmationStatus} from '../../../../../data-layer/bookings/data-objects/BookingDO';
import {AAssignRoomStrategy} from './AAssignRoomStrategy';

export class ReserveRoomStrategy extends AAssignRoomStrategy {
    constructor(private _appContext: AppContext, sessionContext: SessionContext) {
        super(sessionContext);
    }

    protected updateAdditionalFieldsCore(resolve: { (result: BookingDO): void }, reject: { (err: ThError): void }, validationDO: AssignRoomValidationDO) {
        var bookingDO = validationDO.booking;
        if (bookingDO.confirmationStatus !== BookingConfirmationStatus.Confirmed && bookingDO.confirmationStatus !== BookingConfirmationStatus.Guaranteed) {
            var thError = new ThError(ThStatusCode.ReserveRoomStrategyOnlyConfirmedOrGuaranteed, null);
            ThLogger.getInstance().logBusiness(ThLogLevel.Error, "Tried to reserve a booking with status != {Confirmed,Guaranteed}", { sessionContext: this._sessionContext, bookingId: bookingDO.bookingId }, thError);
            reject(thError);
            return;
        }
        if (bookingDO.interval.end.isBefore(validationDO.currentHotelTimestamp.thDateDO)) {
            var thError = new ThError(ThStatusCode.ReserveRoomStrategyEndDateInPast, null);
            ThLogger.getInstance().logBusiness(ThLogLevel.Error, "Tried to reserve a room for a booking that has end date in the past", { sessionContext: this._sessionContext, bookingId: bookingDO.bookingId }, thError);
            reject(thError);
            return;
        }
        this.logRoomChangedOnBooking(bookingDO, "Room %roomName% was reserved for this booking.", validationDO.roomList);
        resolve(bookingDO);
    }
    public validateAlreadyCheckedInBooking(): boolean {
        return false;
    }
    protected generateInvoiceIfNecessaryCore(resolve: { (result: BookingDO): void }, reject: { (err: ThError): void }, booking: BookingDO) {
        resolve(booking);
    }
}