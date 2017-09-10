import { InvoiceMeta } from './InvoiceMeta';
import { InvoicePaymentStatus } from './InvoiceDO';
import {
    InvoicePayRight, InvoiceSetAsLossAcceptedByManagementRight, InvoiceEditItemsRight, InvoiceAddPaymentsRight,
    InvoiceRemoveRight, InvoiceEditPayersRight, InvoiceReinstateRight

} from './InvoiceEditRights';

import * as _ from "underscore";

export class InvoiceMetaFactory {
    public getInvoiceMetaList(): InvoiceMeta[] {
        return [
            new InvoiceMeta({
                invoicePaymentStatus: InvoicePaymentStatus.Transient,
                displayName: "Transient",
                invoicePayRight: InvoicePayRight.None,
                invoiceSetAsLossAcceptedByManagementRight: InvoiceSetAsLossAcceptedByManagementRight.None,
                invoiceEditItemsRight: InvoiceEditItemsRight.Edit,
                invoiceAddPaymentsRight: InvoiceAddPaymentsRight.Edit,
                invoiceRemoveRight: InvoiceRemoveRight.None,
                invoiceEditPayersRight: InvoiceEditPayersRight.Edit,
                invoiceReinstateRight: InvoiceReinstateRight.None
            }),
            new InvoiceMeta({
                invoicePaymentStatus: InvoicePaymentStatus.Paid,
                displayName: "Paid",
                invoicePayRight: InvoicePayRight.None,
                invoiceSetAsLossAcceptedByManagementRight: InvoiceSetAsLossAcceptedByManagementRight.None,
                invoiceEditItemsRight: InvoiceEditItemsRight.None,
                invoiceAddPaymentsRight: InvoiceAddPaymentsRight.None,
                invoiceRemoveRight: InvoiceRemoveRight.None,
                invoiceEditPayersRight: InvoiceEditPayersRight.None,
                invoiceReinstateRight: InvoiceReinstateRight.Edit
            }),
            new InvoiceMeta({
                invoicePaymentStatus: InvoicePaymentStatus.LossAcceptedByManagement,
                displayName: "Loss Accepted By Management",
                invoicePayRight: InvoicePayRight.None,
                invoiceSetAsLossAcceptedByManagementRight: InvoiceSetAsLossAcceptedByManagementRight.None,
                invoiceEditItemsRight: InvoiceEditItemsRight.None,
                invoiceAddPaymentsRight: InvoiceAddPaymentsRight.None,
                invoiceRemoveRight: InvoiceRemoveRight.None,
                invoiceEditPayersRight: InvoiceEditPayersRight.None,
                invoiceReinstateRight: InvoiceReinstateRight.None
            }),
            new InvoiceMeta({
                invoicePaymentStatus: InvoicePaymentStatus.Unpaid,
                displayName: "Unpaid",
                invoicePayRight: InvoicePayRight.Edit,
                invoiceSetAsLossAcceptedByManagementRight: InvoiceSetAsLossAcceptedByManagementRight.Edit,
                invoiceEditItemsRight: InvoiceEditItemsRight.Edit,
                invoiceAddPaymentsRight: InvoiceAddPaymentsRight.Edit,
                invoiceRemoveRight: InvoiceRemoveRight.Edit,
                invoiceEditPayersRight: InvoiceEditPayersRight.Edit,
                invoiceReinstateRight: InvoiceReinstateRight.None
            }),
            new InvoiceMeta({
                invoicePaymentStatus: InvoicePaymentStatus.Credit,
                displayName: "Credit",
                invoicePayRight: InvoicePayRight.None,
                invoiceSetAsLossAcceptedByManagementRight: InvoiceSetAsLossAcceptedByManagementRight.None,
                invoiceEditItemsRight: InvoiceEditItemsRight.None,
                invoiceAddPaymentsRight: InvoiceAddPaymentsRight.None,
                invoiceRemoveRight: InvoiceRemoveRight.None,
                invoiceEditPayersRight: InvoiceEditPayersRight.None,
                invoiceReinstateRight: InvoiceReinstateRight.None
            })
        ];
    }

    public getInvoiceMetaByPaymentStatus(status: InvoicePaymentStatus): InvoiceMeta {
        var invoiceMetaList = this.getInvoiceMetaList();
        return _.find(invoiceMetaList, (invoiceMeta: InvoiceMeta) => { return invoiceMeta.invoicePaymentStatus === status });
    }
}
