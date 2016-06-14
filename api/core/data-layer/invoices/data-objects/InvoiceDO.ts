import {BaseDO} from '../../common/base/BaseDO';
import {PayerDO} from './payers/PayerDO';
import {InvoiceItemDO} from './items/InvoiceItemDO';

export enum InvoicePaymentStatus {
	Open, Closed
}

export class InvoiceDO extends BaseDO {
    constructor() {
        super();
    }    

    payerList: PayerDO[];
    itemList: InvoiceItemDO[];
    paymentStatus: InvoicePaymentStatus;

    protected getPrimitivePropertyKeys(): string[] {
        return ["paymentStatus"];
    }
    
    public buildFromObject(object: Object) {
		super.buildFromObject(object);
        
        this.payerList = [];
        this.forEachElementOf(this.getObjectPropertyEnsureUndefined(object, "payerList"), (payerObject: Object) => {
            var payerDO: PayerDO;
            payerDO.buildFromObject(payerObject);
            this.payerList.push(payerDO);
        });

        this.itemList = [];
        this.forEachElementOf(this.getObjectPropertyEnsureUndefined(object, "itemList"), (itemObject: Object) => {
            var itemDO: InvoiceItemDO;
            itemDO.buildFromObject(itemObject);
            this.itemList.push(itemDO);
        });
    }
}