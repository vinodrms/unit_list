import { BaseDO } from '../../common/base/BaseDO';
import { InvoiceDO, InvoicePaymentStatus, InvoiceAccountingType } from './InvoiceDO';
import { InvoiceItemDO } from './items/InvoiceItemDO';
import { InvoicePayerDO } from './payers/InvoicePayerDO';
import { IBookingRepository } from '../../bookings/repositories/IBookingRepository';
import { BookingDO } from '../../bookings/data-objects/BookingDO';
import { CustomerDO } from '../../customers/data-objects/CustomerDO';
import { TaxDO } from '../../taxes/data-objects/TaxDO';
import { ThUtils } from "../../../utils/ThUtils";

import _ = require('underscore');

export enum InvoiceGroupStatus {
    Active,
    Deleted
}

export class InvoiceGroupDO extends BaseDO {
    id: string;
    invoiceGroupReference: string;
    versionId: number;
    hotelId: string;
    groupBookingId: string;
    indexedCustomerIdList: string[];
    invoiceList: InvoiceDO[];
    status: InvoiceGroupStatus;
    vatTaxListSnapshot: TaxDO[];

    protected getPrimitivePropertyKeys(): string[] {
        return ["id", "invoiceGroupReference", "versionId", "hotelId", "groupBookingId", "indexedCustomerIdList", "status"];
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

    public linkBookingPrices(bookingList: BookingDO[]) {
        _.forEach(this.invoiceList, (invoice: InvoiceDO) => {
            invoice.linkBookingPrices(bookingList);
        });
    }

    public addInvoiceFeeIfNecessary(customerDOList: CustomerDO[]) {
        _.forEach(this.invoiceList, (invoiceDO: InvoiceDO) => {
            invoiceDO.addInvoiceFeeIfNecessary(customerDOList);
        });
    }
    public removeItemsPopulatedFromBooking() {
        _.forEach(this.invoiceList, (invoiceDO: InvoiceDO) => {
            invoiceDO.removeItemsPopulatedFromBooking();
        });
    }

    public getInvoiceForBooking(bookingId: string): InvoiceDO {
        let debitInvoicesRelatedToBooking = _.filter(this.invoiceList, (invoice: InvoiceDO) => {
            return invoice.bookingId === bookingId && invoice.accountingType === InvoiceAccountingType.Debit;
        });

        debitInvoicesRelatedToBooking = _.sortBy(debitInvoicesRelatedToBooking, (invoice: InvoiceDO) => {
            return invoice.paidDateTimeUtcTimestamp;
        });

        return _.last(debitInvoicesRelatedToBooking);
    }

    public attachIdsToInvoicesIfNecessary() {
        let thUtils = new ThUtils();

        _.forEach(this.invoiceList, (invoice: InvoiceDO) => {
            if (thUtils.isUndefinedOrNull(invoice.id)) {
                invoice.id = thUtils.generateUniqueID();
            }
        });
    }

    public invoiceIsReinstated(invoiceId: string): boolean {
        let thUtils = new ThUtils();

        let lookedUpInvoice = _.find(this.invoiceList, (invoice: InvoiceDO) => {
            return invoice.id === invoiceId;
        });
        if (thUtils.isUndefinedOrNull(lookedUpInvoice)) {
            return false;
        }

        let reinstatementInvoice = _.find(this.invoiceList, (invoice: InvoiceDO) => {
            invoice.reinstatedInvoiceId === lookedUpInvoice.id;
        });

        return !thUtils.isUndefinedOrNull(reinstatementInvoice);
    }

    public getReinstatedInvoiceReference(reinstatementInvoiceId): string {
        let reinstatementInvoice = _.find(this.invoiceList, (invoice: InvoiceDO) => {
            return invoice.id === reinstatementInvoiceId;
        });

        let reinstatedInvoice = _.find(this.invoiceList, (invoice: InvoiceDO) => {
            return invoice.id === reinstatementInvoice.reinstatedInvoiceId;
        });

        let thUtils = new ThUtils();
        return thUtils.isUndefinedOrNull(reinstatedInvoice) ? '' : reinstatedInvoice.invoiceReference;
    }
}