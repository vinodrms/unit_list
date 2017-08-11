import { BaseDO } from '../../../../../common/base/BaseDO';
import { ThUtils } from '../../../../../common/utils/ThUtils';
import { InvoiceItemDO, InvoiceItemType, InvoiceItemAccountingType } from './items/InvoiceItemDO';
import { InvoicePayerDO } from './payers/InvoicePayerDO';
import { InvoicePaymentMethodType } from './payers/InvoicePaymentMethodDO';
import { CustomerDO } from '../../customers/data-objects/CustomerDO';
import { BookingPriceDO } from "../../bookings/data-objects/price/BookingPriceDO";
import { PricePerDayDO } from "../../bookings/data-objects/price/PricePerDayDO";
import { ThDateDO } from "../../common/data-objects/th-dates/ThDateDO";
import { ThTimestampDO } from "../../common/data-objects/th-dates/ThTimestampDO";

import * as _ from "underscore";

export enum InvoiceAccountingType {
    Debit, Credit
}

export enum InvoicePaymentStatus {
    Unpaid, Paid, LossAcceptedByManagement
}

export class InvoiceDO extends BaseDO {
    id: string;
    accountingType: InvoiceAccountingType;
    bookingId: string;
    invoiceReference: string;
    payerList: InvoicePayerDO[];
    itemList: InvoiceItemDO[];
    paymentStatus: InvoicePaymentStatus;
    notesFromBooking: string;
    reinstatedInvoiceId: string;

    paidDate: ThDateDO;
    paidTimestamp: ThTimestampDO;
    paidDateUtcTimestamp: number;
    paidDateTimeUtcTimestamp: number;
    paymentDueDate: ThDateDO;

    protected getPrimitivePropertyKeys(): string[] {
        return ["id", "accountingType", "bookingId", "invoiceReference", "paymentStatus", "notesFromBooking", "reinstatedInvoiceId", "paidDateUtcTimestamp", "paidDateTimeUtcTimestamp"];
    }

    public buildFromObject(object: Object) {
        super.buildFromObject(object);

        this.payerList = [];
        this.forEachElementOf(this.getObjectPropertyEnsureUndefined(object, "payerList"), (payerObject: Object) => {
            var payerDO = new InvoicePayerDO();
            payerDO.buildFromObject(payerObject);
            this.payerList.push(payerDO);
        });
        this.itemList = [];
        this.forEachElementOf(this.getObjectPropertyEnsureUndefined(object, "itemList"), (itemObject: Object) => {
            var itemDO = new InvoiceItemDO();
            itemDO.buildFromObject(itemObject);
            this.itemList.push(itemDO);
        });

        this.paidDate = new ThDateDO();
        this.paidDate.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "paidDate"));

        this.paidTimestamp = new ThTimestampDO();
        this.paidTimestamp.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "paidTimestamp"));

        this.paymentDueDate = new ThDateDO();
        this.paymentDueDate.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "paymentDueDate"));
    }

    public buildCleanInvoice(accountingType: InvoiceAccountingType = InvoiceAccountingType.Debit) {
        this.accountingType = accountingType;
        this.payerList = [];
        var cleanInvoicePayerDO = new InvoicePayerDO();
        cleanInvoicePayerDO.priceToPay = this.getPrice();
        this.payerList.push(cleanInvoicePayerDO);
        this.itemList = [];
        this.paymentStatus = InvoicePaymentStatus.Unpaid;
    }

    public getPayerCustomerIdList(): string[] {
        return _.chain(this.payerList)
            .map((payerDO: InvoicePayerDO) => {
                return payerDO.customerId;
            })
            .uniq().value();
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
            .value();
    }

    public getPrice(): number {
        let totalPrice = 0;
        _.forEach(this.itemList, (item: InvoiceItemDO) => {
            let factor = item.accountingType === InvoiceItemAccountingType.Credit ? -1 : 1;
            totalPrice += item.meta.getTotalPrice() * factor;
        });
        var thUtils = new ThUtils();
        return thUtils.roundNumberToTwoDecimals(totalPrice);
    }

    public getAmountPaid(): number {
        var thUtils = new ThUtils();
        return _.reduce(this.payerList, (amountPaid: number, payerDO: InvoicePayerDO) => {
            return amountPaid + payerDO.priceToPay;
        }, 0);
    }
    
    public get isPaid(): boolean {
        return this.paymentStatus === InvoicePaymentStatus.Paid;
    }
    public get isLossAcceptedByManagement(): boolean {
        return this.paymentStatus === InvoicePaymentStatus.LossAcceptedByManagement;
    }
    public get isClosed(): boolean {
        return this.isPaid || this.isLossAcceptedByManagement;
    }

    public allAmountWasPaid(): boolean {
        return this.getPrice() === this.getAmountPaid();
    }

    public removeItemsPopulatedFromBooking() {
        var itemsToRemoveIdList = [];
        _.forEach(this.itemList, (invoiceItemDO: InvoiceItemDO) => {
            if (invoiceItemDO.type === InvoiceItemType.Booking) {
                delete invoiceItemDO.meta;
            }
            else if (invoiceItemDO.meta.isDerivedFromBooking()) {
                itemsToRemoveIdList.push(invoiceItemDO.id);
            }
        });
        _.forEach(itemsToRemoveIdList, (id: string) => {
            var index = _.findIndex(this.itemList, (invoiceItemDO: InvoiceItemDO) => {
                return invoiceItemDO.id === id;
            });
            if (index != -1) {
                this.itemList.splice(index, 1);
            }
        });
    }

    public isWalkInInvoice(): boolean {
        return !_.isString(this.bookingId) || this.bookingId.length == 0;
    }

    public getUniqueIdentifier(): string {
        let thUtils = new ThUtils();
        return thUtils.isUndefinedOrNull(this.id) ? this.invoiceReference : this.id;
    }

    public uniqueIdentifierEquals(uniqueId: string): boolean {
        let thUtils = new ThUtils();
        return thUtils.isUndefinedOrNull(this.id) ?
            this.invoiceReference === uniqueId : this.id === uniqueId;
    }

    public isReinstatement(): boolean {
        var thUtils = new ThUtils();
        return !thUtils.isUndefinedOrNull(this.reinstatedInvoiceId);
    }
}