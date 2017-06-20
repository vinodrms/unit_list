import { BookingDO, BookingConfirmationStatus } from '../data-objects/BookingDO';
import { LazyLoadRepoDO, LazyLoadMetaResponseRepoDO } from '../../common/repo-data-objects/LazyLoadRepoDO';
import { ThDateIntervalDO } from '../../../utils/th-dates/data-objects/ThDateIntervalDO';
import { ThDateDO } from '../../../utils/th-dates/data-objects/ThDateDO';
import { ThHourDO } from '../../../utils/th-dates/data-objects/ThHourDO';
import { ThTimestampDO } from '../../../utils/th-dates/data-objects/ThTimestampDO';

export interface BookingMetaRepoDO {
    hotelId: string;
}
export interface BookingGroupMetaRepoDO {
    groupBookingId: string;
    groupBookingReference: string;
}
export interface BookingItemMetaRepoDO {
    groupBookingId: string;
    bookingId: string;
    versionId: number;
}

export interface BookingSearchCriteriaRepoDO {
    interval?: ThDateIntervalDO;
    confirmationStatusList?: BookingConfirmationStatus[];
    groupBookingId?: string;
    groupBookingIdList?: string[];
    bookingIdList?: string[];
    searchTerm?: string;
    triggerParams?: {
        triggerName: string;
        cancellationHour: ThHourDO;
        currentHotelTimestamp: ThTimestampDO;
    };
    startDateEq?: ThDateDO;
    endDateEq?: ThDateDO;
    startDateLt?: ThDateDO;
    startDateLte?: ThDateDO;
    endDateGt?: ThDateDO;
    endDateGte?: ThDateDO;
    roomId?: string;
    customerId?: string;
    descendentSortOrder?: boolean;
    reservedAddOnProductId?: string;
    priceProductId?: string;
    checkOutDateNullOrGreaterOrEqualThan?: ThDateDO;
    creationInterval?: ThDateIntervalDO;
}
export interface BookingSearchResultRepoDO {
    lazyLoad?: LazyLoadRepoDO;
    bookingList: BookingDO[];
}

export interface IBookingRepository {
    getBookingListCount(meta: BookingMetaRepoDO, searchCriteria: BookingSearchCriteriaRepoDO): Promise<LazyLoadMetaResponseRepoDO>;
    getBookingList(meta: BookingMetaRepoDO, searchCriteria: BookingSearchCriteriaRepoDO, lazyLoad?: LazyLoadRepoDO): Promise<BookingSearchResultRepoDO>;

    getBookingById(meta: BookingMetaRepoDO, groupBookingId: string, bookingId: string): Promise<BookingDO>;

    addBookings(meta: BookingMetaRepoDO, bookingList: BookingDO[], groupMeta?: BookingGroupMetaRepoDO): Promise<BookingDO[]>;
    updateBooking(meta: BookingMetaRepoDO, itemMeta: BookingItemMetaRepoDO, booking: BookingDO): Promise<BookingDO>;
    updateMultipleBookings(meta: BookingMetaRepoDO, bookingList: BookingDO[]): Promise<BookingDO[]>;
}