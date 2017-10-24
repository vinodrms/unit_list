import { Injectable, ReflectiveInjector } from "@angular/core";
import { AppContext } from "../../../../../../../../../../../../../../../common/utils/AppContext";
import { ModalDialogRef } from "../../../../../../../../../../../../../../../common/utils/modals/utils/ModalDialogRef";
import { ViewInvoiceHistoryModalInput } from "./utils/ViewInvoiceHistoryModalInput";
import { InvoiceDO } from "../../../../../../../../../../../../../services/invoices/data-objects/InvoiceDO";
import { ViewInvoiceHistoryModalModule } from "../ViewInvoiceHistoryModalModule";
import { ViewInvoiceHistoryModalComponent } from "../ViewInvoiceHistoryModalComponent";

@Injectable()
export class ViewInvoiceHistoryModalService {
    constructor(private context: AppContext) { }

    public openViewInvoiceHistoryModal(invoice: InvoiceDO): Promise<ModalDialogRef<any>> {
        var modalInput = new ViewInvoiceHistoryModalInput();
        modalInput.invoice = invoice;

        return this.context.modalService.open<any>(ViewInvoiceHistoryModalModule, ViewInvoiceHistoryModalComponent, ReflectiveInjector.resolve([
            { provide: ViewInvoiceHistoryModalInput, useValue: modalInput }
        ]));
    }
}
