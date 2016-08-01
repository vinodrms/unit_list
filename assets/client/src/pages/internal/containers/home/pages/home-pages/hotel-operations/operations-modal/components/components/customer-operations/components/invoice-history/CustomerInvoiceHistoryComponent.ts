import {Component, OnInit, Input} from '@angular/core';

import {CustomerOperationsPageData} from '../../services/utils/CustomerOperationsPageData';

@Component({
    selector: 'customer-invoice-history',
    templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/operations-modal/components/components/customer-operations/components/invoice-history/template/customer-invoice-history.html'
})
export class CustomerInvoiceHistoryComponent implements OnInit {
    @Input() customerOperationsPageData: CustomerOperationsPageData;

    constructor() { }

    ngOnInit() {

    }

}