import {BaseDO} from '../../common/base/BaseDO';
import {InvoiceDO, InvoicePaymentStatus} from './InvoiceDO';
import {InvoicePayerDO} from './payers/InvoicePayerDO';

export enum InvoiceGroupStatus {
	Active,
	Deleted
}

//TODO
//check validators: bookingValidator

export class InvoiceGroupDO extends BaseDO {
    constructor() {
        super();
    }

    id: string;
    versionId: number;
    hotelId: string;
    groupBookingId: string;
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

    public getAggregatedCustomerIdList(): string[] {
        return _.reduce(this.invoiceList, (result, invoice: InvoiceDO) => {
            return _.union(result, invoice.getPayerCustomerIdList());
        }, []);
    }

    public getAggregatedAddOnProductIdList(): string[] {
        return _.reduce(this.invoiceList, (result, invoice: InvoiceDO) => {
            return _.union(result, invoice.getAddOnProductIdList());
        }, []);
    }

    public getAggregatedPriceProductIdList(): string[] {
        return _.reduce(this.invoiceList, (result, invoice: InvoiceDO) => {
            return _.union(result, invoice.getPriceProductIdList());
        }, []);
    }

    public getAggregatedPayerList(): InvoicePayerDO[] {
        return _.reduce(this.invoiceList, (result, invoice: InvoiceDO) => {
            return _.union(result, invoice.payerList);
        }, []);
    }
}