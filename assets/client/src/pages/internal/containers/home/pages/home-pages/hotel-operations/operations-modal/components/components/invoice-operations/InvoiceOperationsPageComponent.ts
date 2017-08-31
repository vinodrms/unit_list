import { Component, Input, OnInit } from '@angular/core';
import { HotelInvoiceOperationsPageParam } from "./utils/HotelInvoiceOperationsPageParam";
import { CustomerVM } from "../../../../../../../../../services/customers/view-models/CustomerVM";
import { CustomerDO } from "../../../../../../../../../services/customers/data-objects/CustomerDO";
import { IndividualDetailsDO } from "../../../../../../../../../services/customers/data-objects/customer-details/IndividualDetailsDO";
import { ContactDetailsDO } from "../../../../../../../../../services/customers/data-objects/customer-details/ContactDetailsDO";
import { InvoicePaymentStatus } from "../../../../../../../../../services/invoices-deprecated/data-objects/InvoiceDO";

import _  = require('underscore');

class InvoiceVMMockup {
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
}

@Component({
    selector: 'invoice-operations-page',
    templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/operations-modal/components/components/invoice-operations/template/invoice-operations-page.html',

})
export class InvoiceOperationsPageComponent implements OnInit {

    @Input() invoiceOperationsPageParam: HotelInvoiceOperationsPageParam;

    isLoading: boolean = true;
    showRelatedInvoices: boolean = false;
    relatedInvoices: InvoiceVMMockup[] = [];
    currentRelatedInvoiceIndex: number = 0;


    ngOnInit(): void {
        this.isLoading = false;
        this.invoiceOperationsPageParam.updateTitle("Invoice Overview", "");
        /*
        this.payerList = [];
        var individualDetails = new IndividualDetailsDO();
        individualDetails.firstName = "Mister";
        individualDetails.lastName = "Brown";
        individualDetails.contactDetailsList = [];
        individualDetails.contactDetailsList[0] = new ContactDetailsDO();
        individualDetails.contactDetailsList[0].email = "misterbrown@example.com";
        var customerDO = new CustomerDO();
        customerDO.customerDetails = individualDetails;
        this.payerList[0] = new CustomerVM();
        this.payerList[0].customer = customerDO;
        var individualDetails = new IndividualDetailsDO();
        individualDetails.firstName = "Ms";
        individualDetails.lastName = "White";
        individualDetails.contactDetailsList = [];
        individualDetails.contactDetailsList[0] = new ContactDetailsDO();
        individualDetails.contactDetailsList[0].email = "mswhite@example.com";
        var customerDO = new CustomerDO();
        customerDO.customerDetails = individualDetails;
        this.payerList[1] = new CustomerVM();
        this.payerList[1].customer = customerDO;
        var individualDetails = new IndividualDetailsDO();
        individualDetails.firstName = "Ms";
        individualDetails.lastName = "LongNaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaame";
        individualDetails.contactDetailsList = [];
        individualDetails.contactDetailsList[0] = new ContactDetailsDO();
        individualDetails.contactDetailsList[0].email = "msLongNaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaame@example.com";
        var customerDO = new CustomerDO();
        customerDO.customerDetails = individualDetails;
        this.payerList[2] = new CustomerVM();
        this.payerList[2].customer = customerDO;
        var individualDetails = new IndividualDetailsDO();
        individualDetails.firstName = "Ms";
        individualDetails.lastName = "LongNaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaame";
        individualDetails.contactDetailsList = [];
        individualDetails.contactDetailsList[0] = new ContactDetailsDO();
        individualDetails.contactDetailsList[0].email = "msLongNaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaame@example.com";
        var customerDO = new CustomerDO();
        customerDO.customerDetails = individualDetails;
        this.payerList[3] = new CustomerVM();
        this.payerList[3].customer = customerDO;
        var individualDetails = new IndividualDetailsDO();
        individualDetails.firstName = "Ms";
        individualDetails.lastName = "LongNaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaame";
        individualDetails.contactDetailsList = [];
        individualDetails.contactDetailsList[0] = new ContactDetailsDO();
        individualDetails.contactDetailsList[0].email = "msLongNaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaame@example.com";
        var customerDO = new CustomerDO();
        customerDO.customerDetails = individualDetails;
        this.payerList[4] = new CustomerVM();
        this.payerList[4].customer = customerDO;
        */
        this.setRelatedInvoices();
        this.currentRelatedInvoiceIndex = 0;

    }

    public get currentInvoice(): InvoiceVMMockup {
        return this.relatedInvoices[this.currentRelatedInvoiceIndex];
    }

    public get payerList(): CustomerVM[] {
        return this.currentInvoice.payerList;
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

    public getPayerListString(invoice: InvoiceVMMockup): string {
        var payerListString: string = "";
        _.forEach(invoice.payerList, (customer: CustomerVM, index: number) => {
            payerListString += customer.customerNameString;
            if (index < invoice.payerList.length - 1) {
                payerListString += ", ";
            }
        });
        return payerListString;
    }

    public moveToNextRelatedInvoice() {
        if (this.currentRelatedInvoiceIndex < this.relatedInvoices.length - 1) {
            this.currentRelatedInvoiceIndex++;
        } else {
            this.currentRelatedInvoiceIndex = 0;
        }
    }

    public moveToPreviousRelatedInvoice() {
        if (this.currentRelatedInvoiceIndex > 0) {
            this.currentRelatedInvoiceIndex--;
        } else {
            this.currentRelatedInvoiceIndex = this.relatedInvoices.length - 1;
        }
    }

    public selectRelatedInvoiceIndex(index: number) {
        this.currentRelatedInvoiceIndex = index;
        this.showRelatedInvoices = false;
    }
}
