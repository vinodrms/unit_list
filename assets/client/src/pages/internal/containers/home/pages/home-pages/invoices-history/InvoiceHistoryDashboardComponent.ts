import { Component, AfterViewInit, ViewChild, ReflectiveInjector, OnInit } from "@angular/core";
import { AHomeContainerComponent } from "../../utils/AHomeContainerComponent";
import { LazyLoadingTableComponent } from "../../../../../../../common/utils/components/lazy-loading/LazyLoadingTableComponent";
import { InvoiceVM } from "../../../../../services/invoices/view-models/InvoiceVM";
import { HeaderPageService } from "../../utils/header/container/services/HeaderPageService";
import { InvoiceService } from "../../../../../services/invoices/InvoiceService";
import { HotelOperationsModalService } from "../hotel-operations/operations-modal/services/HotelOperationsModalService";
import { HeaderPageType } from "../../utils/header/container/services/HeaderPageType";
import { InvoicesTableMetaBuilderService } from "./services/InvoicesTableMetaBuilderService";
import { InvoiceVMHelper } from "../../../../../services/invoices/view-models/utils/InvoiceVMHelper";
import { EagerCustomersService } from "../../../../../services/customers/EagerCustomersService";
import { ModalDialogRef } from "../../../../../../../common/utils/modals/utils/ModalDialogRef";
import { HotelOperationsResult } from "../hotel-operations/operations-modal/services/utils/HotelOperationsResult";
import { InvoicesDateFilterComponent } from "./components/invoices-date-filter/InvoicesDateFilterComponent";
import { InvoicesDateFilterModule } from "./components/invoices-date-filter/InvoicesDateFilterModule";
import { HotelAggregatedInfo } from "../../../../../services/hotel/utils/HotelAggregatedInfo";
import { HotelAggregatorService } from "../../../../../services/hotel/HotelAggregatorService";
import { CurrencyDO } from "../../../../../services/common/data-objects/currency/CurrencyDO";
import { EagerRoomsService } from "../../../../../services/rooms/EagerRoomsService";

@Component({
    selector: 'invoice-history-dashboard',
    templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/invoices-history/template/invoice-history-dashboard.html',
    providers: [EagerRoomsService, InvoiceService, InvoiceVMHelper, EagerCustomersService, InvoicesTableMetaBuilderService, HotelOperationsModalService]
})
export class InvoiceHistoryDashboardComponent extends AHomeContainerComponent implements AfterViewInit {
    @ViewChild(LazyLoadingTableComponent)
    private _invoicesTableComponent: LazyLoadingTableComponent<InvoiceVM>;
    private _ccy: CurrencyDO;

    isLoading: boolean = true;

    selectedInvoiceVM: InvoiceVM;

    constructor(headerPageService: HeaderPageService,
        private _invoiceService: InvoiceService,
        private _tableBuilder: InvoicesTableMetaBuilderService,
        private _hotelOperationsModalService: HotelOperationsModalService,
        private _hotelAggregatorService: HotelAggregatorService) {
        super(headerPageService, HeaderPageType.InvoiceHistory);
    }

    ngOnInit(): void {
        this._hotelAggregatorService.getHotelAggregatedInfo().subscribe((hotelInfo: HotelAggregatedInfo) => {
            this.ccy = hotelInfo.ccy;
            this.isLoading = false;
        });
    }

    public get ccy(): CurrencyDO {
        return this._ccy;
    }

    public set ccy(ccy: CurrencyDO) {
        this._ccy = ccy;
    }

    public ngAfterViewInit() {
        this._invoicesTableComponent.attachTopTableCenterBootstrapData({
            moduleToInject: InvoicesDateFilterModule,
            componentType: InvoicesDateFilterComponent,
            providers: ReflectiveInjector.resolve([{ provide: InvoiceService, useValue: this._invoiceService }])
        });
        this._invoicesTableComponent.bootstrap(this._invoiceService, this._tableBuilder.buildLazyLoadTableMeta());
    }

    public selectInvoice(invoiceVM: InvoiceVM) {
        this.selectedInvoiceVM = invoiceVM;
    }

    public editInvoice(invoiceVM: InvoiceVM) {
        this._hotelOperationsModalService.openInvoiceOperationsModal(invoiceVM.invoice.id).then((modalDialogRef: ModalDialogRef<HotelOperationsResult>) => {
            modalDialogRef.resultObservable
                .subscribe((result: HotelOperationsResult) => {
                    if (result.didChangeInvoice) {
                        this._invoicesTableComponent.deselectItem();
                        this.selectedInvoiceVM = null;
                        this._invoiceService.refreshData();
                    }
                }, (err: any) => {
                });
        }).catch((err: any) => { });
    }

    public openNewInvoice() {
        this._hotelOperationsModalService.openInvoiceOperationsModal(null).then((modalDialogRef: ModalDialogRef<HotelOperationsResult>) => {
            modalDialogRef.resultObservable
                .subscribe((result: HotelOperationsResult) => {
                    if (result.didChangeInvoice) {
                        this._invoicesTableComponent.deselectItem();
                        this.selectedInvoiceVM = null;
                        this._invoiceService.refreshData();
                    }
                }, (err: any) => {
                });
        }).catch((err: any) => { });
    }
}
