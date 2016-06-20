import {MongoRepository} from '../../../common/base/MongoRepository';
import {LazyLoadRepoDO, LazyLoadMetaResponseRepoDO} from '../../../common/repo-data-objects/LazyLoadRepoDO';
import {IBookingRepository, BookingMetaRepoDO, BookingItemMetaRepoDO, BookingSearchResultRepoDO, BookingSearchCriteriaRepoDO} from '../IBookingRepository';
import {BookingDO} from '../../data-objects/BookingDO';
import {MongoAddBookingsRepository} from './add-bookings/MongoAddBookingsRepository';
import {MongoUpdateBookingRepository} from './update-booking/MongoUpdateBookingRepository';
import {MongoGetBookingsRepository} from './get-bookings/MongoGetBookingsRepository';

export class MongoBookingRepository extends MongoRepository implements IBookingRepository {
    private _addBookingsRepo: MongoAddBookingsRepository;
    private _updateBookingRepo: MongoUpdateBookingRepository;
    private _getBookingsRepo: MongoGetBookingsRepository;

    constructor() {
        var bookingGroupsEntity = sails.models.bookinggroupsentity;
        super(bookingGroupsEntity);
        this._addBookingsRepo = new MongoAddBookingsRepository(bookingGroupsEntity);
        this._updateBookingRepo = new MongoUpdateBookingRepository(bookingGroupsEntity);
        this._getBookingsRepo = new MongoGetBookingsRepository(bookingGroupsEntity);
    }

    public addBookings(meta: BookingMetaRepoDO, bookingList: BookingDO[]): Promise<BookingDO[]> {
        return this._addBookingsRepo.addBookings(meta, bookingList);
    }
    public updateBooking(meta: BookingMetaRepoDO, itemMeta: BookingItemMetaRepoDO, booking: BookingDO): Promise<BookingDO> {
        return this._updateBookingRepo.updateBooking(meta, itemMeta, booking);
    }
    public getBookingListCount(meta: BookingMetaRepoDO, searchCriteria: BookingSearchCriteriaRepoDO): Promise<LazyLoadMetaResponseRepoDO> {
        return this._getBookingsRepo.getBookingListCount(meta, searchCriteria);
    }
    public getBookingList(meta: BookingMetaRepoDO, searchCriteria: BookingSearchCriteriaRepoDO, lazyLoad?: LazyLoadRepoDO): Promise<BookingSearchResultRepoDO> {
        return this._getBookingsRepo.getBookingList(meta, searchCriteria, lazyLoad);
    }
}