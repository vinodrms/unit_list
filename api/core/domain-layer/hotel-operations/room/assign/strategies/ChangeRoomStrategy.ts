import {ThLogger, ThLogLevel} from '../../../../../utils/logging/ThLogger';
import {ThError} from '../../../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../../../utils/th-responses/ThResponse';
import {AppContext} from '../../../../../utils/AppContext';
import {SessionContext} from '../../../../../utils/SessionContext';
import {IAssignRoomStrategy, AssignRoomValidationDO} from './IAssignRoomStrategy';
import {BookingDO, BookingConfirmationStatus} from '../../../../../data-layer/bookings/data-objects/BookingDO';
import {AAssignRoomStrategy} from './AAssignRoomStrategy';

export class ChangeRoomStrategy extends AAssignRoomStrategy {
    constructor(private _appContext: AppContext, sessionContext: SessionContext) {
        super(sessionContext);
    }

    protected updateAdditionalFieldsCore(resolve: { (result: BookingDO): void }, reject: { (err: ThError): void }, validationDO: AssignRoomValidationDO) {
        var bookingDO = validationDO.booking;
        if (bookingDO.confirmationStatus !== BookingConfirmationStatus.CheckedIn) {
            var thError = new ThError(ThStatusCode.ChangeRoomStrategyOnlyWhenCheckedIn, null);
            ThLogger.getInstance().logBusiness(ThLogLevel.Error, "Tried to change room on a booking with status != CheckedIn", { sessionContext: this._sessionContext, bookingId: bookingDO.id }, thError);
            reject(thError);
            return;
        }
        if (bookingDO.interval.end.isBefore(validationDO.currentHotelTimestamp.thDateDO)) {
            var thError = new ThError(ThStatusCode.ChangeRoomStrategyEndDateInPast, null);
            ThLogger.getInstance().logBusiness(ThLogLevel.Error, "Tried to change the room for a booking that has end date in the past", { sessionContext: this._sessionContext, bookingId: bookingDO.id }, thError);
            reject(thError);
            return;
        }
        this.logRoomChangedOnBooking(bookingDO, "The customers were moved to room %roomName%", validationDO.roomList);
        resolve(bookingDO);
    }
    public validateAlreadyCheckedInBooking(): boolean {
        return true;
    }
    protected generateInvoiceIfNecessaryCore(resolve: { (result: BookingDO): void }, reject: { (err: ThError): void }, booking: BookingDO) {
        resolve(booking);
    }
}