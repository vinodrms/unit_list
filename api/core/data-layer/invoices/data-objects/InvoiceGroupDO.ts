import {BaseDO} from '../../common/base/BaseDO';
import {InvoiceDO, InvoicePaymentStatus} from './InvoiceDO';

export enum InvoiceGroupStatus {
	Active,
	Deleted
}

export class InvoiceGroupDO extends BaseDO {
    constructor() {
        super();
    }

    id: string;
    versionId: number;
    hotelId: string;
    bookingId: string;
    indexedCustomerIdList: string[];
    invoiceList: InvoiceDO[];
    paymentStatus: InvoicePaymentStatus;
    status: InvoiceGroupStatus;

    protected getPrimitivePropertyKeys(): string[] {
        return ["id", "versionId", "bookingId", "indexedCustomerIdList", "paymentStatus", "status"];
    }
    
    public buildFromObject(object: Object) {
		super.buildFromObject(object);
        
        this.invoiceList = [];
        this.forEachElementOf(this.getObjectPropertyEnsureUndefined(object, "invoiceList"), (invoiceObject: Object) => {
            var invoiceDO = new InvoiceDO();
            invoiceDO.buildFromObject(invoiceObject);
            this.invoiceList.push(invoiceDO);
        });
    }
}