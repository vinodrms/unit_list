import {InvoiceGroupDO} from '../InvoiceGroupDO';
import {InvoiceDO, InvoicePaymentStatus} from '../InvoiceDO';
import {InvoicePayerDO} from '../payers/InvoicePayerDO';

import * as _ from "underscore";

export class InvoiceGroupPayerStatsDO {
    invoiceGroupId: string;
    groupBookingId: string;
    customerId: string;
    amountPaid: number;
    totalAmountToPay: number;

    public static buildInvoiceGroupPayerStatsListFromInvoiceGroupList(invoiceGroupList: InvoiceGroupDO[], customerId: string): InvoiceGroupPayerStatsDO[] {
        var invoicegroupPayerStatsList = [];
        _.forEach(invoiceGroupList, (invoiceGroup: InvoiceGroupDO) => {
            if(_.contains(invoiceGroup.indexedCustomerIdList, customerId)) {
                invoicegroupPayerStatsList.push(this.buildInvoiceGroupPayerStatsFromInvoiceGroupDO(invoiceGroup, customerId));
            }
        });
        return invoicegroupPayerStatsList;
    }

    private static buildInvoiceGroupPayerStatsFromInvoiceGroupDO(invoiceGroupDO: InvoiceGroupDO, customerId: string): InvoiceGroupPayerStatsDO {
        var invoiceGroupPayerStats = new InvoiceGroupPayerStatsDO();
        invoiceGroupPayerStats.invoiceGroupId = invoiceGroupDO.id;
        invoiceGroupPayerStats.groupBookingId = invoiceGroupDO.groupBookingId;
        invoiceGroupPayerStats.amountPaid = invoiceGroupDO.getAmountPaid(customerId);
        invoiceGroupPayerStats.totalAmountToPay = invoiceGroupDO.getAmountPaid(customerId)  + invoiceGroupDO.getAmountUnpaid(customerId);
        return invoiceGroupPayerStats;
    }

    public get invoiceGroupPaid(): boolean {
        return this.amountPaid === this.totalAmountToPay;
    }
}