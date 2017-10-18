import { Component, OnInit } from "@angular/core";
import { BaseComponent } from "../../../../../../../../../../../../../../common/base/BaseComponent";
import { ICustomModalComponent, ModalSize } from "../../../../../../../../../../../../../../common/utils/modals/utils/ICustomModalComponent";
import { AppContext } from "../../../../../../../../../../../../../../common/utils/AppContext";
import { ModalDialogRef } from "../../../../../../../../../../../../../../common/utils/modals/utils/ModalDialogRef";
import { ViewInvoiceHistoryModalInput } from "./services/utils/ViewInvoiceHistoryModalInput";

@Component({
    selector: 'view-invoice-history-modal',
    templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/operations-modal/components/components/invoice-operations/components/invoice-overview/modal/templates/view-invoice-history-modal.html'
})
export class ViewInvoiceHistoryModalComponent extends BaseComponent implements ICustomModalComponent {

    constructor(private modalDialogRef: ModalDialogRef<any>,
        private appContext: AppContext,
        private modalInput: ViewInvoiceHistoryModalInput) {
        super();
    }

    public closeDialog() {
        this.modalDialogRef.closeForced();
    }

    public isBlocking(): boolean {
        return true;
    }
    public getSize(): ModalSize {
        return ModalSize.Medium;
    }
}
