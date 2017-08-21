import { BaseDO } from "../../common/base/BaseDO";
import { TaxDO } from "../../taxes/data-objects/TaxDO";
import { InvoiceItemDO } from "./items/InvoiceItemDO";
import { InvoicePayerDO } from "./payer/InvoicePayerDO";

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
    }
}
