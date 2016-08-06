import {BaseDO} from '../../../../../../common/base/BaseDO';
import {InvoiceGroupDO} from '../InvoiceGroupDO';
import {InvoiceDO, InvoicePaymentStatus} from '../InvoiceDO';
import {InvoicePayerDO} from '../payers/InvoicePayerDO';

export class InvoiceGroupPayerStatsDO extends BaseDO {
    invoiceGroupId: string;
    invoiceGroupPaymentStatus: InvoicePaymentStatus;
    groupBookingId: string;
    customerId: string;
    amountPaid: number;
    amountUnpaid: number;

    protected getPrimitivePropertyKeys(): string[] {
        return ["invoiceGroupId", "invoiceGroupPaymentStatus", "customerId", "totalAmount", "totalAmountPaid", "totalAmountUnpaid"];
    }

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
        invoiceGroupPayerStats.amountUnpaid = invoiceGroupDO.getAmountUnpaid(customerId);
        invoiceGroupPayerStats.amountPaid = invoiceGroupDO.getAmountPaid(customerId);
        return invoiceGroupPayerStats;
    }

    public get invoiceGroupPaid(): boolean {
        return this.invoiceGroupPaymentStatus === InvoicePaymentStatus.Paid;
    }
}