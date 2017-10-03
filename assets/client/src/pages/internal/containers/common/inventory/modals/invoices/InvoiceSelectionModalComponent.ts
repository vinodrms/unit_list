import _ = require('underscore');
import { Component, AfterViewInit, ViewChild, ReflectiveInjector, Injector } from "@angular/core";
import { BaseComponent } from "../../../../../../../common/base/BaseComponent";
import { ICustomModalComponent, ModalSize } from "../../../../../../../common/utils/modals/utils/ICustomModalComponent";
import { InvoiceService } from "../../../../../services/invoices/InvoiceService";
import { LazyLoadingTableComponent } from "../../../../../../../common/utils/components/lazy-loading/LazyLoadingTableComponent";
import { InvoiceVM } from "../../../../../services/invoices/view-models/InvoiceVM";
import { InvoiceDO, InvoicePaymentStatus } from "../../../../../services/invoices/data-objects/InvoiceDO";
import { AppContext } from "../../../../../../../common/utils/AppContext";
import { ModalDialogRef } from "../../../../../../../common/utils/modals/utils/ModalDialogRef";
import { InvoiceSelectionModalInput } from "./services/utils/InvoiceSelectionModalInput";
import { LazyLoadTableMeta, TableRowCommand } from "../../../../../../../common/utils/components/lazy-loading/utils/LazyLoadTableMeta";
import { InvoiceSelectionTableMetaBuilderService } from "./services/InvoiceSelectionTableMetaBuilderService";
import { SETTINGS_PROVIDERS } from "../../../../../services/settings/SettingsProviders";
import { InvoiceVMHelper } from "../../../../../services/invoices/view-models/utils/InvoiceVMHelper";
import { EagerCustomersService } from "../../../../../services/customers/EagerCustomersService";
import { HotelOperationsResult } from "../../../../home/pages/home-pages/hotel-operations/operations-modal/services/utils/HotelOperationsResult";
import { HotelOperationsModalService } from "../../../../home/pages/home-pages/hotel-operations/operations-modal/services/HotelOperationsModalService";
import { EagerRoomsService } from "../../../../../services/rooms/EagerRoomsService";

@Component({
    selector: 'invoice-selection-modal',
    templateUrl: '/client/src/pages/internal/containers/common/inventory/modals/invoices/template/invoice-selection-modal.html',
    providers: [EagerRoomsService, InvoiceSelectionTableMetaBuilderService, InvoiceVMHelper, EagerCustomersService,
        SETTINGS_PROVIDERS, InvoiceService]
})
export class InvoiceSelectionModalComponent extends BaseComponent implements ICustomModalComponent, AfterViewInit {
    @ViewChild(LazyLoadingTableComponent)
    private _invoicesTableComponent: LazyLoadingTableComponent<InvoiceVM>;
    private _selectedInvoiceList: InvoiceDO[] = [];

    constructor(private _appContext: AppContext,
        private _modalDialogRef: ModalDialogRef<InvoiceDO[]>,
        private _tableBuilder: InvoiceSelectionTableMetaBuilderService,
        private _invoiceService: InvoiceService,
        private _modalInput: InvoiceSelectionModalInput,
        private _injector: Injector) {
        super();
    }

    ngAfterViewInit() {
        if (this._modalInput.onlyUnpaidInvoices) {
            this._invoiceService.setPaymentStatus(InvoicePaymentStatus.Unpaid);
        }
        if (this._modalInput.excludedInvoiceId) {
            this._invoiceService.excludeInvoiceId(this._modalInput.excludedInvoiceId);
        }
        this.bootstrapInvoicesTable();
    }
    private bootstrapInvoicesTable() {
        var lazyLoadTableMeta: LazyLoadTableMeta = this._tableBuilder.buildLazyLoadTableMeta();
        if (this._modalInput.multiSelection) {
            lazyLoadTableMeta.supportedRowCommandList.push(TableRowCommand.MultipleSelect);
        }
        else {
            lazyLoadTableMeta.supportedRowCommandList.push(TableRowCommand.Select);
        }
        lazyLoadTableMeta.autoSelectRows = true;
        this._invoicesTableComponent.bootstrap(this._invoiceService, lazyLoadTableMeta);
    }

    public closeDialog() {
        this._modalDialogRef.closeForced();
    }
    public isBlocking(): boolean {
        return false;
    }
    public getSize(): ModalSize {
        return ModalSize.Large;
    }

    public didSelectInvoice(InvoiceVM: InvoiceVM) {
        this._selectedInvoiceList = [InvoiceVM.invoice];
    }
    public didSelectInvoiceList(selectedInvoiceList: InvoiceVM[]) {
        this._selectedInvoiceList = _.map(selectedInvoiceList, (invoiceVM: InvoiceVM) => {
            return invoiceVM.invoice;
        });
    }
    public hasSelectedInvoice(): boolean {
        return this._selectedInvoiceList.length > 0;
    }
    public triggerSelectedInvoiceList() {
        if (!this.hasSelectedInvoice()) {
            return;
        }
        this._modalDialogRef.addResult(this._selectedInvoiceList);
        this.closeDialog();
    }
}
