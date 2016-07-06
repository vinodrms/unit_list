import {BookingDO} from '../../../../../../data-layer/bookings/data-objects/BookingDO';
import {IndexedBookingInterval} from '../../../../../../data-layer/price-products/utils/IndexedBookingInterval';

export class BookingItemContainer {
    private _booking: BookingDO;
    private _indexedBookingInterval: IndexedBookingInterval;

    constructor(booking: BookingDO) {
        this._booking = booking;
        this._indexedBookingInterval = new IndexedBookingInterval(booking.interval);
    }

    public get booking(): BookingDO {
        return this._booking;
    }
    public set booking(booking: BookingDO) {
        this._booking = booking;
    }
    public get indexedBookingInterval(): IndexedBookingInterval {
        return this._indexedBookingInterval;
    }
    public set indexedBookingInterval(indexedBookingInterval: IndexedBookingInterval) {
        this._indexedBookingInterval = indexedBookingInterval;
    }
}