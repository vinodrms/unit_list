import { BaseDO } from '../../../../../common/base/BaseDO';
import { ThUtils } from '../../../../../common/utils/ThUtils';
import { InvoiceItemDO, InvoiceItemType } from './items/InvoiceItemDO';
import { InvoicePayerDO } from './payers/InvoicePayerDO';
import { InvoicePaymentMethodType } from './payers/InvoicePaymentMethodDO';
import { CustomerDO } from '../../customers/data-objects/CustomerDO';

export enum InvoicePaymentStatus {
    Unpaid, Paid, LossAcceptedByManagement
}

export class InvoiceDO extends BaseDO {

    bookingId: string;
    invoiceReference: string;
    payerList: InvoicePayerDO[];
    itemList: InvoiceItemDO[];
    paymentStatus: InvoicePaymentStatus;
    notesFromBooking: string;

    protected getPrimitivePropertyKeys(): string[] {
        return ["bookingId", "invoiceReference", "paymentStatus", "notesFromBooking"];
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
    }

    public buildCleanInvoice() {
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
        var thUtils = new ThUtils();
        return _.reduce(this.itemList, (memo: number, item: InvoiceItemDO) => {
            return thUtils.roundNumberToTwoDecimals(memo + thUtils.roundNumberToTwoDecimals(item.meta.getNumberOfItems() * item.meta.getUnitPrice()));
        }, 0);
    }
    public getAmountPaid(): number {
        var thUtils = new ThUtils();
        return _.reduce(this.payerList, (amountPaid: number, payerDO: InvoicePayerDO) => {
            return thUtils.roundNumberToTwoDecimals(amountPaid + payerDO.priceToPay);
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
            if (invoiceItemDO.isDerivedFromBooking()) {
                itemsToRemoveIdList.push(invoiceItemDO.id);
            }
            else if (invoiceItemDO.type === InvoiceItemType.Booking) {
                delete invoiceItemDO.meta;
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
}