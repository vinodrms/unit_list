import { APaginatedTransactionalMongoPatch } from "../../utils/APaginatedTransactionalMongoPatch";
import { MongoPatchType } from "../MongoPatchType";
import { MongoRepository } from "../../../../../../data-layer/common/base/MongoRepository";
import { ThError } from "../../../../../../utils/th-responses/ThError";
import { BookingDO } from "../../../../../../data-layer/bookings/data-objects/BookingDO";
import { InvoiceGroupSearchResultRepoDO } from "../../../../../../data-layer/invoices/repositories/IInvoiceGroupsRepository";
import { InvoiceGroupDO } from "../../../../../../data-layer/invoices/data-objects/InvoiceGroupDO";
import { InvoiceDO } from "../../../../../../data-layer/invoices/data-objects/InvoiceDO";
import { InvoiceItemDO, InvoiceItemType } from "../../../../../../data-layer/invoices/data-objects/items/InvoiceItemDO";

import _ = require('underscore');

export class P24_MigrateBookingGroupsToBookings extends APaginatedTransactionalMongoPatch {

    protected getMongoRepository(): MongoRepository {
        return this._legacyBookingGroupRepository;
    }

    public getPatchType(): MongoPatchType {
        return MongoPatchType.MigrateBookingGroupsToBookings;
    }

    protected updateDocumentInMemoryAsyncCore(resolve: { (result: any): void }, reject: { (err: ThError): void }, bookingGroup) {
        let promiseList: Promise<any>[] = [];
        bookingGroup.bookingList.forEach((booking: BookingDO) => {
            promiseList.push(this.update(bookingGroup, booking));
        });
        Promise.all(promiseList).then((bookingList: any[]) => {
            bookingGroup.bookingList = bookingList;
            resolve(bookingGroup);
        }).catch(e => {
            reject(e);
        });
    }

    private update(bookingGroup, bookingItem): Promise<any> {
        return new Promise<any>((resolve: { (result: any): void }, reject: { (err: ThError): void }) => {
            this.updateCore(resolve, reject, bookingGroup, bookingItem);
        });
    }
    private updateCore(resolve: { (result: any): void }, reject: { (err: ThError): void }, bookingGroup, bookingItem) {
        if (bookingItem.migrated === true) {
            resolve(bookingItem);
            return;
        }

        let booking: BookingDO = new BookingDO();
        booking.buildFromObject(bookingItem);
        booking.groupBookingId = bookingGroup.id;
        booking.groupBookingReference = bookingGroup.groupBookingReference;
        booking.hotelId = bookingGroup.hotelId;
        booking.versionId = 0;
        booking.status = bookingGroup.status;
        booking.inputChannel = bookingGroup.inputChannel;
        booking.noOfRooms = bookingGroup.noOfRooms;

        let legacyBookingId = bookingItem.bookingId;
        var bookingId;

        this._bookingRepository.addBookings({ hotelId: booking.hotelId }, [booking])
            .then((convertedBookingList: BookingDO[]) => {
                let convertedBooking = convertedBookingList[0];
                bookingId = convertedBooking.id;

                return this._invoiceGroupsRepository.getInvoiceGroupList({ hotelId: booking.hotelId }, {
                    bookingId: legacyBookingId
                });
            }).then((searchResult: InvoiceGroupSearchResultRepoDO) => {
                let promiseList: Promise<InvoiceGroupDO>[] = [];
                searchResult.invoiceGroupList.forEach(invoiceGroup => {
                    promiseList.push(this.updateBookingIdOnInvoiceGroup(invoiceGroup, legacyBookingId, bookingId));
                });
                return Promise.all(promiseList);
            }).then(updatedInvoiceGroupList => {
                bookingItem.migrated = true;
                resolve(bookingItem);
            }).catch(e => {
                reject(e);
            });
    }

    private updateBookingIdOnInvoiceGroup(invoiceGroup: InvoiceGroupDO, legacyBookingId: string, bookingId: string): Promise<InvoiceGroupDO> {
        invoiceGroup.invoiceList.forEach((invoice: InvoiceDO) => {
            if (invoice.bookingId === legacyBookingId) {
                invoice.bookingId = bookingId;
            }
            invoice.itemList.forEach((item: InvoiceItemDO) => {
                if (item.type === InvoiceItemType.Booking && item.id === legacyBookingId) {
                    item.id = bookingId;
                }
            });
        });
        return this._invoiceGroupsRepository.updateInvoiceGroup({ hotelId: invoiceGroup.hotelId }, {
            id: invoiceGroup.id,
            versionId: invoiceGroup.versionId
        }, invoiceGroup);
    }

    protected updateDocumentInMemory(bookingGroup) { }
}