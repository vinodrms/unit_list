import {BaseDO} from '../../common/base/BaseDO';
import {InvoiceDO} from './InvoiceDO';

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
    bookingId: string;
    indexedCustomerIdList: string[];
    invoiceList: InvoiceDO[];
    status: InvoiceGroupStatus;

    protected getPrimitivePropertyKeys(): string[] {
        return ["id", "versionId", "bookingId", "indexedCustomerIdList", "status"];
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