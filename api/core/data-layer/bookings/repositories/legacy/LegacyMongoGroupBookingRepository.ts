import { MongoRepository } from '../../../common/base/MongoRepository';
import { LazyLoadRepoDO, LazyLoadMetaResponseRepoDO } from '../../../common/repo-data-objects/LazyLoadRepoDO';
import { IBookingRepository, BookingMetaRepoDO, BookingItemMetaRepoDO, BookingSearchResultRepoDO, BookingSearchCriteriaRepoDO, BookingGroupMetaRepoDO } from '../IBookingRepository';
import { BookingDO } from '../../data-objects/BookingDO';
import { MongoAddBookingsRepository } from './add-bookings/MongoAddBookingsRepository';
import { MongoUpdateBookingRepository } from './update-booking/MongoUpdateBookingRepository';
import { MongoUpdateMultipleBookingsRepository } from './update-booking/MongoUpdateMultipleBookingsRepository';
import { MongoGetBookingsRepository } from './get-bookings/MongoGetBookingsRepository';
import { MongoGetSingleBookingRepository } from './get-bookings/MongoGetSingleBookingRepository';

export class LegacyMongoGroupBookingRepository extends MongoRepository implements IBookingRepository {
    private _addBookingsRepo: MongoAddBookingsRepository;
    private _updateBookingRepo: MongoUpdateBookingRepository;
    private _updateMultipleBookingsRepo: MongoUpdateMultipleBookingsRepository;
    private _getBookingsRepo: MongoGetBookingsRepository;
    private _getSingleBooking: MongoGetSingleBookingRepository;

    constructor() {
        var bookingGroupsEntity = sails.models.bookinggroupsentity;
        super(bookingGroupsEntity);
        this._addBookingsRepo = new MongoAddBookingsRepository(bookingGroupsEntity);
        this._updateBookingRepo = new MongoUpdateBookingRepository(bookingGroupsEntity);
        this._updateMultipleBookingsRepo = new MongoUpdateMultipleBookingsRepository(this._updateBookingRepo);
        this._getBookingsRepo = new MongoGetBookingsRepository(bookingGroupsEntity);
        this._getSingleBooking = new MongoGetSingleBookingRepository(bookingGroupsEntity);
    }

    public addBookings(meta: BookingMetaRepoDO, bookingList: BookingDO[], groupMeta?: BookingGroupMetaRepoDO): Promise<BookingDO[]> {
        return this._addBookingsRepo.addBookings(meta, bookingList, groupMeta);
    }
    public updateBooking(meta: BookingMetaRepoDO, itemMeta: BookingItemMetaRepoDO, booking: BookingDO): Promise<BookingDO> {
        return this._updateBookingRepo.updateBooking(meta, itemMeta, booking);
    }
    public updateMultipleBookings(meta: BookingMetaRepoDO, bookingList: BookingDO[]): Promise<BookingDO[]> {
        return this._updateMultipleBookingsRepo.updateMultipleBookings(meta, bookingList);
    }
    public getBookingListCount(meta: BookingMetaRepoDO, searchCriteria: BookingSearchCriteriaRepoDO): Promise<LazyLoadMetaResponseRepoDO> {
        return this._getBookingsRepo.getBookingListCount(meta, searchCriteria);
    }
    public getBookingList(meta: BookingMetaRepoDO, searchCriteria: BookingSearchCriteriaRepoDO, lazyLoad?: LazyLoadRepoDO): Promise<BookingSearchResultRepoDO> {
        return this._getBookingsRepo.getBookingList(meta, searchCriteria, lazyLoad);
    }
    public getBookingById(meta: BookingMetaRepoDO, groupBookingId: string, bookingId: string): Promise<BookingDO> {
        return this._getSingleBooking.getBookingById(meta, groupBookingId, bookingId);
    }
}