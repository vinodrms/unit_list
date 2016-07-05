import {ThLogger, ThLogLevel} from '../../../utils/logging/ThLogger';
import {ThError} from '../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../utils/th-responses/ThResponse';
import {AppContext} from '../../../utils/AppContext';
import {SessionContext} from '../../../utils/SessionContext';
import {ThUtils} from '../../../utils/ThUtils';
import {BookingDO} from '../../../data-layer/bookings/data-objects/BookingDO';

export class BookingIdValidator {
    private _thUtils: ThUtils;

    constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
        this._thUtils = new ThUtils();
    }

    public validateBookingId(groupBookingId: string, bookingId: string): Promise<BookingDO> {
        return new Promise<BookingDO>((resolve: { (result: BookingDO): void }, reject: { (err: ThError): void }) => {
            this.validateBookingIdCore(resolve, reject, groupBookingId, bookingId);
        });
    }

    private validateBookingIdCore(resolve: { (result: BookingDO): void }, reject: { (err: ThError): void }, groupBookingId: string, bookingId: string) {

        var bookignRepo = this._appContext.getRepositoryFactory().getBookingRepository();
        bookignRepo.getBookingById({ hotelId: this._sessionContext.sessionDO.hotel.id }, groupBookingId, bookingId)
            .then((booking: BookingDO) => {
                resolve(booking);
            }).catch((error: any) => {
                reject(error);
            });
    }
}