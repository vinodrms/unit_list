import _ = require("underscore");
import moment = require('moment-timezone');
import { APaginatedTransactionalMongoPatch } from "../../utils/APaginatedTransactionalMongoPatch";
import { MongoRepository } from "../../../../../../data-layer/common/base/MongoRepository";
import { MongoPatchType } from "../MongoPatchType";
import { ThError } from "../../../../../../utils/th-responses/ThError";
import { InvoiceGroupDO as LegacyInvoiceGroupDO, InvoiceGroupStatus as LegacyInvoiceGroupStatus } from "../../../../../../data-layer/invoices-legacy/data-objects/InvoiceGroupDO";
import {
    InvoiceDO as LegacyInvoiceDO, InvoiceAccountingType as LegacyInvoiceAccountingType,
    InvoicePaymentStatus as LegacyInvoicePaymentStatus
} from "../../../../../../data-layer/invoices-legacy/data-objects/InvoiceDO";
import { InvoiceItemDO as LegacyInvoiceItemDO, InvoiceItemType as LegacyInvoiceItemType } from "../../../../../../data-layer/invoices-legacy/data-objects/items/InvoiceItemDO";
import { InvoiceDO, InvoiceStatus, InvoicePaymentStatus, InvoiceAccountingType } from "../../../../../../data-layer/invoices/data-objects/InvoiceDO";
import { InvoiceItemDO, InvoiceItemType } from "../../../../../../data-layer/invoices/data-objects/items/InvoiceItemDO";
import { ThTimestampDO } from "../../../../../../utils/th-dates/data-objects/ThTimestampDO";
import { AddOnProductInvoiceItemMetaDO as LegacyAddOnProductInvoiceItemMetaDO } from "../../../../../../data-layer/invoices-legacy/data-objects/items/add-on-products/AddOnProductInvoiceItemMetaDO";
import { AddOnProductInvoiceItemMetaDO } from "../../../../../../data-layer/invoices/data-objects/items/add-on-products/AddOnProductInvoiceItemMetaDO";
import { BookingPriceDO } from "../../../../../../data-layer/bookings/data-objects/price/BookingPriceDO";
import { FeeInvoiceItemMetaDO } from "../../../../../../data-layer/invoices/data-objects/items/invoice-fee/FeeInvoiceItemMetaDO";
import { RoomCommissionItemMetaDO } from "../../../../../../data-layer/invoices/data-objects/items/room-commission/RoomCommissionItemMetaDO";
import { InvoicePayerDO as LegacyInvoicePayerDO } from "../../../../../../data-layer/invoices-legacy/data-objects/payers/InvoicePayerDO";
import { InvoicePaymentDO } from "../../../../../../data-layer/invoices/data-objects/payer/InvoicePaymentDO";
import { InvoicePaymentMethodDO } from "../../../../../../data-layer/invoices/data-objects/payer/InvoicePaymentMethodDO";
import { InvoicePayerDO } from "../../../../../../data-layer/invoices/data-objects/payer/InvoicePayerDO";
import { ThDateDO } from "../../../../../../utils/th-dates/data-objects/ThDateDO";
import { ThHourDO } from "../../../../../../utils/th-dates/data-objects/ThHourDO";

export class P10_MigrateInvoiceGroupsToInvoices extends APaginatedTransactionalMongoPatch {
    private hotelTimezoneMap: { [index: string]: string } = {};

    protected getMongoRepository(): MongoRepository {
        return this.legacyInvoiceGroupsRepository;
    }
    protected updateDocumentInMemoryAsyncCore(resolve: { (result: any): void }, reject: { (err: ThError): void }, legacyInvoiceGroup: LegacyInvoiceGroupDO) {
        if (legacyInvoiceGroup.migrated === true) {
            resolve(legacyInvoiceGroup);
            return;
        }
        this.getTimezoneForHotel(legacyInvoiceGroup.hotelId).then((timezone: string) => {
            let promises: Promise<InvoiceDO>[] = [];
            let invoices = this.convertInvoiceGroup(legacyInvoiceGroup, timezone);
            invoices.forEach((invoice: InvoiceDO) => {
                promises.push(this.invoiceRepository.addInvoice({ hotelId: legacyInvoiceGroup.hotelId }, invoice));
            });
            return Promise.all(promises);
        }).then(createdInvoices => {
            let promises: Promise<InvoiceDO>[] = [];
            createdInvoices.forEach(invoice => {
                // amountToPay and amountPaid computed through the recomputePrices function
                invoice.recomputePrices();

                promises.push(this.invoiceRepository.updateInvoice({ hotelId: invoice.hotelId }, {
                    id: invoice.id,
                    versionId: invoice.versionId,
                }, invoice));
            });
            return Promise.all(promises);
        }).then(updatedInvoices => {
            legacyInvoiceGroup.migrated = true;
            resolve(legacyInvoiceGroup);
        }).catch(e => {
            reject(e);
        });
    }

    private convertInvoiceGroup(legacyInvoiceGroup: LegacyInvoiceGroupDO, timezone: string): InvoiceDO[] {
        let invoiceList: InvoiceDO[] = [];

        legacyInvoiceGroup.invoiceList.forEach((legacyInvoice: LegacyInvoiceDO) => {
            let invoice = new InvoiceDO();
            invoice.versionId = 0;
            invoice.hotelId = legacyInvoiceGroup.hotelId;
            if (legacyInvoiceGroup.status === LegacyInvoiceGroupStatus.Deleted) {
                invoice.status = InvoiceStatus.Deleted;
            }
            else {
                invoice.status = InvoiceStatus.Active;
            }
            invoice.groupId = legacyInvoiceGroup.id;
            invoice.reference = legacyInvoice.invoiceReference;

            if (legacyInvoice.paymentStatus === LegacyInvoicePaymentStatus.LossAcceptedByManagement) {
                invoice.paymentStatus = InvoicePaymentStatus.LossAcceptedByManagement;
                invoice.accountingType = InvoiceAccountingType.Debit;
            }
            else if (legacyInvoice.paymentStatus === LegacyInvoicePaymentStatus.Unpaid) {
                invoice.paymentStatus = InvoicePaymentStatus.Unpaid;
                invoice.accountingType = InvoiceAccountingType.Debit;
            }
            else if (legacyInvoice.paymentStatus === LegacyInvoicePaymentStatus.Paid) {
                invoice.paymentStatus = InvoicePaymentStatus.Paid;

                if (legacyInvoice.accountingType === LegacyInvoiceAccountingType.Debit) {
                    invoice.accountingType = InvoiceAccountingType.Debit;
                }
                else if (legacyInvoice.accountingType === LegacyInvoiceAccountingType.Credit) {
                    invoice.accountingType = InvoiceAccountingType.Credit;
                }
            }
            invoice.vatTaxListSnapshot = legacyInvoiceGroup.vatTaxListSnapshot;

            // the reinstatedInvoiceId will not point to a valid invoice
            invoice.reinstatedInvoiceId = legacyInvoice.reinstatedInvoiceId;

            invoice.notesFromBooking = legacyInvoice.notesFromBooking;

            let defaultTimestamp: number;

            var paidDateTimeUtcTimestamp = legacyInvoice.paidDateTimeUtcTimestamp;
            // bug in the old system: sometimes the paidDateTimeUtcTimestamp is not completed
            if (!_.isNumber(paidDateTimeUtcTimestamp)) {
                paidDateTimeUtcTimestamp = legacyInvoice.paidDateUtcTimestamp;
            }

            // enforce a paidTimestamp if the invoice is already Paid
            if (!_.isNumber(paidDateTimeUtcTimestamp) && invoice.isClosed()) {
                var date = new Date(legacyInvoiceGroup.updatedAt);
                paidDateTimeUtcTimestamp = date.getTime();
            }

            if (_.isNumber(paidDateTimeUtcTimestamp)) {
                let actualMoment: moment.Moment = moment.utc(paidDateTimeUtcTimestamp);
                let thTimestamp = new ThTimestampDO();
                thTimestamp.thDateDO = ThDateDO.buildThDateDO(actualMoment.year(), actualMoment.month(), actualMoment.date());
                thTimestamp.thHourDO = ThHourDO.buildThHourDO(actualMoment.hour(), actualMoment.minute());
                if (thTimestamp.isValid()) {
                    defaultTimestamp = thTimestamp.getTimestamp(timezone);
                    invoice.paidTimestamp = defaultTimestamp;
                }
            }
            if (!_.isNumber(defaultTimestamp)) {
                defaultTimestamp = ThTimestampDO​​.buildThTimestampForTimezone(timezone).getTimestamp(timezone);
            }

            invoice.paymentDueDate = legacyInvoice.paymentDueDate;

            invoice.itemList = [];
            legacyInvoice.itemList.forEach((legacyInvoiceItem: LegacyInvoiceItemDO) => {
                let item = this.convertItem(legacyInvoiceItem, defaultTimestamp);
                invoice.itemList.push(item);
            });

            invoice.payerList = [];
            legacyInvoice.payerList.forEach((legacyPayer: LegacyInvoicePayerDO) => {
                let payment = this.convertPayer(legacyPayer, defaultTimestamp);
                let customerId = legacyPayer.customerId;
                var index = _.findIndex(invoice.payerList, (payer: InvoicePayerDO) => {
                    return payer.customerId === customerId;
                });
                if (index < 0) {
                    index = invoice.payerList.length;
                    let payer = new InvoicePayerDO();
                    payer.customerId = customerId;
                    payer.paymentList = [];
                    invoice.payerList.push(payer);
                }
                if (!invoice.isUnpaid()) {
                    invoice.payerList[index].paymentList.push(payment);
                }
            });
            invoice.reindex();

            // amounts will be reindexed later
            invoice.amountPaid = 0.0;
            invoice.amountToPay = 0.0;

            invoiceList.push(invoice);
        });

        return invoiceList;
    }
    private convertItem(legacyInvoiceItem: LegacyInvoiceItemDO, timestamp: number): InvoiceItemDO {
        let item = new InvoiceItemDO();
        item.id = legacyInvoiceItem.id;
        item.transactionId = this.thUtils.generateUniqueID();
        item.timestamp = timestamp;

        if (legacyInvoiceItem.type === LegacyInvoiceItemType.AddOnProduct) {
            let addOnProductItem = new AddOnProductInvoiceItemMetaDO();
            addOnProductItem.buildFromObject(legacyInvoiceItem.meta);
            item.meta = addOnProductItem;
            item.type = InvoiceItemType.AddOnProduct;
        }
        else if (legacyInvoiceItem.type === LegacyInvoiceItemType.Booking) {
            item.meta = <BookingPriceDO>legacyInvoiceItem.meta;
            item.type = InvoiceItemType.Booking;
        }
        else if (legacyInvoiceItem.type === LegacyInvoiceItemType.InvoiceFee) {
            let feeItem = new FeeInvoiceItemMetaDO();
            feeItem.buildFromObject(legacyInvoiceItem.meta);
            item.meta = feeItem;
            item.type = InvoiceItemType.InvoiceFee;
        }
        else if (legacyInvoiceItem.type === LegacyInvoiceItemType.RoomCommission) {
            let commissionItem = new RoomCommissionItemMetaDO();
            commissionItem.buildFromObject(legacyInvoiceItem.meta);
            item.meta = commissionItem;
            item.type = InvoiceItemType.RoomCommission;
        }

        return item;
    }
    private convertPayer(legacyPayer: LegacyInvoicePayerDO, timestamp: number): InvoicePaymentDO {
        let payment = new InvoicePaymentDO();
        payment.transactionId = this.thUtils.generateUniqueID();
        payment.paymentMethod = new InvoicePaymentMethodDO();
        payment.paymentMethod.buildFromObject(legacyPayer.paymentMethod);
        payment.shouldApplyTransactionFee = legacyPayer.shouldApplyTransactionFee;
        payment.transactionFeeSnapshot = legacyPayer.transactionFeeSnapshot;
        payment.amount = legacyPayer.priceToPay;
        payment.amountPlusTransactionFee = legacyPayer.priceToPayPlusTransactionFee;
        payment.timestamp = timestamp;
        payment.notes = legacyPayer.additionalInvoiceDetails;
        return payment;
    }

    private getTimezoneForHotel(hotelId: string): Promise<string> {
        return new Promise<string>((resolve: { (result: string): void }, reject: { (err: ThError): void }) => {
            let timezone = this.hotelTimezoneMap[hotelId];
            if (_.isString(timezone)) {
                resolve(timezone);
                return;
            }
            this.hotelRepository.getHotelById(hotelId)
                .then(hotel => {
                    this.hotelTimezoneMap[hotelId] = hotel.timezone;
                    resolve(hotel.timezone);
                }).catch(e => {
                    reject(e);
                })
        });
    }

    public getPatchType(): MongoPatchType {
        return MongoPatchType.MigrateInvoiceGroupsToInvoices;
    }
    protected updateDocumentInMemory(invoiceGroup) { }
}
