import { InvoicePaymentStatus } from './InvoiceDO';
import {
    InvoicePayRight, InvoiceSetAsLossAcceptedByManagementRight, InvoiceEditItemsRight, InvoiceAddPaymentsRight,
    InvoiceRemoveRight, InvoiceEditPayersRight, InvoiceReinstateRight, InvoiceTransferRight

} from './InvoiceEditRights';

export interface InvoiceMetaOptions {
    invoicePaymentStatus: InvoicePaymentStatus;
    displayName: string;
    invoicePayRight: InvoicePayRight;
    invoiceSetAsLossAcceptedByManagementRight: InvoiceSetAsLossAcceptedByManagementRight;
    invoiceEditItemsRight: InvoiceEditItemsRight;
    invoiceAddPaymentsRight: InvoiceAddPaymentsRight;
    invoiceRemoveRight: InvoiceRemoveRight;
    invoiceEditPayersRight: InvoiceEditPayersRight;
    invoiceReinstateRight: InvoiceReinstateRight;
    invoiceTransferRight: InvoiceTransferRight;
}

export class InvoiceMeta {
    invoicePaymentStatus: InvoicePaymentStatus;
    displayName: string;
    invoicePayRight: InvoicePayRight;
    invoiceSetAsLossAcceptedByManagementRight: InvoiceSetAsLossAcceptedByManagementRight;
    invoiceEditItemsRight: InvoiceEditItemsRight;
    invoiceAddPaymentsRight: InvoiceAddPaymentsRight;
    invoiceRemoveRight: InvoiceRemoveRight;
    invoiceEditPayersRight: InvoiceEditPayersRight;
    invoiceReinstateRight: InvoiceReinstateRight;
    invoiceTransferRight: InvoiceTransferRight;

    constructor(metaOptions: InvoiceMetaOptions) {
        this.invoicePaymentStatus = metaOptions.invoicePaymentStatus;
        this.displayName = metaOptions.displayName;
        this.invoicePayRight = metaOptions.invoicePayRight;
        this.invoiceSetAsLossAcceptedByManagementRight = metaOptions.invoiceSetAsLossAcceptedByManagementRight;
        this.invoiceEditItemsRight = metaOptions.invoiceEditItemsRight;
        this.invoiceAddPaymentsRight = metaOptions.invoiceAddPaymentsRight;
        this.invoiceRemoveRight = metaOptions.invoiceRemoveRight;
        this.invoiceEditPayersRight = metaOptions.invoiceEditPayersRight;
        this.invoiceReinstateRight = metaOptions.invoiceReinstateRight;
        this.invoiceTransferRight = metaOptions.invoiceTransferRight;
    }
}
