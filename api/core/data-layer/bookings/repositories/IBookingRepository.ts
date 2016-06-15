import {BookingDO} from '../data-objects/BookingDO';
import {LazyLoadRepoDO, LazyLoadMetaResponseRepoDO} from '../../common/repo-data-objects/LazyLoadRepoDO';

export interface BookingMetaRepoDO {
    hotelId: string;
}
export interface BookingItemMetaRepoDO {
    groupBookingId: string;
    bookingId: string;
    versionId: number;
}

export interface BookingSearchResultRepoDO {
    lazyLoad?: LazyLoadRepoDO;
    bookingList: BookingDO[];
}

export interface IBookingRepository {
    addBookings(meta: BookingMetaRepoDO, bookingList: BookingDO[]): Promise<BookingDO[]>;
}