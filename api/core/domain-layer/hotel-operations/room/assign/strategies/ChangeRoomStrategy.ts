import {ThLogger, ThLogLevel} from '../../../../../utils/logging/ThLogger';
import {ThError} from '../../../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../../../utils/th-responses/ThResponse';
import {AppContext} from '../../../../../utils/AppContext';
import {SessionContext} from '../../../../../utils/SessionContext';
import {IAssignRoomStrategy, AssignRoomValidationDO} from './IAssignRoomStrategy';
import {BookingDO, BookingConfirmationStatus} from '../../../../../data-layer/bookings/data-objects/BookingDO';
import {AAssignRoomStrategy} from './AAssignRoomStrategy';

export class ChangeRoomStrategy extends AAssignRoomStrategy {
    constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
        super();
    }

    protected updateAdditionalFieldsCore(resolve: { (result: BookingDO): void }, reject: { (err: ThError): void }, validationDO: AssignRoomValidationDO) {
        var bookingDO = validationDO.booking;
        if (bookingDO.confirmationStatus !== BookingConfirmationStatus.CheckedIn) {
            var thError = new ThError(ThStatusCode.ChangeRoomStrategyOnlyWhenCheckedIn, null);
            ThLogger.getInstance().logBusiness(ThLogLevel.Error, "Tried to change room on a booking with status != CheckedIn", { sessionContext: this._sessionContext, bookingId: bookingDO.bookingId }, thError);
            reject(thError);
            return;
        }
        this.logRoomChangedOnBooking(bookingDO, "The customers were moved to room %roomName%", validationDO.roomList);
        resolve(bookingDO);
    }
}