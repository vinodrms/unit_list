import {ThLogger, ThLogLevel} from '../../../../utils/logging/ThLogger';
import {ThError} from '../../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../../utils/th-responses/ThResponse';
import {AppContext} from '../../../../utils/AppContext';
import {SessionContext} from '../../../../utils/SessionContext';
import {BookingRemoveRollawayCapacityWarningDO} from './BookingRemoveRollawayCapacityWarningDO';
import {BookingDO} from '../../../../data-layer/bookings/data-objects/BookingDO';
import {ValidationResultParser} from '../../../common/ValidationResultParser';
import {DocumentActionDO} from '../../../../data-layer/common/data-objects/document-history/DocumentActionDO';

export class BookingRemoveRollawayCapacityWarning {
    private _capacityDO: BookingRemoveRollawayCapacityWarningDO;

    private _loadedBooking: BookingDO;

    constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
    }

    public removeRollawayCapacityWarning(capacityDO: BookingRemoveRollawayCapacityWarningDO): Promise<BookingDO> {
        this._capacityDO = capacityDO;
        return new Promise<BookingDO>((resolve: { (result: BookingDO): void }, reject: { (err: ThError): void }) => {
            this.removeRollawayCapacityWarningCore(resolve, reject);
        });
    }
    private removeRollawayCapacityWarningCore(resolve: { (result: BookingDO): void }, reject: { (err: ThError): void }) {
        var validationResult = BookingRemoveRollawayCapacityWarningDO.getValidationStructure().validateStructure(this._capacityDO);
        if (!validationResult.isValid()) {
            var parser = new ValidationResultParser(validationResult, this._capacityDO);
            parser.logAndReject("Error removing booking rollaway capacity error", reject);
            return;
        }
        var bookingsRepo = this._appContext.getRepositoryFactory().getBookingRepository();
        bookingsRepo.getBookingById({ hotelId: this._sessionContext.sessionDO.hotel.id }, this._capacityDO.groupBookingId, this._capacityDO.bookingId)
            .then((booking: BookingDO) => {
                this._loadedBooking = booking;
                this.updateLoadedBooking();
                var bookingsRepo = this._appContext.getRepositoryFactory().getBookingRepository();
                return bookingsRepo.updateBooking({ hotelId: this._sessionContext.sessionDO.hotel.id }, {
                    groupBookingId: this._loadedBooking.groupBookingId,
                    bookingId: this._loadedBooking.bookingId,
                    versionId: this._loadedBooking.versionId
                }, this._loadedBooking);
            }).then((updatedBooking: BookingDO) => {
                resolve(updatedBooking);
            }).catch((error: any) => {
                var thError = new ThError(ThStatusCode.BookingRemoveRollawayCapacityWarningError, error);
                if (thError.isNativeError()) {
                    ThLogger.getInstance().logError(ThLogLevel.Error, "error removing the capacity flag from the booking", this._capacityDO, thError);
                }
                reject(thError);
            });
    }
    private updateLoadedBooking() {
        this._loadedBooking.needsRollawayBeds = false;
        this._loadedBooking.bookingHistory.logDocumentAction(DocumentActionDO.buildDocumentActionDO({
            actionParameterMap: {},
            actionString: "Some rollaway beds were added in the room to fit the booking capacity",
            userId: this._sessionContext.sessionDO.user.id
        }));
    }
}