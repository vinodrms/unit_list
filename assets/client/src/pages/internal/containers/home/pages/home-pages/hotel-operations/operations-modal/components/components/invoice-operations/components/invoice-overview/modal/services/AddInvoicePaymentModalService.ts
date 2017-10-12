import { Injectable, ReflectiveInjector } from "@angular/core";
import { AppContext } from "../../../../../../../../../../../../../../../common/utils/AppContext";
import { ModalDialogRef } from "../../../../../../../../../../../../../../../common/utils/modals/utils/ModalDialogRef";
import { InvoicePaymentDO } from "../../../../../../../../../../../../../services/invoices/data-objects/payer/InvoicePaymentDO";
import { AddInvoicePaymentModalInput } from "./utils/AddInvoicePaymentModalInput";
import { InvoiceDO } from "../../../../../../../../../../../../../services/invoices/data-objects/InvoiceDO";
import { AddInvoicePaymentModalComponent } from "../AddInvoicePaymentModalComponent";
import { AddInvoicePaymentModalModule } from "../AddInvoicePaymentModalModule";
import { CustomerDO } from "../../../../../../../../../../../../../services/customers/data-objects/CustomerDO";
import { InvoiceOperationsPageData } from "../../../../utils/InvoiceOperationsPageData";

@Injectable()
export class AddInvoicePaymentModalService {
    constructor(private context: AppContext) { }

    public openAddInvoicePaymentModal(invoice: InvoiceDO, customerDO: CustomerDO, invoiceOperationsPageData: InvoiceOperationsPageData): Promise<ModalDialogRef<InvoicePaymentDO>> {
        var modalInput = new AddInvoicePaymentModalInput();
        modalInput.invoiceAmountLeftToPay = this.context.thUtils.roundNumberToTwoDecimals(invoice.amountToPay - invoice.amountPaid);
        modalInput.customer = customerDO;
        modalInput.invoiceOperationsPageData = invoiceOperationsPageData;

        return this.context.modalService.open<any>(AddInvoicePaymentModalModule, AddInvoicePaymentModalComponent, ReflectiveInjector.resolve([
            { provide: AddInvoicePaymentModalInput, useValue: modalInput }
        ]));
    }
}
