import { BaseDO } from "../../common/base/BaseDO";
import { TaxDO } from "../../taxes/data-objects/TaxDO";
import { InvoiceItemDO, InvoiceItemType } from "./items/InvoiceItemDO";
import { InvoicePayerDO } from "./payer/InvoicePayerDO";
import { ThDateDO } from "../../../utils/th-dates/data-objects/ThDateDO";

import _ = require('underscore');

export enum InvoiceStatus {
    Active,
    Deleted
}

export enum InvoicePaymentStatus {
    Unpaid, Paid, LossAcceptedByManagement, Credit
}

export class InvoiceDO extends BaseDO {
    id: string;
    versionId: number;
    hotelId: string;
    status: InvoiceStatus;
    groupId: string;
    reference: string;
    paymentStatus: InvoicePaymentStatus;
    indexedCustomerIdList: string[];
    indexedBookingIdList: string[];
    vatTaxListSnapshot: TaxDO[];
    reinstatedInvoiceId: string;
    notesFromBooking: string;
    itemList: InvoiceItemDO[];
    payerList: InvoicePayerDO[];
    // the actual UTC timestamp when the invoice was paid
    paidTimestamp: number;
    paymentDueDate: ThDateDO;

    protected getPrimitivePropertyKeys(): string[] {
        return ["id", "versionId", "hotelId", "groupId", "reference", "paymentStatus", "indexedCustomerIdList",
            "indexedBookingIdList", "reinstatedInvoiceId", "notesFromBooking", "paidTimestamp"];
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
        let customerIdList = _.map(this.payerList, (payer: InvoicePayerDO) => {
            return payer.customerId;
        });
        this.indexedCustomerIdList = _.uniq(customerIdList);

        let bookingItemList = _.filter(this.itemList, item => {
            return item.type === InvoiceItemType.Booking;
        });
        let bookingIdList = _.map(bookingItemList, bookingItem => {
            return bookingItem.id;
        });
        this.indexedBookingIdList = _.uniq(bookingIdList);
    }
}
