import { BaseDO } from '../../../../../common/base/BaseDO';
import { TaxDO } from "../../taxes/data-objects/TaxDO";
import { InvoiceItemDO, InvoiceItemType } from "./items/InvoiceItemDO";
import { InvoicePayerDO } from "./payer/InvoicePayerDO";
import { ThDateDO } from "../../common/data-objects/th-dates/ThDateDO";
import { BookingDO } from "../../bookings/data-objects/BookingDO";
import { ThUtils } from '../../../../../common/utils/ThUtils';
import { CustomerDO } from "../../customers/data-objects/CustomerDO";
import { InvoicePaymentDO } from "./payer/InvoicePaymentDO";
import { InvoicePaymentMethodType } from "./payer/InvoicePaymentMethodDO";

import * as _ from "underscore";

export enum InvoiceStatus {
    Active,
    Deleted
}

export enum InvoicePaymentStatus {
    Transient = -1,
    Unpaid,
    Paid,
    LossAcceptedByManagement
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
        return ["id", "versionId", "hotelId", "accountingType", "groupId", "reference", "paymentStatus",
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

    public getCustomerIdList(): string[] {
        return _.map(this.payerList, (payer: InvoicePayerDO) => {
            return payer.customerId;
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
        return this.paymentStatus === InvoicePaymentStatus.Paid
            && this.accountingType === InvoiceAccountingType.Debit;
    }
    public isLossAcceptedByManagement(): boolean {
        return this.paymentStatus === InvoicePaymentStatus.LossAcceptedByManagement;
    }
    public isUnpaid(): boolean {
        return this.paymentStatus === InvoicePaymentStatus.Unpaid;
    }
    public isCredit(): boolean {
        return this.paymentStatus === InvoicePaymentStatus.Paid
            && this.accountingType === InvoiceAccountingType.Credit;
    }
    public isClosed(): boolean {
        return this.isPaid() || this.isLossAcceptedByManagement();
    }

    public isReinstatement(): boolean {
        return _.isString(this.reinstatedInvoiceId) && !_.isEmpty(this.reinstatedInvoiceId);
    }
}
