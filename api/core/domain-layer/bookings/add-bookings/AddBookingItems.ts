import {ThLogger, ThLogLevel} from '../../../utils/logging/ThLogger';
import {ThError} from '../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../utils/th-responses/ThResponse';
import {AppContext} from '../../../utils/AppContext';
import {SessionContext} from '../../../utils/SessionContext';
import {GroupBookingInputChannel, BookingDO} from '../../../data-layer/bookings/data-objects/BookingDO';
import {AddBookingItemsDO, BookingItemDO} from './AddBookingItemsDO';

export class AddBookingItems {
    private _bookingItems: AddBookingItemsDO;
    private _inputChannel: GroupBookingInputChannel;

    constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
    }

    public add(bookingItems: AddBookingItemsDO, inputChannel: GroupBookingInputChannel): Promise<BookingDO[]> {
        this._bookingItems = bookingItems;
        this._inputChannel = inputChannel;

        return new Promise<BookingDO[]>((resolve: { (result: BookingDO[]): void }, reject: { (err: ThError): void }) => {
            try {
                this.addCore(resolve, reject);
            } catch (error) {
                var thError = new ThError(ThStatusCode.AddBookingItemsError, error);
                ThLogger.getInstance().logError(ThLogLevel.Error, "error adding bookings", this._bookingItems, thError);
                reject(thError);
            }
        });
    }

    private addCore(resolve: { (result: BookingDO[]): void }, reject: { (err: ThError): void }) {

    }
}