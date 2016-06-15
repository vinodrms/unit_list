import {MongoRepository} from '../../../common/base/MongoRepository';
import {LazyLoadRepoDO, LazyLoadMetaResponseRepoDO} from '../../../common/repo-data-objects/LazyLoadRepoDO';
import {IBookingRepository, BookingMetaRepoDO, BookingItemMetaRepoDO, BookingSearchResultRepoDO} from '../IBookingRepository';
import {BookingDO} from '../../data-objects/BookingDO';
import {MongoAddBookingsRepository} from './add-bookings/MongoAddBookingsRepository';

export class MongoBookingRepository extends MongoRepository implements IBookingRepository {
    private _addBookingsRepo: MongoAddBookingsRepository;

    constructor() {
        var bookingGroupsEntity = sails.models.bookinggroupsentity;
        super(bookingGroupsEntity);
        this._addBookingsRepo = new MongoAddBookingsRepository(bookingGroupsEntity);
    }

    public addBookings(meta: BookingMetaRepoDO, bookingList: BookingDO[]): Promise<BookingDO[]> {
        return this._addBookingsRepo.addBookings(meta, bookingList);
    }
}