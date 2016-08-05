import {BaseDO} from '../../../../../common/base/BaseDO';
import {ThUtils} from '../../../../../common/utils/ThUtils';
import {InvoiceDO, InvoicePaymentStatus} from './InvoiceDO';
import {InvoicePayerDO} from './payers/InvoicePayerDO';

export enum InvoiceGroupStatus {
    Active,
    Deleted
}

export class InvoiceGroupDO extends BaseDO {
    id: string;
    versionId: number;
    hotelId: string;
    groupBookingId: string;
    indexedCustomerIdList: string[];
    invoiceList: InvoiceDO[];
    status: InvoiceGroupStatus;

    protected getPrimitivePropertyKeys(): string[] {
        return ["id", "versionId", "hotelId", "groupBookingId", "indexedCustomerIdList", "status"];
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

    public getAggregatedPayerList(): InvoicePayerDO[] {
        return _.reduce(this.invoiceList, (result, invoice: InvoiceDO) => {
            return _.union(result, invoice.payerList);
        }, []);
    }

    public reindexByCustomerId() {
        this.indexedCustomerIdList = _.chain(this.invoiceList).map((invoice: InvoiceDO) => {
            return invoice.payerList;
        })
            .flatten()
            .map((invoicePayer: InvoicePayerDO) => {
                return invoicePayer.customerId;
            })
            .uniq()
            .value();
    }

    public getAmountUnpaid(customerId: string): number {
        return this.getAmount(customerId, InvoicePaymentStatus.Unpaid);
    }
    public getAmountPaid(customerId: string): number {
        return this.getAmount(customerId, InvoicePaymentStatus.Paid);
    }
    private getAmount(customerId: string, type: InvoicePaymentStatus): number {
        return _.chain(this.invoiceList)
            .filter((invoice: InvoiceDO) => {
                return invoice.paymentStatus === type;
            }).map((invoice: InvoiceDO) => {
                return invoice.payerList;
            }).flatten().filter((invoicePayer: InvoicePayerDO) => {
                return invoicePayer.customerId === customerId;
            }).map((invoicePayer: InvoicePayerDO) => {
                return invoicePayer.priceToPay;
            }).reduce((totalPriceToPay, individualPrice) => {
                return totalPriceToPay + individualPrice;
            }, 0).value();
    }
}