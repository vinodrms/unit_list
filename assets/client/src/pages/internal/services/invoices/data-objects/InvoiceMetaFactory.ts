import { InvoiceMeta } from './InvoiceMeta';
import { InvoicePaymentStatus } from './InvoiceDO';
import {
    InvoicePayRight, InvoiceSetAsLossAcceptedByManagementRight, InvoiceEditItemsRight, InvoiceAddPaymentsRight,
    InvoiceRemoveRight, InvoiceEditPayersRight, InvoiceReinstateRight, InvoiceDownloadRight, InvoiceTransferRight

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
                invoiceReinstateRight: InvoiceReinstateRight.None,
                invoiceDownloadRight: InvoiceDownloadRight.None,
                invoiceTransferRight: InvoiceTransferRight.None,
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
                invoiceReinstateRight: InvoiceReinstateRight.Edit,
                invoiceDownloadRight: InvoiceDownloadRight.Available,
                invoiceTransferRight: InvoiceTransferRight.None,
            }),
            new InvoiceMeta({
                invoicePaymentStatus: InvoicePaymentStatus.LossAcceptedByManagement,
                displayName: "Loss Accepted By Management",
                invoicePayRight: InvoicePayRight.Edit,
                invoiceSetAsLossAcceptedByManagementRight: InvoiceSetAsLossAcceptedByManagementRight.None,
                invoiceEditItemsRight: InvoiceEditItemsRight.None,
                invoiceAddPaymentsRight: InvoiceAddPaymentsRight.Edit,
                invoiceRemoveRight: InvoiceRemoveRight.None,

                invoiceEditPayersRight: InvoiceEditPayersRight.Edit,
                invoiceReinstateRight: InvoiceReinstateRight.None,
                invoiceDownloadRight: InvoiceDownloadRight.Available,
                invoiceTransferRight: InvoiceTransferRight.None,
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
                invoiceReinstateRight: InvoiceReinstateRight.None,
                invoiceDownloadRight: InvoiceDownloadRight.None,
                invoiceTransferRight: InvoiceTransferRight.Edit,
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
                invoiceReinstateRight: InvoiceReinstateRight.None,
                invoiceDownloadRight: InvoiceDownloadRight.Available,
                invoiceTransferRight: InvoiceTransferRight.None,
            })
        ];
    }

    public getInvoiceMetaByPaymentStatus(status: InvoicePaymentStatus): InvoiceMeta {
        var invoiceMetaList = this.getInvoiceMetaList();
        return _.find(invoiceMetaList, (invoiceMeta: InvoiceMeta) => { return invoiceMeta.invoicePaymentStatus === status });
    }
}
