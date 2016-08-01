import {BaseDO} from '../../../../../common/base/BaseDO';
import {ThUtils} from '../../../../../common/utils/ThUtils';
import {IPriceableEntity} from './price/IPriceableEntity';
import {InvoiceItemDO, InvoiceItemType} from './items/InvoiceItemDO';
import {InvoicePayerDO} from './payers/InvoicePayerDO';

export enum InvoicePaymentStatus {
    Open, Closed
}

export class InvoiceDO extends BaseDO implements IPriceableEntity {

    bookingId: string;
    payerList: InvoicePayerDO[];
    itemList: InvoiceItemDO[];
    paymentStatus: InvoicePaymentStatus;

    protected getPrimitivePropertyKeys(): string[] {
        return ["bookingId", "paymentStatus"];
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
        return _.reduce(this.itemList, function(memo: number, item: InvoiceItemDO){ return memo + item.meta.getNumberOfItems() * item.meta.getPrice(); }, 0);
    }
}