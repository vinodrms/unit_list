import { Component, OnInit } from "@angular/core";
import { BaseComponent } from "../../../../../../../../../../../../../../common/base/BaseComponent";
import { ICustomModalComponent, ModalSize } from "../../../../../../../../../../../../../../common/utils/modals/utils/ICustomModalComponent";
import { AppContext } from "../../../../../../../../../../../../../../common/utils/AppContext";
import { ModalDialogRef } from "../../../../../../../../../../../../../../common/utils/modals/utils/ModalDialogRef";
import { AddInvoicePayerNotesModalInput } from "./services/utils/AddInvoicePayerNotesModalInput";

@Component({
    selector: 'add-invoice-payer-notes-modal',
    templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/operations-modal/components/components/invoice-operations/components/invoice-overview/modal/templates/add-invoice-payer-notes-modal.html'
})
export class AddInvoicePayerNotesModalComponent extends BaseComponent implements ICustomModalComponent, OnInit {

    private notes: string;

    constructor(private modalDialogRef: ModalDialogRef<string>,
        private appContext: AppContext,
        private modalInput: AddInvoicePayerNotesModalInput) {
        super();
    }

    ngOnInit() {
        this.notes = this.modalInput.payerNotes;
    }

    public closeDialog() {
        this.modalDialogRef.closeForced();
    }

    public addNotes() {
        if (this.appContext.thUtils.isUndefinedOrNull(this.notes) || this.notes.length == 0) {
            let errorMessage = this.appContext.thTranslation.translate("Please add a note.");
            this.appContext.toaster.error(errorMessage);
            return;
        }
        this.modalDialogRef.addResult(this.notes);
        this.modalDialogRef.closeForced();
    }

    public isBlocking(): boolean {
        return true;
    }
    public getSize(): ModalSize {
        return ModalSize.Small;
    }
}
