import { APaginatedTransactionalMongoPatch } from "../../utils/APaginatedTransactionalMongoPatch";
import { MongoPatchType } from "../MongoPatchType";
import { MongoRepository } from "../../../../../../data-layer/common/base/MongoRepository";
import { ThError } from "../../../../../../utils/th-responses/ThError";
import { BookingDO } from "../../../../../../data-layer/bookings/data-objects/BookingDO";
import { InvoiceGroupSearchResultRepoDO } from "../../../../../../data-layer/invoices/repositories/IInvoiceGroupsRepository";
import { InvoiceGroupDO } from "../../../../../../data-layer/invoices/data-objects/InvoiceGroupDO";
import { InvoiceDO } from "../../../../../../data-layer/invoices/data-objects/InvoiceDO";
import { InvoiceItemDO, InvoiceItemType } from "../../../../../../data-layer/invoices/data-objects/items/InvoiceItemDO";
import { MongoBookingRepository } from "../../../../../../data-layer/bookings/repositories/mongo/MongoBookingRepository";
import { MongoInvoiceGroupsRepository } from "../../../../../../data-layer/invoices/repositories/mongo/MongoInvoiceGroupsRepository";
import { ThUtils } from "../../../../../../utils/ThUtils";

import _ = require('underscore');

export class P24_MigrateBookingGroupsToBookings extends APaginatedTransactionalMongoPatch {

    protected getMongoRepository(): MongoRepository {
        return this._legacyBookingGroupRepository;
    }

    public getPatchType(): MongoPatchType {
        return MongoPatchType.MigrateBookingGroupsToBookings;
    }

    protected updateDocumentInMemoryAsyncCore(resolve: { (result: any): void }, reject: { (err: ThError): void }, bookingGroup) {
        let migrator = new BookingMigrator(this._bookingRepository, this._invoiceGroupsRepository);
        migrator.migrate(resolve, reject, bookingGroup);
    }

    protected updateDocumentInMemory(bookingGroup) { }
}

class BookingMigrator {
    private thUtils: ThUtils;
    private hotelId: string;
    private groupBookingId: string;
    private legacyToNewBookingIdMap: { [id: string]: string };

    constructor(private _bookingRepository: MongoBookingRepository, private _invoiceGroupsRepository: MongoInvoiceGroupsRepository) {
        this.thUtils = new ThUtils();
    }

    public migrate(resolve: { (result: any): void }, reject: { (err: ThError): void }, bookingGroup) {
        if (bookingGroup.migrated === true) {
            resolve(bookingGroup);
            return;
        }

        let bookingList: BookingDO[] = [];

        this.hotelId = bookingGroup.hotelId;
        this.groupBookingId = bookingGroup.id;

        bookingGroup.bookingList.forEach((bookingItem: any) => {
            let booking: BookingDO = new BookingDO();
            booking.buildFromObject(bookingItem);
            (<any>booking).legacyBookingId = bookingItem.bookingId;

            booking.groupBookingId = bookingGroup.id;
            booking.groupBookingReference = bookingGroup.groupBookingReference;
            booking.hotelId = this.hotelId;
            booking.versionId = 0;
            booking.status = bookingGroup.status;
            booking.inputChannel = bookingGroup.inputChannel;
            booking.noOfRooms = bookingGroup.noOfRooms;
            bookingList.push(booking);
        });

        this._bookingRepository.addBookings({ hotelId: this.hotelId }, bookingList)
            .then((convertedBookingList: BookingDO[]) => {
                this.legacyToNewBookingIdMap = {};
                convertedBookingList.forEach(booking => {
                    this.legacyToNewBookingIdMap[(<any>booking).legacyBookingId] = booking.id;
                });

                return this._invoiceGroupsRepository.getInvoiceGroupList({ hotelId: this.hotelId }, {
                    groupBookingId: this.groupBookingId
                });
            }).then((searchResult: InvoiceGroupSearchResultRepoDO) => {
                let promiseList: Promise<InvoiceGroupDO>[] = [];
                searchResult.invoiceGroupList.forEach(invoiceGroup => {
                    promiseList.push(this.updateBookingIdOnInvoiceGroup(invoiceGroup));
                });
                return Promise.all(promiseList);
            }).then(updatedInvoiceGroupList => {
                bookingGroup.migrated = true;
                resolve(bookingGroup);
            }).catch(e => {
                reject(e);
            });
    }

    private updateBookingIdOnInvoiceGroup(invoiceGroup: InvoiceGroupDO): Promise<InvoiceGroupDO> {
        return new Promise<InvoiceGroupDO>((resolve: { (result: InvoiceGroupDO): void }, reject: { (err: ThError): void }) => {
            invoiceGroup.invoiceList = _.map(invoiceGroup.invoiceList, (invoice: InvoiceDO) => {
                if (!this.thUtils.isUndefinedOrNull(this.legacyToNewBookingIdMap[invoice.bookingId])) {
                    invoice.bookingId = this.legacyToNewBookingIdMap[invoice.bookingId];
                }
                invoice.itemList = _.map(invoice.itemList, (item: InvoiceItemDO) => {
                    if (item.type === InvoiceItemType.Booking && !this.thUtils.isUndefinedOrNull(this.legacyToNewBookingIdMap[item.id])) {
                        item.id = this.legacyToNewBookingIdMap[item.id];
                    }
                    return item;
                });
                return invoice;
            });
            this._invoiceGroupsRepository.updateInvoiceGroup({ hotelId: invoiceGroup.hotelId }, {
                id: invoiceGroup.id,
                versionId: invoiceGroup.versionId
            }, invoiceGroup).then((updatedGroup: InvoiceGroupDO) => {
                resolve(updatedGroup);
            }).catch(e => {
                reject(e);
            });
        });
    }
}