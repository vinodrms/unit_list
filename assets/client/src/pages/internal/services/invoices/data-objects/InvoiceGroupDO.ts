import {BaseDO} from '../../../../../common/base/BaseDO';
import {ThUtils} from '../../../../../common/utils/ThUtils';
import {InvoiceDO, InvoicePaymentStatus} from './InvoiceDO';
import {InvoicePayerDO} from './payers/InvoicePayerDO';
import {TaxDO} from '../../taxes/data-objects/TaxDO';

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
    vatTaxListSnapshot: TaxDO[];

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

        this.vatTaxListSnapshot = [];
        this.forEachElementOf(this.getObjectPropertyEnsureUndefined(object, "vatTaxListSnapshot"), (vatTaxSnapshotObject: Object) => {
            var taxDO = new TaxDO();
            taxDO.buildFromObject(vatTaxSnapshotObject);
            this.vatTaxListSnapshot.push(taxDO);
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
        var thUtils = new ThUtils();

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
                return thUtils.roundNumberToTwoDecimals(totalPriceToPay + individualPrice);
            }, 0).value();
    }

    public invoiceIsReinstated(invoiceId: string): boolean {
        let thUtils = new ThUtils();

        let lookedUpInvoice = _.find(this.invoiceList, (invoice: InvoiceDO) => {
            return invoice.id === invoiceId;
        });
        if(thUtils.isUndefinedOrNull(lookedUpInvoice)) {
            return false;
        }

        let reinstatementInvoice = _.find(this.invoiceList, (invoice: InvoiceDO) => {
            invoice.reinstatedInvoiceId === lookedUpInvoice.id;    
        });

        return !thUtils.isUndefinedOrNull(reinstatementInvoice);
    }
}