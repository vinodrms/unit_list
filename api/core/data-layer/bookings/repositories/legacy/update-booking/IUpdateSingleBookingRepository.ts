import {BookingMetaRepoDO, BookingItemMetaRepoDO} from '../../IBookingRepository';
import {BookingDO, GroupBookingStatus} from '../../../data-objects/BookingDO';

export interface IUpdateSingleBookingRepository {
    updateBooking(meta: BookingMetaRepoDO, itemMeta: BookingItemMetaRepoDO, booking: BookingDO): Promise<BookingDO>;
}