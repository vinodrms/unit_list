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

import _ = require('underscore');


enum PageType {
    InvoiceOverview,
    RelatedInvoices,
    InvoiceTransfer
}

@Component({
    selector: 'invoice-operations-page',
    templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/operations-modal/components/components/invoice-operations/template/invoice-operations-page.html',
    providers: [InvoiceVMHelper, HotelOperationsInvoiceService]

})
export class InvoiceOperationsPageComponent implements OnInit {

    @Input() invoiceOperationsPageParam: HotelInvoiceOperationsPageParam;

    isLoading: boolean = true;
    relatedInvoices: InvoiceVM[] = [];
    currentRelatedInvoiceIndex: number = 0;

    private _pageType: PageType;
    private _pageData: InvoiceOperationsPageData;
    private _invoiceMetaFactory: InvoiceMetaFactory;


    constructor(private _appContext: AppContext, private _invoiceVMHelper: InvoiceVMHelper, private _hotelAggregatorService: HotelAggregatorService, private _customersService: EagerCustomersService, private _invoiceOperationsService: HotelOperationsInvoiceService) {
        this.currentRelatedInvoiceIndex = 0;
        this.relatedInvoices = [];
        this._invoiceMetaFactory = new InvoiceMetaFactory();
    }


    ngOnInit(): void {
        this._pageType = PageType.InvoiceOverview;
        this.invoiceOperationsPageParam.updateTitle("Invoice Overview", "");
        this._pageData = new InvoiceOperationsPageData();
        this._hotelAggregatorService.getHotelAggregatedInfo().subscribe((hotelInfo: HotelAggregatedInfo) => {
            this._pageData.ccy = hotelInfo.ccy;
            this._pageData.allowedPaymentMethods = hotelInfo.allowedPaymentMethods;
            this._pageData.allPaymentMethods = hotelInfo.allAvailablePaymentMethods;
            if (this.invoiceOperationsPageParam.invoiceId) {
                this._invoiceOperationsService.get(this.invoiceOperationsPageParam.invoiceId).flatMap((invoice: InvoiceDO) => {
                    return this._invoiceOperationsService.getInvoicesByGroup(invoice.groupId).flatMap((invoices: InvoiceDO[]) => {
                        var invoicesDO: InvoicesDO = new InvoicesDO();
                        invoicesDO.invoiceList = invoices;
                        return this._invoiceVMHelper.convertToViewModels(invoicesDO);
                    });
                }).subscribe((invoiceVMList: InvoiceVM[]) =>{
                    this.relatedInvoices = invoiceVMList;
                    this.currentRelatedInvoiceIndex = _.findIndex(this.relatedInvoices, (invoiceVM: InvoiceVM) => {
                        return invoiceVM.invoice.id == this.invoiceOperationsPageParam.invoiceId;
                    });
                    this.isLoading = false;
                }), ((err: ThError) => {
                    this._appContext.toaster.error(err.message);
                    this.isLoading = false;
                });
            } else {
                this.relatedInvoices[0] = this.createNewInvoiceVM();
                if (this.invoiceOperationsPageParam.invoiceFilter.customerId) {
                    this._customersService.getCustomerById(this.invoiceOperationsPageParam.invoiceFilter.customerId).subscribe((customer: CustomerDO) => {
                        this.addCustomerToInvoiceVM(this.relatedInvoices[0], customer);
                        this.isLoading = false;
                    }, (err: ThError) => {
                        this._appContext.toaster.error(err.message);
                        this.isLoading = false;
                    });
                }
            }
        }), (err: ThError) => {
            this._appContext.toaster.error(err.message);
            this.isLoading = false;
        };
    }

    private createNewInvoiceVM(): InvoiceVM {
        var invoiceVM = new InvoiceVM();
        invoiceVM.invoice = new InvoiceDO();
        invoiceVM.invoice.payerList = [];
        invoiceVM.invoice.itemList = [];
        invoiceVM.invoice.paymentStatus = InvoicePaymentStatus.Unpaid;
        invoiceVM.customerList = [];
        invoiceVM.invoiceMeta = this._invoiceMetaFactory.getInvoiceMetaByPaymentStatus(invoiceVM.invoice.paymentStatus);
        return invoiceVM;
    }

    private addCustomerToInvoiceVM(invoiceVM: InvoiceVM, customer: CustomerDO) {
        invoiceVM.invoice.payerList[0] = new InvoicePayerDO();
        invoiceVM.invoice.payerList[0].customerId = customer.id;
        invoiceVM.invoice.payerList[0].paymentList = [];
        invoiceVM.addCustomer(customer);
    }

    public get pageData(): InvoiceOperationsPageData {
        return this._pageData;
    }

    public shouldShowCurrentInvoice(): boolean {
        return this._pageType == PageType.InvoiceOverview;
    }

    public shouldShowRelatedInvoices(): boolean {
        return this._pageType == PageType.RelatedInvoices;
    }

    public shouldShowInvoiceTransfer(): boolean {
        return this._pageType == PageType.InvoiceTransfer;
    }

    public showInvoiceOverview() {
        this._pageType = PageType.InvoiceOverview;
    }

    public showRelatedInvoices() {
        this._pageType = PageType.RelatedInvoices;
    }

    public showInvoiceTransfer() {
        this._pageType = PageType.InvoiceTransfer;
    }

    public selectRelatedInvoiceIndex(index: number) {
        this.currentRelatedInvoiceIndex = index;
        this.showInvoiceOverview();
    }
}
