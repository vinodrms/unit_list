import {MongoRepository} from '../../../../common/base/MongoRepository';
import {ThLogger, ThLogLevel} from '../../../../../utils/logging/ThLogger';
import {ThError} from '../../../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../../../utils/th-responses/ThResponse';
import {BookingDO, GroupBookingStatus} from '../../../data-objects/BookingDO';
import {BookingMetaRepoDO} from '../../IBookingRepository';
import {BookingGroupDO} from '../utils/data-objects/BookingGroupDO';
import {BookingDOConstraints} from '../../../data-objects/BookingDOConstraints';

import _ = require('underscore');

export class MongoAddBookingsRepository extends MongoRepository {
    constructor(bookingGroupsEntity: Sails.Model) {
        super(bookingGroupsEntity);
    }

    public addBookings(meta: BookingMetaRepoDO, bookingList: BookingDO[]): Promise<BookingDO[]> {
        return new Promise<BookingDO[]>((resolve: { (result: BookingDO[]): void }, reject: { (err: ThError): void }) => {
            this.addBookingsCore(resolve, reject, meta, bookingList);
        });
    }

    private addBookingsCore(resolve: { (result: BookingDO[]): void }, reject: { (err: ThError): void }, meta: BookingMetaRepoDO, bookingList: BookingDO[]) {
        if (bookingList.length == 0) {
            var thError = new ThError(ThStatusCode.AddBookingsRepositoryEmptyBookingList, null);
            ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "Empty booking list", { meta: meta, bookingList: bookingList }, thError);
            reject(thError);
            return;
        }
        if (bookingList.length > BookingDOConstraints.NoBookingsLimit) {
            var thError = new ThError(ThStatusCode.AddBookingsRepositoryNoBookingsLimitExceeded, null);
            ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "Tried to add more than " + BookingDOConstraints.NoBookingsLimit + " bookings",
                { meta: meta, bookingList: bookingList }, thError);
            reject(thError);
            return;
        }
        var bookingGroup = this.convertToBookingGroup(meta, bookingList);
        this.createDocument(bookingGroup,
            (err: Error) => {
                var thError = new ThError(ThStatusCode.AddBookingsRepositoryErrorAddingBookingGroup, err);
                ThLogger.getInstance().logError(ThLogLevel.Error, "Error adding booking group", { meat: meta, bookingList: bookingList }, thError);
                reject(thError);
            },
            (createdBookingGroup: Object) => {
                var bookingGroupDO = new BookingGroupDO();
                bookingGroupDO.buildFromObject(createdBookingGroup);
                resolve(bookingGroupDO.bookingList);
            }
        );
    }

    private convertToBookingGroup(meta: BookingMetaRepoDO, bookingList: BookingDO[]): BookingGroupDO {
        var bookingGroup = new BookingGroupDO();
        bookingGroup.hotelId = meta.hotelId;
        bookingGroup.versionId = 0;
        bookingGroup.groupBookingReference = bookingList[0].groupBookingReference;
        bookingGroup.inputChannel = bookingList[0].inputChannel;
        bookingGroup.status = GroupBookingStatus.Active;
        bookingGroup.noOfRooms = bookingList.length;
        bookingGroup.bookingList = [];
        _.forEach(bookingList, (booking: BookingDO) => {
            delete booking.groupBookingId;
            delete booking.hotelId;
            delete booking.versionId;
            delete booking.groupBookingReference;
            delete booking.status;
            delete booking.inputChannel;
            delete booking.noOfRooms;
            bookingGroup.bookingList.push(booking);
        });
        return bookingGroup;
    }
}