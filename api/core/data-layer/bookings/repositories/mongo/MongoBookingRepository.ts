import { MongoRepository } from '../../../common/base/MongoRepository';
import { LazyLoadRepoDO, LazyLoadMetaResponseRepoDO } from '../../../common/repo-data-objects/LazyLoadRepoDO';
import { IBookingRepository, BookingMetaRepoDO, BookingItemMetaRepoDO, BookingSearchResultRepoDO, BookingSearchCriteriaRepoDO, BookingGroupMetaRepoDO } from '../IBookingRepository';
import { BookingDO } from '../../data-objects/BookingDO';
import { MongoBookingEditRepository } from "./operations/MongoBookingEditRepository";
import { MongoBookingReadRepository } from "./operations/MongoBookingReadRepository";

declare var sails: any;

export class MongoBookingRepository extends MongoRepository implements IBookingRepository {
    private editRepository: MongoBookingEditRepository;
    private readRepository: MongoBookingReadRepository;

    constructor() {
        var bookingsEntity = sails.models.bookingsentity;
        super(bookingsEntity);
        this.editRepository = new MongoBookingEditRepository(bookingsEntity);
        this.readRepository = new MongoBookingReadRepository(bookingsEntity);
    }

    public addBookings(meta: BookingMetaRepoDO, bookingList: BookingDO[], groupMeta?: BookingGroupMetaRepoDO): Promise<BookingDO[]> {
        return this.editRepository.addBookings(meta, bookingList, groupMeta);
    }
    public updateBooking(meta: BookingMetaRepoDO, itemMeta: BookingItemMetaRepoDO, booking: BookingDO): Promise<BookingDO> {
        return this.editRepository.updateBooking(meta, itemMeta, booking);
    }
    public updateMultipleBookings(meta: BookingMetaRepoDO, bookingList: BookingDO[]): Promise<BookingDO[]> {
        return this.editRepository.updateMultipleBookings(meta, bookingList);
    }
    public getBookingListCount(meta: BookingMetaRepoDO, searchCriteria: BookingSearchCriteriaRepoDO): Promise<LazyLoadMetaResponseRepoDO> {
        return this.readRepository.getBookingListCount(meta, searchCriteria);
    }
    public getBookingList(meta: BookingMetaRepoDO, searchCriteria: BookingSearchCriteriaRepoDO, lazyLoad?: LazyLoadRepoDO): Promise<BookingSearchResultRepoDO> {
        return this.readRepository.getBookingList(meta, searchCriteria, lazyLoad);
    }
    public getBookingById(meta: BookingMetaRepoDO, bookingId: string): Promise<BookingDO> {
        return this.editRepository.getBookingById(meta, bookingId);
    }
}
