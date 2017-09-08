import { InvoicePaymentStatus } from './InvoiceDO';
import {
    InvoicePayRight, InvoiceSetAsLossAcceptedByManagementRight, InvoiceEditItemsRight, InvoiceAddPaymentsRight,
    InvoiceRemoveRight, InvoiceEditPayersRight, InvoiceReinstateRight

} from './InvoiceEditRights';

export interface InvoiceMetaOptions {
    invoicePaymentStatus: InvoicePaymentStatus;
    invoicePayRight: InvoicePayRight;
    invoiceSetAsLossAcceptedByManagementRight: InvoiceSetAsLossAcceptedByManagementRight;
    invoiceEditItemsRight: InvoiceEditItemsRight;
    invoiceAddPaymentsRight: InvoiceAddPaymentsRight;
    invoiceRemoveRight: InvoiceRemoveRight;
    invoiceEditPayersRight: InvoiceEditPayersRight;
    invoiceReinstateRight: InvoiceReinstateRight;
}

export class InvoiceMeta {
    invoicePaymentStatus: InvoicePaymentStatus;
    invoicePayRight: InvoicePayRight;
    invoiceSetAsLossAcceptedByManagementRight: InvoiceSetAsLossAcceptedByManagementRight;
    invoiceEditItemsRight: InvoiceEditItemsRight;
    invoiceAddPaymentsRight: InvoiceAddPaymentsRight;
    invoiceRemoveRight: InvoiceRemoveRight;
    invoiceEditPayersRight: InvoiceEditPayersRight;
    invoiceReinstateRight: InvoiceReinstateRight;

    constructor(metaOptions: InvoiceMetaOptions) {
        this.invoicePaymentStatus = metaOptions.invoicePaymentStatus;
        this.invoicePayRight = metaOptions.invoicePayRight;
        this.invoiceSetAsLossAcceptedByManagementRight = metaOptions.invoiceSetAsLossAcceptedByManagementRight;
        this.invoiceEditItemsRight = metaOptions.invoiceEditItemsRight;
        this.invoiceAddPaymentsRight = metaOptions.invoiceAddPaymentsRight;
        this.invoiceRemoveRight = metaOptions.invoiceRemoveRight;
        this.invoiceEditPayersRight = metaOptions.invoiceEditPayersRight;
        this.invoiceReinstateRight = metaOptions.invoiceReinstateRight;
    }
}