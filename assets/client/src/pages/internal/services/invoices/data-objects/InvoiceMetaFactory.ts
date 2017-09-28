import { InvoiceMeta } from './InvoiceMeta';
import { InvoicePaymentStatus, InvoiceAccountingType } from './InvoiceDO';
import {
    InvoicePayRight, InvoiceSetAsLossAcceptedByManagementRight, InvoiceEditItemsRight, InvoiceAddPaymentsRight,
    InvoiceRemoveRight, InvoiceEditPayersRight, InvoiceReinstateRight, InvoiceDownloadRight, InvoiceTransferRight

} from './InvoiceEditRights';

import * as _ from "underscore";

export class InvoiceMetaFactory {
    public getInvoiceMetaList(): InvoiceMeta[] {
        return [
            this.getTransientInvoiceMeta(InvoiceAccountingType.Credit),
            this.getTransientInvoiceMeta(InvoiceAccountingType.Debit),

            this.getUnpaidInvoiceMeta(InvoiceAccountingType.Credit),
            this.getUnpaidInvoiceMeta(InvoiceAccountingType.Debit),

            this.getLossAcceptedByManagementInvoiceMeta(InvoiceAccountingType.Credit),
            this.getLossAcceptedByManagementInvoiceMeta(InvoiceAccountingType.Debit),

            this.getPaidInvoiceMeta(),
            this.getCreditInvoiceMeta(),
        ];
    }

    private getTransientInvoiceMeta(invoiceAccountingType: InvoiceAccountingType): InvoiceMeta {
        return {
            invoicePaymentStatus: InvoicePaymentStatus.Transient,
            invoiceAccountingType: invoiceAccountingType,
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
        };
    }
    private getUnpaidInvoiceMeta(invoiceAccountingType: InvoiceAccountingType): InvoiceMeta {
        return {
            invoicePaymentStatus: InvoicePaymentStatus.Unpaid,
            invoiceAccountingType: invoiceAccountingType,
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
        }
    }
    private getLossAcceptedByManagementInvoiceMeta(invoiceAccountingType: InvoiceAccountingType): InvoiceMeta {
        return {
            invoicePaymentStatus: InvoicePaymentStatus.LossAcceptedByManagement,
            invoiceAccountingType: invoiceAccountingType,
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
        }
    }

    private getPaidInvoiceMeta(): InvoiceMeta {
        return {
            invoicePaymentStatus: InvoicePaymentStatus.Paid,
            invoiceAccountingType: InvoiceAccountingType.Debit,
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
        };
    }
    private getCreditInvoiceMeta(): InvoiceMeta {
        return {
            invoicePaymentStatus: InvoicePaymentStatus.Paid,
            invoiceAccountingType: InvoiceAccountingType.Credit,
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
        }
    }

    public getInvoiceMeta(status: InvoicePaymentStatus, invoiceAccountingType: InvoiceAccountingType): InvoiceMeta {
        var invoiceMetaList = this.getInvoiceMetaList();
        return _.find(invoiceMetaList, (invoiceMeta: InvoiceMeta) => {
            return invoiceMeta.invoicePaymentStatus === status
                && invoiceMeta.invoiceAccountingType === invoiceAccountingType;
        });
    }
}
