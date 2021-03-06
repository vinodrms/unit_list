import {BookingDO} from '../../../../../../data-layer/bookings/data-objects/BookingDO';
import {BookingItemContainer} from './BookingItemContainer';
import {IndexedBookingInterval} from '../../../../../../data-layer/price-products/utils/IndexedBookingInterval';

import _ = require('underscore');

export class BookingsContainer {
    private _bookingItemContainerList: BookingItemContainer[];

    constructor(bookingList: BookingDO[]) {
        this._bookingItemContainerList = [];
        _.forEach(bookingList, (booking: BookingDO) => {
            this._bookingItemContainerList.push(new BookingItemContainer(booking));
        });
    }

    public getBookingItemContainersFilteredByInterval(indexedBookingInterval: IndexedBookingInterval): BookingItemContainer[] {
        return _.filter(this._bookingItemContainerList, (bookingContainer: BookingItemContainer) => {
            return bookingContainer.indexedBookingInterval.overlapsWith(indexedBookingInterval);
        });
    }

    public getBookingsFilteredByInterval(indexedBookingInterval: IndexedBookingInterval): BookingDO[] {
        var filteredSingleBookingContainerList = this.getBookingItemContainersFilteredByInterval(indexedBookingInterval);
        return _.map(filteredSingleBookingContainerList, (bookingContainer: BookingItemContainer) => {
            return bookingContainer.booking;
        });
    }

    public destroy() {
        this._bookingItemContainerList = [];
    }
}