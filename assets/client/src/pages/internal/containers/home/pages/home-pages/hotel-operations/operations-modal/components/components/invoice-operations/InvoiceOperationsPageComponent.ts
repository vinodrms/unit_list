import { Component, Input, OnInit } from '@angular/core';
import { HotelInvoiceOperationsPageParam } from "./utils/HotelInvoiceOperationsPageParam";
import { CustomerVM } from "../../../../../../../../../services/customers/view-models/CustomerVM";
import { CustomerDO } from "../../../../../../../../../services/customers/data-objects/CustomerDO";
import { IndividualDetailsDO } from "../../../../../../../../../services/customers/data-objects/customer-details/IndividualDetailsDO";
import { ContactDetailsDO } from "../../../../../../../../../services/customers/data-objects/customer-details/ContactDetailsDO";
import { InvoicePaymentStatus } from "../../../../../../../../../services/invoices/data-objects/InvoiceDO";


export class InvoiceVMMockup {
    payerList: CustomerVM[] = [];
    invoiceStatus: InvoicePaymentStatus;
    totalAmount: string;
    reference: string;

    public isPaid(): boolean {
        return this.invoiceStatus === InvoicePaymentStatus.Paid;
    }
    public isLossAccepted(): boolean {
        return this.invoiceStatus === InvoicePaymentStatus.LossAcceptedByManagement;
    }
    public isUnpaid(): boolean {
        return this.invoiceStatus === InvoicePaymentStatus.Unpaid;
    }

    public getFirstPayerName(): string {
        return (this.payerList.length > 0 ) ? this.payerList[0].customerNameString : "";
    }
    public getFirstPayerEmail(): string {
        return (this.payerList.length > 0 ) ? this.payerList[0].customer.emailString : "";
    }
}


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
    relatedInvoices: InvoiceVMMockup[] = [];
    currentRelatedInvoiceIndex: number = 0;

    private _pageType: PageType;

    constructor() {
        this.setRelatedInvoices();
        this.currentRelatedInvoiceIndex = 0;
    }


    ngOnInit(): void {
        this.isLoading = false;
        this.invoiceOperationsPageParam.updateTitle("Invoice Overview", "");
        this._pageType = PageType.InvoiceOverview;
    }

    private setRelatedInvoices() {
        this.relatedInvoices = [];
        var individualDetails = new IndividualDetailsDO();
        individualDetails.firstName = "Mr";
        individualDetails.lastName = "Brown";
        individualDetails.contactDetailsList = [];
        individualDetails.contactDetailsList[0] = new ContactDetailsDO();
        individualDetails.contactDetailsList[0].email = "mrbrown@example.com";
        var customerDO = new CustomerDO();
        customerDO.customerDetails = individualDetails;
        var relatedInvoice = new InvoiceVMMockup();
        relatedInvoice.payerList[0] = new CustomerVM();
        relatedInvoice.payerList[0].customer = customerDO;
        relatedInvoice.invoiceStatus = InvoicePaymentStatus.Paid;
        relatedInvoice.totalAmount = "Dkr 24,515";
        relatedInvoice.reference = "#1";
        this.relatedInvoices[0] = relatedInvoice;
        
        var individualDetails = new IndividualDetailsDO();
        individualDetails.firstName = "Mr";
        individualDetails.lastName = "Brown";
        individualDetails.contactDetailsList = [];
        individualDetails.contactDetailsList[0] = new ContactDetailsDO();
        individualDetails.contactDetailsList[0].email = "mrbrown@example.com";
        var customerDO = new CustomerDO();
        customerDO.customerDetails = individualDetails;
        var relatedInvoice = new InvoiceVMMockup();
        relatedInvoice.payerList[0] = new CustomerVM();
        relatedInvoice.payerList[0].customer = customerDO;
        var individualDetails = new IndividualDetailsDO();
        individualDetails.firstName = "Ms";
        individualDetails.lastName = "White";
        individualDetails.contactDetailsList = [];
        individualDetails.contactDetailsList[0] = new ContactDetailsDO();
        individualDetails.contactDetailsList[0].email = "mswhite@example.com";
        var customerDO = new CustomerDO();
        customerDO.customerDetails = individualDetails;
        relatedInvoice.payerList[1] = new CustomerVM();
        relatedInvoice.payerList[1].customer = customerDO;
        relatedInvoice.invoiceStatus = InvoicePaymentStatus.LossAcceptedByManagement;
        relatedInvoice.totalAmount = "Dkr 1,244";
        relatedInvoice.reference = "#2";
        this.relatedInvoices[1] = relatedInvoice;

        var individualDetails = new IndividualDetailsDO();
        individualDetails.firstName = "Mr";
        individualDetails.lastName = "Brown";
        individualDetails.contactDetailsList = [];
        individualDetails.contactDetailsList[0] = new ContactDetailsDO();
        individualDetails.contactDetailsList[0].email = "mrbrown@example.com";
        var customerDO = new CustomerDO();
        customerDO.customerDetails = individualDetails;
        var relatedInvoice = new InvoiceVMMockup();
        relatedInvoice.payerList[0] = new CustomerVM();
        relatedInvoice.payerList[0].customer = customerDO;
        var individualDetails = new IndividualDetailsDO();
        individualDetails.firstName = "Ms";
        individualDetails.lastName = "White";
        individualDetails.contactDetailsList = [];
        individualDetails.contactDetailsList[0] = new ContactDetailsDO();
        individualDetails.contactDetailsList[0].email = "mswhite@example.com";
        var customerDO = new CustomerDO();
        customerDO.customerDetails = individualDetails;
        relatedInvoice.payerList[1] = new CustomerVM();
        relatedInvoice.payerList[1].customer = customerDO;
        relatedInvoice.invoiceStatus = InvoicePaymentStatus.Unpaid;
        relatedInvoice.totalAmount = "Dkr 1,244";
        relatedInvoice.reference = "#3";
        this.relatedInvoices[2] = relatedInvoice;

        var individualDetails = new IndividualDetailsDO();
        individualDetails.firstName = "Mr";
        individualDetails.lastName = "Brownish";
        individualDetails.contactDetailsList = [];
        individualDetails.contactDetailsList[0] = new ContactDetailsDO();
        individualDetails.contactDetailsList[0].email = "mrbrown@example.com";
        var customerDO = new CustomerDO();
        customerDO.customerDetails = individualDetails;
        var relatedInvoice = new InvoiceVMMockup();
        relatedInvoice.payerList[0] = new CustomerVM();
        relatedInvoice.payerList[0].customer = customerDO;
        var individualDetails = new IndividualDetailsDO();
        individualDetails.firstName = "Ms";
        individualDetails.lastName = "White";
        individualDetails.contactDetailsList = [];
        individualDetails.contactDetailsList[0] = new ContactDetailsDO();
        individualDetails.contactDetailsList[0].email = "mswhite@example.com";
        var customerDO = new CustomerDO();
        customerDO.customerDetails = individualDetails;
        relatedInvoice.payerList[1] = new CustomerVM();
        relatedInvoice.payerList[1].customer = customerDO;
        relatedInvoice.invoiceStatus = InvoicePaymentStatus.Unpaid;
        relatedInvoice.totalAmount = "Dkr 1,244";
        relatedInvoice.reference = "#4";
        this.relatedInvoices[3] = relatedInvoice;

        var individualDetails = new IndividualDetailsDO();
        individualDetails.firstName = "Mr";
        individualDetails.lastName = "Brown";
        individualDetails.contactDetailsList = [];
        individualDetails.contactDetailsList[0] = new ContactDetailsDO();
        individualDetails.contactDetailsList[0].email = "mrbrown@example.com";
        var customerDO = new CustomerDO();
        customerDO.customerDetails = individualDetails;
        var relatedInvoice = new InvoiceVMMockup();
        relatedInvoice.payerList[0] = new CustomerVM();
        relatedInvoice.payerList[0].customer = customerDO;
        var individualDetails = new IndividualDetailsDO();
        individualDetails.firstName = "Ms";
        individualDetails.lastName = "White";
        individualDetails.contactDetailsList = [];
        individualDetails.contactDetailsList[0] = new ContactDetailsDO();
        individualDetails.contactDetailsList[0].email = "mswhite@example.com";
        var customerDO = new CustomerDO();
        customerDO.customerDetails = individualDetails;
        relatedInvoice.payerList[1] = new CustomerVM();
        relatedInvoice.payerList[1].customer = customerDO;
        relatedInvoice.invoiceStatus = InvoicePaymentStatus.Unpaid;
        relatedInvoice.totalAmount = "Dkr 1,244";
        relatedInvoice.reference = "#5";
        this.relatedInvoices[4] = relatedInvoice;

        var individualDetails = new IndividualDetailsDO();
        individualDetails.firstName = "Mr";
        individualDetails.lastName = "Brown";
        individualDetails.contactDetailsList = [];
        individualDetails.contactDetailsList[0] = new ContactDetailsDO();
        individualDetails.contactDetailsList[0].email = "mrbrown@example.com";
        var customerDO = new CustomerDO();
        customerDO.customerDetails = individualDetails;
        var relatedInvoice = new InvoiceVMMockup();
        relatedInvoice.payerList[0] = new CustomerVM();
        relatedInvoice.payerList[0].customer = customerDO;
        var individualDetails = new IndividualDetailsDO();
        individualDetails.firstName = "Ms";
        individualDetails.lastName = "White";
        individualDetails.contactDetailsList = [];
        individualDetails.contactDetailsList[0] = new ContactDetailsDO();
        individualDetails.contactDetailsList[0].email = "mswhite@example.com";
        var customerDO = new CustomerDO();
        customerDO.customerDetails = individualDetails;
        relatedInvoice.payerList[1] = new CustomerVM();
        relatedInvoice.payerList[1].customer = customerDO;
        relatedInvoice.invoiceStatus = InvoicePaymentStatus.Unpaid;
        relatedInvoice.totalAmount = "Dkr 1,244";
        relatedInvoice.reference = "#6";
        this.relatedInvoices[5] = relatedInvoice;

        var individualDetails = new IndividualDetailsDO();
        individualDetails.firstName = "Mr";
        individualDetails.lastName = "Brown";
        individualDetails.contactDetailsList = [];
        individualDetails.contactDetailsList[0] = new ContactDetailsDO();
        individualDetails.contactDetailsList[0].email = "mrbrown@example.com";
        var customerDO = new CustomerDO();
        customerDO.customerDetails = individualDetails;
        var relatedInvoice = new InvoiceVMMockup();
        relatedInvoice.payerList[0] = new CustomerVM();
        relatedInvoice.payerList[0].customer = customerDO;
        var individualDetails = new IndividualDetailsDO();
        individualDetails.firstName = "Ms";
        individualDetails.lastName = "White";
        individualDetails.contactDetailsList = [];
        individualDetails.contactDetailsList[0] = new ContactDetailsDO();
        individualDetails.contactDetailsList[0].email = "mswhite@example.com";
        var customerDO = new CustomerDO();
        customerDO.customerDetails = individualDetails;
        relatedInvoice.payerList[1] = new CustomerVM();
        relatedInvoice.payerList[1].customer = customerDO;
        relatedInvoice.invoiceStatus = InvoicePaymentStatus.Unpaid;
        relatedInvoice.totalAmount = "Dkr 1,244";
        relatedInvoice.reference = "#7";
        this.relatedInvoices[6] = relatedInvoice;

        var individualDetails = new IndividualDetailsDO();
        individualDetails.firstName = "Mr";
        individualDetails.lastName = "Brown";
        individualDetails.contactDetailsList = [];
        individualDetails.contactDetailsList[0] = new ContactDetailsDO();
        individualDetails.contactDetailsList[0].email = "mrbrown@example.com";
        var customerDO = new CustomerDO();
        customerDO.customerDetails = individualDetails;
        var relatedInvoice = new InvoiceVMMockup();
        relatedInvoice.payerList[0] = new CustomerVM();
        relatedInvoice.payerList[0].customer = customerDO;
        var individualDetails = new IndividualDetailsDO();
        individualDetails.firstName = "Ms";
        individualDetails.lastName = "White";
        individualDetails.contactDetailsList = [];
        individualDetails.contactDetailsList[0] = new ContactDetailsDO();
        individualDetails.contactDetailsList[0].email = "mswhite@example.com";
        var customerDO = new CustomerDO();
        customerDO.customerDetails = individualDetails;
        relatedInvoice.payerList[1] = new CustomerVM();
        relatedInvoice.payerList[1].customer = customerDO;
        relatedInvoice.invoiceStatus = InvoicePaymentStatus.Unpaid;
        relatedInvoice.totalAmount = "Dkr 1,244";
        relatedInvoice.reference = "#8";
        this.relatedInvoices[7] = relatedInvoice;

        var individualDetails = new IndividualDetailsDO();
        individualDetails.firstName = "Mr";
        individualDetails.lastName = "Brown";
        individualDetails.contactDetailsList = [];
        individualDetails.contactDetailsList[0] = new ContactDetailsDO();
        individualDetails.contactDetailsList[0].email = "mrbrown@example.com";
        var customerDO = new CustomerDO();
        customerDO.customerDetails = individualDetails;
        var relatedInvoice = new InvoiceVMMockup();
        relatedInvoice.payerList[0] = new CustomerVM();
        relatedInvoice.payerList[0].customer = customerDO;
        var individualDetails = new IndividualDetailsDO();
        individualDetails.firstName = "Ms";
        individualDetails.lastName = "White";
        individualDetails.contactDetailsList = [];
        individualDetails.contactDetailsList[0] = new ContactDetailsDO();
        individualDetails.contactDetailsList[0].email = "mswhite@example.com";
        var customerDO = new CustomerDO();
        customerDO.customerDetails = individualDetails;
        relatedInvoice.payerList[1] = new CustomerVM();
        relatedInvoice.payerList[1].customer = customerDO;
        relatedInvoice.invoiceStatus = InvoicePaymentStatus.Unpaid;
        relatedInvoice.totalAmount = "Dkr 1,244";
        relatedInvoice.reference = "#9";
        this.relatedInvoices[8] = relatedInvoice;
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