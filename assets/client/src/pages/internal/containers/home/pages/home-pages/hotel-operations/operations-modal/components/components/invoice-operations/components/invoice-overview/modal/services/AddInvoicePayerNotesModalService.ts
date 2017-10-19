import { Injectable, ReflectiveInjector } from "@angular/core";
import { AppContext } from "../../../../../../../../../../../../../../../common/utils/AppContext";
import { AddInvoicePayerNotesModalInput } from "./utils/AddInvoicePayerNotesModalInput";
import { ModalDialogRef } from "../../../../../../../../../../../../../../../common/utils/modals/utils/ModalDialogRef";
import { AddInvoicePayerNotesModalModule } from "../AddInvoicePayerNotesModalModule";
import { AddInvoicePayerNotesModalComponent } from "../AddInvoicePayerNotesModalComponent";

@Injectable()
export class AddInvoicePayerNotesModalService {
    constructor(private context: AppContext) { }

    public openAddInvoicePayerNotesModal(payerNotes: string): Promise<ModalDialogRef<string>> {
        var modalInput = new AddInvoicePayerNotesModalInput();
        modalInput.payerNotes = payerNotes;

        return this.context.modalService.open<any>(AddInvoicePayerNotesModalModule, AddInvoicePayerNotesModalComponent, ReflectiveInjector.resolve([
			{ provide: AddInvoicePayerNotesModalInput, useValue: modalInput }
            ])
        );
    }
}
