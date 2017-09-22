import _ = require('underscore');
import { Component, Input, OnInit } from '@angular/core';
import { HotelInvoiceOperationsPageParam } from "./utils/HotelInvoiceOperationsPageParam";
import { CustomerVM } from "../../../../../../../../../services/customers/view-models/CustomerVM";
import { CustomerDO } from "../../../../../../../../../services/customers/data-objects/CustomerDO";
import { IndividualDetailsDO } from "../../../../../../../../../services/customers/data-objects/customer-details/IndividualDetailsDO";
import { ContactDetailsDO } from "../../../../../../../../../services/customers/data-objects/customer-details/ContactDetailsDO";
import { HotelOperationsInvoiceService } from "../../../../../../../../../services/hotel-operations/invoice/HotelOperationsInvoiceService";
import { InvoiceDO, InvoiceStatus, InvoicePaymentStatus } from "../../../../../../../../../services/invoices/data-objects/InvoiceDO";
import { ThError, AppContext } from "../../../../../../../../../../../common/utils/AppContext";
import { CustomersDO } from "../../../../../../../../../services/customers/data-objects/CustomersDO";
import { InvoicesDO } from "../../../../../../../../../services/invoices/data-objects/InvoicesDO";
import { InvoiceVM } from "../../../../../../../../../services/invoices/view-models/InvoiceVM";
import { InvoiceVMHelper } from "../../../../../../../../../services/invoices/view-models/utils/InvoiceVMHelper";
import { EagerCustomersService } from "../../../../../../../../../services/customers/EagerCustomersService";
import { HotelAggregatedInfo } from "../../../../../../../../../services/hotel/utils/HotelAggregatedInfo";
import { HotelAggregatorService } from "../../../../../../../../../services/hotel/HotelAggregatorService";
import { InvoiceOperationsPageData } from "./utils/InvoiceOperationsPageData";
import { InvoicePayerDO } from "../../../../../../../../../services/invoices/data-objects/payer/InvoicePayerDO";
import { InvoiceMetaFactory } from "../../../../../../../../../services/invoices/data-objects/InvoiceMetaFactory";
import { HotelOperationsResultService } from "../../../services/HotelOperationsResultService";
import { InvoiceChangedOptions } from "./components/invoice-overview/InvoiceOverviewComponent";
import { PaginationOptions } from "./utils/PaginationOptions";

enum PageType {
    InvoiceOverview,
    RelatedInvoices,
    InvoiceTransfer
}

@Component({
    selector: 'invoice-operations-page',
    templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/operations-modal/components/components/invoice-operations/template/invoice-operations-page.html',
})
export class InvoiceOperationsPageComponent implements OnInit {

    @Input() invoiceOperationsPageParam: HotelInvoiceOperationsPageParam;

    isLoading: boolean = true;
    relatedInvoices: InvoiceVM[] = [];
    currentRelatedInvoiceIndex: number = 0;

    private pageType: PageType;
    private pageData: InvoiceOperationsPageData;
    private invoiceMetaFactory: InvoiceMetaFactory;
    private paginationOptions: PaginationOptions;

    constructor(private context: AppContext,
        private invoiceVMHelper: InvoiceVMHelper,
        private hotelAggregatorService: HotelAggregatorService,
        private customersService: EagerCustomersService,
        private invoiceOperationsService: HotelOperationsInvoiceService,
        private hotelOperationsResultService: HotelOperationsResultService,
    ) {
        this.currentRelatedInvoiceIndex = 0;
        this.relatedInvoices = [];
        this.invoiceMetaFactory = new InvoiceMetaFactory();
        this.paginationOptions = {
            totalNumberOfPages: 0,
            displayPaginator: false
        }
    }

    ngOnInit(): void {
        this.pageType = PageType.InvoiceOverview;
        this.invoiceOperationsPageParam.updateTitle("Invoice Overview", "");
        this.pageData = new InvoiceOperationsPageData();
        this.hotelAggregatorService.getHotelAggregatedInfo().subscribe((hotelInfo: HotelAggregatedInfo) => {
            this.pageData.ccy = hotelInfo.ccy;
            this.pageData.allowedPaymentMethods = hotelInfo.allowedPaymentMethods;
            this.pageData.allPaymentMethods = hotelInfo.allAvailablePaymentMethods;
            if (!this.context.thUtils.isUndefinedOrNull(this.invoiceOperationsPageParam.invoiceId)) {
                this.readExistingInvoice();
            } else {
                this.createNewInvoice();
            }
        }), (err: ThError) => {
            this.context.toaster.error(err.message);
            this.isLoading = false;
        };
        this.context.analytics.logPageView("/operations/invoices");
    }
    private readExistingInvoice() {
        this.invoiceOperationsService.get(this.invoiceOperationsPageParam.invoiceId).flatMap((invoice: InvoiceDO) => {
            return this.invoiceOperationsService.getInvoicesByGroup(invoice.groupId).flatMap((invoices: InvoiceDO[]) => {
                var invoicesDO: InvoicesDO = new InvoicesDO();
                invoicesDO.invoiceList = invoices;
                return this.invoiceVMHelper.convertToViewModels(invoicesDO);
            });
        }).subscribe((invoiceVMList: InvoiceVM[]) => {
            this.relatedInvoices = invoiceVMList;
            this.currentRelatedInvoiceIndex = _.findIndex(this.relatedInvoices, (invoiceVM: InvoiceVM) => {
                return invoiceVM.invoice.id == this.invoiceOperationsPageParam.invoiceId;
            });
            this.updatePaginationOptions();
        }, ((err: ThError) => {
            this.context.toaster.error(err.message);
        }), () => {
            this.isLoading = false;
        });
    }
    private createNewInvoice() {
        this.relatedInvoices = [
            this.createNewInvoiceVM()
        ];
        this.updatePaginationOptions();
        if (this.context.thUtils.isUndefinedOrNull(this.invoiceOperationsPageParam.invoiceFilter.customerId)) {
            this.isLoading = false;
            return;
        }
        this.customersService.getCustomerById(this.invoiceOperationsPageParam.invoiceFilter.customerId)
            .subscribe((customer: CustomerDO) => {
                this.addCustomerToInvoiceVM(this.relatedInvoices[0], customer);
            }, (err: ThError) => {
                this.context.toaster.error(err.message);
            }, () => {
                this.isLoading = false;
            });
    }

    private createNewInvoiceVM(): InvoiceVM {
        var invoiceVM = new InvoiceVM();
        invoiceVM.invoice = new InvoiceDO();
        invoiceVM.invoice.payerList = [];
        invoiceVM.invoice.itemList = [];
        invoiceVM.invoice.indexedBookingIdList = [];
        invoiceVM.invoice.indexedCustomerIdList = [];
        invoiceVM.invoice.paymentStatus = InvoicePaymentStatus.Transient;
        invoiceVM.customerList = [];
        invoiceVM.invoiceMeta = this.invoiceMetaFactory.getInvoiceMetaByPaymentStatus(invoiceVM.invoice.paymentStatus);
        return invoiceVM;
    }
    private updatePaginationOptions() {
        this.paginationOptions = {
            totalNumberOfPages: this.relatedInvoices.length,
            displayPaginator: this.relatedInvoices.length > 1
        }
    }

    private addCustomerToInvoiceVM(invoiceVM: InvoiceVM, customer: CustomerDO) {
        invoiceVM.invoice.payerList[0] = new InvoicePayerDO();
        invoiceVM.invoice.payerList[0].customerId = customer.id;
        invoiceVM.invoice.payerList[0].paymentList = [];
        invoiceVM.addCustomer(customer);
    }

    public shouldShowCurrentInvoice(): boolean {
        return this.pageType == PageType.InvoiceOverview;
    }

    public shouldShowRelatedInvoices(): boolean {
        return this.pageType == PageType.RelatedInvoices;
    }

    public shouldShowInvoiceTransfer(): boolean {
        return this.pageType == PageType.InvoiceTransfer;
    }

    public showInvoiceOverview() {
        this.pageType = PageType.InvoiceOverview;
    }

    public showRelatedInvoices() {
        this.pageType = PageType.RelatedInvoices;
    }

    public showInvoiceTransfer() {
        this.pageType = PageType.InvoiceTransfer;
    }

    public selectRelatedInvoiceIndex(index: number) {
        this.currentRelatedInvoiceIndex = index;
        this.showInvoiceOverview();
    }
    public markInvoiceChanged(options: InvoiceChangedOptions) {
        this.hotelOperationsResultService.markInvoiceChanged(this.relatedInvoices[this.currentRelatedInvoiceIndex]);

        if (!options.reloadInvoiceGroup) {
            return;
        }
        if (!this.context.thUtils.isUndefinedOrNull(options.selectedInvoiceId)) {
            this.invoiceOperationsPageParam.invoiceId = options.selectedInvoiceId;
        }
        if (!this.context.thUtils.isUndefinedOrNull(this.invoiceOperationsPageParam.invoiceId)) {
            this.readExistingInvoice();
        }
    }

    private showPagination(): boolean {
        return this.relatedInvoices.length > 1;
    }
}
