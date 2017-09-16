import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { AppContext } from "../../../../../../../../../../../../../common/utils/AppContext";
import { ThUtils } from "../../../../../../../../../../../../../common/utils/ThUtils";
import { InvoiceVM } from "../../../../../../../../../../../services/invoices/view-models/InvoiceVM";
import { CustomerDO } from "../../../../../../../../../../../services/customers/data-objects/CustomerDO";
import { InvoiceOperationsPageData } from "../../utils/InvoiceOperationsPageData";
import { InvoiceItemDO } from "../../../../../../../../../../../services/invoices/data-objects/items/InvoiceItemDO";
import { ModalDialogRef } from "../../../../../../../../../../../../../common/utils/modals/utils/ModalDialogRef";
import { InvoiceDO } from "../../../../../../../../../../../services/invoices/data-objects/InvoiceDO";
import { InvoiceSelectionModalService } from "../../../../../../../../../../common/inventory/modals/invoices/services/InvoiceSelectionModalService";
import { InvoicesDO } from "../../../../../../../../../../../services/invoices/data-objects/InvoicesDO";
import { InvoiceVMHelper } from "../../../../../../../../../../../services/invoices/view-models/utils/InvoiceVMHelper";

@Component({
    selector: 'invoice-transfer',
    templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/operations-modal/components/components/invoice-operations/components/invoice-transfer/template/invoice-transfer.html',
    providers: [InvoiceSelectionModalService, InvoiceVMHelper]
})
export class InvoiceTransferComponent implements OnInit {

    @Input() relatedInvoices: InvoiceVM[];
    @Input() invoiceOperationsPageData: InvoiceOperationsPageData;
    @Input() currentRelatedInvoiceIndex: number;
    @Output() backToInvoiceOverviewClicked = new EventEmitter();

    private _thUtils: ThUtils;

    transferInvoice: InvoiceVM;

    constructor(private _appContext: AppContext,
                private _invoiceVMHelper: InvoiceVMHelper,
                private _invoiceSelectionModalService: InvoiceSelectionModalService) {
        this._thUtils = new ThUtils();
    }

    ngOnInit() {
    }

    public get currentInvoice(): InvoiceVM {
        return this.relatedInvoices[this.currentRelatedInvoiceIndex];
    }

    public get payerList(): CustomerDO[] {
        return this.currentInvoice.customerList;
    }

    public backToInvoiceOverview() {
        this.backToInvoiceOverviewClicked.emit();
    }

    public isInvoiceSelectedForTransfer(): boolean {
        return !this._thUtils.isUndefinedOrNull(this.transferInvoice);
    }

    public openInvoiceSelectionModal() {
        this._invoiceSelectionModalService.openInvoiceSelectionModal(false, true).then((modalDialogInstance: ModalDialogRef<InvoiceDO[]>) => {
            modalDialogInstance.resultObservable.subscribe((selectedInvoiceList: InvoiceDO[]) => {
                var invoicesDO: InvoicesDO = new InvoicesDO();
                invoicesDO.invoiceList = [selectedInvoiceList[0]];
                this._invoiceVMHelper.convertToViewModels(invoicesDO).subscribe((invoiceVMList: InvoiceVM[]) => {
                    this.transferInvoice = invoiceVMList[0];
                });
            });
        }).catch((e: any) => { });
    }

    public get ccySymbol(): string {
        return this.invoiceOperationsPageData.ccy.symbol;
    }

    public getDisplayName(item: InvoiceItemDO): string {
        return item.meta.getDisplayName(this._appContext.thTranslation);
    }
}
