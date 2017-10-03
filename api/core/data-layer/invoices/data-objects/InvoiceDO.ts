import { BaseDO } from "../../common/base/BaseDO";
import { TaxDO } from "../../taxes/data-objects/TaxDO";
import { InvoiceItemDO, InvoiceItemType } from "./items/InvoiceItemDO";
import { InvoicePayerDO } from "./payer/InvoicePayerDO";
import { ThDateDO } from "../../../utils/th-dates/data-objects/ThDateDO";
import { BookingDO } from "../../bookings/data-objects/BookingDO";
import { ThUtils } from "../../../utils/ThUtils";
import { CustomerDO } from "../../customers/data-objects/CustomerDO";
import { InvoicePaymentDO } from "./payer/InvoicePaymentDO";
import { InvoicePaymentMethodType } from "./payer/InvoicePaymentMethodDO";

import _ = require('underscore');

export enum InvoiceStatus {
    Active,
    Deleted
}

export enum InvoicePaymentStatus {
    Unpaid, Paid, LossAcceptedByManagement
}

export enum InvoiceAccountingType {
    Debit, Credit
}

export class InvoiceDO extends BaseDO {
    id: string;
    versionId: number;
    hotelId: string;
    status: InvoiceStatus;
    accountingType: InvoiceAccountingType;
    groupId: string;
    reference: string;
    paymentStatus: InvoicePaymentStatus;
    indexedCustomerIdList: string[];
    indexedBookingIdList: string[];
    vatTaxListSnapshot: TaxDO[];
    reinstatedInvoiceId: string;
    notesFromBooking: string;
    itemList: InvoiceItemDO[];
    amountToPay: number;
    amountPaid: number;
    payerList: InvoicePayerDO[];
    // the actual UTC timestamp when the invoice was paid
    paidTimestamp: number;
    paymentDueDate: ThDateDO;

    protected getPrimitivePropertyKeys(): string[] {
        return ["id", "versionId", "hotelId", "status", "accountingType", "groupId", "reference", "paymentStatus",
            "indexedCustomerIdList", "indexedBookingIdList", "reinstatedInvoiceId", "notesFromBooking", "amountToPay",
            "amountPaid", "paidTimestamp"];
    }

    public buildFromObject(object: Object) {
        super.buildFromObject(object);

        this.vatTaxListSnapshot = [];
        this.forEachElementOf(this.getObjectPropertyEnsureUndefined(object, "vatTaxListSnapshot"), (vatTaxSnapshotObject: Object) => {
            var taxDO = new TaxDO();
            taxDO.buildFromObject(vatTaxSnapshotObject);
            this.vatTaxListSnapshot.push(taxDO);
        });

        this.itemList = [];
        this.forEachElementOf(this.getObjectPropertyEnsureUndefined(object, "itemList"), (itemObject: Object) => {
            var item = new InvoiceItemDO();
            item.buildFromObject(itemObject);
            this.itemList.push(item);
        });

        this.payerList = [];
        this.forEachElementOf(this.getObjectPropertyEnsureUndefined(object, "payerList"), (payerObject: Object) => {
            var payer = new InvoicePayerDO();
            payer.buildFromObject(payerObject);
            this.payerList.push(payer);
        });

        this.paymentDueDate = new ThDateDO();
        this.paymentDueDate.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "paymentDueDate"));
    }

    public reindex() {
        let customerIdList: string[] = _.map(this.payerList, (payer: InvoicePayerDO) => {
            return payer.customerId;
        });
        this.indexedCustomerIdList = _.uniq(customerIdList);

        this.indexedBookingIdList = this.getItemIdListByItemType(InvoiceItemType.Booking);
    }

    public recomputePrices() {
        let utils = new ThUtils();
        this.amountToPay = _.reduce(this.itemList, function (sum, item: InvoiceItemDO) {
            return sum + item.meta.getTotalPrice();
        }, 0);
        this.amountToPay = utils.roundNumberToTwoDecimals(this.amountToPay);

        this.amountPaid = 0.0;
        this.payerList.forEach((payer: InvoicePayerDO) => {
            payer.paymentList.forEach((payment: InvoicePaymentDO) => {
                this.amountPaid += payment.amount;
            });
        });
        this.amountPaid = utils.roundNumberToTwoDecimals(this.amountPaid);
    }

    public removeItemsPopulatedFromBooking() {
        let updatedItems: InvoiceItemDO[] = [];
        _.forEach(this.itemList, (item: InvoiceItemDO) => {
            if (item.type === InvoiceItemType.Booking) {
                delete item.meta;
                updatedItems.push(item);
            }
            else if (!item.meta.isDerivedFromBooking()) {
                updatedItems.push(item);
            }
        });
        this.itemList = updatedItems;
    }

    public linkBookingPrices(indexedBookingsById: { [id: string]: BookingDO }) {
        let thUtils = new ThUtils();
        let actualItemList: InvoiceItemDO[] = [];
        _.forEach(this.itemList, (item: InvoiceItemDO) => {
            if (item.type === InvoiceItemType.Booking) {
                let booking = indexedBookingsById[item.id];
                if (thUtils.isUndefinedOrNull(booking)) {
                    actualItemList.push(item);
                } else {
                    let bookingInvoiceItemList = this.getBookingInvoiceItems(item, booking);
                    actualItemList = actualItemList.concat(bookingInvoiceItemList);
                }
            }
            else {
                actualItemList.push(item);
            }
        });
        this.itemList = actualItemList;
    }
    private getBookingInvoiceItems(item: InvoiceItemDO, booking: BookingDO): InvoiceItemDO[] {
        let bookingInvoiceItemList: InvoiceItemDO[] = [];

        booking.price.roomId = booking.roomId;
        booking.price.customerId = booking.defaultBillingDetails.customerIdDisplayedAsGuest;
        if (!booking.price.customerId) {
            booking.price.customerId = booking.defaultBillingDetails.customerId;
        }
        booking.price.bookingReference = booking.displayedReservationNumber;

        item.meta = booking.price;
        bookingInvoiceItemList.push(item);

        if (booking.price.hasDeductedCommission()) {
            var invoiceRoomCommissionItem = new InvoiceItemDO();
            invoiceRoomCommissionItem.buildItemFromRoomCommission(booking.price.deductedCommissionPrice);
            invoiceRoomCommissionItem.parentTransactionId = item.transactionId;
            bookingInvoiceItemList.push(invoiceRoomCommissionItem);
        }

        if (!booking.price.isPenalty()) {
            booking.price.includedInvoiceItemList.reverse();
            _.forEach(booking.price.includedInvoiceItemList, (invoiceItem: InvoiceItemDO) => {
                var includedItem = new InvoiceItemDO();
                includedItem.buildFromObject(invoiceItem);
                includedItem.parentTransactionId = item.transactionId;

                bookingInvoiceItemList = bookingInvoiceItemList.concat(includedItem);
            });
        }
        return bookingInvoiceItemList;
    }
    public addInvoiceFeeIfNecessary(indexedCustomersById: { [id: string]: CustomerDO }) {
        let thUtils = new ThUtils();
        this.payerList.forEach((payer: InvoicePayerDO) => {
            payer.paymentList.forEach((payment: InvoicePaymentDO) => {
                if (payment.paymentMethod.type === InvoicePaymentMethodType.PayInvoiceByAgreement) {
                    var customerDO = indexedCustomersById[payer.customerId];
                    if (!thUtils.isUndefinedOrNull(customerDO)) {
                        var invoiceFeeItem = new InvoiceItemDO();
                        invoiceFeeItem.buildFeeItemFromCustomerDO(customerDO);
                        this.itemList.push(invoiceFeeItem);
                    }
                }
            });
        });
    }

    public getAddOnProductIdList(): string[] {
        return this.getItemIdListByItemType(InvoiceItemType.AddOnProduct);
    }
    private getItemIdListByItemType(itemType: InvoiceItemType): string[] {
        return _.chain(this.itemList)
            .filter((invoiceItem: InvoiceItemDO) => {
                return invoiceItem.type === itemType;
            })
            .map((invoiceItem: InvoiceItemDO) => {
                return invoiceItem.id;
            })
            .uniq()
            .value();
    }

    public isWalkInInvoice(): boolean {
        return this.indexedBookingIdList.length == 0;
    }

    public isPaid(): boolean {
        return this.paymentStatus === InvoicePaymentStatus.Paid;
    }
    public isLossAcceptedByManagement(): boolean {
        return this.paymentStatus === InvoicePaymentStatus.LossAcceptedByManagement;
    }
    public isUnpaid(): boolean {
        return this.paymentStatus === InvoicePaymentStatus.Unpaid;
    }
    public isClosed(): boolean {
        return this.isPaid() || this.isLossAcceptedByManagement();
    }

    public isCredit(): boolean {
        return this.accountingType === InvoiceAccountingType.Credit;
    }
    public isDebit(): boolean {
        return this.accountingType === InvoiceAccountingType.Debit;
    }

    public isReinstatement(): boolean {
        var thUtils = new ThUtils();
        return !thUtils.isUndefinedOrNull(this.reinstatedInvoiceId);
    }

    public getAccountingFactor(): number {
        if (this.accountingType === InvoiceAccountingType.Credit) {
            return -1;
        }
        return 1;
    }
}
