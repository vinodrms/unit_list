import {MongoRepository} from '../../../../common/base/MongoRepository';
import {ThLogger, ThLogLevel} from '../../../../../utils/logging/ThLogger';
import {ThError} from '../../../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../../../utils/th-responses/ThResponse';
import {BookingDO, GroupBookingStatus} from '../../../data-objects/BookingDO';
import {BookingMetaRepoDO, BookingItemMetaRepoDO} from '../../IBookingRepository';
import {BookingGroupDO} from '../utils/data-objects/BookingGroupDO';
import {IUpdateSingleBookingRepository} from './IUpdateSingleBookingRepository';

import _ = require('underscore');

export class MongoUpdateBookingRepository extends MongoRepository implements IUpdateSingleBookingRepository {
    constructor(bookingGroupsEntity: Sails.Model) {
        super(bookingGroupsEntity);
    }

    public updateBooking(meta: BookingMetaRepoDO, itemMeta: BookingItemMetaRepoDO, booking: BookingDO): Promise<BookingDO> {
        return this.findAndModifyBooking(meta, itemMeta, {},
            {
                "bookingList.$.confirmationStatus": booking.confirmationStatus,
                "bookingList.$.customerIdList": booking.customerIdList,
                "bookingList.$.displayCustomerId": booking.displayCustomerId,
                "bookingList.$.defaultBillingDetails": booking.defaultBillingDetails,
                "bookingList.$.interval": booking.interval,
                "bookingList.$.startUtcTimestamp": booking.startUtcTimestamp,
                "bookingList.$.endUtcTimestamp": booking.endUtcTimestamp,
                "bookingList.$.configCapacity": booking.configCapacity,
                "bookingList.$.roomCategoryId": booking.roomCategoryId,
                "bookingList.$.roomId": booking.roomId,
                "bookingList.$.priceProductId": booking.priceProductId,
                "bookingList.$.reservedAddOnProductIdList": booking.reservedAddOnProductIdList,
                "bookingList.$.price": booking.price,
                "bookingList.$.allotmentId": booking.allotmentId,
                "bookingList.$.guaranteedTime": booking.guaranteedTime,
                "bookingList.$.noShowTime": booking.noShowTime,
                "bookingList.$.notes": booking.notes,
                "bookingList.$.fileAttachmentList": booking.fileAttachmentList,
                "bookingList.$.bookingHistory": booking.bookingHistory,
                "bookingList.$.indexedSearchTerms": booking.indexedSearchTerms,
            });
    }

    private findAndModifyBooking(meta: BookingMetaRepoDO, itemMeta: BookingItemMetaRepoDO, findQuery: Object, updateQuery: Object): Promise<BookingDO> {
        return new Promise<BookingDO>((resolve: { (result: BookingDO): void }, reject: { (err: ThError): void }) => {
            this.findAndModifyBookingCore(meta, itemMeta, findQuery, updateQuery, resolve, reject);
        });
    }
    private findAndModifyBookingCore(meta: BookingMetaRepoDO, itemMeta: BookingItemMetaRepoDO, findQuery: Object, updateQuery: any, resolve: { (result: BookingDO): void }, reject: { (err: ThError): void }) {
        updateQuery.$inc = { "versionId": 1 };
        findQuery["hotelId"] = meta.hotelId;
        findQuery["id"] = itemMeta.groupBookingId;
        findQuery["bookingList.bookingId"] = itemMeta.bookingId;
        findQuery["versionId"] = itemMeta.versionId;

        this.findAndModifyDocument(findQuery, updateQuery,
            () => {
                var thError = new ThError(ThStatusCode.BookingsRepositoryProblemUpdatingBooking, null);
                ThLogger.getInstance().logBusiness(ThLogLevel.Info, "Problem updating booking - concurrency", { meta: meta, itemMeta: itemMeta, updateQuery: updateQuery }, thError);
                reject(thError);
            },
            (err: Error) => {
                var thError = new ThError(ThStatusCode.BookingsRepositoryErrorUpdatingBooking, err);
                ThLogger.getInstance().logError(ThLogLevel.Error, "Error updating booking", { meta: meta, itemMeta: itemMeta, updateQuery: updateQuery }, thError);
                reject(thError);
            },
            (updatedDBBookingGroup: Object) => {
                var bookingGroupDO = new BookingGroupDO();
                bookingGroupDO.buildFromObject(updatedDBBookingGroup);
                var updatedBooking = _.find(bookingGroupDO.bookingList, (booking: BookingDO) => {
                    return booking.bookingId === itemMeta.bookingId;
                });
                resolve(updatedBooking);
            }
        );
    }
}