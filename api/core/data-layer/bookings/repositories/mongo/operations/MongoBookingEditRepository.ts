import { BookingMetaRepoDO, BookingGroupMetaRepoDO, BookingItemMetaRepoDO } from "../../IBookingRepository";
import { BookingDO } from "../../../data-objects/BookingDO";
import { ThError } from "../../../../../utils/th-responses/ThError";
import { ThStatusCode } from "../../../../../utils/th-responses/ThResponse";
import { ThLogLevel, ThLogger } from "../../../../../utils/logging/ThLogger";
import { BookingDOConstraints } from "../../../data-objects/BookingDOConstraints";
import { MongoRepository } from "../../../../common/base/MongoRepository";
import { BookingRepositoryHelper } from "./helpers/BookingRepositoryHelper";

export class MongoBookingEditRepository extends MongoRepository {
    private helper: BookingRepositoryHelper;

    constructor(bookingsEntity: any) {
        super(bookingsEntity);
        this.helper = new BookingRepositoryHelper();
    }

    public addBookings(meta: BookingMetaRepoDO, bookingList: BookingDO[], groupMeta?: BookingGroupMetaRepoDO): Promise<BookingDO[]> {
        if (bookingList.length == 0) {
            var thError = new ThError(ThStatusCode.AddBookingsRepositoryEmptyBookingList, null);
            ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "Empty booking list", { meta: meta, bookingList: bookingList }, thError);
            throw thError;
        }
        if (bookingList.length > BookingDOConstraints.NoBookingsLimit) {
            var thError = new ThError(ThStatusCode.AddBookingsRepositoryNoBookingsLimitExceeded, null);
            ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "Tried to add more than " + BookingDOConstraints.NoBookingsLimit + " bookings",
                { meta: meta, bookingList: bookingList }, thError);
            throw thError;
        }
        if (!this._thUtils.isUndefinedOrNull(groupMeta)) {
            bookingList.forEach(booking => {
                booking.groupBookingId = groupMeta.groupBookingId;
                booking.groupBookingReference = groupMeta.groupBookingReference;
            });
        }
        let promiseList: Promise<BookingDO>[] = [];
        bookingList.forEach(booking => {
            promiseList.push(this.addBooking(meta, booking));
        });
        return Promise.all(promiseList);
    }

    private addBooking(meta: BookingMetaRepoDO, booking: BookingDO): Promise<BookingDO> {
        return new Promise<BookingDO>((resolve: { (result: BookingDO): void }, reject: { (err: ThError): void }) => {
            this.addBookingCore(resolve, reject, meta, booking);
        });
    }
    private addBookingCore(resolve: { (result: BookingDO): void }, reject: { (err: ThError): void },
        meta: BookingMetaRepoDO, booking: BookingDO) {
        booking.hotelId = meta.hotelId;
        booking.versionId = 0;

        this.createDocument(booking,
            (err: Error) => {
                var thError = new ThError(ThStatusCode.AddBookingsRepositoryErrorAddingBookingGroup, err);
                ThLogger.getInstance().logError(ThLogLevel.Error, "Error adding booking group", { meat: meta, booking: booking }, thError);
                reject(thError);
            },
            (createdBooking: Object) => {
                resolve(this.helper.buildBookingDOFrom(createdBooking));
            }
        );
    }

    public getBookingById(meta: BookingMetaRepoDO, groupBookingId: string, bookingId: string): Promise<BookingDO> {
        return new Promise<BookingDO>((resolve: { (result: BookingDO): void }, reject: { (err: ThError): void }) => {
            this.getBookingByIdCore(meta, groupBookingId, bookingId, resolve, reject);
        });
    }
    private getBookingByIdCore(meta: BookingMetaRepoDO, groupBookingId: string, bookingId: string,
        resolve: { (result: BookingDO): void }, reject: { (err: ThError): void }) {
        this.findOneDocument({ "hotelId": meta.hotelId, "id": bookingId },
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
            (foundBooking: Object) => {
                resolve(this.helper.buildBookingDOFrom(foundBooking));
            }
        );
    }

    public updateMultipleBookings(meta: BookingMetaRepoDO, bookingList: BookingDO[]): Promise<BookingDO[]> {
        let promiseList: Promise<BookingDO>[] = [];
        bookingList.forEach(booking => {
            promiseList.push(this.updateBooking(meta, {
                groupBookingId: booking.groupBookingId,
                bookingId: booking.id,
                versionId: booking.versionId
            }, booking));
        });
        return Promise.all(promiseList);
    }
    public updateBooking(meta: BookingMetaRepoDO, itemMeta: BookingItemMetaRepoDO, booking: BookingDO): Promise<BookingDO> {
        return this.findAndModifyBooking(meta, itemMeta, {},
            {
                "status": booking.status,
                "noOfRooms": booking.noOfRooms,
                "externalBookingReference": booking.externalBookingReference,
                "confirmationStatus": booking.confirmationStatus,
                "customerIdList": booking.customerIdList,
                "displayCustomerId": booking.displayCustomerId,
                "corporateDisplayCustomerId": booking.corporateDisplayCustomerId,
                "defaultBillingDetails": booking.defaultBillingDetails,
                "interval": booking.interval,
                "creationDateUtcTimestamp": booking.creationDateUtcTimestamp,
                "startUtcTimestamp": booking.startUtcTimestamp,
                "endUtcTimestamp": booking.endUtcTimestamp,
                "checkInUtcTimestamp": booking.checkInUtcTimestamp,
                "checkOutUtcTimestamp": booking.checkOutUtcTimestamp,
                "configCapacity": booking.configCapacity,
                "roomCategoryId": booking.roomCategoryId,
                "roomId": booking.roomId,
                "priceProductId": booking.priceProductId,
                "priceProductSnapshot": booking.priceProductSnapshot,
                "reservedAddOnProductList": booking.reservedAddOnProductList,
                "price": booking.price,
                "allotmentId": booking.allotmentId,
                "guaranteedTime": booking.guaranteedTime,
                "noShowTime": booking.noShowTime,
                "notes": booking.notes,
                "invoiceNotes": booking.invoiceNotes,
                "fileAttachmentList": booking.fileAttachmentList,
                "bookingHistory": booking.bookingHistory,
                "indexedSearchTerms": booking.indexedSearchTerms,
                "travelActivityType": booking.travelActivityType,
                "travelType": booking.travelType
            });
    }

    private findAndModifyBooking(meta: BookingMetaRepoDO, itemMeta: BookingItemMetaRepoDO, findQuery: Object, updateQuery: Object): Promise<BookingDO> {
        return new Promise<BookingDO>((resolve: { (result: BookingDO): void }, reject: { (err: ThError): void }) => {
            this.findAndModifyBookingCore(meta, itemMeta, findQuery, updateQuery, resolve, reject);
        });
    }
    private findAndModifyBookingCore(meta: BookingMetaRepoDO, itemMeta: BookingItemMetaRepoDO, findQuery: Object, updateQuery: any,
        resolve: { (result: BookingDO): void }, reject: { (err: ThError): void }) {
        updateQuery.$inc = { "versionId": 1 };
        findQuery["hotelId"] = meta.hotelId;
        findQuery["id"] = itemMeta.bookingId;
        findQuery["groupBookingId"] = itemMeta.groupBookingId;
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
            (updatedDBBooking: Object) => {
                resolve(this.helper.buildBookingDOFrom(updatedDBBooking));
            }
        );
    }
}