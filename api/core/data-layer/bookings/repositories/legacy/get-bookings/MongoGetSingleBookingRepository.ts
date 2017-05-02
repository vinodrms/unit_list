import {MongoRepository} from '../../../../common/base/MongoRepository';
import {ThLogger, ThLogLevel} from '../../../../../utils/logging/ThLogger';
import {ThError} from '../../../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../../../utils/th-responses/ThResponse';
import {BookingDO} from '../../../data-objects/BookingDO';
import {BookingMetaRepoDO} from '../../IBookingRepository';
import {BookingGroupDO} from '../utils/data-objects/BookingGroupDO';

import _ = require('underscore');

export class MongoGetSingleBookingRepository extends MongoRepository {
    constructor(bookingGroupsEntity: Sails.Model) {
        super(bookingGroupsEntity);
    }

    public getBookingById(meta: BookingMetaRepoDO, groupBookingId: string, bookingId: string): Promise<BookingDO> {
        return new Promise<BookingDO>((resolve: { (result: BookingDO): void }, reject: { (err: ThError): void }) => {
            this.getBookingByIdCore(meta, groupBookingId, bookingId, resolve, reject);
        });
    }
    private getBookingByIdCore(meta: BookingMetaRepoDO, groupBookingId: string, bookingId: string, resolve: { (result: BookingDO): void }, reject: { (err: ThError): void }) {
        this.findOneDocument({ "hotelId": meta.hotelId, "id": groupBookingId, "bookingList.bookingId": bookingId },
            () => {
                var thError = new ThError(ThStatusCode.BookingRepositoryBookingNotFound, null);
                ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "Booking not found", { meta: meta, groupBookingId: groupBookingId, bookingId: bookingId }, thError);
                reject(thError);
            },
            (err: Error) => {
                var thError = new ThError(ThStatusCode.BookingRepositoryErrorGettingBooking, err);
                ThLogger.getInstance().logError(ThLogLevel.Error, "Error getting booking by id", { meta: meta, groupBookingId: groupBookingId, bookingId: bookingId }, thError);
                reject(thError);
            },
            (bookingGroupObject: Object) => {
                var bookingGroup: BookingGroupDO = new BookingGroupDO();
                bookingGroup.buildFromObject(bookingGroupObject);
                var foundBooking: BookingDO = _.find(bookingGroup.bookingList, (booking: BookingDO) => { return booking.bookingId === bookingId }); 
                resolve(foundBooking);
            }
        );
    }
}