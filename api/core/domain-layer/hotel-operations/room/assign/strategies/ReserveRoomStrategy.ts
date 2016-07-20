import {ThLogger, ThLogLevel} from '../../../../../utils/logging/ThLogger';
import {ThError} from '../../../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../../../utils/th-responses/ThResponse';
import {AppContext} from '../../../../../utils/AppContext';
import {SessionContext} from '../../../../../utils/SessionContext';
import {AssignRoomValidationDO} from './IAssignRoomStrategy';
import {BookingDO, BookingConfirmationStatus} from '../../../../../data-layer/bookings/data-objects/BookingDO';
import {AAssignRoomStrategy} from './AAssignRoomStrategy';

export class ReserveRoomStrategy extends AAssignRoomStrategy {
    constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
        super();
    }

    protected updateAdditionalFieldsCore(resolve: { (result: BookingDO): void }, reject: { (err: ThError): void }, validationDO: AssignRoomValidationDO) {
        var bookingDO = validationDO.booking;
        if (bookingDO.confirmationStatus !== BookingConfirmationStatus.Confirmed && bookingDO.confirmationStatus !== BookingConfirmationStatus.Guaranteed) {
            var thError = new ThError(ThStatusCode.ReserveRoomStrategyOnlyConfirmedOrGuaranteed, null);
            ThLogger.getInstance().logBusiness(ThLogLevel.Error, "Tried to reserve a booking with status != {Confirmed,Guaranteed}", { sessionContext: this._sessionContext, bookingId: bookingDO.bookingId }, thError);
            reject(thError);
            return;
        }
        this.logRoomChangedOnBooking(bookingDO, "Room %roomName% was reserved for this booking.", validationDO.roomList);
        resolve(bookingDO);
    }
}