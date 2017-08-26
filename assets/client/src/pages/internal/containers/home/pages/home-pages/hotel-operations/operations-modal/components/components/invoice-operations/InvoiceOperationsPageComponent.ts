import { Component, Input, OnInit } from '@angular/core';
import { HotelInvoiceOperationsPageParam } from "./utils/HotelInvoiceOperationsPageParam";
import { CustomerVM } from "../../../../../../../../../services/customers/view-models/CustomerVM";
import { CustomerDO } from "../../../../../../../../../services/customers/data-objects/CustomerDO";
import { IndividualDetailsDO } from "../../../../../../../../../services/customers/data-objects/customer-details/IndividualDetailsDO";
import { ContactDetailsDO } from "../../../../../../../../../services/customers/data-objects/customer-details/ContactDetailsDO";


@Component({
    selector: 'invoice-operations-page',
    templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/operations-modal/components/components/invoice-operations/template/invoice-operations-page.html',

})
export class InvoiceOperationsPageComponent implements OnInit {

    @Input() invoiceOperationsPageParam: HotelInvoiceOperationsPageParam;

    isLoading: boolean = true;
    invoiceTitle: string = "Invoice Longeeeeeeeeeeeeeeeeeeeeeeeeeeer Title #1";
    isPaid: boolean = true;
    payerList: CustomerVM[];

    ngOnInit(): void {
        this.isLoading = false;
        this.invoiceOperationsPageParam.updateTitle("Invoice Overview", "");
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
    }
}